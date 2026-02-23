import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Canyon Wall (layered rock) ---
function CanyonWall({ side }: { side: 'left' | 'right' }) {
  const xSign = side === 'left' ? -1 : 1
  const baseX = xSign * 5

  const layers = useMemo(() => {
    const colors = [
      '#b5451b',
      '#c4622d',
      '#a0522d',
      '#d2691e',
      '#cc7744',
      '#b8582a',
      '#8b4513',
    ]
    const arr = []
    let y = 0
    for (let i = 0; i < 12; i++) {
      const layerHeight = 0.8 + Math.random() * 1.2
      const depth = 2 + Math.random() * 2
      const inset = Math.random() * 0.4
      arr.push({
        y: y + layerHeight / 2,
        height: layerHeight,
        depth,
        inset,
        color: colors[i % colors.length],
        z: (Math.random() - 0.5) * 2,
      })
      y += layerHeight
    }
    return arr
  }, [])

  return (
    <group>
      {layers.map((layer, i) => (
        <mesh
          key={i}
          position={[baseX + xSign * layer.inset, layer.y, layer.z]}
        >
          <boxGeometry args={[layer.depth, layer.height, 30]} />
          <meshStandardMaterial color={layer.color} roughness={0.9} />
        </mesh>
      ))}
      {/* Rock outcrops on the wall face */}
      {Array.from({ length: 8 }, (_, i) => {
        const y = 1 + Math.random() * 8
        const z = (Math.random() - 0.5) * 20
        return (
          <mesh
            key={`outcrop-${i}`}
            position={[baseX - xSign * 0.5 + xSign * Math.random() * 0.3, y, z]}
          >
            <boxGeometry
              args={[
                0.5 + Math.random() * 0.5,
                0.3 + Math.random() * 0.5,
                0.8 + Math.random() * 1,
              ]}
            />
            <meshStandardMaterial color="#a0522d" roughness={0.95} />
          </mesh>
        )
      })}
    </group>
  )
}

