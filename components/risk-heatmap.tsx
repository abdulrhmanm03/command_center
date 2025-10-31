"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Activity } from "lucide-react"

interface HeatmapCell {
  category: string
  timeSlot: string
  riskScore: number
  incidents: number
}

export function RiskHeatmap() {
  const [heatmapData, setHeatmapData] = useState<HeatmapCell[]>([])
  const categories = ["Prompt Injection", "Jailbreak", "PII Leakage", "Data Poisoning", "Model Abuse"]
  const timeSlots = ["00-04", "04-08", "08-12", "12-16", "16-20", "20-24"]

  useEffect(() => {
    // Initialize heatmap data
    const initialData: HeatmapCell[] = []
    categories.forEach((category) => {
      timeSlots.forEach((timeSlot) => {
        initialData.push({
          category,
          timeSlot,
          riskScore: Math.random() * 100,
          incidents: Math.floor(Math.random() * 20),
        })
      })
    })
    setHeatmapData(initialData)

    // Update heatmap in real-time
    const interval = setInterval(() => {
      setHeatmapData((prev) =>
        prev.map((cell) => ({
          ...cell,
          riskScore: Math.max(0, Math.min(100, cell.riskScore + (Math.random() - 0.5) * 10)),
          incidents: Math.max(0, cell.incidents + (Math.random() > 0.7 ? 1 : 0)),
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getRiskColor = (score: number) => {
    if (score >= 80) return "bg-red-500/90"
    if (score >= 60) return "bg-orange-500/90"
    if (score >= 40) return "bg-yellow-500/90"
    if (score >= 20) return "bg-blue-500/90"
    return "bg-green-500/90"
  }

  const getRiskLabel = (score: number) => {
    if (score >= 80) return "Critical"
    if (score >= 60) return "High"
    if (score >= 40) return "Medium"
    if (score >= 20) return "Low"
    return "Minimal"
  }

  return (
    <Card className="border-none bg-white/5 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Activity className="h-5 w-5 text-red-400" />
          Real-Time Risk Heatmap
        </CardTitle>
        <p className="text-sm text-gray-400">Semantic anomaly scores across threat categories</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Legend */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>Risk Level:</span>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500/90 rounded" />
              <span>Minimal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500/90 rounded" />
              <span>Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500/90 rounded" />
              <span>Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500/90 rounded" />
              <span>High</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500/90 rounded" />
              <span>Critical</span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              {/* Time slot headers */}
              <div className="flex gap-1 mb-1 ml-32">
                {timeSlots.map((slot) => (
                  <div key={slot} className="w-16 text-center text-xs text-gray-400">
                    {slot}
                  </div>
                ))}
              </div>

              {/* Heatmap rows */}
              {categories.map((category) => (
                <div key={category} className="flex items-center gap-1 mb-1">
                  <div className="w-32 text-xs text-gray-300 truncate">{category}</div>
                  {timeSlots.map((timeSlot) => {
                    const cell = heatmapData.find((c) => c.category === category && c.timeSlot === timeSlot)
                    if (!cell) return null
                    return (
                      <div
                        key={`${category}-${timeSlot}`}
                        className={`w-16 h-12 ${getRiskColor(cell.riskScore)} rounded flex flex-col items-center justify-center cursor-pointer hover:scale-110 transition-transform group relative`}
                        title={`${category} (${timeSlot}): ${getRiskLabel(cell.riskScore)} - ${cell.riskScore.toFixed(1)}% risk, ${cell.incidents} incidents`}
                      >
                        <span className="text-xs font-bold text-white">{cell.riskScore.toFixed(0)}</span>
                        <span className="text-[10px] text-white/80">{cell.incidents}</span>

                        {/* Tooltip */}
                        <div className="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                          <div className="font-semibold">{getRiskLabel(cell.riskScore)}</div>
                          <div>Score: {cell.riskScore.toFixed(1)}%</div>
                          <div>Incidents: {cell.incidents}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
