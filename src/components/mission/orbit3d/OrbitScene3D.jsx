import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei'
import { useMissionStore } from '../../../store/missionStore'
import { MOCK_DEBRIS_DATA, CLUSTERS } from '../../../data/mockData'
import { EarthGlobe } from './EarthGlobe'
import { OrbitRing } from './OrbitRing'
import { DebrisObject } from './DebrisObject'
import { SpacecraftMarker } from './SpacecraftMarker'
import { RoutePath3D } from './RoutePath3D'

// Orbital positions calculator
const calculateOrbitalPosition = (debrisId, time) => {
  const debris = MOCK_DEBRIS_DATA.find((d) => d.id === debrisId)
  if (!debris) return [0, 0, 0]

  // Normalize altitude to orbit radius (800-900km altitude → 1.5-3.5 orbit radius)
  const baseRadius = 1.5 + (debris.altitude - 800) / 1000
  const orbitRadius = baseRadius

  // Velocity determines angular speed
  const angularSpeed = (debris.velocity / 50) * 0.005
  const angle = (time * angularSpeed) % (Math.PI * 2)

  // Add slight elliptical variation
  const eccentricity = debris.tumbleRate * 0.1
  const actualRadius = orbitRadius * (1 - eccentricity * Math.cos(angle))

  // Position in orbit
  const x = Math.cos(angle) * actualRadius
  const z = Math.sin(angle) * actualRadius

  // Slight vertical variation based on latitude
  const y = Math.sin((debris.latitude / 90) * Math.PI) * 0.3

  return [x, y, z]
}

// Scene content component
const SceneContent = ({ selectedCluster, debrisRemoved }) => {
  const groupRef = useRef(null)
  const [time, setTime] = useState(0)
  const currentTarget = useMissionStore((state) => state.currentTarget)
  const route = useMissionStore((state) => state.route)
  const missionStatus = useMissionStore((state) => state.missionStatus)

  useFrame(() => {
    setTime((prevTime) => prevTime + 1)
  })

  // Calculate debris positions
  const debrisPositions = useMemo(
    () => {
      const positions = {}
      MOCK_DEBRIS_DATA.forEach((debris) => {
        positions[debris.id] = calculateOrbitalPosition(debris.id, time)
      })
      return positions
    },
    [time]
  )

  // Calculate route positions
  const routePositions = useMemo(() => {
    if (!route || route.length < 2) return []
    return route.map((target) => debrisPositions[target.id] || [0, 0, 0])
  }, [route, debrisPositions])

  // Get spacecraft position (between current and next target)
  const spacecraftPos = currentTarget ? debrisPositions[currentTarget.id] : [0, 1.2, 0]
  const nextTargetIdx = route ? route.findIndex((t) => t.id === currentTarget?.id) : -1
  const nextTarget = nextTargetIdx >= 0 && nextTargetIdx < route.length - 1 ? route[nextTargetIdx + 1] : null
  const nextTargetPos = nextTarget ? debrisPositions[nextTarget.id] : spacecraftPos
  const progress = missionStatus === 'running' ? (time % 100) / 100 : 0

  // Filter debris to show
  const visibleDebris = selectedCluster
    ? MOCK_DEBRIS_DATA.filter((d) => d.cluster === selectedCluster.id && !debrisRemoved.includes(d.id))
    : MOCK_DEBRIS_DATA.filter((d) => !debrisRemoved.includes(d.id))

  // Orbital radii for rings
  const orbitalRadii = [
    { radius: 1.5, color: '#3B82F6', opacity: 0.2 },
    { radius: 2.3, color: '#06B6D4', opacity: 0.15 },
    { radius: 3.1, color: '#8B5CF6', opacity: 0.1 },
  ]

  return (
    <group ref={groupRef}>
      {/* Stars background */}
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0.5} fade speed={0.1} />

      {/* Lighting */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />
      <pointLight position={[-20, -10, -10]} intensity={0.2} color="#3B82F6" />

      {/* Earth */}
      <EarthGlobe />

      {/* Orbital rings */}
      {orbitalRadii.map((ring, idx) => (
        <OrbitRing
          key={`ring-${idx}`}
          radius={ring.radius}
          color={ring.color}
          opacity={ring.opacity}
          isSelected={selectedCluster && idx === 0}
        />
      ))}

      {/* Debris objects */}
      {visibleDebris.map((debris) => (
        <DebrisObject
          key={debris.id}
          debris={debris}
          position={debrisPositions[debris.id]}
          isSelected={selectedCluster && selectedCluster.id === debris.cluster}
          isTarget={currentTarget?.id === debris.id}
          isRemoved={debrisRemoved.includes(debris.id)}
        />
      ))}

      {/* Route path */}
      {routePositions.length > 0 && (
        <RoutePath3D
          routePositions={routePositions}
          completed={missionStatus === 'completed'}
        />
      )}

      {/* Spacecraft marker */}
      <SpacecraftMarker
        position={spacecraftPos}
        targetPosition={nextTargetPos}
        progress={progress}
      />
    </group>
  )
}

