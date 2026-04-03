# 🔗 Zustand Store API Reference

## Quick Import

```javascript
import { useMissionStore } from '../store/missionStore'
```

## State Properties Reference

### Mission Control
```javascript
// Current mission step (0-7)
const currentStep = useMissionStore((state) => state.currentStep)

// Mission status: 'idle' | 'running' | 'paused' | 'completed'
const missionStatus = useMissionStore((state) => state.missionStatus)
```

### Resources (0-100%)
```javascript
// Fuel level in percentage
const fuel = useMissionStore((state) => state.fuel)

// Energy level in percentage  
const energy = useMissionStore((state) => state.energy)

// System health in percentage
const health = useMissionStore((state) => state.health)
```

### Mission Metrics
```javascript
// Collision risk level (0-100%)
const collisionRisk = useMissionStore((state) => state.collisionRisk)

// Uncertainty level (0-1, where 1 = highest uncertainty)
const uncertainty = useMissionStore((state) => state.uncertainty)

// Number of debris objects removed
const debrisRemoved = useMissionStore((state) => state.debrisRemoved)

// Number of targets captured
const targetsCaptured = useMissionStore((state) => state.targetsCaptured)
```

### Selection & Planning
```javascript
// Currently selected debris cluster
const selectedCluster = useMissionStore((state) => state.selectedCluster)
// Returns: { id, name, altitude, debrisCount, collisionRisk, uncertainty, priority }

// List of ranked targets (sorted by priority)
const rankedTargets = useMissionStore((state) => state.rankedTargets)
// Returns: Array of debris objects sorted by riskScore and uncertainty

// Planned mission route
const route = useMissionStore((state) => state.route)
// Returns: Array of waypoints/targets

// Current target being processed
const currentTarget = useMissionStore((state) => state.currentTarget)
// Returns: Single debris object

// Selected capture method
const captureMethod = useMissionStore((state) => state.captureMethod)
// Returns: { id, name, description, difficulty, successRate, fuel }
```

### Event History
```javascript
// Event log with last 50 events
const eventLog = useMissionStore((state) => state.eventLog)
// Returns: Array of { id, timestamp, message, type }
```

## Action Methods Reference

### Control Actions
```javascript
// Set mission status
useMissionStore.setState({ missionStatus: 'running' })
// OR use action
const setMissionStatus = useMissionStore((state) => state.setMissionStatus)
setMissionStatus('running')

// Set current mission step
const setCurrentStep = useMissionStore((state) => state.setCurrentStep)
setCurrentStep(3) // 0-7
```

### Resource Actions
```javascript
const setFuel = useMissionStore((state) => state.setFuel)
const setEnergy = useMissionStore((state) => state.setEnergy)
const setHealth = useMissionStore((state) => state.setHealth)

setFuel(85)      // Clamped to 0-100
setEnergy(90)    // Clamped to 0-100
setHealth(100)   // Clamped to 0-100
```

### Metric Actions
```javascript
const setCollisionRisk = useMissionStore((state) => state.setCollisionRisk)
const setUncertainty = useMissionStore((state) => state.setUncertainty)

setCollisionRisk(75)   // Clamped to 0-100
setUncertainty(0.68)   // Clamped to 0-1
```

### Selection Actions
```javascript
const setSelectedCluster = useMissionStore((state) => state.setSelectedCluster)
const setRankedTargets = useMissionStore((state) => state.setRankedTargets)
const setRoute = useMissionStore((state) => state.setRoute)
const setCurrentTarget = useMissionStore((state) => state.setCurrentTarget)
const setCaptureMethod = useMissionStore((state) => state.setCaptureMethod)

// Example: Select a cluster
setSelectedCluster({
  id: 'cluster-1',
  name: 'LEO Cluster Alpha',
  altitude: 840,
  debrisCount: 3,
  collisionRisk: 87,
  uncertainty: 0.68,
  priority: 'CRITICAL'
})

// Example: Set ranked targets
setRankedTargets([
  { id: 'D001', name: 'Satellite', riskScore: 92, ... },
  { id: 'D002', name: 'Booster', riskScore: 78, ... }
])
```

