"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, TrendingUp, GitBranch, Clock, Zap, User } from "lucide-react"
import { useState, useEffect } from "react"

interface SessionMetrics {
  userId: string
  queriesPerMinute: number
  burstRate: number
  status: "normal" | "elevated" | "critical"
  lastActivity: string
}

interface PromptVariance {
  metric: string
  baseline: number
  current: number
  deviation: number
  status: "normal" | "anomaly"
}

interface APICallNode {
  id: string
  type: "model" | "retrieval" | "code_exec" | "tool"
  timestamp: string
  duration: number
}

interface TemporalPattern {
  pattern: string
  detected: string
  confidence: number
  type: "time_anomaly" | "sequence_gap" | "replay"
}

interface TokenConsumption {
  userId: string
  tokensUsed: number
  avgTokens: number
  spike: boolean
  timestamp: string
}

export function BehavioralTelemetryView() {
  const [sessions, setSessions] = useState<SessionMetrics[]>([
    { userId: "user_8472", queriesPerMinute: 45, burstRate: 12, status: "critical", lastActivity: "2s ago" },
    { userId: "user_3391", queriesPerMinute: 8, burstRate: 3, status: "normal", lastActivity: "5s ago" },
    { userId: "user_7721", queriesPerMinute: 22, burstRate: 8, status: "elevated", lastActivity: "1s ago" },
  ])

  const [promptVariances, setPromptVariances] = useState<PromptVariance[]>([
    { metric: "Prompt Length", baseline: 156, current: 892, deviation: 472, status: "anomaly" },
    { metric: "Syntax Complexity", baseline: 0.42, current: 0.39, deviation: -7, status: "normal" },
    { metric: "Embedding Distance", baseline: 0.15, current: 0.68, deviation: 353, status: "anomaly" },
    { metric: "Token Diversity", baseline: 0.73, current: 0.71, deviation: -3, status: "normal" },
  ])

  const [apiCallGraph, setApiCallGraph] = useState<APICallNode[]>([
    { id: "1", type: "model", timestamp: "14:23:01", duration: 234 },
    { id: "2", type: "retrieval", timestamp: "14:23:02", duration: 89 },
    { id: "3", type: "model", timestamp: "14:23:03", duration: 456 },
    { id: "4", type: "code_exec", timestamp: "14:23:04", duration: 1203 },
  ])

  const [temporalPatterns, setTemporalPatterns] = useState<TemporalPattern[]>([
    { pattern: "Off-hours activity spike", detected: "03:00-04:00 UTC", confidence: 94, type: "time_anomaly" },
    { pattern: "Sequence gap detected", detected: "Session user_8472", confidence: 87, type: "sequence_gap" },
    { pattern: "Potential replay attack", detected: "user_3391 → user_7721", confidence: 76, type: "replay" },
  ])

  const [tokenConsumption, setTokenConsumption] = useState<TokenConsumption[]>([
    { userId: "user_8472", tokensUsed: 45892, avgTokens: 8234, spike: true, timestamp: "14:23:05" },
    { userId: "user_3391", tokensUsed: 7821, avgTokens: 7456, spike: false, timestamp: "14:23:03" },
    { userId: "user_7721", tokensUsed: 23456, avgTokens: 9123, spike: true, timestamp: "14:23:04" },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time updates
      setSessions((prev) =>
        prev.map((session) => ({
          ...session,
          queriesPerMinute: Math.max(1, session.queriesPerMinute + Math.floor(Math.random() * 10 - 5)),
          burstRate: Math.max(1, session.burstRate + Math.floor(Math.random() * 4 - 2)),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical":
        return "destructive"
      case "elevated":
        return "default"
      case "anomaly":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "time_anomaly":
        return "destructive"
      case "sequence_gap":
        return "default"
      case "replay":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "model":
        return "🤖"
      case "retrieval":
        return "🔍"
      case "code_exec":
        return "⚙️"
      case "tool":
        return "🔧"
      default:
        return "•"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Behavioral Telemetry</h2>
        <p className="text-muted-foreground">Monitor session dynamics and behavioral fingerprints of AI usage</p>
      </div>

      {/* Session Velocity Monitoring */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Session Velocity Monitoring
              </CardTitle>
              <CardDescription>Real-time frequency and burst rate of queries per user or process</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All Sessions
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sessions.map((session, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-mono text-sm font-medium">{session.userId}</div>
                    <div className="text-xs text-muted-foreground">{session.lastActivity}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-sm font-medium">{session.queriesPerMinute} QPM</div>
                    <div className="text-xs text-muted-foreground">Queries/min</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{session.burstRate} burst</div>
                    <div className="text-xs text-muted-foreground">Burst rate</div>
                  </div>
                  <Badge variant={getStatusColor(session.status)}>{session.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Prompt Structure Variance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Prompt Structure Variance
            </CardTitle>
            <CardDescription>Changes in syntax, length, and embedding distance from normal behavior</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {promptVariances.map((variance, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{variance.metric}</span>
                    <Badge variant={getStatusColor(variance.status)} className="text-xs">
                      {variance.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>Baseline: {variance.baseline}</span>
                    <span>•</span>
                    <span>Current: {variance.current}</span>
                    <span>•</span>
                    <span className={variance.deviation > 0 ? "text-red-500" : "text-green-500"}>
                      {variance.deviation > 0 ? "+" : ""}
                      {variance.deviation}%
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${variance.status === "anomaly" ? "bg-red-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(100, Math.abs(variance.deviation))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Call Graph */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              API Call Graph
            </CardTitle>
            <CardDescription>Sequence and chaining of AI tool use</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {apiCallGraph.map((node, idx) => (
                <div key={node.id} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-lg">
                      {getNodeIcon(node.type)}
                    </div>
                    {idx < apiCallGraph.length - 1 && <div className="w-0.5 h-6 bg-border" />}
                  </div>
                  <div className="flex-1 p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm capitalize">{node.type.replace("_", " ")}</div>
                        <div className="text-xs text-muted-foreground">{node.timestamp}</div>
                      </div>
                      <div className="text-xs text-muted-foreground">{node.duration}ms</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Temporal Correlation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Temporal Correlation
            </CardTitle>
            <CardDescription>Time-of-day anomalies, sequence gaps, and replay patterns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {temporalPatterns.map((pattern, idx) => (
                <div key={idx} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm">{pattern.pattern}</span>
                    <Badge variant={getTypeColor(pattern.type)} className="text-xs">
                      {pattern.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground">Detected: {pattern.detected}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Token Consumption Patterns */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Token Consumption Patterns
            </CardTitle>
            <CardDescription>Spikes suggesting exfiltration or abuse</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tokenConsumption.map((consumption, idx) => (
                <div key={idx} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm font-medium">{consumption.userId}</span>
                    {consumption.spike && (
                      <Badge variant="destructive" className="text-xs">
                        Spike Detected
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Current</span>
                      <span className="font-medium">{consumption.tokensUsed.toLocaleString()} tokens</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Average</span>
                      <span>{consumption.avgTokens.toLocaleString()} tokens</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Variance</span>
                      <span className={consumption.spike ? "text-red-500 font-medium" : "text-green-500"}>
                        {((consumption.tokensUsed / consumption.avgTokens - 1) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Behavioral Fingerprint Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Behavioral Fingerprint Summary</CardTitle>
          <CardDescription>Aggregated behavioral patterns forming the fingerprint of AI usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-muted-foreground">Active Sessions</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-500">2</div>
              <div className="text-xs text-muted-foreground">Anomalies Detected</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-muted-foreground">Temporal Patterns</div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-500">2</div>
              <div className="text-xs text-muted-foreground">Token Spikes</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
