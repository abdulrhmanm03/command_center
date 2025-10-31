"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { type: "Unusual Login Time", count: 45 },
  { type: "Geo-Anomaly", count: 32 },
  { type: "Excessive Access", count: 28 },
  { type: "Failed Auth", count: 22 },
]

const chartConfig = {
  count: {
    label: "Incidents",
    color: "hsl(var(--chart-3))",
  },
}

export function AnomalousActivityChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis dataKey="type" type="category" tickLine={false} axisLine={false} tickMargin={8} width={120} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
