"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { month: "Jul", score: 78 },
  { month: "Aug", score: 81 },
  { month: "Sep", score: 83 },
  { month: "Oct", score: 85 },
  { month: "Nov", score: 84 },
  { month: "Dec", score: 87 },
]

const chartConfig = {
  score: {
    label: "Compliance Score",
    color: "hsl(var(--chart-2))",
  },
}

export function ComplianceScoreChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[0, 100]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="score" stroke="var(--color-score)" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  )
}
