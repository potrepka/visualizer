import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#2a1a0a', 15, 35)
    scene.background = new THREE.Color('#1a0e05')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Ant figure ---
function Ant({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}) {
  const ref = useRef<THREE.Group>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])
  const s = scale || 1

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Subtle wiggle
    ref.current.rotation.z = Math.sin(t * 3 + phase) * 0.1
  })

  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation || [0, 0, 0]}
      scale={[s, s, s]}
    >
      {/* Head */}
      <mesh position={[0.12, 0, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshStandardMaterial color="#1a0a00" roughness={0.6} />
      </mesh>
      {/* Mandibles & Antennae */}
      {[
        [0.17, 0.01, 0.015, 0, 0.3, 0],
        [0.17, 0.01, -0.015, 0, -0.3, 0],
      ].map(([px, py, pz, rx, ry, rz], i) => (
        <mesh key={`m${i}`} position={[px, py, pz]} rotation={[rx, ry, rz]}>
          <cylinderGeometry args={[0.005, 0.002, 0.04, 4]} />
          <meshStandardMaterial color="#2a1500" />
        </mesh>
      ))}
      {[
        [0.15, 0.04, 0.02, 0.3, 0, 0.5],
        [0.15, 0.04, -0.02, -0.3, 0, 0.5],
      ].map(([px, py, pz, rx, ry, rz], i) => (
        <mesh key={`a${i}`} position={[px, py, pz]} rotation={[rx, ry, rz]}>
          <cylinderGeometry args={[0.003, 0.002, 0.08, 4]} />
          <meshStandardMaterial color="#2a1500" />
        </mesh>
      ))}
      {/* Thorax */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.045, 8, 6]} />
        <meshStandardMaterial color="#2a1200" roughness={0.5} />
      </mesh>
      {/* Abdomen */}
      <mesh position={[-0.12, 0, 0]} scale={[1.4, 1, 1]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#1a0800" roughness={0.5} />
      </mesh>
      {/* Legs (6) */}
      {[-1, 0, 1].map((offset, i) => (
        <group key={i}>
          <mesh
            position={[offset * 0.04, -0.03, 0.04]}
            rotation={[0.6, 0, 0.3]}
          >
            <cylinderGeometry args={[0.004, 0.003, 0.08, 4]} />
            <meshStandardMaterial color="#2a1500" />
          </mesh>
          <mesh
            position={[offset * 0.04, -0.03, -0.04]}
            rotation={[-0.6, 0, -0.3]}
          >
            <cylinderGeometry args={[0.004, 0.003, 0.08, 4]} />
            <meshStandardMaterial color="#2a1500" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// --- Tunnel segment ---
function Tunnel({
  points,
  radius,
}: {
  points: [number, number][]
  radius: number
}) {
  return (
    <group>
      {points.map((pt, i) => {
        if (i === 0) return null
        const prev = points[i - 1]
        const dx = pt[0] - prev[0]
        const dy = pt[1] - prev[1]
        const len = Math.sqrt(dx * dx + dy * dy)
        const angle = Math.atan2(dy, dx)
        const mx = (pt[0] + prev[0]) / 2
        const my = (pt[1] + prev[1]) / 2

        return (
          <mesh key={i} position={[mx, my, 0]} rotation={[0, 0, angle]}>
            <cylinderGeometry args={[radius, radius, len, 8]} />
            <meshStandardMaterial
              color="#3a2a18"
              roughness={0.9}
              side={THREE.DoubleSide}
            />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Chamber (rounded room) ---
function Chamber({
  position,
  width,
  height,
  color,
  label,
}: {
  position: [number, number, number]
  width: number
  height: number
  color: string
  label?: string
}) {
  return (
    <group position={position}>
      {/* Chamber cavity */}
      <mesh>
        <sphereGeometry args={[Math.max(width, height) / 2, 16, 12]} />
        <meshStandardMaterial
          color={color}
          roughness={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -height / 2 + 0.02, 0]}
      >
        <circleGeometry args={[(width / 2) * 0.9, 12]} />
        <meshStandardMaterial color="#4a3520" roughness={0.9} />
      </mesh>
      {label === 'food' && <FoodStorage />}
      {label === 'queen' && <QueenChamberDecor />}
      {label === 'nursery' && <NurseryDecor />}
    </group>
  )
}

// --- Food storage items ---
function FoodStorage() {
  const items = useMemo(
    () =>
      Array.from({ length: 8 }, () => ({
        pos: [
          (Math.random() - 0.5) * 0.4,
          -0.15 + Math.random() * 0.05,
          (Math.random() - 0.5) * 0.3,
        ] as [number, number, number],
        color: ['#88aa22', '#aacc33', '#667711', '#44aa44'][
          Math.floor(Math.random() * 4)
        ],
        scale: 0.02 + Math.random() * 0.03,
      })),
    [],
  )

  return (
    <group>
      {items.map((item, i) => (
        <mesh key={i} position={item.pos}>
          <sphereGeometry args={[item.scale, 6, 6]} />
          <meshStandardMaterial color={item.color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

// --- Queen chamber decoration ---
function QueenChamberDecor() {
  return (
    <group>
      {/* Queen ant (larger) */}
      <Ant position={[0, -0.1, 0.05]} scale={1.8} />
      {/* Eggs */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const r = 0.08 + Math.random() * 0.1
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, -0.18, Math.sin(angle) * r + 0.05]}
          >
            <sphereGeometry args={[0.015, 6, 6]} />
            <meshStandardMaterial color="#f5eedd" roughness={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Nursery decoration ---
function NurseryDecor() {
  return (
    <group>
      {/* Larvae */}
      {Array.from({ length: 6 }, (_, i) => {
        const x = (Math.random() - 0.5) * 0.3
        const z = (Math.random() - 0.5) * 0.2
        return (
          <mesh
            key={i}
            position={[x, -0.15, z]}
            rotation={[0, Math.random() * Math.PI, Math.PI / 2]}
            scale={[1, 0.6, 0.6]}
          >
            <capsuleGeometry args={[0.015, 0.03, 4, 6]} />
            <meshStandardMaterial color="#f0e8d0" roughness={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

// --- Earth mass (cross section view) ---
function EarthMass() {
  return (
    <group>
      {/* Main earth block */}
      <mesh position={[0, -2, 0]}>
        <boxGeometry args={[10, 6, 3]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.9} />
      </mesh>
      {/* Top soil layer */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[10, 0.3, 3]} />
        <meshStandardMaterial color="#3a5a1a" roughness={0.9} />
      </mesh>
      {/* Rocks in soil */}
      {Array.from({ length: 10 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 8,
            -1 - Math.random() * 3,
            (Math.random() - 0.5) * 0.5,
          ]}
        >
          <sphereGeometry args={[0.1 + Math.random() * 0.15, 6, 6]} />
          <meshStandardMaterial color="#7a7a6a" roughness={0.8} />
        </mesh>
      ))}
      {/* Roots */}
      {Array.from({ length: 5 }, (_, i) => (
        <mesh
          key={`r${i}`}
          position={[(Math.random() - 0.5) * 8, 0.2 - Math.random() * 1.5, 0]}
          rotation={[0, 0, (Math.random() - 0.5) * 0.5]}
        >
          <cylinderGeometry args={[0.01, 0.02, 0.5 + Math.random() * 1, 4]} />
          <meshStandardMaterial color="#5a4020" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

// --- Surface with grass tufts and mound ---
function Surface() {
  return (
    <group>
      {/* Ant mound entrance */}
      <mesh position={[0, 1.2, 0]}>
        <coneGeometry args={[0.5, 0.5, 12]} />
        <meshStandardMaterial color="#6a4a2a" roughness={0.9} />
      </mesh>
      {/* Entrance hole */}
      <mesh position={[0, 1.45, 0.15]} rotation={[-0.3, 0, 0]}>
        <circleGeometry args={[0.1, 8]} />
        <meshStandardMaterial color="#1a0a00" />
      </mesh>
      {/* Grass tufts */}
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 8,
            1.1,
            (Math.random() - 0.5) * 0.5,
          ]}
          rotation={[0, 0, (Math.random() - 0.5) * 0.3]}
        >
          <coneGeometry args={[0.03, 0.15 + Math.random() * 0.1, 4]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#4a8a2a' : '#3a7a1a'} />
        </mesh>
      ))}
    </group>
  )
}

// --- Moving ants in tunnels ---
const ANT_COUNT = 30
const antDummy = new THREE.Object3D()

function MovingAnts() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const ants = useMemo(
    () =>
      Array.from({ length: ANT_COUNT }, () => ({
        pathIndex: Math.floor(Math.random() * 3),
        t: Math.random(),
        speed: 0.1 + Math.random() * 0.15,
        scale: 0.03 + Math.random() * 0.015,
      })),
    [],
  )

  // Simplified paths
  const paths = useMemo(
    () => [
      [
        [0, 0.5],
        [0, -0.5],
        [-1, -1.5],
        [-2, -2],
      ],
      [
        [0, 0.5],
        [1, -0.3],
        [2, -1.5],
        [3, -2.5],
      ],
      [
        [0, 0.5],
        [-0.5, -1],
        [-1.5, -2.5],
        [-2.5, -3.5],
      ],
    ],
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < ANT_COUNT; i++) {
      const a = ants[i]
      const path = paths[a.pathIndex]
      const progress = (a.t + t * a.speed) % 1
      const idx = Math.min(
        Math.floor(progress * (path.length - 1)),
        path.length - 2,
      )
      const localT = progress * (path.length - 1) - idx
      const x = path[idx][0] + (path[idx + 1][0] - path[idx][0]) * localT
      const y = path[idx][1] + (path[idx + 1][1] - path[idx][1]) * localT

      antDummy.position.set(x, y, (Math.random() - 0.5) * 0.1)
      antDummy.scale.setScalar(a.scale)
      antDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, antDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, ANT_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#1a0800" roughness={0.6} />
    </instancedMesh>
  )
}

// --- Main Scene ---
export default function AntColonyCrossSection() {
  const tunnelPaths = useMemo(
    () => [
      // Main entrance to deep
      {
        points: [
          [0, 0.8],
          [0, 0],
          [-0.5, -0.8],
          [-1, -1.5],
        ] as [number, number][],
        radius: 0.15,
      },
      // Branch to food storage
      {
        points: [
          [-1, -1.5],
          [-2, -1.8],
          [-3, -2],
        ] as [number, number][],
        radius: 0.12,
      },
      // Branch to queen chamber
      {
        points: [
          [-1, -1.5],
          [-0.5, -2.5],
          [0, -3.5],
        ] as [number, number][],
        radius: 0.15,
      },
      // Branch to nursery
      {
        points: [
          [0, 0],
          [1, -0.5],
          [2, -1],
          [2.5, -1.5],
        ] as [number, number][],
        radius: 0.12,
      },
      // Deep tunnel
      {
        points: [
          [0, -3.5],
          [1, -4],
          [2, -3.8],
        ] as [number, number][],
        radius: 0.1,
      },
      // Side tunnel
      {
        points: [
          [-3, -2],
          [-3.5, -3],
          [-3, -3.8],
        ] as [number, number][],
        radius: 0.1,
      },
    ],
    [],
  )

  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.2} color="#443322" />
      <directionalLight position={[5, 8, 5]} intensity={0.6} color="#ffeecc" />
      <pointLight
        position={[0, -1.5, 2]}
        color="#ff9944"
        intensity={0.4}
        distance={6}
      />
      <pointLight
        position={[-2, -2, 2]}
        color="#ffaa55"
        intensity={0.3}
        distance={5}
      />
      <pointLight
        position={[2, -1, 2]}
        color="#ffaa55"
        intensity={0.3}
        distance={5}
      />

      <EarthMass />
      <Surface />

      {/* Tunnels */}
      {tunnelPaths.map((tp, i) => (
        <Tunnel key={i} points={tp.points} radius={tp.radius} />
      ))}

      {/* Chambers */}
      <Chamber
        position={[-3, -2, 0]}
        width={0.8}
        height={0.6}
        color="#4a3518"
        label="food"
      />
      <Chamber
        position={[0, -3.5, 0]}
        width={1.0}
        height={0.8}
        color="#4a3018"
        label="queen"
      />
      <Chamber
        position={[2.5, -1.5, 0]}
        width={0.7}
        height={0.5}
        color="#4a3518"
        label="nursery"
      />
      <Chamber
        position={[2, -3.8, 0]}
        width={0.5}
        height={0.4}
        color="#3a2a15"
      />
      <Chamber
        position={[-3, -3.8, 0]}
        width={0.6}
        height={0.5}
        color="#3a2a15"
      />

      {/* Static ants */}
      <Ant position={[-2.5, -1.8, 0.2]} rotation={[0, 0.5, 0]} />
      <Ant position={[2.2, -1.3, 0.2]} rotation={[0, -0.3, 0]} />

      <MovingAnts />
    </>
  )
}
