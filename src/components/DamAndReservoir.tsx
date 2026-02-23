import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#88aabb', 25, 75)
    scene.background = new THREE.Color('#99bbcc')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function DamWall() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main dam wall - slightly curved using multiple segments */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = ((i - 5.5) / 11) * 0.6
        const x = Math.sin(angle) * 20
        const z = Math.cos(angle) * 20 - 20
        const segWidth = 3.5
        return (
          <mesh key={i} position={[x, 6, z]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[segWidth, 14, 2.5]} />
            <meshStandardMaterial color="#b8b0a0" roughness={0.8} />
          </mesh>
        )
      })}
      {/* Dam crest / roadway on top */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = ((i - 5.5) / 11) * 0.6
        const x = Math.sin(angle) * 20
        const z = Math.cos(angle) * 20 - 20
        return (
          <mesh key={i} position={[x, 13.3, z]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[3.5, 0.4, 3.5]} />
            <meshStandardMaterial color="#999088" roughness={0.7} />
          </mesh>
        )
      })}
      {/* Guard rails along crest */}
      {[-1, 1].map((side) => (
        <group key={side}>
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = ((i - 5.5) / 11) * 0.6
            const x = Math.sin(angle) * 20
            const z = Math.cos(angle) * 20 - 20 + side * 1.5
            return (
              <mesh key={i} position={[x, 14, z]}>
                <boxGeometry args={[3.5, 1, 0.1]} />
                <meshStandardMaterial color="#aaa898" roughness={0.75} />
              </mesh>
            )
          })}
        </group>
      ))}
      {/* Buttresses on downstream face */}
      {[-8, -3, 2, 7].map((xOff, i) => {
        const angle = (xOff / 20) * 0.6
        const x = Math.sin(angle) * 19
        const z = Math.cos(angle) * 19 - 20 + 2
        return (
          <mesh key={i} position={[x, 4, z]} rotation={[0, -angle, 0]}>
            <boxGeometry args={[1.5, 10, 1.5]} />
            <meshStandardMaterial color="#a8a090" roughness={0.85} />
          </mesh>
        )
      })}
    </group>
  )
}

function Reservoir() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.position.y = 11.5 + Math.sin(t * 0.3) * 0.05
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, 11.5, -18]}>
      <planeGeometry args={[40, 30]} />
      <meshStandardMaterial
        color="#3a6a8a"
        roughness={0.1}
        metalness={0.4}
        transparent
        opacity={0.85}
      />
    </mesh>
  )
}

function RiverBelow() {
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    const mat = ref.current.material as THREE.MeshStandardMaterial
    mat.emissiveIntensity = 0.05 + Math.sin(t * 2) * 0.03
  })

  return (
    <mesh ref={ref} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 12]}>
      <planeGeometry args={[5, 25]} />
      <meshStandardMaterial
        color="#4a7a9a"
        emissive="#2a5a7a"
        emissiveIntensity={0.05}
        roughness={0.1}
        metalness={0.3}
      />
    </mesh>
  )
}

function PowerStation() {
  return (
    <group position={[8, -1, 5]}>
      {/* Main building */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[6, 4, 4]} />
        <meshStandardMaterial color="#888880" roughness={0.7} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, 4.15, 0]}>
        <boxGeometry args={[6.5, 0.3, 4.5]} />
        <meshStandardMaterial color="#777770" roughness={0.6} />
      </mesh>
      {/* Transformer units */}
      {[-1.5, 0, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 1.5, 2.5]}>
          <boxGeometry args={[1, 2.5, 1.5]} />
          <meshStandardMaterial
            color="#555550"
            roughness={0.5}
            metalness={0.4}
          />
        </mesh>
      ))}
      {/* Power lines out */}
      {[-1, 1].map((side, i) => (
        <group key={i}>
          <mesh position={[side * 5, 5, 5]}>
            <boxGeometry args={[0.3, 10, 0.3]} />
            <meshStandardMaterial
              color="#666666"
              roughness={0.5}
              metalness={0.5}
            />
          </mesh>
          {/* Cross arm */}
          <mesh position={[side * 5, 9.5, 5]}>
            <boxGeometry args={[3, 0.15, 0.15]} />
            <meshStandardMaterial
              color="#666666"
              roughness={0.5}
              metalness={0.5}
            />
          </mesh>
        </group>
      ))}
      {/* Outflow pipes */}
      {[-1.5, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 0.5, -2.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 1.5, 8]} />
          <meshStandardMaterial
            color="#444444"
            roughness={0.4}
            metalness={0.6}
          />
        </mesh>
      ))}
    </group>
  )
}

