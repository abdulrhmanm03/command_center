"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { Filter } from "lucide-react"

const data = [
  { name: "Account Created", value: 450 },
  { name: "Account Modified", value: 280 },
  { name: "Access Control", value: 180 },
]

const COLORS = ["#eab308", "#d97706", "#92400e"]

export function TopClassification() {
  return (
    <Card className="border-border/40 bg-[#1a1a1a]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span>Top Classification</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Last 9h 7m</span>
            <Filter className="h-3 w-3 text-muted-foreground" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="mt-2 space-y-1 text-xs">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
