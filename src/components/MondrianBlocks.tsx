import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#f5f2ea', 15, 40)
    scene.background = new THREE.Color('#f5f2ea')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Mondrian Block ---
function MondrianBlock({
  position,
  size,
  color,
  targetY,
  delay,
}: {
  position: [number, number, number]
  size: [number, number, number]
  color: string
  targetY: number
  delay: number
}) {
  const ref = useRef<THREE.Mesh>(null!)
  const startY = useMemo(() => position[1] - 5, [position])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const progress = Math.max(0, Math.min(1, (t - delay) * 0.8))
    const eased = 1 - Math.pow(1 - progress, 3)
    ref.current.position.y = startY + (targetY - startY) * eased

    // Subtle breathing
    const breathe = Math.sin(t * 0.5 + delay * 2) * 0.02
    ref.current.scale.setScalar(1 + breathe)
  })

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
    </mesh>
  )
}

// --- Grid Line (black separators) ---
function GridLine({
  position,
  size,
}: {
  position: [number, number, number]
  size: [number, number, number]
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
    </mesh>
  )
}

// --- Composition Layer ---
function MondrianComposition() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.15
    groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.05
  })

  // Mondrian colors
  const red = '#dd2222'
  const blue = '#2244aa'
  const yellow = '#eebb22'
  const white = '#f5f2ea'

  // Depth for the blocks
  const d = 0.5

  const blocks = useMemo(
    () => [
      // Large red block top-left
      {
        pos: [-3, 2, 0] as [number, number, number],
        size: [2.8, 2.2, d] as [number, number, number],
        color: red,
        delay: 0.2,
      },
      // Blue block bottom-right
      {
        pos: [2.5, -2.5, 0] as [number, number, number],
        size: [2, 1.8, d] as [number, number, number],
        color: blue,
        delay: 0.5,
      },
      // Yellow block top-right
      {
        pos: [3, 2.8, 0] as [number, number, number],
        size: [1.5, 1.2, d] as [number, number, number],
        color: yellow,
        delay: 0.8,
      },
      // White blocks
      {
        pos: [1, 1.5, 0] as [number, number, number],
        size: [2.2, 1.8, d] as [number, number, number],
        color: white,
        delay: 0.3,
      },
      {
        pos: [-2.5, -1, 0] as [number, number, number],
        size: [3, 2, d] as [number, number, number],
        color: white,
        delay: 0.6,
      },
      {
        pos: [0.5, -2, 0] as [number, number, number],
        size: [1.5, 2.5, d] as [number, number, number],
        color: white,
        delay: 0.4,
      },
      {
        pos: [-1, -3, 0] as [number, number, number],
        size: [2, 1, d] as [number, number, number],
        color: white,
        delay: 0.7,
      },
      // Small red accent
      {
        pos: [-0.5, 3.2, 0] as [number, number, number],
        size: [1, 0.8, d] as [number, number, number],
        color: red,
        delay: 1.0,
      },
      // Small yellow accent
      {
        pos: [-3.5, -2.8, 0] as [number, number, number],
        size: [1.2, 1, d] as [number, number, number],
        color: yellow,
        delay: 1.1,
      },
      // Large blue accent center-left
      {
        pos: [3.2, -0.5, 0] as [number, number, number],
        size: [1.2, 2.5, d] as [number, number, number],
        color: blue,
        delay: 0.9,
      },
    ],
    [],
  )

  // Grid lines
  const hLines = useMemo(
    () => [
      {
        pos: [0, 0.4, 0.05] as [number, number, number],
        size: [10, 0.12, d + 0.12] as [number, number, number],
      },
      {
        pos: [0, 2.0, 0.05] as [number, number, number],
        size: [10, 0.12, d + 0.12] as [number, number, number],
      },
      {
        pos: [0, -1.2, 0.05] as [number, number, number],
        size: [10, 0.12, d + 0.12] as [number, number, number],
      },
      {
        pos: [0, -3.0, 0.05] as [number, number, number],
        size: [10, 0.12, d + 0.12] as [number, number, number],
      },
      {
        pos: [0, 3.6, 0.05] as [number, number, number],
        size: [10, 0.12, d + 0.12] as [number, number, number],
      },
    ],
    [],
  )

  const vLines = useMemo(
    () => [
      {
        pos: [-1.3, 0, 0.05] as [number, number, number],
        size: [0.12, 8.5, d + 0.12] as [number, number, number],
      },
      {
        pos: [0.2, 0, 0.05] as [number, number, number],
        size: [0.12, 8.5, d + 0.12] as [number, number, number],
      },
      {
        pos: [2.0, 0, 0.05] as [number, number, number],
        size: [0.12, 8.5, d + 0.12] as [number, number, number],
      },
      {
        pos: [-4.0, 0, 0.05] as [number, number, number],
        size: [0.12, 8.5, d + 0.12] as [number, number, number],
      },
      {
        pos: [3.8, 0, 0.05] as [number, number, number],
        size: [0.12, 8.5, d + 0.12] as [number, number, number],
      },
    ],
    [],
  )

  return (
    <group ref={groupRef}>
      {/* Blocks */}
      {blocks.map((b, i) => (
        <MondrianBlock
          key={i}
          position={b.pos}
          size={b.size}
          color={b.color}
          targetY={b.pos[1]}
          delay={b.delay}
        />
      ))}
      {/* Horizontal grid lines */}
      {hLines.map((l, i) => (
        <GridLine key={`h${i}`} position={l.pos} size={l.size} />
      ))}
      {/* Vertical grid lines */}
      {vLines.map((l, i) => (
        <GridLine key={`v${i}`} position={l.pos} size={l.size} />
      ))}
    </group>
  )
}

