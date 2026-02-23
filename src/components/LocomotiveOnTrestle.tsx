import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#7a8fa0', 20, 70)
    scene.background = new THREE.Color('#8aa0b0')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Locomotive({ position }: { position: [number, number, number] }) {
  const steamRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const steamCount = 25
  const steamData = useMemo(() => {
    const arr: { phase: number; speed: number; drift: number }[] = []
    for (let i = 0; i < steamCount; i++) {
      arr.push({
        phase: Math.random() * Math.PI * 2,
        speed: 1 + Math.random() * 1.5,
        drift: (Math.random() - 0.5) * 0.5,
      })
    }
    return arr
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    for (let i = 0; i < steamCount; i++) {
      const s = steamData[i]
      const life = ((t * s.speed + s.phase) % 3) / 3
      dummy.position.set(
        -2.5 + s.drift * life * 2,
        2.8 + life * 3,
        position[2] + s.drift * life,
      )
      dummy.scale.setScalar(0.15 + life * 0.6)
      dummy.updateMatrix()
      steamRef.current.setMatrixAt(i, dummy.matrix)
    }
    steamRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <group position={position}>
      {/* Boiler - main cylinder */}
      <mesh position={[-1, 1.8, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.8, 0.8, 3.5, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Cab / body box */}
      <mesh position={[1.2, 1.8, 0]}>
        <boxGeometry args={[1.8, 2.0, 1.8]} />
        <meshStandardMaterial color="#8b1a1a" roughness={0.5} metalness={0.3} />
      </mesh>
      {/* Cab roof */}
      <mesh position={[1.2, 2.95, 0]}>
        <boxGeometry args={[2.0, 0.1, 2.0]} />
        <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Smokestack */}
      <mesh position={[-2.2, 2.9, 0]}>
        <cylinderGeometry args={[0.2, 0.15, 0.8, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[-2.2, 3.4, 0]}>
        <cylinderGeometry args={[0.3, 0.2, 0.2, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Headlight */}
      <mesh position={[-2.8, 2.2, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial
          color="#ffee88"
          emissive="#ffcc44"
          emissiveIntensity={2}
        />
      </mesh>
      {/* Cowcatcher */}
      <mesh position={[-3.2, 0.8, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.8, 0.1, 1.4]} />
        <meshStandardMaterial color="#333333" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Chassis */}
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[5.5, 0.3, 1.6]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.5} metalness={0.5} />
      </mesh>
      {/* Wheels */}
      {[-2.0, -0.5, 1.0].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0.35, 0.9]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.1, 12]} />
            <meshStandardMaterial
              color="#333333"
              roughness={0.4}
              metalness={0.7}
            />
          </mesh>
          <mesh position={[x, 0.35, -0.9]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.35, 0.35, 0.1, 12]} />
            <meshStandardMaterial
              color="#333333"
              roughness={0.4}
              metalness={0.7}
            />
          </mesh>
        </group>
      ))}
      {/* Steam particles */}
      <instancedMesh ref={steamRef} args={[undefined, undefined, steamCount]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color="#cccccc" transparent opacity={0.25} />
      </instancedMesh>
    </group>
  )
}

