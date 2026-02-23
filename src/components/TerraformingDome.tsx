import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#cc8855', 30, 80)
    scene.background = new THREE.Color('#cc8855')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function BarrenGround() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#8a6644" roughness={0.95} />
      </mesh>
      {/* Scattered rocks on barren surface */}
      {Array.from({ length: 30 }).map((_, i) => {
        const dist = 12 + Math.random() * 30
        const angle = Math.random() * Math.PI * 2
        const x = Math.cos(angle) * dist
        const z = Math.sin(angle) * dist
        const s = 0.2 + Math.random() * 0.8
        return (
          <mesh key={i} position={[x, s * 0.3, z]}>
            <dodecahedronGeometry args={[s, 0]} />
            <meshStandardMaterial color="#7a5533" roughness={0.9} />
          </mesh>
        )
      })}
    </group>
  )
}

function DomeFrame() {
  const domeRadius = 10
  const ribs = useMemo(() => {
    const arr = []
    const ribCount = 12
    for (let i = 0; i < ribCount; i++) {
      arr.push((i / ribCount) * Math.PI * 2)
    }
    return arr
  }, [])

  return (
    <group>
      {/* Transparent dome shell */}
      <mesh>
        <sphereGeometry
          args={[domeRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          color="#aaddff"
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          metalness={0.3}
          roughness={0.1}
        />
      </mesh>
      {/* Structural ribs (meridian arcs approximated with thin cylinders) */}
      {ribs.map((angle, i) => (
        <group key={i} rotation={[0, angle, 0]}>
          {Array.from({ length: 8 }).map((_, j) => {
            const a1 = (j / 8) * (Math.PI / 2)
            const a2 = ((j + 1) / 8) * (Math.PI / 2)
            const x1 = Math.sin(a1) * domeRadius
            const y1 = Math.cos(a1) * domeRadius
            const x2 = Math.sin(a2) * domeRadius
            const y2 = Math.cos(a2) * domeRadius
            const mx = (x1 + x2) / 2
            const my = (y1 + y2) / 2
            const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
            const rot = Math.atan2(x2 - x1, y2 - y1)
            return (
              <mesh key={j} position={[mx, my, 0]} rotation={[0, 0, -rot]}>
                <cylinderGeometry args={[0.06, 0.06, len, 6]} />
                <meshStandardMaterial
                  color="#667788"
                  metalness={0.7}
                  roughness={0.3}
                />
              </mesh>
            )
          })}
        </group>
      ))}
      {/* Horizontal ring bands */}
      {[0.25, 0.5, 0.75].map((frac, i) => {
        const a = frac * (Math.PI / 2)
        const r = Math.sin(a) * domeRadius
        const y = Math.cos(a) * domeRadius
        return (
          <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[r, 0.04, 6, 32]} />
            <meshStandardMaterial
              color="#667788"
              metalness={0.7}
              roughness={0.3}
            />
          </mesh>
        )
      })}
      {/* Base ring */}
      <mesh position={[0, 0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[domeRadius, 0.15, 8, 48]} />
        <meshStandardMaterial color="#556677" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}

function InteriorVegetation() {
  const trees = useMemo(() => {
    const arr = []
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * 7
      arr.push({
        x: Math.cos(angle) * dist,
        z: Math.sin(angle) * dist,
        height: 1 + Math.random() * 2.5,
        canopySize: 0.8 + Math.random() * 1.2,
        hue: 100 + Math.random() * 40,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {/* Green ground inside dome */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <circleGeometry args={[9.5, 32]} />
        <meshStandardMaterial color="#3a7a2a" roughness={0.8} />
      </mesh>
      {/* Trees */}
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]}>
          {/* Trunk */}
          <mesh position={[0, t.height / 2, 0]}>
            <cylinderGeometry args={[0.06, 0.1, t.height, 6]} />
            <meshStandardMaterial color="#5a3a1a" />
          </mesh>
          {/* Canopy */}
          <mesh position={[0, t.height, 0]}>
            <sphereGeometry args={[t.canopySize, 10, 10]} />
            <meshStandardMaterial color={`hsl(${t.hue}, 60%, 35%)`} />
          </mesh>
        </group>
      ))}
      {/* Small plants / bushes */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2
        const dist = Math.random() * 8
        return (
          <mesh
            key={`bush-${i}`}
            position={[Math.cos(angle) * dist, 0.15, Math.sin(angle) * dist]}
          >
            <sphereGeometry args={[0.2 + Math.random() * 0.3, 8, 8]} />
            <meshStandardMaterial
              color={`hsl(${110 + Math.random() * 30}, 55%, 30%)`}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function Airlock({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Airlock structure */}
      <mesh>
        <boxGeometry args={[2.5, 3, 4]} />
        <meshStandardMaterial color="#556677" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0, 2.01]}>
        <boxGeometry args={[1.5, 2.5, 0.1]} />
        <meshStandardMaterial color="#445566" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Status light */}
      <mesh position={[0, 1.8, 2.05]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial
          color="#00ff44"
          emissive="#00ff44"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  )
}

function AtmosphericProcessor({
  position,
}: {
  position: [number, number, number]
}) {
  const fanRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    fanRef.current.rotation.z = clock.getElapsedTime() * 3
  })

  return (
    <group position={position}>
      {/* Main unit */}
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[1, 1.2, 4, 12]} />
        <meshStandardMaterial color="#667788" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Top exhaust */}
      <mesh position={[0, 4.3, 0]}>
        <cylinderGeometry args={[0.8, 0.6, 0.6, 12]} />
        <meshStandardMaterial color="#778899" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Fan blades (simplified as box) */}
      <mesh ref={fanRef} position={[0, 4.7, 0]}>
        <boxGeometry args={[1.4, 0.05, 0.2]} />
        <meshStandardMaterial color="#556677" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Pipes */}
      <mesh position={[1.3, 1.5, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.12, 0.12, 3, 8]} />
        <meshStandardMaterial color="#778899" metalness={0.6} roughness={0.3} />
      </mesh>
      {/* Status indicators */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0.8, 1 + i * 0.5, 1.05]}>
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshStandardMaterial
            color="#44ff88"
            emissive="#22cc66"
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}
    </group>
  )
}

function DustParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const count = 60
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const particles = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 40,
        y: 0.5 + Math.random() * 4,
        z: (Math.random() - 0.5) * 40,
        speed: 0.3 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const p = particles[i]
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 2,
        p.y + Math.sin(t * 0.3 + p.phase) * 0.5,
        p.z + Math.cos(t * p.speed + p.phase) * 2,
      )
      dummy.scale.setScalar(0.03)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ccaa88" transparent opacity={0.4} />
    </instancedMesh>
  )
}

export default function TerraformingDome() {
  return (
    <>
      <SceneSetup />

      <directionalLight
        position={[10, 15, 5]}
        color="#ffddaa"
        intensity={1.2}
      />
      <ambientLight intensity={0.2} color="#aa8866" />
      {/* Interior grow lights */}
      <pointLight
        position={[0, 8, 0]}
        color="#ffffff"
        intensity={5}
        distance={15}
      />

      <BarrenGround />
      <DomeFrame />
      <InteriorVegetation />

      {/* Airlocks */}
      <Airlock position={[10, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <Airlock position={[-10, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} />

      {/* Atmospheric processors */}
      <AtmosphericProcessor position={[7, 0, 7]} />
      <AtmosphericProcessor position={[-7, 0, -7]} />

      {/* Dust particles on exterior */}
      <DustParticles />
    </>
  )
}
