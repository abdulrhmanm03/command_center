"use client"

import { useState, useEffect } from "react"
import { Monitor } from "lucide-react"

interface Host {
  id: string
  hostname: string
  identifier: string
  riskScore: number
}

export function WatchlistedHostsPanel() {
  const [hosts, setHosts] = useState<Host[]>([])

  useEffect(() => {
    const generateHosts = (): Host[] => {
      const hostnames = ["WW3432", "WW5642", "WW1432"]

      return hostnames.map((hostname, index) => ({
        id: `host-${index}`,
        hostname,
        identifier: `${hostname} :`,
        riskScore: 0.2 + Math.random() * 0.1,
      }))
    }

    setHosts(generateHosts())
    const interval = setInterval(() => {
      setHosts(generateHosts())
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-3">
      {hosts.map((host) => (
        <div
          key={host.id}
          className="flex items-center gap-3 p-3 rounded-lg border border-pink-500/20 bg-pink-500/5 hover:bg-pink-500/10 transition-colors"
        >
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
              <Monitor className="h-5 w-5 text-pink-400" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h4 className="font-semibold text-sm text-pink-400">{host.hostname}</h4>
                <p className="text-xs text-muted-foreground">{host.identifier}</p>
                <p className="text-xs text-muted-foreground mt-1">APR 6</p>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-lg font-bold text-pink-400">{host.riskScore.toFixed(1)}</div>
                <div className="text-xs text-muted-foreground">RISK SCORE</div>
              </div>
            </div>
          </div>
        </div>
      ))}
      <div className="text-xs text-muted-foreground text-center pt-2">
        SHOWING {hosts.length} OF {hosts.length} RECORDS
      </div>
    </div>
  )
}
