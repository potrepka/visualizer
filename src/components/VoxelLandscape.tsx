import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#87ceeb', 20, 50)
    scene.background = new THREE.Color('#87ceeb')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Block types ---
type BlockType =
  | 'grass'
  | 'dirt'
  | 'stone'
  | 'water'
  | 'sand'
  | 'wood'
  | 'leaves'
  | 'snow'

const BLOCK_COLORS: Record<BlockType, string> = {
  grass: '#4a8c3f',
  dirt: '#8b6d4a',
  stone: '#7a7a7a',
  water: '#3366aa',
  sand: '#d4c47a',
  wood: '#6b4226',
  leaves: '#2d7a1e',
  snow: '#f0f0ff',
}

// --- Instanced voxel layer ---
const voxelDummy = new THREE.Object3D()

function VoxelLayer({
  blocks,
}: {
  blocks: { x: number; y: number; z: number; type: BlockType }[]
}) {
  const grouped = useMemo(() => {
    const map: Record<BlockType, { x: number; y: number; z: number }[]> = {
      grass: [],
      dirt: [],
      stone: [],
      water: [],
      sand: [],
      wood: [],
      leaves: [],
      snow: [],
    }
    for (const b of blocks) {
      map[b.type].push(b)
    }
    return map
  }, [blocks])

  return (
    <group>
      {(Object.keys(grouped) as BlockType[]).map((type) => {
        const list = grouped[type]
        if (list.length === 0) return null
        return (
          <VoxelBatch
            key={type}
            positions={list}
            color={BLOCK_COLORS[type]}
            transparent={type === 'water'}
          />
        )
      })}
    </group>
  )
}

function VoxelBatch({
  positions,
  color,
  transparent,
}: {
  positions: { x: number; y: number; z: number }[]
  color: string
  transparent?: boolean
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  useEffect(() => {
    for (let i = 0; i < positions.length; i++) {
      voxelDummy.position.set(positions[i].x, positions[i].y, positions[i].z)
      voxelDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, voxelDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [positions])

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, positions.length]}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        transparent={transparent}
        opacity={transparent ? 0.6 : 1}
        roughness={0.9}
      />
    </instancedMesh>
  )
}

// --- Terrain generation ---
function useTerrainBlocks(size: number) {
  return useMemo(() => {
    const blocks: { x: number; y: number; z: number; type: BlockType }[] = []
    const halfSize = size / 2

    // Simple heightmap
    const getHeight = (x: number, z: number): number => {
      const nx = x / size
      const nz = z / size
      let h = Math.sin(nx * Math.PI * 2) * Math.cos(nz * Math.PI * 2) * 3
      h += Math.sin(nx * Math.PI * 4 + 1) * Math.sin(nz * Math.PI * 3) * 2
      h += Math.cos(nx * Math.PI * 6) * Math.sin(nz * Math.PI * 5 + 2) * 1
      return Math.floor(h + 3)
    }

    const waterLevel = 2

    for (let x = -halfSize; x < halfSize; x++) {
      for (let z = -halfSize; z < halfSize; z++) {
        const height = getHeight(x, z)
        const maxY = Math.max(height, waterLevel)

        for (let y = 0; y <= maxY; y++) {
          if (y <= height) {
            let type: BlockType = 'dirt'
            if (y === height && height > waterLevel + 2) {
              type = 'snow'
            } else if (y === height && height > waterLevel) {
              type = 'grass'
            } else if (y === height && height === waterLevel) {
              type = 'sand'
            } else if (y < height - 2) {
              type = 'stone'
            }
            blocks.push({ x, y, z, type })
          } else if (y <= waterLevel && height < waterLevel) {
            if (y === waterLevel) {
              blocks.push({ x, y, z, type: 'water' })
            }
          }
        }
        // Sand at water edges
        if (height === waterLevel - 1 || height === waterLevel) {
          if (height <= waterLevel) {
            const idx = blocks.findIndex(
              (b) => b.x === x && b.z === z && b.y === height,
            )
            if (idx !== -1) blocks[idx].type = 'sand'
          }
        }
      }
    }
    return blocks
  }, [size])
}