// --- Second Layer (depth variation) ---
function DepthBlocks() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.15
    groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.05
  })

  const red = '#dd2222'
  const blue = '#2244aa'
  const yellow = '#eebb22'

  return (
    <group ref={groupRef}>
      {/* Floating accent blocks at various depths */}
      <mesh position={[-3, 2, 1.2]}>
        <boxGeometry args={[0.8, 0.6, 0.3]} />
        <meshStandardMaterial color={red} roughness={0.3} />
      </mesh>
      <mesh position={[2.5, -2.5, 1.5]}>
        <boxGeometry args={[0.6, 0.5, 0.2]} />
        <meshStandardMaterial color={blue} roughness={0.3} />
      </mesh>
      <mesh position={[3, 2.8, -0.8]}>
        <boxGeometry args={[0.5, 0.4, 0.6]} />
        <meshStandardMaterial color={yellow} roughness={0.3} />
      </mesh>
      <mesh position={[-1, -3, 1.0]}>
        <boxGeometry args={[0.7, 0.3, 0.4]} />
        <meshStandardMaterial color={red} roughness={0.3} />
      </mesh>
      <mesh position={[1, 1.5, -1.0]}>
        <boxGeometry args={[0.4, 0.6, 0.3]} />
        <meshStandardMaterial color={blue} roughness={0.3} />
      </mesh>
    </group>
  )
}

// --- Floating Frame ---
function Frame() {
  const thickness = 0.2
  const frameColor = '#1a1a1a'
  const w = 10
  const h = 8.5

  return (
    <group position={[0, 0, -0.4]}>
      {/* Top */}
      <mesh position={[0, h / 2 + thickness / 2, 0]}>
        <boxGeometry args={[w + thickness * 2, thickness, 0.6]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -h / 2 - thickness / 2, 0]}>
        <boxGeometry args={[w + thickness * 2, thickness, 0.6]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} />
      </mesh>
      {/* Left */}
      <mesh position={[-w / 2 - thickness / 2, 0, 0]}>
        <boxGeometry args={[thickness, h, 0.6]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} />
      </mesh>
      {/* Right */}
      <mesh position={[w / 2 + thickness / 2, 0, 0]}>
        <boxGeometry args={[thickness, h, 0.6]} />
        <meshStandardMaterial color={frameColor} roughness={0.3} />
      </mesh>
    </group>
  )
}

// --- Main Scene ---
export default function MondrianBlocks() {
  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight position={[5, 8, 8]} intensity={0.9} color="#ffffff" />
      <directionalLight
        position={[-3, 5, -5]}
        intensity={0.3}
        color="#ddddee"
      />
      <MondrianComposition />
      <DepthBlocks />
      <Frame />
    </>
  )
}
