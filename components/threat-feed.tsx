import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Shield, XCircle } from "lucide-react"

export function ThreatFeed() {
  const threats = [
    {
      id: 1,
      type: "Data Poisoning",
      severity: "critical" as const,
      timestamp: "2 min ago",
      source: "API Endpoint /v1/train",
      description: "Malicious training data detected with adversarial patterns",
    },
    {
      id: 2,
      type: "Prompt Injection",
      severity: "high" as const,
      timestamp: "5 min ago",
      source: "Chat Interface",
      description: "Attempt to override system instructions detected",
    },
    {
      id: 3,
      type: "Jailbreak Attempt",
      severity: "high" as const,
      timestamp: "12 min ago",
      source: "API Endpoint /v1/complete",
      description: "DAN-style jailbreak pattern identified and blocked",
    },
    {
      id: 4,
      type: "Model Extraction",
      severity: "medium" as const,
      timestamp: "18 min ago",
      source: "API Endpoint /v1/embeddings",
      description: "Suspicious query pattern suggesting model probing",
    },
  ]

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

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <XCircle className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Shield className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Threat Feed</CardTitle>
        <CardDescription>Recent security events detected by the firewall</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {threats.map((threat) => (
            <div key={threat.id} className="flex gap-4 rounded-lg border border-border p-4">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className={getSeverityColor(threat.severity)}>
                    <span className="flex items-center gap-1">
                      {getSeverityIcon(threat.severity)}
                      {threat.severity}
                    </span>
                  </Badge>
                  <span className="text-sm font-medium">{threat.type}</span>
                </div>
                <p className="text-sm text-muted-foreground">{threat.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{threat.source}</span>
                  <span>{threat.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
