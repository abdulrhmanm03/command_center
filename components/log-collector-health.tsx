"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertTriangle, XCircle, Activity, Heart } from "lucide-react"
import { useEffect, useState } from "react"

interface LogCollector {
  name: string
  status: "healthy" | "degraded" | "offline"
  eps: number
  heartbeat: "active" | "slow" | "stopped"
  lastSeen: string
  source: string
}

export function LogCollectorHealth() {
  const [collectors, setCollectors] = useState<LogCollector[]>([
    {
      name: "WEC-PROD-01",
      status: "healthy",
      eps: 2145,
      heartbeat: "active",
      lastSeen: "Just now",
      source: "Windows Event Collector",
    },
    {
      name: "SYSLOG-PROD-02",
      status: "healthy",
      eps: 1523,
      heartbeat: "active",
      lastSeen: "Just now",
      source: "Linux Syslog Collector",
    },
    {
      name: "CLOUDTRAIL-01",
      status: "healthy",
      eps: 1187,
      heartbeat: "active",
      lastSeen: "Just now",
      source: "AWS CloudTrail Collector",
    },
    {
      name: "AZURE-LOG-01",
      status: "degraded",
      eps: 342,
      heartbeat: "slow",
      lastSeen: "2 min ago",
      source: "Azure Activity Logs Collector",
    },
    {
      name: "FW-COLLECTOR-03",
      status: "healthy",
      eps: 3891,
      heartbeat: "active",
      lastSeen: "Just now",
      source: "Firewall Logs Collector",
    },
    {
      name: "IDS-COLLECTOR-01",
      status: "healthy",
      eps: 756,
      heartbeat: "active",
      lastSeen: "Just now",
      source: "IDS/IPS Alerts Collector",
    },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setCollectors((prev) =>
        prev.map((collector) => ({
          ...collector,
          eps: Math.max(100, Math.floor(collector.eps * (0.95 + Math.random() * 0.1))),
          lastSeen: collector.status === "healthy" ? "Just now" : collector.lastSeen,
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const healthyCount = collectors.filter((c) => c.status === "healthy").length
  const degradedCount = collectors.filter((c) => c.status === "degraded").length
  const offlineCount = collectors.filter((c) => c.status === "offline").length
  const totalEps = collectors.reduce((sum, c) => sum + c.eps, 0)

  return (
    <Card className="mb-6 border-cyan-500/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Log Collector Health
            </CardTitle>
            <p className="text-sm text-gray-400 mt-1">Real-time status of all log collection sources</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-cyan-400">{totalEps.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Total EPS</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="border-green-500 text-green-400">
                {healthyCount} Healthy
              </Badge>
              {degradedCount > 0 && (
                <Badge variant="outline" className="border-yellow-500 text-yellow-400">
                  {degradedCount} Degraded
                </Badge>
              )}
              {offlineCount > 0 && (
                <Badge variant="outline" className="border-red-500 text-red-400">
                  {offlineCount} Offline
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {collectors.map((collector, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all ${
                collector.status === "healthy"
                  ? "border-green-500/30 bg-green-500/5"
                  : collector.status === "degraded"
                    ? "border-yellow-500/30 bg-yellow-500/5"
                    : "border-red-500/30 bg-red-500/5"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-base">{collector.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{collector.source}</p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    collector.status === "healthy"
                      ? "border-green-500 text-green-400"
                      : collector.status === "degraded"
                        ? "border-yellow-500 text-yellow-400"
                        : "border-red-500 text-red-400"
                  }
                >
                  {collector.status}
                </Badge>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Heart
                  className={`h-4 w-4 ${
                    collector.heartbeat === "active"
                      ? "text-green-400 animate-pulse"
                      : collector.heartbeat === "slow"
                        ? "text-yellow-400"
                        : "text-red-400"
                  }`}
                />
                <span className="text-xs text-muted-foreground">
                  Heartbeat:{" "}
                  <span
                    className={
                      collector.heartbeat === "active"
                        ? "text-green-400"
                        : collector.heartbeat === "slow"
                          ? "text-yellow-400"
                          : "text-red-400"
                    }
                  >
                    {collector.heartbeat}
                  </span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-cyan-400">{collector.eps.toLocaleString()}</span>
                  <span className="text-sm text-muted-foreground ml-2">EPS</span>
                </div>
                {collector.status === "healthy" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                ) : collector.status === "degraded" ? (
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-400" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">Last seen: {collector.lastSeen}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
