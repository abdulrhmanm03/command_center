"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  SearchIcon,
  Server,
  TrendingUp,
  AlertTriangle,
  Key,
  ExternalLink,
  Cloud,
  Network,
  LayoutDashboard,
} from "lucide-react"
import {
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts"
import { useRouter } from "next/navigation"

interface LogSource {
  id: string
  name: string
  type: "Firewall" | "Endpoint" | "Cloud" | "Network" | "Application" | "Database" | "IDS/IPS"
  status: "Active" | "Healthy" | "Delayed" | "Error" | "Offline"
  eventsPerSec: number
  totalEvents: number
  lastEventTime: string
  dataRate: string
  latency: number
  location: string
}

interface EPSHistoryPoint {
  timestamp: string
  eps: number
}

export function SIEMLiveTable() {
  const [logSources, setLogSources] = useState<LogSource[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [totalEventsPerSec, setTotalEventsPerSec] = useState(0)
  const [epsHistory, setEpsHistory] = useState<EPSHistoryPoint[]>([])
  const [updatedSourceIds, setUpdatedSourceIds] = useState<Set<string>>(new Set())
  const tableRef = useRef<HTMLDivElement>(null)
  const LICENSE_THRESHOLD = 10000 // Maximum EPS allowed by license
  const router = useRouter()

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [sourcesResponse, historyResponse] = await Promise.all([
          fetch("/api/siem/log-sources"),
          fetch("/api/siem/eps-history"),
        ])
        const sources: LogSource[] = await sourcesResponse.json()
        const history: EPSHistoryPoint[] = await historyResponse.json()

        setLogSources(sources)
        setEpsHistory(history)
        const totalEPS = sources.reduce((sum, source) => sum + (source.eventsPerSec || 0), 0)
        setTotalEventsPerSec(totalEPS)
      } catch (error) {
        console.error("[v0] Failed to load data:", error)
      }
    }

    loadInitialData()
  }, [])

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch("/api/siem/log-sources")
        const data: LogSource[] = await response.json()

        data.forEach((source) => {
          setUpdatedSourceIds((prev) => new Set(prev).add(source.id))
          setTimeout(() => {
            setUpdatedSourceIds((prev) => {
              const next = new Set(prev)
              next.delete(source.id)
              return next
            })
          }, 2000)
        })

        setLogSources(data)
        const totalEPS = data.reduce((sum, source) => sum + (source.eventsPerSec || 0), 0)
        setTotalEventsPerSec(totalEPS)

        // Update EPS history
        setEpsHistory((prev) => {
          const newHistory = [...prev, { timestamp: new Date().toISOString(), eps: totalEPS }]
          // Keep only last 168 points (7 days at hourly intervals)
          return newHistory.slice(-168)
        })
      } catch (error) {
        console.error("[v0] Polling error:", error)
      }
    }, 5000)

    return () => clearInterval(pollInterval)
  }, [])

  const filteredSources = logSources.filter((source) => {
    if (filterType !== "all" && source.type !== filterType) return false
    if (searchQuery && !JSON.stringify(source).toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const activeCount = filteredSources.filter((s) => s.status === "Active" || s.status === "Healthy").length
  const errorCount = filteredSources.filter((s) => s.status === "Error" || s.status === "Offline").length

  // Calculate 7-day average and trend
  const avgEPS = epsHistory.length > 0 ? epsHistory.reduce((sum, p) => sum + p.eps, 0) / epsHistory.length : 0
  const trend =
    epsHistory.length > 1 ? ((epsHistory[epsHistory.length - 1].eps - epsHistory[0].eps) / epsHistory[0].eps) * 100 : 0

  const licenseUtilization = (totalEventsPerSec / LICENSE_THRESHOLD) * 100
  const isApproachingLimit = licenseUtilization > 80
  const isNearLimit = licenseUtilization > 90

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
      case "Healthy":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "Delayed":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "Error":
      case "Offline":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
      case "Healthy":
        return <CheckCircle className="h-3 w-3" />
      case "Delayed":
        return <Clock className="h-3 w-3" />
      case "Error":
      case "Offline":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <Activity className="h-3 w-3" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Firewall":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "Endpoint":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "Cloud":
        return "bg-purple-500/20 text-purple-400 border-purple-500/50"
      case "Network":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
      case "Application":
        return "bg-pink-500/20 text-pink-400 border-pink-500/50"
      case "Database":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-500/50"
      case "IDS/IPS":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button
          onClick={() => router.push("/auth-activity")}
          variant="outline"
          size="sm"
          className="border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 font-semibold gap-2"
        >
          <Key className="h-4 w-4" />
          Authentication Activity
          <ExternalLink className="h-3 w-3" />
        </Button>
        <Button
          onClick={() => router.push("/cloud-security")}
          variant="outline"
          size="sm"
          className="border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 hover:text-purple-300 font-semibold gap-2"
        >
          <Cloud className="h-4 w-4" />
          Cloud Security
          <ExternalLink className="h-3 w-3" />
        </Button>
        <Button
          onClick={() => router.push("/network-activity")}
          variant="outline"
          size="sm"
          className="border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 font-semibold gap-2"
        >
          <Network className="h-4 w-4" />
          Network Activity
          <ExternalLink className="h-3 w-3" />
        </Button>
        <Button
          onClick={() => router.push("/custom-dashboard")}
          variant="outline"
          size="sm"
          className="border-green-500/30 bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 font-semibold gap-2"
        >
          <LayoutDashboard className="h-4 w-4" />
          Create Custom Dashboard
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Live Total EPS */}
        <div
          className={`relative overflow-hidden rounded-lg border p-6 shadow-lg transition-all duration-500 ${
            isNearLimit
              ? "border-red-500/50 bg-gradient-to-br from-red-500/20 via-orange-500/10 to-transparent shadow-red-500/20"
              : isApproachingLimit
                ? "border-yellow-500/40 bg-gradient-to-br from-yellow-500/15 via-orange-500/5 to-transparent shadow-yellow-500/15"
                : "border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent shadow-cyan-500/10"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Live Total EPS</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span
                  className={`text-4xl font-bold ${
                    isNearLimit ? "text-red-400" : isApproachingLimit ? "text-yellow-400" : "text-cyan-400"
                  }`}
                >
                  {totalEventsPerSec.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500">events/sec</span>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="relative">
                  <div
                    className={`absolute h-2 w-2 animate-ping rounded-full opacity-75 ${
                      isNearLimit ? "bg-red-500" : isApproachingLimit ? "bg-yellow-500" : "bg-green-500"
                    }`}
                  />
                  <div
                    className={`h-2 w-2 animate-pulse rounded-full ${
                      isNearLimit ? "bg-red-500" : isApproachingLimit ? "bg-yellow-500" : "bg-green-500"
                    }`}
                  />
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isNearLimit ? "text-red-400" : isApproachingLimit ? "text-yellow-400" : "text-cyan-400"
                  }`}
                >
                  LIVE
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span
                  className={`text-xs font-semibold ${
                    isNearLimit ? "text-red-400" : isApproachingLimit ? "text-yellow-400" : "text-cyan-400"
                  }`}
                >
                  {licenseUtilization.toFixed(1)}% of license
                </span>
                {isApproachingLimit && (
                  <>
                    <span className="text-xs text-gray-500">•</span>
                    <AlertTriangle
                      className={`h-3 w-3 ${isNearLimit ? "text-red-400 animate-pulse" : "text-yellow-400"}`}
                    />
                  </>
                )}
              </div>
            </div>
            <Activity
              className={`h-12 w-12 ${
                isNearLimit ? "text-red-500/40" : isApproachingLimit ? "text-yellow-500/40" : "text-cyan-500/30"
              }`}
            />
          </div>
        </div>

        {/* 7-Day Average EPS */}
        <div className="relative overflow-hidden rounded-lg border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent p-6 shadow-lg shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">7-Day Average EPS</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-blue-400">{Math.round(avgEPS).toLocaleString()}</span>
                <span className="text-sm text-gray-500">events/sec</span>
              </div>
              <div className="mt-2 flex items-center gap-1">
                <TrendingUp className={`h-3 w-3 ${trend >= 0 ? "text-green-400" : "text-red-400 rotate-180"}`} />
                <span className={`text-xs font-semibold ${trend >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {Math.abs(trend).toFixed(1)}% vs start
                </span>
              </div>
            </div>
            <Server className="h-12 w-12 text-blue-500/30" />
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-lg border border-purple-500/30 bg-gradient-to-br from-purple-500/10 via-pink-500/5 to-transparent p-6 shadow-lg shadow-purple-500/10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-purple-400">7-Day EPS Trend</h3>
            <p className="text-xs text-gray-500">Last 7 days • Hourly samples • Real-time updates</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-8 rounded bg-purple-500" />
              <span className="text-xs text-gray-400">Current EPS</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 border-t-[3px] border-red-500" />
              <span className="text-xs font-bold text-red-400">License Limit</span>
            </div>
            <div className="flex items-center gap-2 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-1">
              <AlertTriangle className="h-3 w-3 text-red-400" />
              <span className="text-xs font-bold text-red-400">{LICENSE_THRESHOLD.toLocaleString()} EPS Max</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          {epsHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={epsHistory} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="dangerZone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="timestamp"
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  tickFormatter={(value) => {
                    const date = new Date(value)
                    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`
                  }}
                  interval="preserveStartEnd"
                  minTickGap={50}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                  label={{
                    value: "Events Per Second",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#9ca3af",
                    fontSize: 12,
                  }}
                  domain={[0, LICENSE_THRESHOLD * 1.1]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    padding: "8px 12px",
                  }}
                  labelStyle={{ color: "#9ca3af", fontSize: 12 }}
                  itemStyle={{ color: "#a855f7", fontSize: 12, fontWeight: "bold" }}
                  labelFormatter={(value) => {
                    const date = new Date(value)
                    return date.toLocaleString()
                  }}
                  formatter={(value: number) => {
                    const percentage = ((value / LICENSE_THRESHOLD) * 100).toFixed(1)
                    return [`${value.toLocaleString()} EPS (${percentage}% of limit)`, "Current"]
                  }}
                />
                <Area
                  type="monotone"
                  dataKey={() => LICENSE_THRESHOLD * 0.8}
                  fill="url(#dangerZone)"
                  stroke="none"
                  fillOpacity={1}
                  activeDot={false}
                  stackId="stack"
                />
                <ReferenceLine
                  y={LICENSE_THRESHOLD}
                  stroke="#ef4444"
                  strokeWidth={3}
                  strokeDasharray="none"
                  label={{
                    value: `LICENSE LIMIT: ${LICENSE_THRESHOLD.toLocaleString()} EPS`,
                    position: "insideTopRight",
                    fill: "#ef4444",
                    fontSize: 12,
                    fontWeight: "bold",
                    offset: 10,
                  }}
                />
                <ReferenceLine
                  y={LICENSE_THRESHOLD * 0.8}
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  label={{
                    value: `Warning: ${(LICENSE_THRESHOLD * 0.8).toLocaleString()} EPS (80%)`,
                    position: "insideTopRight",
                    fill: "#f59e0b",
                    fontSize: 10,
                    offset: 10,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="eps"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={false}
                  animationDuration={300}
                  name="EPS"
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
                <span className="text-sm text-gray-500">Loading trend data...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-cyan-400">Live SIEM Log Source Feed</h3>
          <div className="relative flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500/20 to-cyan-500/20 px-4 py-2 backdrop-blur">
            <div className="relative">
              <div className="absolute h-3 w-3 animate-ping rounded-full bg-green-500 opacity-75" />
              <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
            </div>
            <span className="text-sm font-bold text-green-400">
              {activeCount} Active | {errorCount} Issues
            </span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
            <Input
              placeholder="Search log sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 border-cyan-500/30 bg-gray-900/80 pl-10 text-white placeholder:text-gray-500 focus:border-cyan-500/50"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-md border border-cyan-500/30 bg-gray-900/80 px-3 py-2 text-sm text-white focus:border-cyan-500/50"
          >
            <option value="all">All Types</option>
            <option value="Firewall">Firewall</option>
            <option value="Endpoint">Endpoint</option>
            <option value="Cloud">Cloud</option>
            <option value="Network">Network</option>
            <option value="Application">Application</option>
            <option value="Database">Database</option>
            <option value="IDS/IPS">IDS/IPS</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-950/90 shadow-2xl shadow-cyan-500/10 backdrop-blur">
        <div ref={tableRef} className="max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-gray-900 via-cyan-950/50 to-gray-900 backdrop-blur">
              <tr className="border-b border-cyan-500/50">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Log Source
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">Type</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Events/Sec
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Total Events
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Data Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Latency
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Last Event
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSources.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                      <span className="text-cyan-400">Loading log sources...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSources.map((source, index) => (
                  <tr
                    key={source.id}
                    className={`
                      border-b border-gray-800/50 transition-all duration-500
                      ${
                        updatedSourceIds.has(source.id)
                          ? "bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                          : "hover:bg-cyan-500/5"
                      }
                    `}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-cyan-400" />
                        <span className="font-semibold text-cyan-300">{source.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`${getTypeColor(source.type)} font-semibold`}>
                        {source.type}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={`${getStatusColor(source.status)} font-bold flex items-center gap-1 w-fit`}
                      >
                        {getStatusIcon(source.status)}
                        {source.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-bold text-green-400">
                        {(source.eventsPerSec || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm text-gray-300">
                        {(source.totalEvents || 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-sm font-semibold text-cyan-400">{source.dataRate}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-mono text-sm font-semibold ${
                          source.latency < 100
                            ? "text-green-400"
                            : source.latency < 500
                              ? "text-yellow-400"
                              : "text-red-400"
                        }`}
                      >
                        {source.latency}ms
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{source.lastEventTime}</td>
                    <td className="px-4 py-3 text-sm text-gray-400">{source.location}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Streaming Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500" />
        <span>Live stream active • Data refreshing every 5s</span>
      </div>
    </div>
  )
}
