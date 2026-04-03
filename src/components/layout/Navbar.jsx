import React from 'react'
import { motion } from 'framer-motion'
import { Rocket } from 'lucide-react'
import { useMissionStore } from '../../store/missionStore'

export const Navbar = ({ onRun, onPause, onReset }) => {
  const missionStatus = useMissionStore((state) => state.missionStatus)
  const currentStep = useMissionStore((state) => state.currentStep)
  const debrisRemoved = useMissionStore((state) => state.debrisRemoved)
  const fuel = useMissionStore((state) => state.fuel)
  const health = useMissionStore((state) => state.health)
  const collisionRisk = useMissionStore((state) => state.collisionRisk)

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-astronaut-950 backdrop-blur-md border-b border-astronaut-600 px-6 py-4 sticky top-0 z-50 shadow-card-lg"
    >
      <div className="flex items-center justify-between gap-8">
        {/* Left: Title with Rocket Icon */}
        <div className="flex items-center gap-4 min-w-fit">
          <motion.div 
            animate={{ rotate: missionStatus === 'running' ? 360 : 0 }} 
            transition={{ duration: 3, repeat: missionStatus === 'running' ? Infinity : 0 }}
            className="flex-shrink-0"
          >
            <Rocket className="w-8 h-8 text-neon-blue drop-shadow-lg" />
          </motion.div>
          <div className="border-l border-astronaut-600 pl-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent">
              AI Mission Brain
            </h1>
            <p className="text-xs text-gray-400 font-mono">Space Debris Removal System</p>
          </div>
        </div>

        {/* Center: Mission Progress */}
        <div className="flex-1 mx-8">
          <div className="flex gap-8 items-center justify-center">
            {/* Progress Section */}
            <div className="text-center">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Progress</div>
              <div className="font-mono font-bold text-lg text-neon-blue">{currentStep + 1}/10</div>
            </div>

            {/* Progress Bar with Gradient */}
            <div className="flex-1 max-w-sm">
              <motion.div className="bg-astronaut-700 rounded-full h-1.5 overflow-hidden border border-astronaut-600">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(currentStep / 9) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            </div>

            {/* Debris Counter */}
            <div className="text-center">
              <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Debris Removed</div>
              <motion.div className="font-mono font-bold text-lg text-status-success">{debrisRemoved}</motion.div>
            </div>
          </div>
        </div>

        {/* Right: Status Indicators */}
        <div className="flex gap-6 items-center min-w-fit bg-astronaut-800 rounded-xl px-5 py-3 border border-astronaut-600">
          {/* Fuel */}
          <div className="text-center">
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Fuel</div>
            <motion.div
              animate={{ 
                color: fuel < 20 ? '#EF4444' : fuel < 50 ? '#F59E0B' : '#10B981',
                textShadow: fuel < 20 ? '0 0 10px #ef4444' : fuel < 50 ? '0 0 10px #f59e0b' : '0 0 10px #10b981'
              }}
              className="font-mono font-bold text-sm"
            >
              {fuel.toFixed(0)}%
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-8 border-r border-astronaut-600" />

          {/* Health */}
          <div className="text-center">
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Health</div>
            <motion.div
              animate={{ 
                color: health < 30 ? '#EF4444' : health < 70 ? '#F59E0B' : '#10B981',
                textShadow: health < 30 ? '0 0 10px #ef4444' : health < 70 ? '0 0 10px #f59e0b' : '0 0 10px #10b981'
              }}
              className="font-mono font-bold text-sm"
            >
              {health.toFixed(0)}%
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-8 border-r border-astronaut-600" />

          {/* Risk */}
          <div className="text-center">
            <div className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Risk</div>
            <motion.div
              animate={{ 
                color: collisionRisk > 70 ? '#EF4444' : collisionRisk > 40 ? '#F59E0B' : '#10B981',
                textShadow: collisionRisk > 70 ? '0 0 10px #ef4444' : collisionRisk > 40 ? '0 0 10px #f59e0b' : '0 0 10px #10b981'
              }}
              className="font-mono font-bold text-sm"
            >
              {collisionRisk.toFixed(0)}%
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-8 border-r border-astronaut-600" />

          {/* Status Indicator */}
          <motion.div className="flex items-center gap-2">
            <motion.div
              animate={{
                boxShadow: missionStatus === 'running' 
                  ? ['0 0 0 0 rgba(59, 130, 246, 0.7)', '0 0 0 8px rgba(59, 130, 246, 0)']
                  : 'none',
              }}
              transition={{ duration: 1.5, repeat: missionStatus === 'running' ? Infinity : 0 }}
              className={`w-3 h-3 rounded-full ${
                missionStatus === 'running' ? 'bg-status-success' :
                missionStatus === 'paused' ? 'bg-status-warning' :
                'bg-gray-600'
              }`}
            />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">
              {missionStatus === 'running' ? '● ACTIVE' :
               missionStatus === 'paused' ? '⏸ PAUSED' :
               '○ STANDBY'}
            </span>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  )
}
