"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, Cell } from "recharts"
import { Bug } from "lucide-react"

const data = [
  { severity: "Critical", value: 9, color: "#ef4444" },
  { severity: "High", value: 45, color: "#f97316" },
  { severity: "Medium", value: 98, color: "#fbbf24" },
  { severity: "Low", value: 78, color: "#10b981" },
]

export function KpiVulnerabilities() {
  return (
    <Card className="border-accent/30 bg-card hover:border-purple-500/50 transition-all cursor-pointer group">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-medium text-gray-400">Vulnerabilities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold text-[#a855f7] group-hover:text-[#c084fc] transition-colors">230</div>
              <div className="mt-1 flex items-center text-xs text-[#ef4444]">
                <Bug className="mr-1 h-3 w-3" />
                <span>9 critical</span>
              </div>
            </div>
          </div>
          <div className="h-12">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <XAxis dataKey="severity" hide />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #a855f7",
                    borderRadius: "6px",
                  }}
                  labelStyle={{ color: "#a855f7" }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
