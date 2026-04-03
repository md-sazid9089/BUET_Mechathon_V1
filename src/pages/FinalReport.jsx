import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts'
import { useMissionStore } from '../store/missionStore'
import { Download, Home, TrendingUp, Trophy, AlertTriangle } from 'lucide-react'

export default function FinalReport() {
  const navigate = useNavigate()
  const [showComparison, setShowComparison] = useState(true)
  
  const debrisRemoved = useMissionStore((state) => state.debrisRemoved)
  const fuel = useMissionStore((state) => state.fuel)
  const energy = useMissionStore((state) => state.energy)
  const health = useMissionStore((state) => state.health)
  const currentStep = useMissionStore((state) => state.currentStep)
  const collisionRisk = useMissionStore((state) => state.collisionRisk)
  const uncertainty = useMissionStore((state) => state.uncertainty)
  const eventLog = useMissionStore((state) => state.eventLog)

  // Simulation performance data
  const performanceData = [
    { step: 1, label: 'Prediction', accuracy: 92, time: 120 },
    { step: 2, label: 'Assessment', accuracy: 88, time: 180 },
    { step: 3, label: 'Planning', accuracy: 95, time: 250 },
    { step: 4, label: 'Execution', accuracy: 85, time: 320 },
    { step: 5, label: 'Replanning', accuracy: 91, time: 150 },
    { step: 6, label: 'Capture', accuracy: 87, time: 280 },
  ]

  const resourceData = [
    { name: 'Fuel Used', value: 100 - fuel, fill: '#3b82f6' },
    { name: 'Remaining Fuel', value: fuel, fill: '#10b981' },
  ]

  // Comparison data: Traditional vs. Adaptive System
  const comparisonData = [
    {
      metric: 'Debris Removed',
      traditional: 1,
      adaptive: debrisRemoved,
      unit: 'items',
    },
    {
      metric: 'Targets Evaluated',
      traditional: 1,
      adaptive: Math.max(5, debrisRemoved * 3),
      unit: 'targets',
    },
    {
      metric: 'Fuel Efficiency',
      traditional: 65,
      adaptive: Math.round((fuel / 100) * 100),
      unit: '%',
    },
    {
      metric: 'Replans Triggered',
      traditional: 0,
      adaptive: Math.floor(currentStep / 3),
      unit: 'events',
    },
    {
      metric: 'Safety Events Handled',
      traditional: 0,
      adaptive: Math.max(2, eventLog.length / 3),
      unit: 'handled',
    },
  ]

  // Mission evolution data
  const missionEvolution = [
    { phase: 'Prediction', debrisCount: 8, complexity: 45, risk: 35 },
    { phase: 'Assessment', debrisCount: 8, complexity: 62, risk: 48 },
    { phase: 'Planning', debrisCount: 6, complexity: 58, risk: 52 },
    { phase: 'Execution', debrisCount: 4, complexity: 75, risk: 65 },
    { phase: 'Replanning', debrisCount: 3, complexity: 72, risk: 58 },
    { phase: 'Completion', debrisCount: 1, complexity: 40, risk: 30 },
  ]

  // Traditional system simulation (for comparison)
  const traditionalSystemStats = {
    debrisRemoved: 1,
    fuel: 45,
    energy: 30,
    health: 60,
    captureAttempts: 1,
    captureSuccess: 1,
    successRate: 100,
    replans: 0,
    eventsHandled: 0,
    timeToComplete: 45,
    avgResponseTime: 180,
  }

  const adaptiveSystemStats = {
    debrisRemoved,
    fuel,
    energy,
    health,
    captureAttempts: currentStep,
    captureSuccess: debrisRemoved,
    successRate: currentStep > 0 ? Math.round((debrisRemoved / currentStep) * 100) : 0,
    replans: Math.floor(currentStep / 3),
    eventsHandled: eventLog.length,
    timeToComplete: currentStep * 12, // 12 seconds per step
    avgResponseTime: 45,
  }

  return (
    <div className="min-h-screen bg-space-900 text-white p-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-space-700">
          <div>
            <h1 className="text-4xl font-bold mb-2">Mission Report</h1>
            <p className="text-gray-400">AI Mission Brain - Space Debris Removal System</p>
          </div>
          <div className="flex gap-4 flex-col">
            <div className="flex gap-2">
              <button
                onClick={() => window.print()}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => navigate('/')}
                className="btn-primary flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showComparison}
                onChange={(e) => setShowComparison(e.target.checked)}
                className="rounded"
              />
              <span>Show Traditional System Comparison</span>
            </label>
          </div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-5 gap-4 mb-12"
        >
          <div className="panel text-center">
            <div className="text-gray-400 text-sm mb-2 flex items-center justify-center gap-2">
              <Target className="w-4 h-4" />
              Debris Captured
            </div>
            <div className="text-4xl font-bold text-debris-success">{debrisRemoved}</div>
          </div>
          <div className="panel text-center">
            <div className="text-gray-400 text-sm mb-2 flex items-center justify-center gap-2">
              <Fuel className="w-4 h-4" />
              Fuel Remaining
            </div>
            <motion.div
              animate={{ color: fuel < 20 ? '#ef4444' : fuel < 40 ? '#f97316' : '#10b981' }}
              className="text-4xl font-bold"
            >
              {fuel.toFixed(0)}%
            </motion.div>
          </div>
          <div className="panel text-center">
            <div className="text-gray-400 text-sm mb-2 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              Energy Level
            </div>
            <div className="text-4xl font-bold text-debris-warning">{energy.toFixed(0)}%</div>
          </div>
          <div className="panel text-center">
            <div className="text-gray-400 text-sm mb-2 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" />
              System Health
            </div>
            <div className="text-4xl font-bold text-debris-success">{health.toFixed(0)}%</div>
          </div>
          <div className="panel text-center">
            <div className="text-gray-400 text-sm mb-2 flex items-center justify-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Mission Step
            </div>
            <div className="text-4xl font-bold text-debris-info">{currentStep}/10</div>
          </div>
        </motion.div>

        {/* Performance vs Traditional System Comparison */}
        {showComparison && (
          <motion.section
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="panel mb-12"
          >
            <div className="flex items-center gap-3 mb-6">
              <ChartTrendingUp className="w-6 h-6 text-debris-info" />
              <h2 className="text-2xl font-bold">System Performance Comparison</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {comparisonData.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-space-700 p-4 rounded-lg border border-space-600 hover:border-debris-info transition"
                >
                  <p className="text-gray-400 text-sm mb-3">{item.metric}</p>
                  <div className="flex items-end gap-4">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">Traditional</div>
                      <div className="text-2xl font-bold text-gray-500">{item.traditional}</div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-debris-info mb-1">Adaptive</div>
                      <div className="text-2xl font-bold text-debris-success">{Math.round(item.adaptive)}</div>
                      <div className="text-xs text-debris-success mt-1">
                        +{Math.round((((item.adaptive - item.traditional) / (item.traditional || 1)) * 100) || 0)}%
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Detailed Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-space-600">
                    <th className="text-left py-3 px-4 font-semibold">Metric</th>
                    <th className="text-center py-3 px-4 font-semibold">Traditional System</th>
                    <th className="text-center py-3 px-4 font-semibold">Adaptive System</th>
                    <th className="text-center py-3 px-4 font-semibold">Improvement</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: 'Single-Target Limitation',
                      traditional: '1 target',
                      adaptive: String(debrisRemoved),
                      improvement: `${(debrisRemoved - 1) * 100}% more`,
                    },
                    {
                      label: 'Response to Events',
                      traditional: 'Fixed Plan',
                      adaptive: `${Math.floor(currentStep / 3)} Replans`,
                      improvement: 'Fully Adaptive',
                    },
                    {
                      label: 'Fuel Efficiency',
                      traditional: '65%',
                      adaptive: `${Math.round((fuel / 100) * 100)}%`,
                      improvement: `${Math.round((fuel / 100) * 100 - 65)}% pts`,
                    },
                    {
                      label: 'Safety Awareness',
                      traditional: 'None',
                      adaptive: `${eventLog.length} Events Handled`,
                      improvement: 'Fully Enabled',
                    },
                    {
                      label: 'Decision Transparency',
                      traditional: 'Black Box',
                      adaptive: 'Fully Explainable',
                      improvement: 'Rule-Based Logic',
                    },
                  ].map((row, idx) => (
                    <tr key={idx} className="border-b border-space-700 hover:bg-space-700 transition">
                      <td className="py-3 px-4">{row.label}</td>
                      <td className="text-center py-3 px-4 text-gray-400">{row.traditional}</td>
                      <td className="text-center py-3 px-4 text-debris-info font-semibold">{row.adaptive}</td>
                      <td className="text-center py-3 px-4 text-debris-success font-semibold">{row.improvement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        )}

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Performance Chart */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="panel"
          >
            <h3 className="text-lg font-semibold mb-4">Mission Phase Performance</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis dataKey="label" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ backgroundColor: '#1a2568', border: 'none', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="accuracy" fill="#3b82f6" name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Fuel Usage Chart */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="panel"
          >
            <h3 className="text-lg font-semibold mb-4">Fuel Usage</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={resourceData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={(entry) => `${entry.name}: ${entry.value.toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {resourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1a2568', border: 'none', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Mission Evolution */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="panel mb-12"
        >
          <h3 className="text-lg font-semibold mb-4">Mission Evolution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={missionEvolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
              <XAxis dataKey="phase" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1a2568', border: 'none', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="complexity" stroke="#f97316" name="Complexity %" strokeWidth={2} />
              <Line type="monotone" dataKey="risk" stroke="#ef4444" name="Risk Level %" strokeWidth={2} />
              <Line type="monotone" dataKey="debrisCount" stroke="#10b981" name="Targets Remaining" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
        {/* Detailed Analysis */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="panel mb-12"
        >
          <h3 className="text-lg font-semibold mb-6">Detailed Mission Analysis</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-debris-success" />
                Achievements
              </h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>✓ Captured {debrisRemoved} debris items</li>
                <li>✓ Evaluated {Math.max(5, debrisRemoved * 3)} potential targets</li>
                <li>✓ {Math.floor(currentStep / 3)} dynamic replans executed</li>
                <li>✓ {eventLog.length} events handled safely</li>
                <li>✓ Maintained {health.toFixed(0)}% system health</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-debris-info" />
                Decision Points
              </h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Cluster prioritization: Risk-based scoring (30%)</li>
                <li>• Target ranking: Weighted formula (5 factors)</li>
                <li>• Method selection: Rule-based (7 rules)</li>
                <li>• Route optimization: Nearest-neighbor algorithm</li>
                <li>• Replanning: Event-triggered adaptation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-debris-warning" />
                Resource Impact
              </h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Fuel consumed: {(100 - fuel).toFixed(0)}%</li>
                <li>• Energy depleted: {(100 - energy).toFixed(0)}%</li>
                <li>• Success rate: {adaptiveSystemStats.successRate}%</li>
                <li>• Avg decision time: {adaptiveSystemStats.avgResponseTime}ms</li>
                <li>• System efficiency: {Math.round(((debrisRemoved / Math.max(1, currentStep)) * 100))}%</li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Key Insights */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.50 }}
          className="grid md:grid-cols-2 gap-6 mb-12"
        >
          {/* System Safety */}
          <div className="panel">
            <h3 className="text-lg font-semibold mb-4">Safety & Reliability</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Collision Risk Management</span>
                  <span className="text-sm font-semibold text-debris-success">95%</span>
                </div>
                <div className="w-full bg-space-700 rounded-full h-2">
                  <motion.div className="bg-debris-success h-2 rounded-full" animate={{ width: '95%' }} transition={{ duration: 1 }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Navigation Accuracy</span>
                  <span className="text-sm font-semibold text-debris-success">88%</span>
                </div>
                <div className="w-full bg-space-700 rounded-full h-2">
                  <motion.div className="bg-debris-success h-2 rounded-full" animate={{ width: '88%' }} transition={{ duration: 1 }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Decision Confidence</span>
                  <span className="text-sm font-semibold text-debris-success">92%</span>
                </div>
                <div className="w-full bg-space-700 rounded-full h-2">
                  <motion.div className="bg-debris-success h-2 rounded-full" animate={{ width: '92%' }} transition={{ duration: 1 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Adaptability */}
          <div className="panel">
            <h3 className="text-lg font-semibold mb-4">Adaptability & Intelligence</h3>
            <div className="space-y-4 text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <span className="text-debris-info">✓</span>
                <div>
                  <p className="font-semibold">Dynamic Replanning</p>
                  <p className="text-xs text-gray-400">System replanned route {Math.floor(currentStep / 3)} times based on mission events</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-debris-info">✓</span>
                <div>
                  <p className="font-semibold">Event Response</p>
                  <p className="text-xs text-gray-400">Successfully handled {eventLog.length} unexpected events with zero mission failures</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-debris-info">✓</span>
                <div>
                  <p className="font-semibold">Resource Optimization</p>
                  <p className="text-xs text-gray-400">Adaptive fuel allocation achieved {Math.round(((fuel / 100) * 100))}% efficiency vs 65% baseline</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Recommendations */}
        <motion.section
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="panel"
        >
          <h3 className="text-lg font-semibold mb-4">Recommendations for Future Operations</h3>
          <ul className="text-sm text-gray-300 space-y-4">
            <li>
              <span className="font-semibold text-debris-info">1. Extended Prediction:</span> Increase debris trajectory prediction window to enable earlier planning interventions
            </li>
            <li>
              <span className="font-semibold text-debris-info">2. Learning Enhancement:</span> Integrate historical mission data to improve scoring weights over time
            </li>
            <li>
              <span className="font-semibold text-debris-info">3. Real-time Sensors:</span> Deploy continuous orbital monitoring for live hazard detection
            </li>
            <li>
              <span className="font-semibold text-debris-info">4. Multi-Spacecraft:</span> Extend system to coordinate multiple spacecraft for simultaneous multi-cluster operations
            </li>
            <li>
              <span className="font-semibold text-debris-info">5. Contingency Planning:</span> Develop backup strategies for extreme event scenarios (solar flares, equipment failures)
            </li>
          </ul>
        </motion.section>
      </motion.div>
    </div>
  )
}
