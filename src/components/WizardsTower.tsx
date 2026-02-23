import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.background = new THREE.Color('#0e0e2a')
    scene.fog = new THREE.Fog('#0e0e2a', 15, 50)
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function TowerSection({
  y,
  radius,
  height,
  color,
}: {
  y: number
  radius: number
  height: number
  color: string
}) {
  return (
    <group>
      <mesh position={[0, y + height / 2, 0]}>
        <cylinderGeometry args={[radius * 0.9, radius, height, 12]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Stone ring at base */}
      <mesh position={[0, y + 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius + 0.02, 0.06, 6, 16]} />
        <meshStandardMaterial color="#555566" roughness={0.9} />
      </mesh>
    </group>
  )
}

function TowerRoof({ y, radius }: { y: number; radius: number }) {
  return (
    <group>
      <mesh position={[0, y + 0.8, 0]}>
        <coneGeometry args={[radius + 0.2, 1.6, 12]} />
        <meshStandardMaterial color="#2a1a4a" roughness={0.7} />
      </mesh>
      {/* Spire */}
      <mesh position={[0, y + 1.8, 0]}>
        <coneGeometry args={[0.05, 0.6, 6]} />
        <meshStandardMaterial color="#daa520" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Orb on top */}
      <mesh position={[0, y + 2.15, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial
          color="#aa88ff"
          emissive="#8866dd"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  )
}

function GlowingWindow({
  position,
  angle,
  radius,
}: {
  position: [number, number, number]
  angle: number
  radius: number
}) {
  const x = position[0] + Math.sin(angle) * radius
  const z = position[2] + Math.cos(angle) * radius
  return (
    <mesh position={[x, position[1], z]} rotation={[0, angle, 0]}>
      <boxGeometry args={[0.15, 0.25, 0.05]} />
      <meshStandardMaterial
        color="#ffcc44"
        emissive="#ffaa22"
        emissiveIntensity={1.5}
      />
    </mesh>
  )
}

function SpiralStaircase({
  baseY,
  topY,
  radius,
}: {
  baseY: number
  topY: number
  radius: number
}) {
  const steps = useMemo(() => {
    const arr: { y: number; angle: number }[] = []
    const count = 30
    for (let i = 0; i < count; i++) {
      const t = i / count
      arr.push({
        y: baseY + t * (topY - baseY),
        angle: t * Math.PI * 4,
      })
    }
    return arr
  }, [baseY, topY, radius])

  return (
    <group>
      {/* Central pole */}
      <mesh position={[0, (baseY + topY) / 2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, topY - baseY, 6]} />
        <meshStandardMaterial color="#5a4a3a" metalness={0.4} />
      </mesh>
      {steps.map((step, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(step.angle) * (radius + 0.15),
            step.y,
            Math.cos(step.angle) * (radius + 0.15),
          ]}
          rotation={[0, step.angle, 0]}
        >
          <boxGeometry args={[0.3, 0.04, 0.12]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function MagicalOrb({
  angle,
  radius,
  height,
  speed,
  color,
}: {
  angle: number
  radius: number
  height: number
  speed: number
  color: string
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.x = Math.sin(t * speed + angle) * radius
    ref.current.position.z = Math.cos(t * speed + angle) * radius
    ref.current.position.y = height + Math.sin(t * speed * 1.5 + angle) * 0.5
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.12, 12, 12]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={3}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

function Tower() {
  const sections = [
    { y: 0, radius: 1.0, height: 2, color: '#4a3a5a' },
    { y: 2, radius: 0.9, height: 2, color: '#4e3e5e' },
    { y: 4, radius: 0.8, height: 2, color: '#524262' },
    { y: 6, radius: 0.7, height: 2, color: '#564666' },
    { y: 8, radius: 0.65, height: 1.5, color: '#5a4a6a' },
  ]

  const windows = useMemo(() => {
    const arr: { y: number; angle: number; radius: number }[] = []
    for (let s = 0; s < sections.length; s++) {
      const sec = sections[s]
      const count = 3
      for (let i = 0; i < count; i++) {
        arr.push({
          y: sec.y + sec.height * 0.5,
          angle: (i / count) * Math.PI * 2 + s * 0.5,
          radius: sec.radius * 0.9 + 0.01,
        })
      }
    }
    return arr
  }, [])

  return (
    <group>
      {sections.map((s, i) => (
        <TowerSection
          key={i}
          y={s.y}
          radius={s.radius}
          height={s.height}
          color={s.color}
        />
      ))}
      <TowerRoof y={9.5} radius={0.65} />
      {windows.map((w, i) => (
        <GlowingWindow
          key={i}
          position={[0, w.y, 0]}
          angle={w.angle}
          radius={w.radius}
        />
      ))}
      <SpiralStaircase baseY={0} topY={9.5} radius={1.05} />
    </group>
  )
}

function EnchantedGarden() {
  const bushes = useMemo(() => {
    const arr: [number, number, number][] = []
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const r = 2 + Math.random() * 1.5
      arr.push([Math.sin(angle) * r, 0.15, Math.cos(angle) * r])
    }
    return arr
  }, [])

  return (
    <group>
      {bushes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.2 + Math.random() * 0.15, 8, 8]} />
          <meshStandardMaterial
            color={
              i % 3 === 0 ? '#2d5a2d' : i % 3 === 1 ? '#3a6a3a' : '#1e4a1e'
            }
          />
        </mesh>
      ))}
      {/* Glowing flowers */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2 + 0.3
        const r = 2.5 + Math.random()
        return (
          <mesh
            key={`flower-${i}`}
            position={[Math.sin(angle) * r, 0.25, Math.cos(angle) * r]}
          >
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial
              color={['#ff66aa', '#aa66ff', '#66aaff'][i % 3]}
              emissive={['#ff66aa', '#aa66ff', '#66aaff'][i % 3]}
              emissiveIntensity={1}
            />
          </mesh>
        )
      })}
    </group>
  )
}

