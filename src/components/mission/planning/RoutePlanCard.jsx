import React from 'react'
import { motion } from 'framer-motion'
import { Map } from 'lucide-react'
import { useMissionStore } from '../../../store/missionStore'

export const RoutePlanCard = () => {
  const route = useMissionStore((state) => state.route)
  const rankedTargets = useMissionStore((state) => state.rankedTargets)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Map className="w-5 h-5 text-debris-success" />
        Route Planning
      </h3>

      <div className="bg-space-700 rounded-lg p-4 mb-4 border border-space-600">
        <div className="text-sm mb-3">
          <div className="text-xs text-gray-400 mb-2">PLANNED ROUTE</div>
          {route.length === 0 ? (
            <p className="text-gray-400 text-xs">No route planned yet</p>
          ) : (
            <div className="space-y-2">
              {route.map((target, idx) => (
                <motion.div
                  key={`${target.id}-${idx}`}
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-debris-info flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </div>
                  <div className="flex-1 font-mono text-xs">{target.name || target.id}</div>
                  {idx < route.length - 1 && (
                    <div className="text-xs text-gray-400">→</div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2 text-xs text-gray-400 mb-4">
        <div className="flex justify-between">
          <span>Distance:</span>
          <span className="font-bold">{(route.length * 50).toFixed(0)} km</span>
        </div>
        <div className="flex justify-between">
          <span>Est. Time:</span>
          <span className="font-bold">{(route.length * 45).toFixed(0)} min</span>
        </div>
        <div className="flex justify-between">
          <span>Fuel Cost:</span>
          <span className="font-bold">{route.length * 8}%</span>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={rankedTargets.length === 0}
        className="w-full btn-success text-sm disabled:opacity-50"
      >
        Optimize Route
      </motion.button>
    </motion.div>
  )
}
