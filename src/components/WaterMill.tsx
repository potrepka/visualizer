import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#a8c4a0', 30, 80)
    scene.background = new THREE.Color('#c0d8c4')
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#5a8a3e" />
      </mesh>
      {/* Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 8]}>
        <planeGeometry args={[3, 30]} />
        <meshStandardMaterial color="#9a8a6a" />
      </mesh>
    </group>
  )
}

function StoneBuilding() {
  return (
    <group position={[3, 0, 0]}>
      {/* Main walls */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[5, 4, 6]} />
        <meshStandardMaterial color="#8a8070" roughness={0.9} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 4.8, 0]} rotation={[0, Math.PI / 2, 0]}>
        <coneGeometry args={[4.2, 2.5, 4]} />
        <meshStandardMaterial color="#5a3a2a" roughness={0.85} />
      </mesh>
      {/* Door */}
      <mesh position={[-2.51, 1.2, 0]}>
        <boxGeometry args={[0.1, 2.4, 1.4]} />
        <meshStandardMaterial color="#3a2a1a" />
      </mesh>
      {/* Windows */}
      {[-1.5, 1.5].map((z, i) => (
        <mesh key={i} position={[0, 2.8, z]}>
          <boxGeometry args={[5.1, 0.8, 0.6]} />
          <meshStandardMaterial
            color="#c8c0a0"
            emissive="#c8a050"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      {/* Chimney */}
      <mesh position={[1.5, 5.5, -1.5]}>
        <boxGeometry args={[0.8, 2, 0.8]} />
        <meshStandardMaterial color="#706058" roughness={0.9} />
      </mesh>
    </group>
  )
}

function WaterWheel() {
  const wheelRef = useRef<THREE.Group>(null!)
  const paddleCount = 10
  const radius = 3

  useFrame(({ clock }) => {
    wheelRef.current.rotation.z = -clock.getElapsedTime() * 0.4
  })

  const paddles = useMemo(() => {
    const arr: { angle: number }[] = []
    for (let i = 0; i < paddleCount; i++) {
      arr.push({ angle: (i / paddleCount) * Math.PI * 2 })
    }
    return arr
  }, [])

  return (
    <group position={[-2.8, 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <group ref={wheelRef}>
        {/* Hub */}
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 0.6, 12]} />
          <meshStandardMaterial color="#4a3a2a" />
        </mesh>
        {/* Outer ring */}
        <mesh>
          <torusGeometry args={[radius, 0.15, 8, 24]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
        </mesh>
        {/* Inner ring */}
        <mesh>
          <torusGeometry args={[radius * 0.6, 0.1, 8, 24]} />
          <meshStandardMaterial color="#5a4a3a" roughness={0.8} />
        </mesh>
        {/* Spokes and paddles */}
        {paddles.map((p, i) => (
          <group key={i} rotation={[0, 0, p.angle]}>
            {/* Spoke */}
            <mesh position={[radius / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.06, 0.06, radius, 6]} />
              <meshStandardMaterial color="#5a4a3a" />
            </mesh>
            {/* Paddle */}
            <mesh position={[radius, 0, 0]}>
              <boxGeometry args={[0.6, 0.4, 1.2]} />
              <meshStandardMaterial color="#6a5a4a" roughness={0.8} />
            </mesh>
          </group>
        ))}
      </group>
      {/* Axle supports */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 8]} />
        <meshStandardMaterial color="#4a3a2a" />
      </mesh>
    </group>
  )
}

function Stream() {
  const streamRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const mat = streamRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.1 + Math.sin(clock.getElapsedTime() * 2) * 0.05
  })

  return (
    <group>
      {/* Main stream */}
      <mesh
        ref={streamRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-3, 0.05, 0]}
      >
        <planeGeometry args={[3, 40]} />
        <meshStandardMaterial
          color="#4a8aaa"
          transparent
          opacity={0.7}
          emissive="#2a5a7a"
          emissiveIntensity={0.1}
        />
      </mesh>
      {/* Stream banks */}
      {[-1.6, 1.6].map((offset, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[-3 + offset * 1.1, 0.03, 0]}
        >
          <planeGeometry args={[0.5, 40]} />
          <meshStandardMaterial color="#4a6a38" />
        </mesh>
      ))}
    </group>
  )
}

