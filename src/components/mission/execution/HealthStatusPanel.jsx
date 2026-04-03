import React from 'react'
import { motion } from 'framer-motion'
import { Activity, AlertTriangle, CheckCircle } from 'lucide-react'
import { useMissionStore } from '../../../store/missionStore'

export const HealthStatusPanel = () => {
  const fuel = useMissionStore((state) => state.fuel)
  const energy = useMissionStore((state) => state.energy)
  const health = useMissionStore((state) => state.health)

  const getHealthBar = (value, color) => {
    return (
      <div className="w-full bg-astronaut-600 rounded-full h-2.5 overflow-hidden border border-astronaut-500">
        <motion.div
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel border-l-4 border-status-success shadow-glow-cyan hover:shadow-glow-cyan transition-all duration-200"
    >
      <h3 className="text-lg font-semibold mb-5 flex items-center gap-3">
        <Activity className="w-6 h-6 text-status-success" />
        <span className="bg-gradient-to-r from-status-success to-neon-cyan bg-clip-text text-transparent uppercase tracking-wide">System Status</span>
      </h3>

      <div className="space-y-5">
        {/* Fuel */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-sm font-mono font-bold uppercase tracking-wide text-gray-400">Fuel Reserves</div>
            <div className={`text-2xl font-bold font-mono ${fuel > 50 ? 'text-neon-blue' : fuel > 20 ? 'text-status-warning' : 'text-status-danger'}`}>
              {fuel}%
            </div>
          </div>
          {getHealthBar(fuel, fuel > 50 ? 'bg-gradient-to-r from-neon-blue to-blue-500' : fuel > 20 ? 'bg-gradient-to-r from-status-warning to-amber-500' : 'bg-gradient-to-r from-status-danger to-red-500')}
          <div className="text-xs text-gray-500 mt-2.5 flex items-center gap-2">
            {fuel > 50 ? <CheckCircle className="w-3 h-3 text-status-success" /> : fuel > 20 ? <AlertTriangle className="w-3 h-3 text-status-warning" /> : <AlertTriangle className="w-3 h-3 text-status-danger" />}
            <span className={fuel > 50 ? 'text-status-success' : fuel > 20 ? 'text-status-warning' : 'text-status-danger'}>
              {fuel > 50 ? 'Adequate' : fuel > 20 ? 'Limited' : 'Critical'}
            </span>
          </div>
        </div>

        {/* Energy */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-sm font-mono font-bold uppercase tracking-wide text-gray-400">Energy Level</div>
            <div className={`text-2xl font-bold font-mono ${energy > 50 ? 'text-status-warning' : energy > 20 ? 'text-orange-400' : 'text-status-danger'}`}>
              {energy}%
            </div>
          </div>
          {getHealthBar(energy, energy > 50 ? 'bg-gradient-to-r from-status-warning to-amber-500' : energy > 20 ? 'bg-gradient-to-r from-orange-400 to-orange-500' : 'bg-gradient-to-r from-status-danger to-red-500')}
          <div className="text-xs text-gray-500 mt-2.5 flex items-center gap-2">
            {energy > 50 ? <CheckCircle className="w-3 h-3 text-status-success" /> : energy > 20 ? <AlertTriangle className="w-3 h-3 text-status-warning" /> : <AlertTriangle className="w-3 h-3 text-status-danger" />}
            <span className={energy > 50 ? 'text-status-success' : energy > 20 ? 'text-status-warning' : 'text-status-danger'}>
              {energy > 50 ? 'Normal' : energy > 20 ? 'Low' : 'Depleting'}
            </span>
          </div>
        </div>

        {/* System Health */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-sm font-mono font-bold uppercase tracking-wide text-gray-400">System Health</div>
            <div className={`text-2xl font-bold font-mono ${health > 70 ? 'text-status-success' : health > 40 ? 'text-status-warning' : 'text-status-danger'}`}>
              {health}%
            </div>
          </div>
          {getHealthBar(health, health > 70 ? 'bg-gradient-to-r from-status-success to-emerald-500' : health > 40 ? 'bg-gradient-to-r from-status-warning to-amber-500' : 'bg-gradient-to-r from-status-danger to-red-500')}
          <div className="text-xs text-gray-500 mt-2.5 flex items-center gap-2">
            {health > 70 ? <CheckCircle className="w-3 h-3 text-status-success" /> : <AlertTriangle className="w-3 h-3 text-status-warning" />}
            <span className={health > 70 ? 'text-status-success' : health > 40 ? 'text-status-warning' : 'text-status-danger'}>
              {health > 70 ? 'All systems nominal' : health > 40 ? 'Some degradation' : 'Major issues'}
            </span>
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="mt-6 p-4 bg-astronaut-700 rounded-lg border border-astronaut-600 hover:border-neon-cyan transition-all duration-200">
        <div className="text-xs font-mono uppercase text-gray-500 tracking-wide mb-3">Overall Status</div>
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              scale: fuel > 30 && energy > 30 && health > 50 ? [1, 1.2, 1] : 1,
              boxShadow: fuel > 30 && energy > 30 && health > 50 ? '0 0 10px rgba(34, 197, 94, 0.6)' : 'none'
            }}
            transition={{ duration: 2, repeat: fuel > 30 && energy > 30 && health > 50 ? Infinity : 0 }}
            className={`w-3 h-3 rounded-full ${
              fuel > 30 && energy > 30 && health > 50 ? 'bg-status-success' : 'bg-status-danger'
            }`}
          />
          <span className="text-sm font-mono font-bold flex items-center gap-2">
            {fuel > 30 && energy > 30 && health > 50 ? <CheckCircle className="w-4 h-4 text-status-success" /> : <AlertTriangle className="w-4 h-4 text-status-danger" />}
            <span className={fuel > 30 && energy > 30 && health > 50 ? 'text-status-success' : 'text-status-danger'}>
              {fuel > 30 && energy > 30 && health > 50 ? 'OPERATIONAL' : 'COMPROMISED'}
            </span>
          </span>
        </div>
      </div>
    </motion.div>
  )
}
