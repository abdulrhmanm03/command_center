"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jul", days: 7.8 },
  { month: "Aug", days: 7.2 },
  { month: "Sep", days: 6.5 },
  { month: "Oct", days: 6.1 },
  { month: "Nov", days: 5.8 },
  { month: "Dec", days: 5.2 },
]

const chartConfig = {
  days: {
    label: "Days",
    color: "hsl(var(--chart-1))",
  },
}

export function RemediationTimelineChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="days" fill="var(--color-days)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
