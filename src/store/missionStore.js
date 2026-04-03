import { create } from 'zustand'

export const useMissionStore = create((set, get) => ({
  // Mission State
  currentStep: 0,
  missionStatus: 'idle', // idle, running, paused, completed
  
  // Resources
  fuel: 100,
  energy: 100,
  health: 100,
  
  // Mission Metrics
  collisionRisk: 0,
  uncertainty: 0.8,
  debrisRemoved: 0,
  targetsCaptured: 0,
  
  // Selection State
  selectedCluster: null,
  rankedTargets: [],
  route: [],
  currentTarget: null,
  captureMethod: null,
  
  // Event Log
  eventLog: [],
  
  // Actions
  setMissionStatus: (status) => set({ missionStatus: status }),
  setCurrentStep: (step) => set({ currentStep: step }),
  
  setFuel: (fuel) => set({ fuel: Math.max(0, Math.min(100, fuel)) }),
  setEnergy: (energy) => set({ energy: Math.max(0, Math.min(100, energy)) }),
  setHealth: (health) => set({ health: Math.max(0, Math.min(100, health)) }),
  
  setCollisionRisk: (risk) => set({ collisionRisk: Math.max(0, Math.min(100, risk)) }),
  setUncertainty: (uncertainty) => set({ uncertainty: Math.max(0, Math.min(1, uncertainty)) }),
  
  setSelectedCluster: (cluster) => set({ selectedCluster: cluster }),
  setRankedTargets: (targets) => set({ rankedTargets: targets }),
  setRoute: (route) => set({ route: route }),
  setCurrentTarget: (target) => set({ currentTarget: target }),
  setCaptureMethod: (method) => set({ captureMethod: method }),
  
  addDebrisRemoved: () => set((state) => ({
    debrisRemoved: state.debrisRemoved + 1,
    targetsCaptured: state.targetsCaptured + 1,
  })),
  
  addEventLog: (event) => set((state) => ({
    eventLog: [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        message: event,
        type: 'info',
      },
      ...state.eventLog,
    ].slice(0, 50), // Keep last 50 events
  })),
  
  addEventWithType: (message, type) => set((state) => ({
    eventLog: [
      {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        message,
        type,
      },
      ...state.eventLog,
    ].slice(0, 50),
  })),
  
  reset: () => set({
    currentStep: 0,
    missionStatus: 'idle',
    fuel: 100,
    energy: 100,
    health: 100,
    collisionRisk: 0,
    uncertainty: 0.8,
    debrisRemoved: 0,
    targetsCaptured: 0,
    selectedCluster: null,
    rankedTargets: [],
    route: [],
    currentTarget: null,
    captureMethod: null,
    eventLog: [],
  }),
}))
