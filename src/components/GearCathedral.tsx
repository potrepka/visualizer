import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'

function SceneSetup() {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.fog = new THREE.Fog('#1a1008', 10, 50)
    scene.background = new THREE.Color('#0e0a04')
    return () => {
      scene.fog = null
      scene.background = null
    }
  }, [scene])
  return null
}

function Gear({
  position,
  radius,
  speed,
  direction = 1,
  tubeRadius = 0.12,
  color = '#b08030',
}: {
  position: [number, number, number]
  radius: number
  speed: number
  direction?: number
  tubeRadius?: number
  color?: string
}) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    groupRef.current.rotation.z = clock.getElapsedTime() * speed * direction
  })

  const teeth = useMemo(() => {
    const arr: { angle: number }[] = []
    const count = Math.max(8, Math.floor(radius * 6))
    for (let i = 0; i < count; i++) {
      arr.push({ angle: (i / count) * Math.PI * 2 })
    }
    return arr
  }, [radius])

  return (
    <group position={position}>
      <group ref={groupRef}>
        {/* Main ring */}
        <mesh>
          <torusGeometry args={[radius, tubeRadius, 8, 32]} />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Hub */}
        <mesh>
          <cylinderGeometry
            args={[radius * 0.15, radius * 0.15, tubeRadius * 3, 12]}
          />
          <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Spokes */}
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, (i / 4) * Math.PI * 2]}>
            <boxGeometry args={[0.04, tubeRadius * 2.5, radius * 0.85]} />
            <meshStandardMaterial
              color={color}
              metalness={0.7}
              roughness={0.35}
            />
          </mesh>
        ))}
        {/* Teeth */}
        {teeth.map((t, i) => (
          <mesh
            key={i}
            position={[
              Math.cos(t.angle) * (radius + tubeRadius * 1.5),
              0,
              Math.sin(t.angle) * (radius + tubeRadius * 1.5),
            ]}
            rotation={[Math.PI / 2, 0, t.angle]}
          >
            <boxGeometry
              args={[tubeRadius * 1.5, tubeRadius * 2, tubeRadius * 1.2]}
            />
            <meshStandardMaterial
              color={color}
              metalness={0.8}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function GothicArch({
  position,
  height = 8,
  width = 3,
}: {
  position: [number, number, number]
  height?: number
  width?: number
}) {
  return (
    <group position={position}>
      {/* Left pillar */}
      <mesh position={[-width / 2, height / 2, 0]}>
        <boxGeometry args={[0.6, height, 0.6]} />
        <meshStandardMaterial color="#3a2a18" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Right pillar */}
      <mesh position={[width / 2, height / 2, 0]}>
        <boxGeometry args={[0.6, height, 0.6]} />
        <meshStandardMaterial color="#3a2a18" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Arch top */}
      <mesh position={[0, height, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[width / 2, 0.3, 6, 16, Math.PI]} />
        <meshStandardMaterial color="#3a2a18" metalness={0.5} roughness={0.6} />
      </mesh>
      {/* Pillar caps */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[(side * width) / 2, height + 0.5, 0]}>
          <coneGeometry args={[0.5, 1, 4]} />
          <meshStandardMaterial
            color="#4a3a20"
            metalness={0.6}
            roughness={0.4}
          />
        </mesh>
      ))}
    </group>
  )
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[30, 40]} />
      <meshStandardMaterial color="#1a1208" metalness={0.3} roughness={0.7} />
    </mesh>
  )
}

function Ceiling() {
  return (
    <group>
      {/* Vaulted ceiling segments */}
      {[-6, 0, 6].map((z, i) => (
        <mesh key={i} position={[0, 14, z]} rotation={[0, 0, 0]}>
          <sphereGeometry args={[8, 12, 8, 0, Math.PI * 2, 0, Math.PI / 3]} />
          <meshStandardMaterial
            color="#2a1a0a"
            metalness={0.4}
            roughness={0.6}
            side={THREE.BackSide}
          />
        </mesh>
      ))}
    </group>
  )
}

