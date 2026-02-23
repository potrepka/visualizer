import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.background = new THREE.Color('#87ceeb')
    scene.fog = new THREE.Fog('#c0ddef', 20, 60)
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function IslandBase({ radius, depth }: { radius: number; depth: number }) {
  return (
    <group>
      {/* Top grass surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[radius, 24]} />
        <meshStandardMaterial color="#4a8c3f" />
      </mesh>
      {/* Bottom rocky underbelly */}
      <mesh position={[0, -depth / 2, 0]}>
        <coneGeometry args={[radius, depth, 24]} />
        <meshStandardMaterial color="#8b6e4e" roughness={0.9} />
      </mesh>
      {/* Rock details */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2
        const r = radius * 0.7
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, -depth * 0.3, Math.sin(angle) * r]}
          >
            <sphereGeometry args={[radius * 0.2, 6, 6]} />
            <meshStandardMaterial color="#7a5e3e" roughness={0.95} />
          </mesh>
        )
      })}
    </group>
  )
}

function SimpleTree({
  position,
  height = 1.5,
}: {
  position: [number, number, number]
  height?: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.05, 0.08, height, 6]} />
        <meshStandardMaterial color="#5c3a1e" />
      </mesh>
      <mesh position={[0, height + 0.3, 0]}>
        <sphereGeometry args={[0.45, 8, 8]} />
        <meshStandardMaterial color="#2d6b2d" />
      </mesh>
      <mesh position={[0, height + 0.1, 0.2]}>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshStandardMaterial color="#3a8a3a" />
      </mesh>
    </group>
  )
}

function Waterfall({
  position,
  height,
}: {
  position: [number, number, number]
  height: number
}) {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const arr: { x: number; z: number; speed: number; phase: number }[] = []
    for (let i = 0; i < 40; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 0.3,
        z: (Math.random() - 0.5) * 0.3,
        speed: 1.5 + Math.random() * 1.0,
        phase: Math.random(),
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const y = ((p.phase + (t * p.speed) / height) % 1) * height
      dummy.position.set(position[0] + p.x, position[1] - y, position[2] + p.z)
      dummy.scale.setScalar(0.04 + (y / height) * 0.02)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, 40]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#88ccee" transparent opacity={0.6} />
    </instancedMesh>
  )
}

function Bridge({
  from,
  to,
}: {
  from: [number, number, number]
  to: [number, number, number]
}) {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const dz = to[2] - from[2]
  const length = Math.sqrt(dx * dx + dy * dy + dz * dz)
  const midX = (from[0] + to[0]) / 2
  const midY = (from[1] + to[1]) / 2
  const midZ = (from[2] + to[2]) / 2
  const angleY = Math.atan2(dx, dz)
  const angleX = Math.atan2(dy, Math.sqrt(dx * dx + dz * dz))

  return (
    <group position={[midX, midY, midZ]} rotation={[angleX, angleY, 0]}>
      {/* Bridge planks */}
      <mesh>
        <boxGeometry args={[0.4, 0.05, length]} />
        <meshStandardMaterial color="#8b6c42" />
      </mesh>
      {/* Rope rails */}
      {[-0.22, 0.22].map((x, i) => (
        <mesh key={i} position={[x, 0.2, 0]}>
          <cylinderGeometry args={[0.015, 0.015, length, 4]} />
          <meshStandardMaterial color="#5c3a1e" />
        </mesh>
      ))}
      {/* Posts */}
      {Array.from({ length: 6 }).map((_, i) => {
        const z = -length / 2 + (i / 5) * length
        return [-0.22, 0.22].map((x, j) => (
          <mesh key={`${i}-${j}`} position={[x, 0.1, z]}>
            <cylinderGeometry args={[0.02, 0.02, 0.25, 4]} />
            <meshStandardMaterial color="#5c3a1e" />
          </mesh>
        ))
      })}
    </group>
  )
}