export const OrbitScene3D = ({ selectedCluster }) => {
  const debrisRemoved = useMissionStore((state) => {
    // Return IDs of debris that have been removed
    return state.debrisRemoved ? [] : []
  })

  return (
    <div className="w-full h-full bg-gradient-to-b from-astronaut-950 via-astronaut-900 to-astronaut-800 rounded-2xl overflow-hidden relative" style={{ minHeight: '600px' }}>
      {/* Canvas */}
      <Canvas
        camera={{ position: [5, 3, 5], fov: 50 }}
        style={{ width: '100%', height: '100%', display: 'block' }}
        gl={{ antialias: true, alpha: true }}
      >
        <PerspectiveCamera makeDefault position={[5, 3, 5]} fov={50} />
        <SceneContent selectedCluster={selectedCluster} debrisRemoved={debrisRemoved} />
        <OrbitControls
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
        {/* Top overlay */}
        <div className="flex justify-between items-start">
          <div className="bg-astronaut-950 bg-opacity-70 rounded-lg p-3 backdrop-blur-sm border border-neon-cyan border-opacity-30">
            <div className="text-xs text-neon-cyan font-mono uppercase tracking-wider">
              3D Orbital View
            </div>
            <div className="text-sm text-neon-blue font-mono mt-1">
              {selectedCluster ? selectedCluster.name : 'All Debris'}
            </div>
          </div>

          <div className="bg-astronaut-950 bg-opacity-70 rounded-lg p-3 backdrop-blur-sm border border-neon-purple border-opacity-30">
            <div className="text-xs text-neon-purple font-mono uppercase tracking-wider">
              Controls
            </div>
            <div className="text-xs text-gray-300 font-mono mt-1">
              Drag to rotate • Scroll to zoom
            </div>
          </div>
        </div>

        {/* Bottom overlay */}
        <div className="flex gap-3">
          <div className="bg-astronaut-950 bg-opacity-70 rounded-lg p-3 backdrop-blur-sm border border-neon-blue border-opacity-30 pointer-events-auto">
            <div className="text-xs text-neon-blue font-mono uppercase tracking-wider">
              Mission Status
            </div>
            <div className="text-xs text-status-success font-mono mt-1">
              Simulation Active
            </div>
          </div>

          <div className="bg-astronaut-950 bg-opacity-70 rounded-lg p-3 backdrop-blur-sm border border-status-info border-opacity-30">
            <div className="text-xs text-status-info font-mono uppercase tracking-wider">
              Debris Count
            </div>
            <div className="text-xs text-neon-cyan font-mono mt-1">
              {MOCK_DEBRIS_DATA.length} objects
            </div>
          </div>
        </div>
      </div>

      {/* Center marker */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-1 h-1 bg-neon-cyan rounded-full shadow-glow-cyan"></div>
      </div>
    </div>
  )
}
