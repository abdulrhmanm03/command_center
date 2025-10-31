"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { range: "0-20", users: 1847, color: "hsl(var(--chart-2))" },
  { range: "21-40", users: 623, color: "hsl(var(--chart-1))" },
  { range: "41-60", users: 289, color: "hsl(var(--chart-3))" },
  { range: "61-80", users: 67, color: "hsl(var(--chart-3))" },
  { range: "81-100", users: 21, color: "hsl(var(--chart-4))" },
]

const chartConfig = {
  users: {
    label: "Users",
    color: "hsl(var(--chart-1))",
  },
}

export function RiskScoreChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="range" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="users" radius={[4, 4, 0, 0]} fill="var(--color-users)" />
      </BarChart>
    </ChartContainer>
  )
}
