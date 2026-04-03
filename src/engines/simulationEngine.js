// Simulation Engine: Orchestrates the complete mission simulation

import { MOCK_DEBRIS_DATA, CLUSTERS } from '../data/mockData'
import { getBestLaunchWindow, evaluateLaunchWindows } from './opportunityEngine'
import { groupDebrisIntoClusters, selectBestCluster } from './clusterEngine'
import { rankTargets, filterTargets, getRankingRecommendation } from './rankingEngine'
import { generateOptimizedRoute } from './routePlanner'
import { recommendCaptureMethod } from './captureAdvisor'
import { evaluateSafetyStatus, predictUpcomingHazards } from './safetyEngine'
import { simulateHealthDegradation, getHealthReport } from './healthEngine'
import { recalculateMissionRoute, evaluateAbortCriteria } from './replanner'

/**
 * Initialize simulation with mission parameters
 * @param {Object} initialState - Initial mission state
 * @returns {Object} Initialized simulation context
 */
export const initializeSimulation = (initialState = {}) => {
  return {
    step: 0,
    status: 'idle',
    startTime: Date.now(),
    clusters: CLUSTERS,
    allDebris: MOCK_DEBRIS_DATA,
    selectedCluster: null,
    rankedTargets: [],
    currentRoute: null,
    currentTarget: null,
    captureRecommendation: null,
    missionEvents: [],
    replans: [],
    stats: {
      debrisRemoved: 0,
      captureAttempts: 0,
      captureSuccesses: 0,
      fuelUsed: 0,
      energyUsed: 0,
      eventsTriggered: 0,
      replansTriggered: 0,
    },
    missionState: {
      fuel: 100,
      energy: 100,
      health: 100,
      collisionRisk: 0,
      uncertainty: 40,
      currentStep: 0,
      ...initialState,
    },
  }
}

/**
 * Step 1: Load and analyze debris
 * @param {Object} simulation - Simulation context
 * @returns {Object} Updated simulation with debris analysis
 */
export const loadDebrisData = (simulation) => {
  const clusteredDebris = groupDebrisIntoClusters(simulation.allDebris)

  return {
    ...simulation,
    step: 1,
    clusteredDebris,
    log: `[STEP 1] Loaded ${simulation.allDebris.length} debris items grouped into ${clusteredDebris.length} clusters`,
  }
}

/**
 * Step 2: Predict opportunity windows
 * @param {Object} simulation - Simulation context
 * @returns {Object} Updated simulation with opportunity analysis
 */
export const predictOpportunityWindows = (simulation) => {
  const launchWindow = getBestLaunchWindow(simulation.missionState.fuel, 0.5)
  const allWindows = evaluateLaunchWindows(simulation.missionState)

  return {
    ...simulation,
    step: 2,
    selectedLaunchWindow: launchWindow,
    allLaunchWindows: allWindows,
    log: `[STEP 2] Opportunity analysis complete. Selected window: ${launchWindow.window.name}`,
  }
}

/**
 * Step 3: Select best cluster
 * @param {Object} simulation - Simulation context
 * @returns {Object} Updated simulation with cluster selection
 */
export const selectOptimalCluster = (simulation) => {
  const clusterSelection = selectBestCluster(simulation.clusteredDebris, simulation.missionState)

  return {
    ...simulation,
    step: 3,
    selectedCluster: clusterSelection.cluster,
    clusterAnalysis: clusterSelection,
    log: `[STEP 3] Selected cluster ${clusterSelection.cluster.id} - ${clusterSelection.reasoning}`,
  }
}

/**
 * Step 4: Rank targets within cluster
 * @param {Object} simulation - Simulation context
 * @returns {Object} Updated simulation with ranked targets
 */
export const rankTargetsInCluster = (simulation) => {
  if (!simulation.selectedCluster) {
    return {
      ...simulation,
      step: 4,
      rankedTargets: [],
      log: '[STEP 4] No cluster selected - cannot rank targets',
    }
  }

  const targets = rankTargets(simulation.selectedCluster.items)
  const filtered = filterTargets(targets, { maxUncertainty: 85 })
  const recommendation = getRankingRecommendation(filtered.targets, simulation.missionState)

  return {
    ...simulation,
    step: 4,
    rankedTargets: filtered.targets,
    rankingAnalysis: { targets: filtered, recommendation },
    log: `[STEP 4] Ranked ${filtered.targets.length} targets - Top priority: ${recommendation.recommendation}`,
  }
}

/**
 * Step 5: Plan mission route
 * @param {Object} simulation - Simulation context
 * @returns {Object} Updated simulation with mission route
 */
