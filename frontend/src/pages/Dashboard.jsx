import { useEffect } from "react"
import { useEnergyStore } from "../store/energyStore"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Zap, Wallet, AlertTriangle } from "lucide-react"

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)
import { useAuthStore } from "../store/authStore"
import { Button } from "../components/ui/button"

export default function Dashboard() {
  const { connectSocket, disconnectSocket, currReading, history, isConnected } = useEnergyStore()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    connectSocket()
    return () => disconnectSocket()
  }, [])

  const latestLoad = currReading.consumptionKwh
  const dailyCost = (latestLoad * 24 * 0.15).toFixed(2) 
  
  // Prepare Chart Data
  const chartData = {
    labels: history.map(h => new Date(h.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Power Draw (kW)',
        data: history.map(h => h.consumptionKwh),
        borderColor: 'black',
        backgroundColor: 'rgba(255, 200, 0, 0.5)', 
        borderWidth: 3,
        pointBackgroundColor: 'white',
        pointBorderColor: 'black',
        pointBorderWidth: 2,
        pointRadius: 4,
        tension: 0.4,
        fill: true,
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
       tooltip: {
        backgroundColor: 'black',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'white',
        borderWidth: 2,
        padding: 10,
        displayColors: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: '#e5e5e5', display: true },
        border: { display: true, width: 3, color: 'black' },
         ticks: { color: 'black', font: { weight: 'bold' } }
      },
      x: { display: false, grid: { display: false } }
    },
    animation: { duration: 0 }
  }

  return (
    <div className="space-y-8">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-4xl font-black uppercase tracking-tighter">Live Monitor</h1>
           <p className="text-muted-foreground font-medium">
             Welcome back, <span className="text-black font-bold">{user?.username}</span>. 
           </p>
        </div>
        
        <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded-full border-2 border-black ${isConnected ? 'bg-green-400' : 'bg-red-500 animate-pulse'}`}></div>
                <span className="hidden sm:inline font-bold text-sm uppercase">{isConnected ? 'System Online' : 'Connecting...'}</span>
             </div>
             
             <Button variant="destructive" onClick={logout} className="font-bold border-2 border-black">
                Logout
             </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Voltage/Load Card */}
        <Card className="bg-blue-200">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-black uppercase">Current Load</CardTitle>
             <Zap className="h-6 w-6 stroke-black fill-white" />
           </CardHeader>
           <CardContent>
             <div className="text-5xl font-black tracking-tighter">{latestLoad.toFixed(2)} <span className="text-xl">kW</span></div>
             <p className="text-xs font-bold mt-2">Voltage: {currReading.voltage} V</p>
           </CardContent>
        </Card>

        {/* Cost Card */}
        <Card className="bg-green-200">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-black uppercase">Proj. Daily Cost</CardTitle>
             <Wallet className="h-6 w-6 stroke-black fill-white" />
           </CardHeader>
           <CardContent>
             <div className="text-5xl font-black tracking-tighter">${dailyCost}</div>
             <p className="text-xs font-bold mt-2">Rate: $0.15 / kWh</p>
           </CardContent>
        </Card>

         {/* Alert Card */}
        <Card className={latestLoad > 2.0 ? "bg-red-400 animate-pulse" : "bg-white"}>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-black uppercase">System Status</CardTitle>
             <AlertTriangle className="h-6 w-6 stroke-black fill-white" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-black uppercase">{latestLoad > 2.0 ? "OVERLOAD DETECTED" : "Normal Operation"}</div>
             <p className="text-xs font-bold mt-2">{latestLoad > 2.0 ? "Usage limits exceeded!" : "Within budget parameters."}</p>
           </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0 hover:translate-y-0">
         <CardHeader>
             <CardTitle>Real-Time Power Usage Trend</CardTitle>
         </CardHeader>
         <CardContent className="h-[400px]">
             <Line data={chartData} options={chartOptions} />
         </CardContent>
      </Card>
    </div>
  )
}
