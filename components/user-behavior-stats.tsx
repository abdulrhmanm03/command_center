"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, AlertTriangle, TrendingUp, Shield } from "lucide-react"

export function UserBehaviorStats() {
  const [stats, setStats] = useState({
    activeUsers: 2847,
    highRiskUsers: 34,
    anomalies: 127,
    avgRiskScore: 32,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        activeUsers: 2847 + Math.floor(Math.random() * 100),
        highRiskUsers: 34 + Math.floor(Math.random() * 5),
        anomalies: 127 + Math.floor(Math.random() * 20),
        avgRiskScore: 32 + Math.floor(Math.random() * 5),
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-purple-400">Active Users</CardTitle>
          <Users className="h-4 w-4 text-purple-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-400">{stats.activeUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </CardContent>
      </Card>

      <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-red-400">High-Risk Users</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">{stats.highRiskUsers}</div>
          <p className="text-xs text-muted-foreground">Requires review</p>
        </CardContent>
      </Card>

      <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-orange-400">Anomalies Detected</CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-400">{stats.anomalies}</div>
          <p className="text-xs text-muted-foreground">+12% from yesterday</p>
        </CardContent>
      </Card>

      <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-cyan-400">Avg Risk Score</CardTitle>
          <Shield className="h-4 w-4 text-cyan-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-cyan-400">{stats.avgRiskScore}</div>
          <p className="text-xs text-green-400">-5 from last week</p>
        </CardContent>
      </Card>
    </div>
  )
}
