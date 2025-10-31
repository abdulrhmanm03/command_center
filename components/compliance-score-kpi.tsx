"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface ComplianceScoreKpiProps {
  value: string
  change: string
}

export function ComplianceScoreKpi({ value, change }: ComplianceScoreKpiProps) {
  const isPositive = change.startsWith("+")

  return (
    <Card className="border-cyan-500/30 bg-gradient-to-br from-card to-card/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Compliance Score</p>
            <p className="mt-2 text-3xl font-bold text-cyan-400">{value}</p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={isPositive ? "text-green-500" : "text-red-500"}>{change}</span>
          </div>
        </div>
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-700">
          <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400" style={{ width: value }} />
        </div>
      </CardContent>
    </Card>
  )
}
