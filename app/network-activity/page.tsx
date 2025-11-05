"use client"

import { useState, useEffect, useRef } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Activity,
  ArrowDownCircle,
  ArrowUpCircle,
  Globe,
  Shield,
  AlertTriangle,
  Lock,
  Network,
  Eye,
  Filter,
  TrendingUp,
} from "lucide-react"
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Area, AreaChart } from "recharts"

const generateDummyTrafficData = () => {
  const now = Date.now()
  const timeline = []
  for (let i = 11; i >= 0; i--) {
    const time = new Date(now - i * 5 * 60 * 1000)
    timeline.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      inbound: Math.floor(Math.random() * 3000) + 2000,
      outbound: Math.floor(Math.random() * 2500) + 1500,
    })
  }
  const result = {
    timeline,
    metrics: {
      inbound: Math.floor(Math.random() * 3000) + 2000,
      outbound: Math.floor(Math.random() * 2500) + 1500,
    },
  }
  console.log("[v0] Generated traffic data:", result)
  return result
}

const generateDummyProtocols = () => ({
  protocols: [
    { name: "HTTPS", count: Math.floor(Math.random() * 5000) + 8000, color: "#22c55e" },
    { name: "HTTP", count: Math.floor(Math.random() * 3000) + 4000, color: "#3b82f6" },
    { name: "DNS", count: Math.floor(Math.random() * 2000) + 3000, color: "#a855f7" },
    { name: "SSH", count: Math.floor(Math.random() * 1000) + 1500, color: "#06b6d4" },
    { name: "FTP", count: Math.floor(Math.random() * 500) + 800, color: "#f59e0b" },
  ],
})

const generateDummyTalkers = () => ({
  talkers: [
    {
      ip: "192.168.1.100",
      traffic: `${(Math.random() * 2 + 1).toFixed(2)} GB`,
      percentage: Math.floor(Math.random() * 20) + 70,
    },
    {
      ip: "10.0.0.45",
      traffic: `${(Math.random() * 1.5 + 0.5).toFixed(2)} GB`,
      percentage: Math.floor(Math.random() * 15) + 55,
    },
    {
      ip: "172.16.0.23",
      traffic: `${(Math.random() * 1 + 0.3).toFixed(2)} GB`,
      percentage: Math.floor(Math.random() * 15) + 45,
    },
    {
      ip: "192.168.2.78",
      traffic: `${(Math.random() * 0.8 + 0.2).toFixed(2)} GB`,
      percentage: Math.floor(Math.random() * 10) + 35,
    },
    {
      ip: "10.1.1.156",
      traffic: `${(Math.random() * 0.6 + 0.1).toFixed(2)} GB`,
      percentage: Math.floor(Math.random() * 10) + 25,
    },
    {
      ip: "172.20.5.89",
      traffic: `${(Math.random() * 0.5 + 0.1).toFixed(2)} GB`,
      percentage: Math.floor(Math.random() * 8) + 18,
    },
    {
      ip: "192.168.3.201",
      traffic: `${(Math.random() * 0.4 + 0.1).toFixed(2)} GB`,
      percentage: Math.floor(Math.random() * 8) + 12,
    },
    {
      ip: "10.2.0.67",
      traffic: `${(Math.random() * 0.3 + 0.05).toFixed(2)} GB`,
      percentage: Math.floor(Math.random() * 5) + 8,
    },
  ],
})

const generateDummySecurity = () => {
  const events = []
  const now = Date.now()
  const protocols = ["HTTPS", "HTTP", "SSH", "FTP", "DNS"]
  const severities = ["critical", "high", "medium", "low"]
  const statuses = ["blocked", "allowed"]

  for (let i = 0; i < 15; i++) {
    const time = new Date(now - i * 2 * 60 * 1000)
    const status = Math.random() > 0.3 ? "allowed" : "blocked"
    const severity =
      status === "blocked" ? severities[Math.floor(Math.random() * 2)] : severities[Math.floor(Math.random() * 2) + 2]

    events.push({
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      sourceIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      destIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      port: Math.floor(Math.random() * 60000) + 1024,
      bytes: `${(Math.random() * 500 + 50).toFixed(0)} KB`,
      status,
      severity,
    })
  }

  return {
    events,
    metrics: {
      blocked: Math.floor(Math.random() * 500) + 200,
      allowed: Math.floor(Math.random() * 3000) + 5000,
      encryptedRatio: Math.floor(Math.random() * 20) + 65,
      dnsAnomalies: Math.floor(Math.random() * 20) + 5,
    },
  }
}

