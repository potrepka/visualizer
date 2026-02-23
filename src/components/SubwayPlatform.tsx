import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a1a20', 15, 40)
    scene.background = new THREE.Color('#0a0a10')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function PlatformFloor() {
  return (
    <>
      {/* Main platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[2, 0, 0]}>
        <planeGeometry args={[8, 30]} />
        <meshStandardMaterial color="#606060" />
      </mesh>
      {/* Platform edge - yellow safety line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-1.95, 0.01, 0]}>
        <planeGeometry args={[0.3, 30]} />
        <meshStandardMaterial
          color="#d0c020"
          emissive="#d0c020"
          emissiveIntensity={0.2}
        />
      </mesh>
      {/* Track bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, -0.5, 0]}>
        <planeGeometry args={[4, 30]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>
    </>
  )
}

function Tracks() {
  return (
    <group position={[-4, -0.4, 0]}>
      {/* Rails */}
      {[-0.7, 0.7].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <boxGeometry args={[0.06, 0.08, 30]} />
          <meshStandardMaterial
            color="#808080"
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
      ))}
      {/* Ties */}
      {Array.from({ length: 40 }, (_, i) => (
        <mesh key={i} position={[0, -0.03, -15 + i * 0.75]}>
          <boxGeometry args={[2, 0.06, 0.15]} />
          <meshStandardMaterial color="#4a3a20" />
        </mesh>
      ))}
      {/* Third rail */}
      <mesh position={[-1.2, 0.05, 0]}>
        <boxGeometry args={[0.04, 0.06, 30]} />
        <meshStandardMaterial color="#707070" metalness={0.9} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Column({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 4, 8]} />
        <meshStandardMaterial color="#505860" />
      </mesh>
      {/* Column base */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#404850" />
      </mesh>
      {/* Column capital */}
      <mesh position={[0, 3.95, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#404850" />
      </mesh>
    </group>
  )
}

function WallTileBand({
  position,
  length,
}: {
  position: [number, number, number]
  length: number
}) {
  return (
    <group position={position}>
      {/* Wall */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.15, 4, length]} />
        <meshStandardMaterial color="#d0d0c8" />
      </mesh>
      {/* Blue accent band */}
      <mesh position={[0.08, 1.5, 0]}>
        <boxGeometry args={[0.02, 0.5, length]} />
        <meshStandardMaterial color="#2060a0" />
      </mesh>
      {/* Lower dark band */}
      <mesh position={[0.08, 0.3, 0]}>
        <boxGeometry args={[0.02, 0.6, length]} />
        <meshStandardMaterial color="#3a3a3a" />
      </mesh>
    </group>
  )
}

function FluorescentLight({
  position,
}: {
  position: [number, number, number]
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const phase = useMemo(() => Math.random() * 100, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    const flicker = Math.sin(t * 30 + phase) > 0.95 ? 0.5 : 1
    mat.emissiveIntensity = 0.8 * flicker
  })

  return (
    <group position={position}>
      {/* Fixture housing */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.2, 0.05, 1.5]} />
        <meshStandardMaterial color="#a0a0a0" />
      </mesh>
      {/* Light tube */}
      <mesh ref={ref} position={[0, -0.04, 0]}>
        <boxGeometry args={[0.06, 0.03, 1.2]} />
        <meshStandardMaterial
          color="#e0e8ff"
          emissive="#e0e8ff"
          emissiveIntensity={0.8}
        />
      </mesh>
      <pointLight
        position={[0, -0.1, 0]}
        color="#d8e0ff"
        intensity={1.5}
        distance={6}
      />
    </group>
  )
}

function Bench({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Seat */}
      <mesh position={[0, 0.45, 0]}>
        <boxGeometry args={[1.5, 0.06, 0.4]} />
        <meshStandardMaterial color="#8a6a3a" />
      </mesh>
      {/* Legs */}
      {[-0.6, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.22, 0]}>
          <boxGeometry args={[0.05, 0.44, 0.35]} />
          <meshStandardMaterial color="#4a4a4a" />
        </mesh>
      ))}
      {/* Back rest */}
      <mesh position={[0, 0.7, -0.17]}>
        <boxGeometry args={[1.5, 0.4, 0.04]} />
        <meshStandardMaterial color="#8a6a3a" />
      </mesh>
    </group>
  )
}

function Ceiling() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
      <planeGeometry args={[14, 30]} />
      <meshStandardMaterial color="#3a3a3a" side={THREE.DoubleSide} />
    </mesh>
  )
}

function ApproachingTrain() {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const cycle = t % 20
    if (cycle < 8) {
      ref.current.position.z = -20 + cycle * 3
      ref.current.visible = true
    } else {
      ref.current.visible = false
    }
  })

  return (
    <group ref={ref} position={[-4, 0.3, -20]}>
      {/* Main car body */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[2.4, 2, 10]} />
        <meshStandardMaterial color="#808890" />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[2.2, 0.15, 10]} />
        <meshStandardMaterial color="#606870" />
      </mesh>
      {/* Windows */}
      {Array.from({ length: 6 }, (_, i) => (
        <mesh key={i} position={[1.21, 1.4, -3.5 + i * 1.4]}>
          <boxGeometry args={[0.02, 0.8, 0.9]} />
          <meshStandardMaterial
            color="#a0c0e0"
            emissive="#a0c0e0"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
      {/* Headlight */}
      <mesh position={[0, 1.5, 5.05]}>
        <boxGeometry args={[1, 0.3, 0.05]} />
        <meshStandardMaterial
          color="#e8e8d0"
          emissive="#e8e8d0"
          emissiveIntensity={1}
        />
      </mesh>
      <spotLight
        position={[0, 1.5, 5.5]}
        target-position={[0, 0, 15]}
        color="#e8e8d0"
        intensity={5}
        distance={20}
        angle={0.5}
      />
    </group>
  )
}

function SignBoard({
  position,
  text,
}: {
  position: [number, number, number]
  text?: string
}) {
  void text
  return (
    <group position={position}>
      {/* Sign background */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 0.4, 0.05]} />
        <meshStandardMaterial color="#1a1a4a" />
      </mesh>
      {/* Text placeholder bar */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[1.2, 0.15, 0.01]} />
        <meshStandardMaterial
          color="#e0e0e0"
          emissive="#e0e0e0"
          emissiveIntensity={0.3}
        />
      </mesh>
    </group>
  )
}

export default function SubwayPlatform() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.15} color="#d0d8e0" />

      <PlatformFloor />
      <Tracks />
      <Ceiling />

      {/* Walls */}
      <WallTileBand position={[6, 0, 0]} length={30} />

      {/* Columns */}
      {Array.from({ length: 8 }, (_, i) => (
        <Column key={i} position={[-1, 0, -12 + i * 3.5]} />
      ))}

      {/* Fluorescent lights */}
      {Array.from({ length: 10 }, (_, i) => (
        <FluorescentLight key={i} position={[2, 3.95, -13 + i * 3]} />
      ))}

      {/* Benches */}
      <Bench position={[4, 0, -5]} />
      <Bench position={[4, 0, 2]} />
      <Bench position={[4, 0, 8]} />

      {/* Signs */}
      <SignBoard position={[5.8, 3, -4]} />
      <SignBoard position={[5.8, 3, 4]} />

      {/* Approaching train */}
      <ApproachingTrain />
    </>
  )
}
