import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Zap, ChevronDown } from 'lucide-react'
import { useMissionStore } from '../../store/missionStore'
import { rankTargets, getStatusBadgeColor } from '../../utils/missionLogic'
import { MOCK_DEBRIS_DATA, CAPTURE_METHODS } from '../../data/mockData'

export const LeftControlPanel = ({ onRun, onPause, onReset, onSelectCluster, clusters }) => {
  const [expandedSection, setExpandedSection] = useState('status')

  const missionStatus = useMissionStore((state) => state.missionStatus)
  const currentStep = useMissionStore((state) => state.currentStep)
  const fuel = useMissionStore((state) => state.fuel)
  const energy = useMissionStore((state) => state.energy)
  const health = useMissionStore((state) => state.health)
  const collisionRisk = useMissionStore((state) => state.collisionRisk)
  const selectedCluster = useMissionStore((state) => state.selectedCluster)
  const setRankedTargets = useMissionStore((state) => state.setRankedTargets)
  const rankedTargets = useMissionStore((state) => state.rankedTargets)

  const handleSelectCluster = (cluster) => {
    onSelectCluster(cluster)
    // Auto-rank targets for this cluster
    const clusterDebris = MOCK_DEBRIS_DATA.filter((d) => d.cluster === cluster.id)
    const ranked = rankTargets(clusterDebris)
    setRankedTargets(ranked)
  }

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const iconMap = {
    '📊': BarChart3,
    '🔍': Search,
    '🎯': Target,
    '⚡': Zap,
  }

  const Section = ({ id, title, icon, children }) => {
    const IconComponent = iconMap[icon] || ChevronDown
    return (
    <motion.div className="mb-4">
      <motion.button
        onClick={() => toggleSection(id)}
        whileHover={{ scale: 1.02 }}
        className="w-full flex items-center justify-between p-3 bg-space-700 hover:bg-space-600 rounded-lg border border-space-600 transition"
      >
        <div className="flex items-center gap-2">
          <IconComponent className="w-5 h-5 text-debris-info" />
          <span className="font-mono font-bold text-sm">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: expandedSection === id ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.button>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: expandedSection === id ? 'auto' : 0,
          opacity: expandedSection === id ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="p-3 bg-space-800 border border-t-0 border-space-600 rounded-b-lg">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )  }
  const MetricBar = ({ label, value, color }) => (
    <div className="mb-3">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-mono text-gray-400">{label}</span>
        <span className={`text-sm font-bold ${color}`}>{value}%</span>
      </div>
      <div className="w-full bg-space-700 rounded-full h-2 overflow-hidden">
        <motion.div
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full ${
            color === 'text-blue-400' ? 'bg-blue-500' :
            color === 'text-yellow-400' ? 'bg-yellow-500' :
            color === 'text-green-400' ? 'bg-green-500' :
            'bg-red-500'
          }`}
        />
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-80 bg-space-800 border-r border-space-700 p-4 overflow-y-auto max-h-screen flex flex-col sticky top-16"
    >
      {/* Mission Controls */}
      <Section id="controls" title="MISSION CONTROL" icon="🎮">
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRun}
            disabled={missionStatus === 'running'}
            className="w-full flex items-center justify-center gap-2 py-2 bg-debris-success hover:bg-green-600 disabled:opacity-50 rounded-lg font-mono font-bold text-sm transition"
          >
            <Play className="w-4 h-4" />
            RUN MISSION
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            disabled={missionStatus !== 'running'}
            className="w-full flex items-center justify-center gap-2 py-2 bg-debris-warning hover:bg-orange-600 disabled:opacity-50 rounded-lg font-mono font-bold text-sm transition"
          >
            <Pause className="w-4 h-4" />
            PAUSE
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-2 bg-debris-info hover:bg-blue-600 rounded-lg font-mono font-bold text-sm transition"
          >
            <RotateCcw className="w-4 h-4" />
            RESET
          </motion.button>
        </div>
      </Section>

      {/* System Status */}
      <Section id="status" title="SYSTEM STATUS" icon="📊">
        <MetricBar label="FUEL" value={fuel} color="text-blue-400" />
        <MetricBar label="ENERGY" value={energy} color="text-yellow-400" />
        <MetricBar label="HEALTH" value={health} color="text-green-400" />
        <MetricBar label="COLLISION RISK" value={collisionRisk} color="text-red-400" />
        <div className="mt-3 p-2 bg-space-900 rounded text-xs text-center">
          <div className="text-gray-400">Step</div>
          <div className="font-bold text-debris-info">{currentStep + 1} / 10</div>
        </div>
      </Section>

      {/* Clusters */}
      <Section id="clusters" title="DEBRIS CLUSTERS" icon="🔍">
        <div className="space-y-2">
          {clusters.map((cluster) => (
            <motion.button
              key={cluster.id}
              onClick={() => handleSelectCluster(cluster)}
              whileHover={{ scale: 1.02 }}
              className={`w-full p-2 rounded-lg text-left text-xs transition border ${
                selectedCluster?.id === cluster.id
                  ? 'bg-debris-info border-debris-info text-space-900'
                  : 'bg-space-700 border-space-600 hover:border-space-500 text-white'
              }`}
            >
              <div className="font-mono font-bold mb-1">{cluster.name}</div>
              <div className="text-xs opacity-80">
                {cluster.debrisCount} items | Risk: {cluster.collisionRisk}%
              </div>
            </motion.button>
          ))}
        </div>
      </Section>

      {/* Ranked Targets */}
      {rankedTargets.length > 0 && (
        <Section id="targets" title="RANKED TARGETS" icon="🎯">
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {rankedTargets.slice(0, 5).map((target, idx) => (
              <div
                key={target.id}
                className={`p-2 rounded-lg text-xs border ${getStatusBadgeColor(target.riskScore)}`}
              >
                <div className="font-mono font-bold">#{idx + 1} {target.id}</div>
                <div className="text-xs opacity-90">Risk: {target.riskScore}%</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Quick Actions */}
      <Section id="actions" title="QUICK ACTIONS" icon="⚡">
        <div className="space-y-2 text-xs">
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full p-2 bg-space-700 hover:bg-space-600 rounded border border-space-600 font-mono font-bold transition"
          >
          <Radar className="w-4 h-4" /> Calibrate Sensors
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full p-2 bg-space-700 hover:bg-space-600 rounded border border-space-600 font-mono font-bold transition"
          >
          <RefreshCcw className="w-4 h-4" /> Recalculate Route
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full p-2 bg-space-700 hover:bg-space-600 rounded border border-space-600 font-mono font-bold transition"
          >
          <Settings className="w-4 h-4" /> Systems Check
          </motion.button>
        </div>
      </Section>

      {/* Status Indicator */}
      <div className="mt-auto pt-4 border-t border-space-700">
        <div className="flex items-center justify-center gap-2 p-3 bg-space-700 rounded-lg">
          <motion.div
            animate={{
              boxShadow: missionStatus === 'running' ? ['0 0 0 0 rgba(16, 185, 129, 0.7)', '0 0 0 10px rgba(16, 185, 129, 0)'] : 'none',
            }}
            transition={{ duration: 1.5, repeat: missionStatus === 'running' ? Infinity : 0 }}
            className={`w-3 h-3 rounded-full ${
              missionStatus === 'running' ? 'bg-debris-success' :
              missionStatus === 'paused' ? 'bg-debris-warning' :
              'bg-gray-500'
            }`}
          />
          <span className="text-xs font-mono font-bold">
            {missionStatus === 'running' ? '● ACTIVE' :
             missionStatus === 'paused' ? '⏸ PAUSED' :
             '○ IDLE'}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
