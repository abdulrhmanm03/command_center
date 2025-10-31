"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, AlertCircle, Target, Clock, Activity } from "lucide-react"
import { useEffect, useState } from "react"
import { AreaChart, Area, ResponsiveContainer } from "recharts"

interface Prediction {
  id: number
  threat: string
  probability: number
  timeframe: string
  daysUntil: number
  confidence: number
  trend: string
  indicators: string[]
  mitigation: string
  impactScore: number
  historicalOccurrences: number
}

interface TrendData {
  category: string
  trend: string
  change: number
  severity: string
  count: number
  historical: number[]
}

export default function ForecastingPage() {
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [trendData, setTrendData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/forecasting")
        const data = await response.json()
        setPredictions(data.predictions)
        setTrendData(data.trendData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching forecasting data:", error)
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen">
        <SidebarNav />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex flex-1 items-center justify-center">
            <div className="text-muted-foreground">Loading forecasting data...</div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-green-400">Predictive Forecasting</h1>
                <p className="text-muted-foreground">AI-driven threat prediction and trend analysis</p>
              </div>
              <div className="flex gap-4">
                <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2">
                  <div className="text-xs text-green-400">Active Predictions</div>
                  <div className="text-2xl font-bold text-green-400">{predictions.length}</div>
                </div>
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2">
                  <div className="text-xs text-red-400">High Risk Threats</div>
                  <div className="text-2xl font-bold text-red-400">
                    {predictions.filter((p) => p.probability >= 70).length}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Card className="mb-6 border-accent/30 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-400">
                <Activity className="h-5 w-5" />
                Threat Trends (Last 7 Days)
              </CardTitle>
              <CardDescription>Emerging patterns and anomalies with historical data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {trendData.map((item) => (
                  <div key={item.category} className="rounded-lg border border-border bg-background p-4">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{item.category}</span>
                          {item.trend === "up" ? (
                            <TrendingUp className="h-4 w-4 text-red-400" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-green-400" />
                          )}
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-cyan-400">{item.count}</span>
                          <span
                            className={`text-sm font-medium ${item.change > 0 ? "text-red-400" : "text-green-400"}`}
                          >
                            {item.change > 0 ? "+" : ""}
                            {item.change}%
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          item.severity === "critical"
                            ? "border-red-500 text-red-400"
                            : item.severity === "high"
                              ? "border-orange-500 text-orange-400"
                              : item.severity === "medium"
                                ? "border-yellow-500 text-yellow-400"
                                : "border-green-500 text-green-400"
                        }
                      >
                        {item.severity}
                      </Badge>
                    </div>
                    <ResponsiveContainer width="100%" height={60}>
                      <AreaChart data={item.historical.map((value, index) => ({ day: index + 1, value }))}>
                        <defs>
                          <linearGradient id={`gradient-${item.category}`} x1="0" y1="0" x2="0" y2="1">
                            <stop
                              offset="5%"
                              stopColor={item.trend === "up" ? "#ef4444" : "#22c55e"}
                              stopOpacity={0.3}
                            />
                            <stop
                              offset="95%"
                              stopColor={item.trend === "up" ? "#ef4444" : "#22c55e"}
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={item.trend === "up" ? "#ef4444" : "#22c55e"}
                          fill={`url(#gradient-${item.category})`}
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-accent/30 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Target className="h-5 w-5" />
                Threat Predictions
              </CardTitle>
              <CardDescription>ML-powered forecasts based on historical data and threat intelligence</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 lg:grid-cols-2">
                {predictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className="group rounded-lg border border-border bg-gradient-to-br from-background to-background/50 p-5 transition-all hover:border-accent hover:shadow-lg"
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="mb-1 text-lg font-bold text-cyan-400">{prediction.threat}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{prediction.timeframe}</span>
                          <span className="text-xs">({prediction.daysUntil} days)</span>
                        </div>
                      </div>
                      <div className="relative flex h-20 w-20 items-center justify-center">
                        <svg className="h-20 w-20 -rotate-90 transform">
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            className="text-border"
                          />
                          <circle
                            cx="40"
                            cy="40"
                            r="32"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 32}`}
                            strokeDashoffset={`${2 * Math.PI * 32 * (1 - prediction.probability / 100)}`}
                            className={
                              prediction.probability >= 80
                                ? "text-red-500"
                                : prediction.probability >= 60
                                  ? "text-orange-500"
                                  : "text-yellow-500"
                            }
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span
                            className={`text-lg font-bold ${
                              prediction.probability >= 80
                                ? "text-red-400"
                                : prediction.probability >= 60
                                  ? "text-orange-400"
                                  : "text-yellow-400"
                            }`}
                          >
                            {prediction.probability}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4 grid grid-cols-3 gap-3">
                      <div className="rounded-md bg-secondary/50 p-2 text-center">
                        <div className="text-xs text-muted-foreground">Confidence</div>
                        <div className="text-sm font-bold text-green-400">{prediction.confidence}%</div>
                      </div>
                      <div className="rounded-md bg-secondary/50 p-2 text-center">
                        <div className="text-xs text-muted-foreground">Impact</div>
                        <div className="text-sm font-bold text-orange-400">{prediction.impactScore}/10</div>
                      </div>
                      <div className="rounded-md bg-secondary/50 p-2 text-center">
                        <div className="text-xs text-muted-foreground">History</div>
                        <div className="text-sm font-bold text-cyan-400">{prediction.historicalOccurrences}</div>
                      </div>
                    </div>

                    <div className="mb-3 flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={
                          prediction.trend === "increasing"
                            ? "border-red-500 text-red-400"
                            : prediction.trend === "decreasing"
                              ? "border-green-500 text-green-400"
                              : "border-yellow-500 text-yellow-400"
                        }
                      >
                        {prediction.trend === "increasing" ? (
                          <TrendingUp className="mr-1 h-3 w-3" />
                        ) : prediction.trend === "decreasing" ? (
                          <TrendingDown className="mr-1 h-3 w-3" />
                        ) : (
                          <Activity className="mr-1 h-3 w-3" />
                        )}
                        {prediction.trend}
                      </Badge>
                    </div>

                    {/* Key Indicators */}
                    <div className="mb-3">
                      <p className="mb-2 text-xs font-medium text-teal-400">Key Indicators</p>
                      <div className="flex flex-wrap gap-2">
                        {prediction.indicators.map((indicator, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            {indicator}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Mitigation */}
                    <div className="rounded-md bg-secondary/50 p-3">
                      <p className="mb-1 text-xs font-medium text-green-400">Recommended Mitigation</p>
                      <p className="text-sm text-foreground">{prediction.mitigation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
