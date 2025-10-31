"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown } from "lucide-react"

export function ResponseMetrics() {
  return (
    <Card className="border-accent/30 bg-card">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-foreground">Response Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Mean Time to Detect</span>
            <div className="flex items-center gap-1 text-xs text-success">
              <TrendingDown className="h-3 w-3" />
              <span>-15% from last month</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-primary">1.2h</div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Mean Time to Respond</span>
            <div className="flex items-center gap-1 text-xs text-success">
              <TrendingDown className="h-3 w-3" />
              <span>-8% from last month</span>
            </div>
          </div>
          <div className="text-3xl font-bold text-primary">2.4h</div>
        </div>
      </CardContent>
    </Card>
  )
}
