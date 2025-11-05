"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, Shield, Lock, Database } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Threat {
  id: string
  name: string
  description: string
  daysAgo: number
  date: string
  violators: number
  icon: "alert" | "shield" | "lock" | "database"
}

const THREAT_ICONS = {
  alert: AlertTriangle,
  shield: Shield,
  lock: Lock,
  database: Database,
}

export function TopThreatsPanel() {
  const [threats, setThreats] = useState<Threat[]>([])

  useEffect(() => {
    const generateThreats = (): Threat[] => {
      const threatTypes = [
        {
          name: "Possible Cryptojacking Observed AWS",
          description:
            "This threat model aims to identify possible unauthorized use of assets to mine cryptocurrencies.",
          icon: "alert" as const,
        },
        {
          name: "Patient Data Compromise",
          description:
            "This threat model aims to identify unauthorized activities associated with patient data which could be exfiltrated.",
          icon: "database" as const,
        },
        {
          name: "Privileged IT User-Sabotage",
          description:
            "This threat model aims to identify users who misuse their privileges to create short lived or backdoor accounts to perform malicious activity.",
          icon: "lock" as const,
        },
        {
          name: "Advanced Cyber Threat",
          description:
            "This threat model aims to identify successful exploitation of vulnerabilities and lateral movement patterns.",
          icon: "shield" as const,
        },
      ]

      return threatTypes.map((threat, index) => ({
        id: `threat-${index}`,
        ...threat,
        daysAgo: 114 + Math.floor(Math.random() * 150),
        date: new Date(Date.now() - (114 + Math.floor(Math.random() * 150)) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        violators: Math.floor(Math.random() * 3) + 1,
      }))
    }

    setThreats(generateThreats())
    const interval = setInterval(() => {
      setThreats(generateThreats())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      {threats.map((threat) => {
        const Icon = THREAT_ICONS[threat.icon]
        return (
          <div
            key={threat.id}
            className="flex gap-3 p-3 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <Icon className="h-5 w-5 text-red-400" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-semibold text-sm text-red-400">{threat.name}</h4>
                <Badge variant="outline" className="text-xs border-red-500/30 text-red-400 flex-shrink-0">
                  {threat.violators} {threat.violators === 1 ? "violator" : "violators"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{threat.description}</p>
              <div className="text-xs text-muted-foreground">
                {threat.daysAgo} Days Ago • {threat.date}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
