import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#0a0a1a', 10, 35)
    scene.background = new THREE.Color('#0a0a1a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Backbone Sphere ---
function BackboneSphere({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.12, 8, 8]} />
      <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} />
    </mesh>
  )
}

// --- Base Pair Rung ---
function BasePair({
  posA,
  posB,
  colorA,
  colorB,
}: {
  posA: [number, number, number]
  posB: [number, number, number]
  colorA: string
  colorB: string
}) {
  const midX = (posA[0] + posB[0]) / 2
  const midY = (posA[1] + posB[1]) / 2
  const midZ = (posA[2] + posB[2]) / 2
  const dx = posB[0] - posA[0]
  const dz = posB[2] - posA[2]
  const length = Math.sqrt(dx * dx + dz * dz)
  const angle = Math.atan2(dx, dz)

  return (
    <group>
      {/* Half-rung A side */}
      <mesh
        position={[(posA[0] + midX) / 2, midY, (posA[2] + midZ) / 2]}
        rotation={[0, angle, 0]}
      >
        <boxGeometry args={[0.06, 0.06, length / 2]} />
        <meshStandardMaterial
          color={colorA}
          emissive={colorA}
          emissiveIntensity={0.3}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
      {/* Half-rung B side */}
      <mesh
        position={[(posB[0] + midX) / 2, midY, (posB[2] + midZ) / 2]}
        rotation={[0, angle, 0]}
      >
        <boxGeometry args={[0.06, 0.06, length / 2]} />
        <meshStandardMaterial
          color={colorB}
          emissive={colorB}
          emissiveIntensity={0.3}
          metalness={0.2}
          roughness={0.4}
        />
      </mesh>
      {/* Center bond (hydrogen bond visualization) */}
      <mesh position={[midX, midY, midZ]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  )
}

// --- Backbone Connector ---
function BackboneConnector({
  posA,
  posB,
  color,
}: {
  posA: [number, number, number]
  posB: [number, number, number]
  color: string
}) {
  const dx = posB[0] - posA[0]
  const dy = posB[1] - posA[1]
  const dz = posB[2] - posA[2]
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz)
  const midX = (posA[0] + posB[0]) / 2
  const midY = (posA[1] + posB[1]) / 2
  const midZ = (posA[2] + posB[2]) / 2

  const direction = new THREE.Vector3(dx, dy, dz).normalize()
  const up = new THREE.Vector3(0, 1, 0)
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction)
  const euler = new THREE.Euler().setFromQuaternion(quaternion)

  return (
    <mesh position={[midX, midY, midZ]} rotation={euler}>
      <cylinderGeometry args={[0.04, 0.04, length, 6]} />
      <meshStandardMaterial color={color} metalness={0.3} roughness={0.4} />
    </mesh>
  )
}

// --- DNA Helix Structure ---
const HELIX_STEPS = 40
const HELIX_RADIUS = 1.2
const HELIX_HEIGHT = 12
const HELIX_TURNS = 3

