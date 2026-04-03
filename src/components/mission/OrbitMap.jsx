import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useMissionStore } from '../../store/missionStore'
import { CLUSTERS, MOCK_DEBRIS_DATA } from '../../data/mockData'

export const OrbitMap = ({ selectedCluster }) => {
  const canvasRef = useRef(null)
  const currentTarget = useMissionStore((state) => state.currentTarget)
  const route = useMissionStore((state) => state.route)
  
  // Animate debris positions
  const [debrisPositions, setDebrisPositions] = React.useState({})

  useEffect(() => {
    // Generate initial positions
    const positions = {}
    MOCK_DEBRIS_DATA.forEach((debris) => {
      const angle = Math.random() * Math.PI * 2
      const radius = 150 + Math.random() * 50
      positions[debris.id] = {
        x: 200 + Math.cos(angle) * radius,
        y: 200 + Math.sin(angle) * radius,
        angle,
        radius,
      }
    })
    setDebrisPositions(positions)

    // Animation loop
    const interval = setInterval(() => {
      setDebrisPositions((prev) => {
        const updated = {}
        Object.entries(prev).forEach(([id, pos]) => {
          const newAngle = (pos.angle + 0.02) % (Math.PI * 2)
          updated[id] = {
            ...pos,
            x: 200 + Math.cos(newAngle) * pos.radius,
            y: 200 + Math.sin(newAngle) * pos.radius,
            angle: newAngle,
          }
        })
        return updated
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const getDebrisColor = (debris) => {
    if (currentTarget?.id === debris.id) return '#ff6b6b'
    if (selectedCluster?.id === debris.cluster) return '#ffd43b'
    if (debris.riskScore >= 80) return '#ff8787'
    if (debris.riskScore >= 60) return '#ffa94d'
    return '#74c0fc'
  }

  const clusterDebris = selectedCluster
    ? MOCK_DEBRIS_DATA.filter((d) => d.cluster === selectedCluster.id)
    : MOCK_DEBRIS_DATA

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center"
    >
      <div className="relative w-full h-screen bg-gradient-to-b from-space-900 to-space-800 rounded-lg overflow-hidden">
        {/* SVG Orbital View */}
        <svg
          ref={canvasRef}
          className="w-full h-full"
          viewBox="0 0 500 500"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Defs for gradients and patterns */}
          <defs>
            <radialGradient id="earthGradient">
              <stop offset="0%" stopColor="#4a90e2" />
              <stop offset="100%" stopColor="#2563eb" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background stars */}
          {Array.from({ length: 20 }).map((_, i) => (
            <circle
              key={`star-${i}`}
              cx={Math.random() * 500}
              cy={Math.random() * 500}
              r={0.5}
              fill="white"
              opacity={Math.random() * 0.5 + 0.3}
            />
          ))}

          {/* Orbit paths */}
          {[100, 150, 200].map((radius) => (
            <circle
              key={`orbit-${radius}`}
              cx={250}
              cy={250}
              r={radius}
              fill="none"
              stroke="rgba(59, 130, 246, 0.2)"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          ))}

          {/* Route path if available */}
          {route && route.length > 1 && (
            <polyline
              points={route
                .map((target) => {
                  const pos = debrisPositions[target.id]
                  return pos ? `${pos.x},${pos.y}` : ''
                })
                .join(' ')}
              fill="none"
              stroke="rgba(34, 197, 94, 0.5)"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          )}

          {/* Debris objects */}
          {clusterDebris.map((debris) => {
            const pos = debrisPositions[debris.id]
            if (!pos) return null

            return (
              <g key={debris.id}>
                {/* Debris dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={currentTarget?.id === debris.id ? 4 : 3}
                  fill={getDebrisColor(debris)}
                  opacity={selectedCluster && selectedCluster.id !== debris.cluster ? 0.3 : 1}
                  filter="url(#glow)"
                  style={{
                    cursor: 'pointer',
                    transition: 'r 0.3s ease',
                  }}
                />

                {/* Label for current target */}
                {currentTarget?.id === debris.id && (
                  <text
                    x={pos.x}
                    y={pos.y - 15}
                    textAnchor="middle"
                    fill="#ff6b6b"
                    fontSize="10"
                    fontWeight="bold"
                  >
                    {debris.id}
                  </text>
                )}
              </g>
            )
          })}

          {/* Earth at center */}
          <circle
            cx={250}
            cy={250}
            r={40}
            fill="url(#earthGradient)"
            filter="url(#glow)"
          />
          <text
            x={250}
            y={260}
            textAnchor="middle"
            fill="white"
            fontSize="12"
            fontWeight="bold"
          >
            EARTH
          </text>
        </svg>

        {/* Legend */}
        <div className="absolute bottom-6 right-6 bg-space-800/80 backdrop-blur p-4 rounded-lg border border-space-700">
          <div className="text-sm space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span>Current Target</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <span>Selected Cluster</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-300" />
              <span>High Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-300" />
              <span>Medium Risk</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-300" />
              <span>Low Risk</span>
            </div>
          </div>
        </div>

        {/* Selection Info */}
        {selectedCluster && (
          <div className="absolute top-6 left-6 bg-space-800/80 backdrop-blur p-4 rounded-lg border border-space-700 max-w-xs">
            <h3 className="font-bold text-debris-info mb-2">{selectedCluster.name}</h3>
            <div className="text-sm space-y-1 text-gray-300">
              <div>Altitude: {selectedCluster.altitude}km</div>
              <div>Objects: {clusterDebris.length}</div>
              <div>Risk: {selectedCluster.collisionRisk}%</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
