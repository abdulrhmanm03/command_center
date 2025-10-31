"use client"

import { useRealtimeData } from "@/hooks/use-realtime-data"
import { useEffect, useState } from "react"

export function LiveMetricsDisplay() {
  const { metrics, isConnected } = useRealtimeData()
  const [time, setTime] = useState(new Date().toLocaleTimeString())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="mb-6 flex items-center justify-between rounded-lg border border-accent/30 bg-card px-4 py-2">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${isConnected ? "bg-[#10b981] animate-pulse-glow" : "bg-red-500"}`} />
          <span className={`text-sm font-medium ${isConnected ? "text-[#10b981]" : "text-red-500"}`}>
            {isConnected ? "Live" : "Disconnected"}
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <span className="text-sm text-[#06b6d4] font-mono">
          {metrics?.eventsPerMin.toLocaleString() || "2,472"} events/min
        </span>
        <div className="h-4 w-px bg-border" />
        <span className="text-xs text-gray-400 font-mono">{time}</span>
      </div>
      <button className="rounded bg-secondary px-3 py-1 text-xs font-medium text-gray-300 hover:bg-secondary/80 transition-colors">
        Pause Live Feed
      </button>
    </div>
  )
}
