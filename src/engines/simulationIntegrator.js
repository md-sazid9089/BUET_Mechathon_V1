// Simulation Integrator: Coordinates all engines during mission execution

import {
  getBestLaunchWindow,
  evaluateLaunchWindows,
} from './opportunityEngine'
import {
  groupDebrisIntoClusters,
  selectBestCluster,
  analyzeCluster,
} from './clusterEngine'
import {
  rankTargets,
  filterTargets,
  getRankingRecommendation,
} from './rankingEngine'
import {
  generateOptimizedRoute,
  getNextNavigation,
} from './routePlanner'
import {
  recommendCaptureMethod,
  getViableMethods,
} from './captureAdvisor'
import {
  evaluateSafetyStatus,
  predictUpcomingHazards,
  getSafetyRecommendations,
} from './safetyEngine'
import {
  simulateHealthDegradation,
  getHealthReport,
  detectSubsystemIssues,
  estimateTimeToFailure,
} from './healthEngine'
import {
  shouldSkipTarget,
  recalculateMissionRoute,
  evaluateAbortCriteria,
  createReplanReport,
} from './replanner'
import {
  createEvent,
  EVENT_TYPES,
  checkEventTrigger,
} from './eventSystem'
import { MOCK_DEBRIS_DATA, CLUSTERS } from '../data/mockData'

/**
 * Initialize mission planning phase
 * @param {Object} missionState - Current mission state
 * @returns {Object} Planning results
 */
export const executePlanningPhase = (missionState) => {
  const clusteredDebris = groupDebrisIntoClusters(MOCK_DEBRIS_DATA)
  const clusterSelection = selectBestCluster(clusteredDebris, missionState)
  const selectedCluster = clusterSelection.cluster

  if (!selectedCluster) {
    return {
      phase: 'planning',
      success: false,
      message: 'No suitable clusters available',
    }
  }

  const targets = rankTargets(selectedCluster.items)
  const filtered = filterTargets(targets, { maxUncertainty: 85 })
  const recommendation = getRankingRecommendation(filtered.targets, missionState)
  const route = generateOptimizedRoute(filtered.targets, { latitude: 0, longitude: 0 }, 6)

  return {
    phase: 'planning',
    success: true,
    cluster: selectedCluster,
    targets: filtered.targets,
    recommendation,
    route,
    message: `Planned route with ${route.routeOrder.length} targets`,
  }
}

/**
 * Execute mission step with all engines
 * @param {number} currentStep - Current mission step (1-10)
 * @param {Object} missionState - Current mission state
 * @param {Object} planData - Planning data (cluster, targets, route)
 * @returns {Object} Step execution results
 */
export const executeSimulationStep = (currentStep, missionState, planData = {}) => {
  const stepResults = {
    step: currentStep,
    timestamp: new Date(),
    events: [],
    stateUpdates: {},
    decisions: {},
  }

  // Check safety status
  const safetyStatus = evaluateSafetyStatus(missionState)
  if (safetyStatus.overallSafety === 'CRITICAL') {
    return {
      ...stepResults,
      action: 'ABORT',
      reason: 'Critical safety threshold exceeded',
      events: safetyStatus.events.map((e) =>
        createEvent(EVENT_TYPES.SYSTEM_FAULT, e.message, e)
      ),
    }
  }

  // Check for event triggers
  const eventChecks = [
    EVENT_TYPES.FUEL_CRITICAL,
    EVENT_TYPES.COLLISION_DETECTED,
    EVENT_TYPES.SENSOR_DEGRADATION,
    EVENT_TYPES.HEALTH_WARNING,
  ]

  eventChecks.forEach((eventType) => {
    const triggered = checkEventTrigger(missionState, eventType)
    if (triggered) {
      stepResults.events.push(triggered)
    }
  })

  // Simulate health degradation
  const healthDegradation = simulateHealthDegradation(
    missionState.health,
    5,
    missionState.collisionRisk,
    currentStep / 10
  )

  stepResults.stateUpdates.health = healthDegradation.newHealth

  // Generate next action based on step
  let action = 'CONTINUE'

  if (currentStep <= 2 && planData.targets) {
    // Early mission: evaluate targets
    stepResults.decisions.targetEvaluation = {
      count: planData.targets.length,
      topTarget: planData.targets[0],
    }
  } else if (currentStep <= 5 && planData.route) {
    // Mid mission: navigate route
    const nextNav = getNextNavigation(planData.route, Math.floor((currentStep - 3) / 2))
    stepResults.decisions.navigation = nextNav
  } else if (currentStep <= 8) {
    // Late mission: capture execution
    if (planData.targets && planData.targets.length > 0) {
      const target = planData.targets[0]
      const captureRec = recommendCaptureMethod(target.debris, missionState)

      stepResults.decisions.capture = {
        target: target.debris.id,
        method: captureRec.method?.name,
        feasible: captureRec.feasible,
      }

      // Simulate capture
      if (captureRec.feasible && Math.random() > 0.3) {
        stepResults.events.push(
          createEvent(EVENT_TYPES.CAPTURE_SUCCESS, `Captured ${target.debris.id}`, {
            targetId: target.debris.id,
          })
        )
        stepResults.stateUpdates.debrisRemoved = (missionState.debrisRemoved || 0) + 1
        stepResults.stateUpdates.fuel = Math.max(0, missionState.fuel - 8)
      } else {
        stepResults.events.push(
          createEvent(EVENT_TYPES.CAPTURE_FAILED, `Failed to capture ${target.debris.id}`, {
            targetId: target.debris.id,
          })
        )
      }
    }
  } else {
    // Final mission: conclude
    action = 'CONCLUDE'
  }

  // Check if replanning needed
  if (stepResults.events.filter((e) => e.severity === 'CRITICAL').length > 0) {
    action = 'REPLAN'

    const replanData = {
      originalTargets: planData.targets?.length || 0,
      trigger: stepResults.events[0]?.type,
    }

    stepResults.decisions.replan = replanData
  }

  stepResults.action = action
  return stepResults
}

