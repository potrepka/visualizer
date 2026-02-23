import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#e8a060', 25, 70)
    scene.background = new THREE.Color('#e8a060')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function DesertGround() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(60, 60, 40, 40)
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      const z =
        Math.sin(x * 0.2) * 0.3 +
        Math.cos(y * 0.15) * 0.4 +
        Math.sin(x * 0.5 + y * 0.3) * 0.15
      pos.setZ(i, z)
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.1, 0]}
      geometry={geometry}
    >
      <meshStandardMaterial color="#d4a860" />
    </mesh>
  )
}

function SaguaroCactus({
  position,
  height,
}: {
  position: [number, number, number]
  height: number
}) {
  const arms = useMemo(() => {
    const arr: { y: number; side: number; armHeight: number }[] = []
    const count = 1 + Math.floor(Math.random() * 2)
    for (let i = 0; i < count; i++) {
      arr.push({
        y: height * 0.35 + Math.random() * height * 0.3,
        side: Math.random() > 0.5 ? 1 : -1,
        armHeight: 0.8 + Math.random() * 1.2,
      })
    }
    return arr
  }, [height])

  return (
    <group position={position}>
      {/* Main trunk */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[0.2, 0.25, height, 8]} />
        <meshStandardMaterial color="#2a6a2a" />
      </mesh>
      {/* Top dome */}
      <mesh position={[0, height, 0]}>
        <sphereGeometry args={[0.2, 8, 6]} />
        <meshStandardMaterial color="#308030" />
      </mesh>
      {/* Arms */}
      {arms.map((arm, i) => (
        <group key={i}>
          {/* Horizontal connector */}
          <mesh
            position={[arm.side * 0.35, arm.y, 0]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <cylinderGeometry args={[0.12, 0.14, 0.5, 6]} />
            <meshStandardMaterial color="#2a6a2a" />
          </mesh>
          {/* Vertical arm */}
          <mesh position={[arm.side * 0.6, arm.y + arm.armHeight / 2, 0]}>
            <cylinderGeometry args={[0.12, 0.15, arm.armHeight, 6]} />
            <meshStandardMaterial color="#2a7a2a" />
          </mesh>
          <mesh position={[arm.side * 0.6, arm.y + arm.armHeight, 0]}>
            <sphereGeometry args={[0.12, 6, 4]} />
            <meshStandardMaterial color="#308030" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function BarrelCactus({
  position,
  scale,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const s = scale ?? 1
  return (
    <group position={position} scale={s}>
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.35, 10, 8]} />
        <meshStandardMaterial color="#1a5a20" />
      </mesh>
      {/* Flower on top */}
      <mesh position={[0, 0.7, 0]}>
        <coneGeometry args={[0.08, 0.12, 6]} />
        <meshStandardMaterial
          color="#e8d030"
          emissive="#e8d030"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  )
}

function PricklyCactus({ position }: { position: [number, number, number] }) {
  const pads = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: number }[] = [
      { pos: [0, 0.3, 0], rot: 0 },
      { pos: [0.25, 0.7, 0], rot: 0.3 },
      { pos: [-0.2, 0.65, 0.1], rot: -0.2 },
    ]
    if (Math.random() > 0.5) {
      arr.push({ pos: [0.1, 1.0, -0.1], rot: 0.15 })
    }
    return arr
  }, [])

  return (
    <group position={position}>
      {pads.map((pad, i) => (
        <mesh key={i} position={pad.pos} rotation={[0, 0, pad.rot]}>
          <sphereGeometry args={[0.18, 8, 6]} />
          <meshStandardMaterial color="#3a7a2a" />
        </mesh>
      ))}
    </group>
  )
}

function DesertRock({
  position,
  scale,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const s = scale ?? 1
  return (
    <group position={position} scale={s}>
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.5, 6, 5]} />
        <meshStandardMaterial color="#9a7a5a" />
      </mesh>
      <mesh position={[0.3, 0.1, 0.2]}>
        <sphereGeometry args={[0.3, 5, 4]} />
        <meshStandardMaterial color="#8a6a4a" />
      </mesh>
    </group>
  )
}

function Succulent({ position }: { position: [number, number, number] }) {
  const leaves = useMemo(() => {
    const arr: { angle: number; tilt: number }[] = []
    for (let i = 0; i < 8; i++) {
      arr.push({ angle: (i / 8) * Math.PI * 2, tilt: 0.5 })
    }
    return arr
  }, [])

  return (
    <group position={position}>
      {leaves.map((leaf, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(leaf.angle) * 0.1,
            0.05,
            Math.sin(leaf.angle) * 0.1,
          ]}
          rotation={[leaf.tilt, leaf.angle, 0]}
        >
          <sphereGeometry args={[0.06, 5, 4]} />
          <meshStandardMaterial color="#5aaa6a" />
        </mesh>
      ))}
      <mesh position={[0, 0.03, 0]}>
        <sphereGeometry args={[0.05, 6, 4]} />
        <meshStandardMaterial color="#4a9a5a" />
      </mesh>
    </group>
  )
}

