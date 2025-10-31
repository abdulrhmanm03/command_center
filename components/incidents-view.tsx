"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, Clock } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ActivityLog {
  time: string
  action: "BLOCKED" | "FLAGGED" | "ALLOWED"
  detail: string
}

export function IncidentsView() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    { time: "14:32:15", action: "BLOCKED", detail: "Data poisoning attempt from 192.168.1.45" },
    { time: "14:27:42", action: "BLOCKED", detail: "Prompt injection detected in chat interface" },
    { time: "14:20:08", action: "BLOCKED", detail: "Jailbreak pattern matched: DAN variant" },
    { time: "14:14:33", action: "FLAGGED", detail: "Suspicious query pattern from 192.168.1.67" },
    { time: "14:08:19", action: "BLOCKED", detail: "Adversarial input with unicode manipulation" },
    { time: "14:02:45", action: "ALLOWED", detail: "Clean request processed successfully" },
    { time: "13:58:12", action: "BLOCKED", detail: "Rate limit exceeded for IP 10.0.0.123" },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const interval = setInterval(() => {
      const actions: ActivityLog["action"][] = ["BLOCKED", "FLAGGED", "ALLOWED"]
      const details = [
        "Data poisoning attempt detected",
        "Prompt injection blocked",
        "Jailbreak pattern matched",
        "Clean request processed",
        "Adversarial input detected",
        "PII leakage prevented",
        "Model extraction attempt blocked",
        "Rate limit enforced",
      ]

      const now = new Date()
      const newLog: ActivityLog = {
        time: now.toLocaleTimeString(),
        action: actions[Math.floor(Math.random() * actions.length)],
        detail: details[Math.floor(Math.random() * details.length)],
      }

      setActivityLogs((prev) => [newLog, ...prev].slice(0, 50))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const incidents = [
    {
      id: "INC-2024-1047",
      title: "Coordinated Data Poisoning Attack",
      severity: "critical",
      status: "investigating",
      timestamp: "2024-10-28 14:30:00",
      threats: 23,
      sources: ["192.168.1.45", "192.168.1.46", "192.168.1.47"],
      description: "Multiple sources attempting to inject poisoned training data",
    },
    {
      id: "INC-2024-1046",
      title: "Prompt Injection Campaign",
      severity: "high",
      status: "contained",
      timestamp: "2024-10-28 12:15:00",
      threats: 15,
      sources: ["10.0.0.123"],
      description: "Systematic attempts to extract system prompts and override instructions",
    },
    {
      id: "INC-2024-1045",
      title: "Model Extraction Attempt",
      severity: "high",
      status: "resolved",
      timestamp: "2024-10-28 09:45:00",
      threats: 8,
      sources: ["172.16.0.89", "172.16.0.90"],
      description: "Coordinated probing to extract model architecture and weights",
    },
    {
      id: "INC-2024-1044",
      title: "Jailbreak Pattern Detection",
      severity: "medium",
      status: "resolved",
      timestamp: "2024-10-27 18:20:00",
      threats: 12,
      sources: ["192.168.1.67"],
      description: "Multiple jailbreak attempts using various known patterns",
    },
    {
      id: "INC-2024-1043",
      title: "Adversarial Input Flood",
      severity: "medium",
      status: "resolved",
      timestamp: "2024-10-27 14:10:00",
      threats: 34,
      sources: ["10.0.0.234", "10.0.0.235"],
      description: "High volume of adversarial inputs designed to cause misclassification",
    },
  ]

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      searchQuery === "" ||
      incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      incident.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || incident.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "investigating":
        return "bg-chart-4 text-primary-foreground"
      case "contained":
        return "bg-chart-3 text-primary-foreground"
      case "resolved":
        return "bg-chart-2 text-primary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
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

  const handleExport = () => {
    const csv = activityLogs.map((log) => `${log.time},${log.action},${log.detail}`).join("\n")
    const blob = new Blob([`Timestamp,Action,Detail\n${csv}`], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `firewall-logs-${new Date().toISOString()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Incidents & Logs</h1>
        <p className="text-muted-foreground">Security incident tracking and forensic analysis</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Security Incidents</CardTitle>
              <CardDescription>Tracked security events and their resolution status</CardDescription>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="contained">Contained</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search incidents..."
                  className="pl-9 w-[240px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredIncidents.map((incident) => (
              <div
                key={incident.id}
                className="flex items-start gap-4 rounded-lg border border-border p-4 hover:bg-accent/50 cursor-pointer transition-colors"
              >
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-muted-foreground">{incident.id}</span>
                    <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                    <Badge className={getStatusColor(incident.status)} variant="outline">
                      {incident.status}
                    </Badge>
                  </div>
                  <h3 className="font-medium">{incident.title}</h3>
                  <p className="text-sm text-muted-foreground">{incident.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{incident.threats} threats detected</span>
                    <span>{incident.sources.length} source IPs</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {incident.timestamp}
                    </span>
                  </div>
                </div>
                <Button variant="outline">View Details</Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Live Activity Log</CardTitle>
              <CardDescription>
                Real-time firewall activity and decision logs ({activityLogs.length} entries)
              </CardDescription>
            </div>
            <Badge variant="outline" className="animate-pulse-glow">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Live
              </span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 font-mono text-xs max-h-96 overflow-y-auto">
            <div className="flex gap-4 border-b border-border pb-2 sticky top-0 bg-card">
              <span className="w-[180px] text-muted-foreground">Timestamp</span>
              <span className="w-[120px] text-muted-foreground">Action</span>
              <span className="flex-1 text-muted-foreground">Details</span>
            </div>
            {activityLogs.map((log, i) => (
              <div key={i} className="flex gap-4 py-1 hover:bg-accent/50 rounded px-2 -mx-2">
                <span className="w-[180px] text-muted-foreground">{log.time}</span>
                <span
                  className={`w-[120px] font-semibold ${
                    log.action === "BLOCKED"
                      ? "text-chart-4"
                      : log.action === "FLAGGED"
                        ? "text-chart-3"
                        : "text-chart-2"
                  }`}
                >
                  {log.action}
                </span>
                <span className="flex-1">{log.detail}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
