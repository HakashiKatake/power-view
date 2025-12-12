import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Zap, ShieldCheck, Activity } from "lucide-react"

export default function Landing() {
  return (
    <div className="min-h-screen bg-yellow-200 font-sans text-black">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-center">
        <div className="mb-6 inline-flex items-center justify-center rounded-full border-2 border-black bg-white px-4 py-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-sm font-bold uppercase tracking-wider">v1.0 Public Beta</span>
        </div>
        
        <h1 className="mb-6 text-6xl font-black uppercase leading-none tracking-tighter md:text-8xl">
          Control Your <br/>
          <span className="bg-black text-white px-4 decoration-wavy underline decoration-yellow-400">Power Usage</span>
        </h1>
        
        <p className="mx-auto mb-10 max-w-2xl text-xl font-bold md:text-2xl">
          Stop guessing your electricity bill. Monitor consumption in real-time with our high-frequency dashboard.
        </p>
        
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <Link to="/register">
            <Button size="lg" className="h-14 w-full border-b-8 border-r-8 px-10 text-xl font-bold md:w-auto">
              Get Started Now
            </Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="lg" className="h-14 w-full border-b-8 border-r-8 px-10 text-xl font-bold md:w-auto bg-white hover:translate-x-[2px] hover:translate-y-[2px] active:translate-x-[4px] active:translate-y-[4px]">
              Login
            </Button>
          </Link>
        </div>
      </header>

      {/* Features Grid */}
      <section className="border-t-4 border-black bg-white py-20">
        <div className="container mx-auto grid gap-8 px-4 md:grid-cols-3">
          
          {/* Feature 1 */}
          <div className="rounded-lg border-4 border-black bg-blue-300 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-2">
            <Activity className="mb-4 h-12 w-12 stroke-black stroke-2" />
            <h3 className="mb-2 text-2xl font-black uppercase">Real-Time Data</h3>
            <p className="font-bold">Stream energy data instantly via WebSockets. No delays, no caching.</p>
          </div>

          {/* Feature 2 */}
          <div className="rounded-lg border-4 border-black bg-green-300 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-2">
            <Zap className="mb-4 h-12 w-12 stroke-black stroke-2" />
            <h3 className="mb-2 text-2xl font-black uppercase">Cost Analysis</h3>
            <p className="font-bold">Project your daily spend and catch anomalies before they break the bank.</p>
          </div>

          {/* Feature 3 */}
          <div className="rounded-lg border-4 border-black bg-red-300 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-transform hover:-translate-y-2">
            <ShieldCheck className="mb-4 h-12 w-12 stroke-black stroke-2" />
            <h3 className="mb-2 text-2xl font-black uppercase">Budget Alerts</h3>
            <p className="font-bold">Set hard limits on consumption and get notified instantly when crossed.</p>
          </div>

        </div>
      </section>
    </div>
  )
}
