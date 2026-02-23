import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a2e14', 12, 50)
    scene.background = new THREE.Color('#2a4020')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function TrunkWall({
  angle,
  radius,
  height,
}: {
  angle: number
  radius: number
  height: number
}) {
  const x = Math.cos(angle) * radius
  const z = Math.sin(angle) * radius
  const thickness = 1.2 + Math.random() * 0.6
  const segHeight = height * (0.7 + Math.random() * 0.3)

  return (
    <mesh position={[x, segHeight / 2, z]} rotation={[0, -angle, 0]}>
      <boxGeometry args={[2.5, segHeight, thickness]} />
      <meshStandardMaterial color="#4a2a14" roughness={0.95} />
    </mesh>
  )
}

function HollowTrunk() {
  const segments = useMemo(() => {
    const arr: { angle: number; isGap: boolean }[] = []
    const count = 16
    const gapStart = 3
    const gapEnd = 5
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2
      arr.push({ angle, isGap: i >= gapStart && i <= gapEnd })
    }
    return arr
  }, [])

  return (
    <group>
      {segments
        .filter((s) => !s.isGap)
        .map((s, i) => (
          <TrunkWall key={i} angle={s.angle} radius={5} height={14} />
        ))}
      {/* Bark texture ridges on exterior */}
      {segments
        .filter((s) => !s.isGap)
        .map((s, i) => (
          <mesh
            key={`ridge-${i}`}
            position={[
              Math.cos(s.angle) * 5.7,
              4 + i * 0.5,
              Math.sin(s.angle) * 5.7,
            ]}
            rotation={[0, -s.angle, 0]}
          >
            <boxGeometry args={[2.2, 0.6, 0.2]} />
            <meshStandardMaterial color="#3a1e0c" roughness={0.98} />
          </mesh>
        ))}
    </group>
  )
}

