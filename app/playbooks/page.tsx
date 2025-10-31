"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlaybookCard } from "@/components/playbook-card"
import { ExecutionTimeline } from "@/components/execution-timeline"
import { Plus, RefreshCw, Search, TrendingUp, Clock, CheckCircle2, Zap, BarChart3 } from "lucide-react"
import { useState, useEffect } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<any[]>([])
  const [executions, setExecutions] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      const [playbooksRes, executionsRes, statsRes] = await Promise.all([
        fetch("/api/playbooks"),
        fetch("/api/playbooks/executions"),
        fetch("/api/playbooks/stats"),
      ])
      const playbooksData = await playbooksRes.json()
      const executionsData = await executionsRes.json()
      const statsData = await statsRes.json()

      setPlaybooks(playbooksData)
      setExecutions(executionsData)
      setStats(statsData)
    } catch (error) {
      console.error("Failed to fetch playbooks data:", error)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const filteredPlaybooks = playbooks.filter(
    (pb) =>
      pb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pb.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pb.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400">Security Playbooks</h1>
              <p className="text-muted-foreground">Automated incident response and workflows</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-gray-700 bg-transparent"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button size="sm" className="bg-cyan-500 text-black hover:bg-cyan-400">
                <Plus className="mr-2 h-4 w-4" />
                New Playbook
              </Button>
            </div>
          </div>

          {stats && (
            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <Card className="border-slate-700 bg-gradient-to-br from-cyan-500/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Active Playbooks</p>
                      <p className="text-3xl font-bold text-white">{stats.activePlaybooks}</p>
                      <p className="text-xs text-cyan-400">of {stats.totalPlaybooks} total</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20">
                      <Zap className="h-6 w-6 text-cyan-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-gradient-to-br from-green-500/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Success Rate</p>
                      <p className="text-3xl font-bold text-white">{stats.avgSuccessRate}%</p>
                      <p className="text-xs text-green-400">Average across all playbooks</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-gradient-to-br from-orange-500/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Avg Response Time</p>
                      <p className="text-3xl font-bold text-white">{stats.avgResponseTime}</p>
                      <p className="text-xs text-orange-400">Mean time to resolution</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20">
                      <Clock className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-gradient-to-br from-purple-500/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Executions Today</p>
                      <p className="text-3xl font-bold text-white">{stats.executionsToday}</p>
                      <p className="text-xs text-purple-400">of {stats.totalExecutions} total</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
                      <TrendingUp className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {stats && (
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-cyan-400">Execution Trend (24h)</h3>
                  <ChartContainer
                    config={{
                      count: {
                        label: "Executions",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.executionTrend}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #333",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorCount)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-cyan-400">Category Breakdown</h3>
                  <div className="space-y-4">
                    {stats.categoryBreakdown.map((cat: any) => (
                      <div key={cat.category}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-gray-300">{cat.category}</span>
                          <span className="font-semibold text-white">
                            {cat.count} ({cat.percentage}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="active" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-card">
                <TabsTrigger value="active" className="data-[state=active]:text-cyan-400">
                  Active Playbooks
                </TabsTrigger>
                <TabsTrigger value="executions" className="data-[state=active]:text-cyan-400">
                  Recent Executions
                </TabsTrigger>
                <TabsTrigger value="templates" className="data-[state=active]:text-cyan-400">
                  Templates
                </TabsTrigger>
              </TabsList>

              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search playbooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-card border-border/50"
                />
              </div>
            </div>

            <TabsContent value="active" className="space-y-4">
              {filteredPlaybooks.map((playbook) => (
                <PlaybookCard
                  key={playbook.id}
                  playbook={playbook}
                  onRun={() => console.log("Run playbook:", playbook.id)}
                  onConfigure={() => console.log("Configure playbook:", playbook.id)}
                />
              ))}
            </TabsContent>

            <TabsContent value="executions">
              <ExecutionTimeline executions={executions} />
            </TabsContent>

            <TabsContent value="templates">
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-12 text-center">
                  <BarChart3 className="mx-auto mb-4 h-12 w-12 text-gray-600" />
                  <h3 className="mb-2 text-lg font-semibold text-white">Playbook Templates</h3>
                  <p className="mb-4 text-sm text-gray-400">
                    Browse and deploy pre-built playbook templates for common security scenarios
                  </p>
                  <Button className="bg-cyan-500 text-black hover:bg-cyan-400">Browse Templates</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
