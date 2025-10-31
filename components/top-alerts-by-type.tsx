"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const alerts = [
  { name: "Malware Detection", count: 524, change: "+12%", color: "bg-destructive" },
  { name: "Unauthorized Access", count: 349, change: "+8%", color: "bg-warning" },
  { name: "Data Exfiltration", count: 224, change: "-3%", color: "bg-primary" },
  { name: "Policy Violation", count: 150, change: "+5%", color: "bg-accent" },
]

export function TopAlertsByType() {
  return (
    <Card className="border-accent/30 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">Top Alert by Type</CardTitle>
          <span className="text-xs text-muted-foreground">Last 24h</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground">{alert.name}</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-primary">{alert.count}</span>
                <Badge variant="outline" className="text-xs">
                  {alert.change}
                </Badge>
              </div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div className={`h-full ${alert.color}`} style={{ width: `${(alert.count / 524) * 100}%` }} />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className={`h-2 w-2 rounded-full ${alert.color}`} />
                <span>Active</span>
              </div>
              <span>{Math.round((alert.count / 1287) * 100)}% of total</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
