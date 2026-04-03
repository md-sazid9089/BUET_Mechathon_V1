// Event System: Manages simulation events and notifications

/**
 * Event types in the mission system
 */
export const EVENT_TYPES = {
  // Mission events
  MISSION_START: 'mission_start',
  MISSION_COMPLETE: 'mission_complete',
  MISSION_ABORTED: 'mission_aborted',

  // Capture events
  CAPTURE_SUCCESS: 'capture_success',
  CAPTURE_FAILED: 'capture_failed',
  CAPTURE_SKIPPED: 'capture_skipped',

  // Safety events
  COLLISION_DETECTED: 'collision_detected',
  SENSOR_DEGRADATION: 'sensor_degradation',
  SYSTEM_FAULT: 'system_fault',

  // Navigation events
  ROUTE_REPLANNED: 'route_replanned',
  TARGET_UNREACHABLE: 'target_unreachable',
  NAVIGATION_UPDATE: 'navigation_update',

  // Resource events
  FUEL_LOW: 'fuel_low',
  FUEL_CRITICAL: 'fuel_critical',
  ENERGY_LOW: 'energy_low',
  HEALTH_WARNING: 'health_warning',

  // Decision events
  TARGET_SELECTED: 'target_selected',
  METHOD_CHANGED: 'method_changed',
  DECISION_MADE: 'decision_made',
}

/**
 * Create a new event object
 * @param {string} type - Event type
 * @param {string} message - Event message
 * @param {Object} data - Additional event data
 * @returns {Object} Event object
 */
