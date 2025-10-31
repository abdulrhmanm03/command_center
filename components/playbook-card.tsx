"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Play, Settings, Clock, CheckCircle2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface PlaybookCardProps {
  playbook: {
    id: string
    name: string
    description: string
    status: string
    lastRun: string
    successRate: number
    avgDuration: string
    executions: number
    triggers: string[]
    steps: number
    automationLevel: string
    category: string
    trend: string
  }
  onRun: () => void
  onConfigure: () => void
}

export function PlaybookCard({ playbook, onRun, onConfigure }: PlaybookCardProps) {
  const getAutomationColor = (level: string) => {
    switch (level) {
      case "fully-automated":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "semi-automated":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Malware: "bg-red-500/20 text-red-400",
      "Email Security": "bg-blue-500/20 text-blue-400",
      Authentication: "bg-yellow-500/20 text-yellow-400",
      "Data Protection": "bg-purple-500/20 text-purple-400",
      "OT/ICS": "bg-orange-500/20 text-orange-400",
    }
    return colors[category] || "bg-gray-500/20 text-gray-400"
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10">
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h3 className="text-lg font-semibold text-white">{playbook.name}</h3>
              <Badge className={cn("text-xs", getAutomationColor(playbook.automationLevel))}>
                {playbook.automationLevel === "fully-automated" && <Zap className="mr-1 h-3 w-3" />}
                {playbook.automationLevel.replace("-", " ")}
              </Badge>
            </div>
            <p className="mb-3 text-sm text-gray-400">{playbook.description}</p>
            <div className="flex flex-wrap gap-2">
              {playbook.triggers.map((trigger) => (
                <Badge key={trigger} variant="outline" className="border-gray-700 text-xs text-gray-300">
                  {trigger}
                </Badge>
              ))}
            </div>
          </div>
          <Badge className={cn("ml-4", getCategoryColor(playbook.category))}>{playbook.category}</Badge>
        </div>

        <div className="mb-4 grid grid-cols-4 gap-4">
          <div>
            <p className="mb-1 text-xs text-gray-500">Success Rate</p>
            <div className="flex items-center gap-2">
              <p className="text-lg font-bold text-white">{playbook.successRate}%</p>
              <span className="text-xs text-green-400">{playbook.trend}</span>
            </div>
            <Progress value={playbook.successRate} className="mt-1 h-1" />
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-500">Avg Duration</p>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-cyan-400" />
              <p className="text-sm font-semibold text-white">{playbook.avgDuration}</p>
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-500">Executions</p>
            <div className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 text-green-400" />
              <p className="text-sm font-semibold text-white">{playbook.executions}</p>
            </div>
          </div>
          <div>
            <p className="mb-1 text-xs text-gray-500">Steps</p>
            <p className="text-sm font-semibold text-white">{playbook.steps} steps</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border/30 pt-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>Last run: {playbook.lastRun}</span>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={onConfigure}
              className="border-gray-700 text-gray-300 hover:border-cyan-500 hover:text-cyan-400 bg-transparent"
            >
              <Settings className="mr-1 h-3 w-3" />
              Configure
            </Button>
            <Button size="sm" onClick={onRun} className="bg-cyan-500 text-black hover:bg-cyan-400">
              <Play className="mr-1 h-3 w-3" />
              Run Now
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
