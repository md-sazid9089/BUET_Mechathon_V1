# 🚀 AI MISSION BRAIN - PROJECT STRUCTURE

## 📦 Directory Tree

```
BUET_Mechathon_V1/
│
├── 📄 package.json                          │ NPM dependencies + scripts
├── 📄 vite.config.js                        │ Vite bundler configuration
├── 📄 tailwind.config.js                    │ Tailwind CSS theme
├── 📄 postcss.config.js                     │ PostCSS + Autoprefixer
├── 📄 index.html                            │ React root HTML
├── 📄 .gitignore                            │ Git ignore rules
├── 📄 LICENSE                               │ Project license
│
├── 📁 public/                               │ Static assets (currently empty)
│   └── (Ready for images, icons, etc.)
│
├── 📚 Documentation Files
│   ├── 📄 README.md                         │ Full project documentation
│   ├── 📄 DELIVERY_SUMMARY.md               │ What was delivered
│   ├── 📄 QUICK_START.md                    │ Developer quick start
│   └── 📄 CHECKLIST.md                      │ Complete feature checklist
│
└── 📁 src/                                  │ SOURCE CODE
    │
    ├── 📄 main.jsx                          │ React 18 entry point
    ├── 📄 App.jsx                           │ Main app component + routing
    ├── 📄 index.css                         │ Global styles + tailwind
    │
    ├── 📁 components/                       │ React components
    │   │
    │   ├── 📁 layout/                       │ Layout components (4 files)
    │   │   ├── 📄 Navbar.jsx               │ Top navigation bar
    │   │   │   ├─ Rocket icon with animation
    │   │   │   ├─ Progress bar
    │   │   │   ├─ Run/Pause/Reset buttons
    │   │   │   └─ Sticky positioning
    │   │   │
    │   │   ├── 📄 Sidebar.jsx              │ Left control panel
    │   │   │   ├─ 4 metric boxes
    │   │   │   ├─ Animated progress bars
    │   │   │   ├─ Cluster selection
    │   │   │   └─ Priority badges
    │   │   │
    │   │   ├── 📄 CenterPanel.jsx          │ Main content area
    │   │   │   ├─ Status indicator
    │   │   │   ├─ Flexible content wrapper
    │   │   │   └─ Scrollable area
    │   │   │
    │   │   ├── 📄 RightPanel.jsx           │ Right AI insights panel
    │   │   │   ├─ Current target info
    │   │   │   ├─ Capture method details
    │   │   │   ├─ Uncertainty meter
    │   │   │   └─ Event log (scrollable)
    │   │   │
    │   │   └── 📄 index.js                 │ Component exports
    │   │
    │   ├── 📁 mission/                      │ (Empty, ready for expansion)
    │   │   └── (Add mission-specific components here)
    │   │
    │   └── 📁 charts/                       │ (Empty, ready for expansion)
    │       └── (Add Recharts visualizations here)
    │
    ├── 📁 pages/                            │ Page components (3 files)
    │   │
    │   ├── 📄 Home.jsx                      │ Landing/intro page
    │   │   ├─ Hero section
    │   │   ├─ 5 feature cards
    │   │   ├─ Flow diagram
    │   │   ├─ Animated background
    │   │   └─ Call-to-action
    │   │
    │   ├── 📄 DemoDashboard.jsx             │ Main simulation view
    │   │   ├─ Mission step tracker
    │   │   ├─ Debris analysis
    │   │   ├─ Ranked targets list
    │   │   ├─ All debris grid
    │   │   └─ Status section
    │   │
    │   ├── 📄 FinalReport.jsx               │ Results & analytics
    │   │   ├─ Summary stats cards
    │   │   ├─ Performance bar chart
    │   │   ├─ Resource pie chart
    │   │   ├─ Detailed analysis
    │   │   └─ Recommendations
    │   │
    │   └── 📄 index.js                      │ Page exports
    │
    ├── 📁 store/                            │ Zustand state management (1 file)
    │   │
    │   └── 📄 missionStore.js               │ Global mission state
    │       ├─ 15 state properties:
    │       │   ├─ currentStep
    │       │   ├─ missionStatus
    │       │   ├─ fuel, energy, health
    │       │   ├─ collisionRisk
    │       │   ├─ uncertainty
    │       │   ├─ debrisRemoved, targetsCaptured
    │       │   ├─ selectedCluster
    │       │   ├─ rankedTargets
    │       │   ├─ route
    │       │   ├─ currentTarget
    │       │   ├─ captureMethod
    │       │   └─ eventLog
    │       │
    │       └─ 19 action methods:
    │           ├─ setMissionStatus
    │           ├─ setCurrentStep
    │           ├─ set{Fuel/Energy/Health}
    │           ├─ set{CollisionRisk/Uncertainty}
    │           ├─ set{SelectedCluster/RankedTargets/Route/etc}
    │           ├─ addDebrisRemoved
    │           ├─ addEventLog(event)
    │           ├─ addEventWithType(message, type)
    │           └─ reset()
    │
    ├── 📁 data/                             │ Mock data (1 file)
    │   │
    │   └── 📄 mockData.js                   │ Complete mock datasets
    │       ├─ MOCK_DEBRIS_DATA (8 objects)
    │       │   ├─ D001-D008 with full orbital data
    │       │   ├─ Fields: id, name, altitude, velocity, size, mass, risk, etc.
    │       │   └─ Clusters assigned for each object
    │       │
    │       ├─ CAPTURE_METHODS (5 methods)
    │       │   ├─ Contact, Net, Harpoon, Tractor Beam, Momentum Transfer
    │       │   └─ Each with: id, name, description, difficulty, success rate, fuel
    │       │
    │       ├─ LAUNCH_WINDOWS (3 windows)
    │       │   ├─ Each with: startTime, endTime, duration, optimalTime, probability
    │       │   └─ Ready for mission planning
    │       │
    │       ├─ MISSION_STEPS (8 phases)
    │       │   ├─ Step 0-7
    │       │   ├─ Each with: id, label, description
    │       │   └─ From prediction to execution
    │       │
    │       └─ CLUSTERS (3 clusters)
    │           ├─ cluster-1: LEO Cluster Alpha
    │           ├─ cluster-2: MEO Debris Zone
    │           ├─ cluster-3: Scattered Fragment Zone
    │           └─ Each with: id, name, altitude, debris count, risk, priority
    │
    └── 📁 utils/                            │ Utility functions (1 file)
        │
        └── 📄 missionLogic.js               │ Mission rules & calculations
            ├─ calculateRiskScore(debris)
            ├─ rankTargets(debrisList)
            ├─ calculateCollisionRisk(cluster)
            ├─ selectOptimalCaptureMethod(debris, methods)
            ├─ estimateFuelRequired(debris, method)
            ├─ calculateSuccessProbability(debris, method)
            ├─ getClusterFromDebris(debris, clusters)
            ├─ formatAltitude/Velocity/Size(value)
            ├─ getStatusColor/BadgeColor/PriorityColor(value)
            ├─ getDifficultyColor(difficulty)
            ├─ calculateETA(distance, velocity)
            ├─ generateRandomEvent()
            └─ simulateUncertainty()
```