export const createEvent = (type, message, data = {}) => {
  return {
    id: `${type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    type,
    message,
    timestamp: new Date(),
    data,
    severity: getSeverityForEventType(type),
  }
}

/**
 * Get severity level for an event type
 * @param {string} eventType - Event type
 * @returns {string} Severity level: 'INFO', 'CAUTION', 'WARNING', 'CRITICAL'
 */
export const getSeverityForEventType = (eventType) => {
  const severityMap = {
    [EVENT_TYPES.MISSION_START]: 'INFO',
    [EVENT_TYPES.MISSION_COMPLETE]: 'INFO',
    [EVENT_TYPES.CAPTURE_SUCCESS]: 'INFO',
    [EVENT_TYPES.CAPTURE_SKIPPED]: 'CAUTION',
    [EVENT_TYPES.CAPTURE_FAILED]: 'WARNING',
    [EVENT_TYPES.COLLISION_DETECTED]: 'WARNING',
    [EVENT_TYPES.SENSOR_DEGRADATION]: 'CAUTION',
    [EVENT_TYPES.SYSTEM_FAULT]: 'WARNING',
    [EVENT_TYPES.ROUTE_REPLANNED]: 'CAUTION',
    [EVENT_TYPES.TARGET_UNREACHABLE]: 'WARNING',
    [EVENT_TYPES.FUEL_CRITICAL]: 'CRITICAL',
    [EVENT_TYPES.FUEL_LOW]: 'WARNING',
    [EVENT_TYPES.HEALTH_WARNING]: 'WARNING',
    [EVENT_TYPES.METHOD_CHANGED]: 'INFO',
  }
  return severityMap[eventType] || 'INFO'
}

/**
 * Format event for display
 * @param {Object} event - Event object
 * @returns {Object} Formatted event for UI
 */
export const formatEventForDisplay = (event) => {
  const icons = {
    [EVENT_TYPES.MISSION_START]: '🚀',
    [EVENT_TYPES.MISSION_COMPLETE]: '✓',
    [EVENT_TYPES.CAPTURE_SUCCESS]: '🎯',
    [EVENT_TYPES.CAPTURE_FAILED]: '❌',
    [EVENT_TYPES.COLLISION_DETECTED]: '⚠️',
    [EVENT_TYPES.SENSOR_DEGRADATION]: '📡',
    [EVENT_TYPES.SYSTEM_FAULT]: '⚙️',
    [EVENT_TYPES.ROUTE_REPLANNED]: '🗺️',
    [EVENT_TYPES.FUEL_CRITICAL]: '🔴',
    [EVENT_TYPES.FUEL_LOW]: '🟡',
  }

  const colorMap = {
    INFO: 'text-blue-400',
    CAUTION: 'text-yellow-400',
    WARNING: 'text-orange-400',
    CRITICAL: 'text-red-400',
  }

  return {
    ...event,
    icon: icons[event.type] || '●',
    timeString: event.timestamp.toLocaleTimeString(),
    colorClass: colorMap[event.severity],
    displayMessage: `${event.message}`,
  }
}

/**
 * Generate caption/explanation for an event
 * @param {Object} event - Event object
 * @returns {string} Explanation text
 */
export const getEventExplanation = (event) => {
  const explanations = {
    [EVENT_TYPES.COLLISION_DETECTED]: `Collision risk detected at ${event.timestamp.toLocaleTimeString()}. Debris trajectory intersects with spacecraft path. Recommended action: reduce approach velocity or change target.`,
    [EVENT_TYPES.SENSOR_DEGRADATION]: 'Navigation sensor accuracy has degraded. Position uncertainty increasing. Recommend recalibration procedures.',
    [EVENT_TYPES.ROUTE_REPLANNED]: `Mission route has been recalculated based on current conditions. ${event.data.reason || 'New optimal path selected.'}`,
    [EVENT_TYPES.CAPTURE_SUCCESS]: `Successfully captured debris ${event.data.targetId}. Added to collection and secured in cargo hold.`,
    [EVENT_TYPES.CAPTURE_FAILED]: `Capture attempt on ${event.data.targetId} failed. Debris stability may be higher than predicted. Alternative approach strategies available.`,
    [EVENT_TYPES.FUEL_CRITICAL]: 'Fuel reserves critically low. Immediate return to base advised to ensure safe landing.',
    [EVENT_TYPES.HEALTH_WARNING]: 'System health status degraded. Minor issues detected in spacecraft systems. Early maintenance recommended.',
  }

  return explanations[event.type] || event.message
}

/**
 * Filter events by type and/or severity
 * @param {Array} events - Array of events
  * @param {Object} filters - Filter criteria { type: string, severity: string, startTime: date, endTime: date }
 * @returns {Array} Filtered events
 */
export const filterEvents = (events, filters = {}) => {
  return events.filter((event) => {
    if (filters.type && event.type !== filters.type) return false
    if (filters.severity && event.severity !== filters.severity) return false
    if (filters.startTime && event.timestamp < filters.startTime) return false
    if (filters.endTime && event.timestamp > filters.endTime) return false
    return true
  })
}

/**
 * Get event statistics
 * @param {Array} events - Array of events
 * @returns {Object} Event statistics
 */
export const getEventStatistics = (events) => {
  const stats = {
    total: events.length,
    bySeverity: {
      INFO: 0,
      CAUTION: 0,
      WARNING: 0,
      CRITICAL: 0,
    },
    byType: {},
    lastEvent: events[events.length - 1] || null,
    criticalCount: 0,
  }

  events.forEach((event) => {
    stats.bySeverity[event.severity]++
    stats.byType[event.type] = (stats.byType[event.type] || 0) + 1

    if (event.severity === 'CRITICAL') {
      stats.criticalCount++
    }
  })

  return stats
}

/**
 * Generate timeline visualization data
 * @param {Array} events - Array of events
 * @returns {Array} Timeline data for charts
 */
export const getEventTimeline = (events) => {
  return events.map((event, index) => ({
    time: event.timestamp,
    message: event.message,
    severity: event.severity,
    index,
  }))
}

/**
 * Check if a specific condition-triggered event should fire
 * @param {Object} missionState - Current mission state
 * @param {string} eventType - Event type to check
 * @returns {Object} Event object if triggered, null otherwise
 */
export const checkEventTrigger = (missionState, eventType) => {
  const { fuel = 100, health = 100, collisionRisk = 0, uncertainty = 0 } = missionState

  switch (eventType) {
    case EVENT_TYPES.FUEL_CRITICAL:
      if (fuel < 10) {
        return createEvent(EVENT_TYPES.FUEL_CRITICAL, 'Fuel reserves critically low - abort imminent', { fuel })
      }
      break

    case EVENT_TYPES.FUEL_LOW:
      if (fuel < 25 && fuel >= 10) {
        return createEvent(EVENT_TYPES.FUEL_LOW, `Fuel reserves low at ${fuel}%`, { fuel })
      }
      break

    case EVENT_TYPES.HEALTH_WARNING:
      if (health < 40 && health >= 20) {
        return createEvent(EVENT_TYPES.HEALTH_WARNING, `System health warning - ${health}% operational`, { health })
      }
      break

    case EVENT_TYPES.COLLISION_DETECTED:
      if (collisionRisk > 70) {
        return createEvent(EVENT_TYPES.COLLISION_DETECTED, `High collision risk detected: ${collisionRisk}%`, {
          collisionRisk,
        })
      }
      break

    case EVENT_TYPES.SENSOR_DEGRADATION:
      if (uncertainty > 75) {
        return createEvent(EVENT_TYPES.SENSOR_DEGRADATION, `Navigation uncertainty at ${uncertainty}%`, {
          uncertainty,
        })
      }
      break
  }

  return null
}

/**
 * Create a batch of related events
 * @param {Array} eventTypes - Array of event type definitions
 * @param {Object} context - Context data for all events
 * @returns {Array} Array of created events
 */
export const createEventBatch = (eventTypes, context = {}) => {
  return eventTypes.map((eventDef) => createEvent(eventDef.type, eventDef.message, { ...context, ...eventDef.data }))
}

/**
 * Get human-readable event summary
 * @param {Array} events - Array of events
 * @returns {string} Summary text
 */
export const getEventSummary = (events) => {
  const stats = getEventStatistics(events)

  let summary = `Mission event log: ${stats.total} total events\n`
  summary += `Critical: ${stats.bySeverity.CRITICAL} | Warnings: ${stats.bySeverity.WARNING} | Cautions: ${stats.bySeverity.CAUTION}\n`

  const topEvents = Object.entries(stats.byType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)

  if (topEvents.length > 0) {
    summary += 'Top events: ' + topEvents.map((e) => `${e[0]} (${e[1]}x)`).join(', ')
  }

  return summary
}
