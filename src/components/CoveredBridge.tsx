import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#c8a880', 25, 80)
    scene.background = new THREE.Color('#c8a880')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function BridgeStructure() {
  const plankColor = '#8a5a2a'
  const frameColor = '#6a4a1a'
  const roofColor = '#5a3a0a'
  const length = 10
  const width = 3
  const height = 3.5

  return (
    <group position={[0, 2, 0]}>
      {/* Floor planks */}
      {Array.from({ length: 20 }, (_, i) => (
        <mesh
          key={`plank-${i}`}
          position={[0, 0, -length / 2 + i * 0.5 + 0.25]}
        >
          <boxGeometry args={[width, 0.08, 0.45]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? plankColor : '#7a4a1a'}
            roughness={0.9}
          />
        </mesh>
      ))}

      {/* Side walls - left */}
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.15, height, length]} />
        <meshStandardMaterial color={frameColor} roughness={0.85} />
      </mesh>
      {/* Side walls - right */}
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[0.15, height, length]} />
        <meshStandardMaterial color={frameColor} roughness={0.85} />
      </mesh>

      {/* Cross braces */}
      {[-3, 0, 3].map((z, i) => (
        <group key={`brace-${i}`}>
          <mesh position={[-width / 2, height / 2, z]} rotation={[0.6, 0, 0]}>
            <boxGeometry args={[0.1, 0.1, height * 1.1]} />
            <meshStandardMaterial color={frameColor} roughness={0.85} />
          </mesh>
          <mesh position={[width / 2, height / 2, z]} rotation={[-0.6, 0, 0]}>
            <boxGeometry args={[0.1, 0.1, height * 1.1]} />
            <meshStandardMaterial color={frameColor} roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Vertical posts */}
      {[-4, -2, 0, 2, 4].map((z, i) => (
        <group key={`posts-${i}`}>
          <mesh position={[-width / 2 - 0.1, height / 2, z]}>
            <boxGeometry args={[0.15, height, 0.15]} />
            <meshStandardMaterial color={frameColor} roughness={0.85} />
          </mesh>
          <mesh position={[width / 2 + 0.1, height / 2, z]}>
            <boxGeometry args={[0.15, height, 0.15]} />
            <meshStandardMaterial color={frameColor} roughness={0.85} />
          </mesh>
        </group>
      ))}

      {/* Roof ridge beam */}
      <mesh position={[0, height + 0.8, 0]}>
        <boxGeometry args={[0.15, 0.15, length + 0.5]} />
        <meshStandardMaterial color={roofColor} roughness={0.9} />
      </mesh>

      {/* Roof panels - left slope */}
      <mesh position={[-1.0, height + 0.3, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[2.2, 0.1, length + 0.5]} />
        <meshStandardMaterial color={roofColor} roughness={0.9} />
      </mesh>
      {/* Roof panels - right slope */}
      <mesh position={[1.0, height + 0.3, 0]} rotation={[0, 0, -0.35]}>
        <boxGeometry args={[2.2, 0.1, length + 0.5]} />
        <meshStandardMaterial color={roofColor} roughness={0.9} />
      </mesh>

      {/* Entrance openings (darker) */}
      <mesh position={[0, height / 2, length / 2 + 0.01]}>
        <planeGeometry args={[width - 0.3, height - 0.3]} />
        <meshStandardMaterial color="#1a1a1a" side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, height / 2, -length / 2 - 0.01]}>
        <planeGeometry args={[width - 0.3, height - 0.3]} />
        <meshStandardMaterial color="#1a1a1a" side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

function StoneAbutment({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[4, 1.5, 3]} />
        <meshStandardMaterial color="#7a7a6a" roughness={0.95} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[3.5, 0.3, 2.8]} />
        <meshStandardMaterial color="#6a6a5a" roughness={0.95} />
      </mesh>
      {/* Stone texture blocks */}
      {[
        [-1.2, 0.3, 1.51],
        [0, 0.6, 1.51],
        [1.2, 0.3, 1.51],
        [-0.6, 1.0, 1.51],
        [0.6, 1.0, 1.51],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[0.8, 0.25, 0.05]} />
          <meshStandardMaterial color="#6a6a5a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function Stream() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = meshRef.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.05 + Math.sin(t * 1.5) * 0.03
  })

  return (
    <group>
      {/* Streambed */}
      <mesh position={[0, -0.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 5]} />
        <meshStandardMaterial color="#4a5a3a" />
      </mesh>
      {/* Water surface */}
      <mesh
        ref={meshRef}
        position={[0, 0.1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[40, 4]} />
        <meshStandardMaterial
          color="#4477aa"
          emissive="#335588"
          emissiveIntensity={0.05}
          metalness={0.4}
          roughness={0.1}
          transparent
          opacity={0.75}
        />
      </mesh>
      {/* Rocks in stream */}
      {[
        [-3, 0, 1],
        [2, 0, -0.5],
        [-1, 0, 0.8],
        [4, 0, -1],
        [-5, 0, 0],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.15 + Math.random() * 0.15, 6, 6]} />
          <meshStandardMaterial color="#5a5a4a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

function AutumnTree({
  position,
  trunkHeight,
  foliageColor,
}: {
  position: [number, number, number]
  trunkHeight: number
  foliageColor: string
}) {
  return (
    <group position={position}>
      <mesh position={[0, trunkHeight / 2, 0]}>
        <cylinderGeometry args={[0.06, 0.1, trunkHeight, 6]} />
        <meshStandardMaterial color="#5a3a1a" />
      </mesh>
      <mesh position={[0, trunkHeight + 0.4, 0]}>
        <sphereGeometry args={[0.8, 8, 8]} />
        <meshStandardMaterial color={foliageColor} />
      </mesh>
      <mesh position={[0.3, trunkHeight + 0.1, 0.2]}>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshStandardMaterial color={foliageColor} />
      </mesh>
      <mesh position={[-0.2, trunkHeight + 0.6, -0.2]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color={foliageColor} />
      </mesh>
    </group>
  )
}

const LEAF_COUNT = 120
const leafDummy = new THREE.Object3D()

function FallingLeaves() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  const leaves = useMemo(() => {
    const arr = []
    for (let i = 0; i < LEAF_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 25,
        y: 3 + Math.random() * 8,
        z: (Math.random() - 0.5) * 25,
        fallSpeed: 0.1 + Math.random() * 0.15,
        driftX: (Math.random() - 0.5) * 0.5,
        driftZ: (Math.random() - 0.5) * 0.5,
        rotSpeed: 1 + Math.random() * 3,
        phase: Math.random() * Math.PI * 2,
        scale: 0.02 + Math.random() * 0.02,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < LEAF_COUNT; i++) {
      const l = leaves[i]
      const cycle = l.y / l.fallSpeed + 5
      const lt = (t + l.phase * 5) % cycle
      const y = l.y - lt * l.fallSpeed

      leafDummy.position.set(
        l.x + Math.sin(t * 0.5 + l.phase) * l.driftX * 3,
        y,
        l.z + Math.cos(t * 0.5 + l.phase) * l.driftZ * 3,
      )
      leafDummy.rotation.set(
        t * l.rotSpeed,
        t * l.rotSpeed * 0.6,
        t * l.rotSpeed * 0.3,
      )
      leafDummy.scale.setScalar(l.scale)
      leafDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, leafDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, LEAF_COUNT]}>
      <planeGeometry args={[1, 0.6]} />
      <meshStandardMaterial
        color="#cc6622"
        side={THREE.DoubleSide}
        transparent
        opacity={0.9}
      />
    </instancedMesh>
  )
}

function RollingHills() {
  return (
    <group>
      {[
        { pos: [-15, -0.5, -8], sx: 10, sy: 2, sz: 8 },
        { pos: [18, -0.5, -6], sx: 12, sy: 2.5, sz: 10 },
        { pos: [0, -0.5, -15], sx: 20, sy: 3, sz: 12 },
        { pos: [-20, -0.5, 8], sx: 8, sy: 1.5, sz: 6 },
        { pos: [20, -0.5, 10], sx: 10, sy: 2, sz: 8 },
      ].map((h, i) => (
        <mesh
          key={i}
          position={h.pos as [number, number, number]}
          scale={[h.sx, h.sy, h.sz]}
        >
          <sphereGeometry args={[1, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={i % 2 === 0 ? '#6a8a3a' : '#5a7a2a'} />
        </mesh>
      ))}
    </group>
  )
}

export default function CoveredBridge() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[5, 8, 3]} color="#ffcc88" intensity={1.3} />
      <directionalLight
        position={[-5, 6, -3]}
        color="#8888cc"
        intensity={0.3}
      />
      <ambientLight intensity={0.25} />
      <hemisphereLight args={['#ffddaa', '#445533', 0.3]} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.3, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#5a7a3a" />
      </mesh>

      {/* Stream running under bridge along X axis */}
      <Stream />

      {/* Bridge spanning the stream along Z axis */}
      <BridgeStructure />

      {/* Stone abutments */}
      <StoneAbutment position={[0, 0, 6]} />
      <StoneAbutment position={[0, 0, -6]} />

      {/* Autumn trees - varied colors */}
      {[
        { pos: [-5, 0, 4], h: 2.5, c: '#cc4411' },
        { pos: [6, 0, -3], h: 3.0, c: '#dd8811' },
        { pos: [-4, 0, -6], h: 2.8, c: '#cc6622' },
        { pos: [5, 0, 7], h: 2.2, c: '#ee6633' },
        { pos: [-7, 0, 0], h: 3.2, c: '#dd9922' },
        { pos: [8, 0, 2], h: 2.6, c: '#cc3311' },
        { pos: [-3, 0, 10], h: 2.0, c: '#ddaa22' },
        { pos: [4, 0, -9], h: 2.8, c: '#cc5522' },
        { pos: [-8, 0, -8], h: 3.0, c: '#dd7711' },
        { pos: [9, 0, -7], h: 2.4, c: '#ee8844' },
      ].map((t, i) => (
        <AutumnTree
          key={i}
          position={t.pos as [number, number, number]}
          trunkHeight={t.h}
          foliageColor={t.c}
        />
      ))}

      <RollingHills />
      <FallingLeaves />
    </>
  )
}
