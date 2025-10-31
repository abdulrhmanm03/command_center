"use client"

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { time: "00:00", critical: 12, high: 28, medium: 45, low: 67 },
  { time: "04:00", critical: 8, high: 22, medium: 38, low: 52 },
  { time: "08:00", critical: 18, high: 42, medium: 68, low: 89 },
  { time: "12:00", critical: 22, high: 48, medium: 72, low: 95 },
  { time: "16:00", critical: 15, high: 38, medium: 62, low: 82 },
  { time: "20:00", critical: 10, high: 32, medium: 55, low: 75 },
]

export function AlertVolumeArea() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--warning))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--warning))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorMedium" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorLow" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.8} />
            <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
        <YAxis stroke="hsl(var(--muted-foreground))" />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--accent))",
            borderRadius: "8px",
          }}
        />
        <Area
          type="monotone"
          dataKey="critical"
          stackId="1"
          stroke="hsl(var(--destructive))"
          fill="url(#colorCritical)"
        />
        <Area type="monotone" dataKey="high" stackId="1" stroke="hsl(var(--warning))" fill="url(#colorHigh)" />
        <Area type="monotone" dataKey="medium" stackId="1" stroke="hsl(var(--primary))" fill="url(#colorMedium)" />
        <Area type="monotone" dataKey="low" stackId="1" stroke="hsl(var(--success))" fill="url(#colorLow)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
