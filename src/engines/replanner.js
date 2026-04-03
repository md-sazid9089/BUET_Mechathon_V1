// Replanner: Dynamic mission replanning when events occur

/**
 * Types of events that trigger replanning
 */
export const REPLAN_TRIGGERS = {
  COLLISION_RISK_HIGH: 'Collision risk exceeded threshold',
  TARGET_UNREACHABLE: 'Target became unreachable',
  FUEL_CRITICAL: 'Fuel reserves critical',
  SYSTEM_FAILURE: 'System failure detected',
  SENSOR_DEGRADATION: 'Navigation accuracy degraded',
  UNCERTAINTY_SPIKE: 'Target position uncertainty spike',
  CAPTURE_FAILED: 'Capture attempt failed',
  ROUTE_BLOCKED: 'Original route blocked',
}

/**
 * Decide whether to skip a target based on mission event
 * @param {string} targetId - ID of target to evaluate
 * @param {string} eventType - Type of event that occurred
 * @param {Object} targetData - Target data object
 * @returns {Object} Skip decision with explanation
 */
export const shouldSkipTarget = (targetId, eventType, targetData = {}) => {
  let shouldSkip = false
  let explanation = ''

  const { uncertainty = 0, captureEase = 0, value = 0 } = targetData

  switch (eventType) {
    case 'COLLISION_RISK_HIGH':
      shouldSkip = uncertainty > 75 // Skip uncertain targets during collision risk
      explanation = shouldSkip
        ? `Skipped ${targetId}: High uncertainty (${uncertainty}%) with collision risk - too dangerous`
        : `Maintaining course to ${targetId}: Risk manageable`
      break

    case 'SENSOR_DEGRADATION':
      shouldSkip = uncertainty > 80
      explanation = shouldSkip
        ? `Skipped ${targetId}: Sensor degradation makes uncertain target unreachable`
        : `Can maintain targeting lock on ${targetId} despite sensor degradation`
      break

    case 'FUEL_CRITICAL':
      shouldSkip = value < 0.5 // Skip low-value targets when fuel critical
      explanation = shouldSkip
        ? `Skipped ${targetId}: Low value target - need to conserve fuel`
        : `${targetId} worth the fuel investment - proceeding`
      break

    case 'CAPTURE_FAILED':
      shouldSkip = true // Skip failed target
      explanation = `Skipped ${targetId}: Previous capture attempt failed - moving to next target`
      break

    case 'ROUTE_BLOCKED':
      shouldSkip = true // Need to replan anyway
      explanation = `Route to ${targetId} blocked - will recalculate in main planning phase`
      break

    default:
      explanation = `Evaluating ${targetId} for continuation`
  }

  return {
    targetId,
    shouldSkip,
    eventType,
    explanation,
  }
}

/**
 * Recalculate mission route excluding problematic targets
 * @param {Array} rankedTargets - Original ranked targets
 * @param {Array} excludeTargets - Target IDs to exclude
 * @param {Object} spacecraftPosition - Current position
 * @param {Function} generateRouteFunction - Function to generate new route
 * @returns {Object} Recalculated route plan
 */
export const recalculateMissionRoute = (
  rankedTargets,
  excludeTargets = [],
  spacecraftPosition = { latitude: 0, longitude: 0 },
  generateRouteFunction
) => {
  // Filter out excluded targets
  const availableTargets = rankedTargets.filter((target) => !excludeTargets.includes(target.debris.id))

  const replanData = {
    originalTargetCount: rankedTargets.length,
    excludedCount: excludeTargets.length,
    availableCount: availableTargets.length,
    excludedTargets,
  }

  if (availableTargets.length === 0) {
    return {
      ...replanData,
      route: null,
      explanation: 'All targets excluded - mission objectives cannot be met',
      decision: 'ABORT_MISSION',
    }
  }

  // Generate new route if function provided
  let newRoute = null
  if (generateRouteFunction) {
    newRoute = generateRouteFunction(availableTargets, spacecraftPosition)
  }

  return {
    ...replanData,
    route: newRoute,
    explanation: `Route replanned: ${availableTargets.length} targets available (${excludeTargets.length} excluded)`,
    decision: 'CONTINUE_MISSION',
  }
}

/**
 * Update mission state after replanning event
 * @param {Object} currentState - Current mission state
 * @param {string} eventType - Type of event
 * @param {Object} replanData - Data from replanning
 * @returns {Object} Updated mission state
 */
