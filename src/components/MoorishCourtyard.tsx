import { useFrame, useThree } from '@react-three/fiber'
import { type JSX, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#e8d8c0', 30, 80)
    scene.background = new THREE.Color('#87CEEB')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Column({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 0.2, 8]} />
        <meshStandardMaterial color="#e8d8c0" roughness={0.7} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.12, 0.15, 2.8, 12]} />
        <meshStandardMaterial color="#f0e0c8" roughness={0.6} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, 3.1, 0]}>
        <cylinderGeometry args={[0.25, 0.12, 0.2, 8]} />
        <meshStandardMaterial color="#e8d8c0" roughness={0.7} />
      </mesh>
    </group>
  )
}

function MoorishArch({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  const segments = 16
  const archRadius = 1.2
  const elements: JSX.Element[] = []

  // Horseshoe arch segments
  for (let i = 0; i <= segments; i++) {
    const angle = -Math.PI / 6 + ((Math.PI + Math.PI / 3) / segments) * i
    const x = Math.cos(angle) * archRadius
    const y = Math.sin(angle) * archRadius + 3.2
    elements.push(
      <mesh
        key={`arch-${i}`}
        position={[x, y, 0]}
        rotation={[0, 0, angle - Math.PI / 2]}
      >
        <boxGeometry args={[0.12, 0.25, 0.3]} />
        <meshStandardMaterial
          color={i % 2 === 0 ? '#cc4444' : '#f0e0c8'}
          roughness={0.7}
        />
      </mesh>,
    )
  }

  // Geometric pattern decorations above arch
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 3; j++) {
      elements.push(
        <mesh
          key={`deco-${i}-${j}`}
          position={[-0.8 + i * 0.4, 4.6 + j * 0.25, 0.01]}
        >
          <boxGeometry args={[0.15, 0.1, 0.05]} />
          <meshStandardMaterial
            color={(i + j) % 2 === 0 ? '#1a6a8a' : '#c8a030'}
            roughness={0.6}
          />
        </mesh>,
      )
    }
  }

  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {elements}
    </group>
  )
}

function TiledFloor() {
  const tiles: JSX.Element[] = []
  const size = 10
  const tileSize = 0.48
  const colors = ['#1a6a8a', '#c8a030', '#f0e0c8', '#cc4444']

  for (let x = -size; x <= size; x++) {
    for (let z = -size; z <= size; z++) {
      const colorIndex = (Math.abs(x) + Math.abs(z)) % colors.length
      tiles.push(
        <mesh
          key={`${x}-${z}`}
          position={[x * 0.5, 0.01, z * 0.5]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[tileSize, tileSize]} />
          <meshStandardMaterial color={colors[colorIndex]} roughness={0.5} />
        </mesh>,
      )
    }
  }

  return <group>{tiles}</group>
}

function FountainBasin() {
  return (
    <group>
      {/* Outer basin */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[1.5, 1.7, 0.5, 16]} />
        <meshStandardMaterial color="#d0c0a0" roughness={0.6} />
      </mesh>
      {/* Water surface */}
      <mesh position={[0, 0.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.4, 24]} />
        <meshStandardMaterial
          color="#4488aa"
          metalness={0.4}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Inner column */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.1, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#d0c0a0" roughness={0.6} />
      </mesh>
      {/* Top bowl */}
      <mesh position={[0, 1.3, 0]}>
        <cylinderGeometry args={[0.4, 0.1, 0.2, 12]} />
        <meshStandardMaterial color="#d0c0a0" roughness={0.6} />
      </mesh>
    </group>
  )
}

function WaterSpout() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    meshRef.current.scale.y = 0.8 + Math.sin(t * 3) * 0.2
    meshRef.current.position.y = 1.5 + Math.sin(t * 3) * 0.05
  })

  return (
    <mesh ref={meshRef} position={[0, 1.5, 0]}>
      <cylinderGeometry args={[0.02, 0.05, 0.4, 8]} />
      <meshStandardMaterial
        color="#66aacc"
        transparent
        opacity={0.6}
        emissive="#4488aa"
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

function OrangeTree({ position }: { position: [number, number, number] }) {
  const orangePositions = useMemo(() => {
    const arr: [number, number, number][] = []
    for (let i = 0; i < 6; i++) {
      arr.push([
        (Math.random() - 0.5) * 0.8,
        1.5 + Math.random() * 0.6,
        (Math.random() - 0.5) * 0.8,
      ])
    }
    return arr
  }, [])

  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 1.2, 6]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.7, 10, 10]} />
        <meshStandardMaterial color="#2a6a2a" />
      </mesh>
      <mesh position={[0.2, 1.8, 0.2]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="#3a7a3a" />
      </mesh>
      {/* Oranges */}
      {orangePositions.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#ff8800" />
        </mesh>
      ))}
    </group>
  )
}

function Wall({
  position,
  size,
  rotation,
}: {
  position: [number, number, number]
  size: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#f0e0c8" roughness={0.8} />
    </mesh>
  )
}

function GeometricStarPattern({
  position,
}: {
  position: [number, number, number]
}) {
  const elements: JSX.Element[] = []
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2
    const r = 0.3
    elements.push(
      <mesh
        key={i}
        position={[Math.cos(angle) * r, Math.sin(angle) * r, 0]}
        rotation={[0, 0, angle]}
      >
        <boxGeometry args={[0.08, 0.25, 0.04]} />
        <meshStandardMaterial color={i % 2 === 0 ? '#1a6a8a' : '#c8a030'} />
      </mesh>,
    )
  }
  return <group position={position}>{elements}</group>
}

export default function MoorishCourtyard() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 10, 3]} color="#fff5e0" intensity={1.5} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#87CEEB', '#d4c4a4', 0.3]} />

      {/* Ground base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#d4c4a4" />
      </mesh>

      <TiledFloor />

      {/* Walls */}
      <Wall position={[0, 2.5, -5.5]} size={[12, 5, 0.4]} />
      <Wall position={[0, 2.5, 5.5]} size={[12, 5, 0.4]} />
      <Wall position={[-5.5, 2.5, 0]} size={[0.4, 5, 12]} />
      <Wall position={[5.5, 2.5, 0]} size={[0.4, 5, 12]} />

      {/* Columns and arches along walls */}
      {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
        <Column key={`front-${i}`} position={[x, 0, -4]} />
      ))}
      {[-3, -1.5, 0, 1.5, 3].map((x, i) => (
        <Column key={`back-${i}`} position={[x, 0, 4]} />
      ))}

      {/* Arches */}
      <MoorishArch position={[-1.5, 0, -5.3]} />
      <MoorishArch position={[1.5, 0, -5.3]} />
      <MoorishArch position={[-1.5, 0, 5.3]} rotation={[0, Math.PI, 0]} />
      <MoorishArch position={[1.5, 0, 5.3]} rotation={[0, Math.PI, 0]} />

      {/* Geometric star patterns on walls */}
      <GeometricStarPattern position={[0, 3.5, -5.28]} />
      <GeometricStarPattern position={[-3, 3.5, -5.28]} />
      <GeometricStarPattern position={[3, 3.5, -5.28]} />

      {/* Fountain */}
      <FountainBasin />
      <WaterSpout />

      {/* Orange trees */}
      <OrangeTree position={[-3, 0, -2]} />
      <OrangeTree position={[3, 0, -2]} />
      <OrangeTree position={[-3, 0, 2]} />
      <OrangeTree position={[3, 0, 2]} />
    </>
  )
}
