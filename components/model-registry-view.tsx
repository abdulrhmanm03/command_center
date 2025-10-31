"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import {
  Search,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Database,
  GitBranch,
  Activity,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Scan,
  TrendingUp,
  FileText,
  Lock,
  AlertCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Model {
  id: string
  name: string
  version: string
  status: "active" | "scanning" | "vulnerable" | "healthy" | "deprecated"
  securityScore: number
  lastScanned: string
  vulnerabilities: number
  driftScore: number
  usage: number
  owner: string
  framework: string
  size: string
  managed: boolean
}

interface Vulnerability {
  id: string
  modelId: string
  severity: "critical" | "high" | "medium" | "low"
  type: string
  description: string
  detected: string
  status: "open" | "mitigated" | "false-positive"
}

interface BehavioralBaseline {
  modelId: string
  modelName: string
  baselineDate: string
  currentDrift: number
  metrics: {
    accuracy: number
    latency: number
    tokenUsage: number
    errorRate: number
  }
  alerts: Array<{
    type: string
    severity: string
    message: string
    timestamp: string
  }>
}

interface ModelVersion {
  id: string
  modelId: string
  version: string
  releaseDate: string
  changes: string[]
  semanticDiff: {
    added: string[]
    removed: string[]
    modified: string[]
  }
  status: "current" | "previous" | "deprecated"
}