export const planMissionRoute = (simulation) => {
  if (simulation.rankedTargets.length === 0) {
    return {
      ...simulation,
      step: 5,
      currentRoute: null,
      log: '[STEP 5] No ranked targets - cannot plan route',
    }
  }

  const route = generateOptimizedRoute(simulation.rankedTargets, { latitude: 0, longitude: 0 }, 6)

  return {
    ...simulation,
    step: 5,
    currentRoute: route,
    log: `[STEP 5] Route planned: ${route.routeOrder.length} targets, ${route.totalDistance}km, ${route.totalFuel}% fuel`,
  }
}

/**
 * Step 6: Start mission execution
 * @param {Object} simulation - Simulation context
 * @returns {Object} Updated simulation with mission start
 */
export const startMissionExecution = (simulation) => {
  const updatedState = {
    ...simulation.missionState,
    currentStep: 1,
  }

  return {
    ...simulation,
    step: 6,
    status: 'running',
    missionState: updatedState,
    log: '[STEP 6] Mission execution started - all systems nominal',
  }
}

/**
 * Step 7: Move spacecraft toward target
 * @param {Object} simulation - Simulation context
 * @returns {Object} Updated simulation with movement
 */
export const moveSpacecraftToTarget = (simulation) => {
  if (!simulation.currentRoute || simulation.currentRoute.waypoints.length === 0) {
    return {
      ...simulation,
      step: 7,
      log: '[STEP 7] No route available',
    }
  }

  const currentWaypoint = simulation.currentRoute.waypoints[0]
  const distance = currentWaypoint.distanceFromPrevious || 100
  const fuelCost = Math.ceil((distance / 100) * 5)

  const updatedState = {
    ...simulation.missionState,
    fuel: Math.max(0, simulation.missionState.fuel - fuelCost),
    collisionRisk: Math.min(100, simulation.missionState.collisionRisk + 5),
  }

  return {
    ...simulation,
    step: 7,
    currentTarget: currentWaypoint,
    missionState: updatedState,
    stats: {
      ...simulation.stats,
      fuelUsed: simulation.stats.fuelUsed + fuelCost,
    },
    log: `[STEP 7] Approaching ${currentWaypoint.debris.id} - distance: ${distance.toFixed(0)}km, fuel cost: ${fuelCost}%`,
  }
}

/**
 * Step 8: Recommend capture method
 * @param {Object} simulation - Simulation context
 * @returns {Object} Updated simulation with capture recommendation
 */
export const recommendCaptureExecution = (simulation) => {
  if (!simulation.currentTarget) {
    return {
      ...simulation,
      step: 8,
      captureRecommendation: null,
      log: '[STEP 8] No target available',
    }
  }

  const recommendation = recommendCaptureMethod(simulation.currentTarget.debris, simulation.missionState)

  return {
    ...simulation,
    step: 8,
    captureRecommendation: recommendation,
    log: `[STEP 8] Capture method: ${recommendation.method ? recommendation.method.name : 'SKIP'} - Success rate: ${recommendation.feasible ? (recommendation.successProbability * 100).toFixed(0) : 'N/A'}%`,
  }
}

/**
 * Step 9: Apply random events (collisions, sensor drift, etc.)
 * @param {Object} simulation - Simulation context
 * @returns {Object} Updated simulation with events applied
 */
export const applyRandomEvents = (simulation) => {
  const events = []
  const updatedState = { ...simulation.missionState }

  // 50% chance of collision spike
  if (Math.random() > 0.5) {
    const spike = Math.floor(Math.random() * 20) + 10
    updatedState.collisionRisk = Math.min(100, updatedState.collisionRisk + spike)
    events.push({
      type: 'collision_spike',
      message: `Collision risk spike (+${spike}%)`,
      severity: 'WARNING',
    })
  }

  // 30% chance of sensor degradation
  if (Math.random() > 0.7) {
    const degration = Math.floor(Math.random() * 15) + 5
    updatedState.uncertainty = Math.min(100, updatedState.uncertainty + degration)
    events.push({
      type: 'sensor_drift',
      message: `Sensor drift detected (+${degration}% uncertainty)`,
      severity: 'CAUTION',
    })
  }

  // 20% chance of thruster fault
  if (Math.random() > 0.8) {
    updatedState.health = Math.max(0, updatedState.health - 8)
    events.push({
      type: 'thruster_fault',
      message: 'Thruster response delayed - health reduced',
      severity: 'WARNING',
    })
  }

  return {
    ...simulation,
    step: 9,
    missionState: updatedState,
    missionEvents: [...simulation.missionEvents, ...events],
    stats: {
      ...simulation.stats,
      eventsTriggered: simulation.stats.eventsTriggered + events.length,
    },
    log: `[STEP 9] Events triggered: ${events.map((e) => e.message).join(', ')}`,
  }
}

