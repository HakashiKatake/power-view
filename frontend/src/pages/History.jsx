import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { useEnergyStore } from "../store/energyStore"
import { Database, TrendingUp, DollarSign, Download } from "lucide-react"
import { Button } from "../components/ui/button"

export default function History() {
  const { history } = useEnergyStore()

  // Calculate stats
  const totalReadings = history.length
  const avgLoad = totalReadings > 0 
    ? history.reduce((acc, curr) => acc + curr.consumptionKwh, 0) / totalReadings
    : 0
  const avgCost = totalReadings > 0 
    ? history.reduce((acc, curr) => acc + curr.cost, 0) / totalReadings
    : 0

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <h1 className="text-4xl font-black uppercase tracking-tighter">Usage History</h1>
       </div>
       
       {/* Stats Overview */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-pink-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-black uppercase">Data Points</CardTitle>
                    <Database className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black">{totalReadings}</div>
                </CardContent>
            </Card>
            <Card className="bg-cyan-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-black uppercase">Avg Load</CardTitle>
                    <TrendingUp className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black">{avgLoad.toFixed(2)} kW</div>
                </CardContent>
            </Card>
            <Card className="bg-yellow-200 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-black uppercase">Avg Rate</CardTitle>
                    <DollarSign className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-black">${avgCost.toFixed(3)}/hr</div>
                </CardContent>
            </Card>
       </div>

       <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
         <CardHeader>
            <CardTitle>Recent Readings Card</CardTitle>
         </CardHeader>
         <CardContent>
            <div className="flex justify-end mb-4">
                <Button 
                    onClick={() => {
                        if (history.length === 0) return;
                        
                        const headers = ["Timestamp,Load (kW),Cost ($),Voltage (V)"];
                        const rows = history.map(h => 
                            `${new Date(h.timestamp).toISOString()},${h.consumptionKwh},${h.cost},${h.voltage}`
                        );
                        
                        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
                        const encodedUri = encodeURI(csvContent);
                        const link = document.createElement("a");
                        link.setAttribute("href", encodedUri);
                        link.setAttribute("download", "energy_history.csv");
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    }}
                    className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all bg-green-400 text-black hover:bg-green-500"
                >
                    <Download className="mr-2 h-4 w-4" /> Export CSV
                </Button>
            </div>
            {history.length === 0 ? (
                <div className="text-center py-10 font-bold text-gray-500">
                    No history data available yet. Connect to the simulation to start tracking.
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left font-bold border-collapse">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="p-3 border-r border-gray-600 first:rounded-tl-md">Time</th>
                                <th className="p-3 border-r border-gray-600">Load (kW)</th>
                                <th className="p-3 border-r border-gray-600">Cost Rate ($/hr)</th>
                                <th className="p-3 last:rounded-tr-md">Voltage (V)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.slice().reverse().map((h, i) => (
                                <tr key={i} className={`border-b-2 border-black hover:bg-yellow-100 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <td className="p-3 border-r-2 border-black">{new Date(h.timestamp).toLocaleTimeString()}</td>
                                    <td className="p-3 border-r-2 border-black">{h.consumptionKwh.toFixed(3)}</td>
                                    <td className="p-3 border-r-2 border-black">${h.cost.toFixed(4)}</td>
                                    <td className="p-3">{h.voltage.toFixed(1)}</td>
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
