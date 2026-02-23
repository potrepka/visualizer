import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#0a3a4a', 5, 35)
    scene.background = new THREE.Color('#0a3a4a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Broken Column ---
function BrokenColumn({
  position,
  height,
  broken,
}: {
  position: [number, number, number]
  height: number
  broken: boolean
}) {
  return (
    <group position={position}>
      {/* Column shaft */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.25, 0.3, height, 12]} />
        <meshStandardMaterial color="#a0988a" roughness={0.9} />
      </mesh>
      {/* Column base */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshStandardMaterial color="#8a8278" roughness={0.9} />
      </mesh>
      {/* Capital (if not too broken) */}
      {!broken && (
        <mesh position={[0, height + 0.1, 0]}>
          <boxGeometry args={[0.7, 0.2, 0.7]} />
          <meshStandardMaterial color="#a0988a" roughness={0.85} />
        </mesh>
      )}
      {/* Broken top */}
      {broken && (
        <mesh position={[0.1, height, 0.05]} rotation={[0.3, 0.5, 0.2]}>
          <cylinderGeometry args={[0.15, 0.25, 0.3, 8]} />
          <meshStandardMaterial color="#9a9080" roughness={0.9} />
        </mesh>
      )}
      {/* Coral growth on column */}
      <mesh position={[0.2, height * 0.4, 0.15]}>
        <sphereGeometry args={[0.12 + Math.random() * 0.1, 6, 6]} />
        <meshStandardMaterial color="#ff6b8a" roughness={0.7} />
      </mesh>
      <mesh position={[-0.15, height * 0.7, -0.1]}>
        <sphereGeometry args={[0.08 + Math.random() * 0.08, 6, 6]} />
        <meshStandardMaterial color="#ff9a53" roughness={0.7} />
      </mesh>
    </group>
  )
}

// --- Collapsed Building ---
function CollapsedBuilding({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: number
}) {
  const blocks = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      size: [number, number, number]
      rot: [number, number, number]
    }[] = []
    // Standing walls
    arr.push({
      pos: [0, 0.8, 0],
      size: [2, 1.6, 0.2],
      rot: [0, 0, 0],
    })
    arr.push({
      pos: [1, 0.6, 1],
      size: [0.2, 1.2, 2],
      rot: [0, 0, 0],
    })
    // Fallen wall
    arr.push({
      pos: [-0.8, 0.1, 1],
      size: [2, 0.2, 1.5],
      rot: [0, 0.3, 0],
    })
    // Rubble
    for (let i = 0; i < 8; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 3,
          Math.random() * 0.3,
          (Math.random() - 0.5) * 3,
        ],
        size: [
          0.2 + Math.random() * 0.4,
          0.1 + Math.random() * 0.2,
          0.2 + Math.random() * 0.4,
        ],
        rot: [
          Math.random() * 0.5,
          Math.random() * Math.PI,
          Math.random() * 0.3,
        ],
      })
    }
    return arr
  }, [])

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {blocks.map((b, i) => (
        <mesh key={i} position={b.pos} rotation={b.rot}>
          <boxGeometry args={b.size} />
          <meshStandardMaterial
            color={i < 3 ? '#9a9488' : '#7a756e'}
            roughness={0.9}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Archway Ruin ---
function Archway({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Left pillar */}
      <mesh position={[-1, 1.2, 0]}>
        <boxGeometry args={[0.4, 2.4, 0.4]} />
        <meshStandardMaterial color="#a09888" roughness={0.85} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[1, 1, 0]}>
        <boxGeometry args={[0.4, 2, 0.4]} />
        <meshStandardMaterial color="#a09888" roughness={0.85} />
      </mesh>
      {/* Arch top (partial) */}
      <mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.2, 6, 12, Math.PI]} />
        <meshStandardMaterial color="#968e80" roughness={0.9} />
      </mesh>
      {/* Fallen piece */}
      <mesh position={[0.8, 0.15, 0.5]} rotation={[0.2, 0.5, 0.1]}>
        <boxGeometry args={[0.5, 0.3, 0.3]} />
        <meshStandardMaterial color="#8a8478" roughness={0.9} />
      </mesh>
      {/* Coral on arch */}
      <mesh position={[0, 2.7, 0.2]}>
        <sphereGeometry args={[0.2, 6, 6]} />
        <meshStandardMaterial color="#c06bff" roughness={0.6} />
      </mesh>
    </group>
  )
}

