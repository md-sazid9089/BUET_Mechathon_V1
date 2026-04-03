# AI Mission Brain for Multi-Target Space Debris Removal

A frontend-only simulation dashboard for autonomous space debris removal using advanced AI decision-making, uncertainty-aware planning, and dynamic replanning.

## 🚀 Features

- **Debris Prediction**: AI-driven prediction of debris trajectories and collision risks
- **Cluster Discovery**: Identification of collision-prone debris clusters
- **Risk Assessment**: Uncertainty-aware decision making for capture methods
- **Route Planning**: Optimal mission path planning with dynamic replanning
- **Live Execution**: Real-time mission execution monitoring and adjustments
- **Capture Method Recommendation**: Intelligent selection based on debris characteristics
- **Collision Avoidance**: Real-time hazard detection and avoidance
- **Spacecraft Health Monitoring**: Complete system status tracking
- **Dynamic Replanning**: Adapt mission plans based on changing conditions

## 🛠 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **React Router** - Navigation

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── CenterPanel.jsx
│   │   └── RightPanel.jsx
│   ├── mission/
│   ├── charts/
│   └── index.js
├── pages/
│   ├── Home.jsx
│   ├── DemoDashboard.jsx
│   └── FinalReport.jsx
├── data/
│   └── mockData.js
├── store/
│   └── missionStore.js
├── utils/
│   └── missionLogic.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Running the Application

1. Navigate to `http://localhost:3000`
2. Click "Start Mission Simulation" to begin
3. Select a debris cluster from the sidebar
4. Use the control buttons to Run/Pause/Reset the mission
5. Monitor the AI insights and mission status on the right panel

## 📊 Global State (Zustand)

The mission state includes:

- `currentStep` - Current mission step (0-7)
- `missionStatus` - Status: idle, running, paused, completed
- `fuel` - Fuel level (0-100%)
- `energy` - Energy level (0-100%)
- `health` - System health (0-100%)
- `collisionRisk` - Current collision risk (0-100%)
- `uncertainty` - Uncertainty level (0-1)
- `debrisRemoved` - Count of debris removed
- `selectedCluster` - Currently selected debris cluster
- `rankedTargets` - Sorted list of targets by priority
- `route` - Planned mission route
- `currentTarget` - Current target being processed
- `captureMethod` - Selected capture method
- `eventLog` - Log of recent mission events

## 🎮 Mock Data

The application includes mock data for:

- **8 Debris Objects** - With altitude, velocity, size, risk scores
- **3 Debris Clusters** - With collision risk and priority
- **5 Capture Methods** - Contact, Net, Harpoon, Tractor Beam, Momentum Transfer
- **3 Launch Windows** - With optimal times and probabilities
- **8 Mission Steps** - Structured mission execution phases

## 🔧 Key Features Implementation

### Rule-Based Logic
- Target ranking by risk score and uncertainty
- Capture method selection based on debris difficulty
- Collision risk calculation
- Success probability estimation

### UI Components
- Animated navbar with mission progress
- Responsive sidebar with spacecraft metrics
- Center panel for main visualization
- Right panel with AI insights and event log

### Animations
- Framer Motion for smooth transitions
- Custom CSS animations for pulses and glows
- Staggered card animations

## 📈 Mission Flow

1. **Prediction** - Analyze debris trajectories
2. **Cluster Discovery** - Identify collision-prone areas
3. **Risk Assessment** - Evaluate capture difficulty
4. **Launch Window** - Find optimal launch opportunity
5. **Route Planning** - Calculate efficient path
6. **Target Ranking** - Prioritize by urgency
7. **Method Selection** - Select capture technique
8. **Execution** - Execute debris removal

## 🎨 Design Features

- Dark space-themed UI (space-900, space-800, space-700)
- Custom color scheme for debris levels
- Responsive grid layouts
- Smooth animations and transitions
- Real-time status updates

## 📝 Notes

- **Frontend-Only**: No backend required, uses mock data
- **Demo Purpose**: Built for presentation and judging
- **Extensible**: Easy to add real backend integration
- **Production-Ready**: All dependencies versioned

## 🔄 Future Enhancements

- Backend integration for real-time data
- Machine learning models for uncertainty reduction
- Real-time collaboration features
- Advanced 3D visualization
- Mission replay functionality

## 📄 License

See LICENSE file for details.

## 👥 Authors

BUET Mechathon V1 Team

---

**Version**: 1.0.0  
**Last Updated**: April 2026
