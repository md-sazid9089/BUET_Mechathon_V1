import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useMissionStore } from '../store/missionStore'
import { MOCK_DEBRIS_DATA, CLUSTERS, CAPTURE_METHODS, MISSION_STEPS } from '../data/mockData'
import { rankTargets, calculateCollisionRisk } from '../utils/missionLogic'

export default function DemoDashboard({ selectedCluster }) {
  const [debrisList] = useState(MOCK_DEBRIS_DATA)
  const [rankedList, setRankedList] = useState([])
  const missionStatus = useMissionStore((state) => state.missionStatus)
  const currentStep = useMissionStore((state) => state.currentStep)
  const addEventLog = useMissionStore((state) => state.addEventLog)

  useEffect(() => {
    if (selectedCluster) {
      const clusterDebris = debrisList.filter(d => d.cluster === selectedCluster.id)
      const ranked = rankTargets(clusterDebris)
      setRankedList(ranked)
    }
  }, [selectedCluster, debrisList])

  return (
    <div className="space-y-6">
      {/* Mission Overview */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="panel"
      >
        <h3 className="text-lg font-semibold mb-4">Current Mission Step</h3>
        <div className="grid md:grid-cols-4 gap-4">
          {MISSION_STEPS.map((step, idx) => (
            <motion.div
              key={step.id}
              className={`p-4 rounded-lg border transition-all ${
                currentStep === idx
                  ? 'bg-debris-info border-debris-info'
                  : currentStep > idx
                    ? 'bg-debris-success border-debris-success'
                    : 'bg-space-700 border-space-600'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <div className="font-mono text-xs font-bold">{step.label}</div>
              <div className="text-xs text-gray-300 mt-1">{step.description}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Debris Analysis */}
      {selectedCluster && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="panel"
        >
          <h3 className="text-lg font-semibold mb-4">Debris Analysis: {selectedCluster.name}</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="card">
              <span className="text-xs text-gray-400">Total Debris</span>
              <div className="text-3xl font-bold text-debris-info">{rankedList.length}</div>
            </div>
            <div className="card">
              <span className="text-xs text-gray-400">Average Risk</span>
              <div className="text-3xl font-bold text-debris-warning">
                {(rankedList.reduce((sum, d) => sum + d.riskScore, 0) / rankedList.length).toFixed(0)}%
              </div>
            </div>
            <div className="card">
              <span className="text-xs text-gray-400">Collision Risk</span>
              <div className="text-3xl font-bold text-debris-danger">{selectedCluster.collisionRisk}%</div>
            </div>
          </div>

          {/* Ranked Targets */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Ranked Targets (by priority)</h4>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {rankedList.map((debris, idx) => (
                <motion.div
                  key={debris.id}
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-center gap-4 p-3 bg-space-700 rounded-lg border border-space-600 hover:border-debris-info transition cursor-pointer group"
                >
                  <div className="w-8 h-8 rounded-full bg-debris-info flex items-center justify-center font-bold text-xs text-space-900">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <div className="font-mono text-sm font-semibold">{debris.name}</div>
                    <div className="text-xs text-gray-400">
                      Alt: {debris.altitude}km | Vel: {debris.velocity}km/s | Size: {debris.size}m
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded text-xs font-bold ${
                    debris.riskScore >= 80 ? 'bg-red-900 text-red-300' :
                    debris.riskScore >= 60 ? 'bg-orange-900 text-orange-300' :
                    'bg-yellow-900 text-yellow-300'
                  }`}>
                    {debris.riskScore}%
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      {/* All Debris Overview */}
      {!selectedCluster && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="panel"
        >
          <h3 className="text-lg font-semibold mb-4">All Debris Objects ({debrisList.length})</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {debrisList.map((debris) => (
              <motion.div
                key={debris.id}
                className="card hover:border-debris-info transition cursor-pointer group"
                whileHover={{ scale: 1.02 }}
              >
                <div className="font-mono text-xs font-bold text-debris-info">{debris.id}</div>
                <div className="font-semibold text-sm mt-1">{debris.name}</div>
                <div className="text-xs text-gray-400 mt-2">
                  <div>Altitude: {debris.altitude}km</div>
                  <div>Velocity: {debris.velocity}km/s</div>
                  <div>Size: {debris.size}m</div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs font-bold">Risk: {debris.riskScore}%</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    debris.riskScore >= 80 ? 'bg-red-900' :
                    debris.riskScore >= 60 ? 'bg-orange-900' :
                    'bg-yellow-900'
                  }`}>
                    {debris.captureDifficulty}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Mission Status */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="panel"
      >
        <h3 className="text-lg font-semibold mb-4">Mission Status</h3>
        <div className="text-center py-8">
          <div className={`text-2xl font-bold mb-2 ${
            missionStatus === 'running' ? 'text-debris-success' :
            missionStatus === 'paused' ? 'text-debris-warning' :
            'text-gray-500'
          }`}>
            {missionStatus === 'running' ? '● MISSION ACTIVE' :
             missionStatus === 'paused' ? '⏸ MISSION PAUSED' :
             '○ MISSION IDLE'}
          </div>
          <p className="text-sm text-gray-400">
            {selectedCluster 
              ? `Ready to execute debris removal for ${selectedCluster.name}`
              : 'Select a cluster to begin mission planning'}
          </p>
        </div>
      </motion.section>
    </div>
  )
}
