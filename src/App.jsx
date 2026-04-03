import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useMissionStore } from './store/missionStore'
import { Navbar } from './components/layout/Navbar'
import { LeftControlPanel } from './components/layout/LeftControlPanel'
import { RightDecisionPanel } from './components/layout/RightDecisionPanel'
import { CenterVisualization } from './components/mission/CenterVisualization'
import { CLUSTERS, MOCK_DEBRIS_DATA, CAPTURE_METHODS, MISSION_STEPS } from './data/mockData'
import { rankTargets, calculateCollisionRisk, selectOptimalCaptureMethod, generateRandomEvent } from './utils/missionLogic'
import { executePlanningPhase, executeSimulationStep, getMissionStatus, processReplanningEvent } from './engines/simulationIntegrator'
import Home from './pages/Home'
import DemoDashboard from './pages/DemoDashboard'
import FinalReport from './pages/FinalReport'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [selectedCluster, setSelectedCluster] = useState(null)
  const [planData, setPlanData] = useState(null)

  // Zustand store
  const missionStatus = useMissionStore((state) => state.missionStatus)
  const currentStep = useMissionStore((state) => state.currentStep)
  const setMissionStatus = useMissionStore((state) => state.setMissionStatus)
  const addEventLog = useMissionStore((state) => state.addEventLog)
  const reset = useMissionStore((state) => state.reset)
  const setCurrentStep = useMissionStore((state) => state.setCurrentStep)
  const setHealth = useMissionStore((state) => state.setHealth)
  const setFuel = useMissionStore((state) => state.setFuel)
  const setEnergy = useMissionStore((state) => state.setEnergy)
  const setCollisionRisk = useMissionStore((state) => state.setCollisionRisk)
  const setUncertainty = useMissionStore((state) => state.setUncertainty)
  const setDebrisRemoved = useMissionStore((state) => state.setDebrisRemoved)
  const fuel = useMissionStore((state) => state.fuel)
  const uncertainty = useMissionStore((state) => state.uncertainty)
  const debrisRemoved = useMissionStore((state) => state.debrisRemoved)
  const health = useMissionStore((state) => state.health)
  const energy = useMissionStore((state) => state.energy)
  const collisionRisk = useMissionStore((state) => state.collisionRisk)
  const eventLog = useMissionStore((state) => state.eventLog)

  // Initialize planning phase on mount
  useEffect(() => {
    if (!planData && currentPage === 'demo' && missionStatus === 'idle') {
      const initialState = { fuel, energy, health, collisionRisk, uncertainty }
      const planning = executePlanningPhase(initialState)
      if (planning.success) {
        setPlanData(planning)
        addEventLog('Mission planning complete - ready for execution')
      }
    }
  }, [currentPage])

  // Mission automation loop with intelligent simulation
  useEffect(() => {
    if (missionStatus !== 'running') return

    const interval = setInterval(() => {
      if (currentStep < 9) {
        // Execute simulation step with all engines
        const currentState = {
          fuel,
          energy,
          health,
          collisionRisk,
          uncertainty,
          currentStep,
          debrisRemoved,
        }

        const stepResult = executeSimulationStep(currentStep, currentState, planData)

        // Apply state updates
        Object.entries(stepResult.stateUpdates).forEach(([key, value]) => {
          if (key === 'health') setHealth(value)
          if (key === 'fuel') setFuel(value)
          if (key === 'debrisRemoved') setDebrisRemoved(value)
        })

        // Log all events
        stepResult.events.forEach((event) => {
          addEventLog(event.message)
        })

        // Log decisions
        if (stepResult.decisions.capture) {
          const capture = stepResult.decisions.capture
          addEventLog(`Attempting capture of ${capture.target} with ${capture.method || 'unknown method'}`)
        }

        if (stepResult.decisions.navigation) {
          const nav = stepResult.decisions.navigation
          if (nav.target) addEventLog(`Navigating to ${nav.target} - Distance: ${nav.distance}`)
        }

        // Check mission status with all safety engines
        const missionStatus = getMissionStatus(currentState)
        if (missionStatus.recommendations.length > 0) {
          const rec = missionStatus.recommendations[0]
          addEventLog(`⚠️ ${rec.action}: ${rec.benefit}`)
        }

        // Update uncertainty and collision risk
        const newUncertainty = Math.min(100, uncertainty + Math.random() * 5 + 2)
        const newRisk = Math.min(100, Math.max(0, collisionRisk + (Math.random() - 0.5) * 15))

        setUncertainty(newUncertainty)
        setCollisionRisk(newRisk)

        // Handle replanning if critical events triggered
        if (stepResult.events.filter((e) => e.severity === 'CRITICAL').length > 0) {
          const replan = processReplanningEvent(currentState, stepResult.events[0].type, planData.targets || [])
          if (replan.skippedTargets.length > 0) {
            addEventLog(`Route replanned: Skipped ${replan.skippedTargets.length} high-risk targets`)
          }
        }

        // Advance step
        setCurrentStep(currentStep + 1)
        const stepName = MISSION_STEPS[currentStep + 1]?.name || 'Unknown'
        addEventLog(`📍 Advanced to step: ${stepName}`)
      } else {
        // Mission complete
        setMissionStatus('completed')
        addEventLog('✓ Mission complete - all phases executed successfully')
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [missionStatus, currentStep, fuel, uncertainty, debrisRemoved, health, collisionRisk, energy, planData])

  const handleRunMission = () => {
    if (currentStep === 0 && missionStatus === 'idle') {
      // Start fresh mission
      setCurrentStep(0)
      addEventLog('Mission started - debris analysis initiated')
      setMissionStatus('running')
    } else if (missionStatus === 'paused') {
      // Resume
      addEventLog('Mission resumed by operator')
      setMissionStatus('running')
    }
  }

  const handlePauseMission = () => {
    if (missionStatus === 'running') {
      setMissionStatus('paused')
      addEventLog('Mission paused by operator')
    }
  }

  const handleResetMission = () => {
    reset()
    setSelectedCluster(null)
    setCurrentPage('home')
    addEventLog('Mission reset - all systems nominal')
  }

  const handleSelectCluster = (cluster) => {
    setSelectedCluster(cluster)
    const ranked = rankTargets(MOCK_DEBRIS_DATA.filter((d) => d.cluster === cluster.id))
    addEventLog(`Selected cluster: ${cluster.name} with ${ranked.length} targets`)
  }

  // Enhanced Dashboard Layout
  const DashboardLayout = () => (
    <div className="flex flex-col h-screen bg-space-900 text-white overflow-hidden">
      <Navbar
        onRun={handleRunMission}
        onPause={handlePauseMission}
        onReset={handleResetMission}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftControlPanel
          onRun={handleRunMission}
          onPause={handlePauseMission}
          onReset={handleResetMission}
          onSelectCluster={handleSelectCluster}
          clusters={CLUSTERS}
        />
        <div className="flex-1 flex overflow-hidden bg-gradient-to-b from-space-800 to-space-900">
          <CenterVisualization selectedCluster={selectedCluster} />
        </div>
        <RightDecisionPanel />
      </div>
    </div>
  )

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home onStartDemo={() => setCurrentPage('demo')} />} />
        <Route path="/demo" element={<DashboardLayout />} />
        <Route path="/report" element={<FinalReport />} />
      </Routes>
    </Router>
  )
}
