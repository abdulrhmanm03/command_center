"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts"
import { TrendingUp } from "lucide-react"

const data = [
  { time: "00:00", value: 45 },
  { time: "04:00", value: 52 },
  { time: "08:00", value: 78 },
  { time: "12:00", value: 91 },
  { time: "16:00", value: 85 },
  { time: "20:00", value: 68 },
  { time: "24:00", value: 91 },
]

export function KpiItAlerts() {
  return (
    <Card className="border-accent/30 bg-card hover:border-teal-500/50 transition-all cursor-pointer group">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-gray-400">IT Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-[#14b8a6] group-hover:text-[#2dd4bf] transition-colors">
                1,091
              </div>
              <div className="mt-1 flex items-center text-xs text-[#10b981]">
                <TrendingUp className="mr-1 h-3 w-3" />
                <span>+10% from last week</span>
              </div>
            </div>
          </div>
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} dot={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #14b8a6",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "#14b8a6" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
