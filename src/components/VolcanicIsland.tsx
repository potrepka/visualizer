import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Volcano cone ---
function Volcano() {
  return (
    <group>
      {/* Main cone */}
      <mesh position={[0, 2.5, 0]}>
        <coneGeometry args={[5, 5, 24]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.9} />
      </mesh>
      {/* Crater depression (inverted cone at top) */}
      <mesh position={[0, 5.2, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.5, 1.2, 16]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.95} />
      </mesh>
      {/* Lava pool in crater */}
      <mesh position={[0, 4.7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 16]} />
        <meshStandardMaterial
          color="#ff4400"
          emissive="#ff2200"
          emissiveIntensity={2}
          roughness={0.3}
        />
      </mesh>
      {/* Rocky texture patches */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const r = 3 + Math.random() * 1.5
        const y = 1 + Math.random() * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, y, Math.sin(angle) * r]}
          >
            <sphereGeometry args={[0.3 + Math.random() * 0.4, 6, 5]} />
            <meshStandardMaterial color="#3a3a3a" roughness={0.95} />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Lava Streams ---
function LavaStream({ path }: { path: [number, number, number][] }) {
  return (
    <group>
      {path.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.15 + (path.length - i) * 0.02, 6, 6]} />
          <meshStandardMaterial
            color="#ff5500"
            emissive="#ff3300"
            emissiveIntensity={1.5 + Math.sin(i * 0.5) * 0.5}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Rocky terrain around the island ---
function RockyTerrain() {
  const rocks = useMemo(() => {
    const arr = []
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 5 + Math.random() * 6
      arr.push({
        pos: [
          Math.cos(angle) * dist,
          Math.random() * 0.3,
          Math.sin(angle) * dist,
        ] as [number, number, number],
        scale: [
          0.3 + Math.random() * 0.6,
          0.2 + Math.random() * 0.4,
          0.3 + Math.random() * 0.6,
        ] as [number, number, number],
        color: Math.random() > 0.5 ? '#3d3d3d' : '#4a4a4a',
      })
    }
    return arr
  }, [])

  return (
    <group>
      {rocks.map((r, i) => (
        <mesh
          key={i}
          position={r.pos}
          scale={r.scale}
          rotation={[Math.random() * 0.3, Math.random() * Math.PI, 0]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={r.color} roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// --- Dark Water ---
function DarkWater() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.y = -0.05 + Math.sin(t * 0.3) * 0.05
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial
        color="#0a1a2a"
        metalness={0.7}
        roughness={0.2}
        transparent
        opacity={0.9}
      />
    </mesh>
  )
}

// --- Island base ---
function IslandBase() {
  return (
    <group>
      {/* Flat top area */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[8, 10, 0.4, 24]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.85} />
      </mesh>
      {/* Underwater base */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[10, 12, 1, 24]} />
        <meshStandardMaterial color="#1a1a2a" roughness={0.9} />
      </mesh>
    </group>
  )
}

// --- Smoke Particles from crater ---
const SMOKE_COUNT = 60
const smokeDummy = new THREE.Object3D()

interface SmokeData {
  x: number
  z: number
  speed: number
  phase: number
  scale: number
  drift: number
}

function SmokeParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo<SmokeData[]>(() => {
    const arr: SmokeData[] = []
    for (let i = 0; i < SMOKE_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 1.5,
        z: (Math.random() - 0.5) * 1.5,
        speed: 0.4 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        scale: 0.1 + Math.random() * 0.2,
        drift: (Math.random() - 0.5) * 0.3,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < SMOKE_COUNT; i++) {
      const p = particles[i]
      const life = (t * p.speed + p.phase * 3) % 6
      const y = 5 + life * 1.2
      const expand = 1 + life * 0.3
      smokeDummy.position.set(
        p.x * expand + Math.sin(t * 0.3 + p.phase) * p.drift * life,
        y,
        p.z * expand + Math.cos(t * 0.3 + p.phase) * p.drift * life,
      )
      smokeDummy.scale.setScalar(p.scale * (1 + life * 0.5))
      smokeDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, smokeDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SMOKE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#555555" transparent opacity={0.25} />
    </instancedMesh>
  )
}

// --- Ember particles ---
const EMBER_COUNT = 40
const emberDummy = new THREE.Object3D()

function EmberParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const embers = useMemo(() => {
    return Array.from({ length: EMBER_COUNT }, () => ({
      x: (Math.random() - 0.5) * 2,
      z: (Math.random() - 0.5) * 2,
      speed: 0.8 + Math.random() * 1.2,
      phase: Math.random() * Math.PI * 2,
      scale: 0.02 + Math.random() * 0.03,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < EMBER_COUNT; i++) {
      const e = embers[i]
      const life = (t * e.speed + e.phase * 4) % 4
      emberDummy.position.set(
        e.x + Math.sin(t + e.phase) * 0.5,
        4.8 + life * 2,
        e.z + Math.cos(t + e.phase) * 0.5,
      )
      emberDummy.scale.setScalar(e.scale * Math.max(0, 1 - life * 0.25))
      emberDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, emberDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, EMBER_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#ff6600"
        emissive="#ff4400"
        emissiveIntensity={2}
      />
    </instancedMesh>
  )
}

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a0a0a', 15, 60)
    scene.background = new THREE.Color('#1a0a0a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Main Scene ---
export default function VolcanicIsland() {
  const lavaPath1 = useMemo<[number, number, number][]>(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i < 15; i++) {
      const t = i / 14
      pts.push([Math.sin(t * 1.5) * t * 3, 4.5 - t * 4.5, t * 4])
    }
    return pts
  }, [])

  const lavaPath2 = useMemo<[number, number, number][]>(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i < 12; i++) {
      const t = i / 11
      pts.push([-Math.sin(t * 1.2) * t * 2.5, 4.5 - t * 4.5, -t * 3.5])
    }
    return pts
  }, [])

  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 8, 3]} color="#ff8844" intensity={0.6} />
      <ambientLight color="#331111" intensity={0.3} />
      <pointLight
        position={[0, 5, 0]}
        color="#ff4400"
        intensity={2}
        distance={15}
      />
      <pointLight
        position={[0, 6, 0]}
        color="#ff6600"
        intensity={1}
        distance={25}
      />

      <IslandBase />
      <DarkWater />
      <Volcano />
      <RockyTerrain />
      <LavaStream path={lavaPath1} />
      <LavaStream path={lavaPath2} />
      <SmokeParticles />
      <EmberParticles />
    </>
  )
}