/**
 * Get mission status and recommendations
 * @param {Object} missionState - Current mission state
 * @returns {Object} Status and recommendations
 */
export const getMissionStatus = (missionState) => {
  const safetyStatus = evaluateSafetyStatus(missionState)
  const hazards = predictUpcomingHazards(missionState)
  const recommendations = getSafetyRecommendations(missionState)
  const healthReport = getHealthReport(missionState.health)
  const timeToFailure = estimateTimeToFailure(missionState.health, 0.5)

  return {
    safetyStatus,
    hazards,
    recommendations,
    healthReport,
    timeToFailure,
    summary: `Mission Status: ${safetyStatus.overallSafety}. Health: ${healthReport.state}. Est. time to critical: ${timeToFailure.estimatedMinutes}m`,
  }
}

/**
 * Process a replanning event
 * @param {Object} missionState - Current state
 * @param {string} eventType - Event that triggered replan
 * @param {Array} currentTargets - Current target list
 * @returns {Object} Replanning results
 */
export const processReplanningEvent = (missionState, eventType, currentTargets = []) => {
  const skipDecisions = currentTargets.map((target) =>
    shouldSkipTarget(target.debris.id, eventType, target.debris)
  )

  const skippedTargets = skipDecisions
    .filter((d) => d.shouldSkip)
    .map((d) => d.targetId)

  const remainingTargets = currentTargets.filter(
    (t) => !skippedTargets.includes(t.debris.id)
  )

  const abortEval = evaluateAbortCriteria(eventType, missionState)

  return {
    eventType,
    skippedTargets,
    remainingTargets,
    count: {
      before: currentTargets.length,
      after: remainingTargets.length,
      skipped: skippedTargets.length,
    },
    abortRecommendation: abortEval,
  }
}

/**
 * Prepare mission summary
 * @param {Object} missionState - Final mission state
 * @param {Array} eventLog - Complete event log
 * @param {Object} statistics - Mission statistics
 * @returns {Object} Mission summary
 */
export const prepareMissionSummary = (missionState, eventLog = [], statistics = {}) => {
  const fuelUsed = 100 - missionState.fuel
  const energyUsed = 100 - missionState.energy
  const healthLost = 100 - missionState.health

  const criticalEvents = eventLog.filter(
    (e) => e.severity === 'CRITICAL' || e.type.includes('critical')
  )

  return {
    missionData: {
      debrisRemoved: missionState.debrisRemoved || 0,
      fuelUsed: Math.round(fuelUsed),
      energyUsed: Math.round(energyUsed),
      healthLost: Math.round(healthLost),
      finalRisk: Math.round(missionState.collisionRisk),
      finalUncertainty: Math.round(missionState.uncertainty),
    },
    events: {
      total: eventLog.length,
      critical: criticalEvents.length,
      byType: eventLog.reduce((acc, e) => {
        acc[e.type] = (acc[e.type] || 0) + 1
        return acc
      }, {}),
    },
    statistics: {
      successRate: statistics.captureAttempts
        ? Math.round((statistics.captureSuccesses / statistics.captureAttempts) * 100)
        : 0,
      efficiency: statistics.debrisRemoved
        ? Math.round((statistics.debrisRemoved / (statistics.debrisRemoved + 2)) * 100)
        : 0,
      ...statistics,
    },
  }
}
