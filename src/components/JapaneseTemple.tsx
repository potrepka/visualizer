import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Foundation: 3 stacked stone boxes ---
function Foundation() {
  return (
    <group>
      <mesh position={[0, 0.025, 0]}>
        <boxGeometry args={[2.4, 0.05, 2.4]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
      <mesh position={[0, 0.075, 0]}>
        <boxGeometry args={[2.2, 0.05, 2.2]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
      <mesh position={[0, 0.125, 0]}>
        <boxGeometry args={[2.0, 0.05, 2.0]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
    </group>
  )
}

// --- Pagoda Tier: wall + roof + ridge ---
function PagodaTier({
  wallWidth,
  roofWidth,
  baseY,
}: {
  wallWidth: number
  roofWidth: number
  baseY: number
}) {
  const wallHeight = 0.5
  const roofThickness = 0.06
  const roofOverhang = roofWidth
  const wallY = baseY + wallHeight / 2
  const roofY = baseY + wallHeight + roofThickness / 2

  return (
    <group>
      {/* Wall */}
      <mesh position={[0, wallY, 0]}>
        <boxGeometry args={[wallWidth, wallHeight, wallWidth]} />
        <meshStandardMaterial color="#8b6914" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, roofY, 0]}>
        <boxGeometry args={[roofOverhang, roofThickness, roofOverhang]} />
        <meshStandardMaterial color="#8b1a1a" />
      </mesh>
      {/* Ridge */}
      <mesh position={[0, roofY + roofThickness / 2 + 0.015, 0]}>
        <boxGeometry args={[roofOverhang * 0.6, 0.03, 0.04]} />
        <meshStandardMaterial color="#8b1a1a" />
      </mesh>
    </group>
  )
}

// --- Finial: gold spire at top ---
function Finial({ baseY }: { baseY: number }) {
  return (
    <group position={[0, baseY, 0]}>
      {/* Spire cylinder */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.02, 0.04, 0.5, 8]} />
        <meshStandardMaterial color="#c8a820" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Top sphere */}
      <mesh position={[0, 0.55, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <meshStandardMaterial color="#daa520" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Decorative rings */}
      {[0.12, 0.22, 0.32].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.04 - i * 0.005, 0.008, 8, 16]} />
          <meshStandardMaterial
            color="#daa520"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Stairs: 4 steps descending toward +Z ---
function Stairs() {
  const steps = [
    { y: 0.11, z: 1.05 },
    { y: 0.08, z: 1.2 },
    { y: 0.05, z: 1.35 },
    { y: 0.02, z: 1.5 },
  ]
  return (
    <group>
      {steps.map((s, i) => (
        <mesh key={i} position={[0, s.y, s.z]}>
          <boxGeometry args={[0.6, 0.04, 0.15]} />
          <meshStandardMaterial color="#808080" />
        </mesh>
      ))}
    </group>
  )
}

// --- Pagoda: assembles Foundation + 3 Tiers + Finial + Stairs ---
function Pagoda() {
  return (
    <group>
      <Foundation />
      <PagodaTier wallWidth={1.6} roofWidth={2.2} baseY={0.15} />
      <PagodaTier wallWidth={1.2} roofWidth={1.7} baseY={0.71} />
      <PagodaTier wallWidth={0.8} roofWidth={1.2} baseY={1.27} />
      <Finial baseY={1.83} />
      <Stairs />
    </group>
  )
}

// --- Cherry Blossom Tree ---
function CherryBlossomTree({
  position,
}: {
  position: [number, number, number]
}) {
  const trunkHeight = 1.0
  const foliageOffsets: [number, number, number][] = [
    [0, trunkHeight + 0.2, 0],
    [-0.25, trunkHeight + 0.05, 0.2],
    [0.25, trunkHeight + 0.05, -0.15],
    [0, trunkHeight - 0.05, -0.25],
  ]
  const foliageColors = ['#f4a0b0', '#e87f99', '#f4a0b0', '#e87f99']

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, trunkHeight / 2, 0]}>
        <cylinderGeometry args={[0.04, 0.06, trunkHeight, 8]} />
        <meshStandardMaterial color="#4a2f1a" />
      </mesh>
      {/* Foliage spheres */}
      {foliageOffsets.map((offset, i) => (
        <mesh key={i} position={offset}>
          <sphereGeometry args={[0.35, 12, 12]} />
          <meshStandardMaterial color={foliageColors[i]} />
        </mesh>
      ))}
    </group>
  )
}

