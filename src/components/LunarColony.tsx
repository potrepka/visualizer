import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.background = new THREE.Color('#0a0a14')
    scene.fog = new THREE.Fog('#0a0a14', 30, 80)
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function LunarSurface() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
      <planeGeometry args={[100, 100, 64, 64]} />
      <meshStandardMaterial color="#8a8a8a" roughness={0.95} metalness={0.0} />
    </mesh>
  )
}

function Crater({
  position,
  radius,
}: {
  position: [number, number, number]
  radius: number
}) {
  return (
    <group position={position}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <ringGeometry args={[radius * 0.6, radius, 24]} />
        <meshStandardMaterial color="#6e6e6e" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <circleGeometry args={[radius * 0.6, 24]} />
        <meshStandardMaterial color="#555555" roughness={1} />
      </mesh>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        const r = radius * 0.85
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, 0.02, Math.sin(angle) * r]}
          >
            <sphereGeometry args={[radius * 0.12, 6, 6]} />
            <meshStandardMaterial color="#7a7a7a" roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}

function DomeHabitat({
  position,
  scale = 1,
}: {
  position: [number, number, number]
  scale?: number
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[1.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#c8dce8"
          transparent
          opacity={0.55}
          metalness={0.3}
          roughness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.2, 24]} />
        <meshStandardMaterial color="#606878" metalness={0.4} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#889098" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.15, 0.35]}>
        <boxGeometry args={[0.35, 0.3, 0.1]} />
        <meshStandardMaterial
          color="#aaddff"
          emissive="#aaddff"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

function ConnectorTube({
  from,
  to,
}: {
  from: [number, number, number]
  to: [number, number, number]
}) {
  const midX = (from[0] + to[0]) / 2
  const midZ = (from[2] + to[2]) / 2
  const dx = to[0] - from[0]
  const dz = to[2] - from[2]
  const length = Math.sqrt(dx * dx + dz * dz)
  const angle = Math.atan2(dx, dz)
  return (
    <mesh position={[midX, 0.25, midZ]} rotation={[0, angle, Math.PI / 2]}>
      <cylinderGeometry args={[0.15, 0.15, length, 8]} />
      <meshStandardMaterial color="#707880" metalness={0.5} roughness={0.5} />
    </mesh>
  )
}

function SolarPanel({
  position,
  rotation = 0,
}: {
  position: [number, number, number]
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation, 0]}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 1.6, 6]} />
        <meshStandardMaterial color="#666" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.6, 0]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[1.8, 0.03, 0.9]} />
        <meshStandardMaterial color="#1a237e" metalness={0.7} roughness={0.2} />
      </mesh>
      {[-0.6, 0, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 1.6, 0]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.02, 0.04, 0.92]} />
          <meshStandardMaterial color="#555" metalness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function Rover({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)
  const wheelRef1 = useRef<THREE.Mesh>(null!)
  const wheelRef2 = useRef<THREE.Mesh>(null!)
  const wheelRef3 = useRef<THREE.Mesh>(null!)
  const wheelRef4 = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.x = position[0] + Math.sin(t * 0.3) * 2
    ref.current.position.z = position[2] + Math.cos(t * 0.3) * 2
    ref.current.rotation.y = -t * 0.3 + Math.PI / 2
    const wheelSpin = t * 2
    wheelRef1.current.rotation.x = wheelSpin
    wheelRef2.current.rotation.x = wheelSpin
    wheelRef3.current.rotation.x = wheelSpin
    wheelRef4.current.rotation.x = wheelSpin
  })

  return (
    <group ref={ref} position={position}>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.8, 0.2, 0.5]} />
        <meshStandardMaterial color="#cccccc" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.1, 0.4, 0]}>
        <boxGeometry args={[0.35, 0.15, 0.4]} />
        <meshStandardMaterial color="#aaaaaa" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.35, 0.5, 0]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.3, 0.02, 0.15]} />
        <meshStandardMaterial color="#1a237e" metalness={0.7} roughness={0.2} />
      </mesh>
      {[
        [-0.3, 0.1, 0.3],
        [-0.3, 0.1, -0.3],
        [0.3, 0.1, 0.3],
        [0.3, 0.1, -0.3],
      ].map((pos, i) => (
        <mesh
          key={i}
          ref={
            i === 0
              ? wheelRef1
              : i === 1
                ? wheelRef2
                : i === 2
                  ? wheelRef3
                  : wheelRef4
          }
          position={pos as [number, number, number]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.1, 0.1, 0.06, 12]} />
          <meshStandardMaterial color="#444" metalness={0.3} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function EarthInSky() {
  const ref = useRef<THREE.Mesh>(null!)
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.getElapsedTime() * 0.02
  })
  return (
    <mesh ref={ref} position={[15, 25, -30]}>
      <sphereGeometry args={[4, 32, 32]} />
      <meshStandardMaterial
        color="#2255aa"
        emissive="#1144aa"
        emissiveIntensity={0.4}
      />
    </mesh>
  )
}

const STAR_COUNT = 300
const starDummy = new THREE.Object3D()

function StarField() {
  const ref = useRef<THREE.InstancedMesh>(null!)

  useEffect(() => {
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI * 0.4
      const r = 60 + Math.random() * 20
      starDummy.position.set(
        Math.cos(theta) * Math.sin(phi) * r,
        20 + Math.cos(phi) * r * 0.5,
        Math.sin(theta) * Math.sin(phi) * r,
      )
      starDummy.scale.setScalar(0.03 + Math.random() * 0.06)
      starDummy.updateMatrix()
      ref.current.setMatrixAt(i, starDummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  }, [])

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, STAR_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  )
}

function CommunicationDish({
  position,
}: {
  position: [number, number, number]
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 1.2, 6]} />
        <meshStandardMaterial color="#999" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.3, 0]} rotation={[0.5, 0, 0]}>
        <sphereGeometry args={[0.4, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#ccc"
          metalness={0.7}
          roughness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

export default function LunarColony() {
  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[10, 15, 5]}
        intensity={2.0}
        color="#fffde8"
      />
      <ambientLight intensity={0.08} />
      <pointLight
        position={[0, 3, 0]}
        intensity={0.4}
        color="#aaddff"
        distance={15}
      />

      <LunarSurface />
      <StarField />
      <EarthInSky />

      <DomeHabitat position={[0, 0, 0]} scale={1.2} />
      <DomeHabitat position={[-3.5, 0, 1]} scale={0.9} />
      <DomeHabitat position={[3, 0, -1.5]} scale={1.0} />
      <DomeHabitat position={[1.5, 0, 3.5]} scale={0.7} />

      <ConnectorTube from={[0, 0, 0]} to={[-3.5, 0, 1]} />
      <ConnectorTube from={[0, 0, 0]} to={[3, 0, -1.5]} />
      <ConnectorTube from={[0, 0, 0]} to={[1.5, 0, 3.5]} />

      <SolarPanel position={[5, 0, 3]} />
      <SolarPanel position={[5.5, 0, 4.5]} rotation={0.3} />
      <SolarPanel position={[6, 0, 3]} rotation={-0.2} />
      <SolarPanel position={[-5, 0, -2]} rotation={1.2} />

      <Rover position={[-2, 0, 5]} />
      <CommunicationDish position={[-6, 0, 0]} />

      <Crater position={[8, 0, -5]} radius={2.0} />
      <Crater position={[-8, 0, -8]} radius={3.0} />
      <Crater position={[12, 0, 6]} radius={1.5} />
      <Crater position={[-4, 0, -12]} radius={2.5} />
    </>
  )
}
