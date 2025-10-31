"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AlertTriangle, Shield, Info, XCircle, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Alert {
  id: string
  type: "critical" | "high" | "medium" | "low" | "info"
  category: string
  message: string
  timestamp: Date
  source: string
  acknowledged: boolean
}

export function AlertSummary({ onNavigate }: { onNavigate?: (view: string) => void }) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [filter, setFilter] = useState<"all" | "critical" | "high" | "medium" | "low">("all")

  useEffect(() => {
    // Initialize alerts
    const initialAlerts: Alert[] = [
      {
        id: "1",
        type: "critical",
        category: "Prompt Injection",
        message: "Multiple jailbreak attempts detected from IP 192.168.1.45",
        timestamp: new Date(Date.now() - 5 * 60000),
        source: "Interaction Layer",
        acknowledged: false,
      },
      {
        id: "2",
        type: "high",
        category: "Data Poisoning",
        message: "Unauthorized model retraining attempt detected",
        timestamp: new Date(Date.now() - 15 * 60000),
        source: "Pipeline Monitor",
        acknowledged: false,
      },
      {
        id: "3",
        type: "high",
        category: "PII Leakage",
        message: "Sensitive data detected in model response",
        timestamp: new Date(Date.now() - 25 * 60000),
        source: "Response Validator",
        acknowledged: true,
      },
      {
        id: "4",
        type: "medium",
        category: "Semantic Drift",
        message: "User intent deviation above threshold (45%)",
        timestamp: new Date(Date.now() - 35 * 60000),
        source: "Behavioral Telemetry",
        acknowledged: false,
      },
      {
        id: "5",
        type: "low",
        category: "Rate Limit",
        message: "User exceeded query rate limit (120 req/min)",
        timestamp: new Date(Date.now() - 45 * 60000),
        source: "API Gateway",
        acknowledged: true,
      },
    ]
    setAlerts(initialAlerts)

    // Simulate new alerts
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const types: Alert["type"][] = ["critical", "high", "medium", "low"]
        const categories = ["Prompt Injection", "Data Poisoning", "PII Leakage", "Semantic Drift", "Model Abuse"]
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: types[Math.floor(Math.random() * types.length)],
          category: categories[Math.floor(Math.random() * categories.length)],
          message: "New security event detected",
          timestamp: new Date(),
          source: "Security Monitor",
          acknowledged: false,
        }
        setAlerts((prev) => [newAlert, ...prev].slice(0, 20))
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "high":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />
      case "low":
        return <Shield className="h-4 w-4 text-blue-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "bg-red-500/10 border-red-500/30 text-red-400"
      case "high":
        return "bg-orange-500/10 border-orange-500/30 text-orange-400"
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
      case "low":
        return "bg-blue-500/10 border-blue-500/30 text-blue-400"
      default:
        return "bg-gray-500/10 border-gray-500/30 text-gray-400"
    }
  }

  const filteredAlerts = filter === "all" ? alerts : alerts.filter((a) => a.type === filter)

  const criticalCount = alerts.filter((a) => a.type === "critical" && !a.acknowledged).length
  const highCount = alerts.filter((a) => a.type === "high" && !a.acknowledged).length

  const handleAcknowledge = (id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a)))
  }

  return (
    <Card className="border-none bg-white/5 backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Alert Summary
              {(criticalCount > 0 || highCount > 0) && (
                <Badge variant="destructive" className="ml-2">
                  {criticalCount + highCount} Urgent
                </Badge>
              )}
            </CardTitle>
            <p className="text-sm text-gray-400 mt-1">Prioritized security alerts and incidents</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate?.("incidents")}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            View All Incidents
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter Buttons */}
        <div className="flex gap-2 mb-4">
          {["all", "critical", "high", "medium", "low"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${
                filter === f ? "bg-blue-500 text-white" : "bg-white/10 text-gray-400 hover:bg-white/20"
              }`}
            >
              {f}
              {f !== "all" && <span className="ml-1 opacity-70">({alerts.filter((a) => a.type === f).length})</span>}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No {filter !== "all" ? filter : ""} alerts</p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${getAlertColor(alert.type)} ${
                  alert.acknowledged ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1">
                    {getAlertIcon(alert.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold uppercase">{alert.category}</span>
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          {alert.source}
                        </Badge>
                        {alert.acknowledged && (
                          <Badge variant="outline" className="text-[10px] px-1 py-0 bg-green-500/20">
                            Acknowledged
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/90">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {alert.timestamp.toLocaleTimeString()} - {alert.timestamp.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {!alert.acknowledged && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAcknowledge(alert.id)}
                      className="text-xs hover:bg-white/10"
                    >
                      Acknowledge
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
