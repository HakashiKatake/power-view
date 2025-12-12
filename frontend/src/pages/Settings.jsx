import { useState } from "react"
import { useAuthStore } from "../store/authStore"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"

export default function Settings() {
  const { user, updateBudget } = useAuthStore()
  const [budget, setBudget] = useState(user?.budgetLimit || 50)
  const [msg, setMsg] = useState("")

  const handleSave = () => {
    // In a real app, we would call the API here
    // await axios.put('/api/user/settings', { budgetLimit: budget })
    updateBudget(budget)
    setMsg("Settings saved successfully!")
    setTimeout(() => setMsg(""), 3000)
  }

  return (
    <div className="space-y-6">
       <h1 className="text-4xl font-black uppercase tracking-tighter">System Configuration</h1>
       
       <div className="grid md:grid-cols-2 gap-6">
           <Card className="border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-purple-200">
             <CardHeader>
                <CardTitle>Profile Details</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 font-bold">
                <p>Username: {user?.username}</p>
                <p>Email: {user?.email}</p>
                <p className="text-sm text-gray-600">ID: {user?.id}</p>
             </CardContent>
           </Card>

           <Card className="border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             <CardHeader>
                <CardTitle>Budget Preferences</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="font-bold uppercase text-sm">Daily Cost Limit ($)</label>
                    <Input 
                        type="number" 
                        value={budget} 
                        onChange={(e) => setBudget(e.target.value)} 
                    />
                    <p className="text-xs text-gray-500">Alerts will trigger if projected daily cost exceeds this value.</p>
                </div>
                <Button onClick={handleSave} className="w-full font-black">
                    Save Changes
                </Button>
                {msg && <p className="text-green-600 font-bold text-center animate-bounce">{msg}</p>}
             </CardContent>
           </Card>
       </div>
    </div>
  )
}
