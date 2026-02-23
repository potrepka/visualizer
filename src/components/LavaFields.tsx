import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a0800', 10, 50)
    scene.background = new THREE.Color('#0d0504')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function CrackedGround() {
  const plates = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      size: [number, number, number]
      rot: number
    }[] = []
    for (let i = 0; i < 40; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 30,
          -0.05 + Math.random() * 0.1,
          (Math.random() - 0.5) * 30,
        ],
        size: [
          1 + Math.random() * 2,
          0.15 + Math.random() * 0.1,
          1 + Math.random() * 2,
        ],
        rot: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {plates.map((p, i) => (
        <mesh key={i} position={p.pos} rotation={[0, p.rot, 0]}>
          <boxGeometry args={p.size} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#1a1a18' : '#2a2622'}
            roughness={0.95}
          />
        </mesh>
      ))}
    </group>
  )
}

function LavaRiver({ points }: { points: [number, number, number][] }) {
  const meshRefs = useRef<THREE.Mesh[]>([])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      const mat = mesh.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 1.5 + Math.sin(t * 2 + i * 0.5) * 0.5
    })
  })

  return (
    <group>
      {points.map((pos, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el
          }}
          position={pos}
          rotation={[-Math.PI / 2, 0, Math.random() * 0.3]}
        >
          <planeGeometry args={[1.2, 2.5]} />
          <meshStandardMaterial
            color="#ff4400"
            emissive="#ff6600"
            emissiveIntensity={1.5}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

function VolcanicVent({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Vent cone */}
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.6, 0.8, 8]} />
        <meshStandardMaterial color="#2a2220" roughness={0.95} />
      </mesh>
      {/* Glow at top */}
      <mesh position={[0, 0.85, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial
          color="#ff4400"
          emissive="#ff6600"
          emissiveIntensity={2.0}
        />
      </mesh>
      {/* Inner glow light */}
      <pointLight
        position={[0, 1, 0]}
        color="#ff4400"
        intensity={3}
        distance={8}
      />
    </group>
  )
}

const SMOKE_COUNT = 80
const smokeDummy = new THREE.Object3D()

function SmokeParticles({ origin }: { origin: [number, number, number] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(() => {
    const arr: {
      offsetX: number
      offsetZ: number
      speed: number
      phase: number
      size: number
    }[] = []
    for (let i = 0; i < SMOKE_COUNT; i++) {
      arr.push({
        offsetX: (Math.random() - 0.5) * 1.5,
        offsetZ: (Math.random() - 0.5) * 1.5,
        speed: 0.5 + Math.random() * 1.0,
        phase: Math.random() * Math.PI * 2,
        size: 0.08 + Math.random() * 0.12,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < SMOKE_COUNT; i++) {
      const p = particles[i]
      const lifeT = ((t * p.speed + p.phase) % 4) / 4
      const y = origin[1] + 1 + lifeT * 6
      const spread = lifeT * 2
      const x = origin[0] + p.offsetX * spread + Math.sin(t + p.phase) * 0.3
      const z = origin[2] + p.offsetZ * spread + Math.cos(t + p.phase) * 0.3
      smokeDummy.position.set(x, y, z)
      smokeDummy.scale.setScalar(p.size * (1 + lifeT * 2))
      smokeDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, smokeDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SMOKE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#3a3430" transparent opacity={0.3} />
    </instancedMesh>
  )
}

function VolcanicRock({
  position,
  scale = 1,
}: {
  position: [number, number, number]
  scale?: number
}) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#1e1c1a" roughness={0.95} />
      </mesh>
      <mesh position={[0.2, 0.5, 0.1]} rotation={[0.3, 0.5, 0.2]}>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial color="#252220" roughness={0.95} />
      </mesh>
    </group>
  )
}

function LavaPool({
  position,
  radius,
}: {
  position: [number, number, number]
  radius: number
}) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 1.2 + Math.sin(t * 3) * 0.4
  })

  return (
    <group>
      <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[radius, 24]} />
        <meshStandardMaterial
          color="#ff3300"
          emissive="#ff5500"
          emissiveIntensity={1.2}
          roughness={0.5}
        />
      </mesh>
      <pointLight
        position={[position[0], position[1] + 0.5, position[2]]}
        color="#ff4400"
        intensity={2}
        distance={6}
      />
    </group>
  )
}

function DistantVolcano({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 4, 0]}>
        <coneGeometry args={[6, 8, 8]} />
        <meshStandardMaterial color="#1a1412" />
      </mesh>
      {/* Crater glow */}
      <mesh position={[0, 8.2, 0]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshStandardMaterial
          color="#ff2200"
          emissive="#ff4400"
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight
        position={[0, 9, 0]}
        color="#ff3300"
        intensity={5}
        distance={30}
      />
    </group>
  )
}

export default function LavaFields() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[3, 5, 2]} intensity={0.3} color="#ff8866" />
      <ambientLight intensity={0.08} color="#441100" />

      {/* Base ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0a0806" />
      </mesh>

      <CrackedGround />

      {/* Lava rivers */}
      <LavaRiver
        points={[
          [-2, 0.01, -5],
          [-1.5, 0.01, -2],
          [-1, 0.01, 1],
          [-0.5, 0.01, 4],
          [0, 0.01, 7],
        ]}
      />
      <LavaRiver
        points={[
          [4, 0.01, -4],
          [3.5, 0.01, -1],
          [3, 0.01, 2],
          [2.5, 0.01, 5],
        ]}
      />

      {/* Lava pools */}
      <LavaPool position={[-4, 0.02, 2]} radius={1.2} />
      <LavaPool position={[5, 0.02, -2]} radius={0.8} />

      {/* Volcanic vents */}
      <VolcanicVent position={[-3, 0, -3]} />
      <VolcanicVent position={[6, 0, 3]} />
      <VolcanicVent position={[0, 0, -6]} />

      {/* Smoke from vents */}
      <SmokeParticles origin={[-3, 0.8, -3]} />
      <SmokeParticles origin={[6, 0.8, 3]} />
      <SmokeParticles origin={[0, 0.8, -6]} />

      {/* Volcanic rocks */}
      <VolcanicRock position={[-6, 0, 0]} scale={1.5} />
      <VolcanicRock position={[2, 0, -4]} scale={1.2} />
      <VolcanicRock position={[-1, 0, 5]} scale={1.0} />
      <VolcanicRock position={[7, 0, -1]} scale={0.8} />

      {/* Distant volcano */}
      <DistantVolcano position={[0, 0, -25]} />
    </>
  )
}
