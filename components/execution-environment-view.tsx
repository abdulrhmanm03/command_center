"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Cpu, Network, Shield, GitBranch, AlertTriangle, CheckCircle, Activity } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SystemTelemetry {
  id: string
  timestamp: Date
  cpu: number
  memory: number
  ioUsage: number
  inferenceTime: number
  status: "normal" | "elevated" | "critical"
  modelId: string
}

interface NetworkCall {
  id: string
  timestamp: Date
  source: string
  destination: string
  protocol: string
  status: "allowed" | "blocked" | "suspicious"
  reason: string
}

interface ContainerIntegrity {
  id: string
  container: string
  fileHash: string
  expectedHash: string
  status: "verified" | "compromised" | "unknown"
  lastCheck: Date
  component: "model" | "embeddings" | "vector_store"
}

interface ProcessLineage {
  id: string
  sessionId: string
  userId: string
  orchestrator: string
  apiEndpoint: string
  timestamp: Date
  correlation: number
}

export function ExecutionEnvironmentView() {
  const [telemetry, setTelemetry] = useState<SystemTelemetry[]>([])
  const [networkCalls, setNetworkCalls] = useState<NetworkCall[]>([])
  const [containerIntegrity, setContainerIntegrity] = useState<ContainerIntegrity[]>([
    {
      id: "1",
      container: "vts-llm-1-container",
      fileHash: "a3f5c9d2e1b4",
      expectedHash: "a3f5c9d2e1b4",
      status: "verified",
      lastCheck: new Date(),
      component: "model",
    },
    {
      id: "2",
      container: "embeddings-service",
      fileHash: "b7e2f8a1c3d5",
      expectedHash: "b7e2f8a1c3d5",
      status: "verified",
      lastCheck: new Date(),
      component: "embeddings",
    },
    {
      id: "3",
      container: "vector-store",
      fileHash: "c9d4e6f2a8b1",
      expectedHash: "c9d4e6f2a8b1",
      status: "verified",
      lastCheck: new Date(),
      component: "vector_store",
    },
  ])
  const [processLineage, setProcessLineage] = useState<ProcessLineage[]>([])
  const [selectedModel, setSelectedModel] = useState<string>("all")

  useEffect(() => {
    // Generate initial telemetry data
    const generateTelemetry = (): SystemTelemetry => {
      const cpuUsage = Math.random() * 100
      const memoryUsage = Math.random() * 100
      const status = cpuUsage > 80 || memoryUsage > 85 ? "critical" : cpuUsage > 60 ? "elevated" : "normal"

      return {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date(),
        cpu: cpuUsage,
        memory: memoryUsage,
        ioUsage: Math.random() * 100,
        inferenceTime: Math.random() * 500 + 100,
        status,
        modelId: ["vts-llm-1", "vts-llm-2", "client-model-a"][Math.floor(Math.random() * 3)],
      }
    }

    const generateNetworkCall = (): NetworkCall => {
      const statuses: NetworkCall["status"][] = ["allowed", "blocked", "suspicious"]
      const status = statuses[Math.floor(Math.random() * statuses.length)]

      return {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date(),
        source: "model-agent",
        destination: ["api.openai.com", "internal-db", "external-api.com"][Math.floor(Math.random() * 3)],
        protocol: "HTTPS",
        status,
        reason:
          status === "blocked"
            ? "Unauthorized external access"
            : status === "suspicious"
              ? "Unusual destination"
              : "Normal operation",
      }
    }

    const generateProcessLineage = (): ProcessLineage => ({
      id: Math.random().toString(36).substring(7),
      sessionId: `session_${Math.floor(Math.random() * 1000)}`,
      userId: `user_${Math.floor(Math.random() * 100)}`,
      orchestrator: ["api-gateway", "load-balancer", "direct"][Math.floor(Math.random() * 3)],
      apiEndpoint: ["/api/chat", "/api/completion", "/api/embedding"][Math.floor(Math.random() * 3)],
      timestamp: new Date(),
      correlation: Math.random(),
    })

    // Initialize data
    setTelemetry(Array.from({ length: 10 }, generateTelemetry))
    setNetworkCalls(Array.from({ length: 8 }, generateNetworkCall))
    setProcessLineage(Array.from({ length: 6 }, generateProcessLineage))

    // Real-time updates
    const interval = setInterval(() => {
      setTelemetry((prev) => [generateTelemetry(), ...prev].slice(0, 50))
      setNetworkCalls((prev) => [generateNetworkCall(), ...prev].slice(0, 30))
      setProcessLineage((prev) => [generateProcessLineage(), ...prev].slice(0, 20))
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const filteredTelemetry = telemetry.filter((t) => selectedModel === "all" || t.modelId === selectedModel)

  const criticalTelemetry = telemetry.filter((t) => t.status === "critical").length
  const blockedCalls = networkCalls.filter((n) => n.status === "blocked").length
  const compromisedContainers = containerIntegrity.filter((c) => c.status === "compromised").length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
      case "blocked":
      case "compromised":
        return "destructive"
      case "elevated":
      case "suspicious":
        return "default"
      case "verified":
      case "allowed":
        return "secondary"
      default:
        return "outline"
    }
  }

  const handleVerifyIntegrity = (containerId: string) => {
    console.log("[v0] Verifying container integrity:", containerId)
    setContainerIntegrity((prev) =>
      prev.map((c) =>
        c.id === containerId
          ? {
              ...c,
              status: "verified",
              lastCheck: new Date(),
            }
          : c,
      ),
    )
  }

  const handleBlockNetwork = (callId: string) => {
    console.log("[v0] Blocking network call:", callId)
    setNetworkCalls((prev) => prev.map((n) => (n.id === callId ? { ...n, status: "blocked" } : n)))
  }

  const handleInvestigateProcess = (processId: string) => {
    console.log("[v0] Investigating process lineage:", processId)
    alert(`Opening detailed investigation for process ${processId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Execution Environment Metrics</h2>
        <p className="text-muted-foreground">
          Monitor system telemetry, network activity, and container integrity to detect model hijacks
        </p>
      </div>

      {/* Alert Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Telemetry</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{criticalTelemetry}</div>
            <p className="text-xs text-muted-foreground">High resource usage detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Network Calls</CardTitle>
            <Network className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{blockedCalls}</div>
            <p className="text-xs text-muted-foreground">Unauthorized access attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Container Status</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{containerIntegrity.length - compromisedContainers}</div>
            <p className="text-xs text-muted-foreground">Verified containers</p>
          </CardContent>
        </Card>
      </div>

      {/* System Telemetry */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Cpu className="h-5 w-5" />
                System Telemetry
              </CardTitle>
              <CardDescription>CPU, memory, and I/O usage per inference call</CardDescription>
            </div>
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Models</SelectItem>
                <SelectItem value="vts-llm-1">VTS LLM-1</SelectItem>
                <SelectItem value="vts-llm-2">VTS LLM-2</SelectItem>
                <SelectItem value="client-model-a">Client Model A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTelemetry.slice(0, 5).map((t) => (
              <div key={t.id} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{t.modelId}</span>
                    <Badge variant={getStatusColor(t.status)}>{t.status}</Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{t.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">CPU</div>
                    <div className="font-medium">{t.cpu.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Memory</div>
                    <div className="font-medium">{t.memory.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">I/O</div>
                    <div className="font-medium">{t.ioUsage.toFixed(1)}%</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Inference</div>
                    <div className="font-medium">{t.inferenceTime.toFixed(0)}ms</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Network Calls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Network className="h-5 w-5" />
              Network Calls from Model Agents
            </CardTitle>
            <CardDescription>Monitor unexpected external connections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {networkCalls.slice(0, 5).map((call) => (
                <div key={call.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{call.destination}</span>
                      <Badge variant={getStatusColor(call.status)} className="text-xs">
                        {call.status}
                      </Badge>
                    </div>
                    {call.status !== "blocked" && (
                      <Button variant="outline" size="sm" onClick={() => handleBlockNetwork(call.id)}>
                        Block
                      </Button>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Source: {call.source}</div>
                    <div>Protocol: {call.protocol}</div>
                    <div>Reason: {call.reason}</div>
                    <div>{call.timestamp.toLocaleTimeString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Container Integrity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Container Integrity
            </CardTitle>
            <CardDescription>Hash verification of model files and embeddings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {containerIntegrity.map((container) => (
                <div key={container.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{container.container}</span>
                      {container.status === "verified" ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleVerifyIntegrity(container.id)}>
                      Verify
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <div>Component: {container.component}</div>
                    <div className="font-mono">Hash: {container.fileHash}</div>
                    <div>Last check: {container.lastCheck.toLocaleTimeString()}</div>
                    <Badge variant={getStatusColor(container.status)} className="text-xs mt-1">
                      {container.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Process Lineage */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Process Lineage
          </CardTitle>
          <CardDescription>Correlation between user sessions, orchestrators, and API endpoints</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {processLineage.slice(0, 6).map((process) => (
              <div key={process.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1 grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground text-xs">Session</div>
                    <div className="font-mono text-xs">{process.sessionId}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">User</div>
                    <div className="font-mono text-xs">{process.userId}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Orchestrator</div>
                    <div className="text-xs">{process.orchestrator}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground text-xs">Endpoint</div>
                    <div className="font-mono text-xs">{process.apiEndpoint}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right text-xs">
                    <div className="text-muted-foreground">Correlation</div>
                    <div className="font-medium">{(process.correlation * 100).toFixed(1)}%</div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleInvestigateProcess(process.id)}>
                    Investigate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
