import { useEffect, useState } from 'react'
import Disk from './Disk.jsx'
import { TOWER_X } from './sceneConstants.js'

export default function Tower({ towerIndex, disks, totalDisks, selected, validDestination, invalidFeedback, completed, interactionDisabled, animation, onClick, onAnimationComplete }) {
  const [hovered, setHovered] = useState(false)
  const isHovered = hovered && !interactionDisabled
  const accentColor = completed ? '#70d6aa' : validDestination ? '#7fcaa2' : '#d3a15f'
  const pillarColor = completed ? '#c49b64' : isHovered ? '#c9955e' : '#bc8651'

  useEffect(() => {
    document.body.style.cursor = isHovered ? 'pointer' : 'default'
    return () => { document.body.style.cursor = 'default' }
  }, [isHovered])

  return (
    <group>
      <mesh position={[TOWER_X[towerIndex], 1.9, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.12, 0.16, 3.65, 32]} />
        <meshStandardMaterial color={pillarColor} emissive={completed ? '#347c61' : isHovered ? '#67441f' : '#000000'} emissiveIntensity={completed ? 0.24 : isHovered ? 0.14 : 0} roughness={0.36} />
      </mesh>
      {(validDestination || isHovered || completed) && (
        <mesh position={[TOWER_X[towerIndex], 0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.28, 1.39, 64]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={completed ? 0.45 : 0.22} transparent opacity={completed ? 0.72 : 0.5} depthWrite={false} />
        </mesh>
      )}
      <mesh
        position={[TOWER_X[towerIndex], 2.25, 0]}
        onClick={(event) => { event.stopPropagation(); if (!interactionDisabled) onClick(towerIndex) }}
        onPointerOver={(event) => { event.stopPropagation(); if (!interactionDisabled) setHovered(true) }}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[1.55, 1.55, 5.2, 24]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>
      {disks.map((disk, level) => {
        const isMoving = animation?.disk === disk && animation.from === towerIndex
        const isTopDisk = level === disks.length - 1
        const invalidSignal = selected && isTopDisk && invalidFeedback?.source === towerIndex ? invalidFeedback : null
        return <Disk key={disk} size={disk} totalDisks={totalDisks} towerIndex={towerIndex} level={level} selected={selected && isTopDisk} invalidSignal={invalidSignal} moving={isMoving ? animation : null} onAnimationComplete={onAnimationComplete} />
      })}
    </group>
  )
}
