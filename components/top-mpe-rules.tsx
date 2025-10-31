"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell } from "recharts"

const data = [
  { name: "User Login Failure", value: 549, color: "#ef4444" },
  { name: "Login Failed Bad Password", value: 244, color: "#f97316" },
  { name: "User Assigned To App", value: 18, color: "#eab308" },
  { name: "Password Modified", value: 5, color: "#84cc16" },
  { name: "Account Locked", value: 3, color: "#22c55e" },
]

export function TopMPERules() {
  return (
    <Card className="border-border/40 bg-[#1a1a1a]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Top MPE Rules</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
            <XAxis type="number" stroke="#666" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 10 }} stroke="#666" />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
