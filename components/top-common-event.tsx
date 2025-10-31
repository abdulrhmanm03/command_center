"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "User Login Failure", value: 549 },
  { name: "Login Failure - Bad Password", value: 244 },
  { name: "Account Added To Group", value: 18 },
  { name: "Password Modified", value: 5 },
  { name: "Login Failure - Account Locked", value: 3 },
]

export function TopCommonEvent() {
  return (
    <Card className="border-border/40 bg-[#1a1a1a]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">Top Common Events</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
            <XAxis type="number" stroke="#666" tick={{ fontSize: 11 }} />
            <YAxis type="category" dataKey="name" width={140} tick={{ fontSize: 10 }} stroke="#666" />
            <Tooltip
              contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
              labelStyle={{ color: "#fff" }}
            />
            <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
