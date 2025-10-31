"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

const data = [
  { name: "APT Groups", value: 89, color: "#06b6d4" },
  { name: "Ransomware", value: 71, color: "#10b981" },
  { name: "Insider Threats", value: 56, color: "#f59e0b" },
  { name: "Zero-Day", value: 38, color: "#ef4444" },
]

export function ThreatCategoriesDonut() {
  const total = data.reduce((sum, item) => sum + item.value, 0)

  return (
    <Card className="border-accent/30 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-foreground">Top Threat Categories</CardTitle>
          <span className="text-xs text-muted-foreground">Active Threats</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="relative h-32 w-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{total}</div>
                <div className="text-xs text-muted-foreground">Active</div>
              </div>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
                  <span className="text-foreground">{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-bold text-primary">{item.value}</div>
                  <div className="text-muted-foreground">{Math.round((item.value / total) * 100)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
