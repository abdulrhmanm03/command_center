"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Line,
  LineChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingDown, CheckCircle2, AlertTriangle, Settings } from "lucide-react"

interface TuningMetrics {
  summary: {
    totalAlertsBefore: number
    totalAlertsAfter: number
    reductionPercentage: number
    falsePositiveRate: number
    previousFalsePositiveRate: number
    tuningRulesActive: number
    lastTuned: string
  }
  timeSeriesData: Array<{
    date: string
    totalAlerts: number
    falsePositives: number
    truePositives: number
    fpRate: number
  }>
  categoryBreakdown: Array<{
    category: string
    before: number
    after: number
    reduction: number
  }>
  tuningActions: Array<{
    action: string
    count: number
    impact: string
  }>
}

export function AlertTuningWidget() {
  const [metrics, setMetrics] = useState<TuningMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch("/api/alert-tuning")
        const data = await response.json()
        setMetrics(data)
      } catch (error) {
        console.error("Failed to fetch alert tuning metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
    const interval = setInterval(fetchMetrics, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading || !metrics) {
    return (
      <Card className="border-cyan-500/30 bg-card">
        <CardHeader>
          <CardTitle className="text-cyan-400">Alert Tuning & Noise Reduction</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400">Loading metrics...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const { summary, timeSeriesData, categoryBreakdown, tuningActions } = metrics

  return (
    <Card className="border-cyan-500/30 bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-400">
          <Settings className="h-5 w-5" />
          Alert Tuning & Noise Reduction
        </CardTitle>
        <p className="text-sm text-gray-400">Continuous optimization reducing false positives and alert fatigue</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
            <div className="flex items-center gap-2 text-green-400 mb-2">
              <TrendingDown className="h-4 w-4" />
              <span className="text-xs font-medium">Alert Reduction</span>
            </div>
            <div className="text-2xl font-bold text-green-400">{summary.reductionPercentage}%</div>
            <div className="text-xs text-gray-400 mt-1">
              {summary.totalAlertsBefore.toLocaleString()} → {summary.totalAlertsAfter.toLocaleString()}
            </div>
          </div>

          <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-medium">False Positive Rate</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400">{summary.falsePositiveRate}%</div>
            <div className="text-xs text-green-400 mt-1">
              ↓ {(summary.previousFalsePositiveRate - summary.falsePositiveRate).toFixed(1)}% improvement
            </div>
          </div>

          <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
            <div className="flex items-center gap-2 text-purple-400 mb-2">
              <Settings className="h-4 w-4" />
              <span className="text-xs font-medium">Active Tuning Rules</span>
            </div>
            <div className="text-2xl font-bold text-purple-400">{summary.tuningRulesActive}</div>
            <div className="text-xs text-gray-400 mt-1">Continuously optimizing</div>
          </div>

          <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
            <div className="flex items-center gap-2 text-yellow-400 mb-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-xs font-medium">Last Tuned</span>
            </div>
            <div className="text-sm font-bold text-yellow-400">{new Date(summary.lastTuned).toLocaleTimeString()}</div>
            <div className="text-xs text-gray-400 mt-1">{new Date(summary.lastTuned).toLocaleDateString()}</div>
          </div>
        </div>

        {/* Time Series Chart - False Positive Reduction Over Time */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">False Positive Rate Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                fontSize={12}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                }
              />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
                labelStyle={{ color: "#06b6d4" }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="fpRate"
                stroke="#ef4444"
                strokeWidth={3}
                name="False Positive Rate (%)"
                dot={{ fill: "#ef4444", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="totalAlerts"
                stroke="#06b6d4"
                strokeWidth={2}
                name="Total Alerts"
                dot={{ fill: "#06b6d4", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Alert Reduction by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryBreakdown} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis type="number" stroke="#9ca3af" fontSize={12} />
              <YAxis dataKey="category" type="category" stroke="#9ca3af" fontSize={11} width={140} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="before" fill="#ef4444" name="Before Tuning" radius={[0, 4, 4, 0]} />
              <Bar dataKey="after" fill="#10b981" name="After Tuning" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tuning Actions Summary */}
        <div>
          <h3 className="text-sm font-semibold text-gray-300 mb-3">Active Tuning Strategies</h3>
          <div className="space-y-2">
            {tuningActions.map((action, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border border-gray-700 bg-gray-800/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      action.impact === "High"
                        ? "bg-green-400"
                        : action.impact === "Medium"
                          ? "bg-yellow-400"
                          : "bg-blue-400"
                    }`}
                  />
                  <span className="text-sm text-gray-300">{action.action}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded ${
                      action.impact === "High"
                        ? "bg-green-500/20 text-green-400"
                        : action.impact === "Medium"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {action.impact} Impact
                  </span>
                  <span className="text-sm font-semibold text-cyan-400">{action.count} rules</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
