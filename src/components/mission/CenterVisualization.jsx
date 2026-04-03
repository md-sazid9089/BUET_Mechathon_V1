import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Satellite, Map, Settings, BarChart3, Zap } from 'lucide-react'
import { useMissionStore } from '../../store/missionStore'
import { OrbitMap } from './OrbitMap'
import { MissionTimelineStepper } from './MissionTimelineStepper'
import { MetricCards } from './MetricCards'
import { ChartPanel } from '../charts/ChartPanel'
import { LaunchWindowCard } from './planning/LaunchWindowCard'
import { ClusterDiscoveryCard } from './planning/ClusterDiscoveryCard'
import { TargetRankingCard } from './planning/TargetRankingCard'
import { RoutePlanCard } from './planning/RoutePlanCard'
import { CaptureRecommendationCard } from './execution/CaptureRecommendationCard'
import { EventLogPanel } from './execution/EventLogPanel'
import { HealthStatusPanel } from './execution/HealthStatusPanel'
import { RiskStatusPanel } from './execution/RiskStatusPanel'
import { UncertaintyMeter } from './execution/UncertaintyMeter'

export const CenterVisualization = ({ selectedCluster, onSelectCluster }) => {
  const [activeTab, setActiveTab] = useState('orbit')

  const tabs = [
    { id: 'orbit', label: 'Orbit View', Icon: Satellite },
    { id: 'planning', label: 'Planning', Icon: Map },
    { id: 'execution', label: 'Execution', Icon: Settings },
    { id: 'metrics', label: 'Metrics', Icon: BarChart3 },
    { id: 'safety', label: 'Safety', Icon: Zap },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full h-full flex flex-col bg-space-900"
    >
      {/* Tab Navigation */}
      <div className="flex gap-2 p-4 border-b border-space-700 overflow-x-auto">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg font-mono text-sm font-bold whitespace-nowrap transition border flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-debris-info border-debris-info text-space-900'
                : 'bg-space-700 border-space-600 text-white hover:border-space-500'
            }`}
          >
            <tab.Icon className="w-4 h-4" />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Orbit View */}
        {activeTab === 'orbit' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full p-4"
          >
            <OrbitMap selectedCluster={selectedCluster} />
          </motion.div>
        )}

        {/* Planning View */}
        {activeTab === 'planning' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-6"
          >
            <h2 className="text-2xl font-bold">Mission Planning</h2>
            <MissionTimelineStepper />
            <div className="grid md:grid-cols-2 gap-6">
              <LaunchWindowCard />
              <ClusterDiscoveryCard onSelectCluster={onSelectCluster} />
              <TargetRankingCard />
              <RoutePlanCard />
            </div>
          </motion.div>
        )}

        {/* Execution View */}
        {activeTab === 'execution' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-6"
          >
            <h2 className="text-2xl font-bold">Live Execution</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <CaptureRecommendationCard />
              <EventLogPanel />
              <HealthStatusPanel />
              <RiskStatusPanel />
            </div>
          </motion.div>
        )}

        {/* Metrics View */}
        {activeTab === 'metrics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-6"
          >
            <h2 className="text-2xl font-bold">Mission Metrics</h2>
            <MetricCards />
            <ChartPanel />
          </motion.div>
        )}

        {/* Safety View */}
        {activeTab === 'safety' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-4 space-y-6"
          >
            <h2 className="text-2xl font-bold">Safety & Risk Assessment</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-1">
                <RiskStatusPanel />
              </div>
              <div className="md:col-span-1">
                <UncertaintyMeter />
              </div>
            </div>
            <div className="md:col-span-2">
              <ChartPanel />
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
