import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#c8b8a0', 20, 60)
    scene.background = new THREE.Color('#d0c0a8')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function CanalWater() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const geo = ref.current.geometry as THREE.PlaneGeometry
    const pos = geo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const y = pos.getY(i)
      pos.setZ(
        i,
        Math.sin(x * 0.8 + t) * 0.04 + Math.cos(y * 0.6 + t * 0.7) * 0.03,
      )
    }
    pos.needsUpdate = true
    geo.computeVertexNormals()
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <planeGeometry args={[5, 30, 20, 40]} />
      <meshStandardMaterial
        color="#3a6a5a"
        transparent
        opacity={0.85}
        metalness={0.3}
        roughness={0.2}
      />
    </mesh>
  )
}

function Building({
  position,
  width,
  height,
  depth,
  color,
  windowColor,
}: {
  position: [number, number, number]
  width: number
  height: number
  depth: number
  color: string
  windowColor?: string
}) {
  const windows = useMemo(() => {
    const arr: [number, number][] = []
    const cols = Math.floor(width / 0.8)
    const rows = Math.floor(height / 1.2)
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        arr.push([(c - (cols - 1) / 2) * 0.8, 1 + r * 1.1])
      }
    }
    return arr
  }, [width, height])

  return (
    <group position={position}>
      {/* Main wall */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Windows facing canal */}
      {windows.map(([x, y], i) => (
        <mesh key={i} position={[x, y, depth / 2 + 0.01]}>
          <boxGeometry args={[0.4, 0.55, 0.03]} />
          <meshStandardMaterial color={windowColor ?? '#4a607a'} />
        </mesh>
      ))}
      {/* Window shutters */}
      {windows.map(([x, y], i) => (
        <group key={`s${i}`}>
          <mesh position={[x - 0.25, y, depth / 2 + 0.02]}>
            <boxGeometry args={[0.06, 0.55, 0.02]} />
            <meshStandardMaterial color="#5a7a5a" />
          </mesh>
          <mesh position={[x + 0.25, y, depth / 2 + 0.02]}>
            <boxGeometry args={[0.06, 0.55, 0.02]} />
            <meshStandardMaterial color="#5a7a5a" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Bridge({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Arch - simulated with a wide cylinder */}
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[6, 0.3, 2.5]} />
        <meshStandardMaterial color="#b0a090" />
      </mesh>
      {/* Railings */}
      {[-1, 1].map((z, i) => (
        <mesh key={i} position={[0, 1.7, z * 1.1]}>
          <boxGeometry args={[6, 0.6, 0.1]} />
          <meshStandardMaterial color="#a09080" />
        </mesh>
      ))}
      {/* Support pillars */}
      {[-2.5, 2.5].map((x, i) => (
        <mesh key={i} position={[x, 0.6, 0]}>
          <boxGeometry args={[0.4, 1.3, 2.5]} />
          <meshStandardMaterial color="#a09080" />
        </mesh>
      ))}
      {/* Arch underside */}
      <mesh position={[0, 0.7, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 2.3, 12, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#907a6a" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function Gondola({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.z = Math.sin(t * 0.8) * 0.02
    ref.current.position.y = Math.sin(t * 0.6) * 0.03
  })

  return (
    <group ref={ref} position={position}>
      {/* Hull */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.2, 3]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Bow curve */}
      <mesh position={[0, 0.1, 1.6]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.5]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Stern */}
      <mesh position={[0, 0.1, -1.4]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.4, 0.05, 0.4]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Ferro (bow ornament) */}
      <mesh position={[0, 0.3, 1.8]}>
        <boxGeometry args={[0.03, 0.3, 0.05]} />
        <meshStandardMaterial color="#c0a030" />
      </mesh>
      {/* Seat */}
      <mesh position={[0, 0.2, -0.3]}>
        <boxGeometry args={[0.5, 0.15, 0.6]} />
        <meshStandardMaterial color="#c03020" />
      </mesh>
      {/* Oar pole (held by imaginary gondolier) */}
      <mesh position={[0.35, 0.5, -1]} rotation={[0.2, 0, 0.1]}>
        <cylinderGeometry args={[0.02, 0.02, 2, 5]} />
        <meshStandardMaterial color="#8a6a30" />
      </mesh>
    </group>
  )
}

function LampPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 2.4, 6]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      {/* Lantern box */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[0.2, 0.3, 0.2]} />
        <meshStandardMaterial
          color="#e8c860"
          emissive="#e8c860"
          emissiveIntensity={0.5}
          transparent
          opacity={0.8}
        />
      </mesh>
      {/* Lantern top */}
      <mesh position={[0, 2.7, 0]}>
        <coneGeometry args={[0.12, 0.1, 4]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      <pointLight
        position={[0, 2.5, 0]}
        color="#ffe090"
        intensity={1}
        distance={5}
      />
    </group>
  )
}

function MooringPole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 1.5, 6]} />
        <meshStandardMaterial color="#2040a0" />
      </mesh>
      {/* Stripe */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.052, 0.052, 0.15, 6]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.06, 6, 5]} />
        <meshStandardMaterial color="#c0a020" />
      </mesh>
    </group>
  )
}

function Walkway({
  position,
  length,
}: {
  position: [number, number, number]
  length: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[2, 0.1, length]} />
        <meshStandardMaterial color="#b0a090" />
      </mesh>
      {/* Edge stones */}
      <mesh position={[1, 0.15, 0]}>
        <boxGeometry args={[0.1, 0.15, length]} />
        <meshStandardMaterial color="#908070" />
      </mesh>
    </group>
  )
}

export default function VeniceCanal() {
  const buildingColors = ['#d4a870', '#c4b8a0', '#d8c8a8', '#e0c890', '#c8a878']

  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 8, 3]} intensity={1.0} color="#ffe0b0" />
      <ambientLight intensity={0.35} color="#e8d0a0" />
      <hemisphereLight args={['#ffe0b0', '#3a5a4a', 0.2]} />

      <CanalWater />

      {/* Walkways */}
      <Walkway position={[-3.5, 0, 0]} length={30} />
      <Walkway position={[3.5, 0, 0]} length={30} />

      {/* Left side buildings */}
      {[-10, -6, -2, 2, 6, 10].map((z, i) => (
        <Building
          key={`l${i}`}
          position={[-5.5, 0, z]}
          width={3}
          height={4 + Math.sin(i) * 1.5}
          depth={3}
          color={buildingColors[i % buildingColors.length]}
        />
      ))}

      {/* Right side buildings */}
      {[-8, -4, 0, 4, 8].map((z, i) => (
        <Building
          key={`r${i}`}
          position={[5.5, 0, z]}
          width={3}
          height={3.5 + Math.cos(i) * 1.5}
          depth={3}
          color={buildingColors[(i + 2) % buildingColors.length]}
        />
      ))}

      {/* Bridge */}
      <Bridge position={[0, 0, 3]} />

      {/* Gondolas */}
      <Gondola position={[1, 0, -5]} />
      <Gondola position={[-0.8, 0, -9]} />

      {/* Lamp posts */}
      <LampPost position={[-2.5, 0, -4]} />
      <LampPost position={[2.5, 0, -2]} />
      <LampPost position={[-2.5, 0, 6]} />
      <LampPost position={[2.5, 0, 8]} />

      {/* Mooring poles */}
      <MooringPole position={[-2.3, -0.2, -6]} />
      <MooringPole position={[2.3, -0.2, -7]} />
      <MooringPole position={[-2.3, -0.2, 0]} />
      <MooringPole position={[2.3, -0.2, 1]} />
    </>
  )
}
