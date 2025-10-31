"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, TrendingUp, TrendingDown, Minus, Shield, Activity, RefreshCw, ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function RiskAnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    const res = await fetch("/api/risk-analytics")
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !data) {
    return (
      <div className="flex h-screen">
        <SidebarNav />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-yellow-400" />
            <p className="mt-2 text-muted-foreground">Loading risk analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  const CircularProgress = ({ value, size = 80, strokeWidth = 8, color = "text-yellow-400" }: any) => {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (value / 100) * circumference

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="rotate-[-90deg]" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-800"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={color}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-xl font-bold ${color}`}>{value}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-yellow-400">Risk Analytics</h1>
              <p className="text-gray-400">Quantitative risk assessment and modeling</p>
            </div>
            <Button
              onClick={fetchData}
              variant="outline"
              size="sm"
              className="gap-2 border-yellow-400/30 bg-transparent hover:bg-yellow-400/10"
            >
              <RefreshCw className="h-4 w-4 text-yellow-400" />
              <span className="text-yellow-400">Recalculate</span>
            </Button>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card className="border-yellow-500/20 bg-[#1a1a1a] overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" />
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Critical Assets</p>
                    <p className="text-3xl font-bold text-white">{data.summary.criticalAssets}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
                <Badge variant="destructive" className="mb-2 text-xs">
                  High
                </Badge>
                <p className="text-xs text-gray-500">Domain controllers, financial systems</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/20 bg-[#1a1a1a] overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" />
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Network Exposure</p>
                    <p className="text-3xl font-bold text-white">{data.summary.networkExposure}</p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-400" />
                </div>
                <Badge variant="outline" className="mb-2 border-orange-500 text-orange-400 text-xs">
                  Medium
                </Badge>
                <p className="text-xs text-gray-500">Internet-facing services</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/20 bg-[#1a1a1a] overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" />
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">User Behavior</p>
                    <p className="text-3xl font-bold text-white">{data.summary.userBehavior}</p>
                  </div>
                  <Shield className="h-8 w-8 text-yellow-400" />
                </div>
                <Badge variant="outline" className="mb-2 border-yellow-500 text-yellow-400 text-xs">
                  Medium
                </Badge>
                <p className="text-xs text-gray-500">Privileged account activity</p>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/20 bg-[#1a1a1a] overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" />
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Vulnerability Exposure</p>
                    <p className="text-3xl font-bold text-white">{data.summary.vulnerabilityExposure}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
                <Badge variant="destructive" className="mb-2 text-xs">
                  Critical
                </Badge>
                <p className="text-xs text-gray-500">Unpatched critical vulnerabilities</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="scenarios" className="space-y-6">
            <TabsList className="bg-[#1a1a1a] border border-yellow-400/20">
              <TabsTrigger
                value="scenarios"
                className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400"
              >
                Risk Scenarios
              </TabsTrigger>
              <TabsTrigger
                value="assets"
                className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400"
              >
                Asset Risk
              </TabsTrigger>
              <TabsTrigger
                value="trends"
                className="data-[state=active]:bg-yellow-400/20 data-[state=active]:text-yellow-400"
              >
                Risk Trends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="scenarios" className="space-y-4">
              <div className="grid gap-4 lg:grid-cols-2">
                {data.scenarios.map((scenario: any) => (
                  <Card key={scenario.id} className="border-yellow-500/20 bg-[#1a1a1a] overflow-hidden">
                    <div className="h-20 bg-gradient-to-br from-yellow-400/30 via-yellow-500/20 to-transparent p-4 flex items-center justify-between">
                      <div>
                        <Badge
                          variant="outline"
                          className={
                            scenario.impact === "High"
                              ? "border-red-500 bg-red-500/20 text-red-400"
                              : "border-orange-500 bg-orange-500/20 text-orange-400"
                          }
                        >
                          {scenario.impact} Impact
                        </Badge>
                      </div>
                      {scenario.trend === "increasing" ? (
                        <TrendingUp className="h-5 w-5 text-red-400" />
                      ) : scenario.trend === "decreasing" ? (
                        <TrendingDown className="h-5 w-5 text-green-400" />
                      ) : (
                        <Minus className="h-5 w-5 text-yellow-400" />
                      )}
                    </div>
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-white mb-2">{scenario.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <span>Probability:</span>
                              <span className="font-bold text-yellow-400">{scenario.probability}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Assets:</span>
                              <span className="font-bold text-orange-400">{scenario.affectedAssets}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span>Loss:</span>
                              <span className="font-bold text-red-400">{scenario.estimatedLoss}</span>
                            </div>
                          </div>
                        </div>
                        <CircularProgress
                          value={Math.round(scenario.riskScore * 10)}
                          size={70}
                          strokeWidth={6}
                          color={
                            scenario.riskScore > 8
                              ? "text-red-400"
                              : scenario.riskScore > 6
                                ? "text-orange-400"
                                : "text-yellow-400"
                          }
                        />
                      </div>

                      <div className="rounded-lg bg-black/40 p-4 border border-yellow-400/10">
                        <p className="mb-2 text-xs font-medium text-yellow-400 flex items-center gap-2">
                          <Shield className="h-3 w-3" />
                          Key Mitigations
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {scenario.mitigations.map((mitigation: string) => (
                            <Badge key={mitigation} variant="secondary" className="bg-gray-800 text-gray-300 text-xs">
                              {mitigation}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="assets" className="space-y-4">
              <Card className="border-yellow-500/20 bg-[#1a1a1a]">
                <CardHeader className="border-b border-yellow-400/10">
                  <CardTitle className="text-yellow-400">Asset Risk Overview</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-800">
                    {data.assetRisks.map((asset: any, index: number) => (
                      <div key={asset.asset} className="p-6 hover:bg-yellow-400/5 transition-colors group">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="mb-3 flex items-center gap-3">
                              <h3 className="text-lg font-bold text-white">{asset.asset}</h3>
                              <Badge
                                variant={
                                  asset.category === "Critical"
                                    ? "destructive"
                                    : asset.category === "High"
                                      ? "default"
                                      : "secondary"
                                }
                                className={
                                  asset.category === "Critical"
                                    ? "bg-red-500/20 text-red-400 border-red-500"
                                    : asset.category === "High"
                                      ? "bg-orange-500/20 text-orange-400 border-orange-500"
                                      : ""
                                }
                              >
                                {asset.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="flex-1">
                                <p className="mb-2 text-xs text-gray-400">Risk Score</p>
                                <div className="flex items-center gap-3">
                                  <div className="h-2 flex-1 bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-yellow-400 to-red-400 transition-all"
                                      style={{ width: `${asset.score}%` }}
                                    />
                                  </div>
                                  <span className="text-lg font-bold text-yellow-400 min-w-[3ch]">{asset.score}</span>
                                </div>
                              </div>
                              <div className="text-center">
                                <p className="text-xs text-gray-400">Vulnerabilities</p>
                                <p className="text-2xl font-bold text-red-400">{asset.vulnerabilities}</p>
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-600 group-hover:text-yellow-400 transition-colors ml-4" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends">
              <Card className="border-yellow-500/20 bg-[#1a1a1a]">
                <CardHeader className="border-b border-yellow-400/10">
                  <CardTitle className="text-yellow-400">Risk Trend Analysis (30 Days)</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data.trendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="day" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid rgba(234, 179, 8, 0.2)",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Line type="monotone" dataKey="ransomware" stroke="#ef4444" strokeWidth={2} name="Ransomware" />
                      <Line type="monotone" dataKey="insider" stroke="#f59e0b" strokeWidth={2} name="Insider Threat" />
                      <Line
                        type="monotone"
                        dataKey="supplyChain"
                        stroke="#10b981"
                        strokeWidth={2}
                        name="Supply Chain"
                      />
                      <Line
                        type="monotone"
                        dataKey="dataExfil"
                        stroke="#eab308"
                        strokeWidth={2}
                        name="Data Exfiltration"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