// --- River ---
function River() {
  const ref = useRef<THREE.Mesh>(null!)
  const offsetRef = useRef(0)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    offsetRef.current = t * 0.3
    ref.current.position.y = 0.05 + Math.sin(t * 0.5) * 0.02
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.metalness = 0.6 + Math.sin(t * 0.8) * 0.1
  })

  return (
    <group>
      {/* River bed */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[6, 30]} />
        <meshStandardMaterial color="#3a3a28" roughness={0.95} />
      </mesh>
      {/* Water surface */}
      <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <planeGeometry args={[5, 30]} />
        <meshStandardMaterial
          color="#2a6a7a"
          metalness={0.7}
          roughness={0.1}
          transparent
          opacity={0.75}
        />
      </mesh>
      {/* River rocks */}
      {Array.from({ length: 15 }, (_, i) => (
        <mesh
          key={i}
          position={[
            (Math.random() - 0.5) * 4,
            -0.05 + Math.random() * 0.1,
            (Math.random() - 0.5) * 20,
          ]}
        >
          <sphereGeometry args={[0.1 + Math.random() * 0.2, 5, 4]} />
          <meshStandardMaterial color="#5a5a4a" roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

// --- Sparse vegetation (small scrub) ---
function DesertScrub({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {Array.from({ length: 3 + Math.floor(Math.random() * 3) }, (_, i) => {
        const angle = (i / 5) * Math.PI * 2 + Math.random()
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 0.08, 0.12, Math.sin(angle) * 0.08]}
            rotation={[0.3, angle, 0.2]}
          >
            <cylinderGeometry args={[0.005, 0.01, 0.25, 3]} />
            <meshStandardMaterial color="#6a7a3a" roughness={0.8} />
          </mesh>
        )
      })}
      <mesh position={[0, 0.05, 0]}>
        <sphereGeometry args={[0.06, 5, 4]} />
        <meshStandardMaterial color="#5a6a2a" roughness={0.8} />
      </mesh>
    </group>
  )
}

// --- Canyon floor boulders ---
function CanyonBoulders() {
  const boulders = useMemo(() => {
    return Array.from({ length: 10 }, () => ({
      pos: [
        (Math.random() - 0.5) * 3,
        0.15 + Math.random() * 0.2,
        (Math.random() - 0.5) * 20,
      ] as [number, number, number],
      scale: [
        0.2 + Math.random() * 0.4,
        0.15 + Math.random() * 0.25,
        0.2 + Math.random() * 0.4,
      ] as [number, number, number],
    }))
  }, [])

  return (
    <group>
      {boulders.map((b, i) => (
        <mesh
          key={i}
          position={b.pos}
          scale={b.scale}
          rotation={[0, Math.random() * Math.PI, 0]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#8b6b4a" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}

// --- Dramatic light beams from above ---
function CanyonLightBeams() {
  const beams = useMemo(() => {
    return Array.from({ length: 5 }, () => ({
      x: (Math.random() - 0.5) * 4,
      z: (Math.random() - 0.5) * 15,
      tilt: (Math.random() - 0.5) * 0.2,
      width: 0.5 + Math.random() * 0.8,
    }))
  }, [])

  return (
    <group>
      {beams.map((b, i) => (
        <mesh key={i} position={[b.x, 6, b.z]} rotation={[0, 0, b.tilt]}>
          <cylinderGeometry args={[b.width * 0.3, b.width, 12, 6]} />
          <meshBasicMaterial
            color="#ffcc77"
            transparent
            opacity={0.04}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  )
}

// --- Dust / sand particles ---
const DUST_COUNT = 80
const dustDummy = new THREE.Object3D()

function DustParticles() {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(() => {
    return Array.from({ length: DUST_COUNT }, () => ({
      x: (Math.random() - 0.5) * 8,
      y: 0.5 + Math.random() * 8,
      z: (Math.random() - 0.5) * 20,
      speedX: 0.1 + Math.random() * 0.2,
      speedY: 0.02 + Math.random() * 0.05,
      phase: Math.random() * Math.PI * 2,
      scale: 0.01 + Math.random() * 0.02,
    }))
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < DUST_COUNT; i++) {
      const p = particles[i]
      dustDummy.position.set(
        p.x + Math.sin(t * p.speedX + p.phase) * 1.5,
        p.y + Math.sin(t * p.speedY + p.phase) * 0.5,
        p.z + Math.cos(t * p.speedX * 0.7 + p.phase) * 0.5,
      )
      dustDummy.scale.setScalar(p.scale)
      dustDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dustDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, DUST_COUNT]}>
      <sphereGeometry args={[1, 4, 4]} />
      <meshStandardMaterial color="#d4a56a" transparent opacity={0.3} />
    </instancedMesh>
  )
}

// --- Ledge vegetation ---
function LedgePlants() {
  const plants = useMemo(() => {
    const arr = []
    for (let i = 0; i < 10; i++) {
      const side = Math.random() > 0.5 ? 1 : -1
      arr.push({
        pos: [
          side * (3.2 + Math.random() * 0.5),
          1 + Math.random() * 6,
          (Math.random() - 0.5) * 18,
        ] as [number, number, number],
      })
    }
    return arr
  }, [])

  return (
    <group>
      {plants.map((p, i) => (
        <DesertScrub key={i} position={p.pos} />
      ))}
    </group>
  )
}

// --- Narrow sky strip visible from canyon ---
function CanyonSky() {
  return (
    <mesh position={[0, 12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 30]} />
      <meshBasicMaterial
        color="#cc8844"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#8a6040', 15, 50)
    scene.background = new THREE.Color('#c89060')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Main Scene ---
export default function CanyonRiver() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[0, 12, 2]} color="#ffcc88" intensity={1.2} />
      <ambientLight color="#664422" intensity={0.25} />
      <hemisphereLight args={['#ffcc88', '#553311', 0.3]} />
      <pointLight
        position={[0, 10, 0]}
        color="#ffaa55"
        intensity={0.5}
        distance={20}
      />

      <CanyonWall side="left" />
      <CanyonWall side="right" />
      <River />
      <CanyonBoulders />
      <CanyonLightBeams />
      <CanyonSky />
      <LedgePlants />
      <DustParticles />
    </>
  )
}
