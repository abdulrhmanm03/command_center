"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"

const generateCategoryData = () => [
  { category: "APT", count: 47 + Math.floor(Math.random() * 10), fill: "#06b6d4" },
  { category: "Ransomware", count: 89 + Math.floor(Math.random() * 20), fill: "#a855f7" },
  { category: "Phishing", count: 156 + Math.floor(Math.random() * 30), fill: "#f97316" },
  { category: "Malware", count: 134 + Math.floor(Math.random() * 25), fill: "#ef4444" },
  { category: "Zero-Day", count: 12 + Math.floor(Math.random() * 5), fill: "#22c55e" },
]

const chartConfig = {
  count: {
    label: "Threats",
    color: "hsl(var(--chart-1))",
  },
}

export function ThreatCategoriesChart() {
  const [data, setData] = useState(generateCategoryData())

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateCategoryData())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis
          dataKey="category"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} stroke="hsl(var(--muted-foreground))" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
