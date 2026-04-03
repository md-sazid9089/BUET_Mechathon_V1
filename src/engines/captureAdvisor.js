// Capture Advisor: Rule-based capture method selection and recommendations

import { CAPTURE_METHODS } from '../data/mockData'

/**
 * Evaluate if a target should be skipped due to high uncertainty
 * @param {Object} debris - Target debris
 * @param {number} uncertaintyThreshold - Threshold for skipping (default 85%)
 * @returns {Object} Decision with reasoning
 */
const shouldSkipTarget = (debris, uncertaintyThreshold = 85) => {
  const shouldSkip = debris.uncertainty > uncertaintyThreshold
  return {
    shouldSkip,
    reasoning: shouldSkip ? `Target skipped: uncertainty (${debris.uncertainty}%) exceeds threshold (${uncertaintyThreshold}%)` : `Target acceptable: uncertainty within limits`,
    uncertainty: debris.uncertainty,
    threshold: uncertaintyThreshold,
  }
}

/**
 * Recommend optimal capture method based on debris characteristics
 * Rules:
 * - low tumble + metallic → magnetic docking
 * - unstable → net capture
 * - high tumble → stabilize first
 * - high uncertainty → skip
 * @param {Object} debris - Target debris
 * @param {Object} missionState - Current mission state
 * @returns {Object} Capture recommendation with reasoning
 */
export const recommendCaptureMethod = (debris, missionState = {}) => {
  const { fuel = 100, energy = 100, collisionRisk = 0 } = missionState

  // Check if should skip due to uncertainty
  const skipDecision = shouldSkipTarget(debris, 85)
  if (skipDecision.shouldSkip) {
    return {
      method: null,
      recommendation: 'SKIP TARGET',
      reasoning: skipDecision.reasoning,
      feasible: false,
      explanation: 'High uncertainty makes capture inadvisable - skipping this target',
    }
  }

  // Rule-based method selection
  let selectedMethod = null
  let reasoning = ''

  const isTumbling = debris.tumbleRate > 30 // degrees/sec
  const isMetallic = debris.composition === 'metallic'
  const isUnstable = debris.stability < 40
  const hasHighTumble = debris.tumbleRate > 50

  if (!isTumbling && isMetallic) {
    // Low tumble + metallic → magnetic docking
    selectedMethod = CAPTURE_METHODS.find((m) => m.id === 'magnetic-docking') || CAPTURE_METHODS[0]
    reasoning = `Magnetic docking selected: low tumble rate (${debris.tumbleRate}°/s) + metallic composition ideal for magnetic capture`
  } else if (isUnstable && !hasHighTumble) {
    // Unstable → net capture
    selectedMethod = CAPTURE_METHODS.find((m) => m.id === 'net-capture') || CAPTURE_METHODS[1]
    reasoning = `Net capture selected: unstable debris (stability: ${debris.stability}%) requires flexible capture method`
  } else if (hasHighTumble) {
    // High tumble → stabilize first
    selectedMethod = CAPTURE_METHODS.find((m) => m.id === 'stabilization-first') || CAPTURE_METHODS[2]
    reasoning = `Stabilization first selected: high tumble rate (${debris.tumbleRate}°/s) requires pre-capture stabilization`
  } else {
    // Default: contact capture
    selectedMethod = CAPTURE_METHODS.find((m) => m.id === 'contact-capture') || CAPTURE_METHODS[0]
    reasoning = `Contact capture selected: standard approach for debris characteristics`
  }

  // Check feasibility
  const fuelRequired = selectedMethod.fuel
  const energyRequired = debris.size * 2
  const feasible = fuel >= fuelRequired && energy >= energyRequired

  if (!feasible) {
    const issues = []
    if (fuel < fuelRequired) issues.push(`insufficient fuel (need ${fuelRequired}%, have ${fuel}%)`)
    if (energy < energyRequired) issues.push(`insufficient energy (need ${energyRequired}, have ${energy})`)
    reasoning += ` ⚠️ WARNING: ${issues.join(', ')}`
  }

  return {
    method: selectedMethod,
    recommendation: selectedMethod.name,
    reasoning,
    feasible,
    successProbability: calculateSuccessProbability(debris, selectedMethod, missionState),
    explanation: `Method: ${selectedMethod.name}. Success rate: ${(calculateSuccessProbability(debris, selectedMethod, missionState) * 100).toFixed(0)}%`
  }
}

