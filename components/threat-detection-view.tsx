"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  AlertTriangle,
  Eye,
  X,
  FileText,
  Ban,
  AlertCircle,
  Shield,
  Activity,
  Settings,
  Brain,
  Target,
  Zap,
  BarChart3,
  Plus,
  Save,
  Play,
  Trash2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { firewallEngine, type ThreatDetection } from "@/lib/firewall-engine"
import { useToast } from "@/hooks/use-toast"

export function ThreatDetectionView() {
  const [selectedThreat, setSelectedThreat] = useState<ThreatDetection | null>(null)
  const [threats, setThreats] = useState<ThreatDetection[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [severityFilter, setSeverityFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [initialized, setInitialized] = useState(false)
  const { toast } = useToast()

  const [engineConfig, setEngineConfig] = useState({
    promptInjection: {
      enabled: true,
      directDetection: true,
      indirectDetection: true,
      llmClassifier: "deberta-v3",
      confidenceThreshold: 0.75,
      blockOnDetection: true,
    },
    behavioralProfiling: {
      enabled: true,
      sessionAnalysis: true,
      jailbreakDetection: true,
      escalationTracking: true,
      multiTurnAnalysis: true,
      anomalyThreshold: 0.8,
    },
    semanticDetectors: {
      toxicityEnabled: true,
      toxicityThreshold: 0.7,
      hallucinationEnabled: true,
      hallucinationThreshold: 0.6,
      biasDetection: true,
      piiDetection: true,
    },
  })

  const [customRules, setCustomRules] = useState([
    {
      id: "rule-1",
      name: "Multi-turn Manipulation Detection",
      description: "Flag sessions with >5 turns showing escalating privilege requests",
      enabled: true,
      conditions: [
        { field: "session.turns", operator: ">", value: "5" },
        { field: "intent.escalation", operator: ">=", value: "0.7" },
      ],
      action: "flag",
      severity: "high",
    },
    {
      id: "rule-2",
      name: "Rapid Token Consumption",
      description: "Block users consuming >10k tokens in <1 minute",
      enabled: true,
      conditions: [
        { field: "tokens.consumed", operator: ">", value: "10000" },
        { field: "time.window", operator: "<", value: "60" },
      ],
      action: "block",
      severity: "critical",
    },
  ])

  const [analytics, setAnalytics] = useState({
    promptInjection: { detected: 234, blocked: 198, falsePositives: 12, accuracy: 94.9 },
    jailbreak: { detected: 156, blocked: 142, falsePositives: 8, accuracy: 94.9 },
    toxicity: { detected: 89, blocked: 76, falsePositives: 5, accuracy: 94.4 },
    hallucination: { detected: 67, blocked: 45, falsePositives: 15, accuracy: 77.6 },
    pii: { detected: 123, blocked: 123, falsePositives: 2, accuracy: 98.4 },
  })

  useEffect(() => {
    if (!initialized) {
      firewallEngine.generateSampleThreats()
      setInitialized(true)
    }

    const updateThreats = () => {
      const recentThreats = firewallEngine.getRecentThreats(50)
      setThreats(recentThreats)
    }

    updateThreats()
    const interval = setInterval(updateThreats, 2000)
    return () => clearInterval(interval)
  }, [initialized])

  const filteredThreats = threats.filter((threat) => {
    const matchesSearch =
      searchQuery === "" ||
      threat.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.metadata.endpoint.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.metadata.userId.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSeverity = severityFilter === "all" || threat.severity === severityFilter
    const matchesType = typeFilter === "all" || threat.type === typeFilter

    return matchesSearch && matchesSeverity && matchesType
  })

  const stats = {
    total: threats.length,
    blocked: threats.filter((t) => t.blocked).length,
    critical: threats.filter((t) => t.severity === "critical").length,
    high: threats.filter((t) => t.severity === "high").length,
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-chart-4 text-primary-foreground"
      case "medium":
        return "bg-chart-3 text-primary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      jailbreak: "bg-red-500/10 text-red-500 border-red-500/20",
      prompt_injection: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      data_poisoning: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      adversarial_input: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      pii_leakage: "bg-pink-500/10 text-pink-500 border-pink-500/20",
      model_extraction: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    }
    return colors[type] || "bg-muted text-muted-foreground"
  }

  const handleCreateIncident = (threat: ThreatDetection) => {
    toast({
      title: "Incident Created",
      description: `Incident created for threat ${threat.id.slice(0, 8)}`,
    })
  }

  const handleAddToBlocklist = (threat: ThreatDetection) => {
    toast({
      title: "Added to Blocklist",
      description: `User ${threat.metadata.userId} has been blocked`,
    })
  }

  const handleMarkFalsePositive = (threat: ThreatDetection) => {
    setThreats((prev) => prev.filter((t) => t.id !== threat.id))
    setSelectedThreat(null)
    toast({
      title: "Marked as False Positive",
      description: "Threat removed and model will be retrained",
    })
  }

  const handleSaveEngineConfig = () => {
    toast({
      title: "Configuration Saved",
      description: "Detection engine settings have been updated",
    })
  }

  const handleTestDetector = (detectorType: string) => {
    toast({
      title: "Running Test",
      description: `Testing ${detectorType} detector with sample data...`,
    })
  }

  const handleAddRule = () => {
    const newRule = {
      id: `rule-${Date.now()}`,
      name: "New Custom Rule",
      description: "Description of the rule",
      enabled: true,
      conditions: [{ field: "", operator: "=", value: "" }],
      action: "flag",
      severity: "medium",
    }
    setCustomRules([...customRules, newRule])
    toast({
      title: "Rule Created",
      description: "New custom rule added. Configure the conditions.",
    })
  }

  const handleDeleteRule = (ruleId: string) => {
    setCustomRules(customRules.filter((r) => r.id !== ruleId))
    toast({
      title: "Rule Deleted",
      description: "Custom rule has been removed",
    })
  }

  const handleToggleRule = (ruleId: string) => {
    setCustomRules(customRules.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r)))
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Threat Detection Engine</h1>
        <p className="text-muted-foreground">
          Behavioral semantics scanning with LLM-based classifiers and custom rule builder
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">
            <Shield className="mr-2 h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="engine">
            <Settings className="mr-2 h-4 w-4" />
            Detection Engine
          </TabsTrigger>
          <TabsTrigger value="injection">
            <Target className="mr-2 h-4 w-4" />
            Prompt Injection
          </TabsTrigger>
          <TabsTrigger value="behavioral">
            <Brain className="mr-2 h-4 w-4" />
            Behavioral Profiling
          </TabsTrigger>
          <TabsTrigger value="semantic">
            <Zap className="mr-2 h-4 w-4" />
            Semantic Detectors
          </TabsTrigger>
          <TabsTrigger value="rules">
            <FileText className="mr-2 h-4 w-4" />
            Custom Rules
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Threats</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Detected in last 24h</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Blocked</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.blocked}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.total > 0 ? ((stats.blocked / stats.total) * 100).toFixed(1) : 0}% block rate
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Critical</CardTitle>
                <AlertCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">{stats.critical}</div>
                <p className="text-xs text-muted-foreground">Require immediate action</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">High Severity</CardTitle>
                <Activity className="h-4 w-4 text-chart-4" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-chart-4">{stats.high}</div>
                <p className="text-xs text-muted-foreground">Need investigation</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Active Threats</CardTitle>
                  <CardDescription>
                    Detected security events requiring attention ({filteredThreats.length} threats)
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="jailbreak">Jailbreak</SelectItem>
                      <SelectItem value="prompt_injection">Prompt Injection</SelectItem>
                      <SelectItem value="data_poisoning">Data Poisoning</SelectItem>
                      <SelectItem value="adversarial_input">Adversarial Input</SelectItem>
                      <SelectItem value="pii_leakage">PII Leakage</SelectItem>
                      <SelectItem value="model_extraction">Model Extraction</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={severityFilter} onValueChange={setSeverityFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severities</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search threats..."
                      className="pl-9 w-[240px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredThreats.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No threats detected</p>
                  <p className="text-sm text-muted-foreground">
                    {threats.length === 0 ? "All requests are clean" : "Try adjusting your filters"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredThreats.map((threat) => (
                    <div
                      key={threat.id}
                      className="flex items-start gap-4 rounded-lg border border-border p-4 hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedThreat(threat)}
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge className={getSeverityColor(threat.severity)}>
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {threat.severity.toUpperCase()}
                            </span>
                          </Badge>
                          <Badge variant="outline" className={getTypeColor(threat.type)}>
                            {threat.type.replace(/_/g, " ").toUpperCase()}
                          </Badge>
                          <Badge variant="outline" className="ml-auto">
                            {threat.blocked ? "BLOCKED" : "FLAGGED"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{threat.reason}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                          <span>{threat.metadata.endpoint}</span>
                          <span>User: {threat.metadata.userId}</span>
                          <span>{threat.timestamp.toLocaleTimeString()}</span>
                          <span className="ml-auto">Confidence: {(threat.confidence * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {selectedThreat && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Threat Details</CardTitle>
                    <CardDescription>Detailed analysis of threat {selectedThreat.id.slice(0, 16)}...</CardDescription>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedThreat(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="text-sm font-medium">Threat Type</label>
                      <p className="text-sm text-muted-foreground">
                        {selectedThreat.type.replace(/_/g, " ").toUpperCase()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Severity</label>
                      <p className="text-sm text-muted-foreground">{selectedThreat.severity}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Source</label>
                      <p className="text-sm text-muted-foreground">{selectedThreat.metadata.endpoint}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">User ID</label>
                      <p className="text-sm text-muted-foreground">{selectedThreat.metadata.userId}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Timestamp</label>
                      <p className="text-sm text-muted-foreground">{selectedThreat.timestamp.toLocaleString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Confidence Score</label>
                      <p className="text-sm text-muted-foreground">{(selectedThreat.confidence * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Detection Indicators</label>
                    <div className="mt-2 space-y-1">
                      {selectedThreat.indicators.map((indicator, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-chart-4 mt-0.5" />
                          <span className="text-muted-foreground">{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Input Payload</label>
                    <pre className="mt-2 rounded-lg bg-muted p-4 text-xs overflow-x-auto max-h-40">
                      {selectedThreat.input}
                    </pre>
                  </div>

                  {selectedThreat.output && (
                    <div>
                      <label className="text-sm font-medium">Output</label>
                      <pre className="mt-2 rounded-lg bg-muted p-4 text-xs overflow-x-auto max-h-40">
                        {selectedThreat.output}
                      </pre>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={() => handleCreateIncident(selectedThreat)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Create Incident
                    </Button>
                    <Button variant="outline" onClick={() => handleAddToBlocklist(selectedThreat)}>
                      <Ban className="mr-2 h-4 w-4" />
                      Add to Blocklist
                    </Button>
                    <Button variant="outline" onClick={() => handleMarkFalsePositive(selectedThreat)}>
                      <X className="mr-2 h-4 w-4" />
                      Mark as False Positive
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="engine" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detection Engine Configuration</CardTitle>
              <CardDescription>Configure core scanning engine and behavioral semantics analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Real-time Scanning</Label>
                    <p className="text-sm text-muted-foreground">Scan all inputs/outputs in real-time</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Behavioral Analysis</Label>
                    <p className="text-sm text-muted-foreground">Enable behavioral semantics analysis</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-blocking</Label>
                    <p className="text-sm text-muted-foreground">Automatically block high-confidence threats</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Global Confidence Threshold</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider defaultValue={[75]} max={100} step={5} className="flex-1" />
                    <span className="text-sm font-medium w-12">75%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Minimum confidence score to trigger detection</p>
                </div>

                <div>
                  <Label>Scan Depth</Label>
                  <Select defaultValue="deep">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="surface">Surface (Fast)</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="deep">Deep Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEngineConfig}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </Button>
                <Button variant="outline" onClick={() => handleTestDetector("engine")}>
                  <Play className="mr-2 h-4 w-4" />
                  Test Engine
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="injection" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Injection Scanner</CardTitle>
              <CardDescription>
                LLM-based classifiers for direct and indirect injection detection (OWASP LLM01)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Prompt Injection Detection</Label>
                    <p className="text-sm text-muted-foreground">Enable prompt injection scanning</p>
                  </div>
                  <Switch
                    checked={engineConfig.promptInjection.enabled}
                    onCheckedChange={(checked) =>
                      setEngineConfig({
                        ...engineConfig,
                        promptInjection: { ...engineConfig.promptInjection, enabled: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Direct Injection Detection</Label>
                    <p className="text-sm text-muted-foreground">Detect direct prompt manipulation attempts</p>
                  </div>
                  <Switch
                    checked={engineConfig.promptInjection.directDetection}
                    onCheckedChange={(checked) =>
                      setEngineConfig({
                        ...engineConfig,
                        promptInjection: { ...engineConfig.promptInjection, directDetection: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Indirect Injection Detection</Label>
                    <p className="text-sm text-muted-foreground">Detect injections via external content</p>
                  </div>
                  <Switch
                    checked={engineConfig.promptInjection.indirectDetection}
                    onCheckedChange={(checked) =>
                      setEngineConfig({
                        ...engineConfig,
                        promptInjection: { ...engineConfig.promptInjection, indirectDetection: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Block on Detection</Label>
                    <p className="text-sm text-muted-foreground">Automatically block detected injections</p>
                  </div>
                  <Switch
                    checked={engineConfig.promptInjection.blockOnDetection}
                    onCheckedChange={(checked) =>
                      setEngineConfig({
                        ...engineConfig,
                        promptInjection: { ...engineConfig.promptInjection, blockOnDetection: checked },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>LLM Classifier Model</Label>
                  <Select
                    value={engineConfig.promptInjection.llmClassifier}
                    onValueChange={(value) =>
                      setEngineConfig({
                        ...engineConfig,
                        promptInjection: { ...engineConfig.promptInjection, llmClassifier: value },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="deberta-v3">DeBERTa v3 (ProtectAI)</SelectItem>
                      <SelectItem value="bert-base">BERT Base</SelectItem>
                      <SelectItem value="roberta-large">RoBERTa Large</SelectItem>
                      <SelectItem value="custom">Custom Model</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Using ProtectAI's DeBERTa for high-accuracy injection detection
                  </p>
                </div>

                <div>
                  <Label>Confidence Threshold</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[engineConfig.promptInjection.confidenceThreshold * 100]}
                      onValueChange={([value]) =>
                        setEngineConfig({
                          ...engineConfig,
                          promptInjection: { ...engineConfig.promptInjection, confidenceThreshold: value / 100 },
                        })
                      }
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">
                      {(engineConfig.promptInjection.confidenceThreshold * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 space-y-2">
                <h4 className="text-sm font-medium">Detection Patterns</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• System instruction override attempts</p>
                  <p>• Role manipulation (DAN, developer mode)</p>
                  <p>• Instruction hierarchy violations</p>
                  <p>• Context boundary escapes</p>
                  <p>• Indirect injections via documents/URLs</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEngineConfig}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </Button>
                <Button variant="outline" onClick={() => handleTestDetector("prompt-injection")}>
                  <Play className="mr-2 h-4 w-4" />
                  Test Scanner
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="behavioral" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Profiling</CardTitle>
              <CardDescription>
                Session analysis for jailbreaks, escalation, and multi-turn manipulations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Behavioral Profiling</Label>
                    <p className="text-sm text-muted-foreground">Enable user session behavioral analysis</p>
                  </div>
                  <Switch
                    checked={engineConfig.behavioralProfiling.enabled}
                    onCheckedChange={(checked) =>
                      setEngineConfig({
                        ...engineConfig,
                        behavioralProfiling: { ...engineConfig.behavioralProfiling, enabled: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Session Analysis</Label>
                    <p className="text-sm text-muted-foreground">Track user behavior across sessions</p>
                  </div>
                  <Switch
                    checked={engineConfig.behavioralProfiling.sessionAnalysis}
                    onCheckedChange={(checked) =>
                      setEngineConfig({
                        ...engineConfig,
                        behavioralProfiling: { ...engineConfig.behavioralProfiling, sessionAnalysis: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Jailbreak Detection</Label>
                    <p className="text-sm text-muted-foreground">Detect jailbreak attempts and patterns</p>
                  </div>
                  <Switch
                    checked={engineConfig.behavioralProfiling.jailbreakDetection}
                    onCheckedChange={(checked) =>
                      setEngineConfig({
                        ...engineConfig,
                        behavioralProfiling: { ...engineConfig.behavioralProfiling, jailbreakDetection: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Escalation Tracking</Label>
                    <p className="text-sm text-muted-foreground">Monitor privilege escalation attempts</p>
                  </div>
                  <Switch
                    checked={engineConfig.behavioralProfiling.escalationTracking}
                    onCheckedChange={(checked) =>
                      setEngineConfig({
                        ...engineConfig,
                        behavioralProfiling: { ...engineConfig.behavioralProfiling, escalationTracking: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Multi-turn Analysis</Label>
                    <p className="text-sm text-muted-foreground">Analyze patterns across multiple turns</p>
                  </div>
                  <Switch
                    checked={engineConfig.behavioralProfiling.multiTurnAnalysis}
                    onCheckedChange={(checked) =>
                      setEngineConfig({
                        ...engineConfig,
                        behavioralProfiling: { ...engineConfig.behavioralProfiling, multiTurnAnalysis: checked },
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label>Anomaly Threshold</Label>
                <div className="flex items-center gap-4 mt-2">
                  <Slider
                    value={[engineConfig.behavioralProfiling.anomalyThreshold * 100]}
                    onValueChange={([value]) =>
                      setEngineConfig({
                        ...engineConfig,
                        behavioralProfiling: { ...engineConfig.behavioralProfiling, anomalyThreshold: value / 100 },
                      })
                    }
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">
                    {(engineConfig.behavioralProfiling.anomalyThreshold * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Sensitivity for detecting behavioral anomalies</p>
              </div>

              <div className="rounded-lg border border-border p-4 space-y-2">
                <h4 className="text-sm font-medium">Behavioral Indicators</h4>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>• Rapid query escalation patterns</p>
                  <p>• Unusual session velocity spikes</p>
                  <p>• Multi-turn manipulation sequences</p>
                  <p>• Context switching anomalies</p>
                  <p>• Privilege escalation attempts</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEngineConfig}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </Button>
                <Button variant="outline" onClick={() => handleTestDetector("behavioral")}>
                  <Play className="mr-2 h-4 w-4" />
                  Test Profiling
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="semantic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Semantic Detectors</CardTitle>
              <CardDescription>Toxicity, hallucination, bias, and PII detection</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Toxicity Detection</Label>
                    <p className="text-sm text-muted-foreground">Detect toxic or harmful content</p>
                  </div>
                  <Switch
                    checked={engineConfig.semanticDetectors.toxicityEnabled}
                    onCheckedChange={(checked) =>
                      setEngineConfig({
                        ...engineConfig,
                        semanticDetectors: { ...engineConfig.semanticDetectors, toxicityEnabled: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Hallucination Detection</Label>
                    <p className="text-sm text-muted-foreground">Detect factually incorrect outputs</p>
                  </div>
                  <Switch
                    checked={engineConfig.semanticDetectors.hallucinationEnabled}
                    onCheckedChange={(checked) =>
                      setEngineConfig({
                        ...engineConfig,
                        semanticDetectors: { ...engineConfig.semanticDetectors, hallucinationEnabled: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Bias Detection</Label>
                    <p className="text-sm text-muted-foreground">Detect biased or discriminatory content</p>
                  </div>
                  <Switch
                    checked={engineConfig.semanticDetectors.biasDetection}
                    onCheckedChange={(checked) =>
                      setEngineConfig({
                        ...engineConfig,
                        semanticDetectors: { ...engineConfig.semanticDetectors, biasDetection: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>PII Detection</Label>
                    <p className="text-sm text-muted-foreground">Detect personally identifiable information</p>
                  </div>
                  <Switch
                    checked={engineConfig.semanticDetectors.piiDetection}
                    onCheckedChange={(checked) =>
                      setEngineConfig({
                        ...engineConfig,
                        semanticDetectors: { ...engineConfig.semanticDetectors, piiDetection: checked },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Toxicity Threshold</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[engineConfig.semanticDetectors.toxicityThreshold * 100]}
                      onValueChange={([value]) =>
                        setEngineConfig({
                          ...engineConfig,
                          semanticDetectors: { ...engineConfig.semanticDetectors, toxicityThreshold: value / 100 },
                        })
                      }
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">
                      {(engineConfig.semanticDetectors.toxicityThreshold * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                <div>
                  <Label>Hallucination Threshold</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[engineConfig.semanticDetectors.hallucinationThreshold * 100]}
                      onValueChange={([value]) =>
                        setEngineConfig({
                          ...engineConfig,
                          semanticDetectors: { ...engineConfig.semanticDetectors, hallucinationThreshold: value / 100 },
                        })
                      }
                      max={100}
                      step={5}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">
                      {(engineConfig.semanticDetectors.hallucinationThreshold * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveEngineConfig}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </Button>
                <Button variant="outline" onClick={() => handleTestDetector("semantic")}>
                  <Play className="mr-2 h-4 w-4" />
                  Test Detectors
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Custom Rule Builder</CardTitle>
                  <CardDescription>Create behavioral threshold rules for specific attack patterns</CardDescription>
                </div>
                <Button onClick={handleAddRule}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Rule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {customRules.map((rule) => (
                  <Card key={rule.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Switch checked={rule.enabled} onCheckedChange={() => handleToggleRule(rule.id)} />
                          <div>
                            <CardTitle className="text-base">{rule.name}</CardTitle>
                            <CardDescription>{rule.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getSeverityColor(rule.severity)}>{rule.severity.toUpperCase()}</Badge>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteRule(rule.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs">Conditions</Label>
                          <div className="mt-2 space-y-2">
                            {rule.conditions.map((condition, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                <Badge variant="outline">{condition.field}</Badge>
                                <span className="text-muted-foreground">{condition.operator}</span>
                                <Badge variant="outline">{condition.value}</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-muted-foreground">Action:</span>
                          <Badge>{rule.action.toUpperCase()}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detection Analytics</CardTitle>
              <CardDescription>Performance metrics and effectiveness of detection systems</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(analytics).map(([key, data]) => (
                  <div key={key} className="rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</h4>
                      <Badge variant={data.accuracy > 90 ? "default" : "secondary"}>{data.accuracy}% Accuracy</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Detected</p>
                        <p className="text-lg font-semibold">{data.detected}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Blocked</p>
                        <p className="text-lg font-semibold">{data.blocked}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">False Positives</p>
                        <p className="text-lg font-semibold">{data.falsePositives}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
