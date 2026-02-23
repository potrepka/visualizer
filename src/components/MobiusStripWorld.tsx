import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

// --- Scene Setup ---
function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a0a2e', 10, 40)
    scene.background = new THREE.Color('#0d0520')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

// --- Tiny building on surface ---
function TinyBuilding({
  position,
  rotation,
  height,
  color,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  height: number
  color: string
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[0.12, height, 0.12]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, height + 0.04, 0]}>
        <coneGeometry args={[0.1, 0.08, 4]} />
        <meshStandardMaterial color="#8b4513" />
      </mesh>
    </group>
  )
}

// --- Tiny tree on surface ---
function TinyTree({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.01, 0.015, 0.12, 5]} />
        <meshStandardMaterial color="#5d3a1a" />
      </mesh>
      <mesh position={[0, 0.15, 0]}>
        <coneGeometry args={[0.06, 0.14, 6]} />
        <meshStandardMaterial color="#1b5e20" />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <coneGeometry args={[0.04, 0.1, 6]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>
    </group>
  )
}

// --- Möbius strip geometry builder ---
function useMobiusGeometry(segments: number, width: number, radius: number) {
  return useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices: number[] = []
    const normals: number[] = []
    const indices: number[] = []
    const strips = 20

    for (let i = 0; i <= segments; i++) {
      const u = (i / segments) * Math.PI * 2
      for (let j = 0; j <= strips; j++) {
        const v = (j / strips - 0.5) * width
        const halfTwist = u / 2

        const x = (radius + v * Math.cos(halfTwist)) * Math.cos(u)
        const y = (radius + v * Math.cos(halfTwist)) * Math.sin(u) * 0.3
        const z = v * Math.sin(halfTwist)

        vertices.push(x, z, y)

        const nx = Math.cos(halfTwist) * Math.cos(u)
        const ny = Math.sin(halfTwist)
        const nz = Math.cos(halfTwist) * Math.sin(u)
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
        normals.push(nx / len, ny / len, nz / len)
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < strips; j++) {
        const a = i * (strips + 1) + j
        const b = a + strips + 1
        const c = a + 1
        const d = b + 1
        indices.push(a, b, c, b, d, c)
      }
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(vertices, 3),
    )
    geometry.setAttribute(
      'normal',
      new THREE.Float32BufferAttribute(normals, 3),
    )
    geometry.setIndex(indices)
    geometry.computeVertexNormals()
    return geometry
  }, [segments, width, radius])
}

// --- Surface decorations ---
function SurfaceDecorations({ radius }: { radius: number; segments: number }) {
  const decorations = useMemo(() => {
    const items: {
      pos: [number, number, number]
      rot: [number, number, number]
      type: 'building' | 'tree'
      height?: number
      color?: string
    }[] = []
    const width = 1.2

    for (let i = 0; i < 60; i++) {
      const u = (i / 60) * Math.PI * 2
      const v = (Math.random() - 0.5) * width * 0.6
      const halfTwist = u / 2

      const x = (radius + v * Math.cos(halfTwist)) * Math.cos(u)
      const y = (radius + v * Math.cos(halfTwist)) * Math.sin(u) * 0.3
      const z = v * Math.sin(halfTwist)

      // Normal direction for orientation
      const nx = Math.cos(halfTwist) * Math.cos(u)
      const ny = Math.sin(halfTwist)
      const nz = Math.cos(halfTwist) * Math.sin(u)

      const up = new THREE.Vector3(nx, ny, nz).normalize()
      const quat = new THREE.Quaternion()
      quat.setFromUnitVectors(new THREE.Vector3(0, 1, 0), up)
      const euler = new THREE.Euler().setFromQuaternion(quat)

      const isBuilding = Math.random() > 0.5
      items.push({
        pos: [x, z, y],
        rot: [euler.x, euler.y, euler.z],
        type: isBuilding ? 'building' : 'tree',
        height: isBuilding ? 0.08 + Math.random() * 0.15 : undefined,
        color: isBuilding
          ? ['#e8d8c8', '#c4a882', '#a0785a', '#6699cc'][
              Math.floor(Math.random() * 4)
            ]
          : undefined,
      })
    }
    return items
  }, [radius])

  return (
    <group>
      {decorations.map((d, i) =>
        d.type === 'building' ? (
          <TinyBuilding
            key={i}
            position={d.pos}
            rotation={d.rot}
            height={d.height!}
            color={d.color!}
          />
        ) : (
          <TinyTree key={i} position={d.pos} rotation={d.rot} />
        ),
      )}
    </group>
  )
}