// --- Voxel tree ---
function VoxelTree({ position }: { position: [number, number, number] }) {
  const blocks = useMemo(() => {
    const b: { x: number; y: number; z: number; type: BlockType }[] = []
    // Trunk
    for (let y = 0; y < 4; y++) {
      b.push({ x: 0, y, z: 0, type: 'wood' })
    }
    // Leaves
    for (let dx = -2; dx <= 2; dx++) {
      for (let dz = -2; dz <= 2; dz++) {
        for (let dy = 3; dy <= 5; dy++) {
          if (Math.abs(dx) + Math.abs(dz) + Math.abs(dy - 4) <= 3) {
            if (dx === 0 && dz === 0 && dy < 4) continue
            b.push({ x: dx, y: dy, z: dz, type: 'leaves' })
          }
        }
      }
    }
    return b
  }, [])

  return (
    <group position={position}>
      <VoxelLayer blocks={blocks} />
    </group>
  )
}

// --- Cloud ---
function VoxelCloud({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null!)
  const phase = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    ref.current.position.x =
      position[0] + Math.sin(clock.getElapsedTime() * 0.1 + phase) * 2
  })

  const blocks = useMemo(() => {
    const b: { x: number; y: number; z: number }[] = []
    const w = 2 + Math.floor(Math.random() * 3)
    const d = 1 + Math.floor(Math.random() * 2)
    for (let x = 0; x < w; x++) {
      for (let z = 0; z < d; z++) {
        b.push({ x, y: 0, z })
        if (Math.random() > 0.4) b.push({ x, y: 1, z })
      }
    }
    return b
  }, [])

  return (
    <group ref={ref} position={position}>
      {blocks.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, b.z]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  )
}

// --- Sun ---
function VoxelSun() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 1.5 + 0.5 * Math.sin(clock.getElapsedTime() * 0.5)
  })

  return (
    <mesh ref={ref} position={[20, 18, -15]}>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial
        color="#ffdd44"
        emissive="#ffaa00"
        emissiveIntensity={1.5}
      />
    </mesh>
  )
}

// --- Main Scene ---
export default function VoxelLandscape() {
  const terrainBlocks = useTerrainBlocks(20)

  const treePositions = useMemo(() => {
    const positions: [number, number, number][] = []
    const size = 20
    const halfSize = size / 2

    const getHeight = (x: number, z: number): number => {
      const nx = x / size
      const nz = z / size
      let h = Math.sin(nx * Math.PI * 2) * Math.cos(nz * Math.PI * 2) * 3
      h += Math.sin(nx * Math.PI * 4 + 1) * Math.sin(nz * Math.PI * 3) * 2
      h += Math.cos(nx * Math.PI * 6) * Math.sin(nz * Math.PI * 5 + 2) * 1
      return Math.floor(h + 3)
    }

    for (let i = 0; i < 15; i++) {
      const x = Math.floor(Math.random() * size) - halfSize
      const z = Math.floor(Math.random() * size) - halfSize
      const h = getHeight(x, z)
      if (h > 3 && h < 6) {
        positions.push([x, h + 1, z])
      }
    }
    return positions
  }, [])

  return (
    <>
      <SceneSetup />
      <ambientLight intensity={0.5} color="#aaccff" />
      <directionalLight
        position={[15, 20, -10]}
        intensity={1.2}
        color="#fff5dd"
        castShadow
      />
      <directionalLight
        position={[-10, 10, 5]}
        intensity={0.3}
        color="#aaddff"
      />

      <VoxelLayer blocks={terrainBlocks} />

      {treePositions.map((pos, i) => (
        <VoxelTree key={i} position={pos} />
      ))}

      {Array.from({ length: 5 }, (_, i) => (
        <VoxelCloud
          key={i}
          position={[
            (Math.random() - 0.5) * 30,
            12 + Math.random() * 5,
            (Math.random() - 0.5) * 30,
          ]}
        />
      ))}

      <VoxelSun />
    </>
  )
}
