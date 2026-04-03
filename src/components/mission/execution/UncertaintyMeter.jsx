import React from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { useMissionStore } from '../../../store/missionStore'

export const UncertaintyMeter = () => {
  const uncertainty = useMissionStore((state) => state.uncertainty)

  const getUncertaintyStatus = (value) => {
    if (value > 0.8) return { level: 'CRITICAL', color: 'red', advice: 'Halt operations and recalibrate' }
    if (value > 0.6) return { level: 'HIGH', color: 'orange', advice: 'Increase sensor monitoring' }
    if (value > 0.4) return { level: 'MODERATE', color: 'yellow', advice: 'Proceed with caution' }
    return { level: 'LOW', color: 'green', advice: 'Confidence level adequate' }
  }

  const status = getUncertaintyStatus(uncertainty)

  const ColorMap = {
    red: { bg: 'bg-red-900/30', border: 'border-red-600', text: 'text-red-400' },
    orange: { bg: 'bg-orange-900/30', border: 'border-orange-600', text: 'text-orange-400' },
    yellow: { bg: 'bg-yellow-900/30', border: 'border-yellow-600', text: 'text-yellow-400' },
    green: { bg: 'bg-green-900/30', border: 'border-green-600', text: 'text-green-400' },
  }

  const colors = ColorMap[status.color]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`panel border-l-4 border-${status.color}-600 ${colors.bg} ${colors.border}`}
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertCircle className={`w-5 h-5 ${colors.text}`} />
        Uncertainty Assessment
      </h3>

      {/* Main Meter */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-mono font-bold">UNCERTAINTY LEVEL</div>
          <motion.div
            animate={{ scale: uncertainty > 0.7 ? [1, 1.1, 1] : 1 }}
            transition={{ repeat: uncertainty > 0.7 ? Infinity : 0, duration: 1 }}
            className={`text-3xl font-bold ${colors.text}`}
          >
            {(uncertainty * 100).toFixed(1)}%
          </motion.div>
        </div>

        {/* Circular Gauge */}
        <div className="relative w-full h-32 mb-4">
          <svg viewBox="0 0 200 120" className="w-full h-full">
            {/* Background arc */}
            <path
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke="rgba(107, 114, 128, 0.3)"
              strokeWidth="8"
              strokeLinecap="round"
            />
            {/* Filled arc */}
            <motion.path
              animate={{
                pathLength: uncertainty,
              }}
              transition={{ duration: 0.5 }}
              d="M 20 100 A 80 80 0 0 1 180 100"
              fill="none"
              stroke={`rgb(${status.color === 'red' ? '239, 68, 68' : status.color === 'orange' ? '249, 115, 22' : status.color === 'yellow' ? '234, 179, 8' : '34, 197, 94'})`}
              strokeWidth="8"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-gray-400">Confidence</div>
              <div className={`text-xl font-bold ${colors.text}`}>
                {((1 - uncertainty) * 100).toFixed(0)}%
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className={`text-center p-2 rounded-lg ${colors.bg} border border-opacity-50 ${colors.border}`}>
          <div className="text-sm font-mono font-bold">{status.level}</div>
          <div className="text-xs text-gray-300 mt-1">{status.advice}</div>
        </div>
      </div>

      {/* Factors */}
      <div className="bg-space-900/50 rounded-lg p-3 space-y-2">
        <div className="text-xs font-bold text-gray-400 mb-2">CONTRIBUTING FACTORS</div>
        {[
          { factor: 'Sensor Noise', impact: 0.3 },
          { factor: 'Target Tracking', impact: 0.25 },
          { factor: 'Environmental', impact: 0.2 },
          { factor: 'System Drift', impact: 0.25 },
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-full bg-space-700 rounded-full h-1 overflow-hidden">
              <motion.div
                animate={{ width: `${item.impact * 100}%` }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-blue-500 h-full"
              />
            </div>
            <span className="text-xs text-gray-400 w-20">{item.factor}</span>
          </div>
        ))}
      </div>

      {/* Recommendation */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 p-3 bg-space-700 rounded-lg border border-space-600"
      >
        <div className="text-xs font-bold text-gray-300 mb-1">RECOMMENDATION</div>
        <div className="text-xs text-gray-400">
          {uncertainty > 0.7
            ? 'Consider recalibrating sensors and increasing verification cycles before proceeding.'
            : uncertainty > 0.5
              ? 'Current uncertainty acceptable. Maintain heightened monitoring.'
              : 'Proceed with standard operational parameters.'}
        </div>
      </motion.div>
    </motion.div>
  )
}
