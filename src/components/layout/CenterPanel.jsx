import React from 'react'
import { motion } from 'framer-motion'
import { useMissionStore } from '../../store/missionStore'

export const CenterPanel = ({ children }) => {
  const missionStatus = useMissionStore((state) => state.missionStatus)

  return (
    <motion.main
      className="flex-1 p-6 overflow-y-auto max-h-screen"
    >
      {/* Status Indicator */}
      <div className="mb-6 flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full ${
          missionStatus === 'running' ? 'bg-debris-success animate-pulse' :
          missionStatus === 'paused' ? 'bg-debris-warning' :
          'bg-gray-600'
        }`}></div>
        <span className="text-sm font-mono font-semibold text-gray-300">
          {missionStatus === 'running' ? 'MISSION ACTIVE' :
           missionStatus === 'paused' ? 'MISSION PAUSED' :
           'MISSION IDLE'}
        </span>
      </div>

      {/* Content */}
      {children}
    </motion.main>
  )
}