function FloatingIsland({
  position,
  radius,
  depth,
  trees,
  bobSpeed = 1,
  bobAmount = 0.2,
}: {
  position: [number, number, number]
  radius: number
  depth: number
  trees: [number, number, number][]
  bobSpeed?: number
  bobAmount?: number
}) {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.y = position[1] + Math.sin(t * bobSpeed) * bobAmount
    ref.current.rotation.y = Math.sin(t * 0.1) * 0.02
  })

  return (
    <group ref={ref} position={position}>
      <IslandBase radius={radius} depth={depth} />
      {trees.map((tPos, i) => (
        <SimpleTree
          key={i}
          position={tPos}
          height={0.8 + Math.random() * 0.8}
        />
      ))}
    </group>
  )
}

const CLOUD_COUNT = 60
const cloudDummy = new THREE.Object3D()

function CloudLayer() {
  const ref = useRef<THREE.InstancedMesh>(null!)

  useEffect(() => {
    for (let i = 0; i < CLOUD_COUNT; i++) {
      cloudDummy.position.set(
        (Math.random() - 0.5) * 50,
        -5 - Math.random() * 8,
        (Math.random() - 0.5) * 50,
      )
      cloudDummy.scale.set(
        2 + Math.random() * 4,
        0.5 + Math.random() * 0.5,
        2 + Math.random() * 3,
      )
      cloudDummy.updateMatrix()
      ref.current.setMatrixAt(i, cloudDummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, CLOUD_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
    </instancedMesh>
  )
}

function MagicParticles() {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = 50

  const data = useMemo(() => {
    return Array.from({ length: count }).map(() => ({
      x: (Math.random() - 0.5) * 20,
      y: Math.random() * 10 - 2,
      z: (Math.random() - 0.5) * 20,
      speed: 0.3 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const d = data[i]
      dummy.position.set(
        d.x + Math.sin(t * d.speed + d.phase) * 0.5,
        d.y + Math.sin(t * d.speed * 0.7 + d.phase) * 1,
        d.z + Math.cos(t * d.speed + d.phase) * 0.5,
      )
      dummy.scale.setScalar(0.03 + Math.sin(t * 2 + d.phase) * 0.015)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#ffee88"
        emissive="#ffdd44"
        emissiveIntensity={2}
      />
    </instancedMesh>
  )
}

export default function FloatingIslands() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 10, 3]} intensity={1.5} color="#fff5e0" />
      <ambientLight intensity={0.4} />
      <hemisphereLight args={['#87ceeb', '#4a8c3f', 0.3]} />

      <FloatingIsland
        position={[0, 2, 0]}
        radius={3}
        depth={4}
        trees={[
          [-1, 0, -0.5],
          [0.8, 0, 0.5],
          [-0.5, 0, 1],
          [1.5, 0, -1],
        ]}
        bobSpeed={0.5}
        bobAmount={0.15}
      />
      <Waterfall position={[2.5, 2, 0]} height={6} />

      <FloatingIsland
        position={[-7, 4, -3]}
        radius={2}
        depth={3}
        trees={[
          [-0.5, 0, 0],
          [0.5, 0, -0.3],
        ]}
        bobSpeed={0.7}
        bobAmount={0.2}
      />
      <Waterfall position={[-5.5, 4, -3]} height={5} />

      <FloatingIsland
        position={[6, 0, -5]}
        radius={2.5}
        depth={3.5}
        trees={[
          [0, 0, 0],
          [-1, 0, 0.5],
          [0.8, 0, -0.6],
        ]}
        bobSpeed={0.4}
        bobAmount={0.25}
      />

      <FloatingIsland
        position={[-3, 6, 5]}
        radius={1.5}
        depth={2}
        trees={[[0, 0, 0]]}
        bobSpeed={0.8}
        bobAmount={0.1}
      />

      <Bridge from={[2.5, 2, 0.5]} to={[5, 0.5, -3.5]} />
      <Bridge from={[-3.5, 2, -0.5]} to={[-6, 3.8, -2]} />

      <CloudLayer />
      <MagicParticles />
    </>
  )
}
