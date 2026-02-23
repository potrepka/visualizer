import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#a8c8e0', 25, 70)
    scene.background = new THREE.Color('#88b8e0')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Sunflower({
  position,
  height = 3,
  phase = 0,
}: {
  position: [number, number, number]
  height?: number
  phase?: number
}) {
  const headRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    headRef.current.rotation.z = Math.sin(t * 0.8 + phase) * 0.05
    headRef.current.rotation.x = Math.sin(t * 0.6 + phase + 1) * 0.03
  })

  const petals = useMemo(() => {
    const arr: { angle: number; len: number }[] = []
    const count = 14
    for (let i = 0; i < count; i++) {
      arr.push({
        angle: (i / count) * Math.PI * 2,
        len: 0.25 + Math.random() * 0.1,
      })
    }
    return arr
  }, [])

  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.08, height, 6]} />
        <meshStandardMaterial color="#4a7a28" />
      </mesh>
      {/* Leaves on stem */}
      <mesh position={[0.2, height * 0.35, 0]} rotation={[0, 0, -0.5]}>
        <boxGeometry args={[0.5, 0.03, 0.2]} />
        <meshStandardMaterial color="#5a8a30" />
      </mesh>
      <mesh position={[-0.15, height * 0.55, 0.1]} rotation={[0, 0.5, 0.4]}>
        <boxGeometry args={[0.4, 0.03, 0.18]} />
        <meshStandardMaterial color="#5a8a30" />
      </mesh>
      {/* Flower head */}
      <group ref={headRef} position={[0, height, 0]}>
        {/* Center disc */}
        <mesh rotation={[0.2, 0, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.08, 12]} />
          <meshStandardMaterial color="#5a3a10" roughness={0.9} />
        </mesh>
        {/* Petals */}
        {petals.map((p, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(p.angle) * 0.35,
              Math.sin(p.angle) * 0.35 * 0.3,
              Math.sin(p.angle) * 0.35 * 0.95,
            ]}
            rotation={[Math.PI / 2 - 0.2, 0, p.angle + Math.PI / 2]}
          >
            <boxGeometry args={[p.len, 0.02, 0.08]} />
            <meshStandardMaterial color="#f0c020" />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function SunflowerWall({
  start,
  end,
  density = 3,
}: {
  start: [number, number]
  end: [number, number]
  density?: number
}) {
  const flowers = useMemo(() => {
    const dx = end[0] - start[0]
    const dz = end[1] - start[1]
    const length = Math.sqrt(dx * dx + dz * dz)
    const count = Math.floor(length * density)
    const arr: { pos: [number, number, number]; h: number; ph: number }[] = []
    for (let i = 0; i < count; i++) {
      const t = i / count
      const perpOffset = (Math.random() - 0.5) * 0.6
      const nx = -dz / length
      const nz = dx / length
      arr.push({
        pos: [
          start[0] + dx * t + nx * perpOffset,
          0,
          start[1] + dz * t + nz * perpOffset,
        ],
        h: 2.5 + Math.random() * 1.5,
        ph: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [start, end, density])

  return (
    <group>
      {flowers.map((f, i) => (
        <Sunflower key={i} position={f.pos} height={f.h} phase={f.ph} />
      ))}
    </group>
  )
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#6a8a40" roughness={0.9} />
    </mesh>
  )
}

function MazePath({ points }: { points: [number, number][] }) {
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
            <planeGeometry args={[1.5, len]} />
            <meshStandardMaterial color="#b09860" roughness={0.95} />
          </mesh>
        )
      })}
    </group>
  )
}

function Bee({
  radius = 5,
  speed = 1,
  yBase = 3,
}: {
  radius?: number
  speed?: number
  yBase?: number
}) {
  const ref = useRef<THREE.Group>(null!)
  const wingRef = useRef<THREE.Mesh>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.x = Math.cos(t * speed + phase) * radius
    ref.current.position.y = yBase + Math.sin(t * 2 + phase) * 0.5
    ref.current.position.z = Math.sin(t * speed + phase) * radius
    ref.current.rotation.y = -(t * speed + phase) + Math.PI / 2
    wingRef.current.rotation.x = Math.sin(t * 25) * 0.6
  })

  return (
    <group ref={ref}>
      {/* Body */}
      <mesh>
        <sphereGeometry args={[0.08, 6, 6]} />
        <meshStandardMaterial color="#e0a020" />
      </mesh>
      {/* Stripes */}
      <mesh position={[0.05, 0, 0]}>
        <sphereGeometry args={[0.06, 6, 6]} />
        <meshStandardMaterial color="#201800" />
      </mesh>
      {/* Wings */}
      <mesh ref={wingRef} position={[0, 0.06, 0]}>
        <boxGeometry args={[0.08, 0.005, 0.12]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
      </mesh>
    </group>
  )
}

function Cloud({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[2, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[1.5, -0.3, 0]}>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-1.2, -0.2, 0.5]}>
        <sphereGeometry args={[1.3, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

export default function SunflowerMaze() {
  const mazeWalls: { start: [number, number]; end: [number, number] }[] =
    useMemo(
      () => [
        // Outer walls
        { start: [-10, -10], end: [10, -10] },
        { start: [10, -10], end: [10, 10] },
        { start: [10, 10], end: [-10, 10] },
        { start: [-10, 10], end: [-10, -4] },
        { start: [-10, -1], end: [-10, -10] },
        // Inner walls
        { start: [-6, -6], end: [-6, 4] },
        { start: [-6, -6], end: [2, -6] },
        { start: [6, -6], end: [6, 2] },
        { start: [-2, -2], end: [6, -2] },
        { start: [-2, 2], end: [-2, -2] },
        { start: [-2, 2], end: [3, 2] },
        { start: [3, 2], end: [3, 6] },
        { start: [-6, 6], end: [0, 6] },
      ],
      [],
    )

  const pathPoints: [number, number][] = useMemo(
    () => [
      [-10, -2.5],
      [-7, -2.5],
      [-7, -4.5],
      [-4, -4.5],
      [-4, 0],
      [0, 0],
      [0, -4.5],
      [4, -4.5],
      [4, 0],
      [5, 0],
      [5, 4],
      [1.5, 4],
    ],
    [],
  )

  return (
    <>
      <SceneSetup />
      <directionalLight position={[8, 15, 5]} intensity={1.3} color="#fff8d0" />
      <ambientLight intensity={0.4} color="#a0c0a0" />
      <hemisphereLight args={['#88b8e0', '#6a8a40', 0.3]} />

      <Ground />

      {/* Maze walls of sunflowers */}
      {mazeWalls.map((wall, i) => (
        <SunflowerWall key={i} start={wall.start} end={wall.end} density={3} />
      ))}

      {/* Dirt path */}
      <MazePath points={pathPoints} />

      {/* Bees */}
      <Bee radius={4} speed={0.6} yBase={3.5} />
      <Bee radius={6} speed={0.4} yBase={4} />
      <Bee radius={3} speed={0.8} yBase={3} />

      {/* Clouds */}
      <Cloud position={[-15, 20, -10]} />
      <Cloud position={[10, 22, -15]} />
      <Cloud position={[20, 18, 5]} />
    </>
  )
}
