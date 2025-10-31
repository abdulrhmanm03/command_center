"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Shield, AlertTriangle, TrendingUp, Clock } from "lucide-react"

interface AIThreatAnalystProps {
  insights: {
    id: string
    message: string
    confidence: number
    recommendation: string
    timestamp: Date
  }[]
  onAutoFix: (insightId: string) => void
  onDismiss: (insightId: string) => void
  onAddToHunt: (insightId: string) => void
}

export function AIThreatAnalyst({ insights, onAutoFix, onDismiss, onAddToHunt }: AIThreatAnalystProps) {
  return (
    <Card className="h-full bg-gradient-to-br from-purple-500/10 to-blue-500/10 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/20">
          <Brain className="h-5 w-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">AI Threat Analyst</h3>
          <p className="text-xs text-muted-foreground">Real-time AI security insights</p>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto" style={{ maxHeight: "calc(100vh - 400px)" }}>
        {insights.map((insight) => (
          <div key={insight.id} className="rounded-lg border border-purple-500/30 bg-background/50 p-4">
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-orange-400" />
                <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                  {insight.confidence}% confidence
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{new Date(insight.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>

            <p className="mb-3 text-sm text-foreground">{insight.message}</p>

            <div className="mb-3 rounded bg-blue-500/10 p-3">
              <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-blue-400">
                <Shield className="h-3 w-3" />
                <span>Recommendation</span>
              </div>
              <p className="text-xs text-muted-foreground">{insight.recommendation}</p>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant="default"
                className="flex-1 bg-green-500/20 text-green-400 hover:bg-green-500/30"
                onClick={() => onAutoFix(insight.id)}
              >
                Auto-Fix
              </Button>
              <Button size="sm" variant="outline" onClick={() => onAddToHunt(insight.id)}>
                Add to Hunt
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDismiss(insight.id)}>
                Dismiss
              </Button>
            </div>
          </div>
        ))}

        {insights.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <TrendingUp className="mb-3 h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No active threats detected</p>
            <p className="text-xs text-muted-foreground">AI systems are operating normally</p>
          </div>
        )}
      </div>
    </Card>
  )
}
