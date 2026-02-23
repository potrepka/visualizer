import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#e8a060', 30, 80)
    scene.background = new THREE.Color('#e8a868')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function SunsetSky() {
  return (
    <group>
      {/* Sun disc */}
      <mesh position={[0, 5, -50]}>
        <sphereGeometry args={[8, 16, 16]} />
        <meshBasicMaterial color="#ffc850" />
      </mesh>
      {/* Glow halo */}
      <mesh position={[0, 5, -49]}>
        <sphereGeometry args={[14, 16, 16]} />
        <meshBasicMaterial color="#f0a040" transparent opacity={0.3} />
      </mesh>
    </group>
  )
}

const LAVENDER_COUNT = 600
const lavenderDummy = new THREE.Object3D()

function LavenderField() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const topRef = useRef<THREE.InstancedMesh>(null!)

  const plants = useMemo(() => {
    const arr: {
      x: number
      z: number
      height: number
      row: number
      phase: number
    }[] = []
    for (let i = 0; i < LAVENDER_COUNT; i++) {
      const row = Math.floor(i / 30)
      const col = i % 30
      arr.push({
        x: (col - 15) * 1.8 + (Math.random() - 0.5) * 0.4,
        z: (row - 10) * 1.5 + (Math.random() - 0.5) * 0.3,
        height: 0.6 + Math.random() * 0.4,
        row,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < LAVENDER_COUNT; i++) {
      const p = plants[i]
      const sway = Math.sin(t * 1.5 + p.phase + p.x * 0.3) * 0.06

      // Stem
      lavenderDummy.position.set(p.x, p.height / 2, p.z)
      lavenderDummy.rotation.set(0, 0, sway)
      lavenderDummy.scale.set(1, 1, 1)
      lavenderDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, lavenderDummy.matrix)

      // Flower top
      lavenderDummy.position.set(p.x + sway * p.height, p.height + 0.15, p.z)
      lavenderDummy.rotation.set(0, 0, sway)
      lavenderDummy.scale.set(1, 1, 1)
      lavenderDummy.updateMatrix()
      topRef.current.setMatrixAt(i, lavenderDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
    topRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group>
      {/* Stems */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, LAVENDER_COUNT]}
      >
        <cylinderGeometry args={[0.02, 0.03, 0.8, 4]} />
        <meshStandardMaterial color="#4a6a30" />
      </instancedMesh>
      {/* Flower tops */}
      <instancedMesh ref={topRef} args={[undefined, undefined, LAVENDER_COUNT]}>
        <cylinderGeometry args={[0.06, 0.04, 0.3, 5]} />
        <meshStandardMaterial color="#8a50a0" />
      </instancedMesh>
    </group>
  )
}

function RollingGround() {
  return (
    <group>
      {/* Base ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#6a8a40" />
      </mesh>
      {/* Rolling hills */}
      <mesh position={[-20, 0.5, -15]}>
        <sphereGeometry args={[12, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#7a9a4a" />
      </mesh>
      <mesh position={[25, 0.8, -20]}>
        <sphereGeometry args={[15, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#6a8a3a" />
      </mesh>
      <mesh position={[0, 0.3, 15]}>
        <sphereGeometry args={[18, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#7a9a48" />
      </mesh>
    </group>
  )
}

function Farmhouse() {
  return (
    <group position={[20, 0, -15]}>
      {/* Main building */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[4, 3, 5]} />
        <meshStandardMaterial color="#e8d8b0" roughness={0.9} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 3.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <coneGeometry args={[3.6, 2, 4]} />
        <meshStandardMaterial color="#a05830" roughness={0.8} />
      </mesh>
      {/* Door */}
      <mesh position={[-2.01, 1, 0]}>
        <boxGeometry args={[0.1, 2, 1]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>
      {/* Windows */}
      <mesh position={[-2.01, 2.2, -1.2]}>
        <boxGeometry args={[0.1, 0.6, 0.5]} />
        <meshStandardMaterial
          color="#c8c0a0"
          emissive="#e8a040"
          emissiveIntensity={0.4}
        />
      </mesh>
      <mesh position={[-2.01, 2.2, 1.2]}>
        <boxGeometry args={[0.1, 0.6, 0.5]} />
        <meshStandardMaterial
          color="#c8c0a0"
          emissive="#e8a040"
          emissiveIntensity={0.4}
        />
      </mesh>
    </group>
  )
}

function CypressTree({
  position,
  height = 6,
}: {
  position: [number, number, number]
  height?: number
}) {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, height * 0.2, 0]}>
        <cylinderGeometry args={[0.12, 0.18, height * 0.4, 6]} />
        <meshStandardMaterial color="#4a3a1a" />
      </mesh>
      {/* Narrow foliage */}
      <mesh position={[0, height * 0.55, 0]}>
        <coneGeometry args={[0.6, height * 0.7, 8]} />
        <meshStandardMaterial color="#2a4a1a" />
      </mesh>
      <mesh position={[0, height * 0.45, 0]}>
        <coneGeometry args={[0.7, height * 0.5, 8]} />
        <meshStandardMaterial color="#3a5a2a" />
      </mesh>
    </group>
  )
}

function DirtPath() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-15, 0.01, 0]}>
      <planeGeometry args={[2.5, 50]} />
      <meshStandardMaterial color="#b09060" roughness={0.95} />
    </mesh>
  )
}

function Butterfly() {
  const ref = useRef<THREE.Group>(null!)
  const wingRef = useRef<THREE.Mesh>(null!)
  const data = useMemo(
    () => ({
      radius: 2 + Math.random() * 4,
      speed: 0.3 + Math.random() * 0.4,
      yOffset: 1.5 + Math.random() * 2,
      phase: Math.random() * Math.PI * 2,
    }),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.x = Math.cos(t * data.speed + data.phase) * data.radius
    ref.current.position.y = data.yOffset + Math.sin(t * 1.5 + data.phase) * 0.5
    ref.current.position.z = Math.sin(t * data.speed + data.phase) * data.radius
    ref.current.rotation.y = -t * data.speed + data.phase + Math.PI / 2
    wingRef.current.rotation.z = Math.sin(t * 8) * 0.5
  })

  return (
    <group ref={ref}>
      <mesh ref={wingRef}>
        <boxGeometry args={[0.2, 0.01, 0.12]} />
        <meshStandardMaterial
          color="#e8c040"
          emissive="#e8a020"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  )
}

export default function LavenderFieldAtSunset() {
  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[0, 8, -20]}
        intensity={1.5}
        color="#ffb060"
      />
      <ambientLight intensity={0.3} color="#e8a070" />
      <hemisphereLight args={['#ffc880', '#6a8040', 0.4]} />

      <SunsetSky />
      <RollingGround />
      <LavenderField />
      <Farmhouse />
      <DirtPath />

      {/* Cypress trees */}
      <CypressTree position={[18, 0, -10]} height={7} />
      <CypressTree position={[16, 0, -8]} height={6} />
      <CypressTree position={[-18, 0, -5]} height={8} />
      <CypressTree position={[-16, 0, -8]} height={5.5} />
      <CypressTree position={[-20, 0, 5]} height={7} />

      {/* Butterflies */}
      <Butterfly />
      <Butterfly />
      <Butterfly />

      {/* Warm point lights */}
      <pointLight
        position={[0, 3, 0]}
        color="#ffa040"
        intensity={0.5}
        distance={20}
      />
    </>
  )
}
