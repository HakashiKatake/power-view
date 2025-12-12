# PowerView - Real-Time Energy Dashboard

PowerView is a modern, real-time energy consumption monitoring application designed to help homeowners and facility managers track their power usage instantly. Built with the **MERN Stack** (MongoDB, Express, React, Node.js) and featuring a **Neobrutalism** UI design, PowerView simulates a live meter connection to demonstrate real-time data visualization and budgeting features.

frontend: https://power-view-wheat.vercel.app
backend: https://power-view.onrender.com/

## 🚀 Features

### Core features
- **Real-Time Monitoring**: Live updates of energy consumption (kW), cost ($/hr), and voltage via WebSockets (Socket.IO).
- **Interactive Dashboard**: Visualizes data trends using dynamic charts (Chart.js) and instant gauge readouts.
- **Budget Alerts**: Visual and system alerts when power usage exceeds user-defined thresholds.
- **User Authentication**: Secure Login and Registration system using JWT (JSON Web Tokens).
- **Personalized Settings**: Configure daily budget limits and view user profile details.
- **Usage History**: Log and review historical data points (simulated).

### UI/UX
- **Neobrutalism Design**: Bold aesthetics with high contrast, thick borders, and vibrant colors (RetroUI style).
- **Responsive Layout**: Fully responsive design that works on desktop and mobile devices.
- **Immediate Feedback**: Micro-animations and instant state updates using Zustand.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS v4 (with `@tailwindcss/vite`)
- **State Management**: Zustand
- **Real-Time**: Socket.IO Client
- **Charts**: Chart.js, React-Chartjs-2
- **Icons**: Lucide React
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Real-Time**: Socket.IO
- **Auth**: JSON Web Token (JWT), BcryptJS

## 📦 Project Structure

```bash
power-view/
├── backend/            # Express Server & API
│   ├── config/         # DB Connection
│   ├── middleware/     # Auth & Error handling
│   ├── models/         # Mongoose Schemas (User, EnergyData)
│   ├── routes/         # API Routes (Auth, Energy, User)
│   ├── utils/          # Energy Simulator Logic
│   └── server.js       # Entry point
│
└── frontend/           # React Application
    ├── src/
    │   ├── components/ # Reusable UI (Cards, Buttons, Inputs)
    │   ├── pages/      # Views (Dashboard, Login, Landing...)
    │   ├── store/      # Zustand Stores (Auth, Energy)
    │   └── App.jsx     # Routing & Layout
    ├── vite.config.js  # Vite Config
    └── index.css       # Tailwind v4 Theme & Styles
```

## 🏁 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or MongoDB Atlas URI)

### 1. Installation

Clone the repository and install dependencies for both frontend and backend.

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/powerview
JWT_SECRET=your_super_secret_jwt_key
```

*(Note: The simulator runs automatically when the server starts.)*

### 3. Running the App

**Start Backend:**
```bash
cd backend
node server.js
```
*You should see:* `Server running on port 5001` & `MongoDB Connected`

**Start Frontend:**
Open a new terminal:
```bash
cd frontend
npm run dev
```
*Access the app at:* `http://localhost:5173`

## 📖 Usage Guide

1. **Landing Page**: Visit the home page to see features.
2. **Register**: Create a new account to access the dashboard.
3. **Dashboard**: Watch the Live Monitor.
   - **Yellow Chart**: Real-time power draw history.
   - **Cards**: Show current load, projected cost, and status.
   - **Alerts**: If the simulated load spikes > 2.0kW, the status card turns Red.
4. **Settings**: Go to Settings to change your daily budget limit.
5. **History**: View a table of recent data points.

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch
3. Commit your Changes
4. Push to the Branch
5. Open a Pull Request

## 📄 License

Distributed under the MIT License.
