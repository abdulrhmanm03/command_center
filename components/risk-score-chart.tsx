"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const generateData = () => [
  { range: "0-20", users: 1847 + Math.floor(Math.random() * 100), fill: "#22c55e" }, // Bright green
  { range: "21-40", users: 623 + Math.floor(Math.random() * 50), fill: "#eab308" }, // Bright yellow
  { range: "41-60", users: 289 + Math.floor(Math.random() * 30), fill: "#f97316" }, // Bright orange
  { range: "61-80", users: 67 + Math.floor(Math.random() * 15), fill: "#f59e0b" }, // Amber
  { range: "81-100", users: 21 + Math.floor(Math.random() * 10), fill: "#ef4444" }, // Bright red
]

const chartConfig = {
  users: {
    label: "Users",
  },
}

export function RiskScoreChart() {
  const [data, setData] = useState(generateData())

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateData())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ChartContainer config={chartConfig} className="h-[250px] w-full">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="range" tickLine={false} axisLine={false} tickMargin={8} stroke="#666" />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} stroke="#666" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="users" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
