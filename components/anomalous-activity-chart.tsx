"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const generateData = () => [
  { type: "Unusual Login Time", count: 45 + Math.floor(Math.random() * 15), fill: "#a855f7" }, // Purple
  { type: "Geo-Anomaly", count: 32 + Math.floor(Math.random() * 10), fill: "#ec4899" }, // Pink
  { type: "Excessive Access", count: 28 + Math.floor(Math.random() * 8), fill: "#f97316" }, // Orange
  { type: "Failed Auth", count: 22 + Math.floor(Math.random() * 6), fill: "#ef4444" }, // Red
]

const chartConfig = {
  count: {
    label: "Incidents",
  },
}

export function AnomalousActivityChart() {
  const [data, setData] = useState(generateData())

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateData())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart data={data} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis type="number" tickLine={false} axisLine={false} tickMargin={8} stroke="#666" />
        <YAxis
          dataKey="type"
          type="category"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          width={120}
          stroke="#666"
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="count" radius={[0, 8, 8, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
