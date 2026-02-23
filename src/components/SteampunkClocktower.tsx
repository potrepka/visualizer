import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#2a2018', 15, 55)
    scene.background = new THREE.Color('#3a3028')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Gear({
  position,
  radius,
  tubeRadius = 0.08,
  speed = 1,
  axis = 'y',
}: {
  position: [number, number, number]
  radius: number
  tubeRadius?: number
  speed?: number
  axis?: 'x' | 'y' | 'z'
}) {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed
    if (axis === 'y') ref.current.rotation.y = t
    else if (axis === 'x') ref.current.rotation.x = t
    else ref.current.rotation.z = t
  })

  const toothCount = Math.max(6, Math.floor(radius * 8))

  return (
    <group ref={ref} position={position}>
      {/* Main ring */}
      <mesh>
        <torusGeometry args={[radius, tubeRadius, 8, 24]} />
        <meshStandardMaterial color="#b8860b" roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Spokes */}
      {[
        0,
        Math.PI / 3,
        (Math.PI * 2) / 3,
        Math.PI,
        (Math.PI * 4) / 3,
        (Math.PI * 5) / 3,
      ].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.cos(angle) * radius * 0.5,
            0,
            Math.sin(angle) * radius * 0.5,
          ]}
          rotation={[Math.PI / 2, 0, angle]}
        >
          <cylinderGeometry
            args={[tubeRadius * 0.5, tubeRadius * 0.5, radius, 4]}
          />
          <meshStandardMaterial
            color="#cd9b1d"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      ))}
      {/* Center hub */}
      <mesh>
        <cylinderGeometry
          args={[tubeRadius * 2, tubeRadius * 2, tubeRadius * 3, 8]}
        />
        <meshStandardMaterial color="#8b7500" roughness={0.4} metalness={0.9} />
      </mesh>
      {/* Teeth */}
      {Array.from({ length: toothCount }).map((_, i) => {
        const angle = (i / toothCount) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * (radius + tubeRadius * 1.5),
              0,
              Math.sin(angle) * (radius + tubeRadius * 1.5),
            ]}
          >
            <boxGeometry
              args={[tubeRadius * 1.5, tubeRadius * 2, tubeRadius * 1.5]}
            />
            <meshStandardMaterial
              color="#b8860b"
              roughness={0.3}
              metalness={0.9}
            />
          </mesh>
        )
      })}
    </group>
  )
}

function ClockFace({ position }: { position: [number, number, number] }) {
  const hourRef = useRef<THREE.Mesh>(null!)
  const minuteRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    hourRef.current.rotation.z = -t * 0.05
    minuteRef.current.rotation.z = -t * 0.6
  })

  return (
    <group position={position}>
      {/* Face plate */}
      <mesh>
        <circleGeometry args={[1.8, 24]} />
        <meshStandardMaterial color="#f5e6c8" roughness={0.7} />
      </mesh>
      {/* Rim */}
      <mesh position={[0, 0, -0.05]}>
        <torusGeometry args={[1.85, 0.1, 8, 24]} />
        <meshStandardMaterial color="#b8860b" roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Hour markers */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.sin(angle) * 1.5, Math.cos(angle) * 1.5, 0.02]}
          >
            <boxGeometry args={[0.06, 0.2, 0.02]} />
            <meshStandardMaterial color="#333333" roughness={0.5} />
          </mesh>
        )
      })}
      {/* Hour hand */}
      <mesh ref={hourRef} position={[0, 0, 0.04]}>
        <boxGeometry args={[0.08, 1.0, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Minute hand */}
      <mesh ref={minuteRef} position={[0, 0, 0.06]}>
        <boxGeometry args={[0.05, 1.4, 0.02]} />
        <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Center cap */}
      <mesh position={[0, 0, 0.08]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#b8860b" roughness={0.3} metalness={0.9} />
      </mesh>
    </group>
  )
}

