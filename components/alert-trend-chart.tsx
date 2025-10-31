"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { time: "00:00", critical: 12, high: 45, medium: 89, low: 156 },
  { time: "02:00", critical: 15, high: 52, medium: 95, low: 142 },
  { time: "04:00", critical: 8, high: 38, medium: 78, low: 134 },
  { time: "06:00", critical: 18, high: 61, medium: 102, low: 167 },
  { time: "08:00", critical: 25, high: 78, medium: 125, low: 189 },
  { time: "10:00", critical: 22, high: 71, medium: 118, low: 178 },
  { time: "12:00", critical: 19, high: 65, medium: 108, low: 165 },
  { time: "14:00", critical: 28, high: 85, medium: 135, low: 198 },
  { time: "16:00", critical: 31, high: 92, medium: 142, low: 205 },
  { time: "18:00", critical: 24, high: 76, medium: 128, low: 182 },
  { time: "20:00", critical: 20, high: 68, medium: 115, low: 171 },
  { time: "22:00", critical: 16, high: 58, medium: 98, low: 158 },
]

const chartConfig = {
  critical: {
    label: "Critical",
    color: "hsl(var(--chart-4))",
  },
  high: {
    label: "High",
    color: "hsl(var(--chart-3))",
  },
  medium: {
    label: "Medium",
    color: "hsl(var(--chart-1))",
  },
  low: {
    label: "Low",
    color: "hsl(var(--chart-2))",
  },
}

export function AlertTrendChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="critical"
          stackId="1"
          stroke="var(--color-critical)"
          fill="var(--color-critical)"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="high"
          stackId="1"
          stroke="var(--color-high)"
          fill="var(--color-high)"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="medium"
          stackId="1"
          stroke="var(--color-medium)"
          fill="var(--color-medium)"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="low"
          stackId="1"
          stroke="var(--color-low)"
          fill="var(--color-low)"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ChartContainer>
  )
}
