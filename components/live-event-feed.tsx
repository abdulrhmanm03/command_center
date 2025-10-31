"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Shield, Activity, Eye } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Event {
  id: string
  timestamp: string
  severity: "Critical" | "High" | "Medium" | "Low"
  type: string
  source: string
  destination: string
  description: string
  details: {
    protocol: string
    port: number
    action: string
    signature: string
  }
}

const generateMockEvent = (): Event => {
  const severities: Array<"Critical" | "High" | "Medium" | "Low"> = ["Critical", "High", "Medium", "Low"]
  const types = ["Malware Detection", "Intrusion Attempt", "Anomaly Detected", "Policy Violation"]
  const sources = ["192.168.1.45", "10.0.0.23", "172.16.0.89", "185.220.101.34"]
  const destinations = ["10.0.0.1", "192.168.1.1", "172.16.0.1", "8.8.8.8"]
  const descriptions = [
    "Suspicious shellcode execution detected",
    "Multiple failed login attempts",
    "Unusual outbound traffic pattern",
    "Malware signature match found",
    "Port scan activity detected",
    "SQL injection attempt blocked",
  ]

  const now = new Date()
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: now.toLocaleTimeString(),
    severity: severities[Math.floor(Math.random() * severities.length)],
    type: types[Math.floor(Math.random() * types.length)],
    source: sources[Math.floor(Math.random() * sources.length)],
    destination: destinations[Math.floor(Math.random() * destinations.length)],
    description: descriptions[Math.floor(Math.random() * descriptions.length)],
    details: {
      protocol: Math.random() > 0.5 ? "TCP" : "UDP",
      port: Math.floor(Math.random() * 65535),
      action: Math.random() > 0.5 ? "Blocked" : "Allowed",
      signature: `SIG-${Math.floor(Math.random() * 10000)}`,
    },
  }
}

export function LiveEventFeed() {
  const [events, setEvents] = useState<Event[]>([])
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    // Initialize with some events
    setEvents(Array.from({ length: 10 }, generateMockEvent))

    // Simulate real-time events
    const interval = setInterval(() => {
      if (!isPaused) {
        setEvents((prev) => [generateMockEvent(), ...prev.slice(0, 49)])
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [isPaused])

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "destructive"
      case "High":
        return "default"
      case "Medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Critical":
        return <AlertTriangle className="h-4 w-4" />
      case "High":
        return <Activity className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{events.length} events loaded</p>
        <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)}>
          {isPaused ? "Resume" : "Pause"} Feed
        </Button>
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50"
          >
            <div className="flex-shrink-0 pt-1">{getSeverityIcon(event.severity)}</div>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getSeverityColor(event.severity) as any}>{event.severity}</Badge>
                    <span className="text-sm font-medium">{event.type}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">{event.timestamp}</span>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="font-mono">
                  {event.source} → {event.destination}
                </span>
                <span>•</span>
                <span>{event.details.protocol}</span>
                <span>•</span>
                <span>Port {event.details.port}</span>
              </div>

              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Eye className="mr-2 h-3 w-3" />
                      View Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Event Details</DialogTitle>
                      <DialogDescription>Complete information about this security event</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium">Event ID</p>
                          <p className="text-sm text-muted-foreground font-mono">{event.id}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Timestamp</p>
                          <p className="text-sm text-muted-foreground">{event.timestamp}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Severity</p>
                          <Badge variant={getSeverityColor(event.severity) as any}>{event.severity}</Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Type</p>
                          <p className="text-sm text-muted-foreground">{event.type}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Source IP</p>
                          <p className="text-sm text-muted-foreground font-mono">{event.source}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Destination IP</p>
                          <p className="text-sm text-muted-foreground font-mono">{event.destination}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Protocol</p>
                          <p className="text-sm text-muted-foreground">{event.details.protocol}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Port</p>
                          <p className="text-sm text-muted-foreground">{event.details.port}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Action Taken</p>
                          <Badge variant={event.details.action === "Blocked" ? "destructive" : "secondary"}>
                            {event.details.action}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Signature</p>
                          <p className="text-sm text-muted-foreground font-mono">{event.details.signature}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Description</p>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="sm">
                  Create Incident
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