export function ModelRegistryView() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedModel, setSelectedModel] = useState<Model | null>(null)
  const [selectedVulnerability, setSelectedVulnerability] = useState<Vulnerability | null>(null)
  const [selectedBaseline, setSelectedBaseline] = useState<BehavioralBaseline | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterFramework, setFilterFramework] = useState<string>("all")
  const [selectedModels, setSelectedModels] = useState<string[]>([])
  const [showModelDialog, setShowModelDialog] = useState(false)
  const [showVulnDialog, setShowVulnDialog] = useState(false)
  const [showBaselineDialog, setShowBaselineDialog] = useState(false)
  const [showVersionDialog, setShowVersionDialog] = useState(false)
  const [selectedVersions, setSelectedVersions] = useState<ModelVersion[]>([])

  // Mock data for models
  const [models, setModels] = useState<Model[]>([
    {
      id: "model-1",
      name: "VTS LLM-1 Turbo", // Replaced GPT-4-Turbo with VTS LLM
      version: "v2.1.0",
      status: "healthy",
      securityScore: 95,
      lastScanned: "2 hours ago",
      vulnerabilities: 0,
      driftScore: 2.3,
      usage: 15420,
      owner: "AI Team",
      framework: "VTS", // Replaced OpenAI with VTS
      size: "175B",
      managed: true,
    },
    {
      id: "model-2",
      name: "VTS LLM-2 Advanced", // Replaced Claude-3-Opus with VTS LLM
      version: "v1.5.2",
      status: "vulnerable",
      securityScore: 68,
      lastScanned: "1 hour ago",
      vulnerabilities: 3,
      driftScore: 15.7,
      usage: 8920,
      owner: "Research Team",
      framework: "VTS", // Replaced Anthropic with VTS
      size: "137B",
      managed: true,
    },
    {
      id: "model-3",
      name: "Client Model A-70B", // Replaced Llama-3-70B with Client Model
      version: "v3.0.1",
      status: "scanning",
      securityScore: 82,
      lastScanned: "5 minutes ago",
      vulnerabilities: 1,
      driftScore: 8.2,
      usage: 12340,
      owner: "ML Ops",
      framework: "Client", // Replaced Meta with Client
      size: "70B",
      managed: true,
    },
    {
      id: "model-4",
      name: "Unknown-Model-X",
      version: "unknown",
      status: "vulnerable",
      securityScore: 35,
      lastScanned: "Never",
      vulnerabilities: 8,
      driftScore: 45.2,
      usage: 234,
      owner: "Unknown",
      framework: "Unknown",
      size: "Unknown",
      managed: false,
    },
    {
      id: "model-5",
      name: "VTS LLM-3 Pro", // Replaced Gemini-Pro with VTS LLM
      version: "v1.0.3",
      status: "healthy",
      securityScore: 91,
      lastScanned: "30 minutes ago",
      vulnerabilities: 0,
      driftScore: 3.1,
      usage: 9870,
      owner: "AI Team",
      framework: "VTS", // Replaced Google with VTS
      size: "Unknown",
      managed: true,
    },
    {
      id: "model-6",
      name: "Client Model B-Large", // Replaced Mistral-Large with Client Model
      version: "v2.0.0",
      status: "active",
      securityScore: 88,
      lastScanned: "1 hour ago",
      vulnerabilities: 1,
      driftScore: 5.4,
      usage: 6540,
      owner: "Research Team",
      framework: "Client", // Replaced Mistral with Client
      size: "123B",
      managed: true,
    },
  ])

  // Mock vulnerabilities
  const [vulnerabilities] = useState<Vulnerability[]>([
    {
      id: "vuln-1",
      modelId: "model-2",
      severity: "critical",
      type: "Model Poisoning",
      description: "Potential backdoor detected in training data affecting output integrity",
      detected: "1 hour ago",
      status: "open",
    },
    {
      id: "vuln-2",
      modelId: "model-2",
      severity: "high",
      type: "Weight Manipulation",
      description: "Suspicious weight patterns detected that may indicate tampering",
      detected: "2 hours ago",
      status: "open",
    },
    {
      id: "vuln-3",
      modelId: "model-2",
      severity: "medium",
      type: "Embedding Drift",
      description: "Significant drift in embedding space compared to baseline",
      detected: "3 hours ago",
      status: "mitigated",
    },
    {
      id: "vuln-4",
      modelId: "model-3",
      severity: "low",
      type: "Version Mismatch",
      description: "Model version doesn't match registered version in catalog",
      detected: "5 minutes ago",
      status: "open",
    },
    {
      id: "vuln-5",
      modelId: "model-4",
      severity: "critical",
      type: "Shadow AI",
      description: "Unmanaged model detected in production without security scanning",
      detected: "12 hours ago",
      status: "open",
    },
    {
      id: "vuln-6",
      modelId: "model-4",
      severity: "critical",
      type: "No Baseline",
      description: "Model has no behavioral baseline for drift detection",
      detected: "12 hours ago",
      status: "open",
    },
    {
      id: "vuln-7",
      modelId: "model-6",
      severity: "medium",
      type: "Performance Degradation",
      description: "Model latency increased by 40% compared to baseline",
      detected: "1 hour ago",
      status: "open",
    },
  ])

  // Mock behavioral baselines
  const [baselines] = useState<BehavioralBaseline[]>([
    {
      modelId: "model-1",
      modelName: "VTS LLM-1 Turbo", // Replaced GPT-4-Turbo with VTS LLM
      baselineDate: "2024-01-15",
      currentDrift: 2.3,
      metrics: {
        accuracy: 94.5,
        latency: 245,
        tokenUsage: 1250,
        errorRate: 0.8,
      },
      alerts: [
        {
          type: "Minor Drift",
          severity: "low",
          message: "Slight increase in token usage detected",
          timestamp: "2 hours ago",
        },
      ],
    },
    {
      modelId: "model-2",
      modelName: "VTS LLM-2 Advanced", // Replaced Claude-3-Opus with VTS LLM
      baselineDate: "2024-01-10",
      currentDrift: 15.7,
      metrics: {
        accuracy: 89.2,
        latency: 312,
        tokenUsage: 1580,
        errorRate: 3.2,
      },
      alerts: [
        {
          type: "Significant Drift",
          severity: "high",
          message: "Accuracy dropped by 5% from baseline",
          timestamp: "1 hour ago",
        },
        {
          type: "Latency Spike",
          severity: "medium",
          message: "Response time increased by 25%",
          timestamp: "3 hours ago",
        },
      ],
    },
    {
      modelId: "model-3",
      modelName: "Client Model A-70B", // Replaced Llama-3-70B with Client Model
      baselineDate: "2024-01-20",
      currentDrift: 8.2,
      metrics: {
        accuracy: 91.8,
        latency: 198,
        tokenUsage: 980,
        errorRate: 1.5,
      },
      alerts: [
        {
          type: "Moderate Drift",
          severity: "medium",
          message: "Error rate increased from baseline",
          timestamp: "5 hours ago",
        },
      ],
    },
  ])

  // Mock model versions
  const modelVersions: ModelVersion[] = [
    {
      id: "v1",
      modelId: "model-1",
      version: "v2.1.0",
      releaseDate: "2024-01-25",
      changes: ["Improved context handling", "Reduced hallucination rate", "Enhanced safety filters"],
      semanticDiff: {
        added: ["Multi-turn context awareness", "Enhanced PII detection"],
        removed: ["Legacy prompt format support"],
        modified: ["Safety classifier thresholds", "Token limit handling"],
      },
      status: "current",
    },
    {
      id: "v2",
      modelId: "model-1",
      version: "v2.0.5",
      releaseDate: "2024-01-10",
      changes: ["Bug fixes", "Performance improvements"],
      semanticDiff: {
        added: ["Streaming support"],
        removed: [],
        modified: ["Response formatting"],
      },
      status: "previous",
    },
    {
      id: "v3",
      modelId: "model-1",
      version: "v1.9.0",
      releaseDate: "2023-12-15",
      changes: ["Initial release"],
      semanticDiff: {
        added: ["Base functionality"],
        removed: [],
        modified: [],
      },
      status: "deprecated",
    },
  ]

  // Real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setModels((prev) =>
        prev.map((model) => {
          if (model.status === "scanning") {
            return {
              ...model,
              securityScore: Math.min(100, model.securityScore + Math.random() * 2),
            }
          }
          return model
        }),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const filteredModels = models.filter((model) => {
    const matchesSearch =
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.owner.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === "all" || model.status === filterStatus
    const matchesFramework = filterFramework === "all" || model.framework === filterFramework
    return matchesSearch && matchesStatus && matchesFramework
  })

  const handleScanModel = (modelId: string) => {
    setModels((prev) => prev.map((m) => (m.id === modelId ? { ...m, status: "scanning" as const } : m)))
    toast({
      title: "Scan Started",
      description: "Model security scan initiated",
    })

    setTimeout(() => {
      setModels((prev) =>
        prev.map((m) =>
          m.id === modelId
            ? {
                ...m,
                status: "healthy" as const,
                securityScore: Math.floor(Math.random() * 20) + 80,
                lastScanned: "Just now",
              }
            : m,
        ),
      )
      toast({
        title: "Scan Complete",
        description: "Model passed security checks",
      })
    }, 5000)
  }

  const handleRegisterModel = (modelId: string) => {
    setModels((prev) => prev.map((m) => (m.id === modelId ? { ...m, managed: true, status: "scanning" as const } : m)))
    toast({
      title: "Model Registered",
      description: "Shadow AI model added to registry and scanning initiated",
    })
  }

  const handleMitigateVuln = (vulnId: string) => {
    toast({
      title: "Mitigation Applied",
      description: "Vulnerability has been mitigated",
    })
  }

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Generating model registry report...",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-500"
      case "active":
        return "text-blue-500"
      case "scanning":
        return "text-yellow-500"
      case "vulnerable":
        return "text-red-500"
      case "deprecated":
        return "text-gray-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle2 className="h-4 w-4" />
      case "active":
        return <Activity className="h-4 w-4" />
      case "scanning":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case "vulnerable":
        return <AlertTriangle className="h-4 w-4" />
      case "deprecated":
        return <XCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  // Analytics data
  const securityScoreDistribution = [
    { range: "90-100", count: models.filter((m) => m.securityScore >= 90).length },
    { range: "70-89", count: models.filter((m) => m.securityScore >= 70 && m.securityScore < 90).length },
    { range: "50-69", count: models.filter((m) => m.securityScore >= 50 && m.securityScore < 70).length },
    { range: "0-49", count: models.filter((m) => m.securityScore < 50).length },
  ]

  const vulnerabilityTrend = [
    { date: "Jan 20", critical: 2, high: 5, medium: 8, low: 3 },
    { date: "Jan 21", critical: 1, high: 4, medium: 9, low: 4 },
    { date: "Jan 22", critical: 3, high: 6, medium: 7, low: 2 },
    { date: "Jan 23", critical: 1, high: 3, medium: 10, low: 5 },
    { date: "Jan 24", critical: 2, high: 5, medium: 8, low: 4 },
    { date: "Jan 25", critical: 1, high: 2, medium: 6, low: 3 },
  ]

  const modelUsageData = models
    .map((m) => ({
      name: m.name,
      usage: m.usage,
    }))
    .sort((a, b) => b.usage - a.usage)
    .slice(0, 5)

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Model Registry</h2>
          <p className="text-muted-foreground">
            Secure catalog of AI models with behavioral baselines and vulnerability scanning
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Register Model
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Models</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{models.length}</div>
            <p className="text-xs text-muted-foreground">
              {models.filter((m) => m.managed).length} managed, {models.filter((m) => !m.managed).length} shadow
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilities</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              {vulnerabilities.filter((v) => v.status === "open").length}
            </div>
            <p className="text-xs text-muted-foreground">
              {vulnerabilities.filter((v) => v.severity === "critical").length} critical,{" "}
              {vulnerabilities.filter((v) => v.severity === "high").length} high
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Security Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(models.reduce((acc, m) => acc + m.securityScore, 0) / models.length)}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 text-green-500" /> +5% from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Models Drifting</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{models.filter((m) => m.driftScore > 10).length}</div>
            <p className="text-xs text-muted-foreground">Behavioral drift detected</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="catalog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="catalog">Model Catalog</TabsTrigger>
          <TabsTrigger value="scanning">Vulnerability Scanning</TabsTrigger>
          <TabsTrigger value="baselines">Behavioral Baselines</TabsTrigger>
          <TabsTrigger value="versions">Version Control</TabsTrigger>
          <TabsTrigger value="shadow">Shadow AI Discovery</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Model Catalog Tab */}
        <TabsContent value="catalog" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Registered Models</CardTitle>
              <CardDescription>Secure catalog of protected AI models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filters */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search models..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="healthy">Healthy</SelectItem>
                    <SelectItem value="vulnerable">Vulnerable</SelectItem>
                    <SelectItem value="scanning">Scanning</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterFramework} onValueChange={setFilterFramework}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Frameworks</SelectItem>
                    <SelectItem value="VTS">VTS</SelectItem>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bulk Actions */}
              {selectedModels.length > 0 && (
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg">
                  <span className="text-sm">{selectedModels.length} selected</span>
                  <Button size="sm" variant="outline">
                    <Scan className="mr-2 h-4 w-4" />
                    Scan All
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
              )}

              {/* Models Table */}
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left">
                        <Checkbox />
                      </th>
                      <th className="p-2 text-left font-medium">Model</th>
                      <th className="p-2 text-left font-medium">Status</th>
                      <th className="p-2 text-left font-medium">Security Score</th>
                      <th className="p-2 text-left font-medium">Vulnerabilities</th>
                      <th className="p-2 text-left font-medium">Drift</th>
                      <th className="p-2 text-left font-medium">Usage</th>
                      <th className="p-2 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredModels.map((model) => (
                      <tr key={model.id} className="border-b hover:bg-muted/50">
                        <td className="p-2">
                          <Checkbox
                            checked={selectedModels.includes(model.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedModels([...selectedModels, model.id])
                              } else {
                                setSelectedModels(selectedModels.filter((id) => id !== model.id))
                              }
                            }}
                          />
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            {!model.managed && <Lock className="h-4 w-4 text-red-500" />}
                            <div>
                              <div className="font-medium">{model.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {model.version} • {model.framework} • {model.size}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2">
                          <Badge variant="outline" className={getStatusColor(model.status)}>
                            {getStatusIcon(model.status)}
                            <span className="ml-1">{model.status}</span>
                          </Badge>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Progress value={model.securityScore} className="w-16" />
                            <span className="text-sm font-medium">{model.securityScore}</span>
                          </div>
                        </td>
                        <td className="p-2">
                          {model.vulnerabilities > 0 ? (
                            <Badge variant="destructive">{model.vulnerabilities}</Badge>
                          ) : (
                            <Badge variant="outline" className="text-green-500">
                              0
                            </Badge>
                          )}
                        </td>
                        <td className="p-2">
                          <Badge variant={model.driftScore > 10 ? "destructive" : "outline"}>
                            {model.driftScore.toFixed(1)}%
                          </Badge>
                        </td>
                        <td className="p-2">
                          <span className="text-sm">{model.usage.toLocaleString()}</span>
                        </td>
                        <td className="p-2">
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedModel(model)
                                setShowModelDialog(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleScanModel(model.id)}
                              disabled={model.status === "scanning"}
                            >
                              <Scan className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vulnerability Scanning Tab */}
        <TabsContent value="scanning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vulnerability Scanning</CardTitle>
              <CardDescription>Model security checks and poisoning detection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium">Severity</th>
                      <th className="p-2 text-left font-medium">Model</th>
                      <th className="p-2 text-left font-medium">Type</th>
                      <th className="p-2 text-left font-medium">Description</th>
                      <th className="p-2 text-left font-medium">Detected</th>
                      <th className="p-2 text-left font-medium">Status</th>
                      <th className="p-2 text-left font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vulnerabilities.map((vuln) => {
                      const model = models.find((m) => m.id === vuln.modelId)
                      return (
                        <tr key={vuln.id} className="border-b hover:bg-muted/50">
                          <td className="p-2">
                            <Badge className={getSeverityColor(vuln.severity)}>{vuln.severity}</Badge>
                          </td>
                          <td className="p-2">
                            <div className="font-medium">{model?.name}</div>
                            <div className="text-xs text-muted-foreground">{model?.version}</div>
                          </td>
                          <td className="p-2">{vuln.type}</td>
                          <td className="p-2 max-w-md">
                            <div className="text-sm truncate">{vuln.description}</div>
                          </td>
                          <td className="p-2">
                            <div className="text-sm text-muted-foreground">{vuln.detected}</div>
                          </td>
                          <td className="p-2">
                            <Badge variant={vuln.status === "open" ? "destructive" : "outline"}>{vuln.status}</Badge>
                          </td>
                          <td className="p-2">
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedVulnerability(vuln)
                                  setShowVulnDialog(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {vuln.status === "open" && (
                                <Button size="sm" variant="ghost" onClick={() => handleMitigateVuln(vuln.id)}>
                                  <Shield className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavioral Baselines Tab */}
        <TabsContent value="baselines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Baselines</CardTitle>
              <CardDescription>Per-model behavioral profiling and drift detection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {baselines.map((baseline) => (
                <Card key={baseline.modelId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{baseline.modelName}</CardTitle>
                        <CardDescription>Baseline established: {baseline.baselineDate}</CardDescription>
                      </div>
                      <Badge variant={baseline.currentDrift > 10 ? "destructive" : "outline"}>
                        Drift: {baseline.currentDrift.toFixed(1)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Metrics */}
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Accuracy</div>
                        <div className="text-2xl font-bold">{baseline.metrics.accuracy}%</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Latency</div>
                        <div className="text-2xl font-bold">{baseline.metrics.latency}ms</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Token Usage</div>
                        <div className="text-2xl font-bold">{baseline.metrics.tokenUsage}</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Error Rate</div>
                        <div className="text-2xl font-bold">{baseline.metrics.errorRate}%</div>
                      </div>
                    </div>

                    {/* Alerts */}
                    {baseline.alerts.length > 0 && (
                      <div className="space-y-2">
                        <div className="text-sm font-medium">Recent Alerts</div>
                        {baseline.alerts.map((alert, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 bg-muted rounded-lg">
                            <AlertCircle
                              className={`h-4 w-4 mt-0.5 ${
                                alert.severity === "high"
                                  ? "text-red-500"
                                  : alert.severity === "medium"
                                    ? "text-yellow-500"
                                    : "text-blue-500"
                              }`}
                            />
                            <div className="flex-1">
                              <div className="text-sm font-medium">{alert.type}</div>
                              <div className="text-xs text-muted-foreground">{alert.message}</div>
                            </div>
                            <div className="text-xs text-muted-foreground">{alert.timestamp}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedBaseline(baseline)
                          setShowBaselineDialog(true)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Update Baseline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Version Control Tab */}
        <TabsContent value="versions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Version Control</CardTitle>
              <CardDescription>Model versions with semantic diffs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                {modelVersions.map((version) => (
                  <Card key={version.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{version.version}</CardTitle>
                          <CardDescription>Released: {version.releaseDate}</CardDescription>
                        </div>
                        <Badge
                          variant={
                            version.status === "current"
                              ? "default"
                              : version.status === "previous"
                                ? "outline"
                                : "secondary"
                          }
                        >
                          {version.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Changes */}
                      <div>
                        <div className="text-sm font-medium mb-2">Changes</div>
                        <ul className="list-disc list-inside space-y-1">
                          {version.changes.map((change, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground">
                              {change}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Semantic Diff */}
                      <div className="grid grid-cols-3 gap-4">
                        {version.semanticDiff.added.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-green-500 mb-2">Added</div>
                            <ul className="space-y-1">
                              {version.semanticDiff.added.map((item, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground">
                                  + {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {version.semanticDiff.removed.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-red-500 mb-2">Removed</div>
                            <ul className="space-y-1">
                              {version.semanticDiff.removed.map((item, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground">
                                  - {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {version.semanticDiff.modified.length > 0 && (
                          <div>
                            <div className="text-sm font-medium text-yellow-500 mb-2">Modified</div>
                            <ul className="space-y-1">
                              {version.semanticDiff.modified.map((item, idx) => (
                                <li key={idx} className="text-xs text-muted-foreground">
                                  ~ {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedVersions([version])
                            setShowVersionDialog(true)
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View Full Diff
                        </Button>
                        {version.status !== "current" && (
                          <Button size="sm" variant="outline">
                            <GitBranch className="mr-2 h-4 w-4" />
                            Rollback
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shadow AI Discovery Tab */}
        <TabsContent value="shadow" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shadow AI Discovery</CardTitle>
              <CardDescription>Detect unmanaged and unauthorized models</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md border border-red-500/50 bg-red-500/10 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-medium text-red-500">Shadow AI Detected</div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {models.filter((m) => !m.managed).length} unmanaged model(s) detected in production without
                      security scanning
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {models
                  .filter((m) => !m.managed)
                  .map((model) => (
                    <Card key={model.id} className="border-red-500/50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Lock className="h-5 w-5 text-red-500" />
                            <div>
                              <CardTitle className="text-lg">{model.name}</CardTitle>
                              <CardDescription>Discovered: {model.lastScanned}</CardDescription>
                            </div>
                          </div>
                          <Badge variant="destructive">Unmanaged</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm text-muted-foreground">Security Score</div>
                            <div className="text-2xl font-bold text-red-500">{model.securityScore}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Vulnerabilities</div>
                            <div className="text-2xl font-bold text-red-500">{model.vulnerabilities}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Usage</div>
                            <div className="text-2xl font-bold">{model.usage.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm text-muted-foreground">Owner</div>
                            <div className="text-2xl font-bold">{model.owner}</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-sm font-medium text-red-500">Risks Identified</div>
                          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                            <li>No security baseline established</li>
                            <li>No vulnerability scanning performed</li>
                            <li>Unknown training data provenance</li>
                            <li>No behavioral monitoring</li>
                            <li>Potential compliance violations</li>
                          </ul>
                        </div>

                        <div className="flex gap-2">
                          <Button onClick={() => handleRegisterModel(model.id)}>
                            <Shield className="mr-2 h-4 w-4" />
                            Register & Scan
                          </Button>
                          <Button variant="outline">
                            <XCircle className="mr-2 h-4 w-4" />
                            Block Model
                          </Button>
                          <Button variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            Investigate
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Security Score Distribution</CardTitle>
                <CardDescription>Model security health overview</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={securityScoreDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vulnerability Trend</CardTitle>
                <CardDescription>Vulnerabilities detected over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={vulnerabilityTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="critical" stroke="#ef4444" />
                    <Line type="monotone" dataKey="high" stroke="#f59e0b" />
                    <Line type="monotone" dataKey="medium" stroke="#eab308" />
                    <Line type="monotone" dataKey="low" stroke="#3b82f6" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Usage</CardTitle>
                <CardDescription>Top 5 models by request volume</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={modelUsageData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip />
                    <Bar dataKey="usage" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Model Status Overview</CardTitle>
                <CardDescription>Current status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Healthy", value: models.filter((m) => m.status === "healthy").length },
                        { name: "Vulnerable", value: models.filter((m) => m.status === "vulnerable").length },
                        { name: "Scanning", value: models.filter((m) => m.status === "scanning").length },
                        { name: "Active", value: models.filter((m) => m.status === "active").length },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Model Details Dialog */}
      <Dialog open={showModelDialog} onOpenChange={setShowModelDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedModel?.name}</DialogTitle>
            <DialogDescription>Model details and security information</DialogDescription>
          </DialogHeader>
          {selectedModel && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Version</div>
                  <div className="font-medium">{selectedModel.version}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Framework</div>
                  <div className="font-medium">{selectedModel.framework}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Size</div>
                  <div className="font-medium">{selectedModel.size}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Owner</div>
                  <div className="font-medium">{selectedModel.owner}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Security Score</div>
                  <div className="font-medium">{selectedModel.securityScore}/100</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Last Scanned</div>
                  <div className="font-medium">{selectedModel.lastScanned}</div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Security Status</div>
                <Progress value={selectedModel.securityScore} className="h-2" />
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Vulnerabilities</div>
                <div className="text-2xl font-bold text-red-500">{selectedModel.vulnerabilities}</div>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => handleScanModel(selectedModel.id)}>
                  <Scan className="mr-2 h-4 w-4" />
                  Rescan Model
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Vulnerability Details Dialog */}
      <Dialog open={showVulnDialog} onOpenChange={setShowVulnDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Vulnerability Details</DialogTitle>
            <DialogDescription>Security vulnerability information and mitigation</DialogDescription>
          </DialogHeader>
          {selectedVulnerability && (
            <div className="space-y-4">
              <div>
                <Badge className={getSeverityColor(selectedVulnerability.severity)}>
                  {selectedVulnerability.severity}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Type</div>
                <div className="font-medium">{selectedVulnerability.type}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="text-sm">{selectedVulnerability.description}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Detected</div>
                <div className="font-medium">{selectedVulnerability.detected}</div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => handleMitigateVuln(selectedVulnerability.id)}>
                  <Shield className="mr-2 h-4 w-4" />
                  Apply Mitigation
                </Button>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" />
                  View Recommendations
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Baseline Details Dialog */}
      <Dialog open={showBaselineDialog} onOpenChange={setShowBaselineDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Behavioral Baseline Details</DialogTitle>
            <DialogDescription>Detailed behavioral metrics and drift analysis</DialogDescription>
          </DialogHeader>
          {selectedBaseline && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Model</div>
                  <div className="font-medium">{selectedBaseline.modelName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Baseline Date</div>
                  <div className="font-medium">{selectedBaseline.baselineDate}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Current Drift</div>
                  <div className="font-medium">{selectedBaseline.currentDrift.toFixed(1)}%</div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Accuracy</div>
                  <div className="text-xl font-bold">{selectedBaseline.metrics.accuracy}%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Latency</div>
                  <div className="text-xl font-bold">{selectedBaseline.metrics.latency}ms</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Token Usage</div>
                  <div className="text-xl font-bold">{selectedBaseline.metrics.tokenUsage}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Error Rate</div>
                  <div className="text-xl font-bold">{selectedBaseline.metrics.errorRate}%</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
