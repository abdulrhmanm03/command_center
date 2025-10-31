"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts"
import { TrendingDown } from "lucide-react"

const data = [
  {
    name: "MTTD",
    value: 80,
    fill: "#3b82f6",
  },
]

export function KpiMttd() {
  return (
    <Card className="border-accent/30 bg-card hover:border-blue-500/50 transition-all cursor-pointer group">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-gray-400">Mean Time To Detect</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-3xl font-bold text-[#3b82f6] group-hover:text-[#60a5fa] transition-colors">1.2h</div>
            <div className="mt-1 flex items-center text-xs text-[#10b981]">
              <TrendingDown className="mr-1 h-3 w-3" />
              <span>-15% improvement</span>
            </div>
          </div>
          <div className="h-20 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="100%"
                data={data}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar
                  background
                  dataKey="value"
                  cornerRadius={10}
                  fill="#3b82f6"
                  backgroundStyle={{ fill: "#1e293b" }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
