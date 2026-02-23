import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#0a1520', 15, 55)
    scene.background = new THREE.Color('#0a1520')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function TrunkSection({
  position,
  radius,
  height,
  taper = 0.8,
}: {
  position: [number, number, number]
  radius: number
  height: number
  taper?: number
}) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[radius * taper, radius, height, 8]} />
      <meshStandardMaterial color="#3a2818" roughness={0.95} />
    </mesh>
  )
}

function Branch({
  position,
  rotation,
  length,
  radius,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  length: number
  radius: number
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[radius * 0.6, radius, length, 6]} />
        <meshStandardMaterial color="#4a3420" roughness={0.9} />
      </mesh>
    </group>
  )
}

function Root({
  angle,
  length,
  curve,
}: {
  angle: number
  length: number
  curve: number
}) {
  const segments = 5
  return (
    <group rotation={[0, angle, 0]}>
      {Array.from({ length: segments }).map((_, i) => {
        const t = i / segments
        const x = t * length
        const y = -t * curve * 0.8
        const nextT = (i + 1) / segments
        const nextX = nextT * length
        const nextY = -nextT * curve * 0.8
        const midX = (x + nextX) / 2
        const midY = (y + nextY) / 2
        const segAngle = Math.atan2(nextY - y, nextX - x)
        const segLength = Math.sqrt((nextX - x) ** 2 + (nextY - y) ** 2)
        const rootRadius = 0.3 * (1 - t * 0.7)
        return (
          <mesh key={i} position={[midX, midY, 0]} rotation={[0, 0, segAngle]}>
            <cylinderGeometry
              args={[rootRadius * 0.8, rootRadius, segLength, 5]}
            />
            <meshStandardMaterial color="#3a2818" roughness={0.95} />
          </mesh>
        )
      })}
    </group>
  )
}

function EnergyFlow() {
  const count = 60
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(() => {
    const arr: {
      angle: number
      speed: number
      radius: number
      phase: number
    }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        angle: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5,
        radius: 0.5 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const p = particles[i]
      const y = (t * p.speed + p.phase) % 12
      const r = p.radius * (1 - y / 20)
      dummy.position.set(
        Math.cos(p.angle + t * 0.3) * r,
        y,
        Math.sin(p.angle + t * 0.3) * r,
      )
      dummy.scale.setScalar(0.04 + Math.sin(t * 2 + p.phase) * 0.02)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#44ddff"
        emissive="#22bbdd"
        emissiveIntensity={3}
        transparent
        opacity={0.7}
      />
    </instancedMesh>
  )
}

function GlowingLeaves() {
  const count = 200
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const leaves = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      s: number
      phase: number
      color: number
    }[] = []
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = 1 + Math.random() * 7
      const y = 6 + Math.random() * 8
      const heightFactor = 1 - Math.abs(y - 10) / 6
      const maxR = r * Math.max(0.3, heightFactor)
      arr.push({
        x: Math.cos(angle) * maxR,
        y,
        z: Math.sin(angle) * maxR,
        s: 0.06 + Math.random() * 0.1,
        phase: Math.random() * Math.PI * 2,
        color: Math.random(),
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const l = leaves[i]
      dummy.position.set(
        l.x + Math.sin(t * 0.5 + l.phase) * 0.15,
        l.y + Math.sin(t * 0.7 + l.phase) * 0.1,
        l.z + Math.cos(t * 0.4 + l.phase) * 0.15,
      )
      const pulse = l.s * (0.8 + Math.sin(t * 1.5 + l.phase) * 0.2)
      dummy.scale.setScalar(pulse)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 5, 5]} />
      <meshStandardMaterial
        color="#44ff88"
        emissive="#22dd66"
        emissiveIntensity={2}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  )
}