const generateDummyFlows = () => ({
  metrics: {
    activeSessions: Math.floor(Math.random() * 5000) + 8000,
    avgDuration: Math.floor(Math.random() * 50) + 30,
    lateralMovement: Math.floor(Math.random() * 10) + 2,
    bytesTransferred: (Math.random() * 5 + 10).toFixed(1),
  },
})

const generateDummyGeo = () => ({
  countries: [
    { name: "United States", connections: Math.floor(Math.random() * 2000) + 3000, risk: "low" },
    { name: "United Kingdom", connections: Math.floor(Math.random() * 1000) + 1500, risk: "low" },
    { name: "Germany", connections: Math.floor(Math.random() * 800) + 1200, risk: "low" },
    { name: "China", connections: Math.floor(Math.random() * 500) + 800, risk: "medium" },
    { name: "Russia", connections: Math.floor(Math.random() * 300) + 400, risk: "high" },
    { name: "Brazil", connections: Math.floor(Math.random() * 400) + 600, risk: "low" },
    { name: "India", connections: Math.floor(Math.random() * 600) + 900, risk: "medium" },
    { name: "Japan", connections: Math.floor(Math.random() * 500) + 700, risk: "low" },
    { name: "Canada", connections: Math.floor(Math.random() * 400) + 600, risk: "low" },
  ],
})

