import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#e8c8a0', 20, 55)
    scene.background = new THREE.Color('#80c8e8')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function StreetGround() {
  return (
    <>
      {/* Road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[8, 35]} />
        <meshStandardMaterial color="#808080" />
      </mesh>
      {/* Sidewalks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-5, 0, 0]}>
        <planeGeometry args={[3, 35]} />
        <meshStandardMaterial color="#c0b8a8" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[5, 0, 0]}>
        <planeGeometry args={[3, 35]} />
        <meshStandardMaterial color="#c0b8a8" />
      </mesh>
    </>
  )
}

function ColonialBuilding({
  position,
  width,
  height,
  color,
  balcony,
}: {
  position: [number, number, number]
  width: number
  height: number
  color: string
  balcony?: boolean
}) {
  const windows = useMemo(() => {
    const arr: [number, number][] = []
    const cols = Math.max(1, Math.floor(width / 1.5))
    const rows = Math.max(1, Math.floor(height / 1.8))
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push([(c - (cols - 1) / 2) * 1.3, 1.2 + r * 1.6])
      }
    }
    return arr
  }, [width, height])

  return (
    <group position={position}>
      {/* Main wall */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, 3]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Windows */}
      {windows.map(([x, y], i) => (
        <group key={i}>
          <mesh position={[x, y, 1.52]}>
            <boxGeometry args={[0.6, 0.9, 0.05]} />
            <meshStandardMaterial color="#3a5a7a" />
          </mesh>
          {/* Window frame */}
          <mesh position={[x, y, 1.53]}>
            <boxGeometry args={[0.7, 1.0, 0.02]} />
            <meshStandardMaterial color="#f0e8d8" />
          </mesh>
          {/* Shutters */}
          <mesh position={[x - 0.4, y, 1.54]}>
            <boxGeometry args={[0.12, 0.9, 0.02]} />
            <meshStandardMaterial color="#3080a0" />
          </mesh>
          <mesh position={[x + 0.4, y, 1.54]}>
            <boxGeometry args={[0.12, 0.9, 0.02]} />
            <meshStandardMaterial color="#3080a0" />
          </mesh>
        </group>
      ))}
      {/* Door */}
      <mesh position={[0, 0.9, 1.52]}>
        <boxGeometry args={[1, 1.8, 0.05]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>
      {/* Balcony */}
      {balcony && height > 3 && (
        <group>
          <mesh position={[0, 2.8, 2]}>
            <boxGeometry args={[width * 0.6, 0.08, 1]} />
            <meshStandardMaterial color="#4a4a4a" />
          </mesh>
          {/* Railing */}
          <mesh position={[0, 3.2, 2.45]}>
            <boxGeometry args={[width * 0.6, 0.6, 0.05]} />
            <meshStandardMaterial color="#3a3a3a" />
          </mesh>
          {/* Railing posts */}
          {[-1, 0, 1].map((x, i) => (
            <mesh key={i} position={[x * width * 0.25, 3.1, 2.45]}>
              <cylinderGeometry args={[0.02, 0.02, 0.5, 5]} />
              <meshStandardMaterial color="#3a3a3a" />
            </mesh>
          ))}
        </group>
      )}
      {/* Cornice */}
      <mesh position={[0, height + 0.05, 0.2]}>
        <boxGeometry args={[width + 0.2, 0.15, 3.4]} />
        <meshStandardMaterial color="#f0e8d0" />
      </mesh>
    </group>
  )
}

function VintageCar({
  position,
  color,
  rotation,
}: {
  position: [number, number, number]
  color: string
  rotation?: number
}) {
  const ref = useRef<THREE.Group>(null!)

  return (
    <group ref={ref} position={position} rotation={[0, rotation ?? 0, 0]}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.6, 0.5, 3.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.9, -0.2]}>
        <boxGeometry args={[1.4, 0.5, 1.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 0.9, 0.72]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.03]} />
        <meshStandardMaterial color="#88aacc" transparent opacity={0.6} />
      </mesh>
      {/* Hood */}
      <mesh position={[0, 0.65, 1.3]}>
        <boxGeometry args={[1.3, 0.25, 1]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Front bumper */}
      <mesh position={[0, 0.35, 1.85]}>
        <boxGeometry args={[1.5, 0.12, 0.12]} />
        <meshStandardMaterial color="#c0c0c0" />
      </mesh>
      {/* Headlights */}
      {[-0.55, 0.55].map((x, i) => (
        <mesh key={i} position={[x, 0.55, 1.8]}>
          <sphereGeometry args={[0.08, 6, 5]} />
          <meshStandardMaterial
            color="#e8e8a0"
            emissive="#e8e8a0"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      {/* Wheels */}
      {[
        [-0.8, 0.25, 1],
        [0.8, 0.25, 1],
        [-0.8, 0.25, -1],
        [0.8, 0.25, -1],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.15, 10]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      ))}
      {/* Wheel hubs */}
      {[
        [-0.88, 0.25, 1],
        [0.88, 0.25, 1],
        [-0.88, 0.25, -1],
        [0.88, 0.25, -1],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.08, 0.08, 0.02, 8]} />
          <meshStandardMaterial color="#c0c0c0" />
        </mesh>
      ))}
    </group>
  )
}

