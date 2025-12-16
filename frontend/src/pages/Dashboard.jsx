import { useEffect, useState } from "react"
import { useEnergyStore } from "../store/energyStore"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Line, Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js'
import { Zap, Wallet, AlertTriangle, PieChart, Clock } from "lucide-react"
import Gauge from "../components/Gauge"
import { useAuthStore } from "../store/authStore"
import { Button } from "../components/ui/button"

// Register ChartJS
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function Dashboard() {
  const { connectSocket, disconnectSocket, currReading, history, isConnected } = useEnergyStore()
  const { user, logout } = useAuthStore()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    // Only connect if we have a valid user ID (MongoDB uses _id)
    const userId = user?._id || user?.id;
    if (userId) {
        connectSocket(userId)
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 60000) 
    return () => {
        disconnectSocket()
        clearInterval(timer)
    }
    // Use userId in dependency to avoid re-connecting on other user object changes
  }, [user?._id, user?.id]) 


  const latestLoad = currReading.consumptionKwh
  const dailyCost = (latestLoad * 24 * 0.15).toFixed(2)
  const budgetLimit = user?.budgetLimit || 50
  
  // Peak Hours Logic (Example: 5PM - 9PM)
  const currentHour = currentTime.getHours()
  const isPeakHours = currentHour >= 17 && currentHour < 21

  // Calculate status
  const isOverBudget = parseFloat(dailyCost) > budgetLimit
  const loadPercentage = (latestLoad / 5) * 100 

  const avgLoad = history.length > 0 
    ? history.reduce((acc, curr) => acc + curr.consumptionKwh, 0) / history.length
    : 1.5;

  const usageDiff = avgLoad ? ((latestLoad - avgLoad) / avgLoad) * 100 : 0
  
  // Simulated Breakdown Data based on Load
  // In a real app, this would come from smart plugs or AI disaggregation
  const breakdownData = {
    labels: ['HVAC', 'Lighting', 'Appliances', 'Always On'],
    datasets: [
      {
        data: [
            latestLoad * 0.45, // HVAC usually highest
            latestLoad * 0.15, 
            latestLoad * 0.25, 
            latestLoad * 0.15
        ],
        backgroundColor: [
          '#FF6B6B', // Red
          '#4ECDC4', // Teal
          '#FFE66D', // Yellow
          '#1A535C'  // Dark Blue
        ],
        borderColor: 'black',
        borderWidth: 2,
      },
    ],
  };

  const lineChartData = {
    labels: history.map(h => new Date(h.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Power Draw (kW)',
        data: history.map(h => h.consumptionKwh),
        borderColor: 'black',
        backgroundColor: isPeakHours ? 'rgba(255, 99, 132, 0.5)' : 'rgba(255, 200, 0, 0.5)', 
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
           <div className="flex items-center gap-2">
                <span className="text-muted-foreground font-medium">
                    Hello, <span className="text-black font-bold">{user?.username}</span>
                </span>
                {isPeakHours && (
                    <span className="bg-red-500 text-white text-xs font-black uppercase px-2 py-1 border-2 border-black -skew-x-12 animate-pulse">
                        Peak Pricing Active
                    </span>
                )}
           </div>
        </div>
        
        <div className="flex items-center gap-4">
             {user?.billDueDate && (
                 <div className="hidden md:flex flex-col items-end mr-4 animate-in slide-in-from-right duration-500">
                    <span className="text-xs font-black uppercase text-muted-foreground">Next Bill Due</span>
                     <span className="text-lg font-black text-red-500 bg-red-100 px-2 border-2 border-red-500 -skew-x-12">
                        {new Date(user.billDueDate).toLocaleDateString()}
                    </span>
                 </div>
             )}
             <div className="flex items-center gap-2">
                <div className={`h-4 w-4 rounded-full border-2 border-black ${isConnected ? 'bg-green-400' : 'bg-red-500 animate-pulse'}`}></div>
                <span className="hidden sm:inline font-bold text-sm uppercase">{isConnected ? 'System Online' : 'Connecting...'}</span>
             </div>
             
             <Button variant="destructive" onClick={logout} className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                Logout
             </Button>
        </div>
      </div>

      {/* KPI Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Voltage/Load Card with Gauge */}
        <Card className="bg-blue-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
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
        <Card className="bg-green-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
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
        <Card className={`${isOverBudget ? "bg-red-300" : "bg-yellow-200"} border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all`}>
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

        {/* Row 2: Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Trend Chart */}
            <Card className="md:col-span-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-black uppercase">Real-Time Power Trend</CardTitle>
                    {isPeakHours && <span className="text-red-500 font-bold text-sm uppercase animate-pulse flex items-center gap-1"><Clock className="h-4 w-4"/> Peak Hrs</span>}
                </CardHeader>
                <CardContent className="h-[300px]">
                    <Line data={lineChartData} options={chartOptions} />
                </CardContent>
            </Card>

            {/* Estimated Breakdown Chart */}
            <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-violet-200">
                <CardHeader>
                    <CardTitle className="font-black uppercase flex items-center gap-2">
                        <PieChart className="h-5 w-5"/> Est. Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] flex flex-col items-center justify-center p-2">
                     <div className="w-[80%] h-[80%]">
                        <Doughnut 
                            data={breakdownData} 
                            options={{
                                plugins: { legend: { position: 'bottom', labels: { font: { weight: 'bold', family: 'sans-serif' }, color: 'black' } } },
                                cutout: '60%',
                                responsive: true,
                                maintainAspectRatio: false
                            }} 
                        />
                     </div>
                     <p className="text-xs font-bold text-center mt-2 text-muted-foreground">AI-Estimated Usage Distribution</p>
                </CardContent>
            </Card>
      </div>
    </div>
  )
}
