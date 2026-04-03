import React, { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, Cylinder, Billboard, Text } from '@react-three/drei'

export const SpacecraftMarker = ({ position, targetPosition, progress = 0 }) => {
  const groupRef = useRef(null)
  const meshRef = useRef(null)
  const rotatingRef = useRef(null)

  // Interpolate position towards target
  const interpolatedPos = position && targetPosition ? 
    [
      position[0] + (targetPosition[0] - position[0]) * progress,
      position[1] + (targetPosition[1] - position[1]) * progress,
      position[2] + (targetPosition[2] - position[2]) * progress,
    ] : position

  useFrame(() => {
    if (rotatingRef.current) {
      rotatingRef.current.rotation.x += 0.02
      rotatingRef.current.rotation.y += 0.03
      rotatingRef.current.rotation.z += 0.015
    }

    // Pulsing scale effect
    if (meshRef.current) {
      meshRef.current.scale.multiplyScalar(0.98 + Math.sin(Date.now() * 0.004) * 0.02)
    }
  })

  return (
    <group ref={groupRef} position={interpolatedPos}>
      {/* Outer glow */}
      <mesh scale={0.2}>
        <Sphere args={[1, 16, 16]} />
        <meshBasicMaterial color="#06B6D4" transparent opacity={0.2} />
      </mesh>

      {/* Rotating core */}
      <group ref={rotatingRef}>
        {/* Core sphere */}
        <mesh ref={meshRef} scale={0.08}>
          <Sphere args={[1, 16, 16]} />
          <meshPhongMaterial
            color="#FBBF24"
            emissive="#FBBF24"
            emissiveIntensity={0.6}
            shininess={20}
          />
        </mesh>

        {/* Satellite arms */}
        <mesh position={[0.12, 0, 0]} scale={0.03}>
          <Sphere args={[1, 8, 8]} />
          <meshPhongMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.3} />
        </mesh>

        <mesh position={[-0.12, 0, 0]} scale={0.03}>
          <Sphere args={[1, 8, 8]} />
          <meshPhongMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.3} />
        </mesh>

        <mesh position={[0, 0.12, 0]} scale={0.03}>
          <Sphere args={[1, 8, 8]} />
          <meshPhongMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.3} />
        </mesh>

        <mesh position={[0, -0.12, 0]} scale={0.03}>
          <Sphere args={[1, 8, 8]} />
          <meshPhongMaterial color="#3B82F6" emissive="#3B82F6" emissiveIntensity={0.3} />
        </mesh>
      </group>

      {/* Label */}
      <Billboard follow lockZ>
        <Text
          position={[0, 0.25, 0]}
          fontSize={0.12}
          color="#FBBF24"
          anchorX="center"
          anchorY="bottom"
        >
          SPACECRAFT
        </Text>
      </Billboard>
    </group>
  )
}
