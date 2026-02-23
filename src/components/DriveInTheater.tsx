import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#0a0a1a', 25, 60)
    scene.background = new THREE.Color('#0a0a20')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial color="#2a2a1a" />
    </mesh>
  )
}

function MovieScreen() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    // Subtle brightness flicker like old projector
    mat.emissiveIntensity =
      0.8 + Math.sin(t * 8) * 0.05 + Math.sin(t * 13) * 0.03
  })

  return (
    <group position={[0, 0, -15]}>
      {/* Screen frame structure */}
      <mesh position={[0, 5, 0]}>
        <boxGeometry args={[14, 0.3, 0.5]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      {/* Vertical supports */}
      {[-7, 7].map((x, i) => (
        <mesh key={i} position={[x, 2.5, 0]}>
          <boxGeometry args={[0.3, 5, 0.5]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
      ))}
      {/* The screen surface */}
      <mesh ref={ref} position={[0, 2.8, 0.3]}>
        <planeGeometry args={[13, 4.5]} />
        <meshStandardMaterial
          color="#e8e8f0"
          emissive="#e8e8f0"
          emissiveIntensity={0.8}
        />
      </mesh>
      {/* Screen glow light */}
      <pointLight
        position={[0, 3, 2]}
        color="#d0d0ff"
        intensity={3}
        distance={20}
      />
    </group>
  )
}

function Car({
  position,
  color,
  rotation,
}: {
  position: [number, number, number]
  color: string
  rotation?: number
}) {
  return (
    <group position={position} rotation={[0, rotation ?? 0, 0]}>
      {/* Body */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[1.8, 0.45, 3.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.8, -0.2]}>
        <boxGeometry args={[1.6, 0.45, 2]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Windshield */}
      <mesh position={[0, 0.8, 0.85]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[1.4, 0.45]} />
        <meshStandardMaterial
          color="#304060"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Rear window */}
      <mesh position={[0, 0.8, -1.2]} rotation={[0.15, 0, 0]}>
        <planeGeometry args={[1.4, 0.4]} />
        <meshStandardMaterial
          color="#304060"
          transparent
          opacity={0.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Wheels */}
      {[
        [-0.9, 0.2, 1.1],
        [0.9, 0.2, 1.1],
        [-0.9, 0.2, -1.1],
        [0.9, 0.2, -1.1],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.12, 8]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      ))}
      {/* Taillights (faint glow) */}
      {[-0.65, 0.65].map((x, i) => (
        <mesh key={i} position={[x, 0.4, -1.92]}>
          <boxGeometry args={[0.2, 0.1, 0.02]} />
          <meshStandardMaterial
            color="#e02020"
            emissive="#e02020"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  )
}

function SpeakerPole({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.03, 0.04, 1.2, 6]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      {/* Speaker box */}
      <mesh position={[0, 1.15, 0]}>
        <boxGeometry args={[0.15, 0.2, 0.1]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
      {/* Speaker cone detail */}
      <mesh position={[0, 1.15, 0.06]}>
        <sphereGeometry args={[0.04, 6, 4]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </group>
  )
}

function ProjectorBooth() {
  return (
    <group position={[0, 0, 15]}>
      {/* Building */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[4, 4, 3]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      {/* Projector window */}
      <mesh position={[0, 2.5, -1.52]}>
        <boxGeometry args={[1, 0.6, 0.05]} />
        <meshStandardMaterial
          color="#e8e0c0"
          emissive="#e8e0c0"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Projector beam light */}
      <spotLight
        position={[0, 2.5, -1.5]}
        target-position={[0, 3, -15]}
        color="#e8e0c0"
        intensity={2}
        distance={35}
        angle={0.15}
        penumbra={0.3}
      />
      {/* Sign on top */}
      <mesh position={[0, 4.3, -0.5]}>
        <boxGeometry args={[3, 0.6, 0.1]} />
        <meshStandardMaterial color="#2a2a5a" />
      </mesh>
      {/* Neon text placeholder */}
      <mesh position={[0, 4.3, -0.56]}>
        <boxGeometry args={[2.2, 0.3, 0.02]} />
        <meshStandardMaterial
          color="#e060a0"
          emissive="#e060a0"
          emissiveIntensity={0.6}
        />
      </mesh>
    </group>
  )
}

function ConcessionStand() {
  return (
    <group position={[12, 0, 5]}>
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[3, 3, 3]} />
        <meshStandardMaterial color="#c8a060" />
      </mesh>
      {/* Service window */}
      <mesh position={[0, 1.5, 1.52]}>
        <boxGeometry args={[1.5, 1.2, 0.05]} />
        <meshStandardMaterial
          color="#e8d080"
          emissive="#e8d080"
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Counter */}
      <mesh position={[0, 0.9, 1.8]}>
        <boxGeometry args={[2, 0.08, 0.5]} />
        <meshStandardMaterial color="#806040" />
      </mesh>
      {/* Roof sign */}
      <mesh position={[0, 3.2, 0.5]}>
        <boxGeometry args={[3.2, 0.5, 0.1]} />
        <meshStandardMaterial color="#c03030" />
      </mesh>
      {/* Sign text */}
      <mesh position={[0, 3.2, 0.56]}>
        <boxGeometry args={[2.4, 0.25, 0.02]} />
        <meshStandardMaterial
          color="#e8e8e8"
          emissive="#e8e8e8"
          emissiveIntensity={0.3}
        />
      </mesh>
      {/* Light */}
      <pointLight
        position={[0, 2.5, 2]}
        color="#e8d080"
        intensity={1}
        distance={6}
      />
    </group>
  )
}

