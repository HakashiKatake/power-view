import { useState, useEffect } from "react"
import { useAuthStore } from "../store/authStore"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Building2, Calendar } from "lucide-react"

export default function Settings() {
  const { user, updateSettings } = useAuthStore()
  const [budget, setBudget] = useState(user?.budgetLimit || 50)
  const [provider, setProvider] = useState(user?.providerName || "")
  const [dueDate, setDueDate] = useState(user?.billDueDate ? new Date(user.billDueDate).toISOString().split('T')[0] : "")
  const [msg, setMsg] = useState("")

  useEffect(() => {
      if (user) {
          setBudget(user.budgetLimit || 50)
          setProvider(user.providerName || "")
          setDueDate(user.billDueDate ? new Date(user.billDueDate).toISOString().split('T')[0] : "")
      }
  }, [user])

  const handleSave = async () => {
    const success = await updateSettings({ 
        budgetLimit: budget,
        providerName: provider,
        billDueDate: dueDate
    })
    
    if (success) {
        setMsg("Settings saved successfully!")
        setTimeout(() => setMsg(""), 3000)
    } else {
        setMsg("Failed to save.")
    }
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
                <p className="text-sm text-gray-600">ID: {user?._id || user?.id}</p>
             </CardContent>
           </Card>

           <Card className="border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
             <CardHeader>
                <CardTitle>Preferences & Billing</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="space-y-2">
                    <label className="font-bold uppercase text-sm">Daily Cost Limit ($)</label>
                    <Input 
                        type="number" 
                        value={budget} 
                        onChange={(e) => setBudget(e.target.value)} 
                    />
                </div>

                <div className="space-y-2">
                    <label className="font-bold uppercase text-sm flex items-center gap-2">
                        <Building2 className="h-4 w-4" /> Utility Provider
                    </label>
                    <Input 
                        type="text" 
                        placeholder="e.g. ConEd, National Grid"
                        value={provider} 
                        onChange={(e) => setProvider(e.target.value)} 
                    />
                </div>

                <div className="space-y-2">
                    <label className="font-bold uppercase text-sm flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Next Bill Due Date
                    </label>
                    <Input 
                        type="date" 
                        value={dueDate} 
                        onChange={(e) => setDueDate(e.target.value)} 
                    />
                </div>

                <Button onClick={handleSave} className="w-full font-black mt-4">
                    Save Changes
                </Button>
                {msg && <p className="text-green-600 font-bold text-center animate-bounce">{msg}</p>}
             </CardContent>
           </Card>
       </div>
    </div>
  )
}
