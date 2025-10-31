"use client"

import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts"

const data = [
  { category: "Network", current: 85, target: 95 },
  { category: "Endpoint", current: 78, target: 90 },
  { category: "Identity", current: 92, target: 95 },
  { category: "Cloud", current: 88, target: 95 },
  { category: "Data", current: 75, target: 90 },
  { category: "Application", current: 82, target: 95 },
]

export function SecurityPostureRadar() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <RadarChart data={data}>
        <PolarGrid stroke="hsl(var(--border))" />
        <PolarAngleAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
        <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
        <Radar
          name="Current Score"
          dataKey="current"
          stroke="hsl(var(--primary))"
          fill="hsl(var(--primary))"
          fillOpacity={0.6}
        />
        <Radar
          name="Target Score"
          dataKey="target"
          stroke="hsl(var(--success))"
          fill="hsl(var(--success))"
          fillOpacity={0.3}
        />
        <Legend />
      </RadarChart>
    </ResponsiveContainer>
  )
}
