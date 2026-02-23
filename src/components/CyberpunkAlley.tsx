import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#0a0a12', 5, 25)
    scene.background = new THREE.Color('#0a0a12')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Building({
  position,
  width,
  height,
  depth,
  color,
}: {
  position: [number, number, number]
  width: number
  height: number
  depth: number
  color: string
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.8} />
      </mesh>
      {/* Windows */}
      {Array.from({ length: Math.floor(height / 1.5) }).map((_, row) =>
        Array.from({ length: Math.floor(width / 1.2) }).map((_, col) => {
          const lit = Math.random() > 0.4
          return (
            <mesh
              key={`${row}-${col}`}
              position={[
                -width / 2 + 0.8 + col * 1.2,
                1 + row * 1.5,
                depth / 2 + 0.01,
              ]}
            >
              <planeGeometry args={[0.6, 0.8]} />
              <meshStandardMaterial
                color={lit ? '#ffddaa' : '#111122'}
                emissive={lit ? '#886633' : '#000000'}
                emissiveIntensity={lit ? 0.8 : 0}
              />
            </mesh>
          )
        }),
      )}
    </group>
  )
}

function NeonSign({
  position,
  rotation,
  color,
  width,
  height,
  text,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  color: string
  width: number
  height: number
  text?: string
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    const flicker = Math.sin(t * 8 + Math.random() * 0.1) > -0.8 ? 1.5 : 0.3
    mat.emissiveIntensity = flicker
  })

  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {/* Sign backing */}
      <mesh position={[0, 0, -0.05]}>
        <boxGeometry args={[width + 0.2, height + 0.2, 0.05]} />
        <meshStandardMaterial color="#111122" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Neon surface */}
      <mesh ref={ref}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>
      {/* Glow light */}
      <pointLight
        position={[0, 0, 0.5]}
        color={color}
        intensity={3}
        distance={5}
      />
      {/* Sub-text bar */}
      {text && (
        <mesh position={[0, -height / 2 - 0.2, 0]}>
          <boxGeometry args={[width * 0.6, 0.15, 0.02]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
          />
        </mesh>
      )}
    </group>
  )
}

function WetGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[8, 40]} />
      <meshStandardMaterial color="#1a1a22" metalness={0.9} roughness={0.1} />
    </mesh>
  )
}

function SteamVent({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const count = 15
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        speed: 0.5 + Math.random() * 1,
        spread: Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
        scale: 0.05 + Math.random() * 0.1,
      })
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const p = particles[i]
      const life = (t * p.speed + p.phase) % 3
      dummy.position.set(
        Math.sin(t + p.phase) * p.spread,
        life * 1.2,
        Math.cos(t + p.phase) * p.spread,
      )
      dummy.scale.setScalar(p.scale * (1 + life * 0.5))
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group position={position}>
      {/* Vent grate */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.4, 0.4]} />
        <meshStandardMaterial color="#333344" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Steam particles */}
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshBasicMaterial color="#aabbcc" transparent opacity={0.15} />
      </instancedMesh>
    </group>
  )
}

function OverheadCables() {
  const cables = useMemo(() => {
    const arr = []
    for (let i = 0; i < 8; i++) {
      arr.push({
        y: 4 + Math.random() * 3,
        z: (Math.random() - 0.5) * 20,
        sag: 0.3 + Math.random() * 0.5,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {cables.map((c, i) => (
        <group key={i}>
          {/* Cable as thin box */}
          <mesh position={[0, c.y - c.sag / 2, c.z]}>
            <boxGeometry args={[7, 0.02, 0.02]} />
            <meshStandardMaterial color="#222233" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function HolographicAd({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.4 + Math.sin(t * 2) * 0.15
  })

  return (
    <mesh ref={ref} position={position} rotation={rotation || [0, 0, 0]}>
      <planeGeometry args={[1.5, 2]} />
      <meshStandardMaterial
        color="#44ffff"
        emissive="#22aaaa"
        emissiveIntensity={2}
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

const RAIN_COUNT = 200
const rainDummy = new THREE.Object3D()

function Rain() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const drops = useMemo(() => {
    const arr = []
    for (let i = 0; i < RAIN_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 30,
        speed: 8 + Math.random() * 4,
        phase: Math.random() * 10,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < RAIN_COUNT; i++) {
      const d = drops[i]
      const y = ((d.phase + t * d.speed) % 12) - 1
      rainDummy.position.set(d.x, 11 - y, d.z)
      rainDummy.scale.set(0.01, 0.15, 0.01)
      rainDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, rainDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, RAIN_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color="#8899aa" transparent opacity={0.3} />
    </instancedMesh>
  )
}

function Dumpster({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.2, 0.8, 0.8]} />
        <meshStandardMaterial color="#335533" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.85, 0]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[1.25, 0.05, 0.85]} />
        <meshStandardMaterial color="#2a4a2a" metalness={0.4} roughness={0.6} />
      </mesh>
    </group>
  )
}

export default function CyberpunkAlley() {
  return (
    <>
      <SceneSetup />

      <ambientLight intensity={0.05} />

      <WetGround />

      {/* Left building wall */}
      <Building
        position={[-4, 0, 0]}
        width={2}
        height={12}
        depth={30}
        color="#1a1a22"
      />
      {/* Right building wall */}
      <Building
        position={[4, 0, 0]}
        width={2}
        height={10}
        depth={30}
        color="#181820"
      />

      {/* Neon signs */}
      <NeonSign
        position={[-2.9, 4, -3]}
        rotation={[0, Math.PI / 2, 0]}
        color="#ff0066"
        width={1.5}
        height={0.5}
        text="bar"
      />
      <NeonSign
        position={[2.9, 5, 2]}
        rotation={[0, -Math.PI / 2, 0]}
        color="#00ffff"
        width={2}
        height={0.6}
      />
      <NeonSign
        position={[-2.9, 6, 5]}
        rotation={[0, Math.PI / 2, 0]}
        color="#ff6600"
        width={1.2}
        height={0.4}
      />
      <NeonSign
        position={[2.9, 3.5, -5]}
        rotation={[0, -Math.PI / 2, 0]}
        color="#aa00ff"
        width={1.8}
        height={0.5}
        text="neon"
      />
      <NeonSign
        position={[-2.9, 7, -7]}
        rotation={[0, Math.PI / 2, 0]}
        color="#00ff66"
        width={1}
        height={0.8}
      />

      {/* Steam vents */}
      <SteamVent position={[-1.5, 0, -4]} />
      <SteamVent position={[1, 0, 3]} />
      <SteamVent position={[-0.5, 0, 8]} />

      {/* Overhead cables */}
      <OverheadCables />

      {/* Holographic ads */}
      <HolographicAd position={[-1, 3, -1]} rotation={[0, 0.3, 0]} />
      <HolographicAd position={[1.5, 4, 6]} rotation={[0, -0.2, 0]} />

      {/* Street props */}
      <Dumpster position={[-2.5, 0, 1]} />
      <Dumpster position={[2.2, 0, -6]} />

      {/* Rain */}
      <Rain />
    </>
  )
}
