import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Zap } from "lucide-react"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const { login, error } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await login(email, password)
    if (success) {
      navigate("/") // Redirect to Dashboard
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border-2 border-black bg-yellow-400">
                <Zap className="h-6 w-6 stroke-black stroke-2" />
            </div>
          <CardTitle className="text-3xl font-black uppercase">Welcome Back</CardTitle>
          <p className="font-bold text-gray-500">Enter your credentials to access PowerView</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-100 border-2 border-red-500 text-red-700 px-4 py-2 rounded font-bold">
                    {error}
                </div>
            )}
            <div className="space-y-2">
                <label className="text-sm font-black uppercase">Email</label>
                <Input 
                    type="email" 
                    placeholder="user@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required 
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-black uppercase">Password</label>
                <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />
            </div>
            
            <Button type="submit" size="lg" className="w-full text-lg font-black">
              Sign In
            </Button>

            <div className="mt-4 text-center text-sm font-bold">
                Don't have an account? <Link to="/register" className="underline hover:text-primary">Sign up</Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
