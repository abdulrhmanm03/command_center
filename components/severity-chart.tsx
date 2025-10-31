"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { severity: "Critical", count: 89, color: "hsl(var(--chart-4))" },
  { severity: "High", count: 234, color: "hsl(var(--chart-3))" },
  { severity: "Medium", count: 456, color: "hsl(var(--chart-1))" },
  { severity: "Low", count: 508, color: "hsl(var(--chart-2))" },
]

const chartConfig = {
  count: {
    label: "Count",
    color: "hsl(var(--chart-1))",
  },
}

export function SeverityChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="severity" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  )
}
