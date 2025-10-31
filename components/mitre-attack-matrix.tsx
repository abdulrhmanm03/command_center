"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { AlertCircle, CheckCircle2, XCircle, Shield } from "lucide-react"

const mitreData = {
  tactics: [
    { id: "TA0001", name: "Initial Access", color: "#ef4444" },
    { id: "TA0002", name: "Execution", color: "#f97316" },
    { id: "TA0003", name: "Persistence", color: "#fbbf24" },
    { id: "TA0004", name: "Privilege Escalation", color: "#84cc16" },
    { id: "TA0005", name: "Defense Evasion", color: "#06b6d4" },
    { id: "TA0006", name: "Credential Access", color: "#3b82f6" },
    { id: "TA0007", name: "Discovery", color: "#8b5cf6" },
    { id: "TA0008", name: "Lateral Movement", color: "#a855f7" },
    { id: "TA0009", name: "Collection", color: "#ec4899" },
    { id: "TA0010", name: "Exfiltration", color: "#f43f5e" },
    { id: "TA0011", name: "Command and Control", color: "#14b8a6" },
    { id: "TA0040", name: "Impact", color: "#dc2626" },
  ],
  techniques: {
    TA0001: [
      { id: "T1566", name: "Phishing", detections: 45, blocked: 42, severity: "high" },
      { id: "T1190", name: "Exploit Public-Facing Application", detections: 23, blocked: 20, severity: "critical" },
      { id: "T1133", name: "External Remote Services", detections: 12, blocked: 10, severity: "medium" },
    ],
    TA0002: [
      { id: "T1059", name: "Command and Scripting Interpreter", detections: 67, blocked: 60, severity: "high" },
      { id: "T1203", name: "Exploitation for Client Execution", detections: 15, blocked: 14, severity: "critical" },
      { id: "T1204", name: "User Execution", detections: 34, blocked: 28, severity: "medium" },
    ],
    TA0003: [
      { id: "T1547", name: "Boot or Logon Autostart Execution", detections: 28, blocked: 25, severity: "high" },
      { id: "T1053", name: "Scheduled Task/Job", detections: 19, blocked: 18, severity: "medium" },
      { id: "T1136", name: "Create Account", detections: 8, blocked: 8, severity: "critical" },
    ],
    TA0004: [
      { id: "T1068", name: "Exploitation for Privilege Escalation", detections: 12, blocked: 11, severity: "critical" },
      { id: "T1078", name: "Valid Accounts", detections: 45, blocked: 38, severity: "high" },
      { id: "T1055", name: "Process Injection", detections: 22, blocked: 20, severity: "high" },
    ],
    TA0005: [
      { id: "T1070", name: "Indicator Removal", detections: 31, blocked: 28, severity: "high" },
      { id: "T1562", name: "Impair Defenses", detections: 18, blocked: 16, severity: "critical" },
      { id: "T1027", name: "Obfuscated Files or Information", detections: 56, blocked: 50, severity: "medium" },
    ],
    TA0006: [
      { id: "T1110", name: "Brute Force", detections: 89, blocked: 85, severity: "high" },
      { id: "T1003", name: "OS Credential Dumping", detections: 14, blocked: 13, severity: "critical" },
      { id: "T1555", name: "Credentials from Password Stores", detections: 7, blocked: 6, severity: "high" },
    ],
    TA0007: [
      { id: "T1087", name: "Account Discovery", detections: 42, blocked: 35, severity: "medium" },
      { id: "T1083", name: "File and Directory Discovery", detections: 67, blocked: 55, severity: "low" },
      { id: "T1046", name: "Network Service Discovery", detections: 38, blocked: 32, severity: "medium" },
    ],
    TA0008: [
      { id: "T1021", name: "Remote Services", detections: 29, blocked: 26, severity: "high" },
      { id: "T1570", name: "Lateral Tool Transfer", detections: 15, blocked: 14, severity: "medium" },
      { id: "T1080", name: "Taint Shared Content", detections: 5, blocked: 5, severity: "high" },
    ],
    TA0009: [
      { id: "T1005", name: "Data from Local System", detections: 23, blocked: 18, severity: "medium" },
      { id: "T1039", name: "Data from Network Shared Drive", detections: 12, blocked: 10, severity: "medium" },
      { id: "T1056", name: "Input Capture", detections: 8, blocked: 7, severity: "high" },
    ],
    TA0010: [
      { id: "T1041", name: "Exfiltration Over C2 Channel", detections: 16, blocked: 15, severity: "critical" },
      { id: "T1048", name: "Exfiltration Over Alternative Protocol", detections: 9, blocked: 8, severity: "high" },
      { id: "T1567", name: "Exfiltration Over Web Service", detections: 21, blocked: 18, severity: "high" },
    ],
    TA0011: [
      { id: "T1071", name: "Application Layer Protocol", detections: 54, blocked: 48, severity: "high" },
      { id: "T1095", name: "Non-Application Layer Protocol", detections: 12, blocked: 11, severity: "medium" },
      { id: "T1572", name: "Protocol Tunneling", detections: 8, blocked: 7, severity: "high" },
    ],
    TA0040: [
      { id: "T1486", name: "Data Encrypted for Impact", detections: 6, blocked: 6, severity: "critical" },
      { id: "T1490", name: "Inhibit System Recovery", detections: 4, blocked: 4, severity: "critical" },
      { id: "T1498", name: "Network Denial of Service", detections: 11, blocked: 10, severity: "high" },
    ],
  },
}

