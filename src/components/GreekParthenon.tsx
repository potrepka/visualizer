import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#88b8e8', 40, 100)
    scene.background = new THREE.Color('#6eaae0')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function SteppedBase() {
  return (
    <group>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[14, 0.2, 7]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[13.5, 0.2, 6.5]} />
        <meshStandardMaterial color="#e4dcc8" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[13, 0.2, 6]} />
        <meshStandardMaterial color="#e0d8c0" roughness={0.7} />
      </mesh>
    </group>
  )
}

function DoricColumn({
  position,
  height,
}: {
  position: [number, number, number]
  height: number
}) {
  return (
    <group position={position}>
      {/* Fluted shaft */}
      <mesh position={[0, height / 2 + 0.6, 0]}>
        <cylinderGeometry args={[0.22, 0.26, height, 20]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.6} />
      </mesh>
      {/* Echinus (rounded capital) */}
      <mesh position={[0, height + 0.7, 0]}>
        <cylinderGeometry args={[0.32, 0.22, 0.12, 16]} />
        <meshStandardMaterial color="#e4dcc8" roughness={0.6} />
      </mesh>
      {/* Abacus (square top) */}
      <mesh position={[0, height + 0.82, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#e0d8c0" roughness={0.6} />
      </mesh>
    </group>
  )
}

function Entablature() {
  return (
    <group position={[0, 5.0, 0]}>
      {/* Architrave */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[13, 0.3, 5.5]} />
        <meshStandardMaterial color="#e4dcc8" roughness={0.65} />
      </mesh>
      {/* Frieze */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[13, 0.4, 5.5]} />
        <meshStandardMaterial color="#dcd4c0" roughness={0.7} />
      </mesh>
      {/* Triglyphs on frieze */}
      {Array.from({ length: 12 }).map((_, i) => (
        <mesh key={i} position={[-5.5 + i * 1.0, 0.3, 2.78]}>
          <boxGeometry args={[0.3, 0.38, 0.05]} />
          <meshStandardMaterial color="#d0c8b8" roughness={0.7} />
        </mesh>
      ))}
      {/* Cornice */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[13.5, 0.15, 5.8]} />
        <meshStandardMaterial color="#e8e0d0" roughness={0.65} />
      </mesh>
    </group>
  )
}

function Pediment({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      {/* Triangular pediment using a flat prism-like shape */}
      <mesh position={[0, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[6.5, 0.4, 3]} />
        <meshStandardMaterial
          color="#e0d8c0"
          roughness={0.7}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Tympanum (back fill) */}
      <mesh position={[0, 0.3, 0.05]}>
        <boxGeometry args={[12.5, 0.05, 0.3]} />
        <meshStandardMaterial color="#dcd4c0" roughness={0.7} />
      </mesh>
    </group>
  )
}

function FloorInner() {
  return (
    <mesh position={[0, 0.61, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[11, 4]} />
      <meshStandardMaterial color="#ddd5c0" roughness={0.75} />
    </mesh>
  )
}

function InnerChamberWalls() {
  return (
    <group>
      {/* Back wall (cella) */}
      <mesh position={[0, 2.8, -1.5]}>
        <boxGeometry args={[6, 4, 0.2]} />
        <meshStandardMaterial color="#e0d8c8" roughness={0.7} />
      </mesh>
      {/* Side walls */}
      <mesh position={[-3, 2.8, 0.5]}>
        <boxGeometry args={[0.2, 4, 4]} />
        <meshStandardMaterial color="#e0d8c8" roughness={0.7} />
      </mesh>
      <mesh position={[3, 2.8, 0.5]}>
        <boxGeometry args={[0.2, 4, 4]} />
        <meshStandardMaterial color="#e0d8c8" roughness={0.7} />
      </mesh>
    </group>
  )
}

function Surroundings() {
  const bushes = useMemo(() => {
    const arr: { pos: [number, number, number]; size: number }[] = []
    for (let i = 0; i < 10; i++) {
      arr.push({
        pos: [(Math.random() - 0.5) * 30, 0.2, 8 + Math.random() * 10],
        size: 0.3 + Math.random() * 0.5,
      })
    }
    return arr
  }, [])

  return (
    <group>
      {/* Olive trees */}
      {[
        [-10, 0, 5],
        [10, 0, 5],
        [-8, 0, -8],
        [9, 0, -6],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <mesh position={[0, 1, 0]}>
            <cylinderGeometry args={[0.1, 0.15, 2, 6]} />
            <meshStandardMaterial color="#5a4020" roughness={0.9} />
          </mesh>
          <mesh position={[0, 2.3, 0]}>
            <sphereGeometry args={[0.8, 10, 8]} />
            <meshStandardMaterial color="#5a7a3a" roughness={0.8} />
          </mesh>
        </group>
      ))}
      {/* Bushes */}
      {bushes.map((b, i) => (
        <mesh key={i} position={b.pos}>
          <sphereGeometry args={[b.size, 8, 6]} />
          <meshStandardMaterial color="#4a6a2a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function FallenColumn({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.2, 2, 12]} />
        <meshStandardMaterial color="#d8d0c0" roughness={0.75} />
      </mesh>
      {/* Broken pieces */}
      <mesh position={[1.3, 0.1, 0.2]}>
        <cylinderGeometry args={[0.18, 0.2, 0.3, 12]} />
        <meshStandardMaterial color="#d8d0c0" roughness={0.75} />
      </mesh>
    </group>
  )
}

function Cloud({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.x = position[0] + Math.sin(t * 0.05 + position[2]) * 2
  })

  return (
    <group ref={ref} position={position}>
      <mesh>
        <sphereGeometry args={[1.5, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[1.2, 0.2, 0]}>
        <sphereGeometry args={[1.2, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      <mesh position={[-1.0, 0.1, 0.3]}>
        <sphereGeometry args={[1.0, 8, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  )
}

export default function GreekParthenon() {
  const columnHeight = 4
  return (
    <>
      <SceneSetup />
      <directionalLight position={[6, 10, 8]} intensity={1.2} color="#fff8e0" />
      <ambientLight intensity={0.3} color="#c0d0e0" />
      <hemisphereLight args={['#87ceeb', '#8a9a6a', 0.3]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#8a9a6a" />
      </mesh>

      <SteppedBase />

      {/* Front columns (8) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <DoricColumn
          key={`f-${i}`}
          position={[-5.5 + i * 1.57, 0, 2.5]}
          height={columnHeight}
        />
      ))}
      {/* Back columns (8) */}
      {Array.from({ length: 8 }).map((_, i) => (
        <DoricColumn
          key={`b-${i}`}
          position={[-5.5 + i * 1.57, 0, -2.5]}
          height={columnHeight}
        />
      ))}
      {/* Side columns (left) */}
      {Array.from({ length: 4 }).map((_, i) => (
        <DoricColumn
          key={`sl-${i}`}
          position={[-5.5, 0, -1.2 + i * 1.2]}
          height={columnHeight}
        />
      ))}
      {/* Side columns (right) */}
      {Array.from({ length: 4 }).map((_, i) => (
        <DoricColumn
          key={`sr-${i}`}
          position={[5.5, 0, -1.2 + i * 1.2]}
          height={columnHeight}
        />
      ))}

      <Entablature />
      <FloorInner />
      <InnerChamberWalls />

      {/* Pediments */}
      <Pediment position={[0, 5.7, 2.75]} rotation={[0, 0, 0]} />
      <Pediment position={[0, 5.7, -2.75]} rotation={[0, Math.PI, 0]} />

      <Surroundings />

      {/* Fallen column nearby */}
      <FallenColumn position={[8, 0, 8]} rotation={[0, 0.3, 0]} />

      {/* Clouds */}
      <Cloud position={[-12, 15, -10]} />
      <Cloud position={[8, 17, -15]} />
      <Cloud position={[0, 14, -20]} />
    </>
  )
}
