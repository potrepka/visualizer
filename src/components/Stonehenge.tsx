import { useFrame, useThree } from '@react-three/fiber'
import { type JSX, useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#5a4a60', 20, 80)
    scene.background = new THREE.Color('#6a5a70')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function StandingStone({
  position,
  height,
  width,
  depth,
  rotation,
}: {
  position: [number, number, number]
  height: number
  width: number
  depth: number
  rotation?: [number, number, number]
}) {
  return (
    <mesh
      position={[position[0], position[1] + height / 2, position[2]]}
      rotation={rotation || [0, 0, 0]}
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color="#8a8a7a" roughness={0.95} />
    </mesh>
  )
}

function Trilithon({
  position,
  angle,
  height,
  spacing,
}: {
  position: [number, number, number]
  angle: number
  height: number
  spacing: number
}) {
  const stoneWidth = 0.8
  const stoneDepth = 0.6
  const lintelHeight = 0.5

  const leftX = -spacing / 2
  const rightX = spacing / 2

  return (
    <group position={position} rotation={[0, angle, 0]}>
      {/* Left upright */}
      <StandingStone
        position={[leftX, 0, 0]}
        height={height}
        width={stoneWidth}
        depth={stoneDepth}
      />
      {/* Right upright */}
      <StandingStone
        position={[rightX, 0, 0]}
        height={height}
        width={stoneWidth}
        depth={stoneDepth}
      />
      {/* Lintel */}
      <mesh position={[0, height + lintelHeight / 2, 0]}>
        <boxGeometry args={[spacing + stoneWidth, lintelHeight, stoneDepth]} />
        <meshStandardMaterial color="#7a7a6a" roughness={0.95} />
      </mesh>
    </group>
  )
}

function OuterCircle() {
  const count = 15
  const radius = 8
  const elements: JSX.Element[] = []

  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    const x = Math.cos(angle) * radius
    const z = Math.sin(angle) * radius
    elements.push(
      <StandingStone
        key={`outer-${i}`}
        position={[x, 0, z]}
        height={3.5}
        width={0.7}
        depth={0.5}
        rotation={[0, angle, 0]}
      />,
    )

    // Lintels connecting adjacent stones
    if (i < count) {
      const nextAngle = ((i + 1) / count) * Math.PI * 2
      const nx = Math.cos(nextAngle) * radius
      const nz = Math.sin(nextAngle) * radius
      const mx = (x + nx) / 2
      const mz = (z + nz) / 2
      const lintelAngle = Math.atan2(nz - z, nx - x)
      const dist = Math.sqrt((nx - x) ** 2 + (nz - z) ** 2)

      elements.push(
        <mesh
          key={`lintel-${i}`}
          position={[mx, 3.75, mz]}
          rotation={[0, lintelAngle, 0]}
        >
          <boxGeometry args={[dist, 0.35, 0.5]} />
          <meshStandardMaterial color="#7a7a6a" roughness={0.95} />
        </mesh>,
      )
    }
  }

  return <group>{elements}</group>
}

function InnerHorseshoe() {
  const positions: { x: number; z: number; angle: number }[] = [
    { x: 0, z: -5, angle: 0 },
    { x: 3.5, z: -3.5, angle: Math.PI / 4 },
    { x: 4.5, z: 0, angle: Math.PI / 2 },
    { x: 3.5, z: 3.5, angle: (3 * Math.PI) / 4 },
    { x: -3.5, z: 3.5, angle: (-3 * Math.PI) / 4 },
    { x: -4.5, z: 0, angle: -Math.PI / 2 },
    { x: -3.5, z: -3.5, angle: -Math.PI / 4 },
  ]

  return (
    <group>
      {positions.map((p, i) => (
        <Trilithon
          key={i}
          position={[p.x, 0, p.z]}
          angle={p.angle}
          height={4.5 - Math.abs(i - 3) * 0.2}
          spacing={1.8}
        />
      ))}
    </group>
  )
}

function HeelStone() {
  return (
    <group position={[0, 0, 14]}>
      <mesh position={[0, 1.2, 0]} rotation={[0.15, 0, 0]}>
        <boxGeometry args={[1.2, 2.4, 0.8]} />
        <meshStandardMaterial color="#6a6a5a" roughness={0.95} />
      </mesh>
    </group>
  )
}

function AltarStone() {
  return (
    <mesh position={[0, 0.15, 0]}>
      <boxGeometry args={[1.5, 0.3, 3.0]} />
      <meshStandardMaterial color="#5a6a6a" roughness={0.9} />
    </mesh>
  )
}

function GrassyPlain() {
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const count = 200

  const tufts = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 50,
        z: (Math.random() - 0.5) * 50,
        scale: 0.3 + Math.random() * 0.5,
      })
    }
    return arr
  }, [])

  useEffect(() => {
    for (let i = 0; i < count; i++) {
      dummy.position.set(tufts[i].x, 0.05, tufts[i].z)
      dummy.scale.set(tufts[i].scale, tufts[i].scale * 0.6, tufts[i].scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [tufts, dummy])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.3, 4, 4]} />
      <meshStandardMaterial color="#5a7a4a" />
    </instancedMesh>
  )
}

function DramaticSky() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const children = groupRef.current.children
    for (let i = 0; i < children.length; i++) {
      children[i].position.x += 0.005 * (i % 2 === 0 ? 1 : -1)
      if (children[i].position.x > 40) children[i].position.x = -40
      if (children[i].position.x < -40) children[i].position.x = 40
      const mat = (children[i] as THREE.Mesh)
        .material as THREE.MeshStandardMaterial
      mat.opacity = 0.5 + Math.sin(t * 0.3 + i) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      {Array.from({ length: 12 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 60,
            12 + Math.random() * 10,
            -20 - Math.random() * 15,
          ]}
          scale={[
            4 + Math.random() * 6,
            0.5 + Math.random() * 1,
            2 + Math.random() * 3,
          ]}
        >
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#4a3a50" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function SunGlow() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const scale = 3 + Math.sin(t * 0.5) * 0.3
    meshRef.current.scale.setScalar(scale)
  })

  return (
    <mesh ref={meshRef} position={[20, 5, -30]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial
        color="#ffaa44"
        emissive="#ff8822"
        emissiveIntensity={2}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

export default function Stonehenge() {
  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[20, 5, -30]}
        color="#ff9944"
        intensity={1.8}
      />
      <directionalLight
        position={[-10, 8, 10]}
        color="#6666aa"
        intensity={0.4}
      />
      <ambientLight intensity={0.15} color="#443355" />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#4a6a3a" />
      </mesh>

      <OuterCircle />
      <InnerHorseshoe />
      <HeelStone />
      <AltarStone />
      <GrassyPlain />
      <DramaticSky />
      <SunGlow />
    </>
  )
}
