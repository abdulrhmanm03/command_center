"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { vector: "Phishing", count: 156 },
  { vector: "Ransomware", count: 89 },
  { vector: "APT Groups", count: 71 },
  { vector: "SQL Injection", count: 45 },
  { vector: "Zero-Day", count: 12 },
]

const chartConfig = {
  count: {
    label: "Incidents",
    color: "hsl(var(--chart-1))",
  },
}

export function AttackVectorChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis dataKey="vector" type="category" tickLine={false} axisLine={false} tickMargin={8} width={100} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" fill="var(--color-count)" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
