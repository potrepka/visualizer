import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.background = new THREE.Color('#2a1a0e')
    scene.fog = new THREE.Fog('#2a1a0e', 15, 50)
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function GiantTable() {
  const legPositions: [number, number, number][] = [
    [-4, 2, -3],
    [4, 2, -3],
    [-4, 2, 3],
    [4, 2, 3],
  ]

  return (
    <group>
      {/* Table top */}
      <mesh position={[0, 4.1, 0]}>
        <boxGeometry args={[10, 0.3, 8]} />
        <meshStandardMaterial color="#6a4a2a" roughness={0.7} />
      </mesh>
      {/* Legs */}
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <boxGeometry args={[0.5, 4, 0.5]} />
          <meshStandardMaterial color="#5a3a1a" roughness={0.8} />
        </mesh>
      ))}
      {/* Cross braces */}
      <mesh position={[0, 1.5, -3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[8, 0.2, 0.2]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.5, 3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[8, 0.2, 0.2]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.8} />
      </mesh>
    </group>
  )
}

function GiantPot({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pot body */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[1.0, 0.8, 1.6, 16]} />
        <meshStandardMaterial color="#444" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 1.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.0, 0.08, 8, 24]} />
        <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Handles */}
      {[-1, 1].map((side, i) => (
        <mesh
          key={i}
          position={[side * 1.15, 1.2, 0]}
          rotation={[0, 0, side * 0.3]}
        >
          <torusGeometry args={[0.2, 0.04, 6, 12, Math.PI]} />
          <meshStandardMaterial color="#555" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      {/* Stew inside */}
      <mesh position={[0, 1.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.95, 16]} />
        <meshStandardMaterial color="#8a5a2a" roughness={0.9} />
      </mesh>
    </group>
  )
}

function GiantPan({
  position,
  rotation = 0,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Pan body */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[1.2, 1.2, 0.3, 16]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Handle */}
      <mesh position={[1.8, 0.2, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.08, 0.08, 1.2, 8]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

function GiantSpoon({
  position,
  rotation = 0,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0.1]}>
      {/* Handle */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.5, 6]} />
        <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Spoon bowl */}
      <mesh position={[0, -0.5, 0]}>
        <sphereGeometry args={[0.2, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#888"
          metalness={0.7}
          roughness={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function GiantKnife({
  position,
  rotation = 0,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0.05]}>
      {/* Handle */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.12, 1.0, 0.08]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.7} />
      </mesh>
      {/* Blade */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[0.08, 1.3, 0.02]} />
        <meshStandardMaterial color="#ccc" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function BreadLoaf({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} scale={[1.5, 0.7, 0.8]}>
        <sphereGeometry args={[0.6, 12, 12]} />
        <meshStandardMaterial color="#c8a050" roughness={0.8} />
      </mesh>
      {/* Score marks */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.7, 0]} rotation={[0, 0, 0.2 * (i - 1)]}>
          <boxGeometry args={[0.02, 0.05, 0.8]} />
          <meshStandardMaterial color="#a08040" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function CheeseWheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.7, 16]} />
        <meshStandardMaterial color="#e8c840" roughness={0.6} />
      </mesh>
      {/* Cut wedge missing - represented by a darker area */}
      <mesh position={[0.3, 0.35, 0.3]} rotation={[0, 0.5, 0]}>
        <boxGeometry args={[0.5, 0.72, 0.5]} />
        <meshStandardMaterial color="#d8b830" roughness={0.6} />
      </mesh>
    </group>
  )
}

function GiantBowl({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]}>
        <sphereGeometry args={[0.8, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#d8c8a8"
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Base ring */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.3, 0.06, 6, 16]} />
        <meshStandardMaterial color="#c8b898" roughness={0.7} />
      </mesh>
    </group>
  )
}

function SteamParticles({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = 20

  const data = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 0.5,
        z: (Math.random() - 0.5) * 0.5,
        speed: 0.5 + Math.random() * 0.5,
        phase: Math.random(),
        wobble: 0.1 + Math.random() * 0.2,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const d = data[i]
      const life = (t * d.speed + d.phase) % 2
      dummy.position.set(
        position[0] + d.x + Math.sin(t + d.phase) * d.wobble,
        position[1] + life * 1.5,
        position[2] + d.z + Math.cos(t + d.phase) * d.wobble,
      )
      const fade = Math.max(0, 1 - life / 2)
      dummy.scale.setScalar(0.1 + life * 0.15)
      dummy.scale.multiplyScalar(fade)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.15} />
    </instancedMesh>
  )
}

