"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"
import { AlertTriangle } from "lucide-react"

const data = [
  { name: "Critical", value: 8, color: "#ef4444" },
  { name: "High", value: 12, color: "#f97316" },
]

export function KpiCriticalAnomalies() {
  return (
    <Card className="border-accent/30 bg-card hover:border-orange-500/50 transition-all cursor-pointer group">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-gray-400">Critical Anomalies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-3xl font-bold text-[#f97316] group-hover:text-[#fb923c] transition-colors">20</div>
            <div className="mt-1 flex items-center text-xs text-[#fbbf24]">
              <AlertTriangle className="mr-1 h-3 w-3" />
              <span>Requires attention</span>
            </div>
          </div>
          <div className="h-20 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={35}
                  paddingAngle={4}
                  dataKey="value"
                  startAngle={90}
                  endAngle={450}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #f97316",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "#f97316" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
