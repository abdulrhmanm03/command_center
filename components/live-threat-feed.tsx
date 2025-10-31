"use client"

import { Button } from "@/components/ui/button"
import { Pause, Play } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useRealtimeData } from "@/hooks/use-realtime-data"

export function LiveThreatFeed() {
  const { threats, isConnected, isPaused, togglePause } = useRealtimeData()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-warning text-warning-foreground"
      case "medium":
        return "bg-blue-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={togglePause} className="gap-2 bg-transparent">
            {isPaused ? (
              <>
                <Play className="h-3 w-3" />
                Resume
              </>
            ) : (
              <>
                <Pause className="h-3 w-3" />
                Pause
              </>
            )}
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-success animate-pulse" : "bg-destructive"}`} />
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {threats.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">
            {isConnected ? "Waiting for events..." : "Connecting to threat feed..."}
          </p>
        )}
        {threats.slice(0, 10).map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-3 rounded-lg border border-border/50 bg-background/50 p-3 text-sm"
          >
            <div className="mt-0.5 h-2 w-2 animate-pulse rounded-full bg-success" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <Badge className={getSeverityColor(event.severity)} variant="secondary">
                  {event.severity.toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="text-foreground">{event.message}</p>
              {event.ip && <p className="text-xs text-primary font-mono">{event.ip}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
