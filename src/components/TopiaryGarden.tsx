import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#a8c8a0', 25, 65)
    scene.background = new THREE.Color('#b0d0b8')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Ground() {
  return (
    <group>
      {/* Main lawn */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#4a8038" />
      </mesh>
    </group>
  )
}

function GravelPath({
  points,
  width = 1.5,
}: {
  points: [number, number][]
  width?: number
}) {
  return (
    <group>
      {points.map((pt, i) => {
        if (i === 0) return null
        const prev = points[i - 1]
        const dx = pt[0] - prev[0]
        const dz = pt[1] - prev[1]
        const len = Math.sqrt(dx * dx + dz * dz)
        const angle = Math.atan2(dx, dz)
        return (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, -angle]}
            position={[(prev[0] + pt[0]) / 2, 0.01, (prev[1] + pt[1]) / 2]}
          >
            <planeGeometry args={[width, len + 0.1]} />
            <meshStandardMaterial color="#c8b898" roughness={0.95} />
          </mesh>
        )
      })}
    </group>
  )
}

function TopiaryShape({
  position,
  shape,
  size = 1,
  color = '#2a6a1a',
}: {
  position: [number, number, number]
  shape: 'sphere' | 'cone' | 'cube' | 'cylinder' | 'spiral'
  size?: number
  color?: string
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.y = Math.sin(t * 0.15 + position[0] * 0.5) * 0.01
  })

  const stemHeight = size * 1.2

  return (
    <group position={position}>
      {/* Pot/base */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.4, 8]} />
        <meshStandardMaterial color="#8a6a40" roughness={0.8} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.4 + stemHeight / 2, 0]}>
        <cylinderGeometry args={[0.08, 0.1, stemHeight, 6]} />
        <meshStandardMaterial color="#4a3a18" roughness={0.85} />
      </mesh>
      {/* Shape */}
      <mesh ref={ref} position={[0, 0.4 + stemHeight + size * 0.5, 0]}>
        {shape === 'sphere' && <sphereGeometry args={[size * 0.7, 12, 12]} />}
        {shape === 'cone' && (
          <coneGeometry args={[size * 0.6, size * 1.2, 8]} />
        )}
        {shape === 'cube' && <boxGeometry args={[size, size, size]} />}
        {shape === 'cylinder' && (
          <cylinderGeometry args={[size * 0.5, size * 0.5, size * 1.2, 10]} />
        )}
        {shape === 'spiral' && (
          <coneGeometry args={[size * 0.7, size * 1.5, 12]} />
        )}
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

function HedgeWall({
  start,
  end,
  height = 1.5,
  thickness = 0.6,
}: {
  start: [number, number]
  end: [number, number]
  height?: number
  thickness?: number
}) {
  const dx = end[0] - start[0]
  const dz = end[1] - start[1]
  const length = Math.sqrt(dx * dx + dz * dz)
  const angle = Math.atan2(dx, dz)

  return (
    <mesh
      position={[(start[0] + end[0]) / 2, height / 2, (start[1] + end[1]) / 2]}
      rotation={[0, angle, 0]}
    >
      <boxGeometry args={[thickness, height, length]} />
      <meshStandardMaterial color="#2a5a18" />
    </mesh>
  )
}

function Fountain() {
  const waterRef = useRef<THREE.Mesh>(null!)
  const spoutRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = waterRef.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.6 + Math.sin(t * 2) * 0.1

    spoutRef.current.scale.y = 1 + Math.sin(t * 3) * 0.15
    spoutRef.current.position.y = 2.3 + Math.sin(t * 3) * 0.1
  })

  return (
    <group position={[0, 0, 0]}>
      {/* Base pool */}
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[2.5, 2.8, 0.5, 16]} />
        <meshStandardMaterial color="#8a8078" roughness={0.7} />
      </mesh>
      {/* Water in pool */}
      <mesh ref={waterRef} position={[0, 0.45, 0]}>
        <cylinderGeometry args={[2.3, 2.3, 0.1, 16]} />
        <meshStandardMaterial color="#5a9ac0" transparent opacity={0.6} />
      </mesh>
      {/* Central pedestal */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 1.5, 8]} />
        <meshStandardMaterial color="#9a9088" roughness={0.6} />
      </mesh>
      {/* Upper basin */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 0.3, 12]} />
        <meshStandardMaterial color="#8a8078" roughness={0.7} />
      </mesh>
      {/* Water spout */}
      <mesh ref={spoutRef} position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.05, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#6aaad0" transparent opacity={0.5} />
      </mesh>
      {/* Decorative spheres on rim */}
      {[0, 1, 2, 3].map((i) => (
        <mesh
          key={i}
          position={[
            Math.cos((i * Math.PI) / 2) * 2.5,
            0.6,
            Math.sin((i * Math.PI) / 2) * 2.5,
          ]}
        >
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="#9a9088" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Statue({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pedestal */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.8, 1, 0.8]} />
        <meshStandardMaterial color="#b0a898" roughness={0.6} />
      </mesh>
      {/* Body */}
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.2, 0.25, 1.2, 8]} />
        <meshStandardMaterial color="#c0b8a8" roughness={0.5} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2.4, 0]}>
        <sphereGeometry args={[0.18, 8, 8]} />
        <meshStandardMaterial color="#c0b8a8" roughness={0.5} />
      </mesh>
    </group>
  )
}

