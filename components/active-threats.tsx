"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const threats = [
  { name: "APT29 Campaign", severity: "critical", status: "Active" },
  { name: "Ransomware Detected", severity: "high", status: "Investigating" },
  { name: "Phishing Attempt", severity: "medium", status: "Contained" },
  { name: "DDoS Attack", severity: "high", status: "Mitigating" },
]

export function ActiveThreats() {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground"
      case "high":
        return "bg-warning text-warning-foreground"
      case "medium":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  return (
    <Card className="border-accent/30 bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-foreground">Active Threats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {threats.map((threat, index) => (
          <div key={index} className="flex items-center justify-between rounded-lg bg-secondary/50 p-2">
            <div className="flex items-center gap-2">
              <Badge className={getSeverityColor(threat.severity)}>{threat.severity}</Badge>
              <span className="text-sm text-foreground">{threat.name}</span>
            </div>
            <span className="text-xs text-muted-foreground">{threat.status}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
