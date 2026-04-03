// Cluster Engine: Debris clustering and intelligent cluster selection

import { MOCK_DEBRIS_DATA } from '../data/mockData'

/**
 * Group debris into spatial clusters using proximity rules
 * @param {Array} debrisList - Array of debris objects
 * @returns {Array} Clustered debris with cluster assignments
 */
export const groupDebrisIntoClusters = (debrisList = MOCK_DEBRIS_DATA) => {
  const clusters = {}

  debrisList.forEach((debris) => {
    if (!clusters[debris.cluster]) {
      clusters[debris.cluster] = {
        id: debris.cluster,
        items: [],
        totalRisk: 0,
        avgAltitude: 0,
        avgVelocity: 0,
      }
    }
    clusters[debris.cluster].items.push(debris)
  })

  // Calculate cluster statistics
  Object.keys(clusters).forEach((clusterId) => {
    const cluster = clusters[clusterId]
    cluster.totalRisk = cluster.items.reduce((sum, d) => sum + d.riskScore, 0)
    cluster.avgAltitude = cluster.items.reduce((sum, d) => sum + d.altitude, 0) / cluster.items.length
    cluster.avgVelocity = cluster.items.reduce((sum, d) => sum + d.velocity, 0) / cluster.items.length
    cluster.count = cluster.items.length
  })

  return Object.values(clusters)
}

/**
 * Calculate cluster priority score
 * Higher score = higher priority for capture
 * @param {Object} cluster - Cluster object with statistics
 * @param {Object} missionState - Current mission state
 * @returns {number} Priority score (0-100)
 */
const calculateClusterPriority = (cluster, missionState) => {
  const { collisionRisk, fuel, uncertainty } = missionState

  // Base priority from cluster risk
  let priority = cluster.totalRisk * 0.4

  // Proximity factor: lower altitude = more urgent (closer decay)
  const altitudeUrgency = Math.max(0, (800 - cluster.avgAltitude) / 800) * 30
  priority += altitudeUrgency

  // Cluster size factor: more debris = more impact
  const sizeFactor = Math.min(cluster.count * 5, 20)
  priority += sizeFactor

  // Mission state penalties
  if (collisionRisk > 70) {
    priority *= 0.9 // High risk makes decisions harder
  }

  if (fuel < 30) {
    priority *= 1.2 // Low fuel increases urgency
  }

  return Math.min(100, priority)
}

/**
 * Select the best cluster for current mission state
 * @param {Array} clusters - Available clusters
 * @param {Object} missionState - Current mission state
 * @returns {Object} Selected cluster with reasoning
 */
export const selectBestCluster = (clusters, missionState) => {
  const clustersWithScores = clusters.map((cluster) => ({
    ...cluster,
    priority: calculateClusterPriority(cluster, missionState),
  }))

  // Sort by priority
  clustersWithScores.sort((a, b) => b.priority - a.priority)

  const bestCluster = clustersWithScores[0]

  return {
    cluster: bestCluster,
    reasoning: `Cluster ${bestCluster.id} selected - Priority: ${Math.round(bestCluster.priority)}/100. ${bestCluster.count} debris items, avg altitude: ${Math.round(bestCluster.avgAltitude)}km, total risk: ${Math.round(bestCluster.totalRisk)}%`,
    alternatives: clustersWithScores.slice(1).map((c) => ({
      id: c.id,
      priority: Math.round(c.priority),
    })),
  }
}

/**
 * Analyze cluster characteristics
 * @param {Object} cluster - Cluster object
 * @returns {Object} Analysis with recommendations
 */
export const analyzeCluster = (cluster) => {
  const avgRisk = cluster.totalRisk / cluster.count
  const isHighRisk = avgRisk > 70
  const isHighAltitude = cluster.avgAltitude > 650
  const isHighVelocity = cluster.avgVelocity > 7.8

  let riskLevel = 'LOW'
  let recommendation = 'Proceed with nominal capture procedures'

  if (isHighRisk && isHighVelocity) {
    riskLevel = 'CRITICAL'
    recommendation = 'Extreme caution advised - high velocity + high risk debris. Consider staged approach.'
  } else if (isHighRisk) {
    riskLevel = 'HIGH'
    recommendation = 'High-risk debris detected. Implement enhanced collision avoidance.'
  } else if (isHighAltitude && isHighRisk) {
    riskLevel = 'MEDIUM'
    recommendation = 'Moderate risk. Monitor approach angle carefully.'
  }

  return {
    riskLevel,
    recommendation,
    avgRisk: Math.round(avgRisk),
    avgAltitude: Math.round(cluster.avgAltitude),
    avgVelocity: cluster.avgVelocity.toFixed(2),
    debrisCount: cluster.count,
  }
}

/**
 * Get cluster details for display
 * @param {Object} cluster - Cluster object
 * @returns {Array} Formatted cluster details
 */
export const getClusterDetails = (cluster) => {
  return [
    { label: 'Debris Objects', value: cluster.count },
    { label: 'Combined Risk', value: `${Math.round(cluster.totalRisk)}%` },
    { label: 'Avg Altitude', value: `${Math.round(cluster.avgAltitude)} km` },
    { label: 'Avg Velocity', value: `${cluster.avgVelocity.toFixed(2)} km/s` },
    { label: 'Priority', value: 'High' },
  ]
}
