# PowerView Implementation Guide

This guide details the step-by-step process used to build the PowerView application. It serves as a tutorial for developers wanting to understand the codebase or recreate it.

## Phase 1: Foundation & Backend

### 1. Project Initialization
- Created a root directory `power-view`.
- Initialized two sub-projects: `backend` (Node) and `frontend` (Vite).
- **Key Decision**: Separated concerns completely to allow independent scaling or deployment.

### 2. Backend Setup
- **Dependencies**: Installed `express` (server), `mongoose` (ORM), `socket.io` (real-time), `cors` (cross-origin), `dotenv` (config).
- **Database**: Connected to MongoDB via Mongoose. Created `config/db.js`.
- **Models**:
    - `User.js`: Standard auth fields (email, password hash) + `budgetLimit`.
    - `EnergyData.js`: Designed for time-series data (timestamp, consumption, cost).

### 3. Real-Time Simulation
- Instead of connecting to a physical smart meter, we built a Simulator (`utils/energySimulator.js`).
- **Logic**: Uses a `setInterval` loop to generate realistic random values every 2 seconds.
- **Socket.IO**: The server holds an `io` instance. The simulator pushes data to `io.emit('energy-update', data)`.

## Phase 2: Frontend & UI

### 1. Vite & Tailwind Setup
- Initialized React with Vite.
- **Styling**: Adopted Tailwind CSS v4.
- **Theme**: Configured a **Neobrutalism** theme in `index.css` using `@theme` block. Defined variables like `--color-primary`, `--color-border`, `--radius-lg`.

### 2. Core Components (UI)
- Built reusable atomic components in `components/ui/`:
    - `Card`: Thick borders, hard shadows.
    - `Button`: Interactive states with translation effects.
    - `Input`: Matching style.

### 3. State Management (Zustand)
- **`useEnergyStore`**:
    - Connects to Socket.IO backend on mount.
    - Listens for `energy-update`.
    - Appends data to a local `history` array (capped at 50 items for performance).
- **`useAuthStore`**:
    - Manages JWT token in `localStorage`.
    - Provides `login`, `register`, `logout` actions using Axios.

### 4. Dashboard Implementation
- **Charts**: Integrated `react-chartjs-2`. Configured to hide grids/axes for a clean "sparkline" look.
- **Live Updates**: The chart component reads directly from `useEnergyStore.history`, causing it to animate as new data arrives via WebSocket.

## Phase 3: Authentication & Features

### 1. Secure Routes
- **Backend**: Added `auth` middleware. Routes like `/api/auth/me` and `/api/user/settings` require a valid Token.
- **Frontend**: Created `ProtectedRoute.jsx`. It checks `authStore.isAuthenticated`. If false, forces redirect to Landing.

### 2. Feature Pages
- **Landing**: Marketing page with "Get Started" CTAs.
- **History**: Simple table view of the simulated data session.
- **Settings**: Form to update the `budgetLimit` in the User profile.

## Verification Steps
1. **Start Backend**: `node server.js` (Port 5001).
2. **Start Frontend**: `npm run dev` (Port 5173).
3. **Register**: Create an account.
4. **Login**: You will be redirected to Dashboard.
5. **Verify**: Check that the gauge is moving and the chart is drawing.
