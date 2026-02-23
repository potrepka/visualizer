import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#0a0e1a', 30, 80)
    scene.background = new THREE.Color('#060a14')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function AuroraCurtain({
  offset,
  color1,
  color2,
}: {
  offset: number
  color1: string
  color2: string
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const meshRefs = useRef<THREE.Mesh[]>([])

  const panels = useMemo(() => {
    const arr: {
      x: number
      z: number
      width: number
      height: number
      phase: number
    }[] = []
    for (let i = 0; i < 12; i++) {
      arr.push({
        x: -15 + i * 2.5 + offset,
        z: -8 + Math.sin(i * 0.7) * 3,
        width: 3,
        height: 4 + Math.random() * 4,
        phase: i * 0.5,
      })
    }
    return arr
  }, [offset])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const p = panels[i]
      mesh.position.y = 15 + Math.sin(t * 0.4 + p.phase) * 2
      mesh.rotation.z = Math.sin(t * 0.3 + p.phase) * 0.15
      mesh.rotation.x = Math.sin(t * 0.2 + p.phase) * 0.1
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.opacity = 0.15 + Math.sin(t * 0.5 + p.phase) * 0.08
    })
    groupRef.current.position.x = Math.sin(t * 0.1) * 2
  })

  return (
    <group ref={groupRef}>
      {panels.map((p, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el
          }}
          position={[p.x, 15, p.z]}
        >
          <planeGeometry args={[p.width, p.height]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? color1 : color2}
            emissive={i % 2 === 0 ? color1 : color2}
            emissiveIntensity={0.8}
            transparent
            opacity={0.18}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

function SnowGround() {
  const bumps = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      scale: [number, number, number]
    }[] = []
    for (let i = 0; i < 20; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 40, 0, (Math.random() - 0.5) * 40],
        scale: [
          2 + Math.random() * 3,
          0.1 + Math.random() * 0.3,
          2 + Math.random() * 3,
        ],
      })
    }
    return arr
  }, [])

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#c8d0d8" />
      </mesh>
      {bumps.map((b, i) => (
        <mesh key={i} position={b.pos}>
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#d0d8e0" />
        </mesh>
      ))}
    </group>
  )
}

function SparseVegetation() {
  const bushes = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number }[] = []
    for (let i = 0; i < 12; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 30, 0, (Math.random() - 0.5) * 30],
        scale: 0.2 + Math.random() * 0.3,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {bushes.map((b, i) => (
        <group key={i} position={b.pos} scale={b.scale}>
          {/* Bare twigs */}
          <mesh position={[0, 0.3, 0]}>
            <cylinderGeometry args={[0.02, 0.04, 0.6, 4]} />
            <meshStandardMaterial color="#3a2a1a" />
          </mesh>
          <mesh position={[0.05, 0.5, 0]} rotation={[0, 0, 0.4]}>
            <cylinderGeometry args={[0.01, 0.02, 0.3, 4]} />
            <meshStandardMaterial color="#3a2a1a" />
          </mesh>
          <mesh position={[-0.04, 0.45, 0.02]} rotation={[0.2, 0, -0.3]}>
            <cylinderGeometry args={[0.01, 0.015, 0.25, 4]} />
            <meshStandardMaterial color="#3a2a1a" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function SnowDrift({
  position,
  size,
}: {
  position: [number, number, number]
  size: number
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color="#d4dce4" side={THREE.DoubleSide} />
    </mesh>
  )
}

function FrozenLake() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    // Aurora reflection shimmer
    const r = 0.3 + Math.sin(t * 0.5) * 0.05
    const g = 0.4 + Math.sin(t * 0.7) * 0.05
    const b = 0.5
    mat.color.setRGB(r, g, b)
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[5, 0.01, 3]}>
      <circleGeometry args={[4, 32]} />
      <meshStandardMaterial
        color="#4a6a8a"
        metalness={0.5}
        roughness={0.05}
        transparent
        opacity={0.8}
      />
    </mesh>
  )
}

const STAR_COUNT = 200
const starDummy = new THREE.Object3D()

function Stars() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const stars = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      size: number
      twinkleSpeed: number
      phase: number
    }[] = []
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.4
      const r = 40 + Math.random() * 10
      arr.push({
        x: Math.cos(theta) * Math.sin(phi) * r,
        y: 20 + Math.cos(phi) * r * 0.5,
        z: Math.sin(theta) * Math.sin(phi) * r,
        size: 0.02 + Math.random() * 0.04,
        twinkleSpeed: 1 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < STAR_COUNT; i++) {
      const s = stars[i]
      starDummy.position.set(s.x, s.y, s.z)
      const twinkle = 0.7 + Math.sin(t * s.twinkleSpeed + s.phase) * 0.3
      starDummy.scale.setScalar(s.size * twinkle)
      starDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, starDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, STAR_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={2}
      />
    </instancedMesh>
  )
}

const SNOW_COUNT = 120
const snowDummy = new THREE.Object3D()

function SnowParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      speed: number
      phase: number
    }[] = []
    for (let i = 0; i < SNOW_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 30,
        y: Math.random() * 10,
        z: (Math.random() - 0.5) * 30,
        speed: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < SNOW_COUNT; i++) {
      const p = particles[i]
      const y = (((p.y - t * p.speed) % 10) + 10) % 10
      const x = p.x + Math.sin(t * 0.3 + p.phase) * 0.5
      const z = p.z + Math.cos(t * 0.2 + p.phase) * 0.5
      snowDummy.position.set(x, y, z)
      snowDummy.scale.setScalar(0.025)
      snowDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, snowDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SNOW_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial color="#ffffff" />
    </instancedMesh>
  )
}

export default function AuroraBorealisTundra() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[3, 8, 5]} intensity={0.15} color="#8090c0" />
      <ambientLight intensity={0.06} color="#1a2040" />
      <hemisphereLight args={['#1a3050', '#2a2030', 0.15]} />

      <SnowGround />
      <FrozenLake />
      <SparseVegetation />

      {/* Snow drifts */}
      <SnowDrift position={[-6, 0, -2]} size={1.5} />
      <SnowDrift position={[8, 0, 1]} size={2} />
      <SnowDrift position={[-3, 0, 5]} size={1.2} />
      <SnowDrift position={[4, 0, -5]} size={1.8} />

      {/* Aurora curtains */}
      <AuroraCurtain offset={0} color1="#22ff88" color2="#44ffaa" />
      <AuroraCurtain offset={5} color1="#4488ff" color2="#6644ff" />
      <AuroraCurtain offset={-3} color1="#88ff44" color2="#44ddff" />

      <Stars />
      <SnowParticles />
    </>
  )
}