## 📊 File Count Summary

```
Config Files:          5  (package.json, vite, tailwind, postcss, .gitignore)
Entry Points:          3  (index.html, main.jsx, App.jsx)
Layout Components:     5  (Navbar, Sidebar, CenterPanel, RightPanel, index)
Page Components:       4  (Home, Dashboard, Report, index)
State Management:      1  (missionStore.js)
Mock Data:            1  (mockData.js)
Utilities:            1  (missionLogic.js)
CSS:                  1  (index.css)
Documentation:        4  (README, DELIVERY_SUMMARY, QUICK_START, CHECKLIST)

TOTAL:               29 FILES
```

## 🎯 Component Relationships

```
App.jsx
├── (Router Setup)
│   ├── Home.jsx
│   │   └── (Landing Page)
│   │
│   ├── Demo Path
│   │   ├── Navbar.jsx
│   │   │   └── (Uses: useMissionStore)
│   │   ├── Sidebar.jsx
│   │   │   ├── (Uses: useMissionStore)
│   │   │   └── (Props: clusters, onSelectCluster)
│   │   ├── CenterPanel.jsx
│   │   │   ├── (Uses: useMissionStore)
│   │   │   └── DemoDashboard.jsx
│   │   │       ├── (Uses: mockData, missionLogic)
│   │   │       └── (Props: selectedCluster)
│   │   └── RightPanel.jsx
│   │       └── (Uses: useMissionStore)
│   │
│   └── FinalReport.jsx
│       ├── (Uses: useMissionStore)
│       └── (Recharts visualizations)
│
└── Zustand Store (Global)
    └── missionStore.js
        ├── (Provides state to all components)
        ├── (Updates from: All components)
        └── (Sources from: missionLogic.js, mockData.js)
```

## 🔄 Data Flow

```
User Actions
    ↓
Component Events (clicks, selections)
    ↓
Zustand Store Updates
    ↓
Real-Time State Changes
    ↓
Components Re-render (via Zustand selectors)
    ↓
UI Updates (with Framer Motion animations)
    ↓
Event Logged to eventLog (history)
```

## 🎨 Styling Architecture

```
Tailwind CSS
├── Base Layer (tailwind)
│   └── Space theme colors
│
├── Components Layer (tailwind)
│   ├── .panel (section wrapper)
│   ├── .card (small container)
│   ├── .metric-box (centered metric)
│   ├── .btn-primary/success/danger (buttons)
│   └── .text-sm-light (small text)
│
├── Utilities Layer (tailwind)
│   └── Generated by Tailwind
│
└── Custom CSS (index.css)
    ├── .animate-pulse-glow
    ├── .animate-slide-in-right
    └── Color scheme application
```

## 📈 State Management Flow

```
missionStore.js (Zustand)
    │
    ├── Selectors (used in components)
    │   ├── (state) => state.currentStep
    │   ├── (state) => state.missionStatus
    │   ├── (state) => state.fuel
    │   └── ... (15 more)
    │
    └── Actions (called from components)
        ├── setMissionStatus(status)
        ├── addEventLog(event)
        ├── reset()
        └── ... (16 more)
```

## 🚀 Launch Sequence

```
1. npm install
   └── Install all dependencies from package.json
   
2. npm run dev
   └── Start Vite dev server on localhost:3000
   
3. index.html loads
   └── Links to src/main.jsx
   
4. main.jsx runs
   └── Imports index.css (Tailwind)
   └── Mounts App.jsx to #root
   
5. App.jsx renders
   └── Loads Zustand store
   └── Sets up React Router
   └── Renders initial page
   
6. User navigates
   └── /        → Home page
   └── /demo    → Dashboard with 3-panel layout
   └── /report  → Final report page
```

## 💾 Storage Capabilities (Ready for Enhancement)

```
Currently: Client-side only (in memory)
├── Mission state persists during session
├── Event logs (max 50 events)
└── No database required for demo

Future Enhancement Options:
├── localStorage for session persistence
├── IndexedDB for large datasets
├── Backend API for real-time data
└── WebSocket for live updates
```

---

**This structure is production-ready and fully scalable for future enhancements!** 🎉
