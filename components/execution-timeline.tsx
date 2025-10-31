"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, XCircle, Loader2, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface Execution {
  id: string
  playbookId: string
  playbookName: string
  status: string
  startedAt: string
  duration: string
  triggeredBy: string
  incidentId: string
  stepsCompleted: number
  totalSteps: number
}

interface ExecutionTimelineProps {
  executions: Execution[]
}

export function ExecutionTimeline({ executions }: ExecutionTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-400" />
      case "failed":
        return <XCircle className="h-5 w-5 text-red-400" />
      case "running":
        return <Loader2 className="h-5 w-5 animate-spin text-cyan-400" />
      default:
        return <Clock className="h-5 w-5 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "failed":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "running":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const formatTime = (isoString: string) => {
    const date = new Date(isoString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)

    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader>
        <CardTitle className="text-cyan-400">Recent Executions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {executions.map((execution, index) => (
            <div
              key={execution.id}
              className={cn(
                "flex items-start gap-4 rounded-lg border border-border/30 bg-background/50 p-4 transition-all hover:border-cyan-500/30",
                execution.status === "running" && "border-cyan-500/50 shadow-lg shadow-cyan-500/10",
              )}
            >
              <div className="flex-shrink-0">{getStatusIcon(execution.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-white">{execution.playbookName}</h4>
                    <Badge className={cn("text-xs", getStatusColor(execution.status))}>{execution.status}</Badge>
                  </div>
                  <span className="text-xs text-gray-500">{formatTime(execution.startedAt)}</span>
                </div>
                <div className="mb-2 flex items-center gap-4 text-sm text-gray-400">
                  <span>Triggered by: {execution.triggeredBy}</span>
                  <span>•</span>
                  <span>Incident: {execution.incidentId}</span>
                  <span>•</span>
                  <span>Duration: {execution.duration}</span>
                </div>
                {execution.status === "running" && (
                  <div className="mt-2">
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-gray-400">
                        Step {execution.stepsCompleted} of {execution.totalSteps}
                      </span>
                      <span className="text-cyan-400">
                        {Math.round((execution.stepsCompleted / execution.totalSteps) * 100)}%
                      </span>
                    </div>
                    <Progress value={(execution.stepsCompleted / execution.totalSteps) * 100} className="h-2" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
