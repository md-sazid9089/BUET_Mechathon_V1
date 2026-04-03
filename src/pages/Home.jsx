import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Rocket, Zap, GitBranch, AlertTriangle, BarChart3 } from 'lucide-react'

export default function Home() {
  const navigate = useNavigate()

  const features = [
    {
      icon: AlertTriangle,
      title: 'Debris Prediction',
      desc: 'AI-driven prediction of debris trajectories and collision risks',
    },
    {
      icon: GitBranch,
      title: 'Cluster Discovery',
      desc: 'Identification of collision-prone debris clusters',
    },
    {
      icon: BarChart3,
      title: 'Risk Assessment',
      desc: 'Uncertainty-aware decision making for capture methods',
    },
    {
      icon: Zap,
      title: 'Route Planning',
      desc: 'Optimal mission path planning with dynamic replanning',
    },
    {
      icon: Rocket,
      title: 'Live Execution',
      desc: 'Real-time mission execution monitoring and adjustments',
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-space-900 to-space-800 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-debris-info rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            x: [0, 20, -10, 0],
            y: [0, -20, 10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-8 right-10 w-72 h-72 bg-debris-success rounded-full mix-blend-multiply filter blur-3xl opacity-10"
          animate={{
            x: [0, -20, 10, 0],
            y: [0, 20, -10, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="border-b border-space-700 backdrop-blur"
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Rocket className="w-8 h-8 text-debris-info animate-pulse-glow" />
              <div>
                <h1 className="text-2xl font-bold">AI Mission Brain</h1>
                <p className="text-xs text-gray-400">Space Debris Removal</p>
              </div>
            </div>
            <nav className="flex gap-6 text-sm">
              <a href="#features" className="hover:text-debris-info transition">Features</a>
              <a href="#demo" className="hover:text-debris-info transition">Demo</a>
            </nav>
          </div>
        </motion.header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Autonomous Space Debris Removal
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              An intelligent mission planning system that predicts debris trajectories, identifies collision-prone clusters, 
              and executes autonomous space debris removal with advanced uncertainty handling and dynamic replanning.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/demo')}
              className="btn-primary text-lg px-8 py-3"
            >
              Start Mission Simulation
            </motion.button>
          </motion.div>

          {/* Features */}
          <motion.section
            id="features"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  variants={item}
                  whileHover={{ y: -10 }}
                  className="panel hover:border-debris-info transition cursor-pointer group"
                >
                  <Icon className="w-8 h-8 text-debris-info mb-4 group-hover:scale-110 transition" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.desc}</p>
                </motion.div>
              )
            })}
          </motion.section>

          {/* How It Works */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="bg-space-800 border border-space-700 rounded-lg p-8 mb-20"
          >
            <h3 className="text-2xl font-semibold mb-8">Mission Execution Flow</h3>
            <div className="grid md:grid-cols-4 gap-4">
              {['Predict', 'Assess', 'Plan', 'Execute'].map((step, idx) => (
                <motion.div
                  key={idx}
                  className="text-center p-4 bg-space-700 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl font-bold text-debris-info mb-2">{idx + 1}</div>
                  <div className="font-semibold text-sm">{step}</div>
                  {idx < 3 && (
                    <div className="hidden md:block absolute right-0 text-debris-info">→</div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* CTA Section */}
          <motion.section
            id="demo"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center py-12"
          >
            <h3 className="text-3xl font-bold mb-4">Ready to Remove Space Debris?</h3>
            <p className="text-gray-400 mb-8">Experience the future of autonomous debris removal</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/demo')}
              className="btn-success text-lg px-8 py-3"
            >
              Launch Simulation
            </motion.button>
          </motion.section>
        </section>

        {/* Footer */}
        <footer className="border-t border-space-700 py-8 text-center text-gray-500">
          <p className="text-sm">AI Mission Brain V1.0 © 2026 BUET Mechathon</p>
        </footer>
      </div>
    </div>
  )
}
