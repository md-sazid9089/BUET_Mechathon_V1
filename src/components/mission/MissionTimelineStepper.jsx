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
      <div className="bg-space-800 border border-space-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6">Mission Timeline</h3>

        {/* Horizontal Timeline - Desktop */}
        <div className="hidden md:flex overflow-x-auto gap-2 pb-4">
          {steps.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              {/* Step Circle */}
              <motion.div
                animate={{
                  backgroundColor:
                    currentStep === step.step
                      ? '#3b82f6'
                      : currentStep > step.step
                        ? '#10b981'
                        : '#374151',
                  scale: currentStep === step.step ? 1.1 : 1,
                }}
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold cursor-pointer border-2 border-space-600 hover:border-debris-info transition"
              >
                {currentStep > step.step ? (
                  <Check className="w-6 h-6 text-green-300" />
                ) : (
                  <span className="text-sm">{step.step + 1}</span>
                )}
              </motion.div>

              {/* Icon & Label */}
              {React.createElement(IconMap[step.icon], { className: 'w-5 h-5 text-debris-info' })}
              <div className="text-xs font-mono font-bold text-center">{step.label}</div>
              <div className="text-xs text-gray-400 text-center max-w-[60px]">{step.desc}</div>

              {/* Connector */}
              {idx < steps.length - 1 && (
                <motion.div
                  animate={{
                    backgroundColor: currentStep > step.step ? '#10b981' : '#374151',
                  }}
                  className="w-8 h-1 hidden md:block mt-2"
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
              className="flex items-center gap-4"
            >
              {/* Step Indicator */}
              <motion.div
                animate={{
                  backgroundColor:
                    currentStep === step.step
                      ? '#3b82f6'
                      : currentStep > step.step
                        ? '#10b981'
                        : '#374151',
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0 border-2 border-space-600"
              >
                {currentStep > step.step ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-xs">{step.step + 1}</span>
                )}
              </motion.div>

              {/* Step Info */}
              <div className="flex-1">
                <div className="font-mono font-bold text-sm">{step.label}</div>
                <div className="text-xs text-gray-400">{step.desc}</div>
              </div>

              {/* Icon */}
              <span className="text-lg">{step.icon}</span>
            </motion.div>
          ))}
        </div>

        {/* Current Step Progress */}
        <div className="mt-6 p-4 bg-space-700 rounded-lg border border-space-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-mono">Progress</span>
            <span className="text-sm font-bold text-debris-info">{((currentStep / 9) * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-space-600 rounded-full h-2 overflow-hidden">
            <motion.div
              animate={{ width: `${((currentStep + 1) / 10) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-debris-info to-debris-success h-full"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}
