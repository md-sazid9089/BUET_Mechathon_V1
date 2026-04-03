import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, ChevronDown, BarChart3, Search, Target, Zap, Radar, RefreshCcw, Settings, Joystick } from 'lucide-react'
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
    '🎮': Joystick,
  }

  const Section = ({ id, title, icon, children }) => {
    const IconComponent = iconMap[icon] || ChevronDown
    return (
    <motion.div className="mb-4">
      <motion.button
        onClick={() => toggleSection(id)}
        whileHover={{ scale: 1.02 }}
        className="w-full flex items-center justify-between p-3 bg-astronaut-700 hover:bg-astronaut-600 rounded-xl border border-astronaut-600 hover:border-neon-blue transition-all duration-200 hover:shadow-glow-blue"
      >
        <div className="flex items-center gap-3">
          <IconComponent className="w-5 h-5 text-neon-blue" />
          <span className="font-mono font-bold text-sm uppercase tracking-wide">{title}</span>
        </div>
        <motion.div
          animate={{ rotate: expandedSection === id ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
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
        <div className="p-4 bg-astronaut-800 border border-t-0 border-astronaut-600 rounded-b-xl space-y-3">
          {children}
        </div>
      </motion.div>
    </motion.div>
  )  }
  const MetricBar = ({ label, value, color }) => (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-mono uppercase tracking-wide text-gray-400">{label}</span>
        <span className={`text-sm font-bold font-mono ${color}`}>{value}%</span>
      </div>
      <div className="w-full bg-astronaut-600 rounded-full h-2 overflow-hidden border border-astronaut-500">
        <motion.div
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
          className={`h-full rounded-full ${
            color === 'text-neon-blue' ? 'bg-neon-blue' :
            color === 'text-status-warning' ? 'bg-status-warning' :
            color === 'text-status-success' ? 'bg-status-success' :
            'bg-status-danger'
          }`}
        />
      </div>
    </div>
  )

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-80 bg-astronaut-900 border-r border-astronaut-600 p-5 overflow-y-auto max-h-screen flex flex-col sticky top-16 shadow-card-lg"
    >
      {/* Mission Controls */}
      <Section id="controls" title="MISSION CONTROL" icon="🎮">
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRun}
            disabled={missionStatus === 'running'}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-status-success hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-mono font-bold text-sm transition-all duration-200 hover:shadow-glow-blue"
          >
            <Play className="w-4 h-4" />
            RUN MISSION
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPause}
            disabled={missionStatus !== 'running'}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-status-warning hover:bg-amber-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-mono font-bold text-sm transition-all duration-200"
          >
            <Pause className="w-4 h-4" />
            PAUSE
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-neon-blue hover:bg-blue-500 rounded-lg font-mono font-bold text-sm transition-all duration-200 hover:shadow-glow-blue"
          >
            <RotateCcw className="w-4 h-4" />
            RESET
          </motion.button>
        </div>
      </Section>

      {/* System Status */}
      <Section id="status" title="SYSTEM STATUS" icon="📊">
        <MetricBar label="FUEL" value={fuel} color="text-neon-blue" />
        <MetricBar label="ENERGY" value={energy} color="text-status-warning" />
        <MetricBar label="HEALTH" value={health} color="text-status-success" />
        <MetricBar label="COLLISION RISK" value={collisionRisk} color="text-status-danger" />
        <div className="mt-3 p-3 bg-astronaut-700 rounded-lg border border-neon-blue border-opacity-30 text-center">
          <div className="text-xs font-mono uppercase text-gray-400 tracking-wide">Current Step</div>
          <div className="font-mono font-bold text-lg text-neon-blue mt-1">{currentStep + 1} / 10</div>
        </div>
      </Section>

      {/* Clusters */}
      <Section id="clusters" title="DEBRIS CLUSTERS" icon="🔍">
        <div className="space-y-2.5">
          {clusters.map((cluster) => (
            <motion.button
              key={cluster.id}
              onClick={() => handleSelectCluster(cluster)}
              whileHover={{ scale: 1.02 }}
              className={`w-full p-3 rounded-lg text-left text-xs transition-all duration-200 border font-mono font-bold ${
                selectedCluster?.id === cluster.id
                  ? 'bg-neon-blue bg-opacity-20 border-neon-blue text-neon-blue shadow-glow-blue'
                  : 'bg-astronaut-700 border-astronaut-600 hover:border-neon-cyan text-gray-200 hover:shadow-glow-cyan'
              }`}
            >
              <div>{cluster.name}</div>
              <div className="text-xs opacity-75 mt-1">
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
                className={`p-2.5 rounded-lg text-xs border font-mono font-bold ${
                  target.riskScore > 70 
                    ? 'bg-status-danger bg-opacity-20 border-status-danger text-status-danger'
                    : target.riskScore > 40
                    ? 'bg-status-warning bg-opacity-20 border-status-warning text-status-warning'
                    : 'bg-status-success bg-opacity-20 border-status-success text-status-success'
                }`}
              >
                <div>#{idx + 1} {target.id}</div>
                <div className="opacity-80">Risk: {target.riskScore}%</div>
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
            className="w-full p-2.5 bg-astronaut-700 hover:bg-astronaut-600 hover:border-neon-cyan rounded-lg border border-astronaut-600 font-mono font-bold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-glow-cyan"
          >
            <Radar className="w-4 h-4" />
            Calibrate Sensors
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full p-2.5 bg-astronaut-700 hover:bg-astronaut-600 hover:border-neon-purple rounded-lg border border-astronaut-600 font-mono font-bold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-glow-purple"
          >
            <RefreshCcw className="w-4 h-4" />
            Recalculate Route
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            className="w-full p-2.5 bg-astronaut-700 hover:bg-astronaut-600 hover:border-neon-blue rounded-lg border border-astronaut-600 font-mono font-bold transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-glow-blue"
          >
            <Settings className="w-4 h-4" />
            Systems Check
          </motion.button>
        </div>
      </Section>

      {/* Status Indicator */}
      <div className="mt-auto pt-4 border-t border-astronaut-600">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-3 p-3 bg-astronaut-800 rounded-lg border border-astronaut-600 hover:border-neon-blue transition-all duration-200"
        >
          <motion.div
            animate={{
              boxShadow: missionStatus === 'running' ? ['0 0 0 0 rgba(34, 197, 94, 0.7)', '0 0 0 10px rgba(34, 197, 94, 0)'] : 'none',
            }}
            transition={{ duration: 1.5, repeat: missionStatus === 'running' ? Infinity : 0 }}
            className={`w-3 h-3 rounded-full ${
              missionStatus === 'running' ? 'bg-status-success' :
              missionStatus === 'paused' ? 'bg-status-warning' :
              'bg-gray-600'
            }`}
          />
          <span className="text-xs font-mono font-bold uppercase tracking-wider">
            {missionStatus === 'running' ? '● ACTIVE' :
             missionStatus === 'paused' ? '⏸ PAUSED' :
             '○ IDLE'}
          </span>
        </motion.div>
      </div>
    </motion.div>
  )
}
