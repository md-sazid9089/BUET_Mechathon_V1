import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Target, Zap, Activity } from 'lucide-react'
import { useMissionStore } from '../../store/missionStore'

export const Sidebar = ({ onSelectCluster, clusters }) => {
  const selectedCluster = useMissionStore((state) => state.selectedCluster)
  const fuel = useMissionStore((state) => state.fuel)
  const energy = useMissionStore((state) => state.energy)
  const health = useMissionStore((state) => state.health)
  const collisionRisk = useMissionStore((state) => state.collisionRisk)

  const getMetricColor = (value) => {
    if (value >= 70) return 'text-debris-success'
    if (value >= 40) return 'text-debris-warning'
    return 'text-debris-danger'
  }

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-80 bg-space-800 border-r border-space-700 p-6 overflow-y-auto max-h-screen sticky top-16"
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Target className="w-5 h-5" />
        Spacecraft Status
      </h2>

      {/* Metrics */}
      <div className="space-y-4 mb-8">
        <div className="metric-box">
          <div className="flex items-center gap-2 mb-2">
            <Zap className={`w-4 h-4 ${getMetricColor(fuel)}`} />
            <span className="text-xs font-mono">FUEL</span>
          </div>
          <div className={`text-2xl font-bold ${getMetricColor(fuel)}`}>{fuel}%</div>
          <div className="w-full bg-space-600 rounded-full h-2 mt-2 overflow-hidden">
            <motion.div
              className="bg-debris-info h-full"
              animate={{ width: `${fuel}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="metric-box">
          <div className="flex items-center gap-2 mb-2">
            <Zap className={`w-4 h-4 ${getMetricColor(energy)}`} />
            <span className="text-xs font-mono">ENERGY</span>
          </div>
          <div className={`text-2xl font-bold ${getMetricColor(energy)}`}>{energy}%</div>
          <div className="w-full bg-space-600 rounded-full h-2 mt-2 overflow-hidden">
            <motion.div
              className="bg-debris-warning h-full"
              animate={{ width: `${energy}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="metric-box">
          <div className="flex items-center gap-2 mb-2">
            <Activity className={`w-4 h-4 ${getMetricColor(health)}`} />
            <span className="text-xs font-mono">HEALTH</span>
          </div>
          <div className={`text-2xl font-bold ${getMetricColor(health)}`}>{health}%</div>
          <div className="w-full bg-space-600 rounded-full h-2 mt-2 overflow-hidden">
            <motion.div
              className="bg-debris-success h-full"
              animate={{ width: `${health}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="metric-box">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className={`w-4 h-4 ${collisionRisk > 80 ? 'text-debris-danger' : 'text-debris-warning'}`} />
            <span className="text-xs font-mono">COLLISION RISK</span>
          </div>
          <div className={`text-2xl font-bold ${collisionRisk > 80 ? 'text-debris-danger' : 'text-debris-warning'}`}>
            {collisionRisk}%
          </div>
          <div className="w-full bg-space-600 rounded-full h-2 mt-2 overflow-hidden">
            <motion.div
              className="bg-debris-danger h-full"
              animate={{ width: `${collisionRisk}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Clusters */}
      <div>
        <h3 className="text-sm font-semibold mt-8 mb-4 text-gray-300">DEBRIS CLUSTERS</h3>
        <div className="space-y-3">
          {clusters.map((cluster) => (
            <motion.button
              key={cluster.id}
              onClick={() => onSelectCluster(cluster)}
              whileHover={{ scale: 1.02 }}
              className={`w-full p-3 rounded-lg border transition-all text-left ${
                selectedCluster?.id === cluster.id
                  ? 'bg-debris-info border-debris-info'
                  : 'bg-space-700 border-space-600 hover:border-space-500'
              }`}
            >
              <div className="font-mono text-xs font-semibold">{cluster.name}</div>
              <div className="text-xs text-gray-400 mt-1">
                {cluster.debrisCount} items | Risk: {cluster.collisionRisk}%
              </div>
              <div className="flex gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded text-xs font-mono bg-space-600 
                  ${cluster.priority === 'CRITICAL' ? 'text-debris-danger' : 'text-white'}`}>
                  {cluster.priority}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.aside>
  )
}