function StarField() {
  const ref = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const count = 200
  const stars = useMemo(() => {
    const arr: {
      x: number
      y: number
      z: number
      size: number
      twinkleSpeed: number
    }[] = []
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 0.4
      const phi = Math.random() * Math.PI * 2
      const r = 40 + Math.random() * 20
      arr.push({
        x: r * Math.sin(theta) * Math.cos(phi),
        y: r * Math.cos(theta) + 5,
        z: r * Math.sin(theta) * Math.sin(phi) - 20,
        size: 0.03 + Math.random() * 0.06,
        twinkleSpeed: 1 + Math.random() * 3,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < count; i++) {
      const s = stars[i]
      dummy.position.set(s.x, s.y, s.z)
      const twinkle = 0.5 + Math.sin(t * s.twinkleSpeed + i) * 0.5
      dummy.scale.setScalar(s.size * twinkle)
      dummy.updateMatrix()
      ref.current.setMatrixAt(i, dummy.matrix)
    }
    ref.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial
        color="#ffffff"
        emissive="#ffffff"
        emissiveIntensity={1}
      />
    </instancedMesh>
  )
}

function Fence({
  startZ,
  endZ,
  x,
}: {
  startZ: number
  endZ: number
  x: number
}) {
  const posts = useMemo(() => {
    const arr: number[] = []
    for (let z = startZ; z <= endZ; z += 2) {
      arr.push(z)
    }
    return arr
  }, [startZ, endZ])

  const length = endZ - startZ

  return (
    <group>
      {/* Horizontal rail */}
      <mesh position={[x, 0.5, (startZ + endZ) / 2]}>
        <boxGeometry args={[0.04, 0.04, length]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      {/* Posts */}
      {posts.map((z, i) => (
        <mesh key={i} position={[x, 0.35, z]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 5]} />
          <meshStandardMaterial color="#5a5a5a" />
        </mesh>
      ))}
    </group>
  )
}

export default function DriveInTheater() {
  const carColors = [
    '#a03030',
    '#4a7aa0',
    '#d0c060',
    '#3a6a3a',
    '#c08040',
    '#8060a0',
    '#d06060',
    '#4a8a6a',
    '#c0a070',
    '#6080c0',
    '#b04040',
    '#50a080',
  ]

  const carPositions: [number, number, number][] = useMemo(() => {
    const arr: [number, number, number][] = []
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        arr.push([-5 + col * 5, 0, -5 + row * 5])
      }
    }
    return arr
  }, [])

  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.08} color="#2a2a4a" />
      <directionalLight
        position={[5, 5, -10]}
        intensity={0.1}
        color="#4a4a6a"
      />

      <Ground />
      <StarField />
      <MovieScreen />
      <ProjectorBooth />
      <ConcessionStand />

      {/* Cars in rows */}
      {carPositions.map((pos, i) => (
        <group key={i}>
          <Car position={pos} color={carColors[i % carColors.length]} />
          <SpeakerPole position={[pos[0] + 1.2, pos[1], pos[2]]} />
        </group>
      ))}

      {/* Fencing */}
      <Fence startZ={-8} endZ={18} x={-9} />
      <Fence startZ={-8} endZ={18} x={9} />
    </>
  )
}
