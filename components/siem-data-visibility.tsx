"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRealtimeData } from "@/hooks/use-realtime-data"
import { Activity, Database, Zap, HardDrive, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import { useEffect, useState } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const DATA_SOURCES = [
  { name: "Firewall Logs", status: "healthy", eps: 12450, color: "#06b6d4" },
  { name: "EDR Agents", status: "healthy", eps: 8920, color: "#10b981" },
  { name: "Cloud Logs", status: "healthy", eps: 15680, color: "#8b5cf6" },
  { name: "Network IDS", status: "healthy", eps: 6340, color: "#f59e0b" },
  { name: "Email Gateway", status: "warning", eps: 3210, color: "#eab308" },
  { name: "Web Proxy", status: "healthy", eps: 9870, color: "#14b8a6" },
]

const EVENT_TYPES = [
  { name: "Authentication", value: 35, color: "#06b6d4" },
  { name: "Network", value: 28, color: "#8b5cf6" },
  { name: "File Access", value: 18, color: "#10b981" },
  { name: "Process", value: 12, color: "#f59e0b" },
  { name: "Registry", value: 7, color: "#ec4899" },
]

export function SiemDataVisibility() {
  const { isConnected } = useRealtimeData()
  const [logIngestionRate, setLogIngestionRate] = useState(56470)
  const [eventsProcessed, setEventsProcessed] = useState(3421890)
  const [correlationRate, setCorrelationRate] = useState(94.7)
  const [storageUsed, setStorageUsed] = useState(67.3)
  const [ingestionHistory, setIngestionHistory] = useState<Array<{ time: string; rate: number }>>([])

  useEffect(() => {
    // Initialize history
    const now = Date.now()
    const history = Array.from({ length: 20 }, (_, i) => ({
      time: new Date(now - (19 - i) * 3000).toLocaleTimeString(),
      rate: 50000 + Math.random() * 15000,
    }))
    setIngestionHistory(history)

    const interval = setInterval(() => {
      // Update metrics with realistic variations
      setLogIngestionRate((prev) => Math.max(45000, Math.min(70000, prev + (Math.random() - 0.5) * 2000)))
      setEventsProcessed((prev) => prev + Math.floor(Math.random() * 500 + 100))
      setCorrelationRate((prev) => Math.max(90, Math.min(99, prev + (Math.random() - 0.5) * 0.5)))
      setStorageUsed((prev) => Math.min(95, prev + Math.random() * 0.01))

      // Update history
      setIngestionHistory((prev) => {
        const newHistory = [
          ...prev.slice(1),
          {
            time: new Date().toLocaleTimeString(),
            rate: 50000 + Math.random() * 15000,
          },
        ]
        return newHistory
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* SIEM Overview Header */}
      <Card className="border-cyan-500/30 bg-gradient-to-r from-cyan-950/20 to-blue-950/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-cyan-400 flex items-center gap-2">
                <Database className="h-6 w-6" />
                SIEM Data Visibility & Processing
              </CardTitle>
              <p className="text-sm text-gray-400 mt-1">
                Real-time log ingestion, event correlation, and data source monitoring
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-3 w-3 rounded-full ${isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
              <span className="text-sm text-gray-400">{isConnected ? "Live" : "Disconnected"}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Key SIEM Metrics */}
      <div className="grid gap-4 grid-cols-4">
        <Card className="border-cyan-500/20 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Log Ingestion Rate</p>
                <p className="text-3xl font-bold text-cyan-400 mt-2">{logIngestionRate.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">events/sec</p>
              </div>
              <Activity className="h-10 w-10 text-cyan-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-500/20 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Events Processed</p>
                <p className="text-3xl font-bold text-purple-400 mt-2">{(eventsProcessed / 1000000).toFixed(2)}M</p>
                <p className="text-xs text-gray-500 mt-1">last 24 hours</p>
              </div>
              <Zap className="h-10 w-10 text-purple-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/20 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Correlation Rate</p>
                <p className="text-3xl font-bold text-green-400 mt-2">{correlationRate.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">event correlation</p>
              </div>
              <CheckCircle2 className="h-10 w-10 text-green-400 opacity-50" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/20 bg-card/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Storage Used</p>
                <p className="text-3xl font-bold text-orange-400 mt-2">{storageUsed.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">of 50TB capacity</p>
              </div>
              <HardDrive className="h-10 w-10 text-orange-400 opacity-50" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources and Event Types */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Data Source Health */}
        <Card className="border-cyan-500/20">
          <CardHeader>
            <CardTitle className="text-cyan-400 flex items-center gap-2">
              <Database className="h-5 w-5" />
              Data Source Health & EPS
            </CardTitle>
            <p className="text-sm text-gray-400">Real-time events per second by source</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DATA_SOURCES.map((source) => (
                <div key={source.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {source.status === "healthy" ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      )}
                      <span className="text-sm text-gray-300">{source.name}</span>
                    </div>
                    <span className="text-sm font-mono" style={{ color: source.color }}>
                      {source.eps.toLocaleString()} EPS
                    </span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(source.eps / 16000) * 100}%`,
                        backgroundColor: source.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Event Type Distribution */}
        <Card className="border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-purple-400 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Event Type Distribution
            </CardTitle>
            <p className="text-sm text-gray-400">Breakdown of ingested event categories</p>
          </CardHeader>
          <CardContent>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={EVENT_TYPES}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {EVENT_TYPES.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #333",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {EVENT_TYPES.map((type) => (
                <div key={type.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: type.color }} />
                  <span className="text-xs text-gray-400">
                    {type.name} ({type.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Real-time Ingestion Rate Chart */}
      <Card className="border-cyan-500/20">
        <CardHeader>
          <CardTitle className="text-cyan-400 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Real-time Log Ingestion Rate
          </CardTitle>
          <p className="text-sm text-gray-400">Live events per second over the last 60 seconds</p>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ingestionHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="time" stroke="#666" tick={{ fill: "#999", fontSize: 10 }} interval="preserveStartEnd" />
                <YAxis
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 12 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} EPS`, "Rate"]}
                />
                <Line
                  type="monotone"
                  dataKey="rate"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={300}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
