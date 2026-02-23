import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#080810', 5, 20)
    scene.background = new THREE.Color('#040408')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function DamagedHull() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[12, 20]} />
        <meshStandardMaterial color="#1a1a22" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Ceiling with holes */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 3, 0]}>
        <planeGeometry args={[12, 20]} />
        <meshStandardMaterial color="#121218" side={THREE.DoubleSide} />
      </mesh>
      {/* Left wall */}
      <mesh position={[-6, 0.5, 0]}>
        <boxGeometry args={[0.2, 5, 20]} />
        <meshStandardMaterial color="#1a1a25" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Right wall */}
      <mesh position={[6, 0.5, 0]}>
        <boxGeometry args={[0.2, 5, 20]} />
        <meshStandardMaterial color="#1a1a25" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Wall structural ribs */}
      {[-8, -4, 0, 4, 8].map((z, i) => (
        <group key={i}>
          <mesh position={[-5.8, 0.5, z]}>
            <boxGeometry args={[0.15, 5, 0.3]} />
            <meshStandardMaterial
              color="#252530"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
          <mesh position={[5.8, 0.5, z]}>
            <boxGeometry args={[0.15, 5, 0.3]} />
            <meshStandardMaterial
              color="#252530"
              metalness={0.6}
              roughness={0.4}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function HullBreach({
  position,
  size,
}: {
  position: [number, number, number]
  size: number
}) {
  return (
    <group position={position}>
      {/* Torn edges (jagged ring of small boxes) */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2
        const r = size * 0.7
        const jag = (Math.random() - 0.5) * size * 0.4
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * (r + jag),
              Math.sin(angle) * (r + jag),
              0,
            ]}
            rotation={[0, 0, angle + Math.random()]}
          >
            <boxGeometry args={[size * 0.3, size * 0.1, 0.15]} />
            <meshStandardMaterial
              color="#2a2a35"
              metalness={0.7}
              roughness={0.4}
            />
          </mesh>
        )
      })}
      {/* Stars visible through breach */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={`star-${i}`}
          position={[
            (Math.random() - 0.5) * size,
            (Math.random() - 0.5) * size,
            -2 - Math.random() * 5,
          ]}
        >
          <sphereGeometry args={[0.03 + Math.random() * 0.04, 4, 4]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
    </group>
  )
}

function BrokenEquipment({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation || [0, 0, 0]}>
      {/* Toppled console */}
      <mesh position={[0, 0.3, 0]} rotation={[0.4, 0, 0.2]}>
        <boxGeometry args={[1.2, 0.6, 0.8]} />
        <meshStandardMaterial color="#1a1a28" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Cracked screen */}
      <mesh position={[0, 0.55, 0.35]} rotation={[0.4, 0, 0.2]}>
        <planeGeometry args={[0.9, 0.4]} />
        <meshStandardMaterial
          color="#001122"
          emissive="#001122"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Scattered debris */}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 1.5,
            0.05,
            (Math.random() - 0.5) * 1.5,
          ]}
          rotation={[Math.random(), Math.random(), Math.random()]}
        >
          <boxGeometry
            args={[0.1 + Math.random() * 0.15, 0.05, 0.1 + Math.random() * 0.1]}
          />
          <meshStandardMaterial
            color="#222230"
            metalness={0.4}
            roughness={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

function EmergencyLight({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.PointLight>(null!)
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const pulse = Math.sin(t * 2 + position[2]) * 0.5 + 0.5
    ref.current.intensity = pulse * 4
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = pulse * 3
  })

  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <boxGeometry args={[0.3, 0.1, 0.1]} />
        <meshStandardMaterial
          color="#ff2200"
          emissive="#ff2200"
          emissiveIntensity={2}
        />
      </mesh>
      <pointLight ref={ref} color="#ff2200" intensity={3} distance={8} />
    </group>
  )
}

const DEBRIS_COUNT = 30
const debrisDummy = new THREE.Object3D()

function FloatingDebris() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const debris = useMemo(() => {
    const arr = []
    for (let i = 0; i < DEBRIS_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 10,
        y: -1 + Math.random() * 4,
        z: (Math.random() - 0.5) * 16,
        rotSpeed: 0.3 + Math.random() * 1,
        bobSpeed: 0.2 + Math.random() * 0.4,
        bobAmp: 0.05 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.08,
        driftX: (Math.random() - 0.5) * 0.1,
        driftZ: (Math.random() - 0.5) * 0.1,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < DEBRIS_COUNT; i++) {
      const d = debris[i]
      debrisDummy.position.set(
        d.x + Math.sin(t * 0.1 + d.phase) * d.driftX * t,
        d.y + Math.sin(t * d.bobSpeed + d.phase) * d.bobAmp,
        d.z + Math.cos(t * 0.1 + d.phase) * d.driftZ * t,
      )
      debrisDummy.rotation.set(
        t * d.rotSpeed,
        t * d.rotSpeed * 0.6,
        t * d.rotSpeed * 0.3,
      )
      debrisDummy.scale.setScalar(d.scale)
      debrisDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, debrisDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, DEBRIS_COUNT]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#2a2a35" metalness={0.5} roughness={0.5} />
    </instancedMesh>
  )
}

