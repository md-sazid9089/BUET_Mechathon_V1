import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { useMissionStore } from '../../../store/missionStore'

export const EventLogPanel = () => {
  const eventLog = useMissionStore((state) => state.eventLog)

  const getEventStyle = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-900/20 border-l-2 border-red-600 text-red-300'
      case 'success':
        return 'bg-green-900/20 border-l-2 border-green-600 text-green-300'
      case 'warning':
        return 'bg-yellow-900/20 border-l-2 border-yellow-600 text-yellow-300'
      default:
        return 'bg-blue-900/20 border-l-2 border-blue-600 text-blue-300'
    }
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'error':
        return '❌'
      case 'success':
        return '✅'
      case 'warning':
        return '⚠️'
      default:
        return 'ℹ️'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-debris-info" />
        Mission Events
      </h3>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {eventLog.length === 0 ? (
          <div className="text-sm text-gray-400 p-4 text-center">No events yet</div>
        ) : (
          eventLog.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-3 rounded-lg ${getEventStyle(event.type)}`}
            >
              <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0">{getEventIcon(event.type)}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs font-bold mb-1">{event.timestamp}</div>
                  <div className="text-sm break-words">{event.message}</div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {eventLog.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="w-full mt-4 px-3 py-2 bg-space-700 hover:bg-space-600 rounded-lg text-xs font-mono border border-space-600 transition"
        >
          Clear Log
        </motion.button>
      )}
    </motion.div>
  )
}
