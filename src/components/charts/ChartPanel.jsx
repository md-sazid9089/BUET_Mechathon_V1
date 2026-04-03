import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// Sample data generators
const generateFuelData = () => [
  { time: 0, fuel: 100 },
  { time: 5, fuel: 95 },
  { time: 10, fuel: 88 },
  { time: 15, fuel: 82 },
  { time: 20, fuel: 75 },
  { time: 25, fuel: 68 },
  { time: 30, fuel: 60 },
]

const generateRiskData = () => [
  { phase: 'Predict', risk: 35 },
  { phase: 'Cluster', risk: 52 },
  { phase: 'Launch', risk: 45 },
  { phase: 'Rank', risk: 38 },
  { phase: 'Route', risk: 42 },
  { phase: 'Track', risk: 55 },
  { phase: 'Capture', risk: 67 },
  { phase: 'Avoid', risk: 35 },
]

const generateUncertaintyData = () => [
  { time: '00:00', uncertainty: 0.85, confidence: 0.15 },
  { time: '05:00', uncertainty: 0.78, confidence: 0.22 },
  { time: '10:00', uncertainty: 0.72, confidence: 0.28 },
  { time: '15:00', uncertainty: 0.68, confidence: 0.32 },
  { time: '20:00', uncertainty: 0.65, confidence: 0.35 },
  { time: '25:00', uncertainty: 0.61, confidence: 0.39 },
  { time: '30:00', uncertainty: 0.58, confidence: 0.42 },
]

export const ChartPanel = () => {
  const [activeChart, setActiveChart] = useState('fuel')

  const charts = [
    { id: 'fuel', label: 'Fuel Usage', icon: '⛽' },
    { id: 'risk', label: 'Risk Trend', icon: '📊' },
    { id: 'uncertainty', label: 'Uncertainty', icon: '📈' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full space-y-6"
    >
      {/* Chart Selector */}
      <div className="flex gap-2 mb-6">
        {charts.map((chart) => (
          <motion.button
            key={chart.id}
            onClick={() => setActiveChart(chart.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg font-mono text-sm transition border ${
              activeChart === chart.id
                ? 'bg-debris-info border-debris-info'
                : 'bg-space-700 border-space-600 hover:border-space-500'
            }`}
          >
            {chart.icon} {chart.label}
          </motion.button>
        ))}
      </div>

      {/* Fuel Chart */}
      {activeChart === 'fuel' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel"
        >
          <h3 className="text-lg font-semibold mb-4">Fuel Consumption</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={generateFuelData()}>
              <defs>
                <linearGradient id="fuelGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1a2568', border: 'none' }} />
              <Line
                type="monotone"
                dataKey="fuel"
                stroke="#3b82f6"
                dot={{ fill: '#3b82f6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Risk Chart */}
      {activeChart === 'risk' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel"
        >
          <h3 className="text-lg font-semibold mb-4">Risk Level by Phase</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={generateRiskData()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="phase" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1a2568', border: 'none' }} />
              <Bar dataKey="risk" fill="#f59e0b" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Uncertainty Chart */}
      {activeChart === 'uncertainty' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel"
        >
          <h3 className="text-lg font-semibold mb-4">Uncertainty vs Confidence</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={generateUncertaintyData()}>
              <defs>
                <linearGradient id="uncertaintyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ backgroundColor: '#1a2568', border: 'none' }} />
              <Legend />
              <Area
                type="monotone"
                dataKey="uncertainty"
                stackId="1"
                stroke="#ef4444"
                fill="url(#uncertaintyGradient)"
              />
              <Area
                type="monotone"
                dataKey="confidence"
                stackId="1"
                stroke="#10b981"
                fill="url(#confidenceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      )}
    </motion.div>
  )
}
