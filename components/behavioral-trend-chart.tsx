"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"
import { TrendingUp, Users, Brain } from "lucide-react"

interface TrendData {
  time: string
  intentDrift: number
  semanticAnomaly: number
  behaviorDeviation: number
  userCount: number
}

export function BehavioralTrendChart() {
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [selectedMetric, setSelectedMetric] = useState<"all" | "intent" | "semantic" | "behavior">("all")

  useEffect(() => {
    // Initialize with 24 hours of data
    const initialData: TrendData[] = []
    for (let i = 23; i >= 0; i--) {
      const hour = new Date()
      hour.setHours(hour.getHours() - i)
      initialData.push({
        time: hour.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        intentDrift: Math.random() * 40 + 10,
        semanticAnomaly: Math.random() * 30 + 5,
        behaviorDeviation: Math.random() * 35 + 15,
        userCount: Math.floor(Math.random() * 500) + 100,
      })
    }
    setTrendData(initialData)

    // Update data in real-time
    const interval = setInterval(() => {
      setTrendData((prev) => {
        const newData = [...prev.slice(1)]
        const lastPoint = prev[prev.length - 1]
        const now = new Date()
        newData.push({
          time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          intentDrift: Math.max(0, Math.min(100, lastPoint.intentDrift + (Math.random() - 0.5) * 10)),
          semanticAnomaly: Math.max(0, Math.min(100, lastPoint.semanticAnomaly + (Math.random() - 0.5) * 8)),
          behaviorDeviation: Math.max(0, Math.min(100, lastPoint.behaviorDeviation + (Math.random() - 0.5) * 12)),
          userCount: Math.max(0, lastPoint.userCount + Math.floor((Math.random() - 0.5) * 50)),
        })
        return newData
      })
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const metrics = [
    { key: "all", label: "All Metrics", icon: Brain },
    { key: "intent", label: "Intent Drift", icon: TrendingUp },
    { key: "semantic", label: "Semantic Anomaly", icon: Brain },
    { key: "behavior", label: "Behavior Deviation", icon: Users },
  ]

  return (
    <Card className="border-none bg-white/5 backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-white">
              <TrendingUp className="h-5 w-5 text-blue-400" />
              Behavioral Trend Analysis
            </CardTitle>
            <p className="text-sm text-gray-400 mt-1">User intent drift and anomaly patterns over time</p>
          </div>
          <div className="flex gap-2">
            {metrics.map((metric) => {
              const Icon = metric.icon
              return (
                <button
                  key={metric.key}
                  onClick={() => setSelectedMetric(metric.key as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedMetric === metric.key
                      ? "bg-blue-500 text-white"
                      : "bg-white/10 text-gray-400 hover:bg-white/20"
                  }`}
                >
                  <Icon className="h-3 w-3 inline mr-1" />
                  {metric.label}
                </button>
              )
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="intentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="semanticGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="behaviorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "1px solid #374151",
                borderRadius: "8px",
                color: "#fff",
              }}
            />
            <Legend />
            {(selectedMetric === "all" || selectedMetric === "intent") && (
              <Area
                type="monotone"
                dataKey="intentDrift"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#intentGradient)"
                name="Intent Drift %"
              />
            )}
            {(selectedMetric === "all" || selectedMetric === "semantic") && (
              <Area
                type="monotone"
                dataKey="semanticAnomaly"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#semanticGradient)"
                name="Semantic Anomaly %"
              />
            )}
            {(selectedMetric === "all" || selectedMetric === "behavior") && (
              <Area
                type="monotone"
                dataKey="behaviorDeviation"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#behaviorGradient)"
                name="Behavior Deviation %"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>

        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
            <div className="text-xs text-gray-400">Avg Intent Drift</div>
            <div className="text-2xl font-bold text-blue-400">
              {(trendData.reduce((sum, d) => sum + d.intentDrift, 0) / trendData.length || 0).toFixed(1)}%
            </div>
          </div>
          <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
            <div className="text-xs text-gray-400">Avg Semantic Anomaly</div>
            <div className="text-2xl font-bold text-purple-400">
              {(trendData.reduce((sum, d) => sum + d.semanticAnomaly, 0) / trendData.length || 0).toFixed(1)}%
            </div>
          </div>
          <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
            <div className="text-xs text-gray-400">Avg Behavior Deviation</div>
            <div className="text-2xl font-bold text-green-400">
              {(trendData.reduce((sum, d) => sum + d.behaviorDeviation, 0) / trendData.length || 0).toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
