import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#87CEEB', 30, 80)
    scene.background = new THREE.Color('#87CEEB')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function WindmillBlades({ speed = 1 }: { speed?: number }) {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.getElapsedTime() * speed
  })

  return (
    <group ref={ref}>
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <group key={i} rotation={[0, 0, angle]}>
          {/* Blade arm */}
          <mesh position={[0, 2.2, 0.1]}>
            <boxGeometry args={[0.12, 4, 0.03]} />
            <meshStandardMaterial color="#e8dcc0" roughness={0.8} />
          </mesh>
          {/* Blade sail */}
          <mesh position={[0.25, 2.2, 0.12]}>
            <boxGeometry args={[0.4, 3.5, 0.02]} />
            <meshStandardMaterial
              color="#f5f0e0"
              roughness={0.85}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}
      {/* Hub */}
      <mesh position={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.2, 0.2, 0.25, 8]} />
        <meshStandardMaterial color="#5a4030" roughness={0.7} />
      </mesh>
    </group>
  )
}

function Windmill({
  position,
  height = 6,
  bladeSpeed = 0.8,
}: {
  position: [number, number, number]
  height?: number
  bladeSpeed?: number
}) {
  return (
    <group position={position}>
      {/* Tower */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.6, 1.0, height, 8]} />
        <meshStandardMaterial color="#e8dcc0" roughness={0.85} />
      </mesh>
      {/* Cap/roof */}
      <mesh position={[0, height + 0.4, 0]}>
        <coneGeometry args={[0.9, 1.2, 8]} />
        <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.8, 1.01]}>
        <boxGeometry args={[0.6, 1.4, 0.05]} />
        <meshStandardMaterial color="#5a3a1e" roughness={0.9} />
      </mesh>
      {/* Windows */}
      <mesh position={[0, height * 0.5, 0.62]}>
        <boxGeometry args={[0.35, 0.35, 0.05]} />
        <meshStandardMaterial color="#88aacc" roughness={0.3} />
      </mesh>
      <mesh position={[0, height * 0.72, 0.62]}>
        <boxGeometry args={[0.3, 0.3, 0.05]} />
        <meshStandardMaterial color="#88aacc" roughness={0.3} />
      </mesh>
      {/* Blades at top */}
      <group position={[0, height + 0.2, 0.9]}>
        <WindmillBlades speed={bladeSpeed} />
      </group>
    </group>
  )
}

