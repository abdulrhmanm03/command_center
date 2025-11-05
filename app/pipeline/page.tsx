"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PipelineSourceCard } from "@/components/pipeline-source-card"
import {
  Database,
  Settings,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  HardDrive,
  Zap,
  AlertTriangle,
  GitBranch,
  Trash2,
  Shield,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Play,
  Eye,
  FileText,
  Download,
  ChevronRight,
  BarChart3,
  TrendingUpIcon,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

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
  const [selectedRule, setSelectedRule] = useState<any>(null)
  const [selectedAlert, setSelectedAlert] = useState<any>(null)
  const [transformationMetrics, setTransformationMetrics] = useState({
    eventsPerMin: 0,
    parseErrorRate: 0,
    schemaDriftIncidents: 0,
    deduplicationRate: 0,
    piiRedactions: 0,
  })
  const [monitoringMetrics, setMonitoringMetrics] = useState({
    ingestThroughput: 0,
    endToEndLatency: 0,
    dataLossRate: 0,
    backpressure: 0,
    errorBudgetBurn: 0,
  })
  const [slos, setSlos] = useState({
    availability: 0,
    latency: 0,
    freshness: 0,
    completeness: 0,
    quality: 0,
  })

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
    const updateMetrics = () => {
      setTransformationMetrics({
        eventsPerMin: 15000 + Math.floor(Math.random() * 2000),
        parseErrorRate: 0.3 + Math.random() * 0.4,
        schemaDriftIncidents: Math.floor(Math.random() * 3),
        deduplicationRate: 22 + Math.random() * 3,
        piiRedactions: 450 + Math.floor(Math.random() * 100),
      })
      setMonitoringMetrics({
        ingestThroughput: 16500 + Math.floor(Math.random() * 1500),
        endToEndLatency: 850 + Math.floor(Math.random() * 200),
        dataLossRate: 0.02 + Math.random() * 0.03,
        backpressure: 45000 + Math.floor(Math.random() * 15000),
        errorBudgetBurn: 12 + Math.random() * 8,
      })
      setSlos({
        availability: 99.92 + Math.random() * 0.05,
        latency: 0.78 + Math.random() * 0.15,
        freshness: 42 + Math.random() * 15,
        completeness: 99.3 + Math.random() * 0.5,
        quality: 98.8 + Math.random() * 0.8,
      })
    }
    updateMetrics()
    const interval = setInterval(updateMetrics, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchPipelineData()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const pipelineStages = [
    { name: "Ingest", icon: Database, color: "text-cyan-400", status: "active" },
    { name: "Parse", icon: FileText, color: "text-blue-400", status: "active" },
    { name: "Normalise", icon: Settings, color: "text-purple-400", status: "active" },
    { name: "Enrich", icon: Zap, color: "text-yellow-400", status: "active" },
    { name: "Correlate", icon: GitBranch, color: "text-pink-400", status: "active" },
    { name: "Score", icon: BarChart3, color: "text-orange-400", status: "active" },
    { name: "Redact/Mask", icon: Shield, color: "text-green-400", status: "active" },
    { name: "Validate", icon: CheckCircle2, color: "text-teal-400", status: "active" },
    { name: "Route/Store", icon: HardDrive, color: "text-indigo-400", status: "active" },
  ]

  const transformationRules = [
    {
      id: 1,
      name: "paloalto-to-ecs",
      stage: "Parse",
      inputSources: "Palo Alto Firewall",
      outputSchema: "ECS",
      successRate: 99.7,
      latency: 12,
      owner: "Security Team",
      version: "v2.1.0",
      lastChange: "2 days ago",
      type: "mapping",
    },
    {
      id: 2,
      name: "asset-enrichment",
      stage: "Enrich",
      inputSources: "All Sources",
      outputSchema: "ECS + CMDB",
      successRate: 98.9,
      latency: 45,
      owner: "Data Team",
      version: "v1.5.2",
      lastChange: "5 days ago",
      type: "enrichment",
    },
    {
      id: 3,
      name: "email-click-correlation",
      stage: "Correlate",
      inputSources: "Proofpoint, EDR",
      outputSchema: "Correlated Events",
      successRate: 97.2,
      latency: 230,
      owner: "SOC Team",
      version: "v3.0.1",
      lastChange: "1 week ago",
      type: "correlation",
    },
    {
      id: 4,
      name: "firewall-dedup",
      stage: "Normalise",
      inputSources: "Palo Alto, Fortinet",
      outputSchema: "Deduplicated",
      successRate: 99.9,
      latency: 8,
      owner: "Platform Team",
      version: "v1.2.0",
      lastChange: "3 days ago",
      type: "deduplication",
    },
    {
      id: 5,
      name: "threat-scoring",
      stage: "Score",
      inputSources: "All Threats",
      outputSchema: "Risk Scored",
      successRate: 98.5,
      latency: 67,
      owner: "Threat Intel",
      version: "v2.3.1",
      lastChange: "1 day ago",
      type: "scoring",
    },
    {
      id: 6,
      name: "pii-redaction",
      stage: "Redact/Mask",
      inputSources: "All Sources",
      outputSchema: "PII Masked",
      successRate: 99.8,
      latency: 15,
      owner: "Compliance Team",
      version: "v1.8.0",
      lastChange: "4 days ago",
      type: "redaction",
    },
  ]

  const alerts = [
    {
      id: 1,
      name: "Parse errors > 2% for Proofpoint",
      scope: "Proofpoint Email",
      condition: "error_rate > 0.02 over 5m",
      severity: "High",
      status: "Resolved",
      runbook: "rb-parse-errors.md",
    },
    {
      id: 2,
      name: "Queue depth > 200k",
      scope: "Kafka Topic: raw-events",
      condition: "queue.depth > 200000",
      severity: "Critical",
      status: "Active",
      runbook: "rb-queue-backpressure.md",
    },
    {
      id: 3,
      name: "Freshness lag > 60s for Tier-0",
      scope: "CrowdStrike EDR",
      condition: "lag > 60s",
      severity: "Critical",
      status: "Monitoring",
      runbook: "rb-source-lag.md",
    },
    {
      id: 4,
      name: "Schema drift detected",
      scope: "Sentinel SIEM",
      condition: "schema_mismatch_count > 0",
      severity: "High",
      status: "Open",
      runbook: "rb-schema-drift.md",
    },
  ]

  const healthComponents = [
    { name: "Connectors", status: "Healthy", value: "7/7 Up", color: "text-green-400" },
    { name: "Queues", status: "Warning", value: "1 High Depth", color: "text-yellow-400" },
    { name: "Processors", status: "Healthy", value: "CPU 45%", color: "text-green-400" },
    { name: "Storage", status: "Healthy", value: "67% Used", color: "text-green-400" },
  ]

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

            <TabsContent value="transformations" className="space-y-6">
              {/* Top KPIs */}
              <div className="grid gap-4 grid-cols-5">
                <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Events Transformed/Min</p>
                        <p className="text-3xl font-bold text-cyan-400 mt-2">
                          {(transformationMetrics.eventsPerMin / 1000).toFixed(1)}K
                        </p>
                      </div>
                      <Zap className="h-8 w-8 text-cyan-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Parse Error Rate</p>
                        <p className="text-3xl font-bold text-red-400 mt-2">
                          {transformationMetrics.parseErrorRate.toFixed(2)}%
                        </p>
                        <Badge variant="outline" className="mt-1 border-green-500/50 text-green-400 text-xs">
                          Target &lt;1%
                        </Badge>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Schema Drift (24h)</p>
                        <p className="text-3xl font-bold text-purple-400 mt-2">
                          {transformationMetrics.schemaDriftIncidents}
                        </p>
                      </div>
                      <GitBranch className="h-8 w-8 text-purple-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Deduplication Rate</p>
                        <p className="text-3xl font-bold text-orange-400 mt-2">
                          {transformationMetrics.deduplicationRate.toFixed(1)}%
                        </p>
                      </div>
                      <Trash2 className="h-8 w-8 text-orange-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">PII Redactions (24h)</p>
                        <p className="text-3xl font-bold text-green-400 mt-2">{transformationMetrics.piiRedactions}</p>
                      </div>
                      <Shield className="h-8 w-8 text-green-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-4">
                {/* Pipeline Stages (Left Rail) */}
                <Card className="border-border/50 lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="text-lg">Pipeline Stages</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {pipelineStages.map((stage, index) => (
                      <div key={stage.name}>
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 cursor-pointer">
                          <stage.icon className={`h-5 w-5 ${stage.color}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{stage.name}</p>
                          </div>
                          <Badge variant="outline" className="border-green-500/50 text-green-400 text-xs">
                            {stage.status}
                          </Badge>
                        </div>
                        {index < pipelineStages.length - 1 && (
                          <div className="flex justify-center py-1">
                            <ChevronRight className="h-4 w-4 text-muted-foreground rotate-90" />
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Transformation Catalog */}
                <Card className="border-border/50 lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="text-lg">Transformation Catalog</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Stage</TableHead>
                          <TableHead>Input Sources</TableHead>
                          <TableHead>Success %</TableHead>
                          <TableHead>Latency (p95)</TableHead>
                          <TableHead>Version</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transformationRules.map((rule) => (
                          <TableRow
                            key={rule.id}
                            className="cursor-pointer hover:bg-accent/50"
                            onClick={() => setSelectedRule(rule)}
                          >
                            <TableCell className="font-medium">{rule.name}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {rule.stage}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">{rule.inputSources}</TableCell>
                            <TableCell>
                              <span
                                className={
                                  rule.successRate >= 99
                                    ? "text-green-400"
                                    : rule.successRate >= 98
                                      ? "text-yellow-400"
                                      : "text-red-400"
                                }
                              >
                                {rule.successRate}%
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">{rule.latency}ms</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {rule.version}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6">
              {/* Top KPIs */}
              <div className="grid gap-4 grid-cols-5">
                <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Ingest Throughput</p>
                        <p className="text-3xl font-bold text-cyan-400 mt-2">
                          {(monitoringMetrics.ingestThroughput / 1000).toFixed(1)}K
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">events/min</p>
                      </div>
                      <TrendingUpIcon className="h-8 w-8 text-cyan-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">End-to-End Latency</p>
                        <p className="text-3xl font-bold text-purple-400 mt-2">{monitoringMetrics.endToEndLatency}</p>
                        <p className="text-xs text-muted-foreground mt-1">ms (p95)</p>
                      </div>
                      <Clock className="h-8 w-8 text-purple-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Data Loss Rate</p>
                        <p className="text-3xl font-bold text-red-400 mt-2">
                          {monitoringMetrics.dataLossRate.toFixed(2)}%
                        </p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Backpressure</p>
                        <p className="text-3xl font-bold text-orange-400 mt-2">
                          {(monitoringMetrics.backpressure / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">queue depth</p>
                      </div>
                      <Activity className="h-8 w-8 text-orange-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Error Budget Burn</p>
                        <p className="text-3xl font-bold text-yellow-400 mt-2">
                          {monitoringMetrics.errorBudgetBurn.toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">last 24h</p>
                      </div>
                      <AlertCircle className="h-8 w-8 text-yellow-400 opacity-50" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Core SLOs */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Core SLOs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-5">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Availability</p>
                        <span className="text-sm font-bold text-green-400">{slos.availability.toFixed(2)}%</span>
                      </div>
                      <Progress value={slos.availability} className="h-2" />
                      <p className="text-xs text-muted-foreground">Target: ≥99.9%</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Latency (p95)</p>
                        <span className="text-sm font-bold text-cyan-400">{slos.latency.toFixed(2)}s</span>
                      </div>
                      <Progress value={(slos.latency / 5) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">Target: &lt;1s</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Freshness/Lag</p>
                        <span className="text-sm font-bold text-purple-400">{slos.freshness.toFixed(0)}s</span>
                      </div>
                      <Progress value={(slos.freshness / 60) * 100} className="h-2" />
                      <p className="text-xs text-muted-foreground">Target: &lt;60s</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Completeness</p>
                        <span className="text-sm font-bold text-orange-400">{slos.completeness.toFixed(1)}%</span>
                      </div>
                      <Progress value={slos.completeness} className="h-2" />
                      <p className="text-xs text-muted-foreground">Target: ≥99%</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Quality</p>
                        <span className="text-sm font-bold text-green-400">{slos.quality.toFixed(1)}%</span>
                      </div>
                      <Progress value={slos.quality} className="h-2" />
                      <p className="text-xs text-muted-foreground">Target: &gt;99%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Health Overview */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Health Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    {healthComponents.map((component) => (
                      <div
                        key={component.name}
                        className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-card/30"
                      >
                        <div>
                          <p className="text-sm font-medium">{component.name}</p>
                          <p className={`text-lg font-bold ${component.color} mt-1`}>{component.value}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            component.status === "Healthy"
                              ? "border-green-500/50 text-green-400"
                              : "border-yellow-500/50 text-yellow-400"
                          }
                        >
                          {component.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alert Matrix */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Alert Matrix</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Alert</TableHead>
                        <TableHead>Scope</TableHead>
                        <TableHead>Condition</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alerts.map((alert) => (
                        <TableRow
                          key={alert.id}
                          className="cursor-pointer hover:bg-accent/50"
                          onClick={() => setSelectedAlert(alert)}
                        >
                          <TableCell className="font-medium">{alert.name}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{alert.scope}</TableCell>
                          <TableCell className="text-sm font-mono text-muted-foreground">{alert.condition}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                alert.severity === "Critical"
                                  ? "border-red-500/50 text-red-400"
                                  : "border-orange-500/50 text-orange-400"
                              }
                            >
                              {alert.severity}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                alert.status === "Active"
                                  ? "border-red-500/50 text-red-400"
                                  : alert.status === "Open"
                                    ? "border-yellow-500/50 text-yellow-400"
                                    : alert.status === "Monitoring"
                                      ? "border-cyan-500/50 text-cyan-400"
                                      : "border-green-500/50 text-green-400"
                              }
                            >
                              {alert.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-1" />
                              Runbook
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* DLQ / Replay */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Dead Letter Queue & Replay</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-3 mb-4">
                    <div className="p-4 rounded-lg border border-border/50 bg-card/30">
                      <p className="text-sm text-muted-foreground">DLQ Size</p>
                      <p className="text-2xl font-bold text-red-400 mt-1">1,247</p>
                      <p className="text-xs text-muted-foreground mt-1">messages</p>
                    </div>
                    <div className="p-4 rounded-lg border border-border/50 bg-card/30">
                      <p className="text-sm text-muted-foreground">Top Failure Reason</p>
                      <p className="text-sm font-medium text-orange-400 mt-1">Parse Error</p>
                      <p className="text-xs text-muted-foreground mt-1">67% of failures</p>
                    </div>
                    <div className="p-4 rounded-lg border border-border/50 bg-card/30">
                      <p className="text-sm text-muted-foreground">Oldest Message</p>
                      <p className="text-2xl font-bold text-yellow-400 mt-1">4.2h</p>
                      <p className="text-xs text-muted-foreground mt-1">ago</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="border-cyan-500/30 hover:bg-cyan-500/10 bg-transparent">
                      <Play className="h-4 w-4 mr-2" />
                      Replay Selected
                    </Button>
                    <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/10 bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      View Samples
                    </Button>
                    <Button variant="outline" className="border-orange-500/30 hover:bg-orange-500/10 bg-transparent">
                      <Download className="h-4 w-4 mr-2" />
                      Export DLQ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Rule Detail Dialog */}
      <Dialog open={!!selectedRule} onOpenChange={() => setSelectedRule(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selectedRule?.name}</DialogTitle>
            <DialogDescription>Transformation Rule Details</DialogDescription>
          </DialogHeader>
          {selectedRule && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <Badge variant="outline" className="mt-1">
                    {selectedRule.type}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stage</p>
                  <Badge variant="outline" className="mt-1">
                    {selectedRule.stage}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-lg font-bold text-green-400 mt-1">{selectedRule.successRate}%</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Latency (p95)</p>
                  <p className="text-lg font-bold text-cyan-400 mt-1">{selectedRule.latency}ms</p>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm font-medium mb-2">Definition</p>
                <pre className="p-4 rounded-lg bg-muted text-sm overflow-x-auto">
                  {`type: ${selectedRule.type}
name: ${selectedRule.name}
input: ${selectedRule.inputSources}
output: ${selectedRule.outputSchema}
version: ${selectedRule.version}`}
                </pre>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Test Rule
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View Samples
                </Button>
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Change History
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Alert Runbook Dialog */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedAlert?.name}</DialogTitle>
            <DialogDescription>Alert Runbook</DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Severity</p>
                  <Badge
                    variant="outline"
                    className={
                      selectedAlert.severity === "Critical"
                        ? "border-red-500/50 text-red-400 mt-1"
                        : "border-orange-500/50 text-orange-400 mt-1"
                    }
                  >
                    {selectedAlert.severity}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 mt-1">
                    {selectedAlert.status}
                  </Badge>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-cyan-400">1. Check</p>
                  <p className="text-sm text-muted-foreground mt-1">Query: {selectedAlert.condition}</p>
                  <p className="text-sm text-muted-foreground">Scope: {selectedAlert.scope}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-400">2. Fix</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Review error logs and adjust parser configuration
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-400">3. Verify</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monitor metrics for 10 minutes to confirm resolution
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-400">4. Prevent</p>
                  <p className="text-sm text-muted-foreground mt-1">Update schema registry and add validation tests</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-green-500/30 bg-transparent">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark Resolved
                </Button>
                <Button variant="outline" size="sm" className="border-cyan-500/30 bg-transparent">
                  <Eye className="h-4 w-4 mr-2" />
                  View Logs
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
