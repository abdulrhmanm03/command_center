"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from "recharts"
import { Download } from "lucide-react"

const generateTimelineData = () => {
  const data = []
  const now = Date.now()
  for (let i = 0; i < 168; i++) {
    // 7 days of hourly data
    const timestamp = now - (168 - i) * 60 * 60 * 1000
    data.push({
      time: new Date(timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit" }),
      timestamp,
      critical: Math.floor(Math.random() * 15) + 5,
      high: Math.floor(Math.random() * 30) + 20,
      medium: Math.floor(Math.random() * 50) + 30,
      low: Math.floor(Math.random() * 40) + 20,
      total: 0,
    })
  }
  data.forEach((d) => {
    d.total = d.critical + d.high + d.medium + d.low
  })
  return data
}

export function InteractiveThreatTimeline() {
  const [data] = useState(generateTimelineData())
  const [selectedPoint, setSelectedPoint] = useState<any>(null)
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d">("7d")
  const [showCritical, setShowCritical] = useState(true)
  const [showHigh, setShowHigh] = useState(true)
  const [showMedium, setShowMedium] = useState(true)
  const [showLow, setShowLow] = useState(true)

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="rounded-lg border border-cyan-500/50 bg-black/90 p-3 shadow-lg">
          <div className="mb-2 text-sm font-semibold text-cyan-400">{data.time}</div>
          <div className="space-y-1">
            {showCritical && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-red-400">Critical:</span>
                <span className="font-mono text-sm font-bold text-red-400">{data.critical}</span>
              </div>
            )}
            {showHigh && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-orange-400">High:</span>
                <span className="font-mono text-sm font-bold text-orange-400">{data.high}</span>
              </div>
            )}
            {showMedium && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-yellow-400">Medium:</span>
                <span className="font-mono text-sm font-bold text-yellow-400">{data.medium}</span>
              </div>
            )}
            {showLow && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-blue-400">Low:</span>
                <span className="font-mono text-sm font-bold text-blue-400">{data.low}</span>
              </div>
            )}
            <div className="mt-2 border-t border-gray-700 pt-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs text-gray-400">Total:</span>
                <span className="font-mono text-sm font-bold text-cyan-400">{data.total}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  const handleExport = () => {
    const csv = [
      ["Time", "Critical", "High", "Medium", "Low", "Total"],
      ...data.map((d) => [d.time, d.critical, d.high, d.medium, d.low, d.total]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `threat-timeline-${Date.now()}.csv`
    a.click()
  }

  return (
    <Card className="border-accent/30 bg-card">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-cyan-400">Interactive Threat Timeline</CardTitle>
            <p className="mt-1 text-sm text-gray-400">Click and drag to zoom, click points for details</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-1 rounded-lg bg-secondary px-3 py-1 text-xs text-gray-300 hover:bg-secondary/80"
            >
              <Download className="h-3 w-3" />
              Export
            </button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Filter Controls */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400">Show:</span>
          <button
            onClick={() => setShowCritical(!showCritical)}
            className={`rounded px-2 py-1 text-xs transition-all ${
              showCritical ? "bg-red-500/20 text-red-400" : "bg-secondary text-gray-500"
            }`}
          >
            Critical
          </button>
          <button
            onClick={() => setShowHigh(!showHigh)}
            className={`rounded px-2 py-1 text-xs transition-all ${
              showHigh ? "bg-orange-500/20 text-orange-400" : "bg-secondary text-gray-500"
            }`}
          >
            High
          </button>
          <button
            onClick={() => setShowMedium(!showMedium)}
            className={`rounded px-2 py-1 text-xs transition-all ${
              showMedium ? "bg-yellow-500/20 text-yellow-400" : "bg-secondary text-gray-500"
            }`}
          >
            Medium
          </button>
          <button
            onClick={() => setShowLow(!showLow)}
            className={`rounded px-2 py-1 text-xs transition-all ${
              showLow ? "bg-blue-500/20 text-blue-400" : "bg-secondary text-gray-500"
            }`}
          >
            Low
          </button>
        </div>

        {/* Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} onClick={(e) => e && e.activePayload && setSelectedPoint(e.activePayload[0].payload)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="time" stroke="#666" tick={{ fontSize: 10 }} interval={23} />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            {showCritical && <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} dot={false} />}
            {showHigh && <Line type="monotone" dataKey="high" stroke="#f97316" strokeWidth={2} dot={false} />}
            {showMedium && <Line type="monotone" dataKey="medium" stroke="#fbbf24" strokeWidth={2} dot={false} />}
            {showLow && <Line type="monotone" dataKey="low" stroke="#3b82f6" strokeWidth={2} dot={false} />}
            <Brush dataKey="time" height={30} stroke="#06b6d4" fill="#0a0a0a" />
          </LineChart>
        </ResponsiveContainer>

        {/* Selected Point Details */}
        {selectedPoint && (
          <div className="mt-4 rounded-lg border border-cyan-500/30 bg-secondary/50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <h4 className="font-semibold text-cyan-400">Selected Time Point</h4>
              <button onClick={() => setSelectedPoint(null)} className="text-xs text-gray-400 hover:text-gray-300">
                Clear
              </button>
            </div>
            <div className="grid grid-cols-5 gap-4">
              <div>
                <div className="text-xs text-gray-400">Time</div>
                <div className="font-mono text-sm text-white">{selectedPoint.time}</div>
              </div>
              <div>
                <div className="text-xs text-red-400">Critical</div>
                <div className="font-mono text-xl font-bold text-red-400">{selectedPoint.critical}</div>
              </div>
              <div>
                <div className="text-xs text-orange-400">High</div>
                <div className="font-mono text-xl font-bold text-orange-400">{selectedPoint.high}</div>
              </div>
              <div>
                <div className="text-xs text-yellow-400">Medium</div>
                <div className="font-mono text-xl font-bold text-yellow-400">{selectedPoint.medium}</div>
              </div>
              <div>
                <div className="text-xs text-blue-400">Low</div>
                <div className="font-mono text-xl font-bold text-blue-400">{selectedPoint.low}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
