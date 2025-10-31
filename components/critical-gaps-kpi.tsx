"use client"

import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

interface CriticalGapsKpiProps {
  count: number
}

export function CriticalGapsKpi({ count }: CriticalGapsKpiProps) {
  return (
    <Card className="border-red-500/30 bg-gradient-to-br from-card to-card/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">Critical Gaps</p>
            <p className="mt-2 text-3xl font-bold text-red-400">{count}</p>
          </div>
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <p className="mt-2 text-xs text-gray-500">Requires immediate attention</p>
      </CardContent>
    </Card>
  )
}
