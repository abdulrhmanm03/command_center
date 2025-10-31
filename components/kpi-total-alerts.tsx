"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp } from "lucide-react"
import { useRealtimeData } from "@/hooks/use-realtime-data"
import { useEffect, useState } from "react"

const data = [
  { name: "Resolved", value: 856, color: "#10b981" },
  { name: "In Progress", value: 324, color: "#fbbf24" },
  { name: "New", value: 107, color: "#ef4444" },
]

export function KpiTotalAlerts() {
  const { metrics } = useRealtimeData()
  const [displayValue, setDisplayValue] = useState(1287)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (metrics?.totalAlerts && metrics.totalAlerts !== displayValue) {
      setIsAnimating(true)
      const start = displayValue
      const end = metrics.totalAlerts
      const duration = 1000
      const startTime = Date.now()

      const animate = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / duration, 1)
        const current = Math.floor(start + (end - start) * progress)
        setDisplayValue(current)

        if (progress < 1) {
          requestAnimationFrame(animate)
        } else {
          setIsAnimating(false)
        }
      }

      requestAnimationFrame(animate)
    }
  }, [metrics?.totalAlerts])

  return (
    <Card className="border-accent/30 bg-card hover:border-cyan-500/50 transition-all cursor-pointer group">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-gray-400">Total Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div
              className={`text-3xl font-bold text-[#06b6d4] group-hover:text-[#22d3ee] transition-all ${
                isAnimating ? "scale-110" : ""
              }`}
            >
              {displayValue.toLocaleString()}
            </div>
            <div className="mt-1 flex items-center text-xs text-[#10b981]">
              <TrendingUp className="mr-1 h-3 w-3" />
              <span>+1% from last week</span>
            </div>
          </div>
          <div className="h-20 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={20} outerRadius={35} paddingAngle={2} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #06b6d4",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "#06b6d4" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