// --- Sea Floor ---
function SeaFloor() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#3a5a50" roughness={0.95} />
      </mesh>
      {/* Sandy patches */}
      {[
        [-3, 0.01, 2],
        [4, 0.01, -3],
        [-1, 0.01, -5],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos as [number, number, number]}
          rotation={[-Math.PI / 2, 0, i * 0.5]}
        >
          <circleGeometry args={[1.5 + i * 0.5, 8]} />
          <meshStandardMaterial color="#8a8a6a" roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

// --- Swimming Fish ---
const FISH_COUNT = 40
const fishDummy = new THREE.Object3D()

function SwimmingFish() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const fishData = useMemo(
    () =>
      Array.from({ length: FISH_COUNT }, () => ({
        cx: (Math.random() - 0.5) * 15,
        cy: 1 + Math.random() * 5,
        cz: (Math.random() - 0.5) * 15,
        radius: 0.5 + Math.random() * 2,
        speed: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        yOsc: Math.random() * 0.3,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < FISH_COUNT; i++) {
      const f = fishData[i]
      const angle = t * f.speed + f.phase
      fishDummy.position.set(
        f.cx + Math.cos(angle) * f.radius,
        f.cy + Math.sin(t * 1.5 + f.phase) * f.yOsc,
        f.cz + Math.sin(angle) * f.radius,
      )
      fishDummy.rotation.set(0, -angle + Math.PI / 2, 0)
      fishDummy.scale.setScalar(0.06)
      fishDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, fishDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, FISH_COUNT]}>
      <coneGeometry args={[0.4, 1.5, 4]} />
      <meshStandardMaterial color="#66bbee" transparent opacity={0.7} />
    </instancedMesh>
  )
}

// --- Coral Growths (scattered) ---
function CoralGrowths() {
  const corals = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      scale: number
      color: string
    }[] = []
    const colors = [
      '#ff6b6b',
      '#ff9a53',
      '#e77fb3',
      '#c06bff',
      '#ff5277',
      '#ffaa66',
    ]
    for (let i = 0; i < 30; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 18,
          Math.random() * 0.5,
          (Math.random() - 0.5) * 18,
        ],
        scale: 0.15 + Math.random() * 0.35,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    return arr
  }, [])

  return (
    <group>
      {corals.map((c, i) => (
        <mesh key={i} position={c.pos} scale={c.scale}>
          {i % 3 === 0 ? (
            <sphereGeometry args={[1, 8, 8]} />
          ) : i % 3 === 1 ? (
            <cylinderGeometry args={[0.3, 0.8, 1.5, 6]} />
          ) : (
            <coneGeometry args={[0.6, 1.2, 5]} />
          )}
          <meshStandardMaterial color={c.color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// --- Floating Particles (underwater dust) ---
const PARTICLE_COUNT = 80
const particleDummy = new THREE.Object3D()

function UnderwaterParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const data = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, () => ({
        x: (Math.random() - 0.5) * 20,
        y: Math.random() * 8,
        z: (Math.random() - 0.5) * 20,
        speed: 0.1 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const d = data[i]
      particleDummy.position.set(
        d.x + Math.sin(t * 0.2 + d.phase) * 0.5,
        d.y + Math.sin(t * d.speed + d.phase) * 0.5,
        d.z + Math.cos(t * 0.15 + d.phase) * 0.5,
      )
      particleDummy.scale.setScalar(0.02 + Math.sin(t + d.phase) * 0.01)
      particleDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, particleDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#aaddcc" transparent opacity={0.3} />
    </instancedMesh>
  )
}

// --- Light Rays from above ---
function LightRays() {
  return (
    <group>
      {[0, 1, 2, 3].map((i) => {
        const x = (i - 1.5) * 4
        return (
          <mesh
            key={i}
            position={[x, 6, -2 + i * 1.5]}
            rotation={[0.1 * i, 0, 0.05 * i]}
          >
            <boxGeometry args={[0.5, 12, 0.5]} />
            <meshBasicMaterial color="#88ddcc" transparent opacity={0.04} />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Main Scene ---
export default function SunkenCityRuins() {
  const columns = useMemo(
    () => [
      { pos: [-4, 0, -3] as [number, number, number], h: 3, broken: false },
      { pos: [-2, 0, -4] as [number, number, number], h: 2.2, broken: true },
      { pos: [2, 0, -3] as [number, number, number], h: 2.8, broken: false },
      { pos: [4, 0, -4] as [number, number, number], h: 1.5, broken: true },
      { pos: [-3, 0, 2] as [number, number, number], h: 3.2, broken: false },
      { pos: [3, 0, 1] as [number, number, number], h: 2, broken: true },
      { pos: [0, 0, 5] as [number, number, number], h: 2.5, broken: false },
      { pos: [-5, 0, -1] as [number, number, number], h: 1.8, broken: true },
    ],
    [],
  )

  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.15} color="#2a6a7a" />
      <directionalLight position={[3, 10, 2]} intensity={0.4} color="#4a9aaa" />
      <pointLight
        position={[0, 5, 0]}
        intensity={0.3}
        color="#3a8a9a"
        distance={20}
      />
      <SeaFloor />
      {columns.map((c, i) => (
        <BrokenColumn key={i} position={c.pos} height={c.h} broken={c.broken} />
      ))}
      <CollapsedBuilding position={[5, 0, 3]} rotation={0.5} />
      <CollapsedBuilding position={[-5, 0, 4]} rotation={-0.3} />
      <Archway position={[0, 0, -2]} />
      <CoralGrowths />
      <SwimmingFish />
      <UnderwaterParticles />
      <LightRays />
    </>
  )
}
