import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#0a0a1a', 30, 80)
    scene.background = new THREE.Color('#0a0a1a')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function TelescopeDish({
  position,
  rotationY = 0,
  elevation = 0.4,
}: {
  position: [number, number, number]
  rotationY?: number
  elevation?: number
}) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y =
      rotationY + Math.sin(t * 0.1 + position[0] * 0.5) * 0.3
  })

  return (
    <group position={position}>
      {/* Support base */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[2, 0.6, 2]} />
        <meshStandardMaterial color="#555555" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* Main support column */}
      <mesh position={[0, 3, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 5, 8]} />
        <meshStandardMaterial color="#dddddd" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Elevation mechanism */}
      <mesh position={[0, 5.5, 0]}>
        <boxGeometry args={[1.0, 0.6, 0.8]} />
        <meshStandardMaterial color="#cccccc" roughness={0.3} metalness={0.5} />
      </mesh>
      {/* Rotating dish assembly */}
      <group ref={groupRef} position={[0, 5.8, 0]}>
        <group rotation={[elevation, 0, 0]}>
          {/* Dish - hemisphere */}
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <sphereGeometry
              args={[3, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]}
            />
            <meshStandardMaterial
              color="#e0e0e0"
              roughness={0.2}
              metalness={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Feed support struts */}
          {[0, (Math.PI * 2) / 3, (Math.PI * 4) / 3].map((angle, i) => (
            <mesh
              key={i}
              position={[Math.cos(angle) * 1.5, -2, Math.sin(angle) * 1.5]}
              rotation={[0.4 * Math.cos(angle), 0, -0.4 * Math.sin(angle)]}
            >
              <cylinderGeometry args={[0.04, 0.04, 3, 4]} />
              <meshStandardMaterial
                color="#aaaaaa"
                roughness={0.3}
                metalness={0.6}
              />
            </mesh>
          ))}
          {/* Feed receiver */}
          <mesh position={[0, -2.5, 0]}>
            <cylinderGeometry args={[0.15, 0.1, 0.5, 8]} />
            <meshStandardMaterial
              color="#886644"
              roughness={0.4}
              metalness={0.5}
            />
          </mesh>
        </group>
      </group>
    </group>
  )
}

function DesertGround() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#8a7a5a" roughness={0.95} />
      </mesh>
      {/* Desert features - rocks */}
      {[
        [10, 0, 15],
        [-12, 0, 20],
        [25, 0, -10],
        [-20, 0, -15],
        [15, 0, -20],
        [-8, 0, -25],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.8 + Math.random() * 1.5, 6, 5]} />
          <meshStandardMaterial color="#7a6a4a" roughness={0.95} />
        </mesh>
      ))}
      {/* Distant mesa */}
      <mesh position={[-30, 3, -35]}>
        <boxGeometry args={[15, 6, 8]} />
        <meshStandardMaterial color="#6a5a3a" roughness={0.95} />
      </mesh>
      <mesh position={[35, 2, -30]}>
        <boxGeometry args={[10, 4, 6]} />
        <meshStandardMaterial color="#6a5a3a" roughness={0.95} />
      </mesh>
    </>
  )
}

function ControlBuilding() {
  return (
    <group position={[0, 0, 15]}>
      {/* Main building */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[6, 3, 4]} />
        <meshStandardMaterial color="#8a8a8a" roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 3.1, 0]}>
        <boxGeometry args={[6.5, 0.2, 4.5]} />
        <meshStandardMaterial color="#666666" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Windows - lit */}
      {[
        [-2, 1.5, 2.01],
        [0, 1.5, 2.01],
        [2, 1.5, 2.01],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <planeGeometry args={[1.0, 1.2]} />
          <meshStandardMaterial
            color="#aaddff"
            emissive="#66aadd"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
      {/* Door */}
      <mesh position={[0, 0.8, 2.01]}>
        <planeGeometry args={[1.0, 1.6]} />
        <meshStandardMaterial color="#555555" roughness={0.7} />
      </mesh>
      {/* Antenna on roof */}
      <mesh position={[2, 4.5, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 3, 4]} />
        <meshStandardMaterial color="#aaaaaa" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Satellite link dish (small) */}
      <mesh position={[-2, 3.5, 0]} rotation={[0.3, 0.5, 0]}>
        <sphereGeometry args={[0.5, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color="#dddddd"
          roughness={0.2}
          metalness={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  )
}

function Stars() {
  const count = 300
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const stars = useMemo(() => {
    const arr: { x: number; y: number; z: number; s: number; phase: number }[] =
      []
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 0.45
      const phi = Math.random() * Math.PI * 2
      const r = 45
      arr.push({
        x: r * Math.sin(theta) * Math.cos(phi),
        y: r * Math.cos(theta) + 5,
        z: r * Math.sin(theta) * Math.sin(phi),
        s: 0.03 + Math.random() * 0.08,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const s = stars[i]
      dummy.position.set(s.x, s.y, s.z)
      dummy.scale.setScalar(s.s * (0.6 + Math.sin(t * 1.2 + s.phase) * 0.4))
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={2}
      />
    </instancedMesh>
  )
}

function MilkyWay() {
  const count = 150
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(() => {
    const arr: { x: number; y: number; z: number; s: number }[] = []
    for (let i = 0; i < count; i++) {
      const t = (Math.random() - 0.5) * 2
      const spread = 3 + Math.random() * 5
      const r = 42
      arr.push({
        x: r * Math.sin(0.5 + t * 0.2) + (Math.random() - 0.5) * spread,
        y:
          r * Math.cos(0.5 + t * 0.2) * 0.6 +
          15 +
          (Math.random() - 0.5) * spread * 0.5,
        z: t * 20 + (Math.random() - 0.5) * spread,
        s: 0.05 + Math.random() * 0.12,
      })
    }
    return arr
  }, [])

  useEffect(() => {
    particles.forEach((p, i) => {
      dummy.position.set(p.x, p.y, p.z)
      dummy.scale.setScalar(p.s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [particles, dummy])

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#aabbdd"
        emissive="#8899bb"
        emissiveIntensity={0.8}
        transparent
        opacity={0.5}
      />
    </instancedMesh>
  )
}

function AccessRoad() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 10]}>
      <planeGeometry args={[3, 15]} />
      <meshStandardMaterial color="#6a6050" roughness={0.95} />
    </mesh>
  )
}

export default function RadioTelescopeArray() {
  const telescopes = useMemo(
    () => [
      { pos: [0, 0, 0] as [number, number, number], rot: 0, elev: 0.4 },
      { pos: [-12, 0, -5] as [number, number, number], rot: 0.3, elev: 0.5 },
      { pos: [12, 0, -5] as [number, number, number], rot: -0.3, elev: 0.35 },
      { pos: [-6, 0, -12] as [number, number, number], rot: 0.5, elev: 0.6 },
      { pos: [6, 0, -12] as [number, number, number], rot: -0.2, elev: 0.45 },
      { pos: [0, 0, -18] as [number, number, number], rot: 0.1, elev: 0.55 },
    ],
    [],
  )

  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 10, 8]} intensity={0.3} color="#aabbdd" />
      <ambientLight intensity={0.05} color="#222244" />
      <pointLight
        position={[0, 2, 15]}
        intensity={1}
        color="#aaddff"
        distance={10}
      />

      <DesertGround />
      <Stars />
      <MilkyWay />

      {telescopes.map((t, i) => (
        <TelescopeDish
          key={i}
          position={t.pos}
          rotationY={t.rot}
          elevation={t.elev}
        />
      ))}

      <ControlBuilding />
      <AccessRoad />
    </>
  )
}
