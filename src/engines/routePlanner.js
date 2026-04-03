// Route Planner: Generate ordered routes from ranked targets

/**
 * Calculate distance between two debris objects (simplified 2D)
 * @param {Object} from - Starting position (or debris object)
 * @param {Object} to - Target position (or debris object)
 * @returns {number} Distance in km
 */
const calculateDistance = (from, to) => {
  const dx = (from.longitude || 0) - (to.longitude || 0)
  const dy = (from.latitude || 0) - (to.latitude || 0)
  return Math.sqrt(dx * dx + dy * dy) * 111 // Rough conversion to km
}

/**
 * Generate an optimized route through ranked targets using nearest-neighbor algorithm
 * @param {Array} rankedTargets - Array of ranked target objects
 * @param {Object} spacecraftPosition - Current spacecraft position {latitude, longitude}
 * @param {number} maxTargets - Maximum number of targets to include
 * @returns {Object} Route plan with waypoints and statistics
 */
export const generateOptimizedRoute = (
  rankedTargets,
  spacecraftPosition = { latitude: 0, longitude: 0 },
  maxTargets = 8
) => {
  if (rankedTargets.length === 0) {
    return {
      waypoints: [],
      totalDistance: 0,
      totalTime: 0,
      totalFuel: 0,
      routeOrder: [],
      explanation: 'No targets available for route planning',
    }
  }

  // Convert ranked targets to waypoints with metadata
  let availableTargets = rankedTargets.slice(0, maxTargets).map((target, idx) => ({
    targetIndex: idx,
    ...target,
    visited: false,
  }))

  // Nearest-neighbor route calculation
  const waypoints = []
  let currentPosition = spacecraftPosition
  let totalDistance = 0
  let routeOrder = []

  // Add first target (highest priority)
  const firstTarget = availableTargets[0]
  waypoints.push({
    ...firstTarget,
    order: 1,
    distanceFromPrevious: calculateDistance(currentPosition, firstTarget.debris),
  })
  totalDistance += waypoints[0].distanceFromPrevious
  routeOrder.push(firstTarget.debris.id)
  availableTargets[0].visited = true
  currentPosition = firstTarget.debris

  // Build remaining route using nearest-neighbor
  let order = 2
  while (availableTargets.some((t) => !t.visited) && waypoints.length < maxTargets) {
    let nearestTarget = null
    let nearestDistance = Infinity

    availableTargets.forEach((target) => {
      if (!target.visited) {
        const dist = calculateDistance(currentPosition, target.debris)
        if (dist < nearestDistance) {
          nearestDistance = dist
          nearestTarget = target
        }
      }
    })

    if (nearestTarget) {
      waypoints.push({
        ...nearestTarget,
        order,
        distanceFromPrevious: nearestDistance,
      })
      totalDistance += nearestDistance
      routeOrder.push(nearestTarget.debris.id)
      currentPosition = nearestTarget.debris
      nearestTarget.visited = true
      order++
    }
  }

  // Calculate time and fuel estimates
  const avgVelocity = 7.5 // km/s
  const totalTime = Math.ceil((totalDistance / avgVelocity) / 60) // in minutes
  const fuelEfficiency = 0.08 // % per km
  const totalFuel = Math.round(totalDistance * fuelEfficiency)

  return {
    waypoints,
    totalDistance: Math.round(totalDistance),
    totalTime,
    totalFuel,
    routeOrder,
    estDuration: `${totalTime} minutes`,
    explanation: `Optimized route planned: ${routeOrder.length} targets, ${Math.round(totalDistance)}km distance, ${totalFuel}% fuel estimated`,
  }
}

/**
 * Generate a conservative route (fewer targets, safer approach)
 * @param {Array} rankedTargets - Array of ranked targets
 * @param {Object} spacecraftPosition - Spacecraft current position
 * @returns {Object} Route plan
 */
export const generateConservativeRoute = (rankedTargets, spacecraftPosition = { latitude: 0, longitude: 0 }) => {
  const route = generateOptimizedRoute(rankedTargets, spacecraftPosition, 3) // Only top 3
  route.explanation = `Conservative route: only ${route.routeOrder.length} high-confidence targets selected for enhanced safety`
  return route
}

/**
 * Generate an aggressive route (maximum targets, accepts more risk)
 * @param {Array} rankedTargets - Array of ranked targets
 * @param {Object} spacecraftPosition - Spacecraft current position
 * @returns {Object} Route plan
 */
export const generateAggressiveRoute = (rankedTargets, spacecraftPosition = { latitude: 0, longitude: 0 }) => {
  const route = generateOptimizedRoute(rankedTargets, spacecraftPosition, Math.min(10, rankedTargets.length))
  route.explanation = `Aggressive route: ${route.routeOrder.length} targets, maximizing mission success at increased risk`
  return route
}

/**
 * Recalculate route excluding a specific target
 * @param {Array} rankedTargets - All ranked targets
 * @param {string} excludeTargetId - Target ID to skip
 * @param {Object} spacecraftPosition - Current position
 * @returns {Object} Recalculated route plan
 */
export const recalculateRoute = (rankedTargets, excludeTargetId, spacecraftPosition = { latitude: 0, longitude: 0 }) => {
  const filtered = rankedTargets.filter((target) => target.debris.id !== excludeTargetId)
  const route = generateOptimizedRoute(filtered, spacecraftPosition)
  route.explanation = `Route recalculated excluding ${excludeTargetId}: ${route.routeOrder.length} targets, ${Math.round(route.totalDistance)}km`
  return route
}

/**
 * Get route details for display
 * @param {Object} route - Route plan object
 * @returns {Array} Formatted route details
 */
export const getRouteDetails = (route) => {
  return [
    { label: 'Total Distance', value: `${route.totalDistance} km` },
    { label: 'Estimated Time', value: route.estDuration },
    { label: 'Fuel Required', value: `${route.totalFuel}%` },
    { label: 'Targets', value: route.routeOrder.length },
    {
      label: 'Route',
      value: route.routeOrder.join(' → '),
    },
  ]
}

/**
 * Get navigation instructions for next waypoint
 * @param {Object} route - Route plan
 * @param {number} currentWaypoint - Current waypoint index
 * @returns {Object} Navigation instruction
 */
export const getNextNavigation = (route, currentWaypoint = 0) => {
  if (currentWaypoint >= route.waypoints.length) {
    return {
      instruction: 'Route complete',
      target: null,
      distance: null,
    }
  }

  const waypoint = route.waypoints[currentWaypoint]
  return {
    instruction: `Proceed to waypoint ${waypoint.order}`,
    target: waypoint.debris.id,
    distance: `${waypoint.distanceFromPrevious.toFixed(0)} km`,
    difficulty: waypoint.debris.captureDifficulty,
  }
}
