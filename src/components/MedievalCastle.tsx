import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#8ab898', 30, 80)
    scene.background = new THREE.Color('#7ab0d0')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Tower({
  position,
  height,
  radius,
}: {
  position: [number, number, number]
  height: number
  radius: number
}) {
  return (
    <group position={position}>
      {/* Tower body */}
      <mesh position={[0, height / 2, 0]}>
        <cylinderGeometry args={[radius, radius * 1.05, height, 16]} />
        <meshStandardMaterial color="#8a8078" roughness={0.9} />
      </mesh>
      {/* Cone roof */}
      <mesh position={[0, height + 0.8, 0]}>
        <coneGeometry args={[radius * 1.3, 1.6, 16]} />
        <meshStandardMaterial color="#6a3028" roughness={0.8} />
      </mesh>
      {/* Battlements */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[
              Math.cos(angle) * radius,
              height + 0.15,
              Math.sin(angle) * radius,
            ]}
          >
            <boxGeometry args={[0.3, 0.3, 0.15]} />
            <meshStandardMaterial color="#7a7068" roughness={0.9} />
          </mesh>
        )
      })}
      {/* Window slits */}
      {[height * 0.3, height * 0.6].map((y, i) => (
        <mesh key={i} position={[0, y, radius + 0.01]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.1, 0.3, 0.05]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      ))}
    </group>
  )
}

function CastleWall({
  from,
  to,
  height,
}: {
  from: [number, number, number]
  to: [number, number, number]
  height: number
}) {
  const dx = to[0] - from[0]
  const dz = to[2] - from[2]
  const length = Math.sqrt(dx * dx + dz * dz)
  const angle = Math.atan2(dx, dz)
  const mx = (from[0] + to[0]) / 2
  const mz = (from[2] + to[2]) / 2

  return (
    <group position={[mx, 0, mz]} rotation={[0, angle, 0]}>
      {/* Wall */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.5, height, length]} />
        <meshStandardMaterial color="#8a8078" roughness={0.9} />
      </mesh>
      {/* Battlements on top */}
      {Array.from({ length: Math.floor(length / 0.8) }).map((_, i) => (
        <mesh
          key={i}
          position={[0, height + 0.15, -length / 2 + 0.4 + i * 0.8]}
        >
          <boxGeometry args={[0.55, 0.3, 0.35]} />
          <meshStandardMaterial color="#7a7068" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Gatehouse({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Main structure */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[3, 4, 2]} />
        <meshStandardMaterial color="#8a8078" roughness={0.9} />
      </mesh>
      {/* Gate arch (dark opening) */}
      <mesh position={[0, 1.2, 1.01]}>
        <boxGeometry args={[1.2, 2, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Arch top */}
      <mesh position={[0, 2.3, 1.01]}>
        <cylinderGeometry args={[0.6, 0.6, 0.1, 12, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Battlements */}
      {[-1.0, -0.3, 0.4, 1.1].map((x, i) => (
        <mesh key={i} position={[x, 4.15, 0]}>
          <boxGeometry args={[0.4, 0.3, 0.6]} />
          <meshStandardMaterial color="#7a7068" roughness={0.9} />
        </mesh>
      ))}
      {/* Side towers */}
      {[-1.8, 1.8].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh position={[0, 2.5, 0]}>
            <cylinderGeometry args={[0.5, 0.55, 5, 12]} />
            <meshStandardMaterial color="#8a8078" roughness={0.9} />
          </mesh>
          <mesh position={[0, 5.3, 0]}>
            <coneGeometry args={[0.65, 1, 12]} />
            <meshStandardMaterial color="#6a3028" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Drawbridge({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // Gentle sway
    ref.current.rotation.x = -Math.PI / 2 + Math.sin(t * 0.5) * 0.01
  })

  return (
    <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <boxGeometry args={[1.4, 2.5, 0.1]} />
      <meshStandardMaterial color="#5a3a1a" roughness={0.95} />
    </mesh>
  )
}

function Moat() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.opacity = 0.7 + Math.sin(t * 0.8) * 0.05
  })

  return (
    <group>
      {/* Water */}
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <planeGeometry args={[22, 22]} />
        <meshStandardMaterial
          color="#2a5a6a"
          transparent
          opacity={0.7}
          metalness={0.3}
          roughness={0.1}
        />
      </mesh>
      {/* Moat banks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#6a5a40" />
      </mesh>
    </group>
  )
}

function Keep() {
  return (
    <group position={[0, 0, -3]}>
      {/* Main keep */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[4, 6, 4]} />
        <meshStandardMaterial color="#8a8078" roughness={0.9} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 6.6, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[3.2, 1.5, 4]} />
        <meshStandardMaterial color="#6a3028" roughness={0.8} />
      </mesh>
      {/* Windows */}
      {[
        [-1, 4, 2.01],
        [1, 4, 2.01],
        [0, 2, 2.01],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.4, 0.6, 0.05]} />
          <meshStandardMaterial color="#4a3a20" />
        </mesh>
      ))}
    </group>
  )
}