function Waterfall() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.5 + Math.sin(clock.getElapsedTime() * 5) * 0.15
  })

  return (
    <group position={[-3, 0, -8]}>
      {/* Rock ledge */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[4, 2.4, 2]} />
        <meshStandardMaterial color="#6a6058" roughness={0.95} />
      </mesh>
      {/* Falling water */}
      <mesh ref={ref} position={[0, 0.5, 1.1]}>
        <planeGeometry args={[2.5, 2]} />
        <meshStandardMaterial
          color="#6aaccc"
          transparent
          opacity={0.55}
          emissive="#3a7a9a"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Splash pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.06, 2]}>
        <planeGeometry args={[3.5, 2]} />
        <meshStandardMaterial color="#5a9aba" transparent opacity={0.6} />
      </mesh>
    </group>
  )
}

function Tree({
  position,
  height = 4,
  foliageColor = '#3a7a2a',
}: {
  position: [number, number, number]
  height?: number
  foliageColor?: string
}) {
  return (
    <group position={position}>
      <mesh position={[0, height * 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.2, height * 0.6, 6]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>
      <mesh position={[0, height * 0.7, 0]}>
        <sphereGeometry args={[height * 0.35, 8, 8]} />
        <meshStandardMaterial color={foliageColor} />
      </mesh>
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
  const posts = useMemo(() => {
    const arr: [number, number, number][] = []
    const count = 6
    for (let i = 0; i <= count; i++) {
      const t = i / count
      arr.push([
        start[0] + (end[0] - start[0]) * t,
        start[1] + (end[1] - start[1]) * t + 0.4,
        start[2] + (end[2] - start[2]) * t,
      ])
    }
    return arr
  }, [start, end])

  return (
    <group>
      {posts.map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 4]} />
          <meshStandardMaterial color="#6a5030" />
        </mesh>
      ))}
      {/* Rails */}
      {[0.2, 0.5].map((h, ri) => (
        <mesh
          key={ri}
          position={[(start[0] + end[0]) / 2, h, (start[2] + end[2]) / 2]}
          rotation={[0, Math.atan2(end[0] - start[0], end[2] - start[2]), 0]}
        >
          <boxGeometry
            args={[
              0.05,
              0.05,
              Math.sqrt((end[0] - start[0]) ** 2 + (end[2] - start[2]) ** 2),
            ]}
          />
          <meshStandardMaterial color="#6a5030" />
        </mesh>
      ))}
    </group>
  )
}

function Rocks() {
  const rocks = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      scale: [number, number, number]
    }[] = []
    for (let i = 0; i < 8; i++) {
      arr.push({
        pos: [-3 + (Math.random() - 0.5) * 3, 0.15, (Math.random() - 0.5) * 20],
        scale: [
          0.2 + Math.random() * 0.4,
          0.15 + Math.random() * 0.2,
          0.2 + Math.random() * 0.3,
        ],
      })
    }
    return arr
  }, [])

  return (
    <group>
      {rocks.map((r, i) => (
        <mesh key={i} position={r.pos} scale={r.scale}>
          <sphereGeometry args={[1, 6, 5]} />
          <meshStandardMaterial color="#7a7068" roughness={0.95} />
        </mesh>
      ))}
    </group>
  )
}

export default function WaterMill() {
  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[8, 12, 5]}
        intensity={1.2}
        color="#ffe8c0"
        castShadow
      />
      <ambientLight intensity={0.35} color="#8aaa90" />
      <hemisphereLight args={['#c0d8e0', '#4a6a3a', 0.4]} />

      <Ground />
      <StoneBuilding />
      <WaterWheel />
      <Stream />
      <Waterfall />
      <Rocks />

      {/* Trees */}
      <Tree position={[10, 0, -5]} height={5} />
      <Tree position={[8, 0, 3]} height={4} foliageColor="#2a6a22" />
      <Tree position={[12, 0, 1]} height={6} />
      <Tree position={[-8, 0, -3]} height={4.5} foliageColor="#4a8a3a" />
      <Tree position={[-7, 0, 6]} height={3.5} />
      <Tree position={[6, 0, -8]} height={5} foliageColor="#2a7a2a" />

      {/* Fences */}
      <Fence start={[6, 0, 6]} end={[14, 0, 6]} />
      <Fence start={[6, 0, -6]} end={[14, 0, -6]} />

      {/* Distant hills */}
      <mesh position={[-20, 1.5, -25]}>
        <sphereGeometry args={[12, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#6a9a5a" />
      </mesh>
      <mesh position={[20, 2, -30]}>
        <sphereGeometry args={[15, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5a8a4a" />
      </mesh>
    </>
  )
}
