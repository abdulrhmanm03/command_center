"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PipelineSourceCard } from "@/components/pipeline-source-card"
import { Database, Settings, RefreshCw, TrendingUp, TrendingDown, Activity, HardDrive } from "lucide-react"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PipelineMetrics {
  totalEventsPerHour: number
  processingLatency: number
  dataQualityScore: number
  storageUtilization: number
}

interface PipelineSource {
  id: string
  name: string
  category: string
  throughput: number
  throughputUnit: string
  latency: number
  latencyUnit: string
  uptime: number
  lastSync: string
  status: string
}

export default function PipelinePage() {
  const [metrics, setMetrics] = useState<PipelineMetrics>({
    totalEventsPerHour: 0,
    processingLatency: 0,
    dataQualityScore: 0,
    storageUtilization: 0,
  })
  const [sources, setSources] = useState<PipelineSource[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchPipelineData = async () => {
    try {
      const response = await fetch("/api/pipeline")
      const data = await response.json()
      if (data.success) {
        setMetrics(data.metrics)
        setSources(data.sources)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch pipeline data:", error)
    }
  }

  useEffect(() => {
    fetchPipelineData()
    const interval = setInterval(fetchPipelineData, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchPipelineData()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarNav />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <Database className="h-8 w-8 text-cyan-400" />
                <h1 className="text-3xl font-bold text-cyan-400">Data Pipeline</h1>
              </div>
              <p className="text-muted-foreground mt-1">Unified security data ingestion from all platforms</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-cyan-500/30 hover:bg-cyan-500/10 bg-transparent"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-500/30 hover:bg-purple-500/10 bg-transparent"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid gap-4 grid-cols-4">
            <Card className="border-cyan-500/20 bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Events/Hour</p>
                    <p className="text-3xl font-bold text-cyan-400 mt-2">
                      {(metrics.totalEventsPerHour / 1000000).toFixed(1)}M
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400">+8.5%</span>
                    </div>
                  </div>
                  <Activity className="h-10 w-10 text-cyan-400 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-500/20 bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Processing Latency</p>
                    <p className="text-3xl font-bold text-purple-400 mt-2">{metrics.processingLatency}ms</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingDown className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400">-12%</span>
                    </div>
                  </div>
                  <Activity className="h-10 w-10 text-purple-400 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/20 bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Data Quality Score</p>
                    <p className="text-3xl font-bold text-green-400 mt-2">{metrics.dataQualityScore}%</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-green-400" />
                      <span className="text-xs text-green-400">+2.1%</span>
                    </div>
                  </div>
                  <Activity className="h-10 w-10 text-green-400 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-500/20 bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Storage Utilization</p>
                    <p className="text-3xl font-bold text-orange-400 mt-2">{metrics.storageUtilization}%</p>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs text-yellow-400">+5%</span>
                    </div>
                  </div>
                  <HardDrive className="h-10 w-10 text-orange-400 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="sources" className="space-y-6">
            <TabsList className="bg-card/50 border border-border/50">
              <TabsTrigger value="sources">Data Sources</TabsTrigger>
              <TabsTrigger value="transformations">Transformations</TabsTrigger>
              <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            </TabsList>

            <TabsContent value="sources" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {sources.map((source) => (
                  <PipelineSourceCard key={source.id} source={source} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="transformations">
              <Card className="border-border/50">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Transformation pipeline configuration coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="monitoring">
              <Card className="border-border/50">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">Advanced monitoring dashboard coming soon</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
