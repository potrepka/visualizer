import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a2a3a', 15, 45)
    scene.background = new THREE.Color('#0a1525')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Fountain Basin ---
function Basin() {
  return (
    <group>
      {/* Outer basin ring */}
      <mesh position={[0, 0.3, 0]}>
        <torusGeometry args={[3.5, 0.4, 16, 32]} />
        <meshStandardMaterial color="#8a8a8a" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Inner basin floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[3.5, 32]} />
        <meshStandardMaterial color="#2a4a6a" roughness={0.2} metalness={0.4} />
      </mesh>
      {/* Water surface in basin */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.25, 0]}>
        <circleGeometry args={[3.3, 32]} />
        <meshStandardMaterial
          color="#1a5588"
          transparent
          opacity={0.5}
          roughness={0.05}
          metalness={0.8}
        />
      </mesh>
      {/* Central pillar */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.25, 0.35, 2.2, 12]} />
        <meshStandardMaterial color="#999999" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Top bowl */}
      <mesh position={[0, 2.3, 0]}>
        <cylinderGeometry args={[0.8, 0.3, 0.4, 16]} />
        <meshStandardMaterial color="#aaaaaa" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Decorative rings on pillar */}
      {[0.6, 1.0, 1.4, 1.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <torusGeometry args={[0.32, 0.04, 8, 16]} />
          <meshStandardMaterial
            color="#bbbbbb"
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Water particles ---
const JET_PARTICLE_COUNT = 600
const jetDummy = new THREE.Object3D()

interface JetParticle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  life: number
  maxLife: number
  scale: number
}

function WaterJets() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useRef<JetParticle[]>([])

  useEffect(() => {
    particles.current = Array.from({ length: JET_PARTICLE_COUNT }, () => ({
      x: 0,
      y: 2.5,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      life: 0,
      maxLife: 1,
      scale: 0.03 + Math.random() * 0.04,
    }))
  }, [])

  const emitParticle = (p: JetParticle, jetIndex: number) => {
    const jets = 5
    const angle = (jetIndex / jets) * Math.PI * 2
    const spread = 0.15
    if (jetIndex === 0) {
      // Central jet
      p.x = (Math.random() - 0.5) * 0.1
      p.y = 2.5
      p.z = (Math.random() - 0.5) * 0.1
      p.vx = (Math.random() - 0.5) * 0.3
      p.vy = 4 + Math.random() * 2
      p.vz = (Math.random() - 0.5) * 0.3
    } else {
      // Side jets
      p.x = Math.cos(angle) * 0.5
      p.y = 2.5
      p.z = Math.sin(angle) * 0.5
      p.vx = Math.cos(angle) * 1.5 + (Math.random() - 0.5) * spread
      p.vy = 2.5 + Math.random() * 1.5
      p.vz = Math.sin(angle) * 1.5 + (Math.random() - 0.5) * spread
    }
    p.life = 0
    p.maxLife = 1.5 + Math.random() * 1.0
  }

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05)
    const gravity = -6
    const arr = particles.current

    for (let i = 0; i < JET_PARTICLE_COUNT; i++) {
      const p = arr[i]
      p.life += dt

      if (p.life >= p.maxLife || p.y < 0) {
        emitParticle(p, i % 5)
      }

      p.vy += gravity * dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.z += p.vz * dt

      const lifeRatio = p.life / p.maxLife
      const fadeScale =
        lifeRatio < 0.1
          ? lifeRatio / 0.1
          : lifeRatio > 0.8
            ? (1 - lifeRatio) / 0.2
            : 1

      jetDummy.position.set(p.x, p.y, p.z)
      jetDummy.scale.setScalar(p.scale * fadeScale)
      jetDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, jetDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, JET_PARTICLE_COUNT]}
    >
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#88ccff"
        emissive="#4488cc"
        emissiveIntensity={0.8}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  )
}

// --- Splash particles at basin surface ---
const SPLASH_COUNT = 200
const splashDummy = new THREE.Object3D()

function SplashParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(
    () =>
      Array.from({ length: SPLASH_COUNT }, () => ({
        angle: Math.random() * Math.PI * 2,
        radius: 1 + Math.random() * 2.5,
        speed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        yBase: 0.3,
        scale: 0.02 + Math.random() * 0.03,
      })),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < SPLASH_COUNT; i++) {
      const p = particles[i]
      const y = p.yBase + Math.abs(Math.sin(t * 3 + p.phase)) * 0.4
      splashDummy.position.set(
        Math.cos(p.angle + t * p.speed * 0.2) * p.radius,
        y,
        Math.sin(p.angle + t * p.speed * 0.2) * p.radius,
      )
      splashDummy.scale.setScalar(
        p.scale * (0.5 + 0.5 * Math.sin(t * 2 + p.phase)),
      )
      splashDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, splashDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SPLASH_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#aaddff"
        emissive="#6699cc"
        emissiveIntensity={0.5}
        transparent
        opacity={0.5}
      />
    </instancedMesh>
  )
}

// --- Plaza tiles ---
function Plaza() {
  const tiles = useMemo(() => {
    const arr: { x: number; z: number; color: string }[] = []
    for (let x = -8; x <= 8; x++) {
      for (let z = -8; z <= 8; z++) {
        const dist = Math.sqrt(x * x + z * z)
        if (dist > 3.8 && dist < 9) {
          const dark = (x + z) % 2 === 0
          arr.push({
            x: x * 0.8,
            z: z * 0.8,
            color: dark ? '#555566' : '#777788',
          })
        }
      }
    }
    return arr
  }, [])

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#333344" roughness={0.8} />
      </mesh>
      {tiles.map((t, i) => (
        <mesh
          key={i}
          position={[t.x, 0.01, t.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[0.75, 0.75]} />
          <meshStandardMaterial color={t.color} roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

// --- Lamp post ---
function LampPost({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    lightRef.current.intensity =
      0.6 + 0.2 * Math.sin(clock.getElapsedTime() * 1.5 + phase)
  })

  return (
    <group position={position}>
      <mesh position={[0, 1.5, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 3, 8]} />
        <meshStandardMaterial color="#444444" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 3.1, 0]}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial
          color="#ffeecc"
          emissive="#ffcc66"
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight
        ref={lightRef}
        position={[0, 3.1, 0]}
        color="#ffcc66"
        intensity={0.6}
        distance={8}
      />
    </group>
  )
}

// --- Main Scene ---
export default function ParticleFountain() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.15} color="#334466" />
      <directionalLight position={[5, 10, 5]} intensity={0.4} color="#6688bb" />
      <pointLight
        position={[0, 4, 0]}
        color="#4488cc"
        intensity={1}
        distance={15}
      />

      <Basin />
      <WaterJets />
      <SplashParticles />
      <Plaza />

      <LampPost position={[5, 0, 0]} />
      <LampPost position={[-5, 0, 0]} />
      <LampPost position={[0, 0, 5]} />
      <LampPost position={[0, 0, -5]} />
      <LampPost position={[3.5, 0, 3.5]} />
      <LampPost position={[-3.5, 0, -3.5]} />
    </>
  )
}