function DamagedPipe({
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
  const quat = new THREE.Quaternion()
  quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize())

  return (
    <group>
      <mesh position={[mid.x, mid.y, mid.z]} quaternion={quat}>
        <cylinderGeometry args={[0.08, 0.08, len, 6]} />
        <meshStandardMaterial color="#333340" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Drip point / damage */}
      <mesh position={[mid.x, mid.y - 0.15, mid.z]}>
        <sphereGeometry args={[0.05, 6, 6]} />
        <meshStandardMaterial
          color="#445566"
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={0.7}
        />
      </mesh>
    </group>
  )
}

function SparkingWire({ position }: { position: [number, number, number] }) {
  const sparkRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const sparking = Math.sin(t * 15 + position[0] * 10) > 0.9
    sparkRef.current.visible = sparking
    sparkRef.current.scale.setScalar(sparking ? 0.05 + Math.random() * 0.1 : 0)
  })

  return (
    <group position={position}>
      {/* Dangling wire */}
      <mesh position={[0, -0.4, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.8, 4]} />
        <meshStandardMaterial color="#444455" />
      </mesh>
      {/* Spark */}
      <mesh ref={sparkRef} position={[0, -0.8, 0]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial
          color="#ffff44"
          emissive="#ffaa00"
          emissiveIntensity={5}
        />
      </mesh>
      <pointLight
        position={[0, -0.8, 0]}
        color="#ffaa00"
        intensity={2}
        distance={3}
      />
    </group>
  )
}

function CryogenicPod({
  position,
  broken,
}: {
  position: [number, number, number]
  broken?: boolean
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]}>
        <capsuleGeometry args={[0.4, 1.2, 8, 12]} />
        <meshStandardMaterial
          color={broken ? '#1a1a22' : '#223344'}
          metalness={0.6}
          roughness={0.4}
          transparent={!broken}
          opacity={broken ? 1 : 0.6}
        />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1, 12]} />
        <meshStandardMaterial color="#2a2a35" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.3, 0.4, 0.35]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial
          color={broken ? '#ff0000' : '#00ff44'}
          emissive={broken ? '#ff0000' : '#00ff44'}
          emissiveIntensity={broken ? 0.5 : 1.5}
        />
      </mesh>
    </group>
  )
}

function ExteriorStarfield() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const count = 150
  const dummy = useMemo(() => new THREE.Object3D(), [])

  const stars = useMemo(() => {
    const arr = []
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 40 + Math.random() * 20
      arr.push({
        x: r * Math.sin(phi) * Math.cos(theta),
        y: r * Math.sin(phi) * Math.sin(theta),
        z: r * Math.cos(phi),
        scale: 0.02 + Math.random() * 0.05,
      })
    }
    return arr
  }, [count])

  useFrame(() => {
    for (let i = 0; i < count; i++) {
      const s = stars[i]
      dummy.position.set(s.x, s.y, s.z)
      dummy.scale.setScalar(s.scale)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshBasicMaterial color="#ffffff" />
    </instancedMesh>
  )
}

export default function DerelictSpaceship() {
  return (
    <>
      <SceneSetup />

      <ambientLight intensity={0.03} />

      <ExteriorStarfield />
      <DamagedHull />

      {/* Hull breaches */}
      <HullBreach position={[6.1, 1.5, -3]} size={1.5} />
      <HullBreach position={[-6.1, 2, 4]} size={1.2} />
      <HullBreach position={[2, 3.01, -6]} size={1.8} />

      {/* Emergency lights along walls */}
      <EmergencyLight position={[-5.8, 2.5, -6]} />
      <EmergencyLight position={[-5.8, 2.5, 0]} />
      <EmergencyLight position={[-5.8, 2.5, 6]} />
      <EmergencyLight position={[5.8, 2.5, -4]} />
      <EmergencyLight position={[5.8, 2.5, 3]} />

      {/* Broken equipment */}
      <BrokenEquipment position={[-4, -2, -5]} rotation={[0, 0.3, 0]} />
      <BrokenEquipment position={[3, -2, 2]} rotation={[0, -0.5, 0]} />
      <BrokenEquipment position={[-2, -2, 6]} rotation={[0, 1.2, 0]} />

      {/* Damaged pipes */}
      <DamagedPipe start={[-5.5, 2.5, -9]} end={[-5.5, 2.5, -1]} />
      <DamagedPipe start={[5.5, 2.8, 0]} end={[5.5, 2.8, 8]} />
      <DamagedPipe start={[-5.5, 1, 3]} end={[-5.5, 1, 9]} />

      {/* Sparking wires */}
      <SparkingWire position={[-2, 3, -3]} />
      <SparkingWire position={[3, 3, 5]} />
      <SparkingWire position={[0, 3, -7]} />

      {/* Cryogenic pods */}
      <CryogenicPod position={[4, -2, -6]} broken />
      <CryogenicPod position={[4, -2, -4]} />
      <CryogenicPod position={[4, -2, -2]} broken />

      {/* Floating debris */}
      <FloatingDebris />
    </>
  )
}