function HelixStructure() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.3
  })

  // Base pair color pairings (A-T: red-green, C-G: blue-yellow)
  const basePairColors: [string, string][] = [
    ['#ff4444', '#44cc44'], // A-T
    ['#4488ff', '#ffcc22'], // C-G
  ]

  const helixData = useMemo(() => {
    const strandA: [number, number, number][] = []
    const strandB: [number, number, number][] = []
    const pairs: {
      a: [number, number, number]
      b: [number, number, number]
      colors: [string, string]
    }[] = []

    for (let i = 0; i < HELIX_STEPS; i++) {
      const t = i / HELIX_STEPS
      const angle = t * Math.PI * 2 * HELIX_TURNS
      const y = t * HELIX_HEIGHT - HELIX_HEIGHT / 2

      const ax = Math.cos(angle) * HELIX_RADIUS
      const az = Math.sin(angle) * HELIX_RADIUS
      const bx = Math.cos(angle + Math.PI) * HELIX_RADIUS
      const bz = Math.sin(angle + Math.PI) * HELIX_RADIUS

      strandA.push([ax, y, az])
      strandB.push([bx, y, bz])
      pairs.push({
        a: [ax, y, az],
        b: [bx, y, bz],
        colors: basePairColors[i % 2],
      })
    }

    return { strandA, strandB, pairs }
  }, [])

  const strandColorA = '#3388ff'
  const strandColorB = '#ff6633'

  return (
    <group ref={groupRef}>
      {/* Strand A backbone spheres */}
      {helixData.strandA.map((pos, i) => (
        <BackboneSphere key={`sa${i}`} position={pos} color={strandColorA} />
      ))}
      {/* Strand B backbone spheres */}
      {helixData.strandB.map((pos, i) => (
        <BackboneSphere key={`sb${i}`} position={pos} color={strandColorB} />
      ))}
      {/* Strand A backbone connectors */}
      {helixData.strandA.slice(0, -1).map((pos, i) => (
        <BackboneConnector
          key={`ca${i}`}
          posA={pos}
          posB={helixData.strandA[i + 1]}
          color={strandColorA}
        />
      ))}
      {/* Strand B backbone connectors */}
      {helixData.strandB.slice(0, -1).map((pos, i) => (
        <BackboneConnector
          key={`cb${i}`}
          posA={pos}
          posB={helixData.strandB[i + 1]}
          color={strandColorB}
        />
      ))}
      {/* Base pairs (every 2 steps for clarity) */}
      {helixData.pairs
        .filter((_, i) => i % 2 === 0)
        .map((p, i) => (
          <BasePair
            key={`bp${i}`}
            posA={p.a}
            posB={p.b}
            colorA={p.colors[0]}
            colorB={p.colors[1]}
          />
        ))}
    </group>
  )
}

// --- Floating Particles (molecular ambiance) ---
const PARTICLE_COUNT = 60
const particleDummy = new THREE.Object3D()

function MolecularParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const data = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, () => ({
        x: (Math.random() - 0.5) * 10,
        y: (Math.random() - 0.5) * 14,
        z: (Math.random() - 0.5) * 10,
        speed: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.04,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const d = data[i]
      particleDummy.position.set(
        d.x + Math.sin(t * 0.3 + d.phase) * 0.5,
        d.y + Math.sin(t * d.speed + d.phase) * 0.8,
        d.z + Math.cos(t * 0.2 + d.phase) * 0.5,
      )
      const s = d.scale * (0.5 + 0.5 * Math.sin(t * 1.5 + d.phase))
      particleDummy.scale.setScalar(s)
      particleDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, particleDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#66aaff"
        emissive="#3366cc"
        emissiveIntensity={1}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  )
}

// --- Glow Ring (equatorial accent) ---
function GlowRing({
  y,
  color,
  speed,
}: {
  y: number
  color: string
  speed: number
}) {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.z = t * speed
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.15 + Math.sin(t * 0.8) * 0.05
  })
  return (
    <mesh ref={ref} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2, 0.02, 8, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0.2}
      />
    </mesh>
  )
}

// --- Main Scene ---
export default function DnaDoubleHelix() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.1} color="#1a2a4a" />
      <directionalLight position={[5, 8, 5]} intensity={0.5} color="#4488cc" />
      <pointLight
        position={[0, 4, 3]}
        intensity={0.6}
        color="#3388ff"
        distance={15}
      />
      <pointLight
        position={[0, -4, -3]}
        intensity={0.4}
        color="#ff6633"
        distance={15}
      />
      <pointLight
        position={[3, 0, 0]}
        intensity={0.3}
        color="#44cc88"
        distance={10}
      />
      <HelixStructure />
      <MolecularParticles />
      <GlowRing y={-3} color="#3388ff" speed={0.2} />
      <GlowRing y={0} color="#ff6633" speed={-0.15} />
      <GlowRing y={3} color="#44cc88" speed={0.25} />
    </>
  )
}
