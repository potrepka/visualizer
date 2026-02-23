import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.background = new THREE.Color('#010108')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function RingSegment({ angle, radius }: { angle: number; radius: number }) {
  const segmentWidth = 2.5
  const segmentHeight = 0.8
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius

  return (
    <group position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
      {/* Main segment body */}
      <mesh>
        <boxGeometry args={[4, segmentHeight, segmentWidth]} />
        <meshStandardMaterial color="#445566" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Top detail strip */}
      <mesh position={[0, segmentHeight / 2 + 0.05, 0]}>
        <boxGeometry args={[4, 0.1, segmentWidth * 0.8]} />
        <meshStandardMaterial color="#556677" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Inner edge light */}
      <mesh position={[0, 0, -segmentWidth / 2 - 0.05]}>
        <boxGeometry args={[3.8, 0.15, 0.08]} />
        <meshStandardMaterial
          color="#4488ff"
          emissive="#2266cc"
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  )
}

function SolarPanelArray({ angle, radius }: { angle: number; radius: number }) {
  const x = Math.cos(angle) * (radius + 3)
  const z = Math.sin(angle) * (radius + 3)

  return (
    <group position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
      {/* Support arm */}
      <mesh position={[0, 0, -1.5]}>
        <boxGeometry args={[0.2, 0.2, 3]} />
        <meshStandardMaterial color="#667788" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Panel */}
      <mesh position={[0, 0, -3]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[3, 0.05, 2]} />
        <meshStandardMaterial color="#112244" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Panel grid lines */}
      {[-1, 0, 1].map((x, i) => (
        <mesh key={i} position={[x, 0.03, -3]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.03, 0.06, 2]} />
          <meshStandardMaterial
            color="#223355"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

function DockingPort({ angle, radius }: { angle: number; radius: number }) {
  const x = Math.cos(angle) * (radius - 2.5)
  const z = Math.sin(angle) * (radius - 2.5)

  return (
    <group position={[x, 0, z]} rotation={[0, -angle + Math.PI / 2, 0]}>
      {/* Docking tube */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.8, 1.0, 3, 12]} />
        <meshStandardMaterial color="#556677" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Ring around dock entrance */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.1, 0.1, 8, 16]} />
        <meshStandardMaterial color="#88aacc" metalness={0.7} roughness={0.2} />
      </mesh>
      {/* Docking lights */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, i) => (
        <mesh key={i} position={[Math.cos(a) * 1.2, Math.sin(a) * 1.2, 0]}>
          <sphereGeometry args={[0.08, 6, 6]} />
          <meshStandardMaterial
            color="#00ff44"
            emissive="#00ff44"
            emissiveIntensity={2}
          />
        </mesh>
      ))}
    </group>
  )
}

function Planet() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.02
  })

  return (
    <group position={[0, -25, 0]}>
      {/* Planet body */}
      <mesh ref={ref}>
        <sphereGeometry args={[18, 48, 48]} />
        <meshStandardMaterial color="#2255aa" roughness={0.7} />
      </mesh>
      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[18.3, 48, 48]} />
        <meshStandardMaterial
          color="#4488ff"
          emissive="#2266cc"
          emissiveIntensity={0.3}
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Cloud layer */}
      <mesh rotation={[0.1, 0, 0]}>
        <sphereGeometry args={[18.15, 32, 32]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
      {/* Continent patches */}
      {[
        [5, 14, 8],
        [-8, 12, 12],
        [10, 8, -13],
        [-6, 16, -4],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[4, 12, 12]} />
          <meshStandardMaterial color="#338844" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  )
}

const STAR_COUNT = 500
const starDummy = new THREE.Object3D()

function Stars() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const positions = useMemo(() => {
    const arr = []
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 100 + Math.random() * 50
      arr.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        scale: 0.03 + Math.random() * 0.08,
      })
    }
    return arr
  }, [])

  useFrame(() => {
    for (let i = 0; i < STAR_COUNT; i++) {
      const p = positions[i]
      starDummy.position.set(p.x, p.y, p.z)
      starDummy.scale.setScalar(p.scale)
      starDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, starDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, STAR_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  )
}

function OrbitalRingStructure() {
  const groupRef = useRef<THREE.Group>(null!)
  const ringRadius = 15
  const segmentCount = 36

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.01
  })

  const segments = useMemo(() => {
    const arr = []
    for (let i = 0; i < segmentCount; i++) {
      arr.push((i / segmentCount) * Math.PI * 2)
    }
    return arr
  }, [segmentCount])

  return (
    <group ref={groupRef}>
      {/* Ring segments */}
      {segments.map((angle, i) => (
        <RingSegment key={i} angle={angle} radius={ringRadius} />
      ))}
      {/* Solar panels every 6th segment */}
      {segments
        .filter((_, i) => i % 6 === 0)
        .map((angle, i) => (
          <SolarPanelArray key={`sp-${i}`} angle={angle} radius={ringRadius} />
        ))}
      {/* Docking ports every 9th segment */}
      {segments
        .filter((_, i) => i % 9 === 0)
        .map((angle, i) => (
          <DockingPort key={`dp-${i}`} angle={angle} radius={ringRadius} />
        ))}
      {/* Inner ring glow */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[ringRadius, 0.05, 8, 64]} />
        <meshStandardMaterial
          color="#4488ff"
          emissive="#2266cc"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  )
}

export default function OrbitalRing() {
  return (
    <>
      <SceneSetup />

      <directionalLight
        position={[20, 30, 10]}
        color="#ffffff"
        intensity={1.5}
      />
      <ambientLight intensity={0.05} />
      <pointLight
        position={[0, 5, 0]}
        color="#4488ff"
        intensity={2}
        distance={40}
      />

      <Stars />
      <Planet />
      <OrbitalRingStructure />
    </>
  )
}