const STAR_COUNT = 400
const starDummy = new THREE.Object3D()

function Stars() {
  const ref = useRef<THREE.InstancedMesh>(null!)

  useEffect(() => {
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.5
      const r = 40 + Math.random() * 20
      starDummy.position.set(
        Math.cos(theta) * Math.sin(phi) * r,
        15 + Math.cos(phi) * r,
        Math.sin(theta) * Math.sin(phi) * r,
      )
      starDummy.scale.setScalar(0.02 + Math.random() * 0.05)
      starDummy.updateMatrix()
      ref.current.setMatrixAt(i, starDummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, STAR_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <circleGeometry args={[20, 32]} />
      <meshStandardMaterial color="#1a2a1a" roughness={0.95} />
    </mesh>
  )
}

export default function WizardsTower() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[3, 12, 5]} intensity={0.5} color="#8888cc" />
      <ambientLight intensity={0.1} />
      <pointLight
        position={[0, 5, 0]}
        intensity={0.5}
        color="#aa88ff"
        distance={15}
      />
      <pointLight
        position={[0, 10, 0]}
        intensity={0.3}
        color="#ffaa44"
        distance={8}
      />

      <Ground />
      <Stars />
      <Tower />
      <EnchantedGarden />

      {/* Floating magical orbs */}
      <MagicalOrb
        angle={0}
        radius={2.5}
        height={6}
        speed={0.6}
        color="#aa66ff"
      />
      <MagicalOrb
        angle={Math.PI * 0.66}
        radius={3}
        height={8}
        speed={0.4}
        color="#66aaff"
      />
      <MagicalOrb
        angle={Math.PI * 1.33}
        radius={2}
        height={4}
        speed={0.8}
        color="#ff66aa"
      />
      <MagicalOrb
        angle={Math.PI * 0.5}
        radius={1.8}
        height={10}
        speed={0.5}
        color="#66ffaa"
      />
      <MagicalOrb
        angle={Math.PI}
        radius={3.5}
        height={3}
        speed={0.35}
        color="#ffdd66"
      />
    </>
  )
}
