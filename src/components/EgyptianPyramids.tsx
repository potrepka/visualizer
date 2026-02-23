import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#e8c880', 30, 100)
    scene.background = new THREE.Color('#d4a050')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Pyramid({
  position,
  size,
}: {
  position: [number, number, number]
  size: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, size / 2, 0]}>
        <coneGeometry args={[size * 0.7, size, 4]} />
        <meshStandardMaterial color="#d4b070" roughness={0.85} />
      </mesh>
      {/* Subtle edge highlights */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((rot, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(rot + Math.PI / 4) * size * 0.35,
            size * 0.25,
            Math.sin(rot + Math.PI / 4) * size * 0.35,
          ]}
          rotation={[0, rot, 0]}
        >
          <boxGeometry args={[size * 0.02, size * 0.5, size * 0.02]} />
          <meshStandardMaterial color="#c8a060" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function Sphinx({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[1.5, 1, 3.5]} />
        <meshStandardMaterial color="#c8a868" roughness={0.85} />
      </mesh>
      {/* Front paws */}
      <mesh position={[-0.5, 0.2, 1.8]}>
        <boxGeometry args={[0.4, 0.4, 1]} />
        <meshStandardMaterial color="#c8a868" roughness={0.85} />
      </mesh>
      <mesh position={[0.5, 0.2, 1.8]}>
        <boxGeometry args={[0.4, 0.4, 1]} />
        <meshStandardMaterial color="#c8a868" roughness={0.85} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.3, 1.2]}>
        <boxGeometry args={[0.9, 0.9, 0.9]} />
        <meshStandardMaterial color="#c8a868" roughness={0.85} />
      </mesh>
      {/* Headdress */}
      <mesh position={[0, 1.85, 1.2]}>
        <boxGeometry args={[1.1, 0.3, 1.0]} />
        <meshStandardMaterial color="#b89858" roughness={0.8} />
      </mesh>
      {/* Headdress sides */}
      <mesh position={[-0.55, 1.1, 1.2]}>
        <boxGeometry args={[0.15, 0.8, 0.6]} />
        <meshStandardMaterial color="#b89858" roughness={0.8} />
      </mesh>
      <mesh position={[0.55, 1.1, 1.2]}>
        <boxGeometry args={[0.15, 0.8, 0.6]} />
        <meshStandardMaterial color="#b89858" roughness={0.8} />
      </mesh>
    </group>
  )
}

function Obelisk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.8, 0.3, 0.8]} />
        <meshStandardMaterial color="#c0a060" roughness={0.8} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[0.4, 4, 0.4]} />
        <meshStandardMaterial color="#c8a868" roughness={0.75} />
      </mesh>
      {/* Pyramidion (cap) */}
      <mesh position={[0, 4.55, 0]}>
        <coneGeometry args={[0.28, 0.5, 4]} />
        <meshStandardMaterial color="#daa520" metalness={0.5} roughness={0.3} />
      </mesh>
    </group>
  )
}

function SandDunes() {
  const dunes = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      scaleX: number
      scaleZ: number
      height: number
    }[] = []
    for (let i = 0; i < 15; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 50, 0, (Math.random() - 0.5) * 50],
        scaleX: 3 + Math.random() * 6,
        scaleZ: 3 + Math.random() * 6,
        height: 0.3 + Math.random() * 1.0,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {dunes.map((d, i) => (
        <mesh key={i} position={d.pos} scale={[d.scaleX, d.height, d.scaleZ]}>
          <sphereGeometry args={[1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#d8b470' : '#cca860'}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

function TemplePillars({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Platform */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[4, 0.2, 2.5]} />
        <meshStandardMaterial color="#c8a868" roughness={0.85} />
      </mesh>
      {/* Pillars */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 1.2, 0]}>
          <cylinderGeometry args={[0.12, 0.14, 2, 8]} />
          <meshStandardMaterial color="#c0a060" roughness={0.8} />
        </mesh>
      ))}
      {/* Lintel */}
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[4, 0.2, 0.5]} />
        <meshStandardMaterial color="#c8a868" roughness={0.85} />
      </mesh>
    </group>
  )
}

const SAND_PARTICLE_COUNT = 100
const sandDummy = new THREE.Object3D()

function SandParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      speed: number
      phase: number
    }[] = []
    for (let i = 0; i < SAND_PARTICLE_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 40,
        y: 0.1 + Math.random() * 2,
        z: (Math.random() - 0.5) * 40,
        speed: 1 + Math.random() * 2,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < SAND_PARTICLE_COUNT; i++) {
      const p = particles[i]
      const x = p.x + t * p.speed * 0.5
      const wrapped = ((x + 20) % 40) - 20
      const y = p.y + Math.sin(t * 2 + p.phase) * 0.3
      const z = p.z + Math.sin(t + p.phase) * 0.5
      sandDummy.position.set(wrapped, y, z)
      sandDummy.scale.setScalar(0.02 + Math.random() * 0.01)
      sandDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, sandDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, SAND_PARTICLE_COUNT]}
    >
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial color="#d8c080" transparent opacity={0.4} />
    </instancedMesh>
  )
}

function SunDisc() {
  return (
    <mesh position={[20, 18, -30]}>
      <sphereGeometry args={[3, 16, 16]} />
      <meshStandardMaterial
        color="#ffe080"
        emissive="#ffcc44"
        emissiveIntensity={2}
      />
    </mesh>
  )
}

export default function EgyptianPyramids() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[8, 12, 5]} intensity={1.3} color="#ffe0a0" />
      <ambientLight intensity={0.25} color="#d4a050" />
      <hemisphereLight args={['#ffe8c0', '#c8a060', 0.3]} />

      {/* Desert ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#d4aa60" />
      </mesh>

      <SandDunes />
      <SunDisc />

      {/* Main pyramid */}
      <Pyramid position={[0, 0, -8]} size={10} />
      {/* Smaller pyramids */}
      <Pyramid position={[-8, 0, 0]} size={6} />
      <Pyramid position={[8, 0, 2]} size={5} />
      <Pyramid position={[-4, 0, 5]} size={3} />

      {/* Sphinx */}
      <Sphinx position={[4, 0, 5]} />

      {/* Obelisks */}
      <Obelisk position={[-2, 0, 8]} />
      <Obelisk position={[2, 0, 8]} />

      {/* Temple ruins */}
      <TemplePillars position={[0, 0, 12]} />

      <SandParticles />
    </>
  )
}
