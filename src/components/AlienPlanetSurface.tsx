import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#2a0a3a', 10, 60)
    scene.background = new THREE.Color('#1a0528')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function StrangeRockFormation({
  position,
  scale = 1,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const groupRef = useRef<THREE.Group>(null!)
  const spireCount = 3 + Math.floor(Math.random() * 4)

  const spires = useMemo(() => {
    const arr = []
    for (let i = 0; i < spireCount; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 1.5,
        z: (Math.random() - 0.5) * 1.5,
        height: 1.5 + Math.random() * 3,
        radiusBottom: 0.3 + Math.random() * 0.4,
        radiusTop: 0.05 + Math.random() * 0.15,
        tilt: (Math.random() - 0.5) * 0.3,
        color: `hsl(${280 + Math.random() * 40}, ${40 + Math.random() * 30}%, ${25 + Math.random() * 20}%)`,
      })
    }
    return arr
  }, [spireCount])

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {spires.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, s.height / 2, s.z]}
          rotation={[s.tilt, 0, s.tilt * 0.5]}
        >
          <cylinderGeometry args={[s.radiusTop, s.radiusBottom, s.height, 6]} />
          <meshStandardMaterial color={s.color} roughness={0.8} />
        </mesh>
      ))}
      {/* Base rocks */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[1.2, 8, 6]} />
        <meshStandardMaterial color="#3a1a4a" roughness={0.9} />
      </mesh>
    </group>
  )
}

function AlienPlant({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)
  const stemCount = 4 + Math.floor(Math.random() * 3)

  const stems = useMemo(() => {
    const arr = []
    for (let i = 0; i < stemCount; i++) {
      const angle = (i / stemCount) * Math.PI * 2
      arr.push({
        angle,
        lean: 0.3 + Math.random() * 0.5,
        height: 0.8 + Math.random() * 1.2,
        bulbSize: 0.1 + Math.random() * 0.15,
        hue: 120 + Math.random() * 80,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [stemCount])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.children.forEach((child, i) => {
      if (i < stems.length) {
        child.rotation.x = Math.sin(t * 0.5 + stems[i].pulsePhase) * 0.1
        child.rotation.z = Math.cos(t * 0.4 + stems[i].pulsePhase) * 0.1
      }
    })
  })

  return (
    <group ref={ref} position={position}>
      {stems.map((s, i) => (
        <group key={i} rotation={[s.lean, s.angle, 0]}>
          {/* Stem */}
          <mesh position={[0, s.height / 2, 0]}>
            <cylinderGeometry args={[0.02, 0.04, s.height, 6]} />
            <meshStandardMaterial color={`hsl(${s.hue}, 70%, 30%)`} />
          </mesh>
          {/* Bioluminescent bulb */}
          <mesh position={[0, s.height, 0]}>
            <sphereGeometry args={[s.bulbSize, 10, 10]} />
            <meshStandardMaterial
              color={`hsl(${s.hue}, 90%, 60%)`}
              emissive={`hsl(${s.hue}, 90%, 50%)`}
              emissiveIntensity={1.5}
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      ))}
      {/* Base */}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color="#2a4a2a" roughness={0.8} />
      </mesh>
    </group>
  )
}

function Moon({
  position,
  size,
  color,
}: {
  position: [number, number, number]
  size: number
  color: string
}) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 24, 24]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
      />
    </mesh>
  )
}

const SPORE_COUNT = 80
const sporeDummy = new THREE.Object3D()