function Tumbleweed() {
  const ref = useRef<THREE.Mesh>(null!)
  const offset = useMemo(
    () => ({
      startX: (Math.random() - 0.5) * 30,
      z: (Math.random() - 0.5) * 20,
      speed: 0.8 + Math.random() * 1.5,
      size: 0.2 + Math.random() * 0.3,
    }),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const x = ((offset.startX + t * offset.speed) % 40) - 20
    ref.current.position.set(x, offset.size + 0.05, offset.z)
    ref.current.rotation.x = t * 2
    ref.current.rotation.z = t * 1.5
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[offset.size, 6, 5]} />
      <meshStandardMaterial color="#a08040" wireframe />
    </mesh>
  )
}

function HeatShimmer() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.03 + Math.sin(t * 2) * 0.02
  })

  return (
    <mesh ref={ref} position={[0, 1.5, -15]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 6]} />
      <meshStandardMaterial color="#ffffff" transparent opacity={0.04} />
    </mesh>
  )
}

export default function CactusDesertGarden() {
  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[-5, 10, 8]}
        intensity={1.4}
        color="#ffd080"
      />
      <ambientLight intensity={0.3} color="#ffa060" />
      <hemisphereLight args={['#ff9050', '#d4a060', 0.3]} />

      <DesertGround />

      {/* Saguaro cacti */}
      <SaguaroCactus position={[-4, 0, -3]} height={3.5} />
      <SaguaroCactus position={[5, 0, -6]} height={4.2} />
      <SaguaroCactus position={[-8, 0, -8]} height={3} />
      <SaguaroCactus position={[2, 0, 2]} height={3.8} />

      {/* Barrel cacti */}
      <BarrelCactus position={[-2, 0, 1]} />
      <BarrelCactus position={[3, 0, -1]} scale={0.8} />
      <BarrelCactus position={[-6, 0, 3]} scale={1.2} />
      <BarrelCactus position={[7, 0, 0]} />

      {/* Prickly pear */}
      <PricklyCactus position={[0, 0, -4]} />
      <PricklyCactus position={[-5, 0, 4]} />
      <PricklyCactus position={[6, 0, 3]} />

      {/* Succulents */}
      <Succulent position={[-1, 0, 2]} />
      <Succulent position={[4, 0, 4]} />
      <Succulent position={[-3, 0, -1]} />

      {/* Rocks */}
      <DesertRock position={[1, 0, -2]} scale={1.5} />
      <DesertRock position={[-7, 0, -1]} scale={1} />
      <DesertRock position={[8, 0, -4]} scale={0.8} />
      <DesertRock position={[-3, 0, 5]} scale={1.2} />

      {/* Tumbleweeds */}
      <Tumbleweed />
      <Tumbleweed />
      <Tumbleweed />

      <HeatShimmer />
    </>
  )
}
