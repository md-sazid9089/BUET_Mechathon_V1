import React from 'react'
import { motion } from 'framer-motion'
import { Clock, Zap } from 'lucide-react'
import { LAUNCH_WINDOWS } from '../../../data/mockData'

export const LaunchWindowCard = () => {
  const [selectedWindow, setSelectedWindow] = React.useState(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-debris-info" />
        Launch Windows
      </h3>

      <div className="space-y-3">
        {LAUNCH_WINDOWS.map((window) => (
          <motion.div
            key={window.id}
            onClick={() => setSelectedWindow(window.id)}
            whileHover={{ scale: 1.02 }}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${
              selectedWindow === window.id
                ? 'bg-debris-info border-debris-info'
                : 'bg-space-700 border-space-600 hover:border-space-500'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="font-mono text-sm font-bold">{window.id}</div>
              <div className="flex items-center gap-1 bg-space-900 px-2 py-1 rounded text-xs">
                <Zap className="w-3 h-3" />
                {window.fuel_delta} fuel
              </div>
            </div>
            <div className="text-xs text-gray-300 mb-2">
              <div>{window.startTime.substring(11)}</div>
              <div>Duration: {window.duration} minutes</div>
              <div>Success: {(window.probability * 100).toFixed(0)}%</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-full mt-4 btn-success text-sm"
      >
        Select Launch Window
      </motion.button>
    </motion.div>
  )
}