function BioluminescentSpores() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const spores = useMemo(() => {
    const arr = []
    for (let i = 0; i < SPORE_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 30,
        y: 0.5 + Math.random() * 5,
        z: (Math.random() - 0.5) * 30,
        speed: 0.2 + Math.random() * 0.5,
        amplitude: 0.5 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.04,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < SPORE_COUNT; i++) {
      const s = spores[i]
      sporeDummy.position.set(
        s.x + Math.sin(t * s.speed + s.phase) * s.amplitude,
        s.y + Math.sin(t * s.speed * 1.3 + s.phase) * 0.5,
        s.z + Math.cos(t * s.speed + s.phase) * s.amplitude,
      )
      sporeDummy.scale.setScalar(
        s.scale * (1 + Math.sin(t * 2 + s.phase) * 0.3),
      )
      sporeDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, sporeDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SPORE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="#44ffaa"
        emissive="#22ff88"
        emissiveIntensity={2}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  )
}

function AlienGround() {
  return (
    <group>
      {/* Main ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#1a0a2a" roughness={0.9} />
      </mesh>
      {/* Ground texture patches */}
      {Array.from({ length: 15 }).map((_, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2, Math.random() * Math.PI, 0]}
          position={[
            (Math.random() - 0.5) * 30,
            0.01,
            (Math.random() - 0.5) * 30,
          ]}
        >
          <circleGeometry args={[1 + Math.random() * 2, 8]} />
          <meshStandardMaterial
            color={`hsl(${280 + Math.random() * 40}, 50%, ${15 + Math.random() * 10}%)`}
            roughness={0.95}
          />
        </mesh>
      ))}
    </group>
  )
}

function CrystalCluster({ position }: { position: [number, number, number] }) {
  const crystals = useMemo(() => {
    const arr = []
    for (let i = 0; i < 5; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 0.6,
        z: (Math.random() - 0.5) * 0.6,
        height: 0.5 + Math.random() * 1.5,
        radius: 0.05 + Math.random() * 0.1,
        tilt: (Math.random() - 0.5) * 0.4,
        hue: 260 + Math.random() * 60,
      })
    }
    return arr
  }, [])

  return (
    <group position={position}>
      {crystals.map((c, i) => (
        <mesh
          key={i}
          position={[c.x, c.height / 2, c.z]}
          rotation={[c.tilt, 0, c.tilt]}
        >
          <cylinderGeometry args={[0, c.radius, c.height, 5]} />
          <meshStandardMaterial
            color={`hsl(${c.hue}, 70%, 50%)`}
            emissive={`hsl(${c.hue}, 70%, 40%)`}
            emissiveIntensity={0.8}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function AlienPlanetSurface() {
  return (
    <>
      <SceneSetup />

      {/* Alien sky lighting */}
      <directionalLight position={[5, 10, 3]} color="#cc66ff" intensity={0.8} />
      <ambientLight intensity={0.15} color="#220044" />
      <pointLight
        position={[0, 8, 0]}
        color="#44ffaa"
        intensity={1}
        distance={20}
      />
      <hemisphereLight args={['#330066', '#110022', 0.3]} />

      <AlienGround />

      {/* Multiple moons */}
      <Moon position={[20, 25, -30]} size={3} color="#aaaacc" />
      <Moon position={[-15, 18, -25]} size={1.5} color="#cc8866" />
      <Moon position={[30, 15, -20]} size={0.8} color="#88aacc" />

      {/* Rock formations */}
      <StrangeRockFormation position={[-6, 0, -4]} scale={1.2} />
      <StrangeRockFormation position={[8, 0, -6]} scale={0.8} />
      <StrangeRockFormation position={[3, 0, 8]} scale={1.0} />
      <StrangeRockFormation position={[-10, 0, 5]} scale={1.5} />

      {/* Alien vegetation */}
      <AlienPlant position={[-2, 0, 1]} />
      <AlienPlant position={[4, 0, -2]} />
      <AlienPlant position={[-5, 0, -3]} />
      <AlienPlant position={[1, 0, 5]} />
      <AlienPlant position={[7, 0, 3]} />
      <AlienPlant position={[-8, 0, -1]} />

      {/* Crystal clusters */}
      <CrystalCluster position={[2, 0, -1]} />
      <CrystalCluster position={[-4, 0, 4]} />
      <CrystalCluster position={[6, 0, -5]} />

      {/* Bioluminescent floating spores */}
      <BioluminescentSpores />
    </>
  )
}
