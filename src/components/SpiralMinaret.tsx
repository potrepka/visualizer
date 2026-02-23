import { useFrame, useThree } from '@react-three/fiber'
import { type JSX, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#e8d8b0', 30, 100)
    scene.background = new THREE.Color('#d0c0a0')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function MinaretTower() {
  return (
    <group>
      {/* Main cylinder body */}
      <mesh position={[0, 6, 0]}>
        <cylinderGeometry args={[1.5, 2.0, 12, 24]} />
        <meshStandardMaterial color="#d4c0a0" roughness={0.8} />
      </mesh>
      {/* Top balcony */}
      <mesh position={[0, 12.2, 0]}>
        <cylinderGeometry args={[2.0, 1.5, 0.3, 24]} />
        <meshStandardMaterial color="#c4b090" roughness={0.7} />
      </mesh>
      {/* Balcony railing */}
      <mesh position={[0, 12.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.08, 8, 24]} />
        <meshStandardMaterial color="#b4a080" roughness={0.7} />
      </mesh>
      {/* Upper section */}
      <mesh position={[0, 13.5, 0]}>
        <cylinderGeometry args={[1.0, 1.3, 2.0, 16]} />
        <meshStandardMaterial color="#d4c0a0" roughness={0.8} />
      </mesh>
      {/* Conical cap */}
      <mesh position={[0, 15.5, 0]}>
        <coneGeometry args={[1.2, 2.5, 16]} />
        <meshStandardMaterial color="#c4b090" roughness={0.7} />
      </mesh>
      {/* Crescent finial */}
      <mesh position={[0, 17.2, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#c8a030" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.1, 17.5, 0]} rotation={[0, 0, 0.3]}>
        <torusGeometry args={[0.15, 0.03, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#c8a030" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}

function SpiralRamp() {
  const segments = useMemo(() => {
    const arr = []
    const turns = 4
    const totalSteps = 80
    const heightPerTurn = 3
    const radius = 2.2

    for (let i = 0; i < totalSteps; i++) {
      const t = i / totalSteps
      const angle = t * turns * Math.PI * 2
      const y = t * turns * heightPerTurn
      const x = Math.cos(angle) * radius
      const z = Math.sin(angle) * radius
      arr.push({ x, y, z, angle })
    }
    return arr
  }, [])

  return (
    <group>
      {segments.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, s.y + 0.1, s.z]}
          rotation={[0, -s.angle, 0]}
        >
          <boxGeometry args={[1.0, 0.15, 0.4]} />
          <meshStandardMaterial color="#c4b090" roughness={0.85} />
        </mesh>
      ))}
      {/* Ramp railing (outer edge markers) */}
      {segments
        .filter((_, i) => i % 4 === 0)
        .map((s, i) => (
          <mesh
            key={`rail-${i}`}
            position={[s.x * 1.15, s.y + 0.35, s.z * 1.15]}
          >
            <boxGeometry args={[0.06, 0.5, 0.06]} />
            <meshStandardMaterial color="#b4a080" roughness={0.8} />
          </mesh>
        ))}
    </group>
  )
}

function MosqueBase() {
  return (
    <group position={[8, 0, 0]}>
      {/* Main building */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[8, 4, 6]} />
        <meshStandardMaterial color="#d4c0a0" roughness={0.8} />
      </mesh>
      {/* Dome */}
      <mesh position={[0, 4.8, 0]}>
        <sphereGeometry args={[2.5, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#c4b090" roughness={0.6} />
      </mesh>
      {/* Dome drum */}
      <mesh position={[0, 4.0, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.4, 24]} />
        <meshStandardMaterial color="#b4a080" roughness={0.7} />
      </mesh>
      {/* Entrance arch */}
      <mesh position={[0, 1.5, 3.1]}>
        <boxGeometry args={[2.0, 3.0, 0.3]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>
      <mesh position={[0, 3.2, 3.1]}>
        <cylinderGeometry args={[1.0, 1.0, 0.3, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#c4b090" roughness={0.7} />
      </mesh>
      {/* Windows */}
      {[-2, 0, 2].map((x, i) => (
        <mesh key={i} position={[x, 2.5, 3.01]}>
          <boxGeometry args={[0.6, 1.0, 0.05]} />
          <meshStandardMaterial color="#6688aa" transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function CourtyardWall({
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
      <meshStandardMaterial color="#d4c0a0" roughness={0.85} />
    </mesh>
  )
}

function GeometricPattern({
  position,
}: {
  position: [number, number, number]
}) {
  const elements: JSX.Element[] = []
  const gridSize = 4
  const cellSize = 0.3

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const isStarCell = (x + y) % 2 === 0
      elements.push(
        <mesh
          key={`${x}-${y}`}
          position={[
            (x - gridSize / 2) * cellSize,
            (y - gridSize / 2) * cellSize,
            0,
          ]}
        >
          <boxGeometry args={[cellSize * 0.85, cellSize * 0.85, 0.04]} />
          <meshStandardMaterial
            color={isStarCell ? '#1a6a8a' : '#c8a030'}
            roughness={0.5}
          />
        </mesh>,
      )
    }
  }

  return <group position={position}>{elements}</group>
}

function Courtyard() {
  return (
    <group position={[8, 0, 8]}>
      {/* Floor */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#c8b898" roughness={0.7} />
      </mesh>
      {/* Walls */}
      <CourtyardWall position={[-6, 1, 0]} size={[0.3, 2, 8]} />
      <CourtyardWall position={[6, 1, 0]} size={[0.3, 2, 8]} />
      <CourtyardWall position={[0, 1, -4]} size={[12, 2, 0.3]} />
      {/* Small fountain */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.8, 1.0, 0.4, 12]} />
        <meshStandardMaterial color="#b4a080" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.42, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.75, 16]} />
        <meshStandardMaterial
          color="#4488aa"
          metalness={0.3}
          roughness={0.1}
          transparent
          opacity={0.8}
        />
      </mesh>
    </group>
  )
}

function FloatingDust() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const count = 80
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 30,
        y: 1 + Math.random() * 15,
        z: (Math.random() - 0.5) * 30,
        speed: 0.1 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const p = particles[i]
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 2,
        p.y + Math.sin(t * p.speed * 0.7 + p.phase) * 0.5,
        p.z + Math.cos(t * p.speed + p.phase) * 2,
      )
      dummy.scale.setScalar(0.03 + Math.sin(t + p.phase) * 0.015)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial color="#e8d8b0" transparent opacity={0.4} />
    </instancedMesh>
  )
}

export default function SpiralMinaret() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[8, 15, 5]} color="#fff5d0" intensity={1.5} />
      <ambientLight intensity={0.3} />
      <hemisphereLight args={['#fff5d0', '#8a7a5a', 0.3]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#c8b888" />
      </mesh>

      <MinaretTower />
      <SpiralRamp />
      <MosqueBase />
      <Courtyard />

      {/* Geometric patterns on tower */}
      <GeometricPattern position={[0, 4, 2.01]} />
      <GeometricPattern position={[0, 7, 1.81]} />
      <GeometricPattern position={[2.01, 4, 0]} />

      <FloatingDust />
    </>
  )
}
