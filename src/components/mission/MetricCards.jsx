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

  const MetricCard = ({ icon: Icon, label, value, unit, color, textColor, shadowColor, bgGradient, isPercentage = true }) => {
    const percentage = isPercentage ? value : (value / 10) * 100

    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`bg-astronaut-700 border border-astronaut-600 rounded-2xl p-5 transition-all duration-200 hover:${shadowColor}`}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs text-gray-400 font-mono mb-2 uppercase tracking-wide">{label}</div>
            <div className={`text-4xl font-bold font-mono ${textColor}`}>{value}{unit}</div>
          </div>
          <Icon className={`w-7 h-7 ${textColor} opacity-80`} />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-astronaut-600 rounded-full h-2 overflow-hidden border border-astronaut-500">
          <motion.div
            animate={{ width: `${Math.min(percentage, 100)}%` }}
            transition={{ duration: 0.5 }}
            className={`h-full rounded-full ${bgGradient}`}
          />
        </div>

        {/* Status Text */}
        <div className="text-xs text-gray-400 mt-3 flex items-center gap-2 font-mono">
          {percentage >= 70 ? <CheckCircle className="w-3 h-3 text-status-success" /> : percentage >= 40 ? <AlertTriangle className="w-3 h-3 text-status-warning" /> : <AlertCircle className="w-3 h-3 text-status-danger" />}
          <span className={percentage >= 70 ? 'text-status-success' : percentage >= 40 ? 'text-status-warning' : 'text-status-danger'}>
            {percentage >= 70 ? 'GOOD' : percentage >= 40 ? 'CAUTION' : 'CRITICAL'}
          </span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      <MetricCard
        icon={Zap}
        label="FUEL"
        value={fuel}
        unit="%"
        textColor="text-neon-blue"
        shadowColor="shadow-glow-blue"
        bgGradient="bg-gradient-to-r from-neon-blue to-blue-500"
      />
      <MetricCard
        icon={Gauge}
        label="ENERGY"
        value={energy}
        unit="%"
        textColor="text-status-warning"
        shadowColor="shadow-glow-red"
        bgGradient="bg-gradient-to-r from-status-warning to-amber-500"
      />
      <MetricCard
        icon={Activity}
        label="HEALTH"
        value={health}
        unit="%"
        textColor="text-status-success"
        shadowColor="shadow-glow-cyan"
        bgGradient="bg-gradient-to-r from-status-success to-emerald-500"
      />
      <MetricCard
        icon={AlertTriangle}
        label="COLLISION RISK"
        value={collisionRisk}
        unit="%"
        textColor="text-status-danger"
        shadowColor="shadow-glow-red"
        bgGradient="bg-gradient-to-r from-status-danger to-red-500"
        isPercentage={false}
      />
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-astronaut-700 border border-astronaut-600 rounded-2xl p-5 transition-all duration-200 hover:shadow-glow-purple"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs text-gray-400 font-mono mb-2 uppercase tracking-wide">UNCERTAINTY</div>
            <div className="text-4xl font-bold text-neon-purple font-mono">{(uncertainty * 100).toFixed(0)}%</div>
          </div>
          <Gauge className="w-7 h-7 text-neon-purple opacity-80" />
        </div>
        <div className="w-full bg-astronaut-600 rounded-full h-2 overflow-hidden border border-astronaut-500">
          <motion.div
            animate={{ width: `${Math.min(uncertainty * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-neon-purple to-pink-500"
          />
        </div>
        <div className="text-xs text-gray-400 mt-3 font-mono">
          {uncertainty > 0.7 ? '🔴 High uncertainty - monitor closely' :
           uncertainty > 0.4 ? '🟡 Moderate uncertainty' :
           '🟢 Low uncertainty - confidence high'}
        </div>
      </motion.div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="bg-astronaut-700 border border-astronaut-600 rounded-2xl p-5 transition-all duration-200 hover:shadow-glow-cyan"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xs text-gray-400 font-mono mb-2 uppercase tracking-wide">DEBRIS REMOVED</div>
            <div className="text-4xl font-bold text-neon-cyan font-mono">{debrisRemoved}</div>
          </div>
          <Target className="w-7 h-7 text-neon-cyan opacity-80" />
        </div>
        <div className="w-full bg-astronaut-600 rounded-full h-2 overflow-hidden border border-astronaut-500">
          <motion.div
            animate={{ width: `${Math.min((debrisRemoved / 10) * 100, 100)}%` }}
            transition={{ duration: 0.5 }}
            className="h-full rounded-full bg-gradient-to-r from-neon-cyan to-cyan-500"
          />
        </div>
        <div className="text-xs text-gray-400 mt-3 font-mono">
          {debrisRemoved > 5 ? '✅ Excellent progress' :
           debrisRemoved > 2 ? '✓ Good progress' :
           '▶ Mission starting'}
        </div>
      </motion.div>
    </motion.div>
  )
}
