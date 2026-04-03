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
      className="bg-space-800 border-b border-space-700 p-4 sticky top-0 z-50"
    >
      <div className="flex items-center justify-between gap-6">
        {/* Left: Title */}
        <div className="flex items-center gap-3 min-w-fit">
          <motion.div animate={{ rotate: missionStatus === 'running' ? 360 : 0 }} transition={{ duration: 3, repeat: missionStatus === 'running' ? Infinity : 0 }}>
            <Rocket className="w-8 h-8 text-debris-info" />
          </motion.div>
          <div>
            <h1 className="text-xl font-bold">AI Mission Brain</h1>
            <p className="text-xs text-gray-400">Space Debris Removal System</p>
          </div>
        </div>

        {/* Center: Mission Progress */}
        <div className="flex-1 mx-6">
          <div className="flex gap-6 items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">PROGRESS</div>
              <div className="font-mono font-bold text-sm text-debris-info">{currentStep + 1}/10</div>
            </div>
            <div className="flex-1 max-w-64">
              <motion.div
                className="bg-space-700 rounded-full h-2 overflow-hidden"
              >
                <motion.div
                  className="bg-gradient-to-r from-debris-info via-debris-success to-debris-warning h-full rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${(currentStep / 9) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-400 mb-1">DEBRIS</div>
              <div className="font-mono font-bold text-sm text-debris-success">{debrisRemoved}</div>
            </div>
          </div>
        </div>

        {/* Right: Status Indicators */}
        <div className="flex gap-6 items-center min-w-fit">
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">FUEL</div>
            <motion.div
              animate={{ color: fuel < 20 ? '#ef4444' : fuel < 50 ? '#f97316' : '#10b981' }}
              className="font-mono font-bold text-sm"
            >
              {fuel.toFixed(0)}%
            </motion.div>
          </div>
          <div className="h-8 border-r border-space-700" />
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">HEALTH</div>
            <motion.div
              animate={{ color: health < 30 ? '#ef4444' : health < 70 ? '#f97316' : '#10b981' }}
              className="font-mono font-bold text-sm"
            >
              {health.toFixed(0)}%
            </motion.div>
          </div>
          <div className="h-8 border-r border-space-700" />
          <div className="text-center">
            <div className="text-xs text-gray-400 mb-1">RISK</div>
            <motion.div
              animate={{ color: collisionRisk > 70 ? '#ef4444' : collisionRisk > 40 ? '#f97316' : '#10b981' }}
              className="font-mono font-bold text-sm"
            >
              {collisionRisk.toFixed(0)}%
            </motion.div>
          </div>
          <div className="h-8 border-r border-space-700" />
          <motion.div
            animate={{
              boxShadow: missionStatus === 'running' ? ['0 0 0 0 rgba(16, 185, 129, 0.7)', '0 0 0 8px rgba(16, 185, 129, 0)'] : 'none',
            }}
            transition={{ duration: 1.5, repeat: missionStatus === 'running' ? Infinity : 0 }}
            className={`w-3 h-3 rounded-full ${
              missionStatus === 'running' ? 'bg-debris-success' :
              missionStatus === 'paused' ? 'bg-debris-warning' :
              'bg-gray-500'
            }`}
          />
          <span className="text-xs font-mono font-bold min-w-fit">
            {missionStatus === 'running' ? '● ACTIVE' :
             missionStatus === 'paused' ? '⏸ PAUSED' :
             '○ STANDBY'}
          </span>
        </div>
      </div>
    </motion.nav>
  )
}
