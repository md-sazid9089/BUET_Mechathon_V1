// Quick Start Guide for Developers

## Installation Steps

### 1. Install Node.js
- Download from https://nodejs.org (v18+)
- Verify: `node --version` and `npm --version`

### 2. Install Dependencies
```bash
npm install
```

This will install:
- react & react-dom
- vite (bundler & dev server)
- tailwindcss (styling)
- zustand (state)
- recharts (charts)
- framer-motion (animations)
- lucide-react (icons)
- react-router-dom (navigation)

### 3. Start Development Server
```bash
npm run dev
```

Server will start at http://localhost:3000

### 4. Build for Production
```bash
npm run build
```

Output in `dist/` folder

## Project Navigation

### Pages
- **Home** (/): Landing page with features overview
- **Demo** (/demo): Main simulation dashboard
- **Report** (/report): Mission results and analytics

### Key Components
- **Navbar**: Top control bar with progress
- **Sidebar**: Left panel with metrics
- **CenterPanel**: Main simulation view
- **RightPanel**: AI insights and logs

## State Management (Zustand)

Import the store in any component:
```javascript
import { useMissionStore } from '../store/missionStore'

export function MyComponent() {
  const fuel = useMissionStore((state) => state.fuel)
  const setFuel = useMissionStore((state) => state.setFuel)
  
  return <div>Fuel: {fuel}%</div>
}
```

## Adding Features

### 1. Adding a New Component
```bash
# Create component file
touch src/components/mission/MyComponent.jsx

# Import in parent
import MyComponent from '../components/mission/MyComponent'
```

### 2. Using Charts (Recharts)
```javascript
import { 
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer 
} from 'recharts'

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={data}>
    <Bar dataKey="value" fill="#3b82f6" />
  </BarChart>
</ResponsiveContainer>
```

### 3. Using Animations (Framer Motion)
```javascript
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Animated content
</motion.div>
```

### 4. Using Tailwind CSS
```jsx
<div className="bg-space-800 text-white p-6 rounded-lg border border-space-700">
  Styled with Tailwind
</div>
```

## Custom Colors Available

```css
/* Space Theme */
.bg-space-900   /* Darkest background */
.bg-space-800   /* Panel background */
.bg-space-700   /* Card background */
.bg-space-600   /* Borders */

/* Debris Status */
.bg-debris-danger    /* Red - Critical */
.bg-debris-warning   /* Orange - Warning */
.bg-debris-info      /* Blue - Info */
.bg-debris-success   /* Green - Success */

/* Usage */
<div className="bg-space-800 text-debris-info"> ... </div>
```

## Utility Classes

```
.panel           - styled container for sections
.card            - styled small container
.metric-box      - centered metric display
.btn-primary     - primary button style
.btn-success     - success button style
.btn-danger      - danger button style
.text-sm-light   - small light text
```

## Mock Data

All mock data is in `src/data/mockData.js`:
```javascript
import { 
  MOCK_DEBRIS_DATA,
  CAPTURE_METHODS,
  LAUNCH_WINDOWS,
  MISSION_STEPS,
  CLUSTERS 
} from '../data/mockData'
```

## Debugging Tips

1. **React DevTools**: Install browser extension
2. **Zustand Inspector**: Add Zustand devtools middleware
3. **Vite Inspect**: Add inspector plugin in vite.config.js
4. **Console Logs**: Check browser console
5. **Network Tab**: Check for API calls (currently none)

## Common Tasks

### Change a Color
Edit `tailwind.config.js`:
```javascript
theme: {
  extend: {
    colors: {
      space: {
        900: '#0a0e27', // Dark blue
      }
    }
  }
}
```

### Add a New Page
1. Create `src/pages/NewPage.jsx`
2. Add route in `App.jsx`:
```javascript
<Route path="/newpage" element={<NewPage />} />
```

### Update Mock Data
Edit `src/data/mockData.js` and export new arrays

### Add Event to Log
```javascript
import { useMissionStore } from '../store/missionStore'

const addEventLog = useMissionStore((state) => state.addEventLog)
addEventLog('Mission milestone achieved!')
```

## Environment Variables

None required! This is a frontend-only app.

## Performance Tips

- Use `React.memo()` for expensive components
- Memoize selectors with Zustand
- Lazy load pages with React.lazy()
- Keep event log limited (max 50 events)

## File Sizes (Approximate)

- package.json: 1 KB
- vite.config.js: 0.3 KB
- App.jsx: 2 KB
- Store: 3 KB
- Mock Data: 4 KB
- Pages: 15 KB total
- Components: 10 KB total

## Support Resources

- Vite Docs: https://vitejs.dev
- React Docs: https://react.dev
- Zustand: https://github.com/pmndrs/zustand
- Tailwind: https://tailwindcss.com
- Recharts: https://recharts.org
- Framer Motion: https://www.framer.com/motion

---

**Ready to develop?** Run `npm run dev` and start building! 🚀
