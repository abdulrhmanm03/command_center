"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, Settings } from "lucide-react"

interface PipelineSource {
  id: string
  name: string
  category: string
  throughput: number
  throughputUnit: string
  latency: number
  latencyUnit: string
  uptime: number
  lastSync: string
  status: string
}

interface PipelineSourceCardProps {
  source: PipelineSource
}

export function PipelineSourceCard({ source }: PipelineSourceCardProps) {
  const getTimeSince = (isoString: string) => {
    const seconds = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000)
    if (seconds < 60) return `${seconds} seconds ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`
    const hours = Math.floor(minutes / 60)
    return `${hours} hour${hours > 1 ? "s" : ""} ago`
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      EDR: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      SIEM: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "Email Security": "bg-green-500/20 text-green-400 border-green-500/30",
      "Network Security": "bg-orange-500/20 text-orange-400 border-orange-500/30",
      "Vulnerability Management": "bg-red-500/20 text-red-400 border-red-500/30",
      "OT/ICS": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      ITSM: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    }
    return colors[category] || "bg-gray-500/20 text-gray-400 border-gray-500/30"
  }

  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99) return "text-green-400"
    if (uptime >= 95) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <Card className="border-border/50 bg-card/50 hover:border-cyan-500/30 transition-colors">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{source.name}</h3>
              <Badge variant="outline" className={getCategoryColor(source.category)}>
                {source.category}
              </Badge>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Throughput</p>
              <p className="text-lg font-bold text-cyan-400">
                {source.throughput.toLocaleString()}{" "}
                <span className="text-sm font-normal">{source.throughputUnit}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Latency</p>
              <p className="text-lg font-bold text-purple-400">
                {source.latency}
                <span className="text-sm font-normal">{source.latencyUnit}</span>
              </p>
            </div>
          </div>

          {/* Uptime Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Uptime</p>
              <p className={`text-sm font-bold ${getUptimeColor(source.uptime)}`}>{source.uptime}%</p>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  source.uptime >= 99 ? "bg-green-500" : source.uptime >= 95 ? "bg-yellow-500" : "bg-red-500"
                }`}
                style={{ width: `${source.uptime}%` }}
              />
            </div>
          </div>

          {/* Last Sync */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Last Sync:</span>
            <span>{getTimeSince(source.lastSync)}</span>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-cyan-500/30 hover:bg-cyan-500/10 bg-transparent"
            >
              <Activity className="h-3 w-3 mr-2" />
              View Logs
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-purple-500/30 hover:bg-purple-500/10 bg-transparent"
            >
              <Settings className="h-3 w-3 mr-2" />
              Configure
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
