"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Filter } from "lucide-react"

const data = Array.from({ length: 60 }, (_, i) => ({
  time: i,
  locked: Math.random() * 20 + 5,
  failure: Math.random() * 15 + 3,
  creation: Math.random() * 10 + 2,
  activated: Math.random() * 8 + 1,
}))

export function TopCommand() {
  return (
    <Card className="border-border/40 bg-[#1a1a1a]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span>Top Command</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Last 9h 7m</span>
            <Filter className="h-3 w-3 text-muted-foreground" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={150}>
          <AreaChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={[0, 50]} />
            <Area type="monotone" dataKey="locked" stackId="1" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.8} />
            <Area type="monotone" dataKey="failure" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.8} />
            <Area type="monotone" dataKey="creation" stackId="1" stroke="#eab308" fill="#eab308" fillOpacity={0.8} />
            <Area type="monotone" dataKey="activated" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.8} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
          {[
            { name: "User Locked D...", color: "#14b8a6" },
            { name: "Sign in Failure...", color: "#06b6d4" },
            { name: "User Creation", color: "#eab308" },
            { name: "User Activated", color: "#f97316" },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="truncate text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
