// Safety Engine: Trigger safety events and hazard detection

/**
 * Define safety thresholds for different hazards
 */
export const SAFETY_THRESHOLDS = {
  COLLISION_CRITICAL: 80,
  COLLISION_HIGH: 60,
  COLLISION_MEDIUM: 40,
  UNCERTAINTY_CRITICAL: 90,
  UNCERTAINTY_HIGH: 70,
  FUEL_CRITICAL: 10,
  FUEL_WARNING: 25,
  HEALTH_CRITICAL: 20,
  HEALTH_WARNING: 40,
}

/**
 * Evaluate current mission safety status
 * @param {Object} missionState - Current mission state
 * @returns {Object} Safety assessment with triggered events
 */
export const evaluateSafetyStatus = (missionState) => {
  const {
    collisionRisk = 0,
    uncertainty = 0,
    fuel = 100,
    health = 100,
    energy = 100,
  } = missionState

  const events = []
  let overallSafety = 'SAFE'

  // Collision risk assessment
  if (collisionRisk > SAFETY_THRESHOLDS.COLLISION_CRITICAL) {
    events.push({
      type: 'collision_critical',
      severity: 'CRITICAL',
      message: `CRITICAL ALERT: Collision risk exceeded ${SAFETY_THRESHOLDS.COLLISION_CRITICAL}% (current: ${collisionRisk}%)`,
      explanation: 'Immediate action required - too high collision probability',
      action: 'ABORT_OPERATION',
    })
    overallSafety = 'CRITICAL'
  } else if (collisionRisk > SAFETY_THRESHOLDS.COLLISION_HIGH) {
    events.push({
      type: 'collision_high',
      severity: 'WARNING',
      message: `Collision risk elevated: ${collisionRisk}% (threshold: ${SAFETY_THRESHOLDS.COLLISION_HIGH}%)`,
      explanation: 'Approach with caution - reduce velocity to mitigate',
      action: 'REDUCE_VELOCITY',
    })
    if (overallSafety !== 'CRITICAL') overallSafety = 'WARNING'
  }

  // Uncertainty assessment
  if (uncertainty > SAFETY_THRESHOLDS.UNCERTAINTY_CRITICAL) {
    events.push({
      type: 'uncertainty_critical',
      severity: 'WARNING',
      message: `Uncertainty critical: ${uncertainty}% - target position uncertain`,
      explanation: 'Navigation confidence low - update sensors before capture',
      action: 'CALIBRATE_SENSORS',
    })
    if (overallSafety !== 'CRITICAL') overallSafety = 'WARNING'
  } else if (uncertainty > SAFETY_THRESHOLDS.UNCERTAINTY_HIGH) {
    events.push({
      type: 'uncertainty_high',
      severity: 'CAUTION',
      message: `Uncertainty elevated: ${uncertainty}%`,
      explanation: 'Position accuracy degrading - proceed with reduced confidence',
      action: 'MONITOR',
    })
  }

  // Fuel assessment
  if (fuel < SAFETY_THRESHOLDS.FUEL_CRITICAL) {
    events.push({
      type: 'fuel_critical',
      severity: 'CRITICAL',
      message: `CRITICAL: Fuel critical (${fuel}%) - mission abort imminent`,
      explanation: 'Insufficient fuel reserves for safe return',
      action: 'ABORT_MISSION',
    })
    if (overallSafety !== 'CRITICAL') overallSafety = 'CRITICAL'
  } else if (fuel < SAFETY_THRESHOLDS.FUEL_WARNING) {
    events.push({
      type: 'fuel_warning',
      severity: 'WARNING',
      message: `Fuel reserves low: ${fuel}%`,
      explanation: 'Fuel budget constrained - prioritize nearest targets',
      action: 'PRIORITIZE_RETURN',
    })
    if (overallSafety !== 'CRITICAL') overallSafety = 'WARNING'
  }

  // Health assessment
  if (health < SAFETY_THRESHOLDS.HEALTH_CRITICAL) {
    events.push({
      type: 'health_critical',
      severity: 'WARNING',
      message: `System health critical: ${health}%`,
      explanation: 'Spacecraft systems degrading - maintain minimal operations',
      action: 'REDUCE_OPERATIONS',
    })
    if (overallSafety !== 'CRITICAL') overallSafety = 'WARNING'
  } else if (health < SAFETY_THRESHOLDS.HEALTH_WARNING) {
    events.push({
      type: 'health_warning',
      severity: 'CAUTION',
      message: `System health warning: ${health}%`,
      explanation: 'Minor system degradation detected',
      action: 'MONITOR',
    })
  }

  // Energy assessment
  if (energy < 20) {
    events.push({
      type: 'energy_low',
      severity: 'CAUTION',
      message: `Energy reserves depleted: ${energy}%`,
      explanation: 'Limited reactor capacity - perform essential operations only',
      action: 'CONSERVE_ENERGY',
    })
  }

  return {
    overallSafety,
    events,
    summary: `Safety Status: ${overallSafety} - ${events.length} alerts`,
  }
}

