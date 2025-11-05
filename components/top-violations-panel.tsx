"use client"

import { useState, useEffect } from "react"
import { AlertCircle, FileWarning, Shield, Activity } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Violation {
  id: string
  name: string
  description: string
  daysAgo: number
  date: string
  violators: number
  icon: "alert" | "file" | "shield" | "activity"
}

const VIOLATION_ICONS = {
  alert: AlertCircle,
  file: FileWarning,
  shield: Shield,
  activity: Activity,
}

export function TopViolationsPanel() {
  const [violations, setViolations] = useState<Violation[]>([])

  useEffect(() => {
    const generateViolations = (): Violation[] => {
      const violationTypes = [
        {
          name: "Communication from TOR Exit Nodes to AWS",
          description: "Suspicious network traffic",
          icon: "alert" as const,
        },
        {
          name: "Log Tampering AWS",
          description: "Audit Log Tampering",
          icon: "file" as const,
        },
        {
          name: "High number of EC2 instances spawned in a short time AWS",
          description: "Authentication From Rare Geolocation",
          icon: "shield" as const,
        },
        {
          name: "Self Privilege Escalation AWS",
          description: "Unauthorized privilege elevation detected",
          icon: "activity" as const,
        },
      ]

      return violationTypes.map((violation, index) => ({
        id: `violation-${index}`,
        ...violation,
        daysAgo: 114 + Math.floor(Math.random() * 50),
        date: new Date(Date.now() - (114 + Math.floor(Math.random() * 50)) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        violators: Math.floor(Math.random() * 377) + 1,
      }))
    }

    setViolations(generateViolations())
    const interval = setInterval(() => {
      setViolations(generateViolations())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      {violations.map((violation) => {
        const Icon = VIOLATION_ICONS[violation.icon]
        return (
          <div
            key={violation.id}
            className="flex gap-3 p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <Icon className="h-5 w-5 text-yellow-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-semibold text-sm text-yellow-400 line-clamp-2">{violation.name}</h4>
                <Badge variant="outline" className="text-xs border-yellow-500/30 text-yellow-400 flex-shrink-0">
                  {violation.violators}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{violation.description}</p>
              <div className="text-xs text-muted-foreground">
                {violation.daysAgo} Days Ago • {violation.date}
              </div>
            </div>
          </div>
        )
      })}
      <div className="text-xs text-muted-foreground text-center pt-2">SHOWING {violations.length} OF 114 RECORDS</div>
    </div>
  )
}