/**
 * Step 10: Trigger replanning if necessary
 * @param {Object} simulation - Simulation context
 * @returns {Object} Updated simulation with replanning if needed
 */
export const triggerReplanning = (simulation) => {
  const safetyStatus = evaluateSafetyStatus(simulation.missionState)

  if (safetyStatus.overallSafety === 'CRITICAL' || simulation.missionState.fuel < 20) {
    // Replan required
    const replanData = recalculateMissionRoute(
      simulation.rankedTargets,
      [simulation.currentTarget?.debris.id].filter(Boolean),
      { latitude: 0, longitude: 0 },
      generateOptimizedRoute
    )

    const abortEval = evaluateAbortCriteria(safetyStatus.events[0]?.type || 'GENERAL', simulation.missionState)

    return {
      ...simulation,
      step: 10,
      replanData,
      abortEvaluation: abortEval,
      stats: {
        ...simulation.stats,
        replansTriggered: simulation.stats.replansTriggered + 1,
      },
      log: `[STEP 10] Replanning triggered - ${replanData.explanation}`,
    }
  }

  return {
    ...simulation,
    step: 10,
    log: '[STEP 10] No replanning needed - continuing mission',
  }
}

/**
 * Step 11: Continue or conclude mission
 * @param {Object} simulation - Simulation context
 * @returns {Object} Updated simulation
 */
export const continueMission = (simulation) => {
  // Simulate successful capture with 75% probability
  let captured = false
  if (simulation.captureRecommendation?.feasible && Math.random() > 0.25) {
    captured = true
    simulation.stats.captureSuccesses++
    simulation.missionState.fuel = Math.max(0, simulation.missionState.fuel - 8)
  }

  simulation.stats.captureAttempts++

  const shouldContinue = simulation.missionState.fuel > 15 && simulation.stats.captureSuccesses < 4

  return {
    ...simulation,
    step: 11,
    lastCaptureSuccess: captured,
    shouldContinue,
    log: `[STEP 11] Capture ${captured ? 'successful' : 'failed'} - Debris removed: ${simulation.stats.captureSuccesses}`,
  }
}

/**
 * Step 12: Conclude mission and generate summary
 * @param {Object} simulation - Simulation context
 * @returns {Object} Updated simulation with mission summary
 */
export const concludeMission = (simulation) => {
  const duration = (Date.now() - simulation.startTime) / 1000
  const fuelRemaining = simulation.missionState.fuel

  const summary = {
    status: 'completed',
    duration,
    debrisRemoved: simulation.stats.captureSuccesses,
    captureAttempts: simulation.stats.captureAttempts,
    successRate: simulation.stats.captureAttempts > 0 ? ((simulation.stats.captureSuccesses / simulation.stats.captureAttempts) * 100).toFixed(0) : 0,
    fuelConsumed: 100 - fuelRemaining,
    fuelRemaining,
    energyConsumed: 100 - simulation.missionState.energy,
    totalEvents: simulation.stats.eventsTriggered,
    totalReplans: simulation.stats.replansTriggered,
    finalHealthStatus: simulation.missionState.health,
    finalUncertainty: simulation.missionState.uncertainty,
  }

  return {
    ...simulation,
    step: 12,
    status: 'completed',
    missionSummary: summary,
    log: `[STEP 12] Mission concluded - ${summary.debrisRemoved} debris removed, ${summary.successRate}% success rate`,
  }
}

/**
 * Run complete mission simulation
 * @param {Object} initialState - Initial state parameters
 * @returns {Object} Complete simulation result
 */
export const runCompleteMissionSimulation = (initialState = {}) => {
  let sim = initializeSimulation(initialState)

  // Execute all simulation steps
  sim = loadDebrisData(sim)
  sim = predictOpportunityWindows(sim)
  sim = selectOptimalCluster(sim)
  sim = rankTargetsInCluster(sim)
  sim = planMissionRoute(sim)
  sim = startMissionExecution(sim)

  // Execution loop (simplified - just show one iteration)
  sim = moveSpacecraftToTarget(sim)
  sim = recommendCaptureExecution(sim)
  sim = applyRandomEvents(sim)
  sim = triggerReplanning(sim)
  sim = continueMission(sim)
  sim = concludeMission(sim)

  return sim
}
