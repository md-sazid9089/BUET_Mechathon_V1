// Helper functions for mission logic

export const calculateRiskScore = (debris) => {
  return debris.riskScore
}

export const rankTargets = (debrisList) => {
  return debrisList.sort((a, b) => {
    // Sort by risk score (descending) and then by uncertainty (descending)
    const riskDiff = b.riskScore - a.riskScore
    if (riskDiff !== 0) return riskDiff
    return b.uncertainty - a.uncertainty
  })
}

export const calculateCollisionRisk = (cluster) => {
  // Rule-based calculation: lower altitude + more debris + higher risk
  return Math.min(100, cluster.collisionRisk + (cluster.debrisCount * 5))
}

export const selectOptimalCaptureMethod = (debris, availableMethods) => {
  // Rule-based selection based on debris characteristics
  if (debris.captureDifficulty === 'VERY_HIGH') {
    return availableMethods.find(m => m.id === 'tractor-beam') || availableMethods[0]
  } else if (debris.captureDifficulty === 'HIGH') {
    return availableMethods.find(m => m.id === 'net-capture') || availableMethods[1]
  } else {
    return availableMethods.find(m => m.id === 'contact-capture') || availableMethods[0]
  }
}

export const estimateFuelRequired = (debris, method) => {
  return debris.fuelCostEstimate + method.fuel
}

export const calculateSuccessProbability = (debris, method) => {
  // Base probability from method + uncertainty penalty
  const baseProbability = method.successRate
  const uncertaintyPenalty = debris.uncertainty * 0.2
  return Math.max(0.3, baseProbability - uncertaintyPenalty)
}

export const getClusterFromDebris = (debris, clusters) => {
  return clusters.find(c => c.id === debris.cluster)
}

export const formatAltitude = (altitude) => {
  return `${altitude.toFixed(0)} km`
}

export const formatVelocity = (velocity) => {
  return `${velocity.toFixed(2)} km/s`
}

export const formatSize = (size) => {
  return `${size.toFixed(2)} m`
}

export const getStatusColor = (status) => {
  const colors = {
    idle: 'bg-gray-600',
    running: 'bg-debris-success',
    paused: 'bg-debris-warning',
    completed: 'bg-debris-info',
    error: 'bg-debris-danger',
  }
  return colors[status] || colors.idle
}

export const getStatusBadgeColor = (risk) => {
  if (risk >= 80) return 'bg-red-600 text-white'
  if (risk >= 60) return 'bg-orange-600 text-white'
  if (risk >= 40) return 'bg-yellow-600 text-white'
  return 'bg-green-600 text-white'
}

export const getPriorityColor = (priority) => {
  const colors = {
    CRITICAL: 'text-debris-danger',
    HIGH: 'text-debris-warning',
    MEDIUM: 'text-debris-info',
    LOW: 'text-debris-success',
  }
  return colors[priority] || 'text-gray-400'
}

export const getDifficultyColor = (difficulty) => {
  const colors = {
    LOW: 'bg-green-600',
    MEDIUM: 'bg-yellow-600',
    HIGH: 'bg-orange-600',
    VERY_HIGH: 'bg-red-600',
  }
  return colors[difficulty] || 'bg-gray-600'
}

export const calculateETA = (distance, velocity = 7.5) => {
  // Simple ETA calculation: distance / velocity
  // distance in km, velocity in km/s
  const seconds = distance / velocity
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  return `${minutes}m`
}

export const generateRandomEvent = () => {
  const events = [
    'Solar wind surge detected',
    'Orbital decay rate increasing',
    'Attitude determination updated',
    'Propulsion system nominal',
    'Sensor calibration complete',
    'Navigation update received',
    'System health check passed',
    'Atmospheric density fluctuation',
  ]
  return events[Math.floor(Math.random() * events.length)]
}

export const simulateUncertainty = () => {
  // Random uncertainty between 0.5 and 0.95
  return 0.5 + Math.random() * 0.45
}

export const predictNextThreats = () => {
  // Simulated threat prediction
  const threats = []
  
  const threatPool = [
    { severity: 'CRITICAL', description: 'Predicted debris collision in next orbit' },
    { severity: 'HIGH', description: 'Atmospheric drag increasing unexpectedly' },
    { severity: 'HIGH', description: 'Solar activity trending upward' },
    { severity: 'MEDIUM', description: 'Sensor drift detected in star tracker' },
    { severity: 'MEDIUM', description: 'Fuel margin below recommended threshold' },
    { severity: 'LOW', description: 'Navigation uncertainty accumulating' },
  ]

  // Return random threats
  const randomCount = Math.floor(Math.random() * 3)
  for (let i = 0; i < randomCount; i++) {
    const threat = threatPool[Math.floor(Math.random() * threatPool.length)]
    threats.push(threat)
  }

  return threats
}

export const getRecommendation = (collisionRisk, uncertainty, fuel) => {
  if (collisionRisk > 70) {
    return 'IMMEDIATE: Reduce approach velocity and increase monitoring frequency'
  }
  if (uncertainty > 80) {
    return 'Update orbital elements and recalibrate navigation sensors'
  }
  if (fuel < 15) {
    return 'ALERT: Plan fuel conservation measures or abort current objective'
  }
  return 'All systems nominal - continue current mission plan'
}
