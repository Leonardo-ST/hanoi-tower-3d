import { RoundedBox } from '@react-three/drei'

export default function Base() {
  return (
    <group>
      <RoundedBox args={[10.8, 0.55, 3.4]} radius={0.2} smoothness={6} position={[0, -0.28, 0]} receiveShadow>
        <meshStandardMaterial color="#6f3d22" roughness={0.48} metalness={0.06} />
      </RoundedBox>
      <RoundedBox args={[10.15, 0.12, 2.86]} radius={0.12} smoothness={4} position={[0, 0.055, 0]} receiveShadow>
        <meshStandardMaterial color="#a86635" roughness={0.4} />
      </RoundedBox>
      {[-3.35, 0, 3.35].map((x) => (
        <mesh key={x} position={[x, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <ringGeometry args={[1.15, 1.28, 64]} /><meshStandardMaterial color="#d39a5f" roughness={0.55} />
        </mesh>
      ))}
    </group>
  )
}
