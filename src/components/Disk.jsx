import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { DISK_HEIGHT, DISK_LIFT_Y, TOWER_X } from './sceneConstants.js'

const DISK_COLORS = ['#f6c453', '#ff8f5b', '#ef5f68', '#bd6ee7', '#637ee8', '#47b9d0', '#62c889', '#d99a5d']
const easeInOut = (value) => value < 0.5 ? 4 * value ** 3 : 1 - ((-2 * value + 2) ** 3) / 2

export default function Disk({ size, totalDisks, towerIndex, level, selected, invalidSignal, moving, onAnimationComplete }) {
  const mesh = useRef()
  const elapsed = useRef(0)
  const invalidElapsed = useRef(1)
  const completed = useRef(false)
  const radiusStep = Math.min(0.23, 1.15 / totalDisks)
  const radius = 0.52 + size * radiusStep
  const baseY = 0.42 + level * DISK_HEIGHT
  const profile = useMemo(() => {
    const halfHeight = 0.17
    const bevel = 0.09
    const holeRadius = 0.24
    const points = [new THREE.Vector2(holeRadius, -halfHeight)]

    points.push(new THREE.Vector2(radius - bevel, -halfHeight))
    for (let step = 1; step <= 5; step += 1) {
      const angle = -Math.PI / 2 + (step / 5) * (Math.PI / 2)
      points.push(new THREE.Vector2(
        radius - bevel + Math.cos(angle) * bevel,
        -halfHeight + bevel + Math.sin(angle) * bevel,
      ))
    }
    points.push(new THREE.Vector2(radius, halfHeight - bevel))
    for (let step = 1; step <= 5; step += 1) {
      const angle = (step / 5) * (Math.PI / 2)
      points.push(new THREE.Vector2(
        radius - bevel + Math.cos(angle) * bevel,
        halfHeight - bevel + Math.sin(angle) * bevel,
      ))
    }
    points.push(new THREE.Vector2(holeRadius, halfHeight))
    points.push(new THREE.Vector2(holeRadius, -halfHeight))
    return points
  }, [radius])

  useEffect(() => { elapsed.current = 0; completed.current = false }, [moving])
  useEffect(() => { invalidElapsed.current = invalidSignal ? 0 : 1 }, [invalidSignal])

  useFrame((state, delta) => {
    if (!mesh.current) return
    if (!moving) {
      invalidElapsed.current = Math.min(invalidElapsed.current + delta, 0.3)
      const invalidProgress = invalidElapsed.current / 0.3
      const shake = invalidSignal && invalidProgress < 1
        ? Math.sin(invalidProgress * Math.PI * 8) * 0.1 * (1 - invalidProgress)
        : 0
      mesh.current.position.set(TOWER_X[towerIndex] + shake, baseY + (selected ? 0.06 + Math.sin(state.clock.elapsedTime * 4) * 0.012 : 0), 0)
      mesh.current.scale.setScalar(selected ? 1.025 : 1)
      return
    }
    mesh.current.scale.setScalar(1)
    elapsed.current = Math.min(elapsed.current + delta, 1.2)
    const progress = elapsed.current / 1.2
    const fromX = TOWER_X[moving.from]
    const toX = TOWER_X[moving.to]
    const startY = 0.42 + moving.sourceLevel * DISK_HEIGHT
    const endY = 0.42 + moving.destinationLevel * DISK_HEIGHT
    if (progress < 0.28) {
      const phase = easeInOut(progress / 0.28)
      mesh.current.position.set(fromX, THREE.MathUtils.lerp(startY, DISK_LIFT_Y, phase), 0)
    } else if (progress < 0.72) {
      const phase = easeInOut((progress - 0.28) / 0.44)
      mesh.current.position.set(THREE.MathUtils.lerp(fromX, toX, phase), DISK_LIFT_Y, 0)
    } else {
      const phase = easeInOut((progress - 0.72) / 0.28)
      mesh.current.position.set(toX, THREE.MathUtils.lerp(DISK_LIFT_Y, endY, phase), 0)
    }
    if (progress >= 1 && !completed.current) {
      completed.current = true
      onAnimationComplete()
    }
  })

  return (
    <mesh ref={mesh} position={[TOWER_X[towerIndex], baseY, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
      <latheGeometry args={[profile, 72]} />
      <meshStandardMaterial color={DISK_COLORS[size - 1]} emissive={invalidSignal ? '#e7473f' : selected ? DISK_COLORS[size - 1] : '#000000'} emissiveIntensity={invalidSignal ? 0.55 : selected ? 0.3 : 0} roughness={0.28} metalness={0.12} />
    </mesh>
  )
}
