"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ComplianceData {
  totalAssets: number
  compliantAssets: number
  nonCompliantAssets: number
  complianceScore: number
  frameworks: Array<{
    name: string
    score: number
    compliant: number
    total: number
    issues: string[]
  }>
  nonCompliantAssetsList: Array<{
    id: string
    name: string
    issues: string[]
    risk: number
  }>
}

interface ComplianceAuditPanelProps {
  data: ComplianceData
}

export function ComplianceAuditPanel({ data }: ComplianceAuditPanelProps) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400"
    if (score >= 70) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <Card className="border-slate-700 bg-[#1a1a1a]">
      <CardHeader>
        <CardTitle className="text-lg text-cyan-400">Compliance Audit</CardTitle>
        <p className="text-sm text-gray-400">NIST, HIPAA, and ISO 27001 compliance status</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              Compliant
            </div>
            <div className="mt-2 text-2xl font-bold text-green-400">{data.compliantAssets}</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <XCircle className="h-4 w-4 text-red-400" />
              Non-Compliant
            </div>
            <div className="mt-2 text-2xl font-bold text-red-400">{data.nonCompliantAssets}</div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <AlertTriangle className="h-4 w-4 text-cyan-400" />
              Overall Score
            </div>
            <div className={cn("mt-2 text-2xl font-bold", getScoreColor(data.complianceScore))}>
              {data.complianceScore}%
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-semibold text-gray-300">Framework Compliance</h4>
          {data.frameworks.map((framework) => (
            <div key={framework.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{framework.name}</span>
                <span className={cn("text-sm font-bold", getScoreColor(framework.score))}>{framework.score}%</span>
              </div>
              <Progress value={framework.score} className="h-2" />
              <div className="flex flex-wrap gap-2">
                {framework.issues.map((issue, idx) => (
                  <Badge key={idx} variant="outline" className="border-yellow-500/50 text-yellow-400 text-xs">
                    {issue}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-gray-300">Non-Compliant Assets ({data.nonCompliantAssets})</h4>
          <div className="space-y-2">
            {data.nonCompliantAssetsList.map((asset) => (
              <div
                key={asset.id}
                className="flex items-center justify-between rounded border border-slate-700 bg-slate-900/50 p-3"
              >
                <div className="flex-1">
                  <div className="font-medium text-cyan-400">{asset.name}</div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {asset.issues.map((issue, idx) => (
                      <span key={idx} className="text-xs text-gray-400">
                        • {issue}
                      </span>
                    ))}
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-4",
                    asset.risk >= 70
                      ? "border-red-500/50 text-red-400"
                      : asset.risk >= 40
                        ? "border-yellow-500/50 text-yellow-400"
                        : "border-blue-500/50 text-blue-400",
                  )}
                >
                  Risk: {asset.risk}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
