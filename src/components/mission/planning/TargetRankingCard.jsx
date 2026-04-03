import React from 'react'
import { motion } from 'framer-motion'
import { Target } from 'lucide-react'
import { useMissionStore } from '../../../store/missionStore'

export const TargetRankingCard = () => {
  const rankedTargets = useMissionStore((state) => state.rankedTargets)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-debris-danger" />
        Ranked Targets
      </h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {rankedTargets.length === 0 ? (
          <p className="text-sm text-gray-400">Select a cluster to see targets</p>
        ) : (
          rankedTargets.map((target, idx) => (
            <motion.div
              key={target.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="p-3 bg-space-700 rounded-lg border border-space-600 hover:border-debris-danger transition"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="font-mono text-sm font-bold">{idx + 1}. {target.id}</div>
                  <div className="text-xs text-gray-400">{target.name}</div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold ${
                  target.riskScore >= 80 ? 'bg-red-900 text-red-300' :
                  target.riskScore >= 60 ? 'bg-orange-900 text-orange-300' :
                  'bg-yellow-900 text-yellow-300'
                }`}>
                  {target.riskScore}%
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Size: {target.size}m | Velocity: {target.velocity}km/s
              </div>
            </motion.div>
          ))
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={rankedTargets.length === 0}
        className="w-full mt-4 btn-danger text-sm disabled:opacity-50"
      >
        Select Primary Target
      </motion.button>
    </motion.div>
  )
}
