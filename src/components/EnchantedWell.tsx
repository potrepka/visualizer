import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.background = new THREE.Color('#0a1a0a')
    scene.fog = new THREE.Fog('#0a1a0a', 8, 30)
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function WellStructure() {
  return (
    <group>
      {/* Stone ring base */}
      <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.35, 8, 24]} />
        <meshStandardMaterial color="#6a6a6a" roughness={0.9} />
      </mesh>
      {/* Inner wall */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.8, 24, 1, true]} />
        <meshStandardMaterial
          color="#555555"
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Support posts */}
      {[0, Math.PI].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.sin(angle) * 0.7, 1.2, Math.cos(angle) * 0.7]}
        >
          <cylinderGeometry args={[0.06, 0.06, 1.8, 6]} />
          <meshStandardMaterial color="#4a3a2a" roughness={0.8} />
        </mesh>
      ))}
      {/* Cross beam */}
      <mesh position={[0, 2.1, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 1.6, 6]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.8} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[1.0, 0.7, 6]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.85} />
      </mesh>
      {/* Rope */}
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 1.2, 4]} />
        <meshStandardMaterial color="#8a7a5a" roughness={0.9} />
      </mesh>
      {/* Bucket */}
      <mesh position={[0, 0.85, 0]}>
        <cylinderGeometry args={[0.1, 0.08, 0.15, 8]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
      </mesh>
    </group>
  )
}

function GlowingWater() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 1.5 + Math.sin(t * 2) * 0.5
  })

  return (
    <group>
      <mesh ref={ref} position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.58, 24]} />
        <meshStandardMaterial
          color="#22ddaa"
          emissive="#22ddaa"
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      <pointLight
        position={[0, 0.5, 0]}
        color="#22ddaa"
        intensity={2}
        distance={6}
      />
    </group>
  )
}

function FloatingRune({
  angle,
  radius,
  height,
  color,
  speed,
}: {
  angle: number
  radius: number
  height: number
  color: string
  speed: number
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.x = Math.sin(t * speed + angle) * radius
    ref.current.position.z = Math.cos(t * speed + angle) * radius
    ref.current.position.y = height + Math.sin(t * speed * 1.3 + angle) * 0.3
    ref.current.rotation.x = t * 1.5
    ref.current.rotation.y = t * 2
    ref.current.rotation.z = t
  })

  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[0.08, 0]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={4}
      />
    </mesh>
  )
}

const FIREFLY_COUNT = 40
const fireflyDummy = new THREE.Object3D()

function Fireflies() {
  const ref = useRef<THREE.InstancedMesh>(null!)

  const data = useMemo(
    () =>
      Array.from({ length: FIREFLY_COUNT }).map(() => ({
        x: (Math.random() - 0.5) * 12,
        y: 0.5 + Math.random() * 3,
        z: (Math.random() - 0.5) * 12,
        speed: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        radius: 0.3 + Math.random() * 0.5,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < FIREFLY_COUNT; i++) {
      const d = data[i]
      fireflyDummy.position.set(
        d.x + Math.sin(t * d.speed + d.phase) * d.radius,
        d.y + Math.sin(t * d.speed * 1.3 + d.phase) * 0.5,
        d.z + Math.cos(t * d.speed + d.phase) * d.radius,
      )
      const brightness = 0.5 + Math.sin(t * 3 + d.phase) * 0.5
      fireflyDummy.scale.setScalar(0.015 + brightness * 0.015)
      fireflyDummy.updateMatrix()
      ref.current.setMatrixAt(i, fireflyDummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, FIREFLY_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#aaff66"
        emissive="#88ee44"
        emissiveIntensity={3}
      />
    </instancedMesh>
  )
}

function ForestTree({
  position,
  height = 4,
}: {
  position: [number, number, number]
  height?: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.1, 0.18, height, 8]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.9} />
      </mesh>
      <mesh position={[0, height + 0.5, 0]}>
        <sphereGeometry args={[1.0, 8, 8]} />
        <meshStandardMaterial color="#1a3a1a" roughness={0.8} />
      </mesh>
      <mesh position={[0.3, height + 0.2, 0.3]}>
        <sphereGeometry args={[0.7, 8, 8]} />
        <meshStandardMaterial color="#224422" roughness={0.8} />
      </mesh>
    </group>
  )
}

function Mushrooms() {
  const shrooms = useMemo(
    () =>
      Array.from({ length: 12 }).map(() => ({
        pos: [(Math.random() - 0.5) * 8, 0, (Math.random() - 0.5) * 8] as [
          number,
          number,
          number,
        ],
        scale: 0.3 + Math.random() * 0.5,
        capColor: Math.random() > 0.5 ? '#aa3344' : '#884422',
      })),
    [],
  )

  return (
    <>
      {shrooms.map((m, i) => (
        <group key={i} position={m.pos} scale={m.scale}>
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.04, 0.05, 0.2, 6]} />
            <meshStandardMaterial color="#e8d8c0" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry
              args={[0.12, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshStandardMaterial color={m.capColor} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </>
  )
}

function Stones() {
  const stones = useMemo(
    () =>
      Array.from({ length: 8 }).map(() => ({
        pos: [
          (Math.random() - 0.5) * 6,
          0.05 + Math.random() * 0.1,
          (Math.random() - 0.5) * 6,
        ] as [number, number, number],
        scale: [
          0.15 + Math.random() * 0.25,
          0.08 + Math.random() * 0.12,
          0.15 + Math.random() * 0.2,
        ] as [number, number, number],
      })),
    [],
  )

  return (
    <>
      {stones.map((s, i) => (
        <mesh key={i} position={s.pos} scale={s.scale}>
          <sphereGeometry args={[1, 6, 6]} />
          <meshStandardMaterial color="#5a5a5a" roughness={0.95} />
        </mesh>
      ))}
    </>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <circleGeometry args={[15, 32]} />
      <meshStandardMaterial color="#1e3e1e" roughness={0.95} />
    </mesh>
  )
}

export default function EnchantedWell() {
  const runeColors = [
    '#44ddff',
    '#ff44dd',
    '#ddff44',
    '#44ffaa',
    '#ff8844',
    '#aa44ff',
  ]

  return (
    <>
      <SceneSetup />
      <directionalLight position={[3, 8, 4]} intensity={0.3} color="#8899aa" />
      <ambientLight intensity={0.06} />

      <Ground />
      <WellStructure />
      <GlowingWater />

      {runeColors.map((color, i) => (
        <FloatingRune
          key={i}
          angle={(i / runeColors.length) * Math.PI * 2}
          radius={1.2 + i * 0.15}
          height={1.0 + i * 0.3}
          color={color}
          speed={0.4 + i * 0.1}
        />
      ))}

      <Fireflies />

      <ForestTree position={[-4, 0, -3]} height={5} />
      <ForestTree position={[3.5, 0, -4]} height={4} />
      <ForestTree position={[-3, 0, 4]} height={6} />
      <ForestTree position={[5, 0, 2]} height={4.5} />
      <ForestTree position={[-5.5, 0, 0]} height={5.5} />
      <ForestTree position={[4, 0, -1]} height={3.5} />

      <Mushrooms />
      <Stones />
    </>
  )
}
