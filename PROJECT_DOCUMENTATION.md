# PowerView - Technical Documentation

This document provides a detailed technical overview of the PowerView application, including its architecture, data flow, API reference, and component breakdown.

## 1. System Architecture

PowerView follows a standard Client-Server architecture utilizing the MERN stack.

- **Client (Frontend)**: A Single Page Application (SPA) built with React and Vite. It connects to the backend via HTTP (for REST APIs) and WebSocket (for real-time data).
- **Server (Backend)**: A Node.js/Express application that handles API requests, manages the database, and runs a continuous simulation loop to broadcast energy data.
- **Database**: MongoDB serves as the persistent storage for User profiles and historical Energy Data.

### Data Flow
1. **Simulation**: `utils/energySimulator.js` runs a loop (every 2s). It generates random `voltage`, `consumption`, and `cost` values.
2. **Broadcast**: The server emits an `energy-update` event via Socket.IO to all connected clients containing the generated reading.
3. **Visualization**: The Frontend subscribes to `energy-update`. The `energyStore` (Zustand) updates its state, triggering re-renders in the Dashboard charts and cards.
4. **Persistence**: User registration and settings updates are sent via REST API calls (`axios`) to the backend, which saves them to MongoDB via Mongoose.

## 2. Backend Implementation

### Authentication
- **Strategy**: JWT (JSON Web Tokens).
- **Flow**:
  - `POST /register`: Hashes password with `bcryptjs`, saves user, returns JWT.
  - `POST /login`: Validates credentials, returns JWT.
  - **Middleware**: `middleware/authMiddleware.js` intercepts protected requests, verifies the `x-auth-token` header, and attaches the user payload to `req.user`.

### Energy Simulation
The simulation is a simple heuristic model:
- **Base Load**: Fluctuates between 0.3 - 0.8 kW.
- **Spikes**: Random events trigger spikes up to 2.5 kW.
- **Voltage**: Fluctuates around 220V - 230V.
- this data is **not** currently saved to DB every second to prevent bloat but is streamed directly to clients.

### API Reference

| Method | Endpoint | Description | Protected? |
|--------|----------|-------------|------------|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user profile | **Yes** |
| GET | `/api/energy/history` | Get historic energy data (Mock/Sim) | **Yes** |
| PUT | `/api/user/settings` | Update user budget limit | **Yes** |

## 3. Frontend Implementation

### UI Design System
- **Style**: Neobrutalism / RetroUI.
- **Key Characteristics**:
  - Hard black borders (`border-4 border-black`).
  - Hard shadows (`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`).
  - High saturation colors (Yellow, Green, Purple).
- **Theming**: Implemented via Tailwind CSS v4 `@theme` variables in `index.css`.

### State Management (Zustand)
- **`authStore.js`**: Handles `user` object, `isAuthenticated` status, `token` storage (localStorage), and API calls (`login`, `register`).
- **`energyStore.js`**: Handles the active Socket.IO connection and the array of `history` data points for the ephemeral chart session.

### Directory Structure
- **`/src/components/ui`**: Contains the Neobrutalism-styled atomic components (`Button`, `Card`, `Input`).
- **`/src/pages`**:
  - `Landing.jsx`: Public marketing page.
  - `Dashboard.jsx`: Private main view with Charts and Websocket connection.
- **`/src/components/ProtectedRoute.jsx`**: A wrapper route that checks `authStore.isAuthenticated`. If false, redirects to `/landing`.

## 4. Setup & Deployment Notes

### Environment Variables
Ensure the following `.env` variables are set in `backend/`:
```
PORT=5001
MONGO_URI=mongodb://localhost:27017/powerview (or Atlas URI)
JWT_SECRET=secure_secret_string
```
In `frontend/` (if using custom environment variables), create `.env`:
```
VITE_API_URL=http://localhost:5001 (Optional, defaults set in code)
```

### Future Improvements
1. **Data Persistence**: Enable saving the simulated stream to MongoDB TimeSeries collections for long-term history.
2. **Device Breakdown**: Simulate individual appliances (HVAC, Lights).
3. **Advanced Charts**: Add zoom/pan capabilities to history charts.
