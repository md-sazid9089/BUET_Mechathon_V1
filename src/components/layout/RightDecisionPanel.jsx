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
        className="w-full flex items-center justify-between p-3 bg-astronaut-700 hover:bg-astronaut-600 rounded-xl border border-astronaut-600 transition-all duration-200 hover:shadow-glow-blue"
      >
        <div className="flex items-center gap-3 flex-1">
          <IconComponent className="w-5 h-5 text-neon-blue" />
          <span className="font-mono font-bold text-sm uppercase tracking-wide">{title}</span>
          {badge && (
            <motion.span
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="ml-auto text-xs font-bold px-2.5 py-1 bg-status-danger text-white rounded-lg font-mono"
            >
              {badge}
            </motion.span>
          )}
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
  )
  }

  // Get recent threats
  const threats = predictNextThreats()
  const recentEvents = eventLog.slice(-5).reverse()

  return (
    <motion.div
      initial={{ x: 300 }}
      animate={{ x: 0 }}
      className="w-80 bg-astronaut-900 border-l border-astronaut-600 p-5 overflow-y-auto max-h-screen flex flex-col sticky top-16 shadow-card-lg"
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
                className="p-3 bg-status-danger bg-opacity-20 border border-status-danger border-opacity-40 rounded-lg hover:shadow-glow-red transition-all duration-200"
              >
                <div className="flex gap-3">
                  <AlertTriangle className="w-4 h-4 text-status-danger flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-mono font-bold text-status-danger uppercase tracking-wide">Threat Level: {threat.severity}</div>
                    <div className="text-gray-300 mt-1.5 leading-relaxed">{threat.description}</div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-3 bg-status-success bg-opacity-20 border border-status-success border-opacity-40 rounded-lg text-center flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-status-success" />
              <span className="font-mono text-status-success uppercase tracking-wide">All systems nominal</span>
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
                className="p-3 bg-neon-blue bg-opacity-20 border border-neon-blue border-opacity-40 rounded-lg hover:shadow-glow-blue transition-all duration-200"
              >
                <div className="flex gap-3">
                  <Lightbulb className="w-4 h-4 text-neon-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-mono font-bold text-neon-blue uppercase tracking-wide">Primary Action</div>
                    <div className="text-gray-300 mt-1.5">
                      Engage capture sequence for <span className="text-neon-cyan font-bold">{currentTarget.id}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              {collisionRisk > 60 && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="p-3 bg-status-warning bg-opacity-20 border border-status-warning border-opacity-40 rounded-lg hover:shadow-glow-red transition-all duration-200"
                >
                  <div className="flex gap-3">
                    <TrendingDown className="w-4 h-4 text-status-warning flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-mono font-bold text-status-warning uppercase tracking-wide">Risk Mitigation</div>
                      <div className="text-gray-300 mt-1.5">
                        Reduce approach speed to mitigate collision risk
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          ) : (
            <div className="text-gray-400 p-3 text-center font-mono italic">
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
          <div className="space-y-2.5 text-xs">
            {collisionRisk > 70 && (
              <motion.div
                animate={{ borderColor: ['rgb(239, 68, 68)', 'rgb(248, 113, 113)', 'rgb(239, 68, 68)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="p-3 bg-status-danger bg-opacity-30 border-2 border-status-danger rounded-lg shadow-glow-red"
              >
                <div className="flex items-center gap-3 font-mono font-bold text-status-danger uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  High Collision Risk
                </div>
                <div className="text-gray-300 mt-2 text-xs">Current: <span className="text-status-danger font-bold">{collisionRisk}%</span></div>
              </motion.div>
            )}
            {uncertainty > 80 && (
              <motion.div
                animate={{ borderColor: ['rgb(245, 158, 11)', 'rgb(251, 146, 60)', 'rgb(245, 158, 11)'] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="p-3 bg-status-warning bg-opacity-30 border-2 border-status-warning rounded-lg"
              >
                <div className="flex items-center gap-3 font-mono font-bold text-status-warning uppercase tracking-wide">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  High Uncertainty
                </div>
                <div className="text-gray-300 mt-2 text-xs">Current: <span className="text-status-warning font-bold">{uncertainty}%</span></div>
              </motion.div>
            )}
          </div>
        </Section>
      )}

      {/* Event Log */}
      <Section id="events" title="RECENT EVENTS" icon="📋">
        <div className="space-y-2.5 text-xs max-h-64 overflow-y-auto">
          {recentEvents.length > 0 ? (
            recentEvents.map((event, idx) => {
              const bgClass = 
                event.type === 'error' ? 'bg-status-danger bg-opacity-20 border-status-danger' :
                event.type === 'success' ? 'bg-status-success bg-opacity-20 border-status-success' :
                event.type === 'warning' ? 'bg-status-warning bg-opacity-20 border-status-warning' :
                'bg-neon-blue bg-opacity-20 border-neon-blue'
              
              const textClass = 
                event.type === 'error' ? 'text-status-danger' :
                event.type === 'success' ? 'text-status-success' :
                event.type === 'warning' ? 'text-status-warning' :
                'text-neon-blue'
              
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
                  className={`p-2.5 rounded-lg border border-opacity-40 ${bgClass}`}
                >
                  <div className="flex gap-2.5">
                    <IconComponent className={`w-4 h-4 flex-shrink-0 mt-0.5 ${textClass}`} />
                    <div className="flex-1">
                      <div className={`font-mono font-bold ${textClass}`}>{event.message}</div>
                      <div className="text-xs text-gray-500 opacity-75 mt-1">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <div className="text-center text-gray-500 p-4 font-mono text-xs italic">
              No events yet
            </div>
          )}
        </div>
      </Section>

      {/* Mission Status */}
      <div className="mt-auto pt-4 border-t border-astronaut-600">
        <motion.div
          animate={{
            backgroundColor: missionStatus === 'running' ? ['rgba(59, 130, 246, 0.1)', 'rgba(59, 130, 246, 0.15)'] : undefined,
            borderColor: missionStatus === 'running' ? ['rgb(59, 130, 246)', 'rgb(6, 182, 212)'] : undefined,
          }}
          transition={{ duration: 2, repeat: missionStatus === 'running' ? Infinity : 0 }}
          className="p-3 rounded-lg border border-astronaut-600 text-center hover:border-neon-blue transition-all duration-200"
        >
          <div className="font-mono font-bold text-xs text-gray-500 mb-2 uppercase tracking-wider">MISSION STATUS</div>
          <div className={`text-sm font-bold font-mono flex items-center justify-center gap-3 ${
            missionStatus === 'running' ? 'text-status-success' :
            missionStatus === 'paused' ? 'text-status-warning' :
            'text-gray-500'
          }`}>
            {missionStatus === 'running' ? <CheckCircle className="w-5 h-5" /> :
             missionStatus === 'paused' ? <AlertTriangle className="w-5 h-5" /> :
             <Circle className="w-5 h-5" />}
            {missionStatus === 'running' ? 'ACTIVE' :
             missionStatus === 'paused' ? 'PAUSED' :
             'IDLE'}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
