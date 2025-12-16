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
import Gauge from "../components/Gauge"
import { useAuthStore } from "../store/authStore"
import { Button } from "../components/ui/button"

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

export default function Dashboard() {
  const { connectSocket, disconnectSocket, currReading, history, isConnected } = useEnergyStore()
  const { user, logout } = useAuthStore()

  useEffect(() => {
    connectSocket()
    return () => disconnectSocket()
  }, [])

  const latestLoad = currReading.consumptionKwh
  const dailyCost = (latestLoad * 24 * 0.15).toFixed(2)
  const budgetLimit = user?.budgetLimit || 50
  
  // Calculate status
  const isOverBudget = parseFloat(dailyCost) > budgetLimit
  const loadPercentage = (latestLoad / 5) * 100 // assuming 5kW max for gauge

  // Calculate average from history or fallback
  const avgLoad = history.length > 0 
    ? history.reduce((acc, curr) => acc + curr.consumptionKwh, 0) / history.length
    : 1.5;

  const usageDiff = avgLoad ? ((latestLoad - avgLoad) / avgLoad) * 100 : 0
  
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
             
             <Button variant="destructive" onClick={logout} className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                Logout
             </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Voltage/Load Card with Gauge */}
        <Card className="bg-blue-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-black uppercase">Real-Time Load</CardTitle>
             <Zap className="h-6 w-6 stroke-black fill-white" />
           </CardHeader>
           <CardContent className="flex flex-col items-center">
             <Gauge value={latestLoad} max={5} label="Current Draw" unit="kW" />
             <div className="w-full mt-4 flex justify-between text-xs font-bold border-t-2 border-black pt-2">
                <span>Voltage: {currReading.voltage.toFixed(0)}V</span>
                <span>{loadPercentage.toFixed(0)}% Cap</span>
             </div>
           </CardContent>
        </Card>

        {/* Cost & Budget Comparison Card */}
        <Card className="bg-green-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-black uppercase">Cost Analysis</CardTitle>
             <Wallet className="h-6 w-6 stroke-black fill-white" />
           </CardHeader>
           <CardContent>
             <div className="text-5xl font-black tracking-tighter mb-2">${dailyCost}</div>
             <p className="text-xs font-bold uppercase mb-4">Projected Daily Cost</p>
             
             <div className="bg-white border-2 border-black p-3 space-y-2">
                <div className="flex justify-between text-sm font-bold">
                    <span>Budget Limit:</span>
                    <span>${budgetLimit}</span>
                </div>
                <div className="w-full bg-gray-200 h-3 border-2 border-black rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${isOverBudget ? 'bg-red-500' : 'bg-green-500'}`} 
                        style={{ width: `${Math.min((parseFloat(dailyCost) / budgetLimit) * 100, 100)}%` }}
                    ></div>
                </div>
                <div className="text-xs font-bold text-center">
                    {isOverBudget ? "Budget Exceeded!" : "Within Budget"}
                </div>
             </div>
           </CardContent>
        </Card>

         {/* Usage Trend / Comparison Card */}
        <Card className={`${isOverBudget ? "bg-red-300" : "bg-yellow-200"} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
             <CardTitle className="text-sm font-black uppercase">Usage Insights</CardTitle>
             <AlertTriangle className="h-6 w-6 stroke-black fill-white" />
           </CardHeader>
           <CardContent>
             <div className="mb-4">
                 <div className="text-4xl font-black">{Math.abs(usageDiff).toFixed(1)}%</div>
                 <div className="text-sm font-bold uppercase">
                    {usageDiff > 0 ? "Higher" : "Lower"} than Avg
                 </div>
             </div>
             
             <div className="space-y-2 text-sm font-bold border-t-2 border-black pt-2">
                 <div className="flex justify-between">
                     <span>Current Load:</span>
                     <span>{latestLoad.toFixed(2)} kW</span>
                 </div>
                 <div className="flex justify-between text-muted-foreground">
                     <span>Avg Load:</span>
                     <span>{avgLoad.toFixed(2)} kW</span>
                 </div>
                 {isOverBudget && (
                     <div className="mt-2 text-red-600 bg-white border-2 border-black p-2 text-center animate-pulse">
                         WARNING: COST OVERRUN
                     </div>
                 )}
             </div>
           </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
         <CardHeader>
             <CardTitle className="font-black uppercase">Real-Time Power Usage Trend</CardTitle>
         </CardHeader>
         <CardContent className="h-[400px]">
             <Line data={chartData} options={chartOptions} />
         </CardContent>
      </Card>
    </div>
  )
}
