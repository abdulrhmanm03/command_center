"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { NetworkIcon, Activity, AlertTriangle, TrendingUp, RefreshCw, Download, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"

export default function NetworkTopologyPage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedZone, setSelectedZone] = useState<string | null>(null)

  const fetchData = async () => {
    const res = await fetch("/api/network-topology")
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !data) {
    return (
      <div className="flex h-screen">
        <SidebarNav />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto h-8 w-8 animate-spin text-cyan-400" />
            <p className="mt-2 text-muted-foreground">Loading network topology...</p>
          </div>
        </div>
      </div>
    )
  }

  const getZoneColor = (status: string) => {
    switch (status) {
      case "Critical":
        return { border: "#ef4444", bg: "#ef444420", text: "#ef4444" }
      case "Monitoring":
        return { border: "#f97316", bg: "#f9731620", text: "#f97316" }
      case "Healthy":
        return { border: "#22c55e", bg: "#22c55e20", text: "#22c55e" }
      default:
        return { border: "#06b6d4", bg: "#06b6d420", text: "#06b6d4" }
    }
  }

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400">Network Topology</h1>
              <p className="text-muted-foreground">Network visualization and traffic analysis</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Export Map
              </Button>
              <Button onClick={fetchData} variant="outline" size="sm" className="gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Total Devices</span>
                  <NetworkIcon className="h-4 w-4 text-cyan-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-cyan-400">{data.summary.totalDevices}</div>
                <p className="mt-2 text-xs text-muted-foreground">Across all network zones</p>
              </CardContent>
            </Card>

            <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Active Threats</span>
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">{data.summary.activeThreats}</div>
                <p className="mt-2 text-xs text-muted-foreground">Requires immediate attention</p>
              </CardContent>
            </Card>

            <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Avg Uptime</span>
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">{data.summary.avgUptime}%</div>
                <p className="mt-2 text-xs text-muted-foreground">Last 30 days</p>
              </CardContent>
            </Card>

            <Card className="border-magenta-500/30 bg-gradient-to-br from-magenta-500/10 to-transparent">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-sm font-medium">
                  <span className="text-muted-foreground">Total Bandwidth</span>
                  <Activity className="h-4 w-4 text-magenta-400" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-magenta-400">{data.summary.totalBandwidth}</div>
                <p className="mt-2 text-xs text-muted-foreground">Current utilization</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="visual" className="space-y-6">
            <TabsList>
              <TabsTrigger value="visual">Visual Map</TabsTrigger>
              <TabsTrigger value="zones">Network Zones</TabsTrigger>
              <TabsTrigger value="assets">Critical Assets</TabsTrigger>
              <TabsTrigger value="flows">Traffic Flows</TabsTrigger>
            </TabsList>

            <TabsContent value="visual">
              <Card className="border-accent/30">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Interactive Network Topology</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Click on any zone to view details. Lines show network connections and traffic flow.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="relative h-[700px] w-full overflow-hidden rounded-lg border border-accent/30 bg-gradient-to-br from-background to-accent/5">
                    <svg width="100%" height="100%" viewBox="0 0 1200 700" className="absolute inset-0">
                      <defs>
                        <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#ec4899" stopOpacity="0.6" />
                        </linearGradient>
                        <linearGradient id="activeConnection" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#22c55e" stopOpacity="0.8">
                            <animate
                              attributeName="stop-opacity"
                              values="0.8;0.3;0.8"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </stop>
                          <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8">
                            <animate
                              attributeName="stop-opacity"
                              values="0.3;0.8;0.3"
                              dur="2s"
                              repeatCount="indefinite"
                            />
                          </stop>
                        </linearGradient>
                      </defs>

                      <line
                        x1="600"
                        y1="80"
                        x2="600"
                        y2="180"
                        stroke="url(#activeConnection)"
                        strokeWidth="3"
                        strokeDasharray="5,5"
                      >
                        <animate attributeName="stroke-dashoffset" from="0" to="10" dur="1s" repeatCount="indefinite" />
                      </line>

                      <line
                        x1="600"
                        y1="280"
                        x2="300"
                        y2="380"
                        stroke="url(#connectionGradient)"
                        strokeWidth="2"
                        opacity="0.6"
                      />

                      <line
                        x1="600"
                        y1="280"
                        x2="900"
                        y2="380"
                        stroke="url(#connectionGradient)"
                        strokeWidth="2"
                        opacity="0.6"
                      />

                      <line
                        x1="300"
                        y1="480"
                        x2="600"
                        y2="580"
                        stroke="url(#connectionGradient)"
                        strokeWidth="2"
                        opacity="0.6"
                      />

                      <g transform="translate(600, 50)">
                        <circle cx="0" cy="0" r="30" fill="#06b6d4" opacity="0.2" />
                        <circle cx="0" cy="0" r="25" fill="#06b6d4" opacity="0.4" />
                        <circle cx="0" cy="0" r="20" fill="#06b6d4" />
                        <text
                          x="0"
                          y="5"
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                          className="select-none"
                        >
                          WAN
                        </text>
                        <text
                          x="0"
                          y="50"
                          textAnchor="middle"
                          fill="#06b6d4"
                          fontSize="14"
                          fontWeight="bold"
                          className="select-none"
                        >
                          Internet/External
                        </text>
                      </g>

                      {data.zones.map((zone: any, index: number) => {
                        const positions = [
                          { x: 600, y: 230 }, // DMZ
                          { x: 300, y: 430 }, // Corporate
                          { x: 600, y: 630 }, // OT
                          { x: 900, y: 430 }, // Guest
                        ]
                        const pos = positions[index] || { x: 600, y: 400 }
                        const colors = getZoneColor(zone.status)
                        const isSelected = selectedZone === zone.id

                        return (
                          <g
                            key={zone.id}
                            transform={`translate(${pos.x}, ${pos.y})`}
                            onClick={() => setSelectedZone(isSelected ? null : zone.id)}
                            className="cursor-pointer transition-all"
                            style={{ filter: isSelected ? "drop-shadow(0 0 10px currentColor)" : "none" }}
                          >
                            <circle cx="0" cy="0" r="75" fill={colors.bg} opacity={isSelected ? "0.4" : "0.2"}>
                              {isSelected && (
                                <animate attributeName="r" values="75;85;75" dur="2s" repeatCount="indefinite" />
                              )}
                            </circle>

                            <circle
                              cx="0"
                              cy="0"
                              r="60"
                              fill={colors.bg}
                              stroke={colors.border}
                              strokeWidth={isSelected ? "4" : "2"}
                              opacity="0.9"
                            />

                            <circle cx="0" cy="-15" r="15" fill={colors.border} opacity="0.3" />
                            <text
                              x="0"
                              y="-10"
                              textAnchor="middle"
                              fill={colors.text}
                              fontSize="16"
                              fontWeight="bold"
                              className="select-none"
                            >
                              {zone.name.charAt(0)}
                            </text>

                            <text
                              x="0"
                              y="15"
                              textAnchor="middle"
                              fill="white"
                              fontSize="14"
                              fontWeight="bold"
                              className="select-none"
                            >
                              {zone.name}
                            </text>

                            <text
                              x="0"
                              y="35"
                              textAnchor="middle"
                              fill={colors.text}
                              fontSize="20"
                              fontWeight="bold"
                              className="select-none"
                            >
                              {zone.devices}
                            </text>
                            <text
                              x="0"
                              y="50"
                              textAnchor="middle"
                              fill="hsl(var(--muted-foreground))"
                              fontSize="10"
                              className="select-none"
                            >
                              devices
                            </text>

                            <rect x="-35" y="-50" width="70" height="20" rx="10" fill={colors.border} opacity="0.9" />
                            <text
                              x="0"
                              y="-36"
                              textAnchor="middle"
                              fill="white"
                              fontSize="10"
                              fontWeight="bold"
                              className="select-none"
                            >
                              {zone.status}
                            </text>

                            {zone.threats > 0 && (
                              <>
                                <circle cx="45" cy="-45" r="12" fill="#ef4444" />
                                <text
                                  x="45"
                                  y="-40"
                                  textAnchor="middle"
                                  fill="white"
                                  fontSize="10"
                                  fontWeight="bold"
                                  className="select-none"
                                >
                                  {zone.threats}
                                </text>
                              </>
                            )}
                          </g>
                        )
                      })}

                      <g opacity="0.6">
                        <circle r="4" fill="#22c55e">
                          <animateMotion dur="3s" repeatCount="indefinite" path="M 600 80 L 600 180" />
                        </circle>
                        <circle r="4" fill="#06b6d4">
                          <animateMotion dur="4s" repeatCount="indefinite" path="M 600 280 L 300 380" />
                        </circle>
                        <circle r="4" fill="#ec4899">
                          <animateMotion dur="4s" repeatCount="indefinite" path="M 600 280 L 900 380" />
                        </circle>
                      </g>
                    </svg>

                    {selectedZone && (
                      <div className="absolute bottom-4 right-4 w-80 rounded-lg border border-accent/50 bg-card/95 p-4 shadow-xl backdrop-blur">
                        {data.zones
                          .filter((z: any) => z.id === selectedZone)
                          .map((zone: any) => (
                            <div key={zone.id}>
                              <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-cyan-400">{zone.name}</h3>
                                <Badge
                                  variant={
                                    zone.status === "Critical"
                                      ? "destructive"
                                      : zone.status === "Monitoring"
                                        ? "default"
                                        : "secondary"
                                  }
                                >
                                  {zone.status}
                                </Badge>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Subnet:</span>
                                  <span className="font-mono text-cyan-400">{zone.subnet}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Devices:</span>
                                  <span className="font-bold">{zone.devices}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Active Threats:</span>
                                  <span className="font-bold text-red-400">{zone.threats}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Bandwidth:</span>
                                  <span className="font-bold text-magenta-400">{zone.bandwidth}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Uptime:</span>
                                  <span className="font-bold text-green-400">{zone.uptime}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-muted-foreground">Last Scan:</span>
                                  <span className="text-xs">{zone.lastScan}</span>
                                </div>
                              </div>
                              <div className="mt-4 flex gap-2">
                                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                  View Details
                                </Button>
                                <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                                  Scan Now
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      <span className="text-muted-foreground">Healthy</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                      <span className="text-muted-foreground">Monitoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-500"></div>
                      <span className="text-muted-foreground">Critical</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-8 rounded bg-gradient-to-r from-cyan-500 to-magenta-500"></div>
                      <span className="text-muted-foreground">Network Connection</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
                      <span className="text-muted-foreground">Active Traffic</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="zones" className="grid gap-4 md:grid-cols-2">
              {data.zones.map((zone: any) => (
                <Card
                  key={zone.id}
                  className={`border-accent/30 ${zone.status === "Critical" ? "border-red-500/50 bg-red-500/5" : zone.status === "Monitoring" ? "border-orange-500/50 bg-orange-500/5" : "border-green-500/50 bg-green-500/5"}`}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-cyan-400">{zone.name}</h3>
                        <p className="text-sm text-muted-foreground">{zone.subnet}</p>
                      </div>
                      <Badge
                        variant={
                          zone.status === "Critical"
                            ? "destructive"
                            : zone.status === "Monitoring"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {zone.status}
                      </Badge>
                    </div>

                    <div className="mb-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Devices</p>
                        <p className="text-2xl font-bold text-foreground">{zone.devices}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Threats</p>
                        <p className="text-2xl font-bold text-red-400">{zone.threats}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Bandwidth</p>
                        <p className="text-lg font-bold text-magenta-400">{zone.bandwidth}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Uptime</p>
                        <p className="text-lg font-bold text-green-400">{zone.uptime}%</p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Network Health</span>
                        <span className="font-medium text-cyan-400">{zone.uptime}%</span>
                      </div>
                      <Progress value={zone.uptime} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Last Scan: {zone.lastScan}</span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Search className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Scan Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="assets" className="space-y-4">
              {data.criticalAssets.map((asset: any) => (
                <Card key={asset.name} className="border-accent/30">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3">
                          <h3 className="text-lg font-bold text-cyan-400">{asset.name}</h3>
                          <Badge variant="outline" className="font-mono text-xs">
                            {asset.ip}
                          </Badge>
                          <Badge variant="secondary">{asset.type}</Badge>
                        </div>
                        <div className="grid gap-4 md:grid-cols-3">
                          <div>
                            <p className="mb-2 text-sm text-muted-foreground">Risk Score</p>
                            <div className="flex items-center gap-3">
                              <Progress value={asset.risk} className="h-3 flex-1" />
                              <span className="text-xl font-bold text-red-400">{asset.risk}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Active Connections</p>
                            <p className="text-2xl font-bold text-magenta-400">{asset.connections}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              View Topology
                            </Button>
                            <Button variant="outline" size="sm">
                              Isolate
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="flows">
              <Card className="border-accent/30">
                <CardHeader>
                  <CardTitle className="text-cyan-400">Network Traffic (24 Hours)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={data.trafficFlows}>
                      <defs>
                        <linearGradient id="inbound" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="outbound" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ec4899" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="blocked" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="inbound"
                        stroke="#06b6d4"
                        fillOpacity={1}
                        fill="url(#inbound)"
                        name="Inbound (MB/s)"
                      />
                      <Area
                        type="monotone"
                        dataKey="outbound"
                        stroke="#ec4899"
                        fillOpacity={1}
                        fill="url(#outbound)"
                        name="Outbound (MB/s)"
                      />
                      <Area
                        type="monotone"
                        dataKey="blocked"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#blocked)"
                        name="Blocked (MB/s)"
                      />
                    </AreaChart>
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
