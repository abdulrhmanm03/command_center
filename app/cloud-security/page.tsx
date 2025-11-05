"use client"

import { useState, useEffect } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Cloud,
  AlertTriangle,
  Shield,
  Activity,
  TrendingUp,
  TrendingDown,
  Server,
  Unlock,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
} from "lucide-react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface CloudEvent {
  id: string
  provider: "AWS" | "Azure" | "GCP"
  timestamp: string
  severity: "critical" | "high" | "medium" | "low"
  category: string
  service: string
  resource: string
  description: string
  status: "open" | "investigating" | "resolved"
  region: string
}

interface CloudMetrics {
  provider: string
  totalEvents: number
  criticalEvents: number
  highEvents: number
  mediumEvents: number
  lowEvents: number
  openIssues: number
  resolvedToday: number
  trend: number
  complianceScore: number
  activeResources: number
}

export default function CloudSecurityPage() {
  const [selectedProvider, setSelectedProvider] = useState<"all" | "AWS" | "Azure" | "GCP">("all")
  const [events, setEvents] = useState<CloudEvent[]>([])
  const [metrics, setMetrics] = useState<CloudMetrics[]>([])
  const [trendData, setTrendData] = useState<any[]>([])
  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [topServices, setTopServices] = useState<any[]>([])
  const [resourceExposure, setResourceExposure] = useState<any[]>([])
  const [logSourceHealth, setLogSourceHealth] = useState<any[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [flashingMetrics, setFlashingMetrics] = useState<Set<string>>(new Set())
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, metricsRes] = await Promise.all([
          fetch("/api/cloud-security/events"),
          fetch("/api/cloud-security/metrics"),
        ])

        const newEvents = await eventsRes.json()
        const newMetrics = await metricsRes.json()

        // Track new events for flash animation
        if (events.length > 0) {
          const newIds = new Set(
            newEvents
              .filter((e: CloudEvent) => !events.some((existing) => existing.id === e.id))
              .map((e: CloudEvent) => e.id),
          )

          if (newIds.size > 0) {
            setNewEventIds(newIds)
            setTimeout(() => setNewEventIds(new Set()), 2000)
          }
        }

        setEvents(newEvents)
        setMetrics(newMetrics)
        setLastUpdate(new Date())

        // Flash metrics that changed
        const changedMetrics = new Set<string>()
        if (metrics.length > 0) {
          newMetrics.forEach((m: CloudMetrics, i: number) => {
            if (
              metrics[i] &&
              (m.totalEvents !== metrics[i].totalEvents || m.criticalEvents !== metrics[i].criticalEvents)
            ) {
              changedMetrics.add(m.provider)
            }
          })
        }

        if (changedMetrics.size > 0) {
          setFlashingMetrics(changedMetrics)
          setTimeout(() => setFlashingMetrics(new Set()), 1000)
        }
      } catch (error) {
        console.error("[v0] Error fetching cloud security data:", error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 3000) // Update every 3 seconds
    return () => clearInterval(interval)
  }, [events, metrics])

  useEffect(() => {
    const updateTrendData = () => {
      setTrendData((prev) => {
        const newData = [...prev]
        if (newData.length >= 24) {
          newData.shift()
        }
        const now = new Date()
        newData.push({
          time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          AWS: Math.floor(Math.random() * 50) + 20 + (Math.random() > 0.5 ? 5 : -5),
          Azure: Math.floor(Math.random() * 40) + 15 + (Math.random() > 0.5 ? 5 : -5),
          GCP: Math.floor(Math.random() * 30) + 10 + (Math.random() > 0.5 ? 5 : -5),
        })
        return newData
      })
    }

    // Initialize with 24 hours of data
    const initialData = []
    const now = new Date()
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      initialData.push({
        time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        AWS: Math.floor(Math.random() * 50) + 20,
        Azure: Math.floor(Math.random() * 40) + 15,
        GCP: Math.floor(Math.random() * 30) + 10,
      })
    }
    setTrendData(initialData)

    const interval = setInterval(updateTrendData, 5000) // Update chart every 5 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const updateTopServices = () => {
      setTopServices((prev) => {
        return prev.map((service) => ({
          ...service,
          alerts:
            service.alerts + (Math.random() > 0.5 ? Math.floor(Math.random() * 3) : -Math.floor(Math.random() * 2)),
          trend: service.trend + (Math.random() > 0.5 ? 1 : -1),
        }))
      })
    }

    // Initialize
    const services = [
      { name: "AWS EC2", provider: "AWS", alerts: 142, trend: 12, color: "#f97316" },
      { name: "Azure Storage", provider: "Azure", alerts: 98, trend: -5, color: "#3b82f6" },
      { name: "GCP Compute", provider: "GCP", alerts: 87, trend: 8, color: "#10b981" },
      { name: "AWS S3", provider: "AWS", alerts: 76, trend: -3, color: "#f97316" },
      { name: "Azure VM", provider: "Azure", alerts: 64, trend: 15, color: "#3b82f6" },
      { name: "GCP Storage", provider: "GCP", alerts: 52, trend: -7, color: "#10b981" },
    ]
    setTopServices(services)

    const interval = setInterval(updateTopServices, 4000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const updateResourceExposure = () => {
      setResourceExposure([
        { type: "Public S3 Buckets", count: 23 + Math.floor(Math.random() * 3), severity: "critical", provider: "AWS" },
        { type: "Open Security Groups", count: 47 + Math.floor(Math.random() * 5), severity: "high", provider: "AWS" },
        {
          type: "Public Storage Accounts",
          count: 12 + Math.floor(Math.random() * 2),
          severity: "critical",
          provider: "Azure",
        },
        {
          type: "Unrestricted Firewall Rules",
          count: 31 + Math.floor(Math.random() * 4),
          severity: "high",
          provider: "GCP",
        },
        {
          type: "Exposed Databases",
          count: 8 + Math.floor(Math.random() * 2),
          severity: "critical",
          provider: "Multi",
        },
      ])
    }

    updateResourceExposure()
    const interval = setInterval(updateResourceExposure, 6000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const updateLogSourceHealth = () => {
      setLogSourceHealth([
        {
          source: "AWS CloudTrail",
          status: "healthy",
          lastSeen: `${Math.floor(Math.random() * 5) + 1} min ago`,
          eventsPerMin: 1247 + Math.floor(Math.random() * 100),
        },
        {
          source: "Azure Activity Logs",
          status: "healthy",
          lastSeen: `${Math.floor(Math.random() * 3) + 1} min ago`,
          eventsPerMin: 892 + Math.floor(Math.random() * 80),
        },
        {
          source: "GCP Cloud Logging",
          status: Math.random() > 0.7 ? "degraded" : "healthy",
          lastSeen: `${Math.floor(Math.random() * 20) + 1} min ago`,
          eventsPerMin: 234 + Math.floor(Math.random() * 50),
        },
        {
          source: "AWS GuardDuty",
          status: "healthy",
          lastSeen: `${Math.floor(Math.random() * 4) + 1} min ago`,
          eventsPerMin: 456 + Math.floor(Math.random() * 60),
        },
        {
          source: "Azure Sentinel",
          status: "healthy",
          lastSeen: `${Math.floor(Math.random() * 3) + 1} min ago`,
          eventsPerMin: 678 + Math.floor(Math.random() * 70),
        },
      ])
    }

    updateLogSourceHealth()
    const interval = setInterval(updateLogSourceHealth, 5000)
    return () => clearInterval(interval)
  }, [])

  const filteredTrendData = trendData.map((item) => {
    if (severityFilter === "all" && categoryFilter === "all") return item
    // Apply filters (simplified for demo)
    return item
  })

  const filteredEvents = selectedProvider === "all" ? events : events.filter((e) => e.provider === selectedProvider)

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "AWS":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "Azure":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      case "GCP":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="h-3 w-3" />
      case "investigating":
        return <Clock className="h-3 w-3" />
      case "open":
        return <XCircle className="h-3 w-3" />
      default:
        return <Activity className="h-3 w-3" />
    }
  }

  const totalMetrics = metrics.reduce(
    (acc, m) => ({
      totalEvents: acc.totalEvents + m.totalEvents,
      criticalEvents: acc.criticalEvents + m.criticalEvents,
      openIssues: acc.openIssues + m.openIssues,
      resolvedToday: acc.resolvedToday + m.resolvedToday,
      activeResources: acc.activeResources + m.activeResources,
    }),
    { totalEvents: 0, criticalEvents: 0, openIssues: 0, resolvedToday: 0, activeResources: 0 },
  )

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6">
          <div className="mx-auto max-w-[1800px] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
                  Cloud Security Monitoring
                </h1>
                <p className="text-sm text-gray-400">Real-time security events across AWS, Azure, and GCP</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <div className="absolute h-3 w-3 animate-ping rounded-full bg-green-500 opacity-75" />
                    <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-green-400">LIVE DATA</span>
                    <span className="text-[10px] text-gray-500">Updated {lastUpdate.toLocaleTimeString()}</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 animate-pulse">
                  <Zap className="h-3 w-3 mr-1" />
                  Real-Time
                </Badge>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-400 flex items-center gap-2">
                    Total Events (24h)
                    <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-3xl font-bold text-purple-400 transition-all duration-500 ${flashingMetrics.has("total") ? "scale-110 text-purple-300" : ""}`}
                      >
                        {totalMetrics.totalEvents}
                      </span>
                      <Activity className="h-5 w-5 text-purple-400 animate-pulse" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant="outline"
                        className="bg-red-500/20 text-red-400 border-red-500/50 text-xs animate-pulse"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +12%
                      </Badge>
                      <span className="text-[10px] text-gray-500">vs yesterday</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">AWS: 45% | Azure: 32% | GCP: 23%</p>
                </CardContent>
              </Card>

              <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-400 flex items-center gap-2">
                    Critical Events
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-3xl font-bold text-red-400 transition-all duration-500 ${flashingMetrics.has("critical") ? "scale-110 text-red-300" : ""}`}
                      >
                        {totalMetrics.criticalEvents}
                      </span>
                      <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        variant="outline"
                        className="bg-red-500/20 text-red-400 border-red-500/50 text-xs animate-pulse"
                      >
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +8%
                      </Badge>
                      <span className="text-[10px] text-gray-500">vs yesterday</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">AWS IAM: 18 | Azure AD: 12</p>
                </CardContent>
              </Card>

              <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent transition-all duration-300 hover:shadow-lg hover:shadow-orange-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-400 flex items-center gap-2">
                    Open Issues
                    <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-orange-400 transition-all duration-500">
                        {totalMetrics.openIssues}
                      </span>
                      <Unlock className="h-5 w-5 text-orange-400" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                        <TrendingDown className="h-3 w-3 mr-1" />
                        -5%
                      </Badge>
                      <span className="text-[10px] text-gray-500">vs yesterday</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Avg resolution: 4.2 hours</p>
                </CardContent>
              </Card>

              <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-400 flex items-center gap-2">
                    Resolved Today
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-green-400 transition-all duration-500">
                        {totalMetrics.resolvedToday}
                      </span>
                      <CheckCircle className="h-5 w-5 text-green-400" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50 text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +15%
                      </Badge>
                      <span className="text-[10px] text-gray-500">vs yesterday</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">MTTR: 3.8 hours</p>
                </CardContent>
              </Card>

              <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xs font-medium text-gray-400 flex items-center gap-2">
                    Active Resources
                    <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-cyan-400 transition-all duration-500">
                        {totalMetrics.activeResources}
                      </span>
                      <Server className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +3%
                      </Badge>
                      <span className="text-[10px] text-gray-500">vs yesterday</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Monitored: 98.7%</p>
                </CardContent>
              </Card>
            </div>

            <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-yellow-400 flex items-center gap-2">
                      Top Services by Alert Volume
                      <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse" />
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Services generating the most security events
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50 animate-pulse"
                  >
                    <Activity className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topServices.map((service, index) => (
                    <div key={service.name} className="flex items-center gap-4 transition-all duration-500">
                      <span className="text-2xl font-bold text-gray-600 w-6">{index + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{service.name}</span>
                            <Badge
                              variant="outline"
                              className="text-xs"
                              style={{ borderColor: service.color, color: service.color }}
                            >
                              {service.provider}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-white transition-all duration-500">
                              {service.alerts}
                            </span>
                            {service.trend >= 0 ? (
                              <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/50 text-xs">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                {service.trend}%
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-green-500/20 text-green-400 border-green-500/50 text-xs"
                              >
                                <TrendingDown className="h-3 w-3 mr-1" />
                                {Math.abs(service.trend)}%
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${(service.alerts / 150) * 100}%`,
                              backgroundColor: service.color,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-red-400 flex items-center gap-2">
                    Resource Exposure
                  </CardTitle>
                  <CardDescription className="text-gray-400">Public-facing and misconfigured assets</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {resourceExposure.map((item) => (
                      <div
                        key={item.type}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800"
                      >
                        <div className="flex items-center gap-3">
                          <AlertTriangle
                            className={`h-5 w-5 ${item.severity === "critical" ? "text-red-400" : "text-orange-400"}`}
                          />
                          <div>
                            <p className="text-sm font-semibold text-white">{item.type}</p>
                            <p className="text-xs text-gray-500">{item.provider}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`${item.severity === "critical" ? "bg-red-500/20 text-red-400 border-red-500/50" : "bg-orange-500/20 text-orange-400 border-orange-500/50"}`}
                          >
                            {item.count}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-green-400 flex items-center gap-2">
                    Compliance & Posture
                  </CardTitle>
                  <CardDescription className="text-gray-400">Security compliance scores by provider</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {metrics.map((metric) => (
                      <div key={metric.provider} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Cloud
                              className="h-4 w-4"
                              style={{
                                color:
                                  metric.provider === "AWS"
                                    ? "#f97316"
                                    : metric.provider === "Azure"
                                      ? "#3b82f6"
                                      : "#10b981",
                              }}
                            />
                            <span className="text-sm font-semibold text-white">{metric.provider}</span>
                          </div>
                          <span className="text-lg font-bold text-green-400">{metric.complianceScore}%</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                              width: `${metric.complianceScore}%`,
                              backgroundColor:
                                metric.complianceScore >= 90
                                  ? "#10b981"
                                  : metric.complianceScore >= 70
                                    ? "#f59e0b"
                                    : "#ef4444",
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Encryption: {metric.complianceScore >= 90 ? "✓" : "✗"}</span>
                          <span>Access Control: {metric.complianceScore >= 85 ? "✓" : "✗"}</span>
                          <span>Logging: {metric.complianceScore >= 95 ? "✓" : "✗"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-transparent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-white">Log Source Health</span>
                  <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/50">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Healthy
                  </Badge>
                </div>
                <CardDescription className="text-gray-400">Real-time ingestion status and event rates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {logSourceHealth.map((source) => (
                    <div key={source.source} className="p-4 rounded-lg bg-gray-900/50 border border-gray-800">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-white">{source.source}</span>
                        <Badge
                          variant="outline"
                          className={`${source.status === "healthy" ? "bg-green-500/20 text-green-400 border-green-500/50" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"}`}
                        >
                          {source.status === "healthy" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <AlertTriangle className="h-3 w-3 mr-1" />
                          )}
                          {source.status}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Last Seen</span>
                          <span className="text-gray-300">{source.lastSeen}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Events/min</span>
                          <span className="text-cyan-400 font-bold">{source.eventsPerMin.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Provider Metrics */}
            <div className="grid gap-4 md:grid-cols-3">
              {metrics.map((metric) => (
                <Card
                  key={metric.provider}
                  className={`border-${metric.provider === "AWS" ? "orange" : metric.provider === "Azure" ? "blue" : "green"}-500/30 bg-gradient-to-br from-${metric.provider === "AWS" ? "orange" : metric.provider === "Azure" ? "blue" : "green"}-500/10 to-transparent`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-bold text-white">{metric.provider}</CardTitle>
                      <Badge variant="outline" className={getProviderColor(metric.provider)}>
                        <Cloud className="mr-1 h-3 w-3" />
                        {metric.activeResources} Resources
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-400">Last 24 hours</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Total Events</span>
                      <span className="text-lg font-bold text-white">{metric.totalEvents}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Critical</span>
                      <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/50">
                        {metric.criticalEvents}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">High</span>
                      <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/50">
                        {metric.highEvents}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Open Issues</span>
                      <span className="text-lg font-bold text-orange-400">{metric.openIssues}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Compliance Score</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-green-400">{metric.complianceScore}%</span>
                        <Shield className="h-4 w-4 text-green-400" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {metric.trend >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-red-400" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-green-400" />
                      )}
                      <span
                        className={`text-sm font-semibold ${metric.trend >= 0 ? "text-red-400" : "text-green-400"}`}
                      >
                        {Math.abs(metric.trend)}% vs yesterday
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-purple-400">24-Hour Event Trends</CardTitle>
                    <CardDescription className="text-gray-400">Security events by cloud provider</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger className="w-[140px] border-purple-500/30 bg-purple-500/10">
                        <SelectValue placeholder="Severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger className="w-[140px] border-purple-500/30 bg-purple-500/10">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="network">Network</SelectItem>
                        <SelectItem value="iam">IAM</SelectItem>
                        <SelectItem value="storage">Storage</SelectItem>
                        <SelectItem value="api">API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredTrendData}>
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
                      <Line type="monotone" dataKey="AWS" stroke="#f97316" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Azure" stroke="#3b82f6" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="GCP" stroke="#10b981" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
              <CardHeader>
                <CardTitle className="text-lg font-bold text-red-400 flex items-center gap-2">
                  Recent High-Severity Events
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Critical and high-priority findings requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredEvents
                    .filter((e) => e.severity === "critical" || e.severity === "high")
                    .slice(0, 10)
                    .map((event) => (
                      <div
                        key={event.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-red-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <Badge variant="outline" className={getSeverityColor(event.severity)}>
                            {event.severity}
                          </Badge>
                          <Badge variant="outline" className={getProviderColor(event.provider)}>
                            {event.provider}
                          </Badge>
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-white">{event.description}</p>
                            <p className="text-xs text-gray-500">
                              {event.service} • {event.resource} • {event.region}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-gray-500">{event.timestamp}</span>
                          <Badge
                            variant="outline"
                            className={`flex items-center gap-1 ${
                              event.status === "resolved"
                                ? "bg-green-500/20 text-green-400 border-green-500/50"
                                : event.status === "investigating"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                  : "bg-red-500/20 text-red-400 border-red-500/50"
                            }`}
                          >
                            {getStatusIcon(event.status)}
                            {event.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                      All Security Events
                      <div className="h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
                    </CardTitle>
                    <CardDescription className="text-gray-400">Complete feed of cloud security events</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 animate-pulse">
                      <Activity className="h-3 w-3 mr-1" />
                      {events.length} Events
                    </Badge>
                    <Tabs value={selectedProvider} onValueChange={(v) => setSelectedProvider(v as any)}>
                      <TabsList className="bg-gray-900/50">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="AWS">AWS</TabsTrigger>
                        <TabsTrigger value="Azure">Azure</TabsTrigger>
                        <TabsTrigger value="GCP">GCP</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="max-h-[500px] overflow-y-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-gray-900 backdrop-blur z-10">
                      <tr className="border-b border-cyan-500/30">
                        <th className="p-3 text-left text-xs font-bold uppercase text-cyan-400">Time</th>
                        <th className="p-3 text-left text-xs font-bold uppercase text-cyan-400">Provider</th>
                        <th className="p-3 text-left text-xs font-bold uppercase text-cyan-400">Severity</th>
                        <th className="p-3 text-left text-xs font-bold uppercase text-cyan-400">Service</th>
                        <th className="p-3 text-left text-xs font-bold uppercase text-cyan-400">Resource</th>
                        <th className="p-3 text-left text-xs font-bold uppercase text-cyan-400">Description</th>
                        <th className="p-3 text-left text-xs font-bold uppercase text-cyan-400">Status</th>
                        <th className="p-3 text-left text-xs font-bold uppercase text-cyan-400">Region</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                              <span className="text-cyan-400">Loading events...</span>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredEvents.slice(0, 50).map((event) => (
                          <tr
                            key={event.id}
                            className={`border-b border-gray-800/50 hover:bg-cyan-500/5 transition-all duration-300 ${
                              newEventIds.has(event.id) ? "bg-cyan-500/20 animate-pulse" : ""
                            }`}
                          >
                            <td className="p-3 text-sm text-gray-400">{event.timestamp}</td>
                            <td className="p-3">
                              <Badge variant="outline" className={getProviderColor(event.provider)}>
                                {event.provider}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <Badge variant="outline" className={getSeverityColor(event.severity)}>
                                {event.severity}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm font-semibold text-white">{event.service}</td>
                            <td className="p-3 text-sm text-gray-300">{event.resource}</td>
                            <td className="p-3 text-sm text-gray-400">{event.description}</td>
                            <td className="p-3">
                              <Badge
                                variant="outline"
                                className={`flex items-center gap-1 w-fit ${
                                  event.status === "resolved"
                                    ? "bg-green-500/20 text-green-400 border-green-500/50"
                                    : event.status === "investigating"
                                      ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                      : "bg-red-500/20 text-red-400 border-red-500/50"
                                }`}
                              >
                                {getStatusIcon(event.status)}
                                {event.status}
                              </Badge>
                            </td>
                            <td className="p-3 text-sm text-gray-400">{event.region}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
