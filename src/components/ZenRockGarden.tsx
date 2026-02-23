import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#d8d4c8', 25, 60)
    scene.background = new THREE.Color('#c8c4b8')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function RakedSand() {
  const linesRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    linesRef.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh
      mesh.position.y = 0.012 + Math.sin(t * 0.3 + i * 0.2) * 0.001
    })
  })

  const lines = useMemo(() => {
    const arr: { z: number; width: number }[] = []
    for (let z = -8; z <= 8; z += 0.4) {
      arr.push({ z, width: 16 })
    }
    return arr
  }, [])

  return (
    <group>
      {/* Sand base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[18, 18]} />
        <meshStandardMaterial color="#d8d0b8" roughness={0.95} />
      </mesh>
      {/* Rake lines */}
      <group ref={linesRef}>
        {lines.map((line, i) => (
          <mesh
            key={i}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, 0.012, line.z]}
          >
            <planeGeometry args={[line.width, 0.08]} />
            <meshStandardMaterial color="#c8c0a8" roughness={1} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function RockCirclePattern({
  center,
  radius,
}: {
  center: [number, number]
  radius: number
}) {
  const rings = useMemo(() => {
    const arr: { r: number }[] = []
    for (let r = radius + 0.5; r < radius + 3; r += 0.4) {
      arr.push({ r })
    }
    return arr
  }, [radius])

  return (
    <group position={[center[0], 0.013, center[1]]}>
      {rings.map((ring, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[ring.r, 0.04, 4, 32]} />
          <meshStandardMaterial color="#c8c0a8" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function Rock({
  position,
  scale,
  color = '#6a6458',
}: {
  position: [number, number, number]
  scale: [number, number, number]
  color?: string
}) {
  return (
    <mesh position={position} scale={scale}>
      <sphereGeometry args={[1, 7, 6]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  )
}

function RockGroup({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Rock position={[0, 0.4, 0]} scale={[0.8, 0.5, 0.6]} color="#5a5448" />
      <Rock
        position={[0.7, 0.25, 0.3]}
        scale={[0.4, 0.3, 0.35]}
        color="#6a6258"
      />
      <Rock
        position={[-0.5, 0.2, 0.4]}
        scale={[0.3, 0.22, 0.28]}
        color="#585048"
      />
    </group>
  )
}

function MossPatch({
  position,
  radius = 0.4,
}: {
  position: [number, number, number]
  radius?: number
}) {
  const patches = useMemo(() => {
    const arr: { offset: [number, number]; r: number }[] = []
    for (let i = 0; i < 5; i++) {
      arr.push({
        offset: [
          (Math.random() - 0.5) * radius,
          (Math.random() - 0.5) * radius,
        ],
        r: 0.08 + Math.random() * 0.15,
      })
    }
    return arr
  }, [radius])

  return (
    <group position={position}>
      {patches.map((p, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[p.offset[0], 0.015, p.offset[1]]}
        >
          <circleGeometry args={[p.r, 8]} />
          <meshStandardMaterial color="#4a6a38" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function WoodenBorder() {
  const borderSize = 9.2
  const thickness = 0.2
  const height = 0.2

  return (
    <group>
      {/* Four sides */}
      <mesh position={[0, height / 2, -borderSize]}>
        <boxGeometry
          args={[borderSize * 2 + thickness * 2, height, thickness]}
        />
        <meshStandardMaterial color="#5a4a30" roughness={0.8} />
      </mesh>
      <mesh position={[0, height / 2, borderSize]}>
        <boxGeometry
          args={[borderSize * 2 + thickness * 2, height, thickness]}
        />
        <meshStandardMaterial color="#5a4a30" roughness={0.8} />
      </mesh>
      <mesh position={[-borderSize, height / 2, 0]}>
        <boxGeometry args={[thickness, height, borderSize * 2]} />
        <meshStandardMaterial color="#5a4a30" roughness={0.8} />
      </mesh>
      <mesh position={[borderSize, height / 2, 0]}>
        <boxGeometry args={[thickness, height, borderSize * 2]} />
        <meshStandardMaterial color="#5a4a30" roughness={0.8} />
      </mesh>
    </group>
  )
}

function SteppingStone({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, Math.random() * 0.3]}>
      <circleGeometry args={[0.4, 8]} />
      <meshStandardMaterial color="#7a7468" roughness={0.85} />
    </mesh>
  )
}

function StoneLantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.3, 6]} />
        <meshStandardMaterial color="#7a7468" roughness={0.8} />
      </mesh>
      {/* Post */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.1, 0.12, 1, 6]} />
        <meshStandardMaterial color="#7a7468" roughness={0.8} />
      </mesh>
      {/* Light chamber */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#8a8478" roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 1.95, 0]}>
        <coneGeometry args={[0.5, 0.4, 4]} />
        <meshStandardMaterial color="#6a6458" roughness={0.8} />
      </mesh>
      <pointLight
        position={[0, 1.5, 0]}
        color="#ffeedd"
        intensity={0.3}
        distance={4}
      />
    </group>
  )
}

function SmallBamboo({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {[0, 0.15, -0.1].map((offset, i) => (
        <group key={i}>
          <mesh position={[offset, 0.8 + i * 0.2, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.6 + i * 0.4, 6]} />
            <meshStandardMaterial color="#6a8a48" roughness={0.6} />
          </mesh>
          {/* Leaves */}
          <mesh
            position={[offset + 0.15, 1.4 + i * 0.2, 0]}
            rotation={[0, 0, -0.5]}
          >
            <boxGeometry args={[0.25, 0.02, 0.06]} />
            <meshStandardMaterial color="#5a7a38" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

export default function ZenRockGarden() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[8, 12, 5]} intensity={0.9} color="#fff8e8" />
      <ambientLight intensity={0.4} color="#e0d8c8" />
      <hemisphereLight args={['#e8e0d0', '#a09880', 0.3]} />

      <RakedSand />
      <WoodenBorder />

      {/* Main rock groups */}
      <RockGroup position={[-3, 0, -2]} />
      <RockGroup position={[4, 0, 1]} />
      <Rock position={[0, 0.5, 4]} scale={[1, 0.6, 0.8]} color="#5a5448" />
      <Rock position={[-5, 0.35, 3]} scale={[0.6, 0.4, 0.5]} color="#686058" />
      <Rock position={[2, 0.3, -5]} scale={[0.5, 0.35, 0.45]} color="#606050" />

      {/* Circle patterns around rocks */}
      <RockCirclePattern center={[-3, -2]} radius={1.2} />
      <RockCirclePattern center={[4, 1]} radius={1} />
      <RockCirclePattern center={[0, 4]} radius={1.1} />

      {/* Moss patches */}
      <MossPatch position={[-3.5, 0, -1]} radius={0.3} />
      <MossPatch position={[4.5, 0, 1.5]} radius={0.25} />
      <MossPatch position={[0.3, 0, 4.5]} radius={0.35} />
      <MossPatch position={[-5.2, 0, 3.5]} radius={0.2} />

      {/* Stepping stones */}
      <SteppingStone position={[7, 0.02, -7]} />
      <SteppingStone position={[6.5, 0.02, -6]} />
      <SteppingStone position={[6, 0.02, -5]} />

      {/* Decorative elements */}
      <StoneLantern position={[7, 0, -3]} />
      <StoneLantern position={[-7, 0, 5]} />
      <SmallBamboo position={[8, 0, 2]} />
      <SmallBamboo position={[-8, 0, -4]} />

      {/* Surrounding ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial color="#5a7a48" roughness={0.9} />
      </mesh>
    </>
  )
}