export default function NetworkActivityPage() {
  console.log("[v0] NetworkActivityPage mounted")

  const [selectedProtocol, setSelectedProtocol] = useState("all")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [timeRange, setTimeRange] = useState("1h")

  const [dummyData, setDummyData] = useState(() => ({
    traffic: generateDummyTrafficData(),
    protocols: generateDummyProtocols(),
    talkers: generateDummyTalkers(),
    security: generateDummySecurity(),
    flows: generateDummyFlows(),
    geo: generateDummyGeo(),
  }))

  const trafficData = dummyData.traffic
  const topTalkersData = dummyData.talkers
  const protocolsData = dummyData.protocols
  const securityData = dummyData.security
  const flowsData = dummyData.flows
  const geoData = dummyData.geo

  console.log("[v0] Final data being used:", {
    trafficData,
    topTalkersData,
    protocolsData,
    securityData,
    flowsData,
    geoData,
  })

  const [lastUpdate, setLastUpdate] = useState(new Date())
  const prevMetricsRef = useRef<any>({})
  const [flashingMetrics, setFlashingMetrics] = useState<Set<string>>(new Set())

  useEffect(() => {
    console.log("[v0] Setting up dummy data update interval")
    const interval = setInterval(() => {
      console.log("[v0] Updating dummy data...")
      setDummyData({
        traffic: generateDummyTrafficData(),
        protocols: generateDummyProtocols(),
        talkers: generateDummyTalkers(),
        security: generateDummySecurity(),
        flows: generateDummyFlows(),
        geo: generateDummyGeo(),
      })
      setLastUpdate(new Date())
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!trafficData || !securityData || !flowsData) return

    const totalInbound = trafficData?.metrics?.inbound || 0
    const totalOutbound = trafficData?.metrics?.outbound || 0
    const totalThroughput = totalInbound + totalOutbound
    const blockedConnections = securityData?.metrics?.blocked || 0
    const activeFlows = flowsData?.metrics?.activeSessions || 0
    const encryptedRatio = securityData?.metrics?.encryptedRatio || 0

    const currentMetrics = {
      throughput: totalThroughput,
      flows: activeFlows,
      blocked: blockedConnections,
      encrypted: encryptedRatio,
    }

    const prevMetrics = prevMetricsRef.current

    Object.keys(currentMetrics).forEach((key) => {
      const currentValue = currentMetrics[key as keyof typeof currentMetrics]
      const prevValue = prevMetrics[key]

      if (prevValue !== undefined && prevValue !== currentValue) {
        setFlashingMetrics((prev) => new Set(prev).add(key))
        setTimeout(() => {
          setFlashingMetrics((prev) => {
            const newSet = new Set(prev)
            newSet.delete(key)
            return newSet
          })
        }, 500)
      }
    })

    prevMetricsRef.current = currentMetrics
  }, [trafficData, securityData, flowsData])

  const totalInbound = trafficData?.metrics?.inbound || 0
  const totalOutbound = trafficData?.metrics?.outbound || 0
  const totalThroughput = totalInbound + totalOutbound
  const blockedConnections = securityData?.metrics?.blocked || 0
  const allowedConnections = securityData?.metrics?.allowed || 0
  const activeFlows = flowsData?.metrics?.activeSessions || 0
  const encryptedRatio = securityData?.metrics?.encryptedRatio || 0

  console.log("[v0] Calculated metrics:", {
    totalInbound,
    totalOutbound,
    totalThroughput,
    blockedConnections,
    allowedConnections,
    activeFlows,
    encryptedRatio,
  })

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-[1800px] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-3 animate-pulse">
                  <Network className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-blue-400">Network Activity Dashboard</h1>
                  <p className="text-sm text-gray-400">Real-time network traffic monitoring and analysis</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="animate-pulse border-green-500/50 bg-green-500/20 text-green-400 px-4 py-2">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500 animate-ping" />
                <span className="font-semibold">LIVE DATA</span>
              </Badge>
              <span className="text-xs text-gray-500">Updated: {lastUpdate.toLocaleTimeString()}</span>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card
              className={`border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent transition-all duration-300 ${
                flashingMetrics.has("throughput") ? "ring-2 ring-blue-500 shadow-lg shadow-blue-500/50" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-400">Total Throughput</CardTitle>
                  <Badge className="border-blue-500/50 bg-blue-500/20 text-blue-400 text-xs">
                    <Activity className="mr-1 h-2 w-2 animate-pulse" />
                    LIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue-400">{(totalThroughput / 1000).toFixed(1)}</span>
                  <span className="text-sm text-gray-500">Gbps</span>
                  <TrendingUp className="h-4 w-4 text-green-400 ml-auto" />
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <ArrowDownCircle className="h-3 w-3 text-green-400" />
                  <span className="text-green-400">{(totalInbound / 1000).toFixed(1)} Gbps In</span>
                  <span className="text-gray-600">•</span>
                  <ArrowUpCircle className="h-3 w-3 text-cyan-400" />
                  <span className="text-cyan-400">{(totalOutbound / 1000).toFixed(1)} Gbps Out</span>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent transition-all duration-300 ${
                flashingMetrics.has("flows") ? "ring-2 ring-purple-500 shadow-lg shadow-purple-500/50" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-400">Active Flows</CardTitle>
                  <Badge className="border-purple-500/50 bg-purple-500/20 text-purple-400 text-xs">
                    <Activity className="mr-1 h-2 w-2 animate-pulse" />
                    LIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-purple-400">{activeFlows.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">sessions</span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <div className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
                  <span className="text-xs text-purple-400">Real-time monitoring</span>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent transition-all duration-300 ${
                flashingMetrics.has("blocked") ? "ring-2 ring-orange-500 shadow-lg shadow-orange-500/50" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-400">Security Events</CardTitle>
                  <Badge className="border-orange-500/50 bg-orange-500/20 text-orange-400 text-xs">
                    <Activity className="mr-1 h-2 w-2 animate-pulse" />
                    LIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-orange-400">{blockedConnections.toLocaleString()}</span>
                  <span className="text-sm text-gray-500">blocked</span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <Shield className="h-3 w-3 text-green-400" />
                  <span className="text-green-400">{allowedConnections.toLocaleString()} allowed</span>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent transition-all duration-300 ${
                flashingMetrics.has("encrypted") ? "ring-2 ring-cyan-500 shadow-lg shadow-cyan-500/50" : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-400">Encrypted Traffic</CardTitle>
                  <Badge className="border-cyan-500/50 bg-cyan-500/20 text-cyan-400 text-xs">
                    <Activity className="mr-1 h-2 w-2 animate-pulse" />
                    LIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-cyan-400">{encryptedRatio.toFixed(1)}%</span>
                  <span className="text-sm text-gray-500">encrypted</span>
                </div>
                <div className="mt-2 flex items-center gap-1">
                  <Lock className="h-3 w-3 text-cyan-400 animate-pulse" />
                  <span className="text-xs text-cyan-400">TLS/SSL traffic</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-blue-500/30 bg-gradient-to-br from-gray-900/90 to-gray-950/90">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-blue-400">Network Traffic Overview</CardTitle>
                  <CardDescription>Inbound vs Outbound traffic over time</CardDescription>
                </div>
                <Badge className="border-blue-500/50 bg-blue-500/20 text-blue-400">
                  <Activity className="mr-1 h-3 w-3 animate-pulse" />
                  LIVE
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trafficData?.timeline || []}>
                    <defs>
                      <linearGradient id="inbound" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="outbound" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="time" stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                    <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="inbound"
                      stroke="#10b981"
                      fill="url(#inbound)"
                      strokeWidth={2}
                      name="Inbound (Mbps)"
                    />
                    <Area
                      type="monotone"
                      dataKey="outbound"
                      stroke="#06b6d4"
                      fill="url(#outbound)"
                      strokeWidth={2}
                      name="Outbound (Mbps)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-purple-500/30 bg-gradient-to-br from-gray-900/90 to-gray-950/90 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-purple-400">Top Protocols</CardTitle>
                    <CardDescription>Most active network protocols by packet count</CardDescription>
                  </div>
                  <Badge className="border-purple-500/50 bg-purple-500/20 text-purple-400">
                    <Activity className="mr-1 h-3 w-3 animate-pulse" />
                    LIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-5">
                  {(protocolsData?.protocols || []).map((protocol: any, index: number) => {
                    const totalCount = (protocolsData?.protocols || []).reduce(
                      (sum: number, p: any) => sum + p.count,
                      0,
                    )
                    const percentage = ((protocol.count / totalCount) * 100).toFixed(1)

                    return (
                      <div
                        key={index}
                        className="group relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900/80 to-gray-950/80 p-5 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                        style={{
                          borderColor: `${protocol.color}40`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-transparent to-gray-950/50" />
                        <div className="relative space-y-3">
                          <div className="flex items-center justify-between">
                            <div
                              className="rounded-lg p-2 transition-all duration-300 group-hover:scale-110"
                              style={{
                                backgroundColor: `${protocol.color}20`,
                              }}
                            >
                              <Network className="h-5 w-5" style={{ color: protocol.color }} />
                            </div>
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{
                                borderColor: `${protocol.color}50`,
                                backgroundColor: `${protocol.color}10`,
                                color: protocol.color,
                              }}
                            >
                              {percentage}%
                            </Badge>
                          </div>

                          <div>
                            <div className="text-sm font-medium text-gray-400 mb-1">{protocol.name}</div>
                            <div className="text-2xl font-bold" style={{ color: protocol.color }}>
                              {protocol.count.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">packets</div>
                          </div>

                          <div className="space-y-1">
                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{
                                  width: `${percentage}%`,
                                  backgroundColor: protocol.color,
                                  boxShadow: `0 0 10px ${protocol.color}40`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-xs" style={{ color: protocol.color }}>
                            <TrendingUp className="h-3 w-3" />
                            <span>Active</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-950/90 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-cyan-400">Top Talkers</CardTitle>
                    <CardDescription>Hosts with highest traffic volume</CardDescription>
                  </div>
                  <Badge className="border-cyan-500/50 bg-cyan-500/20 text-cyan-400">
                    <Activity className="mr-1 h-3 w-3 animate-pulse" />
                    LIVE
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(topTalkersData?.talkers || []).slice(0, 8).map((talker: any, index: number) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-mono text-cyan-300">{talker.ip}</span>
                          <span className="text-xs text-gray-400">{talker.traffic}</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                            style={{ width: `${talker.percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-green-500/30 bg-gradient-to-br from-gray-900/90 to-gray-950/90">
            <CardHeader>
              <CardTitle className="text-green-400">Geographic Distribution</CardTitle>
              <CardDescription>External connections by country</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {(geoData?.countries || []).map((country: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-900/50 p-4"
                  >
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-green-400" />
                      <div>
                        <div className="font-semibold text-white">{country.name}</div>
                        <div className="text-xs text-gray-400">{country.connections} connections</div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        country.risk === "high"
                          ? "border-red-500/50 bg-red-500/20 text-red-400"
                          : country.risk === "medium"
                            ? "border-yellow-500/50 bg-yellow-500/20 text-yellow-400"
                            : "border-green-500/50 bg-green-500/20 text-green-400"
                      }`}
                    >
                      {country.risk}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card className="border-orange-500/30 bg-gradient-to-br from-gray-900/90 to-gray-950/90 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-orange-400">Security Indicators</CardTitle>
                    <CardDescription>IDS/IPS alerts and blocked connections</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="border-orange-500/30 text-orange-400 bg-transparent">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-400">Blocked Connections</div>
                        <div className="text-2xl font-bold text-red-400">{blockedConnections.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-green-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-400">Allowed Connections</div>
                        <div className="text-2xl font-bold text-green-400">{allowedConnections.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-yellow-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-400">DNS Anomalies</div>
                        <div className="text-2xl font-bold text-yellow-400">
                          {securityData?.metrics?.dnsAnomalies || 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-500/30 bg-gradient-to-br from-gray-900/90 to-gray-950/90 lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-blue-400">Flow & Session Analysis</CardTitle>
                    <CardDescription>NetFlow/sFlow session metrics</CardDescription>
                  </div>
                  <div className="flex items-center gap-4">
                    <Button variant="outline" size="sm" className="border-blue-500/30 text-blue-400 bg-transparent">
                      <Filter className="mr-2 h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-4">
                      <div className="text-sm font-medium text-gray-400">Active Sessions</div>
                      <div className="text-2xl font-bold text-blue-400">{activeFlows.toLocaleString()}</div>
                    </div>
                    <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                      <div className="text-sm font-medium text-gray-400">Avg Duration</div>
                      <div className="text-2xl font-bold text-purple-400">
                        {flowsData?.metrics?.avgDuration || "0"}s
                      </div>
                    </div>
                  </div>
                  <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-400">Lateral Movement Detected</div>
                      <Badge className="border-cyan-500/50 bg-cyan-500/20 text-cyan-400">
                        {flowsData?.metrics?.lateralMovement || 0} events
                      </Badge>
                    </div>
                    <div className="text-xs text-gray-500">Internal host-to-host connections</div>
                  </div>
                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-400">Bytes Transferred</div>
                      <div className="text-xl font-bold text-green-400">
                        {flowsData?.metrics?.bytesTransferred || "0"} TB
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-950/90">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-cyan-400">Recent Network Events</CardTitle>
                  <CardDescription>Latest network activity and anomalies</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400 bg-transparent">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="pb-3 text-left text-xs font-medium text-gray-400">Time</th>
                      <th className="pb-3 text-left text-xs font-medium text-gray-400">Source IP</th>
                      <th className="pb-3 text-left text-xs font-medium text-gray-400">Destination IP</th>
                      <th className="pb-3 text-left text-xs font-medium text-gray-400">Protocol</th>
                      <th className="pb-3 text-left text-xs font-medium text-gray-400">Port</th>
                      <th className="pb-3 text-left text-xs font-medium text-gray-400">Bytes</th>
                      <th className="pb-3 text-left text-xs font-medium text-gray-400">Status</th>
                      <th className="pb-3 text-left text-xs font-medium text-gray-400">Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(securityData?.events || []).map((event: any, index: number) => (
                      <tr key={index} className="border-b border-gray-800/50 hover:bg-cyan-500/5">
                        <td className="py-3 text-sm text-gray-300">{event.time}</td>
                        <td className="py-3 text-sm font-mono text-cyan-400">{event.sourceIp}</td>
                        <td className="py-3 text-sm font-mono text-purple-400">{event.destIp}</td>
                        <td className="py-3">
                          <Badge variant="outline" className="border-blue-500/50 bg-blue-500/20 text-blue-400">
                            {event.protocol}
                          </Badge>
                        </td>
                        <td className="py-3 text-sm text-gray-300">{event.port}</td>
                        <td className="py-3 text-sm text-gray-300">{event.bytes}</td>
                        <td className="py-3">
                          <Badge
                            variant="outline"
                            className={`${
                              event.status === "blocked"
                                ? "border-red-500/50 bg-red-500/20 text-red-400"
                                : "border-green-500/50 bg-green-500/20 text-green-400"
                            }`}
                          >
                            {event.status}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <Badge
                            variant="outline"
                            className={`${
                              event.severity === "critical"
                                ? "border-red-500/50 bg-red-500/20 text-red-400"
                                : event.severity === "high"
                                  ? "border-orange-500/50 bg-orange-500/20 text-orange-400"
                                  : event.severity === "medium"
                                    ? "border-yellow-500/50 bg-yellow-500/20 text-yellow-400"
                                    : "border-blue-500/50 bg-blue-500/20 text-blue-400"
                            }`}
                          >
                            {event.severity}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