function GearWall({
  position,
  rotation = [0, 0, 0],
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
}) {
  const gears = useMemo(() => {
    const arr: {
      pos: [number, number, number]
      r: number
      spd: number
      dir: number
      col: string
    }[] = []
    const colors = ['#b08030', '#c09040', '#907020', '#a07828', '#d0a050']
    for (let i = 0; i < 12; i++) {
      const r = 0.5 + Math.random() * 1.5
      arr.push({
        pos: [
          (Math.random() - 0.5) * 8,
          1 + Math.random() * 10,
          (Math.random() - 0.5) * 0.5,
        ],
        r,
        spd: (0.3 + Math.random() * 0.6) / r,
        dir: Math.random() > 0.5 ? 1 : -1,
        col: colors[Math.floor(Math.random() * colors.length)],
      })
    }
    return arr
  }, [])

  return (
    <group position={position} rotation={rotation}>
      {gears.map((g, i) => (
        <Gear
          key={i}
          position={g.pos}
          radius={g.r}
          speed={g.spd}
          direction={g.dir}
          color={g.col}
        />
      ))}
    </group>
  )
}

function CentralMechanism() {
  const mainRef = useRef<THREE.Group>(null!)

  useFrame(({ clock }) => {
    mainRef.current.rotation.y = clock.getElapsedTime() * 0.1
  })

  return (
    <group position={[0, 6, 0]}>
      <group ref={mainRef}>
        <Gear
          position={[0, 0, 0]}
          radius={3}
          speed={0.2}
          direction={1}
          tubeRadius={0.2}
          color="#c09040"
        />
        <Gear
          position={[0, 0.5, 0]}
          radius={2}
          speed={-0.3}
          direction={-1}
          tubeRadius={0.15}
          color="#a07828"
        />
        <Gear
          position={[0, -0.5, 0]}
          radius={2.5}
          speed={0.24}
          direction={1}
          tubeRadius={0.18}
          color="#b08838"
        />
      </group>
      {/* Central shaft */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 6, 12]} />
        <meshStandardMaterial
          color="#907030"
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>
    </group>
  )
}

function BrassLantern({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.4, 0.6, 0.4]} />
        <meshStandardMaterial color="#c0a050" metalness={0.7} roughness={0.3} />
      </mesh>
      <pointLight color="#ffaa40" intensity={2} distance={8} />
      <mesh position={[0, 0.4, 0]}>
        <coneGeometry args={[0.3, 0.3, 4]} />
        <meshStandardMaterial color="#b09040" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}

export default function GearCathedral() {
  return (
    <>
      <SceneSetup />
      <directionalLight position={[0, 15, 5]} intensity={0.4} color="#ffa850" />
      <ambientLight intensity={0.08} color="#604020" />

      <Floor />
      <Ceiling />
      <CentralMechanism />

      {/* Gothic arches */}
      {[-8, 8].map((x) =>
        [-10, -4, 2, 8].map((z, i) => (
          <GothicArch
            key={`${x}-${i}`}
            position={[x, 0, z]}
            height={12}
            width={4}
          />
        )),
      )}

      {/* Gear walls */}
      <GearWall position={[-10, 0, 0]} rotation={[0, Math.PI / 2, 0]} />
      <GearWall position={[10, 0, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <GearWall position={[0, 0, -14]} />

      {/* Side gears */}
      <Gear
        position={[-5, 3, -12]}
        radius={1.8}
        speed={0.35}
        direction={1}
        color="#c09848"
      />
      <Gear
        position={[5, 4, -12]}
        radius={1.5}
        speed={-0.42}
        direction={-1}
        color="#a08030"
      />
      <Gear
        position={[-5, 8, -12]}
        radius={1.2}
        speed={0.52}
        direction={1}
        color="#b09040"
      />
      <Gear
        position={[5, 9, -12]}
        radius={2}
        speed={-0.26}
        direction={-1}
        color="#c0a050"
      />

      {/* Lanterns */}
      <BrassLantern position={[-6, 4, -3]} />
      <BrassLantern position={[6, 4, -3]} />
      <BrassLantern position={[-6, 4, 5]} />
      <BrassLantern position={[6, 4, 5]} />
      <BrassLantern position={[0, 10, -12]} />
    </>
  )
}
