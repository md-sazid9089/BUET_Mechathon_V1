import React from 'react'
import { motion } from 'framer-motion'
import { Activity, AlertTriangle } from 'lucide-react'
import { useMissionStore } from '../../../store/missionStore'

export const HealthStatusPanel = () => {
  const fuel = useMissionStore((state) => state.fuel)
  const energy = useMissionStore((state) => state.energy)
  const health = useMissionStore((state) => state.health)

  const getHealthBar = (value, color) => {
    return (
      <div className="w-full bg-space-700 rounded-full h-2 overflow-hidden">
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
      className="panel border-l-4 border-debris-success"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Activity className="w-5 h-5 text-debris-success" />
        System Status
      </h3>

      <div className="space-y-4">
        {/* Fuel */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-mono font-bold">FUEL RESERVES</div>
            <div className={`text-2xl font-bold ${fuel > 50 ? 'text-blue-400' : 'text-yellow-400'}`}>
              {fuel}%
            </div>
          </div>
          {getHealthBar(fuel, 'bg-blue-500')}
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            {fuel > 50 ? <CheckCircle className="w-3 h-3 text-green-400" /> : <AlertTriangle className="w-3 h-3 text-yellow-400" />}
            {fuel > 50 ? 'Adequate' : fuel > 20 ? 'Limited' : 'Critical'}
          </div>
        </div>

        {/* Energy */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-mono font-bold">ENERGY LEVEL</div>
            <div className={`text-2xl font-bold ${energy > 50 ? 'text-yellow-400' : 'text-orange-400'}`}>
              {energy}%
            </div>
          </div>
          {getHealthBar(energy, 'bg-yellow-500')}
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            {energy > 50 ? <CheckCircle className="w-3 h-3 text-green-400" /> : <AlertTriangle className="w-3 h-3 text-yellow-400" />}
            {energy > 50 ? 'Normal' : energy > 20 ? 'Low' : 'Depleting'}
          </div>
        </div>

        {/* System Health */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-mono font-bold">SYSTEM HEALTH</div>
            <div className={`text-2xl font-bold ${health > 70 ? 'text-green-400' : 'text-orange-400'}`}>
              {health}%
            </div>
          </div>
          {getHealthBar(health, health > 70 ? 'bg-green-500' : 'bg-orange-500')}
          <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
            {health > 70 ? <CheckCircle className="w-3 h-3 text-green-400" /> : <AlertTriangle className="w-3 h-3 text-yellow-400" />}
            {health > 70 ? 'All systems nominal' : health > 40 ? 'Some degradation' : 'Major issues'}
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="mt-6 p-3 bg-space-700 rounded-lg border border-space-600">
        <div className="text-xs text-gray-400 mb-2">OVERALL STATUS</div>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${
            fuel > 30 && energy > 30 && health > 50 ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`} />
          <span className="text-sm font-mono font-bold flex items-center gap-1">
            {fuel > 30 && energy > 30 && health > 50 ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            {fuel > 30 && energy > 30 && health > 50 ? 'OPERATIONAL' : 'COMPROMISED'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
