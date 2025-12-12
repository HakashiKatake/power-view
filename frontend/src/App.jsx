import { useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuthStore } from "./store/authStore"
import Layout from "./Layout"
import Dashboard from "./pages/Dashboard"
import Landing from "./pages/Landing"
import Login from "./pages/Login"
import Register from "./pages/Register"

import History from "./pages/History"
import Settings from "./pages/Settings"

import ProtectedRoute from "./components/ProtectedRoute"

function App() {
  const loadUser = useAuthStore((state) => state.loadUser)

  useEffect(() => {
    loadUser()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/landing" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
           <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="history" element={<History />} />
              <Route path="settings" element={<Settings />} />
           </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/landing" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
