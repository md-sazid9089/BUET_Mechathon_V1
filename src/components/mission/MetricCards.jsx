import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, AlertTriangle, CheckCircle, Target, Zap, Activity, Gauge } from 'lucide-react'
import { useMissionStore } from '../../store/missionStore'

export const MetricCards = () => {
  const fuel = useMissionStore((state) => state.fuel)
  const energy = useMissionStore((state) => state.energy)
  const health = useMissionStore((state) => state.health)
  const collisionRisk = useMissionStore((state) => state.collisionRisk)
  const uncertainty = useMissionStore((state) => state.uncertainty)
  const debrisRemoved = useMissionStore((state) => state.debrisRemoved)

  const MetricCard = ({ icon: Icon, label, value, unit, color, bgColor, isPercentage = true }) => {
    const percentage = isPercentage ? value : (value / 10) * 100

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`${bgColor} border border-space-600 rounded-lg p-4 hover:border-${color} transition`}
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs text-gray-400 font-mono mb-1">{label}</div>
            <div className={`text-3xl font-bold ${color}`}>{value}{unit}</div>
          </div>
          <Icon className={`w-6 h-6 ${color} opacity-70`} />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-space-700 rounded-full h-2 overflow-hidden">
          <motion.div
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full bg-gradient-to-r ${
              color === 'text-debris-info' ? 'from-blue-500 to-blue-400' :
              color === 'text-debris-warning' ? 'from-yellow-500 to-yellow-400' :
              color === 'text-debris-success' ? 'from-green-500 to-green-400' :
              'from-red-500 to-red-400'
            }`}
          />
        </div>

        {/* Status Text */}
        <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
          {percentage >= 70 ? <CheckCircle className="w-3 h-3 text-green-500" /> : percentage >= 40 ? <AlertTriangle className="w-3 h-3 text-yellow-500" /> : <AlertCircle className="w-3 h-3 text-red-500" />}
          {percentage >= 70 ? 'Good' : percentage >= 40 ? 'Caution' : 'Critical'}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
    >
      <MetricCard
        icon={Zap}
        label="FUEL"
        value={fuel}
        unit="%"
        color="text-debris-info"
        bgColor="bg-space-700"
      />
      <MetricCard
        icon={Gauge}
        label="ENERGY"
        value={energy}
        unit="%"
        color="text-debris-warning"
        bgColor="bg-space-700"
      />
      <MetricCard
        icon={Activity}
        label="HEALTH"
        value={health}
        unit="%"
        color="text-debris-success"
        bgColor="bg-space-700"
      />
      <MetricCard
        icon={AlertTriangle}
        label="COLLISION RISK"
        value={collisionRisk}
        unit="%"
        color="text-debris-danger"
        bgColor="bg-space-700"
      />
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-space-700 border border-space-600 rounded-lg p-4 hover:border-yellow-600 transition"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs text-gray-400 font-mono mb-1">UNCERTAINTY</div>
            <div className="text-3xl font-bold text-yellow-400">{(uncertainty * 100).toFixed(0)}%</div>
          </div>
          <Gauge className="w-6 h-6 text-yellow-400 opacity-70" />
        </div>
        <div className="text-xs text-gray-300">
          {uncertainty > 0.7 ? 'High uncertainty - monitor closely' :
           uncertainty > 0.4 ? 'Moderate uncertainty' :
           'Low uncertainty - confidence high'}
        </div>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-space-700 border border-space-600 rounded-lg p-4 hover:border-green-600 transition"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs text-gray-400 font-mono mb-1">REMOVED</div>
            <div className="text-3xl font-bold text-green-400">{debrisRemoved}</div>
          </div>
          <AlertTriangle className="w-6 h-6 text-green-400 opacity-70" />
        </div>
        <div className="text-xs text-gray-300">
          {debrisRemoved > 5 ? 'Excellent progress' :
           debrisRemoved > 2 ? 'Good progress' :
           'Mission starting'}
        </div>
      </motion.div>
    </motion.div>
  )
}
