import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#b8d4e8', 20, 80)
    scene.background = new THREE.Color('#c0daea')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function IceFormation({
  position,
  scale = 1,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const shards = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      size: [number, number, number]
      rot: [number, number, number]
    }[] = []
    for (let i = 0; i < 5; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 1.5,
          Math.random() * 2 + 0.5,
          (Math.random() - 0.5) * 1.5,
        ],
        size: [
          0.3 + Math.random() * 0.6,
          1 + Math.random() * 3,
          0.3 + Math.random() * 0.6,
        ],
        rot: [
          (Math.random() - 0.5) * 0.3,
          Math.random() * Math.PI,
          (Math.random() - 0.5) * 0.3,
        ],
      })
    }
    return arr
  }, [])

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {shards.map((s, i) => (
        <mesh key={i} position={s.pos} rotation={s.rot}>
          <boxGeometry args={s.size} />
          <meshPhysicalMaterial
            color="#d0eaf8"
            transparent
            opacity={0.6}
            roughness={0.1}
            metalness={0.0}
            transmission={0.4}
          />
        </mesh>
      ))}
      {/* Base ice block */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.6, 2]} />
        <meshPhysicalMaterial
          color="#c8e4f4"
          transparent
          opacity={0.5}
          roughness={0.15}
        />
      </mesh>
    </group>
  )
}

function Mountain({
  position,
  height,
  width,
}: {
  position: [number, number, number]
  height: number
  width: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, height / 2, 0]}>
        <coneGeometry args={[width, height, 6]} />
        <meshStandardMaterial color="#7a8a9a" />
      </mesh>
      {/* Snow cap */}
      <mesh position={[0, height * 0.72, 0]}>
        <coneGeometry args={[width * 0.45, height * 0.35, 6]} />
        <meshStandardMaterial color="#f0f4f8" />
      </mesh>
    </group>
  )
}

function FrozenLake() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshPhysicalMaterial
    mat.opacity = 0.75 + Math.sin(t * 0.5) * 0.05
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 4]}>
      <planeGeometry args={[16, 10]} />
      <meshPhysicalMaterial
        color="#8ab8d4"
        transparent
        opacity={0.75}
        roughness={0.05}
        metalness={0.3}
      />
    </mesh>
  )
}

function SnowGround() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial color="#e8eef4" />
    </mesh>
  )
}

function GlacierWall({
  position,
  width,
  height,
}: {
  position: [number, number, number]
  width: number
  height: number
}) {
  const blocks = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      size: [number, number, number]
    }[] = []
    for (let i = 0; i < 8; i++) {
      const bw = 0.8 + Math.random() * 1.5
      const bh = 0.5 + Math.random() * (height * 0.6)
      const bd = 0.6 + Math.random() * 1.2
      arr.push({
        pos: [(Math.random() - 0.5) * width, bh / 2, (Math.random() - 0.5) * 2],
        size: [bw, bh, bd],
      })
    }
    return arr
  }, [width, height])

  return (
    <group position={position}>
      {/* Main wall */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, 2.5]} />
        <meshPhysicalMaterial
          color="#c4dce8"
          transparent
          opacity={0.55}
          roughness={0.12}
        />
      </mesh>
      {/* Surface detail blocks */}
      {blocks.map((b, i) => (
        <mesh key={i} position={b.pos}>
          <boxGeometry args={b.size} />
          <meshPhysicalMaterial
            color={i % 2 === 0 ? '#daeaf4' : '#b0d0e4'}
            transparent
            opacity={0.45}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

const SNOW_COUNT = 200
const snowDummy = new THREE.Object3D()

function SnowParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      speed: number
      drift: number
      phase: number
    }[] = []
    for (let i = 0; i < SNOW_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 40,
        y: Math.random() * 15,
        z: (Math.random() - 0.5) * 40,
        speed: 0.3 + Math.random() * 0.5,
        drift: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < SNOW_COUNT; i++) {
      const p = particles[i]
      const y = (((p.y - t * p.speed) % 15) + 15) % 15
      const x = p.x + Math.sin(t * 0.3 + p.phase) * p.drift
      const z = p.z + Math.cos(t * 0.2 + p.phase) * p.drift
      snowDummy.position.set(x, y, z)
      snowDummy.scale.setScalar(0.03 + Math.random() * 0.02)
      snowDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, snowDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SNOW_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#ffffff" />
    </instancedMesh>
  )
}

function IcePillar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.3, 0.5, 3, 6]} />
        <meshPhysicalMaterial
          color="#cce4f0"
          transparent
          opacity={0.5}
          roughness={0.08}
        />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <coneGeometry args={[0.35, 0.8, 6]} />
        <meshPhysicalMaterial
          color="#d8ecf6"
          transparent
          opacity={0.4}
          roughness={0.08}
        />
      </mesh>
    </group>
  )
}

export default function GlacierValley() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 10, 3]} intensity={1.0} color="#e0eeff" />
      <ambientLight intensity={0.35} color="#b0c8e0" />
      <hemisphereLight args={['#c8e0f0', '#8090a0', 0.4]} />

      <SnowGround />
      <FrozenLake />

      {/* Mountains in background */}
      <Mountain position={[-15, 0, -20]} height={18} width={8} />
      <Mountain position={[0, 0, -25]} height={22} width={10} />
      <Mountain position={[12, 0, -18]} height={16} width={7} />
      <Mountain position={[-8, 0, -22]} height={14} width={6} />
      <Mountain position={[20, 0, -22]} height={19} width={9} />

      {/* Glacier walls */}
      <GlacierWall position={[-10, 0, -5]} width={8} height={6} />
      <GlacierWall position={[10, 0, -3]} width={6} height={5} />

      {/* Ice formations */}
      <IceFormation position={[-3, 0, -2]} scale={1.2} />
      <IceFormation position={[4, 0, 0]} scale={0.8} />
      <IceFormation position={[-6, 0, 3]} scale={1.0} />
      <IceFormation position={[7, 0, 5]} scale={0.7} />

      {/* Ice pillars */}
      <IcePillar position={[-2, 0, 2]} />
      <IcePillar position={[3, 0, -4]} />
      <IcePillar position={[0, 0, -6]} />

      <SnowParticles />
    </>
  )
}