function PalmTree({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.x = Math.sin(t * 0.5) * 0.02
    ref.current.rotation.z = Math.cos(t * 0.4) * 0.02
  })

  const fronds = useMemo(() => {
    const arr: number[] = []
    for (let i = 0; i < 7; i++) {
      arr.push((i / 7) * Math.PI * 2)
    }
    return arr
  }, [])

  return (
    <group ref={ref} position={position}>
      {/* Trunk */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.12, 0.2, 5, 8]} />
        <meshStandardMaterial color="#8a7050" />
      </mesh>
      {/* Trunk rings */}
      {Array.from({ length: 8 }, (_, i) => (
        <mesh key={i} position={[0, 0.5 + i * 0.6, 0]}>
          <cylinderGeometry
            args={[0.18 - i * 0.008, 0.18 - i * 0.008, 0.05, 8]}
          />
          <meshStandardMaterial color="#7a6040" />
        </mesh>
      ))}
      {/* Fronds */}
      {fronds.map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.8, 4.8, Math.sin(angle) * 0.8]}
          rotation={[Math.cos(angle) * 0.8, 0, -Math.sin(angle) * 0.8]}
        >
          <boxGeometry args={[0.15, 0.03, 2]} />
          <meshStandardMaterial color="#2a7a2a" side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Coconuts */}
      {[
        [-0.1, 4.6, 0.1],
        [0.1, 4.55, -0.08],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.08, 6, 5]} />
          <meshStandardMaterial color="#5a4a2a" />
        </mesh>
      ))}
    </group>
  )
}

function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 3.6, 6]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Arm */}
      <mesh position={[0.3, 3.4, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.03, 0.03, 0.8, 5]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
      {/* Light fixture */}
      <mesh position={[0.5, 3.5, 0]}>
        <sphereGeometry args={[0.12, 8, 6]} />
        <meshStandardMaterial
          color="#e8d880"
          emissive="#e8d880"
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

export default function HavanaStreet() {
  const leftColors = ['#e8c060', '#e06060', '#60b8e0', '#e8a060', '#80c878']
  const rightColors = ['#d898c8', '#e8d060', '#60c0a0', '#e88050', '#a8c8e0']

  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 10, 3]} intensity={1.2} color="#ffe8c0" />
      <ambientLight intensity={0.35} color="#ffd8a0" />
      <hemisphereLight args={['#80c8e8', '#c0a080', 0.25]} />

      <StreetGround />

      {/* Left side buildings */}
      {leftColors.map((color, i) => (
        <ColonialBuilding
          key={`l${i}`}
          position={[-5, 0, -12 + i * 5.5]}
          width={4.5}
          height={4 + (i % 2) * 1.5}
          color={color}
          balcony={i % 2 === 0}
        />
      ))}

      {/* Right side buildings */}
      {rightColors.map((color, i) => (
        <ColonialBuilding
          key={`r${i}`}
          position={[5, 0, -10 + i * 5.5]}
          width={4.5}
          height={3.5 + (i % 3) * 1}
          color={color}
          balcony={i % 2 === 1}
        />
      ))}

      {/* Vintage cars */}
      <VintageCar position={[-1.5, 0, -4]} color="#d03030" />
      <VintageCar position={[1.5, 0, 5]} color="#30a0d0" rotation={Math.PI} />
      <VintageCar position={[-1.5, 0, 10]} color="#e8c040" />

      {/* Palm trees */}
      <PalmTree position={[-3.5, 0, 0]} />
      <PalmTree position={[3.5, 0, 8]} />

      {/* Street lamps */}
      <StreetLamp position={[-3.5, 0, -8]} />
      <StreetLamp position={[3.5, 0, -3]} />
      <StreetLamp position={[-3.5, 0, 6]} />
      <StreetLamp position={[3.5, 0, 12]} />
    </>
  )
}
