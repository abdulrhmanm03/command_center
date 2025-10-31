"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface Asset {
  id: string
  name: string
  type: string
  riskScore: number
}

interface InfrastructureRiskHeatmapProps {
  assets: Asset[]
}

export function InfrastructureRiskHeatmap({ assets }: InfrastructureRiskHeatmapProps) {
  const getRiskColor = (score: number) => {
    if (score >= 80) return "bg-red-500"
    if (score >= 60) return "bg-orange-500"
    if (score >= 40) return "bg-yellow-500"
    if (score >= 20) return "bg-blue-500"
    return "bg-green-500"
  }

  const getRiskLabel = (score: number) => {
    if (score >= 80) return "Critical"
    if (score >= 60) return "High"
    if (score >= 40) return "Medium"
    if (score >= 20) return "Low"
    return "Minimal"
  }

  return (
    <Card className="border-slate-700 bg-[#1a1a1a]">
      <CardHeader>
        <CardTitle className="text-lg text-cyan-400">Infrastructure Risk Heatmap</CardTitle>
        <p className="text-sm text-gray-400">Visual representation of asset risk levels</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-8 gap-2">
          {assets.slice(0, 64).map((asset) => (
            <div
              key={asset.id}
              className={cn(
                "group relative aspect-square rounded cursor-pointer transition-all hover:scale-110 hover:z-10",
                getRiskColor(asset.riskScore),
              )}
              title={`${asset.name}: ${asset.riskScore} (${getRiskLabel(asset.riskScore)})`}
            >
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-bold text-white drop-shadow-lg">{asset.riskScore}</span>
              </div>
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                <div className="font-semibold">{asset.name}</div>
                <div className="text-gray-400">{asset.type}</div>
                <div className={cn("font-bold", asset.riskScore >= 60 ? "text-red-400" : "text-green-400")}>
                  Risk: {asset.riskScore}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-green-500"></div>
            <span className="text-gray-400">Minimal (0-19)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-blue-500"></div>
            <span className="text-gray-400">Low (20-39)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-yellow-500"></div>
            <span className="text-gray-400">Medium (40-59)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-orange-500"></div>
            <span className="text-gray-400">High (60-79)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded bg-red-500"></div>
            <span className="text-gray-400">Critical (80-100)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
