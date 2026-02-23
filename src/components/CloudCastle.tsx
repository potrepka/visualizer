import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.background = new THREE.Color('#c8d8f8')
    scene.fog = new THREE.Fog('#c8d8f8', 20, 60)
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function CastleTower({
  position,
  height,
  radius,
  roofColor = '#e8d0a0',
}: {
  position: [number, number, number]
  height: number
  radius: number
  roofColor?: string
}) {
  return (
    <group position={position}>
      {/* Tower body */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius * 1.05, height, 12]} />
        <meshStandardMaterial color="#f0ece0" roughness={0.5} />
      </mesh>
      {/* Cone roof */}
      <mesh position={[0, height + 0.4, 0]}>
        <coneGeometry args={[radius + 0.15, 1.0, 12]} />
        <meshStandardMaterial
          color={roofColor}
          roughness={0.4}
          metalness={0.3}
        />
      </mesh>
      {/* Flag pole */}
      <mesh position={[0, height + 1.0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 4]} />
        <meshStandardMaterial color="#daa520" metalness={0.8} />
      </mesh>
      {/* Windows */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(angle) * (radius + 0.01),
            height * 0.6 + i * 0.3,
            Math.cos(angle) * (radius + 0.01),
          ]}
          rotation={[0, angle, 0]}
        >
          <boxGeometry args={[0.12, 0.2, 0.02]} />
          <meshStandardMaterial
            color="#aaccff"
            emissive="#88aaee"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      {/* Battlements */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh
            key={`bat-${i}`}
            position={[
              Math.sin(angle) * radius,
              height + 0.05,
              Math.cos(angle) * radius,
            ]}
          >
            <boxGeometry args={[0.12, 0.15, 0.12]} />
            <meshStandardMaterial color="#f0ece0" roughness={0.5} />
          </mesh>
        )
      })}
    </group>
  )
}

function CastleWall({
  from,
  to,
  height,
}: {
  from: [number, number, number]
  to: [number, number, number]
  height: number
}) {
  const dx = to[0] - from[0]
  const dz = to[2] - from[2]
  const length = Math.sqrt(dx * dx + dz * dz)
  const midX = (from[0] + to[0]) / 2
  const midZ = (from[2] + to[2]) / 2
  const angle = Math.atan2(dx, dz)

  return (
    <group position={[midX, from[1], midZ]} rotation={[0, angle, 0]}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.2, height, length]} />
        <meshStandardMaterial color="#f0ece0" roughness={0.5} />
      </mesh>
      {/* Wall battlements */}
      {Array.from({ length: Math.floor(length / 0.4) }).map((_, i) => (
        <mesh
          key={i}
          position={[0, height + 0.08, -length / 2 + i * 0.4 + 0.2]}
        >
          <boxGeometry args={[0.22, 0.15, 0.15]} />
          <meshStandardMaterial color="#f0ece0" roughness={0.5} />
        </mesh>
      ))}
    </group>
  )
}

function GateHouse({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[1.2, 2.4, 0.5]} />
        <meshStandardMaterial color="#f0ece0" roughness={0.5} />
      </mesh>
      {/* Gate arch */}
      <mesh position={[0, 0.6, 0.05]}>
        <boxGeometry args={[0.5, 1.2, 0.1]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.3, 0.05]}>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 12, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.8} />
      </mesh>
    </group>
  )
}

const CLOUD_COUNT = 50
const cloudDummy = new THREE.Object3D()

