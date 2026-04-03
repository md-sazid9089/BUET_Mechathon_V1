// Ranking Engine: Target ranking with weighted scoring system

/**
 * Normalize a value to 0-100 scale
 * @param {number} value - Value to normalize
 * @param {number} min - Minimum possible value
 * @param {number} max - Maximum possible value
 * @returns {number} Normalized value (0-100)
 */
const normalize = (value, min = 0, max = 100) => {
  return Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))
}

/**
 * Calculate composite ranking score for a debris target
 * Score = risk*0.3 + proximity*0.2 + captureEase*0.2 + value*0.2 - uncertainty*0.1
 * @param {Object} debris - Target debris object
 * @param {number} distance - Distance to target (km)
 * @param {number} missionTime - Time in mission (0-1)
 * @returns {Object} Ranking score and component breakdown
 */
export const calculateTargetScore = (debris, distance = 500, missionTime = 0) => {
  // Risk component (0-100): higher risk = higher priority
  const riskScore = Math.min(100, debris.riskScore)

  // Proximity component (0-100): closer = higher priority
  // Normalize distance: 0km = 100, 1000km = 0
  const proximityScore = Math.max(0, 100 - (distance / 1000) * 100)

  // Capture ease component (0-100): easier = higher priority
  const difficultyMap = {
    LOW: 100,
    MEDIUM: 75,
    HIGH: 50,
    VERY_HIGH: 25,
  }
  const captureEaseScore = difficultyMap[debris.captureDifficulty] || 50

  // Value component (0-100): larger/more valuable = higher priority
  const sizeValue = normalize(debris.size, 0, 10)
  const valueScore = (sizeValue + normalize(debris.mass, 0, 5000)) / 2

  // Uncertainty component (0-100): higher uncertainty = lower priority
  const uncertaintyPenalty = Math.min(100, debris.uncertainty || 40)

  // Apply weighted formula
  const compositeScore =
    riskScore * 0.3 + proximityScore * 0.2 + captureEaseScore * 0.2 + valueScore * 0.2 - uncertaintyPenalty * 0.1

  return {
    debris,
    compositeScore: Math.max(0, Math.round(compositeScore)),
    components: {
      risk: Math.round(riskScore),
      proximity: Math.round(proximityScore),
      captureEase: Math.round(captureEaseScore),
      value: Math.round(valueScore),
      uncertainty: Math.round(uncertaintyPenalty),
    },
    explanation: `Score breakdown: Risk (${Math.round(riskScore)} × 0.3) + Proximity (${Math.round(proximityScore)} × 0.2) + Capture Ease (${Math.round(captureEaseScore)} × 0.2) + Value (${Math.round(valueScore)} × 0.2) - Uncertainty (${Math.round(uncertaintyPenalty)} × 0.1) = ${Math.max(0, Math.round(compositeScore))}`,
  }
}

/**
 * Rank a list of targets by composite score
 * @param {Array} debrisList - List of debris objects
 * @param {number} distance - Distance to targets (simplified)
 * @param {number} missionTime - Time in mission (0-1)
 * @returns {Array} Sorted targets with scores
 */
export const rankTargets = (debrisList, distance = 500, missionTime = 0) => {
  return debrisList
    .map((debris) => calculateTargetScore(debris, distance + Math.random() * 100, missionTime))
    .sort((a, b) => b.compositeScore - a.compositeScore)
}

/**
 * Get recommendation for target prioritization
 * @param {Array} rankedTargets - Ranked targets from rankTargets()
 * @param {Object} missionState - Current mission state
 * @returns {Object} Recommendation with reasoning
 */
export const getRankingRecommendation = (rankedTargets, missionState) => {
  if (rankedTargets.length === 0) {
    return {
      recommendation: 'No valid targets available',
      reasoning: 'Cluster contains no capturable debris',
    }
  }

  const topTarget = rankedTargets[0]
  const hazardFlag = topTarget.debris.uncertainty > 80 ? ' ⚠️ HIGH UNCERTAINTY' : ''
  const easyCapture = topTarget.components.captureEase > 75 ? ' ✓ Easy capture' : ''

  return {
    recommendation: `Engage ${topTarget.debris.id} (Score: ${topTarget.compositeScore}/100)${hazardFlag}${easyCapture}`,
    reasoning: topTarget.explanation,
    alternativeCount: Math.min(3, rankedTargets.length - 1),
    skipDueToUncertainty: topTarget.debris.uncertainty > 90,
  }
}

/**
 * Filter targets based on mission constraints
 * @param {Array} rankedTargets - All ranked targets
 * @param {Object} constraints - Mission constraints
 * @returns {Object} Filtered list with reasoning
 */
export const filterTargets = (rankedTargets, constraints = {}) => {
  const { maxUncertainty = 85, minScore = 30, skillLevel = 'advanced' } = constraints

  const filtered = rankedTargets.filter((target) => {
    if (target.debris.uncertainty > maxUncertainty) return false
    if (target.compositeScore < minScore) return false

    // Skill-based filtering
    if (skillLevel === 'beginner' && target.components.captureEase < 70) return false
    if (skillLevel === 'intermediate' && target.components.captureEase < 50) return false

    return true
  })

  const skipped = rankedTargets.length - filtered.length

  return {
    targets: filtered,
    totalTargets: rankedTargets.length,
    skipped,
    reasons: {
      highUncertainty: rankedTargets.filter((t) => t.debris.uncertainty > maxUncertainty).length,
      lowScore: rankedTargets.filter((t) => t.compositeScore < minScore).length,
      skillMismatch: rankedTargets.filter(
        (t) => skillLevel === 'beginner' && t.components.captureEase < 70
      ).length,
    },
  }
}

/**
 * Get target prioritization explanation
 * @param {Object} target - Ranked target object
 * @returns {string} Human-readable explanation
 */
export const getTargetPrioritizationExplanation = (target) => {
  const { debris, components } = target

  let explanation = `${debris.id} prioritized due to: `
  const factors = []

  if (components.risk > 70) factors.push(`High collision risk (${components.risk}%)`)
  if (components.proximity > 70) factors.push(`Close proximity (${components.proximity}/100)`)
  if (components.captureEase > 70) factors.push(`Easy capture (${components.captureEase}/100)`)
  if (components.value > 60) factors.push(`High value (${components.value}/100)`)

  if (factors.length === 0) {
    factors.push('Balanced mission objectives')
  }

  return explanation + factors.join(', ')
}
