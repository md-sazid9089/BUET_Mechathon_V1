import React, { useMemo } from 'react'
import { Line } from '@react-three/drei'

export const RoutePath3D = ({ routePositions, completed = false }) => {
  const points = useMemo(() => {
    if (!routePositions || routePositions.length < 2) return []
    return routePositions.map((pos) => [pos[0], pos[1], pos[2]])
  }, [routePositions])

  if (points.length < 2) return null

  return (
    <>
      {/* Main route line */}
      <Line
        points={points}
        color={completed ? '#8B5CF6' : '#06B6D4'}
        lineWidth={2}
        transparent
        opacity={completed ? 0.4 : 0.8}
        dashed={completed}
        dashScale={0.5}
        dash={completed ? 20 : 0}
      />

      {/* Glow effect - rendered as a slightly thicker semi-transparent line */}
      <Line
        points={points}
        color={completed ? '#A78BFA' : '#22D3EE'}
        lineWidth={5}
        transparent
        opacity={completed ? 0.1 : 0.15}
        dashed={false}
      />

      {/* Progress indicator dots */}
      {!completed &&
        points.map((point, index) => (
          <group key={`route-point-${index}`} position={point}>
            <mesh scale={0.05 + (index / points.length) * 0.05}>
              <sphereGeometry args={[1, 8, 8]} />
              <meshBasicMaterial color="#06B6D4" transparent opacity={0.6} />
            </mesh>
          </group>
        ))}
    </>
  )
}
