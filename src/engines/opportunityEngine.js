// Opportunity Engine: Evaluates launch windows and intercept costs

export const LAUNCH_WINDOWS = [
  {
    id: 'window-1',
    name: 'Optimal Window',
    timing: 'T+2.5 hours',
    deltaV: 2.3, // km/s
    fuelCost: 15,
    successProbability: 0.92,
    description: 'Highest probability window with minimal fuel cost',
  },
  {
    id: 'window-2',
    name: 'Standard Window',
    timing: 'T+4.0 hours',
    deltaV: 3.1, // km/s
    fuelCost: 22,
    successProbability: 0.85,
    description: 'Moderate fuel requirement with good success rate',
  },
  {
    id: 'window-3',
    name: 'Extended Window',
    timing: 'T+6.5 hours',
    deltaV: 4.2, // km/s
    fuelCost: 35,
    successProbability: 0.78,
    description: 'Higher fuel cost but more flexibility in execution',
  },
]

/**
 * Get the best launch window based on current constraints
 * @param {number} fuelAvailable - Current fuel percentage
 * @param {number} timeUrgency - Mission time pressure (0-1)
 * @returns {Object} Selected launch window with recommendation
 */
export const getBestLaunchWindow = (fuelAvailable, timeUrgency = 0.5) => {
  // Rule-based selection
  if (fuelAvailable > 80 && timeUrgency < 0.3) {
    // Plenty of fuel, no rush - choose optimal
    return {
      window: LAUNCH_WINDOWS[0],
      reasoning: 'Optimal window selected: sufficient fuel and time available',
      score: 1.0,
    }
  } else if (fuelAvailable > 50 && timeUrgency < 0.7) {
    // Balanced approach
    return {
      window: LAUNCH_WINDOWS[1],
      reasoning: 'Standard window selected: balanced fuel/time tradeoff',
      score: 0.85,
    }
  } else if (fuelAvailable > 30) {
    // Low fuel, extended window
    return {
      window: LAUNCH_WINDOWS[2],
      reasoning: 'Extended window selected: conserving fuel for later operations',
      score: 0.78,
    }
  } else {
    // Critical fuel situation - use optimal despite constraints
    return {
      window: LAUNCH_WINDOWS[0],
      reasoning: 'Optimal window forced: critical fuel situation requires immediate action',
      score: 0.92,
    }
  }
}

/**
 * Calculate predicted intercept cost (fuel and time)
 * @param {Object} debris - Target debris object
 * @param {number} distance - Distance to intercept (km)
 * @returns {Object} Cost estimates with explanation
 */
export const getPredictedInterceptCost = (debris, distance = 500) => {
  // Base fuel calculation: distance * complexity factor
  const baseFuel = (distance / 200) * 10 // Scales 0-100
  const complexityFactor = debris.captureDifficulty === 'VERY_HIGH' ? 1.4 : debris.captureDifficulty === 'HIGH' ? 1.2 : 1.0
  const fuelRequired = Math.min(100, baseFuel * complexityFactor)

  // Time calculation: distance / approach velocity
  const approachVelocity = 7.5 // km/s
  const timeRequired = (distance / approachVelocity) * 60 // in seconds
  const estimatedMinutes = Math.ceil(timeRequired / 60)

  // Energy for capture preparation
  const energyRequired = debris.size * 2 + debris.mass * 0.5

  return {
    fuel: Math.round(fuelRequired),
    time: estimatedMinutes,
    energy: Math.round(energyRequired),
    risk: debris.riskScore,
    explanation: `Intercept cost for ${debris.id}: ${Math.round(fuelRequired)}% fuel, ${estimatedMinutes}m time, ${Math.round(energyRequired)} energy units. Risk level: ${debris.riskScore}%`,
  }
}

/**
 * Evaluate all launch windows with current mission state
 * @param {Object} missionState - Current mission state
 * @returns {Array} Windows sorted by recommendation score
 */
export const evaluateLaunchWindows = (missionState) => {
  const { fuel, energy, collisionRisk } = missionState

  return LAUNCH_WINDOWS.map((window) => {
    let score = window.successProbability

    // Penalty for low fuel
    if (fuel < window.fuelCost) {
      score *= 0.5
    }

    // Penalty for high collision risk
    if (collisionRisk > 60) {
      score *= 0.8
    }

    // Bonus for time urgency (extended window in urgent situations)
    if (collisionRisk > 70 && window.id === 'window-2') {
      score *= 1.1
    }

    return {
      ...window,
      adjustedScore: score,
      feasible: fuel >= window.fuelCost,
    }
  }).sort((a, b) => b.adjustedScore - a.adjustedScore)
}
