import { useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import Base from './Base.jsx'
import Tower from './Tower.jsx'

const DESKTOP_CAMERA = { position: [8.6, 6.5, 10.5], target: [0, 0.8, 0], fov: 39 }
const MOBILE_CAMERA = { position: [0, 6.4, 14.8], target: [0, 0.9, 0], fov: 42 }

function ResponsiveCamera({ compact }) {
  const { camera } = useThree()

  useEffect(() => {
    const setup = compact ? MOBILE_CAMERA : DESKTOP_CAMERA
    camera.position.set(...setup.position)
    camera.fov = setup.fov
    camera.updateProjectionMatrix()
    camera.lookAt(...setup.target)
  }, [camera, compact])

  return null
}

export default function HanoiScene(props) {
  return (
    <Canvas shadows dpr={props.isMobile ? [1, 1.35] : [1, 1.75]} camera={{ position: DESKTOP_CAMERA.position, fov: DESKTOP_CAMERA.fov, near: 0.1, far: 100 }} gl={{ antialias: true }}>
      <ResponsiveCamera compact={props.isMobileLandscape} />
      <color attach="background" args={['#07100e']} /><fog attach="fog" args={['#07100e', 17, 27]} />
      <ambientLight intensity={0.65} />
      <directionalLight castShadow position={[3, 9, 5]} intensity={2.1} color="#fff2d6" shadow-mapSize={[1024, 1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={7} shadow-camera-bottom={-4} />
      <pointLight position={[-7, 4, -2]} intensity={17} distance={13} color="#4ed6a8" />
      <group position={[0, -1.05, 0]}>
        <Base />
        {props.towers.map((disks, towerIndex) => (
          <Tower
            key={towerIndex}
            towerIndex={towerIndex}
            disks={disks}
            totalDisks={props.diskCount}
            selected={props.selectedTower === towerIndex}
            validDestination={props.validDestinations[towerIndex]}
            invalidFeedback={props.invalidFeedback}
            completed={props.won && towerIndex === 2}
            interactionDisabled={Boolean(props.animation) || props.won}
            animation={props.animation}
            onClick={props.onTowerClick}
            onAnimationComplete={props.onAnimationComplete}
          />
        ))}
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.36, 0]} receiveShadow><planeGeometry args={[80, 80]} /><meshStandardMaterial color="#07100e" roughness={0.9} /></mesh>
      <ContactShadows position={[0, -1.34, 0]} opacity={0.58} scale={18} blur={2.6} far={8} />
      <Environment preset="warehouse" environmentIntensity={0.23} />
      <OrbitControls enabled={!props.isMobile} makeDefault enablePan={false} enableZoom={!props.isMobile} enableRotate={!props.isMobile} minDistance={11} maxDistance={20} minPolarAngle={Math.PI / 4.2} maxPolarAngle={Math.PI / 2.15} minAzimuthAngle={-Math.PI / 4} maxAzimuthAngle={Math.PI / 4} target={props.isMobile ? MOBILE_CAMERA.target : DESKTOP_CAMERA.target} />
    </Canvas>
  )
}