function CloudPlatform({
  position,
  spread,
}: {
  position: [number, number, number]
  spread: number
}) {
  const ref = useRef<THREE.InstancedMesh>(null!)

  useEffect(() => {
    for (let i = 0; i < CLOUD_COUNT; i++) {
      cloudDummy.position.set(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * spread,
      )
      cloudDummy.scale.set(
        1 + Math.random() * 2,
        0.4 + Math.random() * 0.4,
        1 + Math.random() * 1.5,
      )
      cloudDummy.updateMatrix()
      ref.current.setMatrixAt(i, cloudDummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [spread])

  return (
    <instancedMesh
      ref={ref}
      args={[undefined, undefined, CLOUD_COUNT]}
      position={position}
    >
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#ffffff" roughness={0.9} />
    </instancedMesh>
  )
}

function DriftingClouds() {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = 30

  const data = useMemo(
    () =>
      Array.from({ length: count }).map(() => ({
        x: (Math.random() - 0.5) * 50,
        y: -5 - Math.random() * 10,
        z: (Math.random() - 0.5) * 50,
        speed: 0.1 + Math.random() * 0.2,
        scaleX: 2 + Math.random() * 4,
        scaleY: 0.5 + Math.random() * 0.5,
        scaleZ: 2 + Math.random() * 3,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const d = data[i]
      dummy.position.set(d.x + t * d.speed, d.y, d.z)
      if (dummy.position.x > 25) dummy.position.x -= 50
      dummy.scale.set(d.scaleX, d.scaleY, d.scaleZ)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.7} />
    </instancedMesh>
  )
}

function RainbowBridge() {
  const colors = [
    '#ff0000',
    '#ff8800',
    '#ffff00',
    '#00cc00',
    '#0066ff',
    '#4400cc',
    '#8800cc',
  ]

  return (
    <group position={[6, 0, 0]} rotation={[0, 0.5, 0]}>
      {colors.map((color, i) => {
        const radius = 4 + i * 0.15
        return (
          <mesh key={i} position={[0, i * 0.08, 0]} rotation={[0, 0, 0]}>
            <torusGeometry args={[radius, 0.06, 6, 32, Math.PI]} />
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={0.4}
              transparent
              opacity={0.7}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function GoldenSpire({
  position,
  height,
}: {
  position: [number, number, number]
  height: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <coneGeometry args={[0.08, height, 6]} />
        <meshStandardMaterial color="#daa520" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, height + 0.05, 0]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color="#ffd700" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  )
}

function CastleComplex() {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    ref.current.position.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.15
  })

  return (
    <group ref={ref}>
      {/* Main towers */}
      <CastleTower
        position={[-2, 0, -2]}
        height={5}
        radius={0.6}
        roofColor="#e8c080"
      />
      <CastleTower
        position={[2, 0, -2]}
        height={5}
        radius={0.6}
        roofColor="#e8c080"
      />
      <CastleTower
        position={[-2, 0, 2]}
        height={4}
        radius={0.5}
        roofColor="#d8b880"
      />
      <CastleTower
        position={[2, 0, 2]}
        height={4}
        radius={0.5}
        roofColor="#d8b880"
      />

      {/* Center keep */}
      <CastleTower
        position={[0, 0, 0]}
        height={7}
        radius={0.8}
        roofColor="#f0d090"
      />

      {/* Walls */}
      <CastleWall from={[-2, 0, -2]} to={[2, 0, -2]} height={3} />
      <CastleWall from={[2, 0, -2]} to={[2, 0, 2]} height={3} />
      <CastleWall from={[2, 0, 2]} to={[-2, 0, 2]} height={3} />
      <CastleWall from={[-2, 0, 2]} to={[-2, 0, -2]} height={3} />

      <GateHouse position={[0, 0, 2.1]} />

      {/* Spires */}
      <GoldenSpire position={[0, 7.9, 0]} height={1.5} />
      <GoldenSpire position={[-2, 5.9, -2]} height={0.8} />
      <GoldenSpire position={[2, 5.9, -2]} height={0.8} />

      {/* Cloud platform */}
      <CloudPlatform position={[0, -1.5, 0]} spread={10} />
    </group>
  )
}

export default function CloudCastle() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 12, 8]} intensity={1.2} color="#fff8e8" />
      <ambientLight intensity={0.4} />
      <hemisphereLight args={['#ffe8cc', '#88aacc', 0.4]} />

      <CastleComplex />
      <RainbowBridge />
      <DriftingClouds />
    </>
  )
}
