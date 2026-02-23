import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#050510', 8, 25)
    scene.background = new THREE.Color('#050510')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function RoomShell() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#0a0a18" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Floor grid lines */}
      {Array.from({ length: 17 }).map((_, i) => (
        <mesh
          key={`fx-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-8 + i, 0.01, 0]}
        >
          <planeGeometry args={[0.01, 16]} />
          <meshStandardMaterial
            color="#1122aa"
            emissive="#0a1166"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      {Array.from({ length: 17 }).map((_, i) => (
        <mesh
          key={`fz-${i}`}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.01, -8 + i]}
        >
          <planeGeometry args={[16, 0.01]} />
          <meshStandardMaterial
            color="#1122aa"
            emissive="#0a1166"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 5, 0]}>
        <planeGeometry args={[16, 16]} />
        <meshStandardMaterial color="#080810" />
      </mesh>
      {/* Walls */}
      {[
        {
          pos: [0, 2.5, -8] as [number, number, number],
          rot: [0, 0, 0] as [number, number, number],
        },
        {
          pos: [0, 2.5, 8] as [number, number, number],
          rot: [0, Math.PI, 0] as [number, number, number],
        },
        {
          pos: [-8, 2.5, 0] as [number, number, number],
          rot: [0, Math.PI / 2, 0] as [number, number, number],
        },
        {
          pos: [8, 2.5, 0] as [number, number, number],
          rot: [0, -Math.PI / 2, 0] as [number, number, number],
        },
      ].map((wall, i) => (
        <mesh key={i} position={wall.pos} rotation={wall.rot}>
          <planeGeometry args={[16, 5]} />
          <meshStandardMaterial color="#0a0a15" side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  )
}

function HolographicDisplay({
  position,
  rotation,
  width,
  height,
  color,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  width: number
  height: number
  color: string
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.25 + Math.sin(t * 1.5 + position[0]) * 0.08
  })

  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {/* Display surface */}
      <mesh ref={ref}>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Frame border */}
      {[
        {
          pos: [0, height / 2, 0] as [number, number, number],
          size: [width, 0.02, 0.01] as [number, number, number],
        },
        {
          pos: [0, -height / 2, 0] as [number, number, number],
          size: [width, 0.02, 0.01] as [number, number, number],
        },
        {
          pos: [-width / 2, 0, 0] as [number, number, number],
          size: [0.02, height, 0.01] as [number, number, number],
        },
        {
          pos: [width / 2, 0, 0] as [number, number, number],
          size: [0.02, height, 0.01] as [number, number, number],
        },
      ].map((edge, i) => (
        <mesh key={i} position={edge.pos}>
          <boxGeometry args={edge.size} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={3}
          />
        </mesh>
      ))}
      {/* Data bars */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh
          key={`bar-${i}`}
          position={[-width / 2 + 0.3 + i * (width / 6), -height / 4, 0.01]}
        >
          <boxGeometry
            args={[width / 8, height * 0.3 * Math.random() + 0.2, 0.005]}
          />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1.5}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}
    </group>
  )
}

function ControlConsole({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {/* Console desk */}
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[3, 0.1, 1.2]} />
        <meshStandardMaterial color="#1a1a2a" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Front panel */}
      <mesh position={[0, 0.4, 0.55]}>
        <boxGeometry args={[3, 0.8, 0.1]} />
        <meshStandardMaterial color="#151520" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Button arrays */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} position={[-1.2 + i * 0.35, 0.86, -0.1]}>
          <boxGeometry args={[0.15, 0.04, 0.15]} />
          <meshStandardMaterial
            color={i < 3 ? '#0066ff' : i < 6 ? '#00cc44' : '#ff3300'}
            emissive={i < 3 ? '#0044aa' : i < 6 ? '#009933' : '#aa2200'}
            emissiveIntensity={1}
          />
        </mesh>
      ))}
      {/* Embedded screen */}
      <mesh position={[0, 0.87, 0.2]} rotation={[-0.4, 0, 0]}>
        <planeGeometry args={[2.5, 0.6]} />
        <meshStandardMaterial
          color="#003366"
          emissive="#0044aa"
          emissiveIntensity={1.2}
        />
      </mesh>
    </group>
  )
}

function CentralHologram() {
  const groupRef = useRef<THREE.Group>(null!)
  const ringRef0 = useRef<THREE.Mesh>(null!)
  const ringRef1 = useRef<THREE.Mesh>(null!)
  const ringRef2 = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.3

    ringRef0.current.rotation.x = t * 0.5
    ringRef0.current.rotation.z = t * 0.3
    ringRef1.current.rotation.y = t * 0.7
    ringRef1.current.rotation.x = t * 0.2
    ringRef2.current.rotation.z = t * 0.4
    ringRef2.current.rotation.y = t * 0.6
  })

  return (
    <group position={[0, 2.5, 0]}>
      {/* Base platform */}
      <mesh position={[0, -2.3, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.2, 24]} />
        <meshStandardMaterial color="#1a1a2a" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Projection beam */}
      <mesh position={[0, -1.2, 0]}>
        <cylinderGeometry args={[0.02, 1.2, 2.2, 12]} />
        <meshStandardMaterial
          color="#2244ff"
          emissive="#1133cc"
          emissiveIntensity={2}
          transparent
          opacity={0.15}
        />
      </mesh>
      {/* Central hologram group */}
      <group ref={groupRef}>
        {/* Core sphere */}
        <mesh>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial
            color="#4488ff"
            emissive="#2266dd"
            emissiveIntensity={3}
            transparent
            opacity={0.4}
          />
        </mesh>
        {/* Rotating rings */}
        <mesh ref={ringRef0}>
          <torusGeometry args={[0.8, 0.02, 8, 32]} />
          <meshStandardMaterial
            color="#44aaff"
            emissive="#2288dd"
            emissiveIntensity={3}
          />
        </mesh>
        <mesh ref={ringRef1}>
          <torusGeometry args={[1.1, 0.015, 8, 32]} />
          <meshStandardMaterial
            color="#66ccff"
            emissive="#44aadd"
            emissiveIntensity={2.5}
          />
        </mesh>
        <mesh ref={ringRef2}>
          <torusGeometry args={[1.4, 0.01, 8, 32]} />
          <meshStandardMaterial
            color="#88ddff"
            emissive="#66bbdd"
            emissiveIntensity={2}
          />
        </mesh>
        {/* Orbiting data points */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2
          return (
            <mesh
              key={i}
              position={[
                Math.cos(a) * 1.0,
                Math.sin(a) * 0.5,
                Math.sin(a) * 1.0,
              ]}
            >
              <boxGeometry args={[0.06, 0.06, 0.06]} />
              <meshStandardMaterial
                color="#aaddff"
                emissive="#88bbdd"
                emissiveIntensity={3}
              />
            </mesh>
          )
        })}
      </group>
      {/* Hologram glow light */}
      <pointLight
        position={[0, 0, 0]}
        color="#4488ff"
        intensity={8}
        distance={10}
      />
    </group>
  )
}

function CeilingLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.6, 0.05, 0.6]} />
        <meshStandardMaterial
          color="#1a2244"
          emissive="#112233"
          emissiveIntensity={1}
        />
      </mesh>
      <pointLight
        position={[0, -0.5, 0]}
        color="#223366"
        intensity={1}
        distance={6}
      />
    </group>
  )
}

function WallScreenPanel({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.8 + Math.sin(t * 2 + position[0] * 3) * 0.3
  })

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <planeGeometry args={[2, 1.5]} />
      <meshStandardMaterial
        color="#002244"
        emissive="#003366"
        emissiveIntensity={1}
      />
    </mesh>
  )
}

export default function HolographicControlRoom() {
  return (
    <>
      <SceneSetup />

      <ambientLight intensity={0.03} />

      <RoomShell />
      <CentralHologram />

      {/* Control consoles */}
      <ControlConsole position={[0, 0, 5]} rotation={[0, Math.PI, 0]} />
      <ControlConsole position={[-4, 0, 3]} rotation={[0, Math.PI * 0.7, 0]} />
      <ControlConsole position={[4, 0, 3]} rotation={[0, Math.PI * 1.3, 0]} />

      {/* Holographic displays */}
      <HolographicDisplay
        position={[-6, 2.5, -7.9]}
        width={3}
        height={2}
        color="#4488ff"
      />
      <HolographicDisplay
        position={[0, 2.5, -7.9]}
        width={4}
        height={2.5}
        color="#22ccff"
      />
      <HolographicDisplay
        position={[6, 2.5, -7.9]}
        width={3}
        height={2}
        color="#4488ff"
      />
      <HolographicDisplay
        position={[-7.9, 2.5, -3]}
        rotation={[0, Math.PI / 2, 0]}
        width={3}
        height={2}
        color="#66aaff"
      />
      <HolographicDisplay
        position={[7.9, 2.5, -3]}
        rotation={[0, -Math.PI / 2, 0]}
        width={3}
        height={2}
        color="#66aaff"
      />

      {/* Wall screen panels */}
      <WallScreenPanel
        position={[-7.9, 1.5, 3]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <WallScreenPanel
        position={[7.9, 1.5, 3]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* Ceiling lights */}
      <CeilingLight position={[-4, 4.95, -4]} />
      <CeilingLight position={[4, 4.95, -4]} />
      <CeilingLight position={[-4, 4.95, 4]} />
      <CeilingLight position={[4, 4.95, 4]} />
    </>
  )
}
