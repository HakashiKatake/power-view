import { Link, Outlet } from "react-router-dom"
import { LayoutDashboard, History, Settings, Zap, TrendingUp, AlertCircle } from "lucide-react"

export default function Layout() {
  return (
    <div className="min-h-screen bg-background font-sans antialiased text-foreground">
      {/* Navbar */}
      <nav className="fixed top-0 z-50 w-full border-b-4 border-black bg-white px-6 py-4 shadow-[0px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between mx-auto max-w-7xl">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="h-8 w-8 fill-yellow-400 stroke-black stroke-2" />
            <span className="text-2xl font-black italic tracking-tighter">PowerView</span>
          </Link>
          
          <div className="flex gap-6">
            <Link to="/" className="flex items-center gap-2 font-bold hover:underline decoration-4 underline-offset-4 decoration-primary">
              <LayoutDashboard className="h-5 w-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link to="/history" className="flex items-center gap-2 font-bold hover:underline decoration-4 underline-offset-4 decoration-primary">
              <History className="h-5 w-5" />
              <span className="hidden sm:inline">History</span>
            </Link>
            <Link to="/analytics" className="flex items-center gap-2 font-bold hover:underline decoration-4 underline-offset-4 decoration-primary">
              <TrendingUp className="h-5 w-5" />
              <span className="hidden sm:inline">Analytics</span>
            </Link>
             <Link to="/alerts" className="flex items-center gap-2 font-bold hover:underline decoration-4 underline-offset-4 decoration-primary">
              <AlertCircle className="h-5 w-5" />
              <span className="hidden sm:inline">Alerts</span>
            </Link>
             <Link to="/settings" className="flex items-center gap-2 font-bold hover:underline decoration-4 underline-offset-4 decoration-primary">
              <Settings className="h-5 w-5" />
              <span className="hidden sm:inline">Settings</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto mt-28 max-w-7xl px-4 pb-12">
        <Outlet />
      </main>
    </div>
  )
}