function Flag({ position }: { position: [number, number, number] }) {
  const flagRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    flagRef.current.rotation.y = Math.sin(t * 3 + position[0]) * 0.3
    flagRef.current.position.z = 0.25 + Math.sin(t * 2) * 0.05
  })

  return (
    <group position={position}>
      {/* Pole */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 4]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      {/* Flag cloth */}
      <mesh ref={flagRef} position={[0, 0.85, 0.25]}>
        <boxGeometry args={[0.02, 0.35, 0.5]} />
        <meshStandardMaterial color="#cc2222" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function GreenSurroundings() {
  const trees = useMemo(() => {
    const arr: { pos: [number, number, number]; height: number }[] = []
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 15 + Math.random() * 10
      arr.push({
        pos: [Math.cos(angle) * dist, 0, Math.sin(angle) * dist],
        height: 2 + Math.random() * 2,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {/* Green ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#4a8a3a" />
      </mesh>
      {/* Trees */}
      {trees.map((t, i) => (
        <group key={i} position={t.pos}>
          <mesh position={[0, t.height / 2, 0]}>
            <cylinderGeometry args={[0.1, 0.15, t.height, 6]} />
            <meshStandardMaterial color="#4a3018" />
          </mesh>
          <mesh position={[0, t.height + 0.5, 0]}>
            <coneGeometry args={[0.8, 2, 8]} />
            <meshStandardMaterial color="#2a6a1a" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function Courtyard() {
  return (
    <group position={[0, 0.01, 0]}>
      {/* Courtyard floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#9a8a70" />
      </mesh>
      {/* Well */}
      <mesh position={[2, 0.3, 2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.6, 12]} />
        <meshStandardMaterial color="#6a6a60" roughness={0.9} />
      </mesh>
      <mesh position={[2, 0.05, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.35, 12]} />
        <meshStandardMaterial color="#1a3040" />
      </mesh>
    </group>
  )
}

export default function MedievalCastle() {
  const wallH = 3.5
  return (
    <>
      <SceneSetup />
      <directionalLight position={[6, 10, 8]} intensity={1.0} color="#fff8e0" />
      <ambientLight intensity={0.25} color="#a0b0a0" />
      <hemisphereLight args={['#87ceeb', '#4a8a3a', 0.3]} />

      <GreenSurroundings />
      <Moat />
      <Courtyard />

      {/* Corner towers */}
      <Tower position={[-5, 0, -5]} height={5} radius={1} />
      <Tower position={[5, 0, -5]} height={5} radius={1} />
      <Tower position={[-5, 0, 5]} height={5} radius={1} />
      <Tower position={[5, 0, 5]} height={5} radius={1} />

      {/* Walls between towers */}
      <CastleWall from={[-5, 0, -5]} to={[5, 0, -5]} height={wallH} />
      <CastleWall from={[-5, 0, 5]} to={[-5, 0, -5]} height={wallH} />
      <CastleWall from={[5, 0, -5]} to={[5, 0, 5]} height={wallH} />
      {/* Front wall split for gatehouse */}
      <CastleWall from={[-5, 0, 5]} to={[-2, 0, 5]} height={wallH} />
      <CastleWall from={[2, 0, 5]} to={[5, 0, 5]} height={wallH} />

      <Gatehouse position={[0, 0, 5]} />
      <Drawbridge position={[0, 0.1, 7.2]} />

      <Keep />

      {/* Flags on towers */}
      <Flag position={[-5, 5.8, -5]} />
      <Flag position={[5, 5.8, -5]} />
      <Flag position={[0, 6.6, -3]} />
    </>
  )
}
