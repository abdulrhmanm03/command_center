"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

const data = Array.from({ length: 30 }, (_, i) => ({
  time: i,
  value: Math.random() * 40 + 10,
}))

export function TopIPOrigin() {
  return (
    <Card className="border-border/40 bg-[#1a1a1a]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">IP Address Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <AreaChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, 60]} />
            <Tooltip
              contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
              labelStyle={{ color: "#fff" }}
            />
            <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>6 hours ago</span>
          <span>Now</span>
        </div>
      </CardContent>
    </Card>
  )
}
