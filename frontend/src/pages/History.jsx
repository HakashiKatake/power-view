import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { useEnergyStore } from "../store/energyStore"

export default function History() {
  const { history } = useEnergyStore()

  return (
    <div className="space-y-6">
       <h1 className="text-4xl font-black uppercase tracking-tighter">Usage History</h1>
       
       <Card className="border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
         <CardHeader>
            <CardTitle>Recent Readings</CardTitle>
         </CardHeader>
         <CardContent>
            {history.length === 0 ? (
                <p className="text-muted-foreground">No history data available yet. Connect to the simulation.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-bold">
                        <thead>
                            <tr className="border-b-2 border-black">
                                <th className="p-2">Time</th>
                                <th className="p-2">Load (kW)</th>
                                <th className="p-2">Cost Rate ($/hr)</th>
                                <th className="p-2">Voltage (V)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.slice().reverse().map((h, i) => (
                                <tr key={i} className="border-b border-gray-200 hover:bg-yellow-100">
                                    <td className="p-2">{new Date(h.timestamp).toLocaleTimeString()}</td>
                                    <td className="p-2">{h.consumptionKwh.toFixed(3)}</td>
                                    <td className="p-2">${h.cost.toFixed(4)}</td>
                                    <td className="p-2">{h.voltage.toFixed(1)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
         </CardContent>
       </Card>
    </div>
  )
}