### Counter Actions
```javascript
const addDebrisRemoved = useMissionStore((state) => state.addDebrisRemoved)

// Increments both debrisRemoved AND targetsCaptured
addDebrisRemoved()
```

### Event Logging
```javascript
// Simple event log (typed as 'info')
const addEventLog = useMissionStore((state) => state.addEventLog)
addEventLog('Mission milestone achieved!')
// Result: { id, timestamp, message, type: 'info' }

// Typed event logging
const addEventWithType = useMissionStore((state) => state.addEventWithType)
addEventWithType('Debris capture failed!', 'error')
addEventWithType('Target acquired!', 'success')
// Types: 'info' | 'success' | 'error'
// Auto-added to eventLog with timestamp
// Event log limited to last 50 entries
```

### Reset Action
```javascript
const reset = useMissionStore((state) => state.reset)

// Resets all state to initial values:
// - currentStep: 0
// - missionStatus: 'idle'
// - fuel: 100
// - energy: 100
// - health: 100
// - collisionRisk: 0
// - uncertainty: 0.8
// - All selections: cleared
// - eventLog: cleared
reset()
```

## Usage Examples

### Example 1: Update Resources in Mission
```javascript
import { useMissionStore } from '../store/missionStore'

function MissionMonitor() {
  const fuel = useMissionStore((state) => state.fuel)
  const energy = useMissionStore((state) => state.energy)
  const setFuel = useMissionStore((state) => state.setFuel)

  const consumeFuel = () => {
    setFuel(fuel - 10)
  }

  return (
    <div>
      <p>Fuel: {fuel}%</p>
      <button onClick={consumeFuel}>Use Fuel</button>
    </div>
  )
}
```

### Example 2: Mission Status Control
```javascript
function MissionControls() {
  const missionStatus = useMissionStore((state) => state.missionStatus)
  const setMissionStatus = useMissionStore((state) => state.setMissionStatus)
  const addEventLog = useMissionStore((state) => state.addEventLog)

  const handleRun = () => {
    setMissionStatus('running')
    addEventLog('Mission started!')
  }

  return (
    <button 
      onClick={handleRun}
      disabled={missionStatus === 'running'}
    >
      {missionStatus === 'running' ? 'Running' : 'Start'}
    </button>
  )
}
```

### Example 3: Cluster Selection and Ranking
```javascript
import { rankTargets } from '../utils/missionLogic'

function ClusterSelector() {
  const setSelectedCluster = useMissionStore((state) => state.setSelectedCluster)
  const setRankedTargets = useMissionStore((state) => state.setRankedTargets)
  const selectedCluster = useMissionStore((state) => state.selectedCluster)
  const addEventLog = useMissionStore((state) => state.addEventLog)

  const handleSelectCluster = (cluster, debrisList) => {
    const clusterDebris = debrisList.filter(d => d.cluster === cluster.id)
    const ranked = rankTargets(clusterDebris)
    
    setSelectedCluster(cluster)
    setRankedTargets(ranked)
    addEventLog(`Selected ${cluster.name} with ${ranked.length} targets`)
  }

  return (
    <div>
      {selectedCluster && <p>Active: {selectedCluster.name}</p>}
    </div>
  )
}
```

### Example 4: Event-Driven Mission Progress
```javascript
function ProgressTracker() {
  const currentStep = useMissionStore((state) => state.currentStep)
  const setCurrentStep = useMissionStore((state) => state.setCurrentStep)
  const addEventLog = useMissionStore((state) => state.addEventLog)

  const advanceStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1)
      addEventLog(`Advanced to step ${currentStep + 1}`)
    }
  }

  return (
    <div>
      <p>Step: {currentStep}/7</p>
      <button onClick={advanceStep}>Next</button>
    </div>
  )
}
```

