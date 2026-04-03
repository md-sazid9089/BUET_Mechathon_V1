// Health Engine: Simulate spacecraft health and system degradation

export const HEALTH_STATES = {
  NORMAL: { range: [70, 100], label: 'Normal', color: 'green', description: 'All systems nominal' },
  WARNING: { range: [40, 69], label: 'Warning', color: 'yellow', description: 'Minor degradation' },
  DEGRADED: { range: [20, 39], label: 'Degraded', color: 'orange', description: 'Significant issues' },
  CRITICAL: { range: [0, 19], label: 'Critical', color: 'red', description: 'System failure imminent' },
}

/**
 * Calculate current health state based on health percentage
 * @param {number} health - Health percentage (0-100)
 * @returns {Object} Health state information
 */
export const getHealthState = (health) => {
  for (const [key, value] of Object.entries(HEALTH_STATES)) {
    if (health >= value.range[0] && health <= value.range[1]) {
      return {
        state: key,
        label: value.label,
        color: value.color,
        description: value.description,
        health,
      }
    }
  }
  return HEALTH_STATES.NORMAL
}

/**
 * Simulate health degradation over time
 * @param {number} currentHealth - Current health %
 * @param {number} timePassed - Time elapsed in seconds
 * @param {number} collisionRisk - Current collision risk (0-100)
 * @param {number} systemStrain - Mission stress level (0-1)
 * @returns {Object} New health state with breakdown
 */
export const simulateHealthDegradation = (
  currentHealth = 100,
  timePassed = 5,
  collisionRisk = 0,
  systemStrain = 0
) => {
  // Base degradation: 0.5% per 5 seconds
  let degradation = (timePassed / 5) * 0.5

  // Additional degradation from collision risk
  if (collisionRisk > 60) {
    degradation += (collisionRisk / 100) * 0.3
  }

  // Additional degradation from system strain
  degradation += systemStrain * 2

  // Random component (sensor drift, thermal stress)
  const randomVariation = (Math.random() - 0.5) * 0.5

  const newHealth = Math.max(0, currentHealth - degradation + randomVariation)

  return {
    newHealth: Math.round(newHealth),
    degradation: Math.round(degradation * 10) / 10,
    breakdown: {
      timeFactor: (timePassed / 5) * 0.5,
      riskFactor: (collisionRisk / 100) * 0.3,
      strainFactor: systemStrain * 2,
      randomFactor: randomVariation,
    },
  }
}

/**
 * Detect specific subsystem failures based on health
 * @param {number} health - Current health percentage
 * @returns {Array} List of potential subsystem issues
 */
export const detectSubsystemIssues = (health) => {
  const issues = []

  if (health < 80) {
    issues.push({
      subsystem: 'Thermal Management',
      severity: 'CAUTION',
      message: 'Radiator efficiency degraded 5%',
      impact: 'Reduced heat dissipation capacity',
    })
  }

  if (health < 60) {
    issues.push({
      subsystem: 'Propulsion',
      severity: 'WARNING',
      message: 'Thruster response time +15%',
      impact: 'Slower course corrections',
    })
    issues.push({
      subsystem: 'Power',
      severity: 'WARNING',
      message: 'Solar panel efficiency -12%',
      impact: 'Reduced power generation',
    })
  }

  if (health < 40) {
    issues.push({
      subsystem: 'Navigation',
      severity: 'CRITICAL',
      message: 'Star tracker accuracy -25%',
      impact: 'Navigation uncertainty increasing',
    })
    issues.push({
      subsystem: 'Communication',
      severity: 'WARNING',
      message: 'Signal strength reduced',
      impact: 'Limited telemetry bandwidth',
    })
  }

  if (health < 20) {
    issues.push({
      subsystem: 'Main Computer',
      severity: 'CRITICAL',
      message: 'Processing capacity at 60%',
      impact: 'Mission planning capability limited',
    })
  }

  return issues
}

/**
 * Get health status report
 * @param {number} health - Health percentage
 * @returns {Object} Detailed health report
 */