// --- Orbiting particles ---
const PARTICLE_COUNT = 200
const particleDummy = new THREE.Object3D()

function OrbitParticles({ radius }: { radius: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, () => ({
        angle: Math.random() * Math.PI * 2,
        dist: radius * 0.5 + Math.random() * radius * 1.2,
        y: (Math.random() - 0.5) * 4,
        speed: 0.05 + Math.random() * 0.15,
        phase: Math.random() * Math.PI * 2,
        scale: 0.01 + Math.random() * 0.03,
      })),
    [radius],
  )

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particles[i]
      const a = p.angle + t * p.speed
      particleDummy.position.set(
        Math.cos(a) * p.dist,
        p.y + Math.sin(t * 0.5 + p.phase) * 0.5,
        Math.sin(a) * p.dist,
      )
      particleDummy.scale.setScalar(
        p.scale * (0.5 + 0.5 * Math.sin(t + p.phase)),
      )
      particleDummy.updateMatrix()
      meshRef.current.setMatrixAt(i, particleDummy.matrix)
    }
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial
        color="#cc88ff"
        emissive="#9944dd"
        emissiveIntensity={2}
      />
    </instancedMesh>
  )
}

// --- Grid lines along the strip ---
function StripGridLines({ radius }: { radius: number }) {
  const ref = useRef<THREE.LineSegments>(null!)
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const points: number[] = []
    const width = 1.2
    const segments = 120

    // Longitudinal lines
    for (let j = 0; j <= 4; j++) {
      const v = (j / 4 - 0.5) * width
      for (let i = 0; i < segments; i++) {
        const u1 = (i / segments) * Math.PI * 2
        const u2 = ((i + 1) / segments) * Math.PI * 2
        for (const u of [u1, u2]) {
          const h = u / 2
          const x = (radius + v * Math.cos(h)) * Math.cos(u)
          const y = (radius + v * Math.cos(h)) * Math.sin(u) * 0.3
          const z = v * Math.sin(h)
          points.push(x, z + 0.01, y)
        }
      }
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(points, 3))
    return geo
  }, [radius])

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#6633aa" transparent opacity={0.3} />
    </lineSegments>
  )
}

// --- Main Scene ---
export default function MobiusStripWorld() {
  const groupRef = useRef<THREE.Group>(null!)
  const radius = 5
  const stripGeometry = useMobiusGeometry(120, 1.2, radius)

  useFrame(({ clock }) => {
    groupRef.current.rotation.y = clock.getElapsedTime() * 0.05
  })

  return (
    <>
      <SceneSetup />
      <ambientLight color="#221133" intensity={0.4} />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.2}
        color="#eeddff"
      />
      <pointLight
        position={[0, 5, 0]}
        color="#aa66ff"
        intensity={1}
        distance={20}
      />
      <pointLight
        position={[5, -3, 3]}
        color="#4488ff"
        intensity={0.6}
        distance={15}
      />

      <group ref={groupRef}>
        {/* Möbius strip surface */}
        <mesh geometry={stripGeometry}>
          <meshStandardMaterial
            color="#3a2255"
            side={THREE.DoubleSide}
            metalness={0.2}
            roughness={0.6}
          />
        </mesh>

        <StripGridLines radius={radius} />
        <SurfaceDecorations radius={radius} segments={120} />
        <OrbitParticles radius={radius} />
      </group>

      {/* Ambient stars */}
      {Array.from({ length: 40 }, (_, i) => {
        const theta = Math.random() * Math.PI * 2
        const phi = Math.random() * Math.PI
        const r = 18 + Math.random() * 10
        return (
          <mesh
            key={i}
            position={[
              r * Math.sin(phi) * Math.cos(theta),
              r * Math.cos(phi),
              r * Math.sin(phi) * Math.sin(theta),
            ]}
          >
            <sphereGeometry args={[0.05 + Math.random() * 0.08, 6, 6]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#aaaaff"
              emissiveIntensity={3}
            />
          </mesh>
        )
      })}
    </>
  )
}
