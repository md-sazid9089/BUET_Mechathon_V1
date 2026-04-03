import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Billboard, Text } from '@react-three/drei'

export const DebrisObject = ({
  debris,
  position,
  isSelected = false,
  isTarget = false,
  isRemoved = false,
}) => {
  const meshRef = useRef(null)
  const glowRef = useRef(null)

  // Determine color based on status
  const getColor = () => {
    if (isRemoved) return '#505050'
    if (isTarget) return '#FBBF24'
    if (isSelected) return '#06B6D4'
    if (debris.riskScore >= 80) return '#EF4444'
    if (debris.riskScore >= 60) return '#F97316'
    return '#3B82F6'
  }

  const color = getColor()

  // Pulsing animation for selected/target
  useFrame(() => {
    if (meshRef.current && (isSelected || isTarget)) {
      meshRef.current.scale.x = 1 + Math.sin(Date.now() * 0.005) * 0.15
      meshRef.current.scale.y = meshRef.current.scale.x
      meshRef.current.scale.z = meshRef.current.scale.x
    }

    if (glowRef.current) {
      glowRef.current.scale.x = 1 + Math.sin(Date.now() * 0.003) * 0.2
      glowRef.current.scale.y = glowRef.current.scale.x
      glowRef.current.scale.z = glowRef.current.scale.x
    }
  })

  return (
    <group position={position}>
      {/* Glow sphere (background) */}
      <mesh ref={glowRef} scale={0.15}>
        <Sphere args={[1, 16, 16]} />
        <meshBasicMaterial color={color} transparent opacity={isRemoved ? 0.1 : 0.3} />
      </mesh>

      {/* Main debris sphere */}
      <mesh ref={meshRef} scale={0.08}>
        <Sphere args={[1, 16, 16]} />
        <meshPhongMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isRemoved ? 0 : 0.4}
          shininess={10}
        />
      </mesh>

      {/* Label on hover */}
      {isSelected && (
        <Billboard follow lockZ>
          <Text
            position={[0, 0.3, 0]}
            fontSize={0.15}
            color={color}
            anchorX="center"
            anchorY="bottom"
            maxWidth={0.8}
          >
            {debris.name}
          </Text>
        </Billboard>
      )}
    </group>
  )
}