export const getHealthReport = (health) => {
  const state = getHealthState(health)
  const issues = detectSubsystemIssues(health)
  const systemsOK = issues.filter((i) => i.severity === 'CAUTION').length
  const systemsWarning = issues.filter((i) => i.severity === 'WARNING').length
  const systemsCritical = issues.filter((i) => i.severity === 'CRITICAL').length

  let recommendation = 'Continue operations'
  if (systemsCritical > 0) {
    recommendation = 'URGENT: Return to base for repairs'
  } else if (systemsWarning > 1) {
    recommendation = 'Plan maintenance - continue with caution'
  } else if (systemsWarning > 0) {
    recommendation = 'Monitor systems - schedule repair'
  }

  return {
    health,
    state: state.state,
    stateLabel: state.label,
    description: state.description,
    issues,
    systemsOK: 7 - issues.length,
    systemsWarning,
    systemsCritical,
    recommendation,
  }
}

/**
 * Repair health by running diagnostics
 * @param {number} currentHealth - Current health %
 * @param {number} repairTime - Time spent on repairs (seconds)
 * @returns {Object} Repair results
 */
export const runDiagnosticsAndRepair = (currentHealth = 50, repairTime = 120) => {
  // 5-10% health recovery per 2 minutes of operation
  const repairFactor = (repairTime / 120) * 0.075
  const recoveredHealth = Math.min(100, currentHealth + repairFactor * 100)

  const recovered = recoveredHealth - currentHealth

  return {
    previousHealth: currentHealth,
    newHealth: Math.round(recoveredHealth),
    recovered: Math.round(recovered),
    message: `Diagnostics and repairs completed: health improved from ${Math.round(currentHealth)}% to ${Math.round(recoveredHealth)}%`,
    timeSpent: repairTime,
  }
}

/**
 * Estimate time to critical failure
 * @param {number} currentHealth - Current health %
 * @param {number} degradationRate - Degradation per second (%)
 * @returns {Object} Time estimate and recommendation
 */
export const estimateTimeToFailure = (currentHealth = 50, degradationRate = 0.5) => {
  const criticalThreshold = 15
  const timeToFailure = (currentHealth - criticalThreshold) / degradationRate

  const minutes = Math.floor(timeToFailure / 60)
  const seconds = Math.round(timeToFailure % 60)

  let urgency = 'LOW'
  let action = 'Monitor systems'

  if (timeToFailure < 300) {
    // Less than 5 minutes
    urgency = 'CRITICAL'
    action = 'ABORT MISSION - Return to base immediately'
  } else if (timeToFailure < 600) {
    // Less than 10 minutes
    urgency = 'HIGH'
    action = 'Complete current capture and return'
  } else if (timeToFailure < 1200) {
    // Less than 20 minutes
    urgency = 'MEDIUM'
    action = 'Prioritize targets and begin return within 5 minutes'
  }

  return {
    currentHealth,
    estimatedMinutes: minutes,
    estimatedSeconds: seconds,
    timeToFailure,
    urgency,
    recommendedAction: action,
    summary: `Estimated ${minutes}m ${seconds}s until critical failure at current degradation rate`,
  }
}

/**
 * Get health trend analysis
 * @param {Array} healthHistory - Array of health values over time
 * @returns {Object} Trend analysis
 */
export const analyzeHealthTrend = (healthHistory = []) => {
  if (healthHistory.length < 2) {
    return {
      trend: 'INSUFFICIENT_DATA',
      slope: 0,
      prediction: 'Cannot predict trend with less than 2 data points',
    }
  }

  const recentHealth = healthHistory.slice(-5)
  const trend =
    recentHealth[recentHealth.length - 1] > recentHealth[recentHealth.length - 2] ? 'IMPROVING' : 'DEGRADING'

  // Simple linear regression for slope
  const n = recentHealth.length
  const sumX = (n * (n - 1)) / 2
  const sumY = recentHealth.reduce((a, b) => a + b, 0)
  const sumXY = recentHealth.reduce((sum, val, i) => sum + i * val, 0)
  const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)

  let prediction = 'Stable'
  if (slope < -1) {
    prediction = 'Rapid degradation expected'
  } else if (slope < -0.5) {
    prediction = 'Gradual degradation detected'
  } else if (slope > 0.5) {
    prediction = 'System recovering'
  }

  return {
    trend,
    slope: slope.toFixed(2),
    prediction,
    recentAverage: Math.round(sumY / recentHealth.length),
  }
}