export function MitreAttackMatrix() {
  const [selectedTactic, setSelectedTactic] = useState<string | null>(null)
  const [selectedTechnique, setSelectedTechnique] = useState<any>(null)

  const getTotalCoverage = () => {
    let totalDetections = 0
    let totalBlocked = 0

    Object.values(mitreData.techniques).forEach((techniques) => {
      techniques.forEach((technique) => {
        totalDetections += technique.detections
        totalBlocked += technique.blocked
      })
    })

    return {
      percentage: totalDetections > 0 ? ((totalBlocked / totalDetections) * 100).toFixed(1) : "0.0",
      totalDetections,
      totalBlocked,
      totalMissed: totalDetections - totalBlocked,
    }
  }

  const getTacticCoverage = (tacticId: string) => {
    const techniques = mitreData.techniques[tacticId as keyof typeof mitreData.techniques] || []
    const totalDetections = techniques.reduce((sum, t) => sum + t.detections, 0)
    const totalBlocked = techniques.reduce((sum, t) => sum + t.blocked, 0)
    const percentage = totalDetections > 0 ? ((totalBlocked / totalDetections) * 100).toFixed(1) : "0.0"

    return {
      percentage: Number.parseFloat(percentage),
      totalDetections,
      totalBlocked,
    }
  }

  const getCoverageColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-400"
    if (percentage >= 75) return "text-cyan-400"
    if (percentage >= 60) return "text-yellow-400"
    return "text-red-400"
  }

  const coverage = getTotalCoverage()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getDetectionRate = (technique: any) => {
    return ((technique.blocked / technique.detections) * 100).toFixed(1)
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-blue-500/10">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-cyan-500/20 p-3">
                <Shield className="h-6 w-6 text-cyan-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Total Coverage</div>
                <div className="text-3xl font-bold text-cyan-400">{coverage.percentage}%</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-500/30 bg-secondary/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-orange-400" />
              <div>
                <div className="text-sm text-gray-400">Total Detections</div>
                <div className="text-3xl font-bold text-orange-400">{coverage.totalDetections}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-500/30 bg-secondary/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              <div>
                <div className="text-sm text-gray-400">Blocked</div>
                <div className="text-3xl font-bold text-green-400">{coverage.totalBlocked}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/30 bg-secondary/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <XCircle className="h-6 w-6 text-red-400" />
              <div>
                <div className="text-sm text-gray-400">Missed</div>
                <div className="text-3xl font-bold text-red-400">{coverage.totalMissed}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* MITRE ATT&CK Tactics Grid */}
      <div className="grid grid-cols-6 gap-2">
        {mitreData.tactics.map((tactic) => {
          const tacticCoverage = getTacticCoverage(tactic.id)
          const isSelected = selectedTactic === tactic.id

          return (
            <button
              key={tactic.id}
              onClick={() => setSelectedTactic(isSelected ? null : tactic.id)}
              className={`group relative overflow-hidden rounded-lg border p-3 text-left transition-all hover:scale-105 ${
                isSelected ? "border-cyan-500 bg-cyan-500/10 ring-2 ring-cyan-500/50" : "border-accent/30 bg-card"
              }`}
            >
              <div className="relative z-10">
                <div className="mb-1 text-xs font-mono text-gray-400">{tactic.id}</div>
                <div className="mb-2 text-sm font-semibold text-white">{tactic.name}</div>

                <div className="mb-2">
                  <div className={`text-2xl font-bold ${getCoverageColor(tacticCoverage.percentage)}`}>
                    {tacticCoverage.percentage}%
                  </div>
                  <div className="text-xs text-gray-500">Coverage</div>
                </div>

                <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${tacticCoverage.percentage}%`,
                      backgroundColor: tactic.color,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">
                    {tacticCoverage.totalBlocked}/{tacticCoverage.totalDetections}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{ borderColor: tactic.color, color: tactic.color }}
                  >
                    {tacticCoverage.totalDetections} total
                  </Badge>
                </div>
              </div>
              <div
                className="absolute inset-0 opacity-5 transition-opacity group-hover:opacity-10"
                style={{ backgroundColor: tactic.color }}
              />
            </button>
          )
        })}
      </div>

      {/* Techniques Detail View */}
      {selectedTactic && (
        <Card className="border-cyan-500/30 bg-card">
          <CardHeader>
            <CardTitle className="text-cyan-400">
              {mitreData.tactics.find((t) => t.id === selectedTactic)?.name} Techniques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(mitreData.techniques[selectedTactic as keyof typeof mitreData.techniques] || []).map((technique) => (
                <button
                  key={technique.id}
                  onClick={() => setSelectedTechnique(technique)}
                  className="w-full rounded-lg border border-accent/30 bg-secondary/50 p-4 text-left transition-all hover:border-cyan-500/50 hover:bg-secondary"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="font-mono text-xs text-gray-400">{technique.id}</span>
                        <Badge className={getSeverityColor(technique.severity)}>{technique.severity}</Badge>
                      </div>
                      <div className="mb-2 font-semibold text-white">{technique.name}</div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <AlertCircle className="h-4 w-4 text-orange-400" />
                          <span className="text-gray-400">{technique.detections} detected</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <span className="text-gray-400">{technique.blocked} blocked</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="h-4 w-4 text-red-400" />
                          <span className="text-gray-400">{technique.detections - technique.blocked} missed</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">{getDetectionRate(technique)}%</div>
                      <div className="text-xs text-gray-400">Detection Rate</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Technique Detail Modal */}
      {selectedTechnique && (
        <Card className="border-cyan-500/50 bg-card">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-cyan-400">
                  {selectedTechnique.id}: {selectedTechnique.name}
                </CardTitle>
                <p className="mt-1 text-sm text-gray-400">Detailed technique analysis and response recommendations</p>
              </div>
              <button
                onClick={() => setSelectedTechnique(null)}
                className="rounded-lg bg-secondary px-3 py-1 text-sm text-gray-300 hover:bg-secondary/80"
              >
                Close
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-accent/30 bg-secondary/50 p-4">
                <div className="mb-1 text-sm text-gray-400">Total Detections</div>
                <div className="text-3xl font-bold text-orange-400">{selectedTechnique.detections}</div>
              </div>
              <div className="rounded-lg border border-accent/30 bg-secondary/50 p-4">
                <div className="mb-1 text-sm text-gray-400">Successfully Blocked</div>
                <div className="text-3xl font-bold text-green-400">{selectedTechnique.blocked}</div>
              </div>
              <div className="rounded-lg border border-accent/30 bg-secondary/50 p-4">
                <div className="mb-1 text-sm text-gray-400">Detection Rate</div>
                <div className="text-3xl font-bold text-cyan-400">{getDetectionRate(selectedTechnique)}%</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
