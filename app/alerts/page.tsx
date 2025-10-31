"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertsTable } from "@/components/alerts-table"
import { useRealtimeData } from "@/hooks/use-realtime-data"
import { Shield, Activity, AlertTriangle, CheckCircle, TrendingUp, Clock } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts"

export default function AlertsPage() {
  const { metrics } = useRealtimeData()

  const totalAlerts = metrics?.totalAlerts || 1287
  const criticalAlerts = Math.floor(totalAlerts * 0.15)
  const highAlerts = Math.floor(totalAlerts * 0.35)
  const mediumAlerts = Math.floor(totalAlerts * 0.35)
  const lowAlerts = totalAlerts - criticalAlerts - highAlerts - mediumAlerts

  const severityData = [
    { name: "Critical", value: criticalAlerts, color: "#dc2626" },
    { name: "High", value: highAlerts, color: "#ea580c" },
    { name: "Medium", value: mediumAlerts, color: "#f59e0b" },
    { name: "Low", value: lowAlerts, color: "#84cc16" },
  ]

  const trendData = [
    { day: "Mon", critical: 12, high: 28, medium: 45, low: 18 },
    { day: "Tue", critical: 15, high: 32, medium: 38, low: 22 },
    { day: "Wed", critical: 18, high: 35, medium: 42, low: 19 },
    { day: "Thu", critical: 14, high: 30, medium: 40, low: 25 },
    { day: "Fri", critical: 20, high: 38, medium: 48, low: 20 },
    { day: "Sat", critical: 16, high: 25, medium: 35, low: 15 },
    { day: "Sun", critical: 10, high: 22, medium: 30, low: 12 },
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
            {/* Alert Severity Distribution */}
            <Card className="bg-[#1a1a1a] border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cyan-400" />
                  Alert Severity Distribution
                </CardTitle>
                <p className="text-sm text-gray-400">Current alert breakdown by severity level</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <ResponsiveContainer width="50%" height={200}>
                    <PieChart>
                      <Pie
                        data={severityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {severityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {severityData.map((item) => (
                      <div key={item.name} className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <div className="flex-1">
                          <div className="text-sm text-gray-300">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.value} alerts</div>
                        </div>
                      </div>
                    ))}
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

          {/* Alert Trends */}
          <Card className="bg-[#1a1a1a] border-gray-800 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-cyan-400" />
                Alert Trends by Severity
              </CardTitle>
              <p className="text-sm text-gray-400">7-day alert volume and severity distribution</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={trendData}>
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #374151" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Bar dataKey="critical" stackId="a" fill="#dc2626" name="Critical" />
                  <Bar dataKey="high" stackId="a" fill="#ea580c" name="High" />
                  <Bar dataKey="medium" stackId="a" fill="#f59e0b" name="Medium" />
                  <Bar dataKey="low" stackId="a" fill="#84cc16" name="Low" />
                </BarChart>
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
