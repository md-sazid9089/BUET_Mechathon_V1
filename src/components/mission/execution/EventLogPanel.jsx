import React from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, XCircle, CheckCircle, Info } from 'lucide-react'
import { useMissionStore } from '../../../store/missionStore'

export const EventLogPanel = () => {
  const eventLog = useMissionStore((state) => state.eventLog)

  const getEventStyle = (type) => {
    switch (type) {
      case 'error':
        return 'bg-status-danger bg-opacity-15 border-l-4 border-status-danger text-status-danger hover:bg-opacity-25'
      case 'success':
        return 'bg-status-success bg-opacity-15 border-l-4 border-status-success text-status-success hover:bg-opacity-25'
      case 'warning':
        return 'bg-status-warning bg-opacity-15 border-l-4 border-status-warning text-status-warning hover:bg-opacity-25'
      default:
        return 'bg-neon-blue bg-opacity-15 border-l-4 border-neon-blue text-neon-blue hover:bg-opacity-25'
    }
  }

  const getEventIcon = (type) => {
    switch (type) {
      case 'error':
        return XCircle
      case 'success':
        return CheckCircle
      case 'warning':
        return AlertTriangle
      default:
        return Info
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="panel"
    >
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-neon-blue" />
        <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent uppercase tracking-wide">Mission Events</span>
      </h3>

      <div className="space-y-2.5 max-h-64 overflow-y-auto">
        {eventLog.length === 0 ? (
          <div className="text-sm text-gray-500 p-6 text-center font-mono italic">
            No events recorded yet
          </div>
        ) : (
          eventLog.map((event, idx) => {
            const IconComponent = getEventIcon(event.type)
            return (
            <motion.div
              key={event.id}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className={`p-3 rounded-lg transition-all duration-200 ${getEventStyle(event.type)}`}
            >
              <div className="flex items-start gap-3">
                <IconComponent className="w-5 h-5 flex-shrink-0 mt-0.5 opacity-80" />
                <div className="flex-1 min-w-0">
                  <div className="font-mono text-xs font-bold opacity-75 mb-1.5">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </div>
                  <div className="text-sm break-words font-medium">{event.message}</div>
                </div>
              </div>
            </motion.div>
          )
          })
        )}
      </div>

      {eventLog.length > 0 && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="w-full mt-4 px-4 py-2 bg-astronaut-700 hover:bg-astronaut-600 hover:border-neon-blue rounded-lg text-xs font-mono font-bold border border-astronaut-600 transition-all duration-200 text-gray-300 uppercase tracking-wide"
        >
          Clear Log
        </motion.button>
      )}
    </motion.div>
  )
}