function Creature({
  position,
  bodyColor,
}: {
  position: [number, number, number]
  bodyColor: string
}) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.position.y =
      position[1] + Math.sin(t * 2 + position[0]) * 0.05
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Body */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.2, 8, 8]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} />
      </mesh>
      {/* Head */}
      <mesh position={[0.15, 0.35, 0]}>
        <sphereGeometry args={[0.1, 6, 6]} />
        <meshStandardMaterial color={bodyColor} roughness={0.7} />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.22, 0.38, 0.04]}>
        <sphereGeometry args={[0.025, 4, 4]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#88ccff"
          emissiveIntensity={1}
        />
      </mesh>
      <mesh position={[0.22, 0.38, -0.04]}>
        <sphereGeometry args={[0.025, 4, 4]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#88ccff"
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  )
}

function GroundPlane() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#1a2a15" roughness={0.95} />
      </mesh>
      {/* Mossy area around tree */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[8, 24]} />
        <meshStandardMaterial color="#2a4a20" roughness={0.9} />
      </mesh>
    </>
  )
}

function Mushrooms() {
  const positions: [number, number, number][] = useMemo(
    () => [
      [3, 0, 2],
      [-2.5, 0, 3],
      [4, 0, -1.5],
      [-3, 0, -2],
      [1, 0, 4],
      [-4, 0, 1],
      [2.5, 0, -3],
      [-1, 0, -4],
    ],
    [],
  )

  return (
    <>
      {positions.map((pos, i) => (
        <group key={i} position={pos}>
          <mesh position={[0, 0.15, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.3, 6]} />
            <meshStandardMaterial color="#ddd8c0" roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.35, 0]}>
            <sphereGeometry
              args={[0.1, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#ff4422' : '#8844cc'}
              emissive={i % 2 === 0 ? '#aa2211' : '#5522aa'}
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>
      ))}
    </>
  )
}

export default function TreeOfLife() {
  const branches = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      rot: [number, number, number]
      len: number
      rad: number
    }[] = []
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.3
      const y = 4 + Math.random() * 5
      const tilt = 0.3 + Math.random() * 0.8
      arr.push({
        pos: [Math.cos(angle) * 0.5, y, Math.sin(angle) * 0.5],
        rot: [
          Math.cos(angle + Math.PI / 2) * tilt,
          0,
          -Math.sin(angle + Math.PI / 2) * tilt,
        ],
        len: 2 + Math.random() * 3,
        rad: 0.15 + Math.random() * 0.2,
      })
    }
    return arr
  }, [])

  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 12, 5]} intensity={0.4} color="#aaddff" />
      <ambientLight intensity={0.08} color="#112233" />
      <pointLight
        position={[0, 6, 0]}
        intensity={3}
        color="#22ddaa"
        distance={15}
      />
      <pointLight
        position={[0, 12, 0]}
        intensity={2}
        color="#44ff88"
        distance={10}
      />

      <GroundPlane />

      {/* Trunk */}
      <TrunkSection
        position={[0, 1.5, 0]}
        radius={1.2}
        height={3}
        taper={0.85}
      />
      <TrunkSection
        position={[0, 3.8, 0]}
        radius={1.0}
        height={2}
        taper={0.8}
      />
      <TrunkSection
        position={[0, 5.5, 0]}
        radius={0.75}
        height={2}
        taper={0.7}
      />
      <TrunkSection
        position={[0, 7.2, 0]}
        radius={0.5}
        height={2}
        taper={0.6}
      />

      {/* Roots */}
      {[0, 0.7, 1.4, 2.1, 2.8, 3.5, 4.2, 4.9, 5.6].map((angle, i) => (
        <Root
          key={i}
          angle={angle}
          length={3 + Math.random() * 2}
          curve={1.5 + Math.random()}
        />
      ))}

      {/* Branches */}
      {branches.map((b, i) => (
        <Branch
          key={i}
          position={b.pos}
          rotation={b.rot}
          length={b.len}
          radius={b.rad}
        />
      ))}

      <GlowingLeaves />
      <EnergyFlow />
      <Mushrooms />

      {/* Creatures at base */}
      <Creature position={[2.5, 0, 1.5]} bodyColor="#88aa66" />
      <Creature position={[-2, 0, 2.5]} bodyColor="#6688aa" />
      <Creature position={[1, 0, -3]} bodyColor="#aa8866" />
      <Creature position={[-3, 0, -1]} bodyColor="#8866aa" />
    </>
  )
}