function Mountains() {
  const peaks = useMemo(
    () => [
      { pos: [-20, 0, -30] as [number, number, number], h: 22, w: 10 },
      { pos: [20, 0, -28] as [number, number, number], h: 20, w: 9 },
      { pos: [-10, 0, -35] as [number, number, number], h: 25, w: 12 },
      { pos: [10, 0, -32] as [number, number, number], h: 18, w: 8 },
      { pos: [-25, 0, -20] as [number, number, number], h: 16, w: 10 },
      { pos: [25, 0, -22] as [number, number, number], h: 17, w: 9 },
      { pos: [-18, 0, 5] as [number, number, number], h: 12, w: 7 },
      { pos: [18, 0, 8] as [number, number, number], h: 10, w: 6 },
    ],
    [],
  )

  return (
    <>
      {peaks.map((m, i) => (
        <group key={i} position={m.pos}>
          <mesh position={[0, m.h / 2, 0]}>
            <coneGeometry args={[m.w, m.h, 6]} />
            <meshStandardMaterial color="#5a6a55" roughness={0.95} />
          </mesh>
          <mesh position={[0, m.h * 0.72, 0]}>
            <coneGeometry args={[m.w * 0.35, m.h * 0.32, 6]} />
            <meshStandardMaterial color="#e0e4e8" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </>
  )
}

function ValleyFloor() {
  return (
    <>
      {/* Downstream terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 10]}>
        <planeGeometry args={[50, 30]} />
        <meshStandardMaterial color="#4a6a3a" roughness={0.95} />
      </mesh>
      {/* Canyon walls */}
      <mesh position={[-12, 3, 8]}>
        <boxGeometry args={[4, 12, 20]} />
        <meshStandardMaterial color="#7a7a6a" roughness={0.9} />
      </mesh>
      <mesh position={[12, 3, 8]}>
        <boxGeometry args={[4, 12, 20]} />
        <meshStandardMaterial color="#7a7a6a" roughness={0.9} />
      </mesh>
    </>
  )
}

function Spillway() {
  const foamRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const foamCount = 30

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < foamCount; i++) {
      const life = ((t * 2 + i * 0.3) % 3) / 3
      dummy.position.set(
        -5 + (Math.random() - 0.5) * 2,
        -1 + life * 2,
        2 + life * 4,
      )
      dummy.scale.setScalar(0.15 + life * 0.2)
      dummy.updateMatrix()
      foamRef.current.setMatrixAt(i, dummy.matrix)
    }
    foamRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group position={[-5, 0, 2]}>
      {/* Spillway chute */}
      <mesh position={[0, 3, 0]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[3, 0.3, 8]} />
        <meshStandardMaterial color="#a0a090" roughness={0.6} />
      </mesh>
      {/* Water on spillway */}
      <mesh position={[0, 3.3, 0]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[2.5, 0.2, 8]} />
        <meshStandardMaterial
          color="#5a9aba"
          transparent
          opacity={0.6}
          roughness={0.05}
        />
      </mesh>
      {/* Foam at base */}
      <instancedMesh ref={foamRef} args={[undefined, undefined, foamCount]}>
        <sphereGeometry args={[1, 5, 5]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.5} />
      </instancedMesh>
    </group>
  )
}

export default function DamAndReservoir() {
  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.0}
        color="#ffe8cc"
      />
      <ambientLight intensity={0.25} color="#88aacc" />
      <hemisphereLight args={['#99bbcc', '#4a6a3a', 0.3]} />

      <ValleyFloor />
      <Mountains />
      <DamWall />
      <Reservoir />
      <RiverBelow />
      <PowerStation />
      <Spillway />
    </>
  )
}