### Example 5: Complete Mission Scenario
```javascript
import { selectOptimalCaptureMethod, calculateSuccessProbability } from '../utils/missionLogic'

function ExecuteCapture() {
  const currentTarget = useMissionStore((state) => state.currentTarget)
  const setCaptureMethod = useMissionStore((state) => state.setCaptureMethod)
  const addDebrisRemoved = useMissionStore((state) => state.addDebrisRemoved)
  const addEventWithType = useMissionStore((state) => state.addEventWithType)

  const performCapture = (allMethods) => {
    if (!currentTarget) return

    // Select method
    const method = selectOptimalCaptureMethod(currentTarget, allMethods)
    setCaptureMethod(method)

    // Calculate success
    const successProb = calculateSuccessProbability(currentTarget, method)
    const success = Math.random() < successProb

    if (success) {
      addDebrisRemoved()
      addEventWithType(`Successfully captured ${currentTarget.name}!`, 'success')
    } else {
      addEventWithType(`Capture attempt failed for ${currentTarget.name}`, 'error')
    }
  }

  return (
    <button onClick={() => performCapture(methods)}>
      Execute Capture
    </button>
  )
}
```

### Example 6: Multiple Subscriptions
```javascript
function ComprehensiveDashboard() {
  // Subscribe to multiple state values
  const store = useMissionStore(
    ({
      currentStep,
      missionStatus,
      fuel,
      energy,
      health,
      debrisRemoved,
      eventLog
    }) => ({
      currentStep,
      missionStatus,
      fuel,
      energy,
      health,
      debrisRemoved,
      eventLog
    })
  )

  return (
    <div>
      <p>Step: {store.currentStep}/7</p>
      <p>Status: {store.missionStatus}</p>
      <p>Fuel: {store.fuel}%</p>
      <p>Debris Removed: {store.debrisRemoved}</p>
      <p>Recent Events: {store.eventLog.length}</p>
    </div>
  )
}
```

## Event Type Colors (in UI)

```javascript
// In RightPanel.jsx
const typeColors = {
  'error': 'bg-red-900/20 border-red-600 text-red-300',
  'success': 'bg-green-900/20 border-green-600 text-green-300',
  'info': 'bg-blue-900/20 border-blue-600 text-blue-300'
}
```

## State Limits

| Property | Min | Max | Default | Unit |
|----------|-----|-----|---------|------|
| currentStep | 0 | 7 | 0 | steps |
| fuel | 0 | 100 | 100 | % |
| energy | 0 | 100 | 100 | % |
| health | 0 | 100 | 100 | % |
| collisionRisk | 0 | 100 | 0 | % |
| uncertainty | 0 | 1 | 0.8 | ratio |
| eventLog | - | 50 | [] | entries |

## Performance Tips

1. **Selector Optimization**: Use specific selectors instead of full state
```javascript
// ✅ Good - subscribes only to fuel
const fuel = useMissionStore((state) => state.fuel)

// ❌ Avoid - subscribes to entire state
const state = useMissionStore()
```

2. **Combine Related Selectors**: Group related values
```javascript
// ✅ Good - fetches all in one call
const { fuel, energy, health } = useMissionStore((state) => ({
  fuel: state.fuel,
  energy: state.energy,
  health: state.health
}))
```

3. **Memoize Complex Calculations**: Use utils
```javascript
import { rankTargets } from '../utils/missionLogic'

// Do ranking once, store result
const ranked = rankTargets(debrisList)
setRankedTargets(ranked)
```

---

## Quick Reference Card

```
STORE IMPORT:
  import { useMissionStore } from '../store/missionStore'

READ VALUE:
  const fuel = useMissionStore((state) => state.fuel)

CALL ACTION:
  const setFuel = useMissionStore((state) => state.setFuel)
  setFuel(85)

COMMON PATTERNS:
  // Log event
  const addEventLog = useMissionStore((state) => state.addEventLog)
  addEventLog('Event message')

  // Update mission step
  const setCurrentStep = useMissionStore((state) => state.setCurrentStep)
  setCurrentStep(3)

  // Reset everything
  const reset = useMissionStore((state) => state.reset)
  reset()
```

For more context, see `src/store/missionStore.js` 📖
