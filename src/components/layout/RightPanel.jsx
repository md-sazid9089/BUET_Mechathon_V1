import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Brain, BarChart3 } from 'lucide-react'
import { useMissionStore } from '../../store/missionStore'

export const RightPanel = () => {
  const eventLog = useMissionStore((state) => state.eventLog)
  const currentTarget = useMissionStore((state) => state.currentTarget)
  const captureMethod = useMissionStore((state) => state.captureMethod)
  const uncertainty = useMissionStore((state) => state.uncertainty)

  return (
    <motion.aside
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      className="w-80 bg-space-800 border-l border-space-700 p-6 overflow-y-auto max-h-screen sticky top-16"
    >
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Brain className="w-5 h-5" />
        AI Insights
      </h2>

      {/* Decision Info */}
      {currentTarget && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="panel mb-6"
        >
          <h3 className="font-semibold text-sm mb-4">Current Target</h3>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-400">Object ID</span>
              <div className="font-mono text-sm font-bold text-debris-info">{currentTarget.id}</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Risk Score</span>
              <div className="font-mono text-sm font-bold text-debris-danger">{currentTarget.riskScore}%</div>
            </div>
            <div>
              <span className="text-xs text-gray-400">Capture Difficulty</span>
              <div className="font-mono text-sm font-bold text-debris-warning">{currentTarget.captureDifficulty}</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Capture Method */}
      {captureMethod && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="panel mb-6"
        >
          <h3 className="font-semibold text-sm mb-4">Recommended Method</h3>
          <div className="space-y-3">
            <div>
              <span className="text-xs text-gray-400">Method</span>
              <div className="font-mono text-sm font-bold text-debris-success">{captureMethod.name}</div>
            </div>
            <div className="text-xs text-gray-300">{captureMethod.description}</div>
            <div>
              <span className="text-xs text-gray-400">Success Rate</span>
              <div className="font-mono text-sm font-bold">{(captureMethod.successRate * 100).toFixed(0)}%</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Uncertainty Metric */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="panel mb-6"
      >
        <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          Uncertainty Level
        </h3>
        <div className="flex items-baseline gap-3">
          <div className="text-3xl font-bold text-debris-warning">{(uncertainty * 100).toFixed(0)}%</div>
          <p className="text-xs text-gray-400">
            {uncertainty > 0.7 ? 'High uncertainty detected' : 'Confidence level adequate'}
          </p>
        </div>
        <div className="w-full bg-space-600 rounded-full h-2 mt-3 overflow-hidden">
          <motion.div
            className="bg-debris-warning h-full"
            animate={{ width: `${uncertainty * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Event Log */}
      <div>
        <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          Event Log
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {eventLog.length === 0 ? (
            <p className="text-xs text-gray-500">No events yet</p>
          ) : (
            eventLog.map((event) => (
              <motion.div
                key={event.id}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className={`p-2 rounded text-xs border-l-2 ${
                  event.type === 'error'
                    ? 'bg-red-900/20 border-red-600 text-red-300'
                    : event.type === 'success'
                      ? 'bg-green-900/20 border-green-600 text-green-300'
                      : 'bg-blue-900/20 border-blue-600 text-blue-300'
                }`}
              >
                <div className="font-mono text-xs font-bold mb-1">{event.timestamp}</div>
                <div>{event.message}</div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.aside>
  )
}
