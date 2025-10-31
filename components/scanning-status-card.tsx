"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Pause, Play } from "lucide-react"
import { useState, useEffect } from "react"

interface ScanningStatusCardProps {
  activeScans: number
  totalDevices: number
  lastCompleted: string
  nextScan: string
  status: string
}

export function ScanningStatusCard({
  activeScans,
  totalDevices,
  lastCompleted,
  nextScan,
  status: initialStatus,
}: ScanningStatusCardProps) {
  const [status, setStatus] = useState(initialStatus)
  const [timeUntilNext, setTimeUntilNext] = useState("")

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const next = new Date(nextScan)
      const diff = next.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeUntilNext("Starting...")
        return
      }

      const minutes = Math.floor(diff / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeUntilNext(`${minutes}m ${seconds}s`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [nextScan])

  const getTimeSince = (timestamp: string) => {
    const now = new Date()
    const past = new Date(timestamp)
    const diff = now.getTime() - past.getTime()
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes < 1) return "just now"
    if (minutes === 1) return "1 min ago"
    if (minutes < 60) return `${minutes} min ago`

    const hours = Math.floor(minutes / 60)
    if (hours === 1) return "1 hour ago"
    return `${hours} hours ago`
  }

  const toggleScan = async () => {
    const newStatus = status === "idle" ? "scanning" : "idle"
    setStatus(newStatus)

    // In production, call API to pause/resume scanning
    try {
      await fetch("/api/scanning/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: newStatus === "scanning" ? "resume" : "pause" }),
      })
    } catch (error) {
      console.error("Failed to toggle scan:", error)
    }
  }

  const progress = (activeScans / totalDevices) * 100

  return (
    <Card className="border-slate-700 bg-[#1a1a1a]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-lg text-gray-300">
          <span>Live Scanning Status</span>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleScan}
            className="border-slate-600 bg-transparent text-cyan-400 hover:bg-cyan-500/10"
          >
            {status === "idle" ? <Play className="mr-1 h-3 w-3" /> : <Pause className="mr-1 h-3 w-3" />}
            {status === "idle" ? "Resume" : "Pause"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Active Scans:</span>
          <span className="font-bold text-cyan-400">
            {activeScans} / {totalDevices} devices
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Last completed:</span>
            <p className="font-medium text-green-400">{getTimeSince(lastCompleted)}</p>
          </div>
          <div>
            <span className="text-gray-400">Next scan in:</span>
            <p className="font-medium text-blue-400">{timeUntilNext}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