function FlowerBed({
  position,
  radius = 1,
}: {
  position: [number, number, number]
  radius?: number
}) {
  const flowers = useMemo(() => {
    const arr: { angle: number; dist: number; color: string }[] = []
    const colors = ['#e04040', '#e8e040', '#e060a0', '#e08040']
    for (let i = 0; i < 20; i++) {
      arr.push({
        angle: Math.random() * Math.PI * 2,
        dist: Math.random() * radius,
        color: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    return arr
  }, [radius])

  return (
    <group position={position}>
      {/* Bed border */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <torusGeometry args={[radius, 0.08, 4, 16]} />
        <meshStandardMaterial color="#6a5030" />
      </mesh>
      {/* Soil */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[radius, 12]} />
        <meshStandardMaterial color="#3a2a18" />
      </mesh>
      {/* Flowers */}
      {flowers.map((f, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(f.angle) * f.dist,
            0.15,
            Math.sin(f.angle) * f.dist,
          ]}
        >
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial color={f.color} />
        </mesh>
      ))}
    </group>
  )
}

export default function TopiaryGarden() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[8, 12, 5]} intensity={1.1} color="#ffe8d0" />
      <ambientLight intensity={0.35} color="#90b890" />
      <hemisphereLight args={['#b0d0b8', '#4a7a38', 0.3]} />

      <Ground />
      <Fountain />

      {/* Main paths - cross shape */}
      <GravelPath
        points={[
          [0, -18],
          [0, 18],
        ]}
        width={2}
      />
      <GravelPath
        points={[
          [-18, 0],
          [18, 0],
        ]}
        width={2}
      />

      {/* Hedge walls forming garden rooms */}
      <HedgeWall start={[-8, -8]} end={[8, -8]} height={1.8} />
      <HedgeWall start={[8, -8]} end={[8, 8]} height={1.8} />
      <HedgeWall start={[8, 8]} end={[-8, 8]} height={1.8} />
      <HedgeWall start={[-8, 8]} end={[-8, -8]} height={1.8} />

      {/* Inner hedges */}
      <HedgeWall
        start={[-5, -5]}
        end={[-1.5, -5]}
        height={1.2}
        thickness={0.4}
      />
      <HedgeWall start={[1.5, -5]} end={[5, -5]} height={1.2} thickness={0.4} />
      <HedgeWall start={[-5, 5]} end={[-1.5, 5]} height={1.2} thickness={0.4} />
      <HedgeWall start={[1.5, 5]} end={[5, 5]} height={1.2} thickness={0.4} />

      {/* Topiary shapes - symmetrical placement */}
      <TopiaryShape position={[-5, 0, -5]} shape="sphere" size={1} />
      <TopiaryShape position={[5, 0, -5]} shape="sphere" size={1} />
      <TopiaryShape position={[-5, 0, 5]} shape="sphere" size={1} />
      <TopiaryShape position={[5, 0, 5]} shape="sphere" size={1} />

      <TopiaryShape position={[-3, 0, -3]} shape="cone" size={1.2} />
      <TopiaryShape position={[3, 0, -3]} shape="cone" size={1.2} />
      <TopiaryShape position={[-3, 0, 3]} shape="cone" size={1.2} />
      <TopiaryShape position={[3, 0, 3]} shape="cone" size={1.2} />

      <TopiaryShape
        position={[0, 0, -6]}
        shape="cube"
        size={0.8}
        color="#2a6820"
      />
      <TopiaryShape
        position={[0, 0, 6]}
        shape="cube"
        size={0.8}
        color="#2a6820"
      />
      <TopiaryShape
        position={[-6, 0, 0]}
        shape="cylinder"
        size={0.9}
        color="#327a20"
      />
      <TopiaryShape
        position={[6, 0, 0]}
        shape="cylinder"
        size={0.9}
        color="#327a20"
      />

      {/* Corner statues */}
      <Statue position={[-7, 0, -7]} />
      <Statue position={[7, 0, -7]} />
      <Statue position={[-7, 0, 7]} />
      <Statue position={[7, 0, 7]} />

      {/* Flower beds */}
      <FlowerBed position={[-4, 0, 0]} radius={0.8} />
      <FlowerBed position={[4, 0, 0]} radius={0.8} />
      <FlowerBed position={[0, 0, -4]} radius={0.8} />
      <FlowerBed position={[0, 0, 4]} radius={0.8} />
    </>
  )
}
