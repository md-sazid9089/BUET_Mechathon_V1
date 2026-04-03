import React from 'react'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import { useMissionStore } from '../../../store/missionStore'
import { CAPTURE_METHODS } from '../../../data/mockData'
import { calculateSuccessProbability } from '../../../utils/missionLogic'

export const CaptureRecommendationCard = () => {
  const currentTarget = useMissionStore((state) => state.currentTarget)
  const captureMethod = useMissionStore((state) => state.captureMethod)

  if (!currentTarget) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel opacity-50"
      >
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Capture Method
        </h3>
        <p className="text-sm text-gray-400">Select a target first</p>
      </motion.div>
    )
  }

  const successProb = calculateSuccessProbability(currentTarget, captureMethod || CAPTURE_METHODS[0])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-debris-info" />
        Capture Strategy
      </h3>

      {/* Current Target */}
      <div className="bg-space-700 rounded-lg p-4 mb-4 border border-space-600">
        <div className="text-xs text-gray-400 mb-2">TARGET</div>
        <div className="font-mono font-bold text-sm mb-1">{currentTarget.id}</div>
        <div className="text-xs text-gray-300 space-y-1">
          <div>Difficulty: {currentTarget.captureDifficulty}</div>
          <div>Risk Score: {currentTarget.riskScore}%</div>
          <div>Size: {currentTarget.size}m</div>
        </div>
      </div>

      {/* Recommended Method */}
      {captureMethod && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-space-700 rounded-lg p-4 mb-4 border border-debris-success"
        >
          <div className="text-xs text-gray-400 mb-2">RECOMMENDED METHOD</div>
          <div className="font-mono font-bold text-sm mb-2 text-debris-success">{captureMethod.name}</div>
          <div className="text-xs text-gray-300 mb-3">{captureMethod.description}</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="bg-space-900 p-2 rounded">
              <div className="text-gray-400 mb-1">Success</div>
              <div className="font-bold text-green-400">{(successProb * 100).toFixed(0)}%</div>
            </div>
            <div className="bg-space-900 p-2 rounded">
              <div className="text-gray-400 mb-1">Difficulty</div>
              <div className="font-bold">{captureMethod.difficulty}</div>
            </div>
            <div className="bg-space-900 p-2 rounded">
              <div className="text-gray-400 mb-1">Fuel Cost</div>
              <div className="font-bold text-yellow-400">{captureMethod.fuel}%</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* All Methods */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 mb-2">AVAILABLE METHODS</div>
        <div className="space-y-2">
          {CAPTURE_METHODS.slice(0, 3).map((method) => {
            const prob = calculateSuccessProbability(currentTarget, method)
            return (
              <motion.button
                key={method.id}
                whileHover={{ scale: 1.02 }}
                className={`w-full p-2 rounded-lg text-left text-xs transition border ${
                  captureMethod?.id === method.id
                    ? 'bg-debris-success border-debris-success'
                    : 'bg-space-900 border-space-700 hover:border-space-500'
                }`}
              >
                <div className="font-bold flex justify-between items-center">
                  <span>{method.name}</span>
                  <span className="text-xs">{(prob * 100).toFixed(0)}%</span>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full btn-danger text-sm"
      >
        Execute Capture
      </motion.button>
    </motion.div>
  )
}
