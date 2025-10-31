"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { category: "APT", count: 47 },
  { category: "Ransomware", count: 89 },
  { category: "Phishing", count: 156 },
  { category: "Malware", count: 134 },
  { category: "Zero-Day", count: 12 },
]

const chartConfig = {
  count: {
    label: "Threats",
    color: "hsl(var(--chart-1))",
  },
}

export function ThreatCategoriesChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
