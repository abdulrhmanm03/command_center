"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Shield } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate authentication
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Mock authentication - accept admin@vts.com / password
    if (email === "admin@vts.com" && password === "password") {
      // Store auth token in localStorage
      localStorage.setItem("vts_auth_token", "mock_token_" + Date.now())
      if (rememberMe) {
        localStorage.setItem("vts_remember", "true")
      }
      router.push("/")
    } else {
      setError("Invalid credentials. Use admin@vts.com / password")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0e17] p-4">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5" />

      <Card className="w-full max-w-md relative z-10 border-cyan-500/20 bg-[#0f1419]/95 backdrop-blur">
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-white">VTS Command Centre</CardTitle>
            <CardDescription className="text-gray-400">Security Operations Dashboard</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@vts.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[#1a1f2e] border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-[#1a1f2e] border-gray-700 text-white placeholder:text-gray-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer">
                  Remember me
                </Label>
              </div>

              <button type="button" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                Forgot password?
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">Demo credentials: admin@vts.com / password</div>
        </CardContent>
      </Card>
    </div>
  )
}
