import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.background = new THREE.Color('#1a0f0a')
    scene.fog = new THREE.Fog('#1a0f0a', 10, 35)
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function ChamberWalls() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#2a1a0e" roughness={0.95} />
      </mesh>
      {/* Back wall */}
      <mesh position={[0, 5, -12]}>
        <boxGeometry args={[30, 10, 0.5]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.9} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-12, 5, 0]}>
        <boxGeometry args={[0.5, 10, 30]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.9} />
      </mesh>
      <mesh position={[12, 5, 0]}>
        <boxGeometry args={[0.5, 10, 30]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.9} />
      </mesh>
      {/* Ceiling */}
      <mesh position={[0, 10, 0]}>
        <boxGeometry args={[30, 0.5, 30]} />
        <meshStandardMaterial color="#2a1a0e" roughness={0.95} />
      </mesh>
    </group>
  )
}

function Column({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.8]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.85} />
      </mesh>
      <mesh position={[0, 4.5, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 8.4, 12]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 8.85, 0]}>
        <boxGeometry args={[0.9, 0.3, 0.9]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.85} />
      </mesh>
    </group>
  )
}

const GOLD_COUNT = 300
const goldDummy = new THREE.Object3D()

function GoldPile({
  position,
  spread,
  count,
}: {
  position: [number, number, number]
  spread: number
  count: number
}) {
  const ref = useRef<THREE.InstancedMesh>(null!)

  const items = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * spread,
      y: Math.random() * spread * 0.4,
      z: (Math.random() - 0.5) * spread,
      scaleX: 0.05 + Math.random() * 0.08,
      scaleY: 0.05 + Math.random() * 0.08,
      scaleZ: 0.05 + Math.random() * 0.08,
      rotX: Math.random() * Math.PI,
      rotY: Math.random() * Math.PI,
      type: Math.random(),
    }))
  }, [spread, count])

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      const it = items[i]
      goldDummy.position.set(it.x, it.y, it.z)
      goldDummy.rotation.set(it.rotX, it.rotY, 0)
      goldDummy.scale.set(it.scaleX, it.scaleY, it.scaleZ)
      goldDummy.updateMatrix()
      ref.current.setMatrixAt(i, goldDummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [items, count])

  return (
    <group position={position}>
      <instancedMesh ref={ref} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial
          color="#daa520"
          metalness={0.9}
          roughness={0.15}
        />
      </instancedMesh>
    </group>
  )
}

function TreasureChest({
  position,
  rotation = 0,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.5]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.7} />
      </mesh>
      {/* Lid (slightly open) */}
      <mesh position={[0, 0.55, -0.1]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[0.82, 0.08, 0.52]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.7} />
      </mesh>
      {/* Metal bands */}
      {[-0.25, 0, 0.25].map((x, i) => (
        <mesh key={i} position={[x, 0.25, 0.26]}>
          <boxGeometry args={[0.06, 0.5, 0.02]} />
          <meshStandardMaterial
            color="#8a7a3a"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* Gold spilling out */}
      <GoldPile position={[0, 0.5, 0.3]} spread={0.5} count={30} />
    </group>
  )
}

function Torch({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    flameRef.current.scale.y = 0.8 + Math.sin(t * 8 + position[0]) * 0.3
    flameRef.current.scale.x = 0.8 + Math.sin(t * 6 + position[2]) * 0.2
  })

  return (
    <group position={position}>
      {/* Bracket */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 0.6, 6]} />
        <meshStandardMaterial color="#444" metalness={0.6} />
      </mesh>
      {/* Flame */}
      <mesh ref={flameRef} position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#ff6600"
          emissive="#ff4400"
          emissiveIntensity={3}
        />
      </mesh>
      <pointLight
        position={[0, 0.5, 0]}
        color="#ff6622"
        intensity={2}
        distance={8}
      />
    </group>
  )
}