function HangingPots() {
  return (
    <group position={[0, 9, -4]}>
      {/* Rack */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.05, 0.05, 6, 6]} />
        <meshStandardMaterial color="#4a4a4a" metalness={0.7} />
      </mesh>
      {/* Chains and pots */}
      {[-2, -0.5, 1, 2.5].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.8, 4]} />
            <meshStandardMaterial color="#555" metalness={0.7} />
          </mesh>
          <mesh position={[0, -1, 0]}>
            <cylinderGeometry args={[0.3 + i * 0.05, 0.25, 0.5, 12]} />
            <meshStandardMaterial
              color="#3a3a3a"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Candle({ position }: { position: [number, number, number] }) {
  const flameRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    flameRef.current.scale.y = 0.8 + Math.sin(t * 7 + position[0] * 3) * 0.3
    flameRef.current.scale.x = 0.8 + Math.cos(t * 5 + position[2] * 2) * 0.2
  })

  return (
    <group position={position}>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.6, 8]} />
        <meshStandardMaterial color="#e8dcc0" roughness={0.7} />
      </mesh>
      <mesh ref={flameRef} position={[0, 0.65, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshStandardMaterial
          color="#ffaa22"
          emissive="#ff8800"
          emissiveIntensity={3}
        />
      </mesh>
      <pointLight
        position={[0, 0.7, 0]}
        color="#ff8844"
        intensity={0.5}
        distance={4}
      />
    </group>
  )
}

function KitchenFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#5a4a3a" roughness={0.9} />
    </mesh>
  )
}

function KitchenWalls() {
  return (
    <group>
      <mesh position={[0, 5, -8]}>
        <boxGeometry args={[30, 10, 0.3]} />
        <meshStandardMaterial color="#6a5a4a" roughness={0.85} />
      </mesh>
      <mesh position={[-10, 5, 0]}>
        <boxGeometry args={[0.3, 10, 20]} />
        <meshStandardMaterial color="#6a5a4a" roughness={0.85} />
      </mesh>
      <mesh position={[10, 5, 0]}>
        <boxGeometry args={[0.3, 10, 20]} />
        <meshStandardMaterial color="#6a5a4a" roughness={0.85} />
      </mesh>
    </group>
  )
}

function GiantCup({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.4, 0.3, 1.0, 12]} />
        <meshStandardMaterial color="#c8b090" roughness={0.6} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.5, 0.5, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.2, 0.04, 6, 12, Math.PI]} />
        <meshStandardMaterial color="#c8b090" roughness={0.6} />
      </mesh>
    </group>
  )
}

export default function GiantsKitchen() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[3, 8, 5]} intensity={0.6} color="#ffddaa" />
      <ambientLight intensity={0.15} />

      <KitchenFloor />
      <KitchenWalls />
      <GiantTable />

      {/* Items on table */}
      <GiantPot position={[-2, 4.25, -1]} />
      <SteamParticles position={[-2, 5.8, -1]} />
      <GiantPan position={[2, 4.25, 1]} rotation={0.3} />
      <BreadLoaf position={[0, 4.25, -2]} />
      <CheeseWheel position={[3, 4.25, -1.5]} />
      <GiantBowl position={[-3.5, 4.25, 1]} />
      <GiantCup position={[1, 4.25, 2.5]} />

      {/* Utensils leaning / on table */}
      <GiantSpoon position={[1.5, 4.35, -0.5]} rotation={0.5} />
      <GiantKnife position={[-1, 4.35, 1.5]} rotation={-0.3} />

      <HangingPots />

      {/* Candles on table */}
      <Candle position={[-0.5, 4.25, 0]} />
      <Candle position={[3.5, 4.25, 2]} />

      {/* Floor candle for warm ambient */}
      <Candle position={[-8, 0, -6]} />
      <Candle position={[8, 0, -6]} />
    </>
  )
}
