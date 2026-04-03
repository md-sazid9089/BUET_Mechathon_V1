import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useMissionStore } from '../../../store/missionStore'

export const RiskStatusPanel = () => {
  const collisionRisk = useMissionStore((state) => state.collisionRisk)
  const uncertainty = useMissionStore((state) => state.uncertainty)
  const health = useMissionStore((state) => state.health)

  const getRiskLevel = (risk) => {
    if (risk >= 80) return { level: 'CRITICAL', color: 'text-red-500', bg: 'bg-red-900/20' }
    if (risk >= 60) return { level: 'HIGH', color: 'text-orange-500', bg: 'bg-orange-900/20' }
    if (risk >= 40) return { level: 'MEDIUM', color: 'text-yellow-500', bg: 'bg-yellow-900/20' }
    return { level: 'LOW', color: 'text-green-500', bg: 'bg-green-900/20' }
  }

  const collisionLevel = getRiskLevel(collisionRisk)
  const uncertaintyLevel = getRiskLevel(uncertainty * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel border-l-4 border-debris-danger"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-debris-danger" />
        Risk Assessment
      </h3>

      {/* Collision Risk */}
      <div className={`${collisionLevel.bg} rounded-lg p-4 mb-4 border border-red-700`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-mono font-bold">COLLISION RISK</div>
          <div className={`text-2xl font-bold ${collisionLevel.color}`}>{collisionRisk}%</div>
        </div>
        <div className="w-full bg-red-900/30 rounded-full h-2 overflow-hidden">
          <motion.div
            animate={{ width: `${collisionRisk}%` }}
            transition={{ duration: 0.5 }}
            className="bg-red-500 h-full"
          />
        </div>
        <div className={`text-xs mt-2 font-mono ${collisionLevel.color}`}>
          Status: {collisionLevel.level}
        </div>
      </div>

      {/* Uncertainty */}
      <div className={`${uncertaintyLevel.bg} rounded-lg p-4 mb-4 border border-yellow-700`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-mono font-bold">UNCERTAINTY</div>
          <div className={`text-2xl font-bold ${uncertaintyLevel.color}`}>
            {(uncertainty * 100).toFixed(0)}%
          </div>
        </div>
        <div className="w-full bg-yellow-900/30 rounded-full h-2 overflow-hidden">
          <motion.div
            animate={{ width: `${uncertainty * 100}%` }}
            transition={{ duration: 0.5 }}
            className="bg-yellow-500 h-full"
          />
        </div>
        <div className="text-xs mt-2 text-gray-300">
          {uncertainty > 0.7 ? 'High - Increase monitoring' :
           uncertainty > 0.4 ? 'Moderate - Standard monitoring' :
           'Low - Proceed with confidence'}
        </div>
      </div>

      {/* System Health */}
      <div className={`${health > 70 ? 'bg-green-900/20 border-green-700' : 'bg-orange-900/20 border-orange-700'} rounded-lg p-4 border`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-mono font-bold">SYSTEM HEALTH</div>
          <div className={`text-2xl font-bold ${health > 70 ? 'text-green-400' : 'text-orange-400'}`}>
            {health}%
          </div>
        </div>
        <div className="w-full bg-green-900/30 rounded-full h-2 overflow-hidden">
          <motion.div
            animate={{ width: `${health}%` }}
            transition={{ duration: 0.5 }}
            className={`${health > 70 ? 'bg-green-500' : 'bg-orange-500'} h-full`}
          />
        </div>
      </div>

      {/* Warnings */}
      {(collisionRisk > 80 || uncertainty > 0.7 || health < 40) && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-4 p-3 bg-red-900/30 border border-red-600 rounded-lg"
        >
          <div className="text-xs font-bold text-red-300 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            WARNINGS
          </div>
          <ul className="text-xs text-red-200 space-y-1">
            {collisionRisk > 80 && <li>• High collision risk detected</li>}
            {uncertainty > 0.7 && <li>• Uncertainty exceeds safety threshold</li>}
            {health < 40 && <li>• System health critical</li>}
          </ul>
        </motion.div>
      )}
    </motion.div>
  )
}
