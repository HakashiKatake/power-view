import { useEnergyStore } from "../store/energyStore"
import { useAuthStore } from "../store/authStore"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { AlertCircle, Calendar, Zap, Wallet } from "lucide-react"

export default function Alerts() {
  const { history, currReading } = useEnergyStore()
  const { user } = useAuthStore()

  const alerts = []

  // 1. Bill Due Alert logic
  if (user?.billDueDate) {
      const today = new Date()
      const dueDate = new Date(user.billDueDate)
      const diffTime = dueDate - today
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) 

      if (diffDays <= 3 && diffDays >= 0) {
          alerts.push({
              id: 'bill-due',
              type: 'critical',
              title: 'Utility Bill Due Soon',
              message: `Your payment to ${user.providerName || 'Provider'} is due ${diffDays === 0 ? 'TODAY' : `in ${diffDays} days`}.`,
              icon: <Calendar className="h-5 w-5" />,
              time: 'Now'
          })
      } else if (diffDays < 0) {
           alerts.push({
              id: 'bill-overdue',
              type: 'critical',
              title: 'Utility Bill Overdue',
              message: `Your payment was due on ${dueDate.toLocaleDateString()}. Please pay immediately to avoid service interruption.`,
              icon: <AlertCircle className="h-5 w-5" />,
              time: 'Overdue'
          })
      }
  }

  // 2. High Usage Alerts (Scan recent history)
  // Let's look at the last 50 points. If any were > 4kW, we flag them.
  // We want to group them or show the most recent significant one.
  const highUsagePoints = history.filter(h => h.consumptionKwh > 4.0).reverse()
  
  if (highUsagePoints.length > 0) {
      // Just take the most recent 3
      highUsagePoints.slice(0, 3).forEach((h, index) => {
          alerts.push({
              id: `high-usage-${index}`,
              type: 'warning',
              title: 'High Power Draw Detected',
              message: `Spike of ${h.consumptionKwh.toFixed(2)} kW detected. Check large appliances.`,
              icon: <Zap className="h-5 w-5" />,
              time: new Date(h.timestamp).toLocaleTimeString()
          })
      })
  }

  // 3. Budget Alert
  const dailyCost = (currReading.consumptionKwh * 24 * 0.15)
  if (user?.budgetLimit && dailyCost > user.budgetLimit) {
      alerts.push({
          id: 'budget-overrun',
          type: 'warning',
          title: 'Daily Budget Exceeded',
          message: `Current projected cost ($${dailyCost.toFixed(2)}) is above your limit of $${user.budgetLimit}.`,
          icon: <Wallet className="h-5 w-5" />,
          time: 'Live'
      })
  }

  return (
    <div className="space-y-6">
       <h1 className="text-4xl font-black uppercase tracking-tighter flex items-center gap-2">
          System Alerts <AlertCircle className="h-8 w-8 text-red-500" />
       </h1>
       
       <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white min-h-[400px]">
         <CardHeader>
            <CardTitle className="font-black uppercase">Notifications & Warnings</CardTitle>
         </CardHeader>
         <CardContent>
            {alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-gray-500">
                    <Zap className="h-12 w-12 mb-4 text-green-500" />
                    <p className="font-bold text-lg">All systems normal.</p>
                    <p>No active alerts at this time.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {alerts.map((alert) => (
                        <div 
                            key={alert.id} 
                            className={`flex items-start gap-4 p-4 border-2 border-black ${
                                alert.type === 'critical' ? 'bg-red-200' : 'bg-yellow-200'
                            } shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all`}
                        >
                            <div className={`p-2 rounded-full border-2 border-black bg-white`}>
                                {alert.icon}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-black uppercase text-lg">{alert.title}</h3>
                                    <span className="text-xs font-bold bg-white border border-black px-2 py-1 rounded-full">{alert.time}</span>
                                </div>
                                <p className="font-medium mt-1">{alert.message}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
         </CardContent>
       </Card>
    </div>
  )
}
