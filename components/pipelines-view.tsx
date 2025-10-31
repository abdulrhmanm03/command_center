"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Settings, Play, Pause, GitBranch, Database, Cpu, Network, Shield, AlertCircle } from "lucide-react"
import { NeuralNetworkVisualizer } from "@/components/neural-network-visualizer"

interface Pipeline {
  id: string
  name: string
  status: "active" | "paused" | "error"
  model: string
  endpoint: string
  requestsPerMin: number
  threatsBlocked: number
  lastActivity: string
  protectionLevel: "strict" | "balanced" | "permissive"
  dataFlow: {
    input: string
    processing: string[]
    output: string
  }
}

export function PipelinesView() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: "pipe-1",
      name: "Production Chat API",
      status: "active",
      model: "vts-llm-1", // Updated model
      endpoint: "/v1/chat/completions",
      requestsPerMin: 245,
      threatsBlocked: 12,
      lastActivity: "2 seconds ago",
      protectionLevel: "strict",
      dataFlow: {
        input: "User Input",
        processing: ["Input Validation", "Semantic Analysis", "Threat Detection", "Model Inference"],
        output: "API Response",
      },
    },
    {
      id: "pipe-2",
      name: "RAG Document Search",
      status: "active",
      model: "vts-llm-2", // Updated model
      endpoint: "/v1/embeddings",
      requestsPerMin: 89,
      threatsBlocked: 3,
      lastActivity: "5 seconds ago",
      protectionLevel: "balanced",
      dataFlow: {
        input: "Search Query",
        processing: ["Query Sanitization", "Vector Embedding", "Data Poisoning Check", "Retrieval"],
        output: "Search Results",
      },
    },
    {
      id: "pipe-3",
      name: "Content Moderation",
      status: "active",
      model: "client-model-a", // Updated model
      endpoint: "/v1/moderation",
      requestsPerMin: 156,
      threatsBlocked: 45,
      lastActivity: "1 second ago",
      protectionLevel: "strict",
      dataFlow: {
        input: "User Content",
        processing: ["PII Detection", "Toxicity Analysis", "Jailbreak Detection", "Classification"],
        output: "Moderation Result",
      },
    },
    {
      id: "pipe-4",
      name: "Training Data Pipeline",
      status: "paused",
      model: "custom-model", // Kept as custom-model
      endpoint: "/v1/training",
      requestsPerMin: 0,
      threatsBlocked: 8,
      lastActivity: "2 hours ago",
      protectionLevel: "strict",
      dataFlow: {
        input: "Training Data",
        processing: ["Data Validation", "Poisoning Detection", "Anomaly Filtering", "Model Training"],
        output: "Model Weights",
      },
    },
  ])

  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(pipelines[0])

  useEffect(() => {
    const interval = setInterval(() => {
      setPipelines((prev) =>
        prev.map((pipeline) => {
          if (pipeline.status === "active") {
            return {
              ...pipeline,
              requestsPerMin: pipeline.requestsPerMin + Math.floor(Math.random() * 10) - 3,
              threatsBlocked: Math.random() > 0.8 ? pipeline.threatsBlocked + 1 : pipeline.threatsBlocked,
              lastActivity: "just now",
            }
          }
          return pipeline
        }),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const togglePipelineStatus = (pipelineId: string) => {
    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id === pipelineId) {
          const newStatus = p.status === "active" ? "paused" : "active"
          return {
            ...p,
            status: newStatus,
            requestsPerMin: newStatus === "paused" ? 0 : p.requestsPerMin,
          }
        }
        return p
      }),
    )

    if (selectedPipeline?.id === pipelineId) {
      setSelectedPipeline((prev) => (prev ? { ...prev, status: prev.status === "active" ? "paused" : "active" } : null))
    }
  }

  const getStatusColor = (status: Pipeline["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
    }
  }

  const getProtectionBadge = (level: Pipeline["protectionLevel"]) => {
    switch (level) {
      case "strict":
        return <Badge className="bg-red-500">Strict</Badge>
      case "balanced":
        return <Badge className="bg-blue-500">Balanced</Badge>
      case "permissive":
        return <Badge className="bg-green-500">Permissive</Badge>
    }
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">AI Pipelines</h1>
          <p className="text-muted-foreground">Monitor and configure AI pipeline security</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Pipeline
        </Button>
      </div>

      <NeuralNetworkVisualizer />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pipeline List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Active Pipelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pipelines.map((pipeline) => (
              <button
                key={pipeline.id}
                onClick={() => setSelectedPipeline(pipeline)}
                className={`w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent ${
                  selectedPipeline?.id === pipeline.id ? "border-primary bg-accent" : ""
                }`}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{pipeline.name}</span>
                  <div className={`h-2 w-2 rounded-full ${getStatusColor(pipeline.status)}`} />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Cpu className="h-3 w-3" />
                  <span>{pipeline.model}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{pipeline.requestsPerMin} req/min</span>
                  <Badge variant="outline" className="text-xs">
                    {pipeline.threatsBlocked} blocked
                  </Badge>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Pipeline Details */}
        {selectedPipeline && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle>{selectedPipeline.name}</CardTitle>
                    {getProtectionBadge(selectedPipeline.protectionLevel)}
                  </div>
                  <CardDescription className="mt-1">
                    {selectedPipeline.endpoint} • Last activity: {selectedPipeline.lastActivity}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {selectedPipeline.status === "active" ? (
                    <Button variant="outline" size="sm" onClick={() => togglePipelineStatus(selectedPipeline.id)}>
                      <Pause className="mr-2 h-4 w-4" />
                      Pause
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => togglePipelineStatus(selectedPipeline.id)}>
                      <Play className="mr-2 h-4 w-4" />
                      Resume
                    </Button>
                  )}
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="dataflow">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="dataflow">Data Flow</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="config">Configuration</TabsTrigger>
                </TabsList>

                <TabsContent value="dataflow" className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center gap-2 text-sm font-medium">
                      <GitBranch className="h-4 w-4" />
                      Pipeline Data Flow
                    </div>
                    <div className="space-y-3">
                      {/* Input */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                          <Database className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{selectedPipeline.dataFlow.input}</p>
                          <p className="text-xs text-muted-foreground">Entry point</p>
                        </div>
                      </div>

                      {/* Processing Steps */}
                      {selectedPipeline.dataFlow.processing.map((step, index) => (
                        <div key={index}>
                          <div className="ml-5 h-6 w-px bg-border" />
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                              <Shield className="h-5 w-5 text-purple-500" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{step}</p>
                              <p className="text-xs text-muted-foreground">Processing stage {index + 1}</p>
                            </div>
                          </div>
                        </div>
                      ))}

                      {/* Output */}
                      <div>
                        <div className="ml-5 h-6 w-px bg-border" />
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                            <Network className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{selectedPipeline.dataFlow.output}</p>
                            <p className="text-xs text-muted-foreground">Final output</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Throughput</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedPipeline.requestsPerMin}</div>
                        <p className="text-xs text-muted-foreground">requests/minute</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Threats Blocked</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{selectedPipeline.threatsBlocked}</div>
                        <p className="text-xs text-muted-foreground">in last hour</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">Block Rate</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {selectedPipeline.requestsPerMin > 0
                            ? ((selectedPipeline.threatsBlocked / selectedPipeline.requestsPerMin) * 100).toFixed(2)
                            : "0.00"}
                          %
                        </div>
                        <p className="text-xs text-muted-foreground">of total requests</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Active Security Layers</CardTitle>
                      <CardDescription>Protection mechanisms enabled for this pipeline</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        {
                          name: "Input Validation",
                          enabled: true,
                          description: "Validates input format and structure",
                        },
                        { name: "Semantic Analysis", enabled: true, description: "Analyzes intent and context" },
                        { name: "Threat Detection", enabled: true, description: "Identifies malicious patterns" },
                        { name: "Output Filtering", enabled: true, description: "Sanitizes model responses" },
                        { name: "Rate Limiting", enabled: true, description: "Prevents abuse and DoS" },
                        { name: "Behavioral Monitoring", enabled: true, description: "Tracks usage patterns" },
                      ].map((layer) => (
                        <div key={layer.name} className="flex items-center justify-between rounded-lg border p-3">
                          <div>
                            <p className="font-medium">{layer.name}</p>
                            <p className="text-xs text-muted-foreground">{layer.description}</p>
                          </div>
                          <Switch checked={layer.enabled} />
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Threat Detection Rules</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        { type: "Data Poisoning", count: 12, severity: "critical" },
                        { type: "Prompt Injection", count: 8, severity: "high" },
                        { type: "Jailbreak", count: 15, severity: "high" },
                        { type: "PII Leakage", count: 6, severity: "medium" },
                      ].map((rule) => (
                        <div key={rule.type} className="flex items-center justify-between rounded-lg border p-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">{rule.type}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {rule.count} rules
                            </Badge>
                            <Badge
                              className={
                                rule.severity === "critical"
                                  ? "bg-red-500"
                                  : rule.severity === "high"
                                    ? "bg-orange-500"
                                    : "bg-yellow-500"
                              }
                            >
                              {rule.severity}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="config" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Pipeline Configuration</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Pipeline Name</Label>
                        <Input value={selectedPipeline.name} />
                      </div>
                      <div className="space-y-2">
                        <Label>Model</Label>
                        <Input value={selectedPipeline.model} />
                      </div>
                      <div className="space-y-2">
                        <Label>Endpoint</Label>
                        <Input value={selectedPipeline.endpoint} />
                      </div>
                      <div className="space-y-2">
                        <Label>Protection Level</Label>
                        <div className="flex gap-2">
                          <Button
                            variant={selectedPipeline.protectionLevel === "strict" ? "default" : "outline"}
                            size="sm"
                          >
                            Strict
                          </Button>
                          <Button
                            variant={selectedPipeline.protectionLevel === "balanced" ? "default" : "outline"}
                            size="sm"
                          >
                            Balanced
                          </Button>
                          <Button
                            variant={selectedPipeline.protectionLevel === "permissive" ? "default" : "outline"}
                            size="sm"
                          >
                            Permissive
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Advanced Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Logging</p>
                          <p className="text-sm text-muted-foreground">Log all requests and responses</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Real-time Alerts</p>
                          <p className="text-sm text-muted-foreground">Send alerts for critical threats</p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto-scaling</p>
                          <p className="text-sm text-muted-foreground">Scale based on traffic</p>
                        </div>
                        <Switch />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Save Changes</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
