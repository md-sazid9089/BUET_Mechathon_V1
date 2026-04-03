import React, { useMemo } from 'react'
import { Line } from '@react-three/drei'

export const OrbitRing = ({ radius, color = '#3B82F6', opacity = 0.3, isSelected = false }) => {
  const points = useMemo(() => {
    const pointsArray = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      pointsArray.push([Math.cos(angle) * radius, 0, Math.sin(angle) * radius])
    }
    return pointsArray
  }, [radius])

  return (
    <Line
      points={points}
      color={color}
      lineWidth={isSelected ? 3 : 1.5}
      transparent
      opacity={isSelected ? 0.8 : opacity}
      dashed={!isSelected}
      dashScale={isSelected ? 1 : 0.5}
      dash={isSelected ? 0 : 10}
    />
  )
}
