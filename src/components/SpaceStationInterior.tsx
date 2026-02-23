import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#0a0a1a', 5, 30)
    scene.background = new THREE.Color('#0a0a1a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function CorridorSection({ zPos }: { zPos: number }) {
  const radius = 3
  const length = 4
  return (
    <group position={[0, 0, zPos]}>
      {/* Outer hull cylinder */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[radius, radius, length, 24, 1, true]} />
        <meshStandardMaterial
          color="#2a2a3a"
          side={THREE.BackSide}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>
      {/* Inner ring ribs */}
      {[-1.5, 0, 1.5].map((z, i) => (
        <mesh key={i} position={[0, 0, z]} rotation={[0, 0, 0]}>
          <torusGeometry args={[radius - 0.05, 0.08, 8, 32]} />
          <meshStandardMaterial
            color="#3a3a50"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* Floor grating */}
      <mesh position={[0, -2.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, length]} />
        <meshStandardMaterial color="#1a1a2a" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Floor strip lights */}
      {[-1, 1].map((x, i) => (
        <mesh key={i} position={[x, -2.18, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.1, length]} />
          <meshStandardMaterial
            color="#00aaff"
            emissive="#00aaff"
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

function ControlPanel({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {/* Console body */}
      <mesh>
        <boxGeometry args={[1.2, 0.8, 0.15]} />
        <meshStandardMaterial color="#1a1a2a" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Main screen */}
      <mesh position={[0, 0.05, 0.08]}>
        <planeGeometry args={[1.0, 0.5]} />
        <meshStandardMaterial
          color="#003366"
          emissive="#0066cc"
          emissiveIntensity={1.2}
        />
      </mesh>
      {/* Status indicators */}
      {[-0.35, -0.15, 0.05, 0.25].map((x, i) => (
        <mesh key={i} position={[x, -0.28, 0.08]}>
          <sphereGeometry args={[0.025, 8, 8]} />
          <meshStandardMaterial
            color={i === 2 ? '#ff3333' : '#00ff66'}
            emissive={i === 2 ? '#ff3333' : '#00ff66'}
            emissiveIntensity={1.5}
          />
        </mesh>
      ))}
      {/* Button row */}
      {[-0.3, -0.1, 0.1, 0.3].map((x, i) => (
        <mesh key={`btn-${i}`} position={[x, -0.15, 0.08]}>
          <boxGeometry args={[0.08, 0.04, 0.02]} />
          <meshStandardMaterial
            color="#334455"
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

function Pipe({
  start,
  end,
  radius = 0.06,
}: {
  start: [number, number, number]
  end: [number, number, number]
  radius?: number
}) {
  const s = new THREE.Vector3(...start)
  const e = new THREE.Vector3(...end)
  const mid = s.clone().add(e).multiplyScalar(0.5)
  const dir = e.clone().sub(s)
  const len = dir.length()
  const quat = new THREE.Quaternion()
  quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())

  return (
    <mesh position={[mid.x, mid.y, mid.z]} quaternion={quat}>
      <cylinderGeometry args={[radius, radius, len, 8]} />
      <meshStandardMaterial color="#556677" metalness={0.7} roughness={0.3} />
    </mesh>
  )
}

function AirlockDoor({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  const leftRef = useRef<THREE.Mesh>(null!)
  const rightRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const cycle = Math.sin(t * 0.3) * 0.5 + 0.5
    const offset = cycle * 0.5
    leftRef.current.position.x = -0.55 - offset
    rightRef.current.position.x = 0.55 + offset
  })

  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {/* Door frame */}
      <mesh>
        <boxGeometry args={[2.4, 2.6, 0.1]} />
        <meshStandardMaterial color="#2a2a3a" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Left door panel */}
      <mesh ref={leftRef} position={[-0.55, 0, 0.06]}>
        <boxGeometry args={[1.0, 2.3, 0.05]} />
        <meshStandardMaterial color="#3a3a4a" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Right door panel */}
      <mesh ref={rightRef} position={[0.55, 0, 0.06]}>
        <boxGeometry args={[1.0, 2.3, 0.05]} />
        <meshStandardMaterial color="#3a3a4a" metalness={0.5} roughness={0.4} />
      </mesh>
      {/* Warning stripe */}
      <mesh position={[0, 1.35, 0.06]}>
        <boxGeometry args={[2.2, 0.08, 0.01]} />
        <meshStandardMaterial
          color="#ffaa00"
          emissive="#ffaa00"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  )
}

const FLOAT_COUNT = 20
const floatDummy = new THREE.Object3D()

function FloatingObjects() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const objects = useMemo(() => {
    const arr = []
    for (let i = 0; i < FLOAT_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 4,
        y: (Math.random() - 0.5) * 3,
        z: (Math.random() - 0.5) * 16,
        rotSpeed: 0.5 + Math.random() * 2,
        bobSpeed: 0.3 + Math.random() * 0.5,
        bobAmp: 0.1 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
        scale: 0.03 + Math.random() * 0.06,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < FLOAT_COUNT; i++) {
      const o = objects[i]
      floatDummy.position.set(
        o.x + Math.sin(t * 0.2 + o.phase) * 0.1,
        o.y + Math.sin(t * o.bobSpeed + o.phase) * o.bobAmp,
        o.z + Math.cos(t * 0.15 + o.phase) * 0.1,
      )
      floatDummy.rotation.set(
        t * o.rotSpeed,
        t * o.rotSpeed * 0.7,
        t * o.rotSpeed * 0.3,
      )
      floatDummy.scale.setScalar(o.scale)
      floatDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, floatDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, FLOAT_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#667788" metalness={0.4} roughness={0.5} />
    </instancedMesh>
  )
}

function CeilingLightStrip({
  position,
}: {
  position: [number, number, number]
}) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.2, 0.05, 3]} />
        <meshStandardMaterial
          color="#aaddff"
          emissive="#6699cc"
          emissiveIntensity={1.5}
        />
      </mesh>
      <pointLight
        position={[0, -0.2, 0]}
        color="#6699cc"
        intensity={2}
        distance={6}
      />
    </group>
  )
}

export default function SpaceStationInterior() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.08} />

      {/* Corridor sections */}
      {[-8, -4, 0, 4, 8].map((z, i) => (
        <CorridorSection key={i} zPos={z} />
      ))}

      {/* Ceiling light strips */}
      <CeilingLightStrip position={[-0.8, 2.2, 0]} />
      <CeilingLightStrip position={[0.8, 2.2, 0]} />
      <CeilingLightStrip position={[-0.8, 2.2, -6]} />
      <CeilingLightStrip position={[0.8, 2.2, -6]} />

      {/* Control panels along walls */}
      <ControlPanel
        position={[-2.5, -0.5, -2]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <ControlPanel position={[2.5, -0.5, 1]} rotation={[0, -Math.PI / 2, 0]} />
      <ControlPanel position={[-2.5, -0.5, 5]} rotation={[0, Math.PI / 2, 0]} />
      <ControlPanel
        position={[2.5, -0.5, -6]}
        rotation={[0, -Math.PI / 2, 0]}
      />

      {/* Pipes and conduits */}
      <Pipe start={[-2.5, 1.5, -10]} end={[-2.5, 1.5, 10]} radius={0.08} />
      <Pipe start={[2.5, 1.8, -10]} end={[2.5, 1.8, 10]} radius={0.06} />
      <Pipe start={[-2.3, 2.0, -10]} end={[-2.3, 2.0, 10]} radius={0.04} />
      <Pipe start={[2.3, 1.2, -8]} end={[2.3, 1.2, 8]} radius={0.05} />

      {/* Airlock doors */}
      <AirlockDoor position={[0, -1, -5]} />
      <AirlockDoor position={[0, -1, 7]} />

      {/* Floating zero-gravity objects */}
      <FloatingObjects />
    </>
  )
}
