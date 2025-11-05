"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertsTable } from "@/components/alerts-table"
import { useRealtimeData } from "@/hooks/use-realtime-data"
import { Shield, Activity, AlertTriangle, CheckCircle, TrendingUp, Clock } from "lucide-react"
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts"
import { useEffect, useState } from "react"

export default function AlertsPage() {
  const { metrics } = useRealtimeData()

  const [trendData, setTrendData] = useState([
    { time: "10:00", critical: 12, high: 28, medium: 45, low: 18 },
    { time: "10:30", critical: 15, high: 32, medium: 38, low: 22 },
    { time: "11:00", critical: 18, high: 35, medium: 42, low: 19 },
    { time: "11:30", critical: 14, high: 30, medium: 40, low: 25 },
    { time: "12:00", critical: 20, high: 38, medium: 48, low: 20 },
    { time: "12:30", critical: 16, high: 25, medium: 35, low: 15 },
    { time: "13:00", critical: 10, high: 22, medium: 30, low: 12 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setTrendData((prev) => {
        const newData = [...prev.slice(1)]
        const now = new Date()
        const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`

        newData.push({
          time: timeStr,
          critical: Math.floor(Math.random() * 15) + 8,
          high: Math.floor(Math.random() * 20) + 20,
          medium: Math.floor(Math.random() * 25) + 30,
          low: Math.floor(Math.random() * 15) + 10,
        })

        return newData
      })
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const totalAlerts = metrics?.totalAlerts || 1287
  const criticalAlerts = Math.floor(totalAlerts * 0.15)
  const highAlerts = Math.floor(totalAlerts * 0.35)
  const mediumAlerts = Math.floor(totalAlerts * 0.35)
  const lowAlerts = totalAlerts - criticalAlerts - highAlerts - mediumAlerts

  const severityData = [
    {
      name: "Critical",
      value: criticalAlerts,
      color: "#dc2626",
      percentage: ((criticalAlerts / totalAlerts) * 100).toFixed(1),
    },
    {
      name: "High",
      value: highAlerts,
      color: "#ea580c",
      percentage: ((highAlerts / totalAlerts) * 100).toFixed(1),
    },
    {
      name: "Medium",
      value: mediumAlerts,
      color: "#f59e0b",
      percentage: ((mediumAlerts / totalAlerts) * 100).toFixed(1),
    },
    {
      name: "Low",
      value: lowAlerts,
      color: "#84cc16",
      percentage: ((lowAlerts / totalAlerts) * 100).toFixed(1),
    },
  ]

  const responseData = [
    { name: "Resolved", value: 892, color: "#22c55e" },
    { name: "In Progress", value: 245, color: "#3b82f6" },
    { name: "New", value: 150, color: "#f59e0b" },
  ]

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-cyan-400" />
              <h1 className="text-3xl font-bold text-white">Security Alerts</h1>
            </div>
            <p className="text-gray-400">Showing real-time security alerts and threat intelligence</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/10 rounded-lg">
                    <Shield className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">{totalAlerts}</div>
                    <div className="text-xs text-gray-400">Total Alerts</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-400">{criticalAlerts}</div>
                    <div className="text-xs text-gray-400">Critical</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-500/10 rounded-lg">
                    <Activity className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-400">{highAlerts}</div>
                    <div className="text-xs text-gray-400">High Severity</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400">892</div>
                    <div className="text-xs text-gray-400">Resolved</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">245</div>
                    <div className="text-xs text-gray-400">In Progress</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <Clock className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">1.2h</div>
                    <div className="text-xs text-gray-400">Avg Response</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 mb-6">
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-400" />
                  Alert Severity Distribution
                </CardTitle>
                <p className="text-sm text-gray-400">Live breakdown by severity level</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {severityData.map((item) => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full ring-2 ring-offset-2 ring-offset-[#1a1a1a]"
                            style={{ backgroundColor: item.color, ringColor: item.color + "40" }}
                          />
                          <span className="text-sm font-medium text-gray-200">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-gray-300">{item.value}</span>
                          <span className="text-xs text-gray-500 w-12 text-right">{item.percentage}%</span>
                        </div>
                      </div>
                      <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                          }}
                        >
                          <div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                            style={{ animationDuration: "2s" }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 mt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Total Active Alerts</span>
                      <span className="text-lg font-bold text-cyan-400">{totalAlerts}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Status */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-400" />
                  Response Status
                </CardTitle>
                <p className="text-sm text-gray-400">Alert resolution and response tracking</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {responseData.map((item) => (
                    <div key={item.name}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">{item.name}</span>
                        <span className="text-sm font-bold" style={{ color: item.color }}>
                          {item.value}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(item.value / totalAlerts) * 100}%`,
                            backgroundColor: item.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-gray-800">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Resolution Rate</span>
                      <span className="text-green-400 font-bold">69.3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-[#1a1a1a] border-gray-800 mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                    Alert Trends by Severity
                  </CardTitle>
                  <p className="text-sm text-gray-400 mt-1">Real-time alert volume over the last 3.5 hours</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-xs text-gray-400">Live Data</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                      padding: "12px",
                    }}
                    labelStyle={{ color: "#fff", fontWeight: "bold", marginBottom: "8px" }}
                    itemStyle={{ color: "#d1d5db", fontSize: "13px" }}
                  />
                  <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="line" />
                  <Line
                    type="monotone"
                    dataKey="critical"
                    stroke="#dc2626"
                    strokeWidth={2.5}
                    dot={{ fill: "#dc2626", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Critical"
                  />
                  <Line
                    type="monotone"
                    dataKey="high"
                    stroke="#ea580c"
                    strokeWidth={2.5}
                    dot={{ fill: "#ea580c", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="High"
                  />
                  <Line
                    type="monotone"
                    dataKey="medium"
                    stroke="#f59e0b"
                    strokeWidth={2.5}
                    dot={{ fill: "#f59e0b", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Medium"
                  />
                  <Line
                    type="monotone"
                    dataKey="low"
                    stroke="#84cc16"
                    strokeWidth={2.5}
                    dot={{ fill: "#84cc16", r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Low"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Active Alerts Table */}
          <Card className="bg-[#1a1a1a] border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Active Security Alerts</CardTitle>
              <p className="text-sm text-gray-400">Real-time monitoring of security events and threats</p>
            </CardHeader>
            <CardContent>
              <AlertsTable />
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