function RootSystem() {
  const roots = useMemo(() => {
    const arr: { angle: number; length: number; thickness: number }[] = []
    for (let i = 0; i < 10; i++) {
      arr.push({
        angle: (i / 10) * Math.PI * 2 + Math.random() * 0.3,
        length: 3 + Math.random() * 4,
        thickness: 0.3 + Math.random() * 0.4,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {roots.map((r, i) => {
        const x = Math.cos(r.angle) * (5 + r.length / 2)
        const z = Math.sin(r.angle) * (5 + r.length / 2)
        return (
          <mesh
            key={i}
            position={[x, 0.15, z]}
            rotation={[0, -r.angle + Math.PI / 2, 0.1]}
          >
            <cylinderGeometry
              args={[r.thickness * 0.5, r.thickness, r.length, 6]}
            />
            <meshStandardMaterial color="#3a2010" roughness={0.95} />
          </mesh>
        )
      })}
    </group>
  )
}

function InteriorPlants() {
  const ferns = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number }[] = []
    for (let i = 0; i < 8; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * 3
      arr.push({
        pos: [Math.cos(angle) * dist, 0, Math.sin(angle) * dist],
        scale: 0.3 + Math.random() * 0.4,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {ferns.map((f, i) => (
        <group key={i} position={f.pos} scale={f.scale}>
          {/* Fern fronds */}
          {Array.from({ length: 5 }).map((_, j) => {
            const angle = (j / 5) * Math.PI * 2
            return (
              <mesh
                key={j}
                position={[Math.cos(angle) * 0.15, 0.2, Math.sin(angle) * 0.15]}
                rotation={[0.4, angle, 0]}
              >
                <boxGeometry args={[0.08, 0.4, 0.02]} />
                <meshStandardMaterial color="#2a8a2a" />
              </mesh>
            )
          })}
          {/* Center stem */}
          <mesh position={[0, 0.1, 0]}>
            <cylinderGeometry args={[0.02, 0.03, 0.2, 4]} />
            <meshStandardMaterial color="#3a6a1e" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function MossPatches() {
  const patches = useMemo(() => {
    const arr: { pos: [number, number, number]; size: number }[] = []
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 4 + Math.random() * 2
      arr.push({
        pos: [
          Math.cos(angle) * dist,
          0.3 + Math.random() * 3,
          Math.sin(angle) * dist,
        ],
        size: 0.3 + Math.random() * 0.5,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {patches.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <sphereGeometry args={[p.size, 8, 8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#2a6a1a' : '#3a7a2a'}
            roughness={0.95}
          />
        </mesh>
      ))}
    </group>
  )
}

function LightBeams() {
  const beamRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    beamRef.current.children.forEach((child, i) => {
      const mat = (child as THREE.Mesh).material as THREE.MeshStandardMaterial
      mat.opacity = 0.08 + Math.sin(t * 0.3 + i) * 0.04
    })
  })

  return (
    <group ref={beamRef}>
      {/* Light filtering through canopy */}
      {[
        { pos: [1, 7, -1] as [number, number, number], rot: 0.1 },
        { pos: [-0.5, 7, 0.5] as [number, number, number], rot: -0.05 },
        { pos: [0.5, 7, 1] as [number, number, number], rot: 0.08 },
      ].map((beam, i) => (
        <mesh key={i} position={beam.pos} rotation={[0, 0, beam.rot]}>
          <cylinderGeometry args={[0.2, 0.8, 12, 8]} />
          <meshStandardMaterial
            color="#ffffaa"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

function ForestBackground() {
  const trees = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      height: number
      radius: number
    }[] = []
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const dist = 15 + Math.random() * 10
      arr.push({
        pos: [Math.cos(angle) * dist, 0, Math.sin(angle) * dist],
        height: 8 + Math.random() * 6,
        radius: 0.3 + Math.random() * 0.3,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {trees.map((t, i) => (
        <group key={i} position={t.pos}>
          <mesh position={[0, t.height / 2, 0]}>
            <cylinderGeometry args={[t.radius * 0.7, t.radius, t.height, 8]} />
            <meshStandardMaterial color="#3a2010" />
          </mesh>
          <mesh position={[0, t.height + 1, 0]}>
            <sphereGeometry args={[1.5 + Math.random(), 8, 8]} />
            <meshStandardMaterial color="#1a4a12" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

const MOTE_COUNT = 60
const moteDummy = new THREE.Object3D()

function DustMotes() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const motes = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      speed: number
      phase: number
    }[] = []
    for (let i = 0; i < MOTE_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 8,
        y: 1 + Math.random() * 10,
        z: (Math.random() - 0.5) * 8,
        speed: 0.1 + Math.random() * 0.3,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < MOTE_COUNT; i++) {
      const m = motes[i]
      const x = m.x + Math.sin(t * m.speed + m.phase) * 0.5
      const y = m.y + Math.sin(t * 0.2 + m.phase) * 0.3
      const z = m.z + Math.cos(t * m.speed + m.phase) * 0.5
      moteDummy.position.set(x, y, z)
      moteDummy.scale.setScalar(0.015 + Math.sin(t + m.phase) * 0.005)
      moteDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, moteDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, MOTE_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#ffeeaa"
        emissive="#ffdd88"
        emissiveIntensity={1}
        transparent
        opacity={0.5}
      />
    </instancedMesh>
  )
}

export default function GiantSequoiaHollow() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 12, 3]} intensity={0.5} color="#ffe8a0" />
      <ambientLight intensity={0.12} color="#2a4a1e" />
      <pointLight
        position={[0, 8, 0]}
        color="#ffeecc"
        intensity={0.8}
        distance={15}
      />
      <hemisphereLight args={['#558844', '#221a0e', 0.3]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#2a1e10" />
      </mesh>

      <HollowTrunk />
      <RootSystem />
      <InteriorPlants />
      <MossPatches />
      <LightBeams />
      <ForestBackground />
      <DustMotes />
    </>
  )
}