/**
 * Predict potential hazards in next time period
 * @param {Object} missionState - Current mission state
 * @returns {Array} Predicted hazards with confidence scores
 */
export const predictUpcomingHazards = (missionState) => {
  const { collisionRisk = 0, uncertainty = 0, fuel = 100, currentStep = 0 } = missionState

  const hazards = []

  // Extrapolate collision risk trend
  const collisionTrend = Math.min(10, currentStep * 2) // Collision risk increases with time
  if (collisionRisk + collisionTrend > SAFETY_THRESHOLDS.COLLISION_CRITICAL) {
    hazards.push({
      hazard: 'Collision Risk Escalation',
      probability: 0.7,
      timeframe: '2-3 steps',
      recommendation: 'Reduce approach distance or switch to safer target',
    })
  }

  // Extrapolate fuel consumption
  const fuelBurn = Math.min(2, currentStep * 0.3) // Fuel decreases
  if (fuel - fuelBurn < SAFETY_THRESHOLDS.FUEL_CRITICAL) {
    hazards.push({
      hazard: 'Fuel Depletion',
      probability: 0.6,
      timeframe: '5-6 steps',
      recommendation: 'Begin return trajectory preparation',
    })
  }

  // Accumulating uncertainty
  const uncertaintyGrowth = currentStep * 3
  if (uncertainty + uncertaintyGrowth > SAFETY_THRESHOLDS.UNCERTAINTY_CRITICAL) {
    hazards.push({
      hazard: 'Navigation Uncertainty Critical',
      probability: 0.8,
      timeframe: '2-4 steps',
      recommendation: 'Update position with fresh sensor data',
    })
  }

  return hazards
}

/**
 * Recommend safety actions based on current state
 * @param {Object} missionState - Mission state
 * @returns {Array} Prioritized safety recommendations
 */
export const getSafetyRecommendations = (missionState) => {
  const recommendations = []
  const { collisionRisk = 0, uncertainty = 0, fuel = 100, health = 100 } = missionState

  if (collisionRisk > SAFETY_THRESHOLDS.COLLISION_HIGH) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Reduce approach velocity',
      benefit: 'Decrease collision risk by 15-20%',
      timeToImplement: '30 seconds',
    })
  }

  if (uncertainty > SAFETY_THRESHOLDS.UNCERTAINTY_HIGH) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Recalibrate sensors',
      benefit: 'Reduce uncertainty by 25%',
      timeToImplement: '45 seconds',
    })
  }

  if (fuel < SAFETY_THRESHOLDS.FUEL_WARNING) {
    recommendations.push({
      priority: 'CRITICAL',
      action: 'Initiate return sequence',
      benefit: 'Ensure safe return to base',
      timeToImplement: 'Immediate',
    })
  }

  if (health < SAFETY_THRESHOLDS.HEALTH_WARNING) {
    recommendations.push({
      priority: 'HIGH',
      action: 'Run diagnostics and repairs',
      benefit: 'Restore 20-30% health',
      timeToImplement: '2 minutes',
    })
  }

  return recommendations.sort((a, b) => {
    const priorityMap = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 }
    return priorityMap[a.priority] - priorityMap[b.priority]
  })
}

/**
 * Check if a specific hazard has been triggered
 * @param {string} hazardType - Type of hazard to check
 * @param {Object} missionState - Mission state
 * @returns {boolean} True if hazard triggered
 */
export const isHazardTriggered = (hazardType, missionState) => {
  const { collisionRisk = 0, uncertainty = 0, fuel = 100, health = 100 } = missionState

  switch (hazardType) {
    case 'collision_critical':
      return collisionRisk > SAFETY_THRESHOLDS.COLLISION_CRITICAL
    case 'collision_high':
      return collisionRisk > SAFETY_THRESHOLDS.COLLISION_HIGH
    case 'uncertainty_critical':
      return uncertainty > SAFETY_THRESHOLDS.UNCERTAINTY_CRITICAL
    case 'fuel_critical':
      return fuel < SAFETY_THRESHOLDS.FUEL_CRITICAL
    case 'fuel_warning':
      return fuel < SAFETY_THRESHOLDS.FUEL_WARNING
    case 'health_critical':
      return health < SAFETY_THRESHOLDS.HEALTH_CRITICAL
    default:
      return false
  }
}
