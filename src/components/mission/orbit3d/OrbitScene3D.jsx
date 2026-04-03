import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { useMissionStore } from '../../../store/missionStore'
import { MOCK_DEBRIS_DATA } from '../../../data/mockData'

// Simpler scene - just the basics
const SimpleScene = ({ selectedCluster }) => {
  const groupRef = useRef(null)
  const timeRef = useRef(0)

  useFrame(() => {
    timeRef.current += 1
  })

  return (
    <group ref={groupRef}>
      {/* Stars background */}
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0.5} fade speed={0.1} />

      {/* Lighting */}
      <ambientLight intensity={0.6} color="#ffffff" />
      <directionalLight position={[10, 10, 5]} intensity={0.8} color="#ffffff" />

      {/* Simple Earth sphere */}
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshPhongMaterial color="#1e40af" emissive="#1e40af" emissiveIntensity={0.3} />
      </mesh>

      {/* Orbit ring */}
      <mesh rotation={[0.3, 0, 0]}>
        <torusGeometry args={[2, 0.05, 8, 100]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.5} />
      </mesh>

      {/* Simple debris dots */}
      {MOCK_DEBRIS_DATA.slice(0, 5).map((debris, idx) => {
        const angle = (idx / 5) * Math.PI * 2
        const radius = 2.5
        return (
          <mesh key={debris.id} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
            <sphereGeometry args={[0.1, 16, 16]} />
            <meshPhongMaterial color="#06B6D4" emissive="#06B6D4" emissiveIntensity={0.6} />
          </mesh>
        )
      })}
    </group>
  )
}

export const OrbitScene3D = ({ selectedCluster }) => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-astronaut-950 via-astronaut-900 to-astronaut-800 rounded-2xl overflow-hidden relative" style={{ minHeight: '600px' }}>
      {/* Canvas with minimal setup */}
      <Canvas camera={{ position: [5, 3, 5], fov: 50 }}>
        <color attach="background" args={['#020617']} />
        <SimpleScene selectedCluster={selectedCluster} />
        <OrbitControls 
          enablePan={false}
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
              Mission Control
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
