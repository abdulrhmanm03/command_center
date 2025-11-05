"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, AlertTriangle, Database, TrendingUp } from "lucide-react"
import { useEffect, useState } from "react"

export function ThreatIntelStats() {
  const [stats, setStats] = useState({
    threatActors: 47,
    activeCampaigns: 12,
    iocsTracked: 8942,
    newThreats: 23,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats({
        threatActors: 47 + Math.floor(Math.random() * 5),
        activeCampaigns: 12 + Math.floor(Math.random() * 3),
        iocsTracked: 8942 + Math.floor(Math.random() * 100),
        newThreats: 23 + Math.floor(Math.random() * 5),
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Threat Actors</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.threatActors}</div>
          <p className="text-xs text-muted-foreground">Active groups tracked</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
          <AlertTriangle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{stats.activeCampaigns}</div>
          <p className="text-xs text-muted-foreground">Ongoing operations</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">IOCs Tracked</CardTitle>
          <Database className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.iocsTracked.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">Indicators monitored</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">New Threats</CardTitle>
          <TrendingUp className="h-4 w-4 text-warning" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{stats.newThreats}</div>
          <p className="text-xs text-muted-foreground">Last 7 days</p>
        </CardContent>
      </Card>
    </div>
  )
}