function TrestleBridge() {
  const spanLength = 30
  const maxHeight = 15
  const bentCount = 12

  const bents = useMemo(() => {
    const arr: { x: number; height: number }[] = []
    for (let i = 0; i < bentCount; i++) {
      const t = i / (bentCount - 1)
      const x = t * spanLength - spanLength / 2
      const valley = Math.sin(t * Math.PI)
      const height = 2 + valley * maxHeight
      arr.push({ x, height })
    }
    return arr
  }, [])

  return (
    <group>
      {/* Deck / rails */}
      <mesh position={[0, maxHeight + 2.2, 0]}>
        <boxGeometry args={[spanLength + 2, 0.15, 2.2]} />
        <meshStandardMaterial color="#5a4030" roughness={0.85} />
      </mesh>
      {/* Rails */}
      {[-0.7, 0.7].map((z, i) => (
        <mesh key={i} position={[0, maxHeight + 2.35, z]}>
          <boxGeometry args={[spanLength + 2, 0.08, 0.06]} />
          <meshStandardMaterial
            color="#666666"
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
      ))}
      {/* Rail ties */}
      {Array.from({ length: 40 }).map((_, i) => {
        const x = (i / 39) * spanLength - spanLength / 2
        return (
          <mesh key={i} position={[x, maxHeight + 2.28, 0]}>
            <boxGeometry args={[0.2, 0.08, 2.2]} />
            <meshStandardMaterial color="#5a4030" roughness={0.9} />
          </mesh>
        )
      })}
      {/* Trestle bents (vertical supports) */}
      {bents.map((bent, i) => (
        <group key={i}>
          {/* Main vertical posts */}
          {[-0.8, 0.8].map((z, j) => (
            <mesh
              key={j}
              position={[bent.x, maxHeight + 2 - bent.height / 2, z]}
            >
              <boxGeometry args={[0.2, bent.height, 0.2]} />
              <meshStandardMaterial color="#6b5035" roughness={0.85} />
            </mesh>
          ))}
          {/* Cross braces */}
          {bent.height > 3 && (
            <>
              <mesh
                position={[bent.x, maxHeight + 2 - bent.height * 0.3, 0]}
                rotation={[Math.PI / 4, 0, 0]}
              >
                <boxGeometry args={[0.1, 2.4, 0.1]} />
                <meshStandardMaterial color="#6b5035" roughness={0.85} />
              </mesh>
              <mesh
                position={[bent.x, maxHeight + 2 - bent.height * 0.6, 0]}
                rotation={[-Math.PI / 4, 0, 0]}
              >
                <boxGeometry args={[0.1, 2.4, 0.1]} />
                <meshStandardMaterial color="#6b5035" roughness={0.85} />
              </mesh>
            </>
          )}
          {/* Horizontal braces */}
          {bent.height > 5 && (
            <mesh position={[bent.x, maxHeight + 2 - bent.height * 0.5, 0]}>
              <boxGeometry args={[0.12, 0.12, 1.8]} />
              <meshStandardMaterial color="#6b5035" roughness={0.85} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

function MountainValley() {
  return (
    <group>
      {/* Valley floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#3a5a2a" roughness={0.95} />
      </mesh>
      {/* River */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[4, 50]} />
        <meshStandardMaterial color="#4a7a9a" roughness={0.1} metalness={0.3} />
      </mesh>
      {/* Mountains */}
      {[
        { pos: [-20, 0, -18] as [number, number, number], h: 20, w: 10 },
        { pos: [18, 0, -20] as [number, number, number], h: 22, w: 11 },
        { pos: [-10, 0, -22] as [number, number, number], h: 18, w: 9 },
        { pos: [8, 0, -25] as [number, number, number], h: 25, w: 12 },
        { pos: [25, 0, -15] as [number, number, number], h: 16, w: 8 },
        { pos: [-25, 0, -15] as [number, number, number], h: 15, w: 9 },
      ].map((m, i) => (
        <group key={i} position={m.pos}>
          <mesh position={[0, m.h / 2, 0]}>
            <coneGeometry args={[m.w, m.h, 6]} />
            <meshStandardMaterial color="#5a6a50" roughness={0.95} />
          </mesh>
          <mesh position={[0, m.h * 0.75, 0]}>
            <coneGeometry args={[m.w * 0.35, m.h * 0.3, 6]} />
            <meshStandardMaterial color="#e8e8e8" roughness={0.8} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function PineTrees() {
  const count = 50
  const meshRef = useRef<THREE.InstancedMesh>(null!)
  const trunkRef = useRef<THREE.InstancedMesh>(null!)
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const trees = useMemo(() => {
    const arr: { x: number; z: number; h: number; s: number }[] = []
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 40
      const z = (Math.random() - 0.5) * 30
      if (Math.abs(x) < 4 && Math.abs(z) < 3) continue
      arr.push({
        x,
        z,
        h: 1.5 + Math.random() * 2,
        s: 0.5 + Math.random() * 0.5,
      })
    }
    return arr
  }, [])

  useEffect(() => {
    trees.forEach((t, i) => {
      if (i >= count) return
      dummy.position.set(t.x, t.h + 0.5, t.z)
      dummy.scale.set(t.s, t.h, t.s)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)

      dummy.position.set(t.x, t.h * 0.3, t.z)
      dummy.scale.set(0.1, t.h * 0.6, 0.1)
      dummy.updateMatrix()
      trunkRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
    trunkRef.current.instanceMatrix.needsUpdate = true
  }, [trees, dummy])

  return (
    <>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <coneGeometry args={[1, 1, 6]} />
        <meshStandardMaterial color="#2a5a1a" roughness={0.9} />
      </instancedMesh>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[1, 1, 1, 5]} />
        <meshStandardMaterial color="#5a3a1e" roughness={0.9} />
      </instancedMesh>
    </>
  )
}

export default function LocomotiveOnTrestle() {
  return (
    <>
      <SceneSetup />
      <directionalLight
        position={[10, 15, 8]}
        intensity={1.0}
        color="#ffe8cc"
      />
      <ambientLight intensity={0.2} color="#88aacc" />
      <hemisphereLight args={['#8aa0b0', '#3a5a2a', 0.3]} />

      <MountainValley />
      <TrestleBridge />
      <Locomotive position={[-2, 17.2, 0]} />
      <PineTrees />
    </>
  )
}
