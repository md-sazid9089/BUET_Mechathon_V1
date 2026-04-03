import React from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronRight, Radar, Search, Rocket, BarChart3, Map, Zap, RefreshCcw, ClipboardList, Target } from 'lucide-react'
import { useMissionStore } from '../../store/missionStore'
import { MISSION_STEPS } from '../../data/mockData'

const IconMap = {
  radar: Radar,
  search: Search,
  rocket: Rocket,
  chart: BarChart3,
  map: Map,
  zap: Zap,
  refresh: RefreshCcw,
  clipboard: ClipboardList,
  target: Target,
}

export const MissionTimelineStepper = () => {
  const currentStep = useMissionStore((state) => state.currentStep)

  const steps = [
    { step: 0, label: 'Predict', icon: 'radar', desc: 'Debris Trajectory' },
    { step: 1, label: 'Cluster', icon: 'search', desc: 'Cluster Discovery' },
    { step: 2, label: 'Launch', icon: 'rocket', desc: 'Window Select' },
    { step: 3, label: 'Rank', icon: 'chart', desc: 'Target Priority' },
    { step: 4, label: 'Route', icon: 'map', desc: 'Path Planning' },
    { step: 5, label: 'Track', icon: 'radar', desc: 'Live Tracking' },
    { step: 6, label: 'Capture', icon: 'target', desc: 'Capture Method' },
    { step: 7, label: 'Avoid', icon: 'zap', desc: 'Collision Avoidance' },
    { step: 8, label: 'Replan', icon: 'refresh', desc: 'Dynamic Replan' },
    { step: 9, label: 'Report', icon: 'clipboard', desc: 'Final Report' },
  ]

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full"
    >
      <div className="bg-astronaut-800 border border-astronaut-600 rounded-2xl p-6 shadow-card-lg">
        <h3 className="text-lg font-semibold mb-6 flex items-center gap-3">
          <span className="bg-gradient-to-r from-neon-blue to-neon-cyan bg-clip-text text-transparent uppercase tracking-wide">Mission Timeline</span>
        </h3>

        {/* Horizontal Timeline - Desktop */}
        <div className="hidden md:flex overflow-x-auto gap-2 pb-4 scrollbar-thin">
          {steps.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              {/* Step Circle with Glow */}
              <motion.div
                animate={{
                  backgroundColor:
                    currentStep === step.step
                      ? '#3B82F6'
                      : currentStep > step.step
                        ? '#22C55E'
                        : '#374151',
                  boxShadow:
                    currentStep === step.step
                      ? '0 0 20px rgba(59, 130, 246, 0.5)'
                      : currentStep > step.step
                        ? '0 0 15px rgba(34, 197, 94, 0.4)'
                        : 'none',
                  scale: currentStep === step.step ? 1.15 : 1,
                }}
                className="w-14 h-14 rounded-full flex items-center justify-center font-bold cursor-pointer border-2 transition-all duration-300"
                style={{
                  borderColor: currentStep === step.step ? '#3B82F6' : currentStep > step.step ? '#22C55E' : '#2A3558'
                }}
              >
                {currentStep > step.step ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <span className="text-sm font-mono">{step.step + 1}</span>
                )}
              </motion.div>

              {/* Icon & Label */}
              <motion.div
                animate={{
                  color: currentStep >= step.step ? '#3B82F6' : '#6B7280',
                }}
                transition={{ duration: 0.3 }}
              >
                {React.createElement(IconMap[step.icon], { className: 'w-5 h-5' })}
              </motion.div>
              <div className="text-xs font-mono font-bold text-center text-gray-300">{step.label}</div>
              <div className="text-xs text-gray-500 text-center max-w-[70px] leading-tight">{step.desc}</div>

              {/* Connector */}
              {idx < steps.length - 1 && (
                <motion.div
                  animate={{
                    backgroundColor: currentStep > step.step ? '#22C55E' : '#475569',
                  }}
                  className="w-10 h-1 hidden md:block mt-2 rounded-full transition-colors duration-300"
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Vertical Timeline - Mobile */}
        <div className="md:hidden space-y-4">
          {steps.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="flex items-center gap-4 p-3 bg-astronaut-700 rounded-lg border border-astronaut-600 hover:border-neon-blue transition-all duration-200"
            >
              {/* Step Indicator */}
              <motion.div
                animate={{
                  backgroundColor:
                    currentStep === step.step
                      ? '#3B82F6'
                      : currentStep > step.step
                        ? '#22C55E'
                        : '#374151',
                  boxShadow:
                    currentStep === step.step
                      ? '0 0 15px rgba(59, 130, 246, 0.4)'
                      : 'none',
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 border-2 transition-all duration-300"
                style={{
                  borderColor: currentStep === step.step ? '#3B82F6' : currentStep > step.step ? '#22C55E' : '#2A3558'
                }}
              >
                {currentStep > step.step ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-xs font-mono">{step.step + 1}</span>
                )}
              </motion.div>

              {/* Step Info */}
              <div className="flex-1">
                <div className="font-mono font-bold text-sm text-gray-300">{step.label}</div>
                <div className="text-xs text-gray-500">{step.desc}</div>
              </div>

              {/* Icon */}
              <motion.div
                animate={{
                  color: currentStep >= step.step ? '#3B82F6' : '#6B7280',
                }}
              >
                {React.createElement(IconMap[step.icon], { className: 'w-5 h-5' })}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Current Step Progress */}
        <div className="mt-8 p-4 bg-astronaut-700 rounded-lg border border-astronaut-600 hover:border-neon-blue transition-all duration-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-mono uppercase tracking-wide text-gray-400">Overall Progress</span>
            <span className="text-sm font-bold text-neon-blue font-mono">{((currentStep / 9) * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-astronaut-600 rounded-full h-2.5 overflow-hidden border border-astronaut-500">
            <motion.div
              animate={{ width: `${((currentStep + 1) / 10) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full rounded-full bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-purple"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
