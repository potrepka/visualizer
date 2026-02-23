import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.background = new THREE.Color('#020208')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function AsteroidSurface() {
  const boulders = useMemo(() => {
    const arr = []
    for (let i = 0; i < 40; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 40,
        z: (Math.random() - 0.5) * 40,
        scale: 0.3 + Math.random() * 1.5,
        ry: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {/* Main surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#2a2520" roughness={0.95} />
      </mesh>
      {/* Boulders */}
      {boulders.map((b, i) => (
        <mesh
          key={i}
          position={[b.x, b.scale * 0.3, b.z]}
          rotation={[0, b.ry, 0]}
        >
          <dodecahedronGeometry args={[b.scale, 0]} />
          <meshStandardMaterial color="#3a3530" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function DrillingRig({ position }: { position: [number, number, number] }) {
  const drillRef = useRef<THREE.Mesh>(null!)
  const armRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    drillRef.current.rotation.y = t * 5
    armRef.current.rotation.z = Math.sin(t * 0.5) * 0.1 - 0.2
  })

  return (
    <group position={position}>
      {/* Base platform */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[3, 0.3, 3]} />
        <meshStandardMaterial color="#555544" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Support tower */}
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[0.6, 4.5, 0.6]} />
        <meshStandardMaterial color="#666655" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Cross braces */}
      {[1, 2, 3.5].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[1.5, 0.1, 0.1]} />
          <meshStandardMaterial
            color="#777766"
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
      ))}
      {/* Drill arm */}
      <group ref={armRef} position={[0, 4.5, 0]}>
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.15, 0.15, 3, 8]} />
          <meshStandardMaterial
            color="#888877"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
        {/* Drill bit */}
        <mesh
          ref={drillRef}
          position={[3, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <coneGeometry args={[0.3, 1.2, 8]} />
          <meshStandardMaterial
            color="#aaaa88"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>
      {/* Warning light */}
      <mesh position={[0, 5, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          color="#ff6600"
          emissive="#ff6600"
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight
        position={[0, 5, 0]}
        color="#ff6600"
        intensity={3}
        distance={8}
      />
    </group>
  )
}

function ConveyorBelt({
  start,
  end,
}: {
  start: [number, number, number]
  end: [number, number, number]
}) {
  const s = new THREE.Vector3(...start)
  const e = new THREE.Vector3(...end)
  const mid = s.clone().add(e).multiplyScalar(0.5)
  const dir = e.clone().sub(s)
  const len = dir.length()
  const angle = Math.atan2(dir.x, dir.z)

  return (
    <group position={[mid.x, mid.y, mid.z]} rotation={[0, angle, 0]}>
      {/* Belt surface */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[0.8, 0.05, len]} />
        <meshStandardMaterial color="#444433" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Side rails */}
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={i} position={[x, 0.35, 0]}>
          <boxGeometry args={[0.05, 0.15, len]} />
          <meshStandardMaterial
            color="#666655"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* Support legs */}
      {Array.from({ length: Math.floor(len / 2) + 1 }).map((_, i) => (
        <mesh key={`leg-${i}`} position={[0, 0.17, -len / 2 + i * 2]}>
          <boxGeometry args={[0.6, 0.35, 0.1]} />
          <meshStandardMaterial
            color="#555544"
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

const ORE_COUNT = 50
const oreDummy = new THREE.Object3D()

function ScatteredOre() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const ores = useMemo(() => {
    const arr = []
    for (let i = 0; i < ORE_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 20,
        z: (Math.random() - 0.5) * 20,
        scale: 0.1 + Math.random() * 0.25,
        ry: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useEffect(() => {
    ores.forEach((o) => {
      oreDummy.position.set(o.x, o.scale * 0.3, o.z)
      oreDummy.rotation.set(0, o.ry, 0)
      oreDummy.scale.setScalar(o.scale)
      oreDummy.updateMatrix()
    })
  }, [ores])

  useFrame(() => {
    for (let i = 0; i < ORE_COUNT; i++) {
      const o = ores[i]
      oreDummy.position.set(o.x, o.scale * 0.3, o.z)
      oreDummy.rotation.set(0, o.ry, 0)
      oreDummy.scale.setScalar(o.scale)
      oreDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, oreDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, ORE_COUNT]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color="#cc8844"
        metalness={0.6}
        roughness={0.4}
        emissive="#663311"
        emissiveIntensity={0.3}
      />
    </instancedMesh>
  )
}

function ProcessingStation({
  position,
}: {
  position: [number, number, number]
}) {
  return (
    <group position={position}>
      {/* Main building */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[4, 3, 3]} />
        <meshStandardMaterial color="#555548" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Chimney / exhaust */}
      <mesh position={[1.2, 3.5, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 2, 8]} />
        <meshStandardMaterial color="#666655" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Storage tanks */}
      {[-1.2, 0].map((x, i) => (
        <mesh key={i} position={[x, 1.5, 2]}>
          <cylinderGeometry args={[0.6, 0.6, 2.5, 12]} />
          <meshStandardMaterial
            color="#777766"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* Work lights */}
      <pointLight
        position={[0, 3.5, 2]}
        color="#ffdd88"
        intensity={5}
        distance={10}
      />
    </group>
  )
}

const STAR_COUNT = 300
const starDummy = new THREE.Object3D()

function Stars() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  useEffect(() => {
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 80 + Math.random() * 20
      starDummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      )
      starDummy.scale.setScalar(0.05 + Math.random() * 0.1)
      starDummy.updateMatrix()
    }
  }, [])

  useFrame(() => {
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = i * 2.39996 + i * 0.001
      const phi = Math.acos(2 * (i / STAR_COUNT) - 1)
      const r = 80 + (i % 20)
      starDummy.position.set(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      )
      starDummy.scale.setScalar(0.05 + (i % 10) * 0.01)
      starDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, starDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, STAR_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  )
}

export default function AsteroidMiningRig() {
  return (
    <>
      <SceneSetup />

      {/* Industrial lighting */}
      <directionalLight
        position={[10, 15, 5]}
        color="#ffeedd"
        intensity={1.0}
      />
      <ambientLight intensity={0.08} />

      <Stars />
      <AsteroidSurface />

      {/* Drilling rigs */}
      <DrillingRig position={[-5, 0, -3]} />
      <DrillingRig position={[6, 0, 2]} />

      {/* Conveyor systems */}
      <ConveyorBelt start={[-3, 0, -3]} end={[3, 0, 4]} />
      <ConveyorBelt start={[4, 0, 2]} end={[8, 0, 8]} />

      {/* Processing station */}
      <ProcessingStation position={[8, 0, 10]} />

      {/* Scattered ore */}
      <ScatteredOre />
    </>
  )
}
