"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Filter } from "lucide-react"

const data = Array.from({ length: 60 }, (_, i) => ({
  time: i,
  us_texas: Math.random() * 25 + 5,
  us_connecticut: Math.random() * 20 + 3,
  us_colorado: Math.random() * 15 + 2,
  uae_dubai: Math.random() * 35 + 15, // Increased from 18+4 to 35+15
  uae_abudhabi: Math.random() * 28 + 10, // Increased from 14+3 to 28+10
  uk_west: Math.random() * 12 + 1,
  uk_reading: Math.random() * 10 + 1,
  spain: Math.random() * 8 + 1,
  italy: Math.random() * 6 + 1,
  india: Math.random() * 5 + 1,
  china: Math.random() * 4 + 1,
}))

export function TopLocationOrigin() {
  return (
    <Card className="border-border/40 bg-[#1a1a1a]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span>Top Location (Origin)</span>
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
            <YAxis hide domain={[0, 100]} />
            <Area type="monotone" dataKey="us_texas" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.8} />
            <Area
              type="monotone"
              dataKey="us_connecticut"
              stackId="1"
              stroke="#eab308"
              fill="#eab308"
              fillOpacity={0.8}
            />
            <Area type="monotone" dataKey="us_colorado" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.8} />
            <Area type="monotone" dataKey="uae_dubai" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} />
            <Area
              type="monotone"
              dataKey="uae_abudhabi"
              stackId="1"
              stroke="#06d6a0"
              fill="#06d6a0"
              fillOpacity={0.8}
            />
            <Area type="monotone" dataKey="uk_west" stackId="1" stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.8} />
            <Area type="monotone" dataKey="uk_reading" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.8} />
            <Area type="monotone" dataKey="spain" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.8} />
            <Area type="monotone" dataKey="italy" stackId="1" stroke="#22c55e" fill="#22c55e" fillOpacity={0.8} />
            <Area type="monotone" dataKey="india" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} />
            <Area type="monotone" dataKey="china" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.8} />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
          {[
            { name: "🇦🇪 UAE, Dubai, Dubai", color: "#10b981", highlight: true },
            { name: "🇦🇪 UAE, Abu Dhabi, Abu Dhabi", color: "#06d6a0", highlight: true },
            { name: "United States, Texas, Aust...", color: "#ec4899" },
            { name: "United States, Connecticu...", color: "#eab308" },
            { name: "United States, Colorado, ...", color: "#f97316" },
            { name: "United Kingdom, West Be...", color: "#14b8a6" },
            { name: "United Kingdom, Reading...", color: "#06b6d4" },
            { name: "Spain, Madrid, Madrid", color: "#8b5cf6" },
            { name: "Italy, Uttar Pradesh, Noida", color: "#22c55e" },
            { name: "India, Delhi, New Delhi", color: "#3b82f6" },
            { name: "China, Anhui, Hefei", color: "#ef4444" },
          ].map((item, idx) => (
            <div key={idx} className={`flex items-center gap-1 ${item.highlight ? "font-bold" : ""}`}>
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className={item.highlight ? "text-green-400" : "text-muted-foreground"}>{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