/**
 * Calculate success probability for a capture attempt
 * @param {Object} debris - Target debris
 * @param {Object} method - Capture method
 * @param {Object} missionState - Mission state
 * @returns {number} Success probability (0-1)
 */
export const calculateSuccessProbability = (debris, method, missionState = {}) => {
  let probability = method.successRate || 0.8

  // Adjust for debris characteristics
  probability *= 1 - debris.uncertainty / 500 // Uncertainty penalty
  probability *= 1 - debris.tumbleRate / 200 // Tumble penalty

  // Adjust for mission state
  const { collisionRisk = 0, fuel = 100, energy = 100 } = missionState
  probability *= 1 - collisionRisk / 300 // Risk penalty
  probability *= Math.max(0.3, fuel / 100) // Fuel impact
  probability *= Math.max(0.4, energy / 100) // Energy impact

  return Math.max(0.1, Math.min(1, probability))
}

/**
 * Get all viable capture methods for a target
 * @param {Object} debris - Target debris
 * @param {Object} missionState - Mission state
 * @returns {Array} Viable methods with scores
 */
export const getViableMethods = (debris, missionState = {}) => {
  return CAPTURE_METHODS.map((method) => {
    const successProb = calculateSuccessProbability(debris, method, missionState)
    const { fuel = 100, energy = 100 } = missionState
    const feasible = fuel >= method.fuel && energy >= debris.size * 2

    return {
      method,
      successProbability: successProb,
      score: successProb * (feasible ? 1 : 0.5),
      feasible,
      fuelRequired: method.fuel,
      timeRequired: method.time,
    }
  }).sort((a, b) => b.score - a.score)
}

/**
 * Get capture preparation checklist
 * @param {Object} debris - Target debris
 * @param {Object} selectedMethod - Selected capture method
 * @returns {Array} Preparation steps
 */
export const getPreparationChecklist = (debris, selectedMethod) => {
  const checklist = [
    { step: 1, task: 'Reduce approach velocity', status: 'Ready' },
    { step: 2, task: 'Activate sensors', status: 'Ready' },
    { step: 3, task: 'Deploy capture mechanism', status: 'Ready' },
    { step: 4, task: 'Establish targeting lock', status: 'Ready' },
  ]

  if (debris.tumbleRate > 50) {
    checklist.splice(2, 0, {
      step: 2.5,
      task: 'Deploy stabilization field',
      status: 'Ready',
    })
  }

  if (debris.uncertainty > 70) {
    checklist.push({
      step: 5,
      task: 'Verify position update',
      status: 'Ready',
    })
  }

  return checklist
}

/**
 * Get human-readable capture explanation
 * @param {Object} debris - Target debris
 * @param {Object} recommendation - Capture recommendation object
 * @returns {string} Formatted explanation
 */
export const getCaptureExplanation = (debris, recommendation) => {
  if (!recommendation.feasible) {
    return `Cannot capture ${debris.id}: ${recommendation.reasoning}`
  }

  const safetyFactors = []
  if (debris.tumbleRate > 50) safetyFactors.push('high tumble rate')
  if (debris.uncertainty > 70) safetyFactors.push('high uncertainty')
  if (debris.size > 5) safetyFactors.push('large size')

  let explanation = `Capture plan for ${debris.id}:\n`
  explanation += `Method: ${recommendation.method.name}\n`
  explanation += `Success Rate: ${(recommendation.successProbability * 100).toFixed(0)}%\n`

  if (safetyFactors.length > 0) {
    explanation += `⚠️ Safety factors: ${safetyFactors.join(', ')}\n`
  }

  explanation += `Fuel cost: ${recommendation.method.fuel}%\n`
  explanation += `Time required: ${recommendation.method.time} seconds`

  return explanation
}