function DragonSkeleton({ position }: { position: [number, number, number] }) {
  const boneColor = '#e8e0d0'
  return (
    <group position={position} rotation={[0, 0.3, 0]}>
      {/* Skull */}
      <mesh position={[0, 1.2, 2]}>
        <boxGeometry args={[0.8, 0.5, 1.2]} />
        <meshStandardMaterial color={boneColor} roughness={0.6} />
      </mesh>
      {/* Jaw */}
      <mesh position={[0, 0.85, 2.4]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.6, 0.15, 0.8]} />
        <meshStandardMaterial color={boneColor} roughness={0.6} />
      </mesh>
      {/* Horns */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh
          key={i}
          position={[x, 1.7, 1.7]}
          rotation={[0.5, x > 0 ? 0.3 : -0.3, 0]}
        >
          <coneGeometry args={[0.06, 0.6, 6]} />
          <meshStandardMaterial color={boneColor} roughness={0.5} />
        </mesh>
      ))}
      {/* Spine */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh
          key={i}
          position={[0, 0.8 + i * 0.02, 1.5 - i * 0.35]}
          rotation={[0.1 * i * 0.05, 0, 0]}
        >
          <sphereGeometry args={[0.12 - i * 0.005, 6, 6]} />
          <meshStandardMaterial color={boneColor} roughness={0.6} />
        </mesh>
      ))}
      {/* Ribs */}
      {Array.from({ length: 6 }).map((_, i) =>
        [-0.3, 0.3].map((side, j) => (
          <mesh
            key={`${i}-${j}`}
            position={[side * (1 + i * 0.05), 0.6 - i * 0.05, 0.5 - i * 0.35]}
            rotation={[0, 0, side > 0 ? -0.6 : 0.6]}
          >
            <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
            <meshStandardMaterial color={boneColor} roughness={0.6} />
          </mesh>
        )),
      )}
      {/* Wing bones */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <mesh position={[side * 0.5, 1.0, 0]} rotation={[0, 0, side * 0.8]}>
            <cylinderGeometry args={[0.03, 0.02, 2, 4]} />
            <meshStandardMaterial color={boneColor} roughness={0.6} />
          </mesh>
          <mesh position={[side * 1.5, 1.8, 0]} rotation={[0, 0, side * 1.2]}>
            <cylinderGeometry args={[0.02, 0.01, 1.5, 4]} />
            <meshStandardMaterial color={boneColor} roughness={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Gems() {
  const gems = useMemo(() => {
    return Array.from({ length: 15 }).map(() => ({
      pos: [
        (Math.random() - 0.5) * 8,
        0.1 + Math.random() * 0.5,
        (Math.random() - 0.5) * 8,
      ] as [number, number, number],
      color: ['#ff2244', '#2244ff', '#22ff44', '#ff44ff', '#44ffff'][
        Math.floor(Math.random() * 5)
      ],
      scale: 0.06 + Math.random() * 0.08,
    }))
  }, [])

  return (
    <>
      {gems.map((g, i) => (
        <mesh key={i} position={g.pos}>
          <octahedronGeometry args={[g.scale, 0]} />
          <meshStandardMaterial
            color={g.color}
            emissive={g.color}
            emissiveIntensity={0.5}
            metalness={0.3}
            roughness={0.1}
          />
        </mesh>
      ))}
    </>
  )
}

export default function DragonsHoard() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.05} />

      <ChamberWalls />

      <Column position={[-5, 0, -5]} />
      <Column position={[5, 0, -5]} />
      <Column position={[-5, 0, 5]} />
      <Column position={[5, 0, 5]} />

      <Torch position={[-5, 4, -5]} />
      <Torch position={[5, 4, -5]} />
      <Torch position={[-5, 4, 5]} />
      <Torch position={[5, 4, 5]} />

      <GoldPile position={[0, 0, 0]} spread={5} count={GOLD_COUNT} />
      <GoldPile position={[-4, 0, -3]} spread={2.5} count={100} />
      <GoldPile position={[4, 0, 3]} spread={3} count={150} />

      <TreasureChest position={[-2, 0, 2]} rotation={0.5} />
      <TreasureChest position={[3, 0, -2]} rotation={-0.3} />
      <TreasureChest position={[0, 0, -4]} rotation={1.2} />

      <Gems />
      <DragonSkeleton position={[0, 0, -6]} />
    </>
  )
}