// --- Stone Lantern ---
function StoneLantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.04, 0]}>
        <boxGeometry args={[0.18, 0.08, 0.18]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
      {/* Pillar */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 0.24, 8]} />
        <meshStandardMaterial color="#909090" />
      </mesh>
      {/* Lamp box (emissive) */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.14, 0.12, 0.14]} />
        <meshStandardMaterial
          color="#ffcc66"
          emissive="#ffcc66"
          emissiveIntensity={0.5}
        />
      </mesh>
      {/* Roof cap */}
      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[0.2, 0.04, 0.2]} />
        <meshStandardMaterial color="#707070" />
      </mesh>
      {/* Finial ball */}
      <mesh position={[0, 0.53, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
    </group>
  )
}

// --- Stone Path ---
function StonePath() {
  return (
    <mesh position={[0, 0.01, 2.2]} rotation={[0, 0, 0]}>
      <boxGeometry args={[0.5, 0.02, 1.5]} />
      <meshStandardMaterial color="#a0a0a0" />
    </mesh>
  )
}

// --- Pond ---
function Pond() {
  const rockPositions: [number, number, number][] = [
    [0.7, 0.02, 0.2],
    [-0.5, 0.02, 0.5],
    [0.3, 0.02, -0.65],
  ]
  return (
    <group position={[2.5, 0, 1.5]}>
      {/* Water surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.8, 32]} />
        <meshStandardMaterial
          color="#2a6e6e"
          metalness={0.6}
          roughness={0.1}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Rocks */}
      {rockPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      ))}
    </group>
  )
}

// --- Cherry Blossom Petals (instanced) ---
const PETAL_COUNT = 100
const dummy = new THREE.Object3D()

interface PetalData {
  startX: number
  startY: number
  startZ: number
  fallSpeed: number
  driftRadius: number
  spiralSpeed: number
  phase: number
  rotationSpeed: number
  scale: number
}

function CherryBlossomPetals() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const petals = useMemo<PetalData[]>(() => {
    const arr: PetalData[] = []
    for (let i = 0; i < PETAL_COUNT; i++) {
      arr.push({
        startX: (Math.random() - 0.5) * 10,
        startY: 2 + Math.random() * 4,
        startZ: (Math.random() - 0.5) * 10,
        fallSpeed: 0.15 + Math.random() * 0.2,
        driftRadius: 0.3 + Math.random() * 0.7,
        spiralSpeed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        rotationSpeed: 1 + Math.random() * 2,
        scale: 0.015 + Math.random() * 0.015,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < PETAL_COUNT; i++) {
      const p = petals[i]
      const cycleTime = p.startY / p.fallSpeed + 4
      const localT = (t + p.phase * 5) % cycleTime
      const y = p.startY - localT * p.fallSpeed
      const x = p.startX + Math.sin(t * p.spiralSpeed + p.phase) * p.driftRadius
      const z = p.startZ + Math.cos(t * p.spiralSpeed + p.phase) * p.driftRadius

      dummy.position.set(x, y, z)
      dummy.rotation.set(
        t * p.rotationSpeed,
        t * p.rotationSpeed * 0.7,
        t * p.rotationSpeed * 0.3,
      )
      dummy.scale.setScalar(p.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PETAL_COUNT]}>
      <planeGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#ffb7c5"
        side={THREE.DoubleSide}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  )
}

// --- Main Scene ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#c8d8d8', 40, 120)
    scene.background = new THREE.Color('#c8d8d8')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

export default function JapaneseTemple() {
  return (
    <>
      <SceneSetup />

      {/* Lighting */}
      <directionalLight position={[4, 6, 3]} color="#ffe0b0" intensity={1.2} />
      <ambientLight intensity={0.25} />
      <hemisphereLight args={['#ffeedd', '#445533', 0.4]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#4a7c3f" />
      </mesh>

      {/* Pagoda */}
      <Pagoda />

      {/* Stone Path */}
      <StonePath />

      {/* Stone Lanterns */}
      <StoneLantern position={[-0.6, 0, 2.0]} />
      <StoneLantern position={[0.6, 0, 2.0]} />

      {/* Cherry Blossom Trees */}
      <CherryBlossomTree position={[-2, 0, 1]} />
      <CherryBlossomTree position={[2, 0, -0.5]} />
      <CherryBlossomTree position={[-1.5, 0, -2]} />

      {/* Pond */}
      <Pond />

      {/* Animated Petals */}
      <CherryBlossomPetals />
    </>
  )
}
