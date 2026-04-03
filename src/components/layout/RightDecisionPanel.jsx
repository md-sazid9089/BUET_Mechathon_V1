import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Lightbulb, TrendingDown, ChevronDown, Brain, ClipboardList, XCircle, CheckCircle, Info, ShieldAlert, Circle } from 'lucide-react'
import { useMissionStore } from '../../store/missionStore'
import { predictNextThreats, getRecommendation } from '../../utils/missionLogic'

export const RightDecisionPanel = () => {
  const [expandedSection, setExpandedSection] = useState('insights')

  const eventLog = useMissionStore((state) => state.eventLog)
  const currentTarget = useMissionStore((state) => state.currentTarget)
  const collisionRisk = useMissionStore((state) => state.collisionRisk)
  const uncertainty = useMissionStore((state) => state.uncertainty)
  const missionStatus = useMissionStore((state) => state.missionStatus)

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const iconMap = {
    '🤖': Brain,
    '💡': Lightbulb,
    '📋': ClipboardList,
    '🚨': ShieldAlert,
  }

  const Section = ({ id, title, icon, children, badge }) => {
    const IconComponent = iconMap[icon] || AlertTriangle
    return (
    <motion.div className="mb-4">
      <motion.button
        onClick={() => toggleSection(id)}
        whileHover={{ scale: 1.02 }}
        className="w-full flex items-center justify-between p-3 bg-space-700 hover:bg-space-600 rounded-lg border border-space-600 transition"
      >
        <div className="flex items-center gap-2 flex-1">
          <IconComponent className="w-5 h-5 text-debris-info" />
          <span className="font-mono font-bold text-sm">{title}</span>
          {badge && (
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="ml-auto text-xs font-bold px-2 py-1 bg-debris-error text-white rounded"
            >
              {badge}
            </motion.span>
          )}
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
  )
  }

  // Get recent threats
  const threats = predictNextThreats()
  const recentEvents = eventLog.slice(-5).reverse()

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      className="w-80 bg-space-800 border-l border-space-700 p-4 overflow-y-auto max-h-screen flex flex-col sticky top-16"
    >
      {/* AI Insights */}
      <Section id="insights" title="AI INSIGHTS" icon="🤖" badge={threats.length > 0 ? 'ALERT' : null}>
        <div className="space-y-3 text-xs">
          {threats.length > 0 ? (
            threats.slice(0, 3).map((threat, idx) => (
              <motion.div
                key={idx}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="p-2 bg-red-900 border border-red-700 rounded-lg"
              >
                <div className="flex gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-mono font-bold text-red-300">Threat Level: {threat.severity}</div>
                    <div className="text-gray-300 mt-1">{threat.description}</div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-2 bg-green-900 border border-green-700 rounded-lg text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" />
              All systems nominal
            </div>
          )}
        </div>
      </Section>

      {/* Recommendations */}
      <Section id="recommendations" title="RECOMMENDATIONS" icon="💡">
        <div className="space-y-3 text-xs">
          {currentTarget ? (
            <>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="p-3 bg-blue-900 border border-blue-700 rounded-lg"
              >
                <div className="flex gap-2">
                  <Lightbulb className="w-4 h-4 text-blue-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-mono font-bold text-blue-300">Primary Action</div>
                    <div className="text-gray-300 mt-1">
                      Engage capture sequence for {currentTarget.id}
                    </div>
                  </div>
                </div>
              </motion.div>
              {collisionRisk > 60 && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-3 bg-orange-900 border border-orange-700 rounded-lg"
                >
                  <div className="flex gap-2">
                    <TrendingDown className="w-4 h-4 text-orange-300 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-mono font-bold text-orange-300">Risk Mitigation</div>
                      <div className="text-gray-300 mt-1">
                        Reduce approach speed to mitigate collision risk
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <div className="text-gray-400 p-2 text-center">
              Select a target to see recommendations
            </div>
          )}
        </div>
      </Section>

      {/* Critical Alerts */}
      {(collisionRisk > 70 || uncertainty > 80) && (
        <Section 
          id="alerts" 
          title="CRITICAL ALERTS" 
          icon="🚨" 
          badge={collisionRisk > 70 ? 'CRITICAL' : 'WARNING'}
        >
          <div className="space-y-2 text-xs">
            {collisionRisk > 70 && (
              <motion.div
                animate={{ borderColor: ['rgb(220, 38, 38)', 'rgb(248, 113, 113)', 'rgb(220, 38, 38)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="p-2 bg-red-950 border border-red-700 rounded-lg"
              >
                <div className="flex items-center gap-2 font-mono font-bold text-red-400"><AlertTriangle className="w-4 h-4" /> HIGH COLLISION RISK</div>
                <div className="text-gray-300 mt-1">Current: {collisionRisk}%</div>
              </motion.div>
            )}
            {uncertainty > 80 && (
              <motion.div
                animate={{ borderColor: ['rgb(217, 119, 6)', 'rgb(251, 146, 60)', 'rgb(217, 119, 6)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="p-2 bg-orange-950 border border-orange-700 rounded-lg"
              >
                <div className="flex items-center gap-2 font-mono font-bold text-orange-400"><AlertTriangle className="w-4 h-4" /> HIGH UNCERTAINTY</div>
                <div className="text-gray-300 mt-1">Current: {uncertainty}%</div>
              </motion.div>
            )}
          </div>
        </Section>
      )}

      {/* Event Log */}
      <Section id="events" title="RECENT EVENTS" icon="📋">
        <div className="space-y-2 text-xs max-h-64 overflow-y-auto">
          {recentEvents.length > 0 ? (
            recentEvents.map((event, idx) => {
              const colorClass = 
                event.type === 'error' ? 'bg-red-900 text-red-200' :
                event.type === 'success' ? 'bg-green-900 text-green-200' :
                event.type === 'warning' ? 'bg-orange-900 text-orange-200' :
                'bg-blue-900 text-blue-200'
              
              const IconComponent = 
                event.type === 'error' ? XCircle :
                event.type === 'success' ? CheckCircle :
                event.type === 'warning' ? AlertTriangle :
                Info

              return (
                <motion.div
                  key={event.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className={`p-2 rounded-lg border ${colorClass} border-opacity-40`}
                >
                  <div className="flex gap-2">
                    <IconComponent className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-mono font-bold">{event.message}</div>
                      <div className="text-xs opacity-75">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="text-center text-gray-400 p-4 font-mono text-xs">
              No events yet
            </div>
          )}
        </div>
      </Section>

      {/* Mission Status */}
      <div className="mt-auto pt-4 border-t border-space-700">
        <motion.div
          animate={{
            backgroundColor: missionStatus === 'running' ? ['rgba(16, 185, 129, 0.1)', 'rgba(16, 185, 129, 0.2)'] : undefined,
          }}
          transition={{ duration: 1, repeat: missionStatus === 'running' ? Infinity : 0 }}
          className="p-3 rounded-lg border border-space-600 text-center"
        >
          <div className="font-mono font-bold text-xs text-gray-400 mb-2">MISSION STATUS</div>
          <div className={`text-sm font-bold flex items-center gap-2 ${
            missionStatus === 'running' ? 'text-debris-success' :
            missionStatus === 'paused' ? 'text-debris-warning' :
            'text-gray-400'
          }`}>
            {missionStatus === 'running' ? <CheckCircle className="w-4 h-4" /> :
             missionStatus === 'paused' ? <AlertTriangle className="w-4 h-4" /> :
             <Circle className="w-4 h-4" />}
            {missionStatus === 'running' ? 'ACTIVE' :
             missionStatus === 'paused' ? 'PAUSED' :
             'IDLE'}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