function RollingHills() {
  const hills = useMemo(
    () => [
      { pos: [0, -2, 0] as [number, number, number], r: 30, h: 4 },
      { pos: [-15, -3, -10] as [number, number, number], r: 20, h: 5 },
      { pos: [20, -3, -15] as [number, number, number], r: 18, h: 4.5 },
      { pos: [-10, -3, 15] as [number, number, number], r: 22, h: 3.5 },
      { pos: [15, -3, 10] as [number, number, number], r: 15, h: 3 },
    ],
    [],
  )

  return (
    <>
      {hills.map((h, i) => (
        <mesh key={i} position={h.pos}>
          <sphereGeometry
            args={[h.r, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial
            color={i === 0 ? '#4a8a2a' : '#3a7a1a'}
            roughness={0.95}
          />
        </mesh>
      ))}
    </>
  )
}

function GrainField() {
  const count = 300
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const stalks = useMemo(() => {
    const arr: { x: number; z: number; h: number; phase: number }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: -8 + Math.random() * 16,
        z: 3 + Math.random() * 12,
        h: 0.4 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const s = stalks[i]
      dummy.position.set(s.x, s.h / 2 + 0.15, s.z)
      dummy.scale.set(0.02, s.h, 0.02)
      dummy.rotation.set(0, 0, Math.sin(t * 1.5 + s.phase + s.x * 0.3) * 0.15)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <cylinderGeometry args={[1, 1, 1, 4]} />
      <meshStandardMaterial color="#c8a848" roughness={0.9} />
    </instancedMesh>
  )
}

function Farmhouse({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main building */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[3, 2.4, 2.5]} />
        <meshStandardMaterial color="#c8b898" roughness={0.85} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 2.9, 0]} rotation={[0, Math.PI / 2, 0]}>
        <coneGeometry args={[2.2, 1.5, 4]} />
        <meshStandardMaterial color="#8b4513" roughness={0.8} />
      </mesh>
      {/* Chimney */}
      <mesh position={[0.8, 3.6, 0]}>
        <boxGeometry args={[0.4, 1.2, 0.4]} />
        <meshStandardMaterial color="#8b6b55" roughness={0.9} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.7, 1.26]}>
        <boxGeometry args={[0.6, 1.3, 0.05]} />
        <meshStandardMaterial color="#5a3a1e" roughness={0.9} />
      </mesh>
      {/* Windows */}
      {[
        [-0.8, 1.4, 1.26],
        [0.8, 1.4, 1.26],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.5, 0.5, 0.05]} />
          <meshStandardMaterial color="#88aacc" roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function Fence({
  start,
  end,
}: {
  start: [number, number, number]
  end: [number, number, number]
}) {
  const postCount = 8
  const dx = end[0] - start[0]
  const dz = end[2] - start[2]
  const length = Math.sqrt(dx * dx + dz * dz)
  const angle = Math.atan2(dx, dz)

  return (
    <group>
      {Array.from({ length: postCount }).map((_, i) => {
        const t = i / (postCount - 1)
        const x = start[0] + dx * t
        const z = start[2] + dz * t
        return (
          <mesh key={i} position={[x, 0.4, z]}>
            <boxGeometry args={[0.06, 0.8, 0.06]} />
            <meshStandardMaterial color="#8b7355" roughness={0.9} />
          </mesh>
        )
      })}
      {/* Rails */}
      {[0.25, 0.55].map((h, i) => (
        <mesh
          key={i}
          position={[(start[0] + end[0]) / 2, h, (start[2] + end[2]) / 2]}
          rotation={[0, angle, 0]}
        >
          <boxGeometry args={[0.04, 0.04, length]} />
          <meshStandardMaterial color="#8b7355" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Clouds() {
  const count = 15
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const clouds = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      sx: number
      sy: number
      sz: number
      speed: number
    }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 60,
        y: 15 + Math.random() * 8,
        z: -10 + (Math.random() - 0.5) * 40,
        sx: 3 + Math.random() * 4,
        sy: 0.5 + Math.random() * 0.8,
        sz: 2 + Math.random() * 2,
        speed: 0.2 + Math.random() * 0.3,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const c = clouds[i]
      dummy.position.set(((c.x + t * c.speed) % 60) - 30, c.y, c.z)
      dummy.scale.set(c.sx, c.sy, c.sz)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.85} />
    </instancedMesh>
  )
}

function Trees() {
  const positions: [number, number, number][] = useMemo(
    () => [
      [-12, 0, -5],
      [-14, 0, -2],
      [12, 0, -3],
      [14, 0, 0],
      [-11, 0, 2],
      [13, 0, 3],
    ],
    [],
  )

  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 1.5, 0]}>
            <cylinderGeometry args={[0.12, 0.18, 3, 6]} />
            <meshStandardMaterial color="#5a3a1e" roughness={0.9} />
          </mesh>
          <mesh position={[0, 3.5, 0]}>
            <sphereGeometry args={[1.2, 8, 8]} />
            <meshStandardMaterial color="#2a6a1a" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </>
  )
}

export default function WindmillFarm() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[8, 12, 5]} intensity={1.2} color="#fffde0" />
      <ambientLight intensity={0.3} color="#88aacc" />
      <hemisphereLight args={['#87CEEB', '#4a8a2a', 0.4]} />

      <RollingHills />

      <Windmill position={[-5, 0.3, -3]} height={6} bladeSpeed={0.8} />
      <Windmill position={[3, 0.5, -5]} height={7} bladeSpeed={0.6} />
      <Windmill position={[10, 0.2, -2]} height={5.5} bladeSpeed={0.9} />
      <Windmill position={[-2, 0.4, -8]} height={6.5} bladeSpeed={0.7} />

      <GrainField />
      <Farmhouse position={[8, 0.2, 5]} />
      <Trees />

      <Fence start={[4, 0.2, 3]} end={[12, 0.2, 3]} />
      <Fence start={[12, 0.2, 3]} end={[12, 0.2, 8]} />

      <Clouds />
    </>
  )
}
