import { useEnergyStore } from "../store/energyStore"
import { useAuthStore } from "../store/authStore"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Leaf, DollarSign, TrendingUp, AlertCircle, Award } from "lucide-react"

export default function Analytics() {
  const { history, currReading } = useEnergyStore()
  const { user } = useAuthStore()

  // --- Calculations ---
  
  // 1. Carbon Footprint
  // Avg grid roughly 0.4 kg CO2 per kWh (very rough estimate)
  const totalKwh = history.reduce((acc, curr) => acc + curr.consumptionKwh, 0)
  // Since history is just instant readings (kW), we need to integrate over time ideally.
  // But our simulator assumes 'reading' approximates usage for that bucket. 
  // Let's assume each history point is a "slice" of energy. 
  // Actually, kW is power. Energy (kWh) = Power (kW) * Time (h).
  // If we update every 2s, each point represents 2s of usage.
  // Energy per point = kW * (2/3600) hours.
  const intervalHours = 2 / 3600
  const approximateTotalEnergyKwh = totalKwh * intervalHours // Approximate session energy
  
  // To make it look "real" for the demo since we have little data, let's project daily based on current rate
  // Daily kWh = Current kW * 24h (naive projection)
  const projectedDailyKwh = currReading.consumptionKwh * 24
  const co2DailyKg = projectedDailyKwh * 0.4
  const treesRequired = co2DailyKg / 0.06 // Approx 0.06 kg CO2 absorbed per tree/day (very rough)

  // 2. Efficiency Grade
  // Based on "Peak Factor": Max Load / Avg Load. Lower is better (flatter curve).
  const avgLoad = history.length > 0 ? totalKwh / history.length : 1
  const maxLoad = history.length > 0 ? Math.max(...history.map(h => h.consumptionKwh)) : 1
  const peakFactor = maxLoad / avgLoad
  
  let grade = 'B'
  let gradeColor = 'text-blue-500'
  if (peakFactor < 1.2) { grade = 'A'; gradeColor = 'text-green-500' }
  else if (peakFactor < 1.5) { grade = 'B'; gradeColor = 'text-blue-500' }
  else if (peakFactor < 2.0) { grade = 'C'; gradeColor = 'text-yellow-500' }
  else { grade = 'D'; gradeColor = 'text-red-500' }

  // 3. Financial Forecast
  const dailyCost = projectedDailyKwh * 0.15
  const monthlyProjection = dailyCost * 30
  
  return (
    <div className="space-y-8">
       <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-2">
          Deep Analytics <TrendingUp className="h-8 w-8" />
       </h1>
       
       {/* Top Row: The Score */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white flex flex-col justify-center items-center p-6 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]">
              <CardTitle className="text-xl font-black uppercase mb-4">Efficiency Score</CardTitle>
              <div className={`text-9xl font-black ${gradeColor} drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]`}>
                  {grade}
              </div>
              <p className="font-bold text-center mt-2 max-w-xs">
                 {grade === 'A' ? "Excellent! Your usage is stable and efficient." : 
                  grade === 'D' ? "High variance detected. Try to flatten your consumption spikes." :
                  "Good. Consistent usage helps the grid and your wallet."}
              </p>
          </Card>

          <div className="space-y-6">
              {/* Carbon Card */}
              <Card className="bg-emerald-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-black uppercase">Carbon Footprint (Daily)</CardTitle>
                      <Leaf className="h-6 w-6 stroke-black fill-white" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-5xl font-black tracking-tighter">{co2DailyKg.toFixed(1)} <span className="text-xl">kg CO₂</span></div>
                      <div className="mt-4 font-bold text-sm bg-white border-2 border-black p-2 inline-block">
                          Running Average: <span className="text-green-600">{treesRequired.toFixed(1)} trees</span> needed to offset
                      </div>
                  </CardContent>
              </Card>

              {/* Bill Projection */}
              <Card className="bg-pink-200 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-black uppercase">Monthly Forecast</CardTitle>
                      <DollarSign className="h-6 w-6 stroke-black fill-white" />
                  </CardHeader>
                  <CardContent>
                      <div className="text-5xl font-black tracking-tighter">${monthlyProjection.toFixed(0)}</div>
                      <p className="text-xs font-bold uppercase mt-2">Estimated bill at current rate</p>
                  </CardContent>
              </Card>
          </div>
       </div>

       {/* Tips Section */}
       <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-yellow-100">
           <CardHeader>
               <CardTitle className="flex items-center gap-2 font-black uppercase">
                   <Award className="h-6 w-6" /> Energy Saving Tip
               </CardTitle>
           </CardHeader>
           <CardContent>
               <div className="text-xl font-bold italic">
                   "Did you know? Reducing your peak load between 5PM and 9PM can save up to 20% on your bill if you are on a Time-of-Use plan. Try running the dishwasher at night!"
               </div>
           </CardContent>
       </Card>
    </div>
  )
}
