import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, AlertCircle } from 'lucide-react'
import { useMissionStore } from '../../../store/missionStore'

export const RiskStatusPanel = () => {
  const collisionRisk = useMissionStore((state) => state.collisionRisk)
  const uncertainty = useMissionStore((state) => state.uncertainty)
  const health = useMissionStore((state) => state.health)

  const getRiskLevel = (risk) => {
    if (risk >= 80) return { level: 'CRITICAL', color: 'text-status-danger', bg: 'bg-status-danger bg-opacity-15', border: 'border-status-danger', icon: AlertCircle }
    if (risk >= 60) return { level: 'HIGH', color: 'text-status-warning', bg: 'bg-status-warning bg-opacity-15', border: 'border-status-warning', icon: AlertTriangle }
    if (risk >= 40) return { level: 'MEDIUM', color: 'text-neon-purple', bg: 'bg-neon-purple bg-opacity-15', border: 'border-neon-purple', icon: AlertTriangle }
    return { level: 'LOW', color: 'text-status-success', bg: 'bg-status-success bg-opacity-15', border: 'border-status-success', icon: AlertTriangle }
  }

  const collisionLevel = getRiskLevel(collisionRisk)
  const uncertaintyLevel = getRiskLevel(uncertainty * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel border-l-4 border-status-danger shadow-glow-red hover:shadow-glow-red transition-all duration-200"
    >
      <h3 className="text-lg font-semibold mb-5 flex items-center gap-3">
        <AlertTriangle className="w-6 h-6 text-status-danger" />
        <span className="bg-gradient-to-r from-status-danger to-neon-pink bg-clip-text text-transparent uppercase tracking-wide">Risk Assessment</span>
      </h3>

      {/* Collision Risk */}
      <div className={`${collisionLevel.bg} rounded-lg p-4 mb-5 border-2 ${collisionLevel.border}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-mono font-bold uppercase tracking-wide text-gray-400">Collision Risk</div>
          <div className={`text-2xl font-bold font-mono ${collisionLevel.color}`}>{collisionRisk}%</div>
        </div>
        <div className="w-full bg-astronaut-600 rounded-full h-2.5 overflow-hidden border border-astronaut-500">
          <motion.div
            animate={{ width: `${collisionRisk}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${
              collisionRisk >= 80 ? 'bg-gradient-to-r from-status-danger to-red-500' :
              collisionRisk >= 60 ? 'bg-gradient-to-r from-status-warning to-amber-500' :
              collisionRisk >= 40 ? 'bg-gradient-to-r from-neon-purple to-pink-500' :
              'bg-gradient-to-r from-status-success to-emerald-500'
            }`}
          />
        </div>
        <div className={`text-xs mt-2.5 font-mono font-bold uppercase tracking-wide ${collisionLevel.color}`}>
          Status: {collisionLevel.level}
        </div>
      </div>

      {/* Uncertainty */}
      <div className={`${uncertaintyLevel.bg} rounded-lg p-4 mb-5 border-2 ${uncertaintyLevel.border}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-mono font-bold uppercase tracking-wide text-gray-400">Uncertainty</div>
          <div className={`text-2xl font-bold font-mono ${uncertaintyLevel.color}`}>
            {(uncertainty * 100).toFixed(0)}%
          </div>
        </div>
        <div className="w-full bg-astronaut-600 rounded-full h-2.5 overflow-hidden border border-astronaut-500">
          <motion.div
            animate={{ width: `${uncertainty * 100}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${
              uncertainty > 0.7 ? 'bg-gradient-to-r from-status-warning to-amber-500' :
              uncertainty > 0.4 ? 'bg-gradient-to-r from-neon-purple to-pink-500' :
              'bg-gradient-to-r from-status-success to-emerald-500'
            }`}
          />
        </div>
        <div className="text-xs mt-2.5 text-gray-300 font-mono">
          {uncertainty > 0.7 ? '🔴 High - Increase monitoring' :
           uncertainty > 0.4 ? '🟡 Moderate - Standard monitoring' :
           '🟢 Low - Proceed with confidence'}
        </div>
      </div>

      {/* System Health */}
      <div className={`${health > 70 ? 'bg-status-success bg-opacity-15 border-status-success' : health > 40 ? 'bg-status-warning bg-opacity-15 border-status-warning' : 'bg-status-danger bg-opacity-15 border-status-danger'} rounded-lg p-4 mb-5 border-2`}>
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-mono font-bold uppercase tracking-wide text-gray-400">System Health</div>
          <div className={`text-2xl font-bold font-mono ${health > 70 ? 'text-status-success' : health > 40 ? 'text-status-warning' : 'text-status-danger'}`}>
            {health}%
          </div>
        </div>
        <div className="w-full bg-astronaut-600 rounded-full h-2.5 overflow-hidden border border-astronaut-500">
          <motion.div
            animate={{ width: `${health}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${
              health > 70 ? 'bg-gradient-to-r from-status-success to-emerald-500' :
              health > 40 ? 'bg-gradient-to-r from-status-warning to-amber-500' :
              'bg-gradient-to-r from-status-danger to-red-500'
            }`}
          />
        </div>
      </div>

      {/* Warnings */}
      {(collisionRisk > 80 || uncertainty > 0.7 || health < 40) && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-0 p-4 bg-status-danger bg-opacity-20 border-2 border-status-danger rounded-lg shadow-glow-red"
        >
          <div className="text-xs font-bold text-status-danger mb-2.5 flex items-center gap-2 uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            ⚠️ ACTIVE WARNINGS
          </div>
          <ul className="text-xs text-gray-200 space-y-1.5 font-mono">
            {collisionRisk > 80 && <li>• 🔴 High collision risk detected - immediate action advised</li>}
            {uncertainty > 0.7 && <li>• 🟡 Uncertainty exceeds safety threshold - validate targets</li>}
            {health < 40 && <li>• 🔴 System health critical - maintenance recommended</li>}
          </ul>
        </motion.div>
      )}
    </motion.div>
  )
}