export const updateMissionStateAfterEvent = (currentState, eventType, replanData = {}) => {
  const updatedState = { ...currentState }

  // Log the event
  updatedState.lastEvent = eventType
  updatedState.replanTriggered = true
  updatedState.totalReplans = (updatedState.totalReplans || 0) + 1

  // Track skipped targets
  if (replanData.excludedTargets) {
    updatedState.skippedTargets = [...(updatedState.skippedTargets || []), ...replanData.excludedTargets]
  }

  // Update route if available
  if (replanData.route) {
    updatedState.currentRoute = replanData.route
  }

  return updatedState
}

/**
 * Generate explanation for replanning action
 * @param {string} eventType - Event that triggered replan
 * @param {Array} skippedTargets - Targets being skipped
 * @param {number} remainingTargets - Targets still in plan
 * @returns {string} Human-readable explanation
 */
export const getReplanExplanation = (eventType, skippedTargets = [], remainingTargets = 0) => {
  let explanation = `Mission replanned due to: ${eventType}\n`

  if (skippedTargets.length > 0) {
    explanation += `Skipped targets: ${skippedTargets.join(', ')}\n`
  }

  explanation += `Remaining targets: ${remainingTargets}\n`

  // Add context-specific advice
  switch (eventType) {
    case 'COLLISION_RISK_HIGH':
      explanation += 'Recommendation: Reduce approach speed, increase sensor update frequency'
      break
    case 'SENSOR_DEGRADATION':
      explanation += 'Recommendation: Recalibrate navigation systems at next opportunity'
      break
    case 'FUEL_CRITICAL':
      explanation += 'Recommendation: Prepare for return trajectory, focus on highest-value targets only'
      break
    case 'SYSTEM_FAILURE':
      explanation += 'Recommendation: Run full diagnostics, reduce mission scope if necessary'
      break
    case 'UNCERTAINTY_SPIKE':
      explanation += 'Recommendation: Update position estimates with fresh sensor data'
      break
  }

  return explanation
}

/**
 * Evaluate if mission should be aborted based on event severity
 * @param {string} eventType - Event type
 * @param {Object} missionState - Current mission state
 * @returns {Object} Abort recommendation
 */
export const evaluateAbortCriteria = (eventType, missionState = {}) => {
  const { fuel = 100, health = 100, collisionRisk = 0, debrisRemoved = 0 } = missionState

  let recommendAbort = false
  let confidence = 0
  let reason = ''

  // Critical fuel situation
  if (fuel < 8) {
    recommendAbort = true
    confidence = 0.95
    reason = 'Critical fuel situation - immediate return required for safe landing'
  }

  // Critical health situation
  if (health < 15) {
    recommendAbort = true
    confidence = 0.9
    reason = 'System health critical - imminent failure risk'
  }

  // Severe collision risk
  if (collisionRisk > 85 && eventType === 'COLLISION_RISK_HIGH') {
    recommendAbort = true
    confidence = 0.85
    reason = 'Collision risk severe - continuing operations too dangerous'
  }

  // Multiple system failures
  if (eventType === 'SYSTEM_FAILURE' && health < 30) {
    recommendAbort = true
    confidence = 0.8
    reason = 'Multiple system failures - mission integrity compromised'
  }

  // Calculate mission value completed
  const completionRatio = debrisRemoved / Math.max(1, debrisRemoved + (missionState.remainingTargets || 5))

  return {
    recommendAbort,
    confidence: Math.round(confidence * 100),
    reason,
    completionRatio: Math.round(completionRatio * 100),
    recommendation: recommendAbort ? 'ABORT MISSION' : 'CONTINUE WITH CAUTION',
  }
}

/**
 * Create a detailed replan report
 * @param {Object} replanEvent - Replan event data
 * @returns {Object} Detailed report
 */
export const createReplanReport = (replanEvent) => {
  return {
    timestamp: new Date().toISOString(),
    trigger: replanEvent.eventType,
    targetCount: {
      before: replanEvent.originalTargetCount || 0,
      after: replanEvent.availableCount || 0,
      skipped: replanEvent.excludedCount || 0,
    },
    skippedReasons: replanEvent.skippedTargets || [],
    newRoute: replanEvent.route,
    explanation: replanEvent.explanation,
    decision: replanEvent.decision,
  }
}