function TowerBody() {
  return (
    <group>
      {/* Base building */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[6, 4, 5]} />
        <meshStandardMaterial color="#8b7355" roughness={0.85} />
      </mesh>
      {/* Tower shaft */}
      <mesh position={[0, 7, 0]}>
        <boxGeometry args={[4, 6, 3.5]} />
        <meshStandardMaterial color="#9b8365" roughness={0.85} />
      </mesh>
      {/* Clock level */}
      <mesh position={[0, 11.5, 0]}>
        <boxGeometry args={[4.5, 3, 4]} />
        <meshStandardMaterial color="#8b7355" roughness={0.85} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 14, 0]}>
        <coneGeometry args={[3, 3, 4]} />
        <meshStandardMaterial color="#6b5339" roughness={0.7} />
      </mesh>
      {/* Roof spire */}
      <mesh position={[0, 16, 0]}>
        <cylinderGeometry args={[0.05, 0.15, 1.5, 6]} />
        <meshStandardMaterial color="#b8860b" roughness={0.3} metalness={0.9} />
      </mesh>
      {/* Windows */}
      {[
        [-2.02, 6, 0],
        [-2.02, 8, 0],
        [2.02, 6, 0],
        [2.02, 8, 0],
      ].map((pos, i) => (
        <mesh
          key={i}
          position={pos as [number, number, number]}
          rotation={[0, i < 2 ? Math.PI / 2 : -Math.PI / 2, 0]}
        >
          <planeGeometry args={[0.6, 1.2]} />
          <meshStandardMaterial
            color="#ffcc66"
            emissive="#ffaa33"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      {/* Corner pillars */}
      {[
        [-2.3, 7, -1.8],
        [2.3, 7, -1.8],
        [-2.3, 7, 1.8],
        [2.3, 7, 1.8],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.15, 0.15, 6, 6]} />
          <meshStandardMaterial color="#7a6345" roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function SteamPipes() {
  return (
    <group>
      {/* Vertical pipes */}
      {[
        [-2.8, 5, -2],
        [2.8, 5, -2],
        [-2.8, 5, 2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <cylinderGeometry args={[0.1, 0.1, 10, 8]} />
          <meshStandardMaterial
            color="#8b6914"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
      ))}
      {/* Horizontal connectors */}
      {[
        [-2.8, 8, 0, 4],
        [0, 8, -2, 5.6],
      ].map((data, i) => (
        <mesh
          key={i}
          position={[data[0], data[1], data[2]]}
          rotation={[i === 1 ? 0 : Math.PI / 2, 0, i === 1 ? Math.PI / 2 : 0]}
        >
          <cylinderGeometry args={[0.08, 0.08, data[3], 8]} />
          <meshStandardMaterial
            color="#8b6914"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
      ))}
      {/* Pipe joints */}
      {[
        [-2.8, 8, -2],
        [-2.8, 8, 2],
        [2.8, 8, -2],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial
            color="#b8860b"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

function SteamParticles() {
  const count = 40
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particles = useMemo(() => {
    const arr: { x: number; z: number; speed: number; phase: number }[] = []
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 2,
        z: (Math.random() - 0.5) * 2,
        speed: 0.5 + Math.random() * 1.0,
        phase: Math.random() * Math.PI * 2,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const p = particles[i]
      const life = ((t * p.speed + p.phase) % 3) / 3
      const y = 10 + life * 5
      const spread = life * 2
      dummy.position.set(p.x * spread, y, -2 + p.z * spread)
      dummy.scale.setScalar(0.1 + life * 0.4)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial color="#cccccc" transparent opacity={0.2} />
    </instancedMesh>
  )
}

function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#4a4035" roughness={0.95} />
      </mesh>
      {/* Cobblestone area */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 5]}>
        <planeGeometry args={[12, 8]} />
        <meshStandardMaterial color="#5a5045" roughness={0.9} />
      </mesh>
    </>
  )
}

export default function SteampunkClocktower() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[8, 12, 5]} intensity={0.8} color="#ffddaa" />
      <ambientLight intensity={0.15} color="#443322" />
      <pointLight
        position={[0, 11.5, 2.5]}
        intensity={1.5}
        color="#ffcc88"
        distance={8}
      />

      <Ground />
      <TowerBody />
      <ClockFace position={[0, 11.5, 2.02]} />
      <ClockFace position={[0, 11.5, -2.02]} />

      {/* Gears visible through openings */}
      <Gear position={[0, 9, 0]} radius={0.8} speed={0.5} axis="z" />
      <Gear position={[1.5, 9, 0]} radius={0.5} speed={-0.8} axis="z" />
      <Gear position={[-1.2, 8.2, 0]} radius={0.6} speed={0.65} axis="z" />
      <Gear
        position={[0, 7.5, 1]}
        radius={0.4}
        tubeRadius={0.05}
        speed={-1.2}
        axis="z"
      />
      <Gear
        position={[0.8, 10, 0]}
        radius={0.35}
        tubeRadius={0.04}
        speed={1.5}
        axis="z"
      />

      <SteamPipes />
      <SteamParticles />
    </>
  )
}
