import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a1820', 15, 60)
    scene.background = new THREE.Color('#12101a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Pendulum({
  position,
  length,
  bobRadius = 0.4,
  phase = 0,
  amplitude = 0.6,
  color = '#c0a850',
}: {
  position: [number, number, number]
  length: number
  bobRadius?: number
  phase?: number
  amplitude?: number
  color?: string
}) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const period = Math.sqrt(length) * 1.5
    const angle = Math.sin(t / period + phase) * amplitude
    groupRef.current.rotation.z = angle
  })

  return (
    <group position={position}>
      {/* Mount point */}
      <mesh>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#8a8090" metalness={0.6} roughness={0.3} />
      </mesh>
      <group ref={groupRef}>
        {/* Rod */}
        <mesh position={[0, -length / 2, 0]}>
          <cylinderGeometry args={[0.025, 0.025, length, 8]} />
          <meshStandardMaterial
            color="#a0a0a0"
            metalness={0.7}
            roughness={0.25}
          />
        </mesh>
        {/* Bob */}
        <mesh position={[0, -length, 0]}>
          <sphereGeometry args={[bobRadius, 16, 16]} />
          <meshStandardMaterial
            color={color}
            metalness={0.85}
            roughness={0.15}
          />
        </mesh>
      </group>
    </group>
  )
}

function PolishedFloor() {
  return (
    <group>
      {/* Main floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1a1520" metalness={0.6} roughness={0.2} />
      </mesh>
      {/* Floor pattern - concentric circles */}
      {[2, 4, 6, 8].map((r, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
          <torusGeometry args={[r, 0.03, 4, 48]} />
          <meshStandardMaterial
            color="#c0a040"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
      {/* Cardinal lines */}
      {[0, Math.PI / 4, Math.PI / 2, (3 * Math.PI) / 4].map((rot, i) => (
        <mesh key={i} rotation={[-Math.PI / 2, 0, rot]} position={[0, 0.01, 0]}>
          <boxGeometry args={[0.02, 20, 0.005]} />
          <meshStandardMaterial
            color="#c0a040"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

function Pillar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[1.2, 0.6, 1.2]} />
        <meshStandardMaterial color="#3a3040" roughness={0.6} />
      </mesh>
      {/* Column */}
      <mesh position={[0, 5.5, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 10, 12]} />
        <meshStandardMaterial color="#4a4050" roughness={0.5} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, 10.8, 0]}>
        <boxGeometry args={[1.0, 0.5, 1.0]} />
        <meshStandardMaterial color="#3a3040" roughness={0.6} />
      </mesh>
      {/* Fluting detail */}
      <mesh position={[0, 5.5, 0]}>
        <cylinderGeometry args={[0.38, 0.43, 10, 12]} />
        <meshStandardMaterial color="#4a4050" roughness={0.5} wireframe />
      </mesh>
    </group>
  )
}

function CeilingBeams() {
  const beamPositions = useMemo(() => {
    const arr: [number, number, number][] = []
    for (let x = -10; x <= 10; x += 5) {
      arr.push([x, 12, 0])
    }
    for (let z = -10; z <= 10; z += 5) {
      arr.push([0, 12, z])
    }
    return arr
  }, [])

  return (
    <group>
      {/* Ceiling plane */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 12.5, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#2a2030" side={THREE.BackSide} />
      </mesh>
      {/* Beams */}
      {beamPositions.map((pos, i) => (
        <mesh key={i} position={pos} rotation={[0, i < 5 ? Math.PI / 2 : 0, 0]}>
          <boxGeometry args={[0.3, 0.5, 24]} />
          <meshStandardMaterial color="#3a2a1a" roughness={0.7} />
        </mesh>
      ))}
      {/* Central rosette for main pendulum mount */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 12.49, 0]}>
        <torusGeometry args={[1, 0.15, 8, 24]} />
        <meshStandardMaterial color="#c0a040" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function WallSection({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 6, 0]}>
        <boxGeometry args={[30, 12, 0.5]} />
        <meshStandardMaterial color="#2a2030" roughness={0.7} />
      </mesh>
      {/* Wainscoting */}
      <mesh position={[0, 1.5, 0.26]}>
        <boxGeometry args={[30, 3, 0.05]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.6} />
      </mesh>
      {/* Crown molding */}
      <mesh position={[0, 11.8, 0.26]}>
        <boxGeometry args={[30, 0.3, 0.15]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.5} />
      </mesh>
    </group>
  )
}

function ChandLight({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          color="#ffeebb"
          emissive="#ffcc66"
          emissiveIntensity={0.8}
        />
      </mesh>
      <pointLight color="#ffdd88" intensity={1.5} distance={12} />
    </group>
  )
}

export default function PendulumRoom() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 12, 3]} intensity={0.3} color="#ffeedd" />
      <ambientLight intensity={0.1} color="#403050" />

      <PolishedFloor />
      <CeilingBeams />

      {/* Walls */}
      <WallSection position={[0, 0, -15]} rotation={[0, 0, 0]} />
      <WallSection position={[0, 0, 15]} rotation={[0, Math.PI, 0]} />
      <WallSection position={[-15, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <WallSection position={[15, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />

      {/* Central Foucault pendulum */}
      <Pendulum
        position={[0, 12, 0]}
        length={10}
        bobRadius={0.6}
        phase={0}
        amplitude={0.25}
        color="#c0a040"
      />

      {/* Surrounding pendulums - varying lengths */}
      <Pendulum
        position={[-4, 12, -4]}
        length={6}
        phase={0.5}
        amplitude={0.5}
        color="#d0b060"
      />
      <Pendulum
        position={[4, 12, -4]}
        length={7}
        phase={1.2}
        amplitude={0.45}
        color="#b09030"
      />
      <Pendulum
        position={[-4, 12, 4]}
        length={5}
        phase={2.0}
        amplitude={0.55}
        color="#c09840"
      />
      <Pendulum
        position={[4, 12, 4]}
        length={8}
        phase={0.8}
        amplitude={0.4}
        color="#d0a850"
      />
      <Pendulum
        position={[0, 12, -6]}
        length={4}
        phase={1.5}
        amplitude={0.6}
        color="#e0c060"
      />
      <Pendulum
        position={[0, 12, 6]}
        length={9}
        phase={3.0}
        amplitude={0.35}
        color="#a08828"
      />
      <Pendulum
        position={[-6, 12, 0]}
        length={3.5}
        phase={0.3}
        amplitude={0.65}
        color="#c0a848"
      />
      <Pendulum
        position={[6, 12, 0]}
        length={5.5}
        phase={2.5}
        amplitude={0.5}
        color="#b09838"
      />

      {/* Pillars */}
      <Pillar position={[-8, 0, -8]} />
      <Pillar position={[8, 0, -8]} />
      <Pillar position={[-8, 0, 8]} />
      <Pillar position={[8, 0, 8]} />

      {/* Lighting */}
      <ChandLight position={[-8, 10, -8]} />
      <ChandLight position={[8, 10, -8]} />
      <ChandLight position={[-8, 10, 8]} />
      <ChandLight position={[8, 10, 8]} />
    </>
  )
}
