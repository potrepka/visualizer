import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a2233', 12, 35)
    scene.background = new THREE.Color('#0d1520')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Tiny house ---
function TinyHouse({
  position,
  color,
  roofColor,
  scale,
}: {
  position: [number, number, number]
  color: string
  roofColor: string
  scale?: number
}) {
  const s = scale || 1
  return (
    <group position={position} scale={[s, s, s]}>
      {/* Walls */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.3, 0.3, 0.25]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.38, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.25, 0.2, 4]} />
        <meshStandardMaterial color={roofColor} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.08, 0.126]}>
        <boxGeometry args={[0.06, 0.12, 0.01]} />
        <meshStandardMaterial color="#5d3a1a" />
      </mesh>
      {/* Window */}
      <mesh position={[0.08, 0.2, 0.126]}>
        <boxGeometry args={[0.05, 0.05, 0.01]} />
        <meshStandardMaterial
          color="#ffeeaa"
          emissive="#ffcc44"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Snow on roof */}
      <mesh position={[0, 0.44, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.26, 0.06, 4]} />
        <meshStandardMaterial color="#f0f5ff" />
      </mesh>
    </group>
  )
}

// --- Church ---
function Church({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main body */}
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.35, 0.4, 0.5]} />
        <meshStandardMaterial color="#e8e0d0" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 0.5, 0]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.4, 0.05, 0.55]} />
        <meshStandardMaterial color="#6b3a2a" />
      </mesh>
      {/* Tower */}
      <mesh position={[0, 0.5, -0.15]}>
        <boxGeometry args={[0.15, 0.4, 0.15]} />
        <meshStandardMaterial color="#ddd8c8" />
      </mesh>
      {/* Steeple */}
      <mesh position={[0, 0.8, -0.15]}>
        <coneGeometry args={[0.1, 0.25, 4]} />
        <meshStandardMaterial color="#555555" />
      </mesh>
      {/* Cross */}
      <mesh position={[0, 0.98, -0.15]}>
        <boxGeometry args={[0.04, 0.08, 0.01]} />
        <meshStandardMaterial color="#ccaa00" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.96, -0.15]}>
        <boxGeometry args={[0.08, 0.015, 0.01]} />
        <meshStandardMaterial color="#ccaa00" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.1, 0.251]}>
        <boxGeometry args={[0.08, 0.18, 0.01]} />
        <meshStandardMaterial color="#4a2a10" />
      </mesh>
      {/* Snow on roof */}
      <mesh position={[0, 0.53, 0]}>
        <boxGeometry args={[0.42, 0.02, 0.57]} />
        <meshStandardMaterial color="#f0f5ff" />
      </mesh>
    </group>
  )
}

// --- Tiny tree ---
function SnowTree({
  position,
  scale,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const s = scale || 1
  return (
    <group position={position} scale={[s, s, s]}>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.015, 0.02, 0.12, 5]} />
        <meshStandardMaterial color="#5d3a1a" />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <coneGeometry args={[0.08, 0.15, 6]} />
        <meshStandardMaterial color="#1b5e20" />
      </mesh>
      <mesh position={[0, 0.26, 0]}>
        <coneGeometry args={[0.06, 0.12, 6]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>
      {/* Snow caps */}
      <mesh position={[0, 0.22, 0]}>
        <coneGeometry args={[0.082, 0.03, 6]} />
        <meshStandardMaterial color="#eef5ff" />
      </mesh>
      <mesh position={[0, 0.31, 0]}>
        <coneGeometry args={[0.062, 0.02, 6]} />
        <meshStandardMaterial color="#eef5ff" />
      </mesh>
    </group>
  )
}

// --- Snow particles ---
const SNOW_COUNT = 300
const snowDummy = new THREE.Object3D()

function SnowParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(
    () =>
      Array.from({ length: SNOW_COUNT }, () => ({
        x: (Math.random() - 0.5) * 4,
        y: Math.random() * 4,
        z: (Math.random() - 0.5) * 4,
        speed: 0.2 + Math.random() * 0.3,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: 0.5 + Math.random() * 1,
        scale: 0.01 + Math.random() * 0.015,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < SNOW_COUNT; i++) {
      const p = particles[i]
      let y = p.y - t * p.speed
      y = ((y % 4) + 4) % 4

      const dist = Math.sqrt(p.x * p.x + y * y + p.z * p.z)
      // Keep within globe radius
      if (dist > 2.3) {
        snowDummy.scale.setScalar(0)
      } else {
        snowDummy.scale.setScalar(p.scale)
      }

      snowDummy.position.set(
        p.x + Math.sin(t * p.wobbleSpeed + p.wobble) * 0.1,
        y,
        p.z + Math.cos(t * p.wobbleSpeed + p.wobble) * 0.1,
      )
      snowDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, snowDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SNOW_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ddeeff"
        emissiveIntensity={0.5}
      />
    </instancedMesh>
  )
}

// --- Glass globe ---
function GlassSphere() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.12 + 0.03 * Math.sin(clock.getElapsedTime() * 0.5)
  })

  return (
    <mesh ref={ref} position={[0, 2.2, 0]}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshStandardMaterial
        color="#aaddff"
        transparent
        opacity={0.12}
        roughness={0.05}
        metalness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// --- Wooden base ---
function WoodenBase() {
  return (
    <group>
      {/* Main base cylinder */}
      <mesh position={[0, -0.6, 0]}>
        <cylinderGeometry args={[2.8, 3.0, 1.0, 24]} />
        <meshStandardMaterial color="#5d3a1a" roughness={0.7} />
      </mesh>
      {/* Lip ring */}
      <mesh position={[0, -0.05, 0]}>
        <torusGeometry args={[2.6, 0.12, 8, 24]} />
        <meshStandardMaterial color="#4a2e14" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Bottom ring */}
      <mesh position={[0, -1.05, 0]}>
        <torusGeometry args={[2.9, 0.1, 8, 24]} />
        <meshStandardMaterial color="#3a2010" roughness={0.5} />
      </mesh>
      {/* Decorative band */}
      <mesh position={[0, -0.5, 0]}>
        <cylinderGeometry args={[2.85, 2.85, 0.15, 24]} />
        <meshStandardMaterial color="#8b6914" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  )
}

// --- Ground plane inside globe ---
function GlobeGround() {
  return (
    <group>
      {/* Snow ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[2.4, 32]} />
        <meshStandardMaterial color="#e8eef5" roughness={0.9} />
      </mesh>
      {/* Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0.3]}>
        <planeGeometry args={[0.15, 1.5]} />
        <meshStandardMaterial color="#bbb5a5" roughness={0.8} />
      </mesh>
    </group>
  )
}

// --- Street lamp ---
function StreetLamp({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]}>
        <cylinderGeometry args={[0.01, 0.012, 0.3, 6]} />
        <meshStandardMaterial color="#333333" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.32, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial
          color="#ffeecc"
          emissive="#ffcc44"
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight
        position={[0, 0.32, 0]}
        color="#ffcc44"
        intensity={0.15}
        distance={1.5}
      />
    </group>
  )
}

// --- Slow rotation for entire globe ---
function GlobeRotation({ children }: { children: React.ReactNode }) {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.3
  })

  return <group ref={ref}>{children}</group>
}

// --- Main Scene ---
export default function SnowGlobeVillage() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.3} color="#aabbdd" />
      <directionalLight position={[5, 10, 5]} intensity={0.8} color="#eeeeff" />
      <pointLight
        position={[0, 3, 2]}
        color="#ffddaa"
        intensity={0.5}
        distance={8}
      />

      <GlobeRotation>
        <GlassSphere />
        <GlobeGround />

        {/* Village */}
        <TinyHouse
          position={[-0.5, 0, 0.3]}
          color="#cc6644"
          roofColor="#884422"
        />
        <TinyHouse
          position={[0.4, 0, -0.2]}
          color="#ddcc88"
          roofColor="#775533"
          scale={0.8}
        />
        <TinyHouse
          position={[-0.8, 0, -0.5]}
          color="#aabb88"
          roofColor="#667744"
          scale={0.7}
        />
        <TinyHouse
          position={[0.8, 0, 0.5]}
          color="#8899bb"
          roofColor="#556677"
          scale={0.9}
        />
        <Church position={[0, 0, -0.6]} />

        {/* Trees */}
        <SnowTree position={[-1.2, 0, 0.8]} />
        <SnowTree position={[1.0, 0, -0.8]} scale={0.8} />
        <SnowTree position={[-0.3, 0, 1.0]} scale={1.2} />
        <SnowTree position={[1.3, 0, 0]} scale={0.7} />
        <SnowTree position={[-1.0, 0, -1.0]} scale={0.9} />
        <SnowTree position={[0.5, 0, 1.2]} />
        <SnowTree position={[-1.5, 0, 0]} scale={0.6} />

        {/* Street lamps */}
        <StreetLamp position={[-0.2, 0, 0.5]} />
        <StreetLamp position={[0.3, 0, 0.1]} />

        <SnowParticles />
      </GlobeRotation>

      <WoodenBase />
    </>
  )
}
