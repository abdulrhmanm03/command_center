"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plug, Activity, Clock, Search, CheckCircle2, XCircle, TrendingUp } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface Integration {
  id: string
  name: string
  description: string
  category: string
  status: "connected" | "available"
  version: string
  eventsPerDay: string
  lastSync: string
  icon: string
  health: number
  uptime: number
}

export function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchIntegrations()
  }, [])

  const fetchIntegrations = async () => {
    try {
      const response = await fetch("/api/marketplace/integrations")
      const data = await response.json()
      setIntegrations(data)
    } catch (error) {
      console.error("Failed to fetch integrations:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (integrationId: string, action: "connect" | "disconnect") => {
    try {
      await fetch("/api/marketplace/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integrationId, action }),
      })
      fetchIntegrations()
    } catch (error) {
      console.error("Action failed:", error)
    }
  }

  const filteredIntegrations = integrations.filter(
    (integration) =>
      integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      integration.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const connectedIntegrations = filteredIntegrations.filter((i) => i.status === "connected")
  const availableIntegrations = filteredIntegrations.filter((i) => i.status === "available")

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading integrations...</div>
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search integrations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-slate-700 bg-[#0f1419]"
        />
      </div>

      {connectedIntegrations.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Connected ({connectedIntegrations.length})</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {connectedIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} onAction={handleAction} />
            ))}
          </div>
        </div>
      )}

      {availableIntegrations.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-gray-400" />
            <h2 className="text-xl font-semibold text-white">Available ({availableIntegrations.length})</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableIntegrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} onAction={handleAction} />
            ))}
          </div>
        </div>
      )}

      {filteredIntegrations.length === 0 && (
        <div className="py-12 text-center text-gray-400">No integrations found matching your search.</div>
      )}
    </div>
  )
}

function IntegrationCard({
  integration,
  onAction,
}: {
  integration: Integration
  onAction: (integrationId: string, action: "connect" | "disconnect") => void
}) {
  const isConnected = integration.status === "connected"

  return (
    <Card
      className={`border-slate-700 bg-[#0f1419] transition-all hover:shadow-lg ${
        isConnected
          ? "border-green-500/30 hover:border-green-500/50 hover:shadow-green-500/10"
          : "hover:border-cyan-500/50 hover:shadow-cyan-500/10"
      }`}
    >
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                  isConnected ? "from-green-500/20 to-emerald-500/20" : "from-cyan-500/20 to-blue-500/20"
                }`}
              >
                <Plug className={`h-6 w-6 ${isConnected ? "text-green-400" : "text-cyan-400"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{integration.name}</h3>
                <Badge
                  variant="outline"
                  className={`mt-1 border-slate-600 text-xs ${
                    isConnected ? "border-green-500/50 text-green-400" : "text-gray-400"
                  }`}
                >
                  {integration.category}
                </Badge>
              </div>
            </div>
            <Badge
              className={
                isConnected
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
              }
            >
              {isConnected ? "Connected" : "Available"}
            </Badge>
          </div>

          <p className="text-sm text-gray-400 line-clamp-2">{integration.description}</p>

          {isConnected && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-slate-800/50 p-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Activity className="h-3 w-3" />
                    <span>Events/Day</span>
                  </div>
                  <p className="mt-1 font-semibold text-white">{integration.eventsPerDay}</p>
                </div>
                <div className="rounded-lg bg-slate-800/50 p-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <TrendingUp className="h-3 w-3" />
                    <span>Health</span>
                  </div>
                  <p className="mt-1 font-semibold text-green-400">{integration.health}%</p>
                </div>
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Uptime</span>
                  <span className="font-semibold text-green-400">{integration.uptime}%</span>
                </div>
                <Progress value={integration.uptime} className="h-1.5" />
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="h-3 w-3" />
                <span>Last sync: {integration.lastSync}</span>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-slate-800 pt-3">
            <span className="text-xs text-gray-500">{integration.version}</span>
            {isConnected ? (
              <Button
                size="sm"
                variant="outline"
                className="border-red-500/50 bg-transparent text-red-400 hover:bg-red-500/10"
                onClick={() => onAction(integration.id, "disconnect")}
              >
                Disconnect
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-cyan-500 text-white hover:bg-cyan-600"
                onClick={() => onAction(integration.id, "connect")}
              >
                Connect
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
