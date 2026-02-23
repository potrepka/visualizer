import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a2a1a', 8, 40)
    scene.background = new THREE.Color('#0e1a0e')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function GiantMushroom({
  position,
  stemHeight,
  capRadius,
  capColor,
  stemColor,
}: {
  position: [number, number, number]
  stemHeight: number
  capRadius: number
  capColor: string
  stemColor: string
}) {
  const capRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    capRef.current.rotation.y = Math.sin(t * 0.3 + position[0]) * 0.02
    capRef.current.position.y =
      stemHeight + 0.1 + Math.sin(t * 0.5 + position[2]) * 0.05
  })

  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, stemHeight / 2, 0]}>
        <cylinderGeometry
          args={[capRadius * 0.15, capRadius * 0.2, stemHeight, 12]}
        />
        <meshStandardMaterial color={stemColor} roughness={0.8} />
      </mesh>
      {/* Cap - sphere top half */}
      <mesh ref={capRef} position={[0, stemHeight + 0.1, 0]}>
        <sphereGeometry
          args={[capRadius, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          color={capColor}
          roughness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Cap underside */}
      <mesh position={[0, stemHeight + 0.08, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[capRadius, 0.2, 16]} />
        <meshStandardMaterial color="#e8d8c0" roughness={0.9} />
      </mesh>
      {/* Spots on cap */}
      {Array.from({ length: 5 }).map((_, i) => {
        const angle = (i / 5) * Math.PI * 2
        const r = capRadius * 0.5
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * r,
              stemHeight + capRadius * 0.35,
              Math.sin(angle) * r,
            ]}
          >
            <sphereGeometry args={[capRadius * 0.08, 8, 8]} />
            <meshStandardMaterial color="#ffffffcc" transparent opacity={0.8} />
          </mesh>
        )
      })}
    </group>
  )
}

function SmallMushroom({
  position,
  color,
}: {
  position: [number, number, number]
  color: string
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.02, 0.03, 0.2, 6]} />
        <meshStandardMaterial color="#d4c8a0" />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <sphereGeometry args={[0.06, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

const SPORE_COUNT = 150
const sporeDummy = new THREE.Object3D()

function GlowingSpores() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const spores = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      speed: number
      drift: number
      phase: number
    }[] = []
    for (let i = 0; i < SPORE_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 20,
        y: 0.5 + Math.random() * 6,
        z: (Math.random() - 0.5) * 20,
        speed: 0.1 + Math.random() * 0.3,
        drift: 0.5 + Math.random() * 1.0,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < SPORE_COUNT; i++) {
      const s = spores[i]
      const y = s.y + Math.sin(t * s.speed + s.phase) * 1.0
      const x = s.x + Math.sin(t * 0.2 + s.phase) * s.drift
      const z = s.z + Math.cos(t * 0.15 + s.phase) * s.drift
      sporeDummy.position.set(x, y, z)
      sporeDummy.scale.setScalar(0.02 + Math.sin(t * 2 + s.phase) * 0.01)
      sporeDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, sporeDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SPORE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#88ff88"
        emissive="#44ff44"
        emissiveIntensity={2.0}
        transparent
        opacity={0.6}
      />
    </instancedMesh>
  )
}

function MossyGround() {
  const patches = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      size: number
      color: string
    }[] = []
    for (let i = 0; i < 25; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 20, 0.01, (Math.random() - 0.5) * 20],
        size: 0.5 + Math.random() * 1.5,
        color: i % 3 === 0 ? '#2a5a2a' : i % 3 === 1 ? '#3a6a30' : '#1e4a1e',
      })
    }
    return arr
  }, [])

  return (
    <group>
      {/* Base ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#1a3018" />
      </mesh>
      {/* Moss patches */}
      {patches.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[p.size, 12]} />
          <meshStandardMaterial color={p.color} />
        </mesh>
      ))}
    </group>
  )
}

function FallenLog({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.2, 2.5, 8]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.95} />
      </mesh>
      {/* Moss on log */}
      <mesh position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.12, 0.12, 1.8, 8, 1, false, 0, Math.PI]} />
        <meshStandardMaterial
          color="#2a5a20"
          roughness={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function MushroomCluster({ position }: { position: [number, number, number] }) {
  const colors = ['#ff6688', '#ffaa44', '#aa66ff', '#66ccff', '#ff4466']
  return (
    <group position={position}>
      {Array.from({ length: 4 }).map((_, i) => (
        <SmallMushroom
          key={i}
          position={[
            (Math.random() - 0.5) * 0.3,
            0,
            (Math.random() - 0.5) * 0.3,
          ]}
          color={colors[i % colors.length]}
        />
      ))}
    </group>
  )
}

export default function MushroomForest() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[3, 8, 2]} intensity={0.3} color="#aaddaa" />
      <ambientLight intensity={0.15} color="#224422" />
      <pointLight
        position={[0, 4, 0]}
        color="#44ff66"
        intensity={1.5}
        distance={15}
      />
      <pointLight
        position={[-5, 3, 3]}
        color="#66aaff"
        intensity={1.0}
        distance={12}
      />

      <MossyGround />

      {/* Giant mushrooms */}
      <GiantMushroom
        position={[0, 0, 0]}
        stemHeight={3}
        capRadius={2}
        capColor="#cc3344"
        stemColor="#e8d8c0"
      />
      <GiantMushroom
        position={[-4, 0, -3]}
        stemHeight={4}
        capRadius={2.5}
        capColor="#dd5566"
        stemColor="#d8c8a0"
      />
      <GiantMushroom
        position={[5, 0, -1]}
        stemHeight={2.5}
        capRadius={1.8}
        capColor="#bb2244"
        stemColor="#e0d0b0"
      />
      <GiantMushroom
        position={[-2, 0, 4]}
        stemHeight={3.5}
        capRadius={2.2}
        capColor="#aa44cc"
        stemColor="#d0c0a0"
      />
      <GiantMushroom
        position={[3, 0, 5]}
        stemHeight={2}
        capRadius={1.5}
        capColor="#4488cc"
        stemColor="#ddd0b8"
      />
      <GiantMushroom
        position={[-6, 0, 1]}
        stemHeight={4.5}
        capRadius={2.8}
        capColor="#ee6644"
        stemColor="#e8d0b0"
      />
      <GiantMushroom
        position={[7, 0, -4]}
        stemHeight={3}
        capRadius={2.0}
        capColor="#cc66aa"
        stemColor="#d8c8a8"
      />

      {/* Small mushroom clusters */}
      <MushroomCluster position={[1, 0, 2]} />
      <MushroomCluster position={[-3, 0, 1]} />
      <MushroomCluster position={[4, 0, 3]} />
      <MushroomCluster position={[-1, 0, -4]} />

      {/* Fallen logs */}
      <FallenLog position={[2, 0, -2]} rotation={[0, 0.5, 0]} />
      <FallenLog position={[-5, 0, 3]} rotation={[0, -0.8, 0]} />

      <GlowingSpores />
    </>
  )
}
