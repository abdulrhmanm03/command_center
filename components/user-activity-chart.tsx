"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const generateData = () => [
  {
    time: "00:00",
    logins: 45 + Math.floor(Math.random() * 20),
    fileAccess: 234 + Math.floor(Math.random() * 50),
    apiCalls: 567 + Math.floor(Math.random() * 100),
  },
  {
    time: "04:00",
    logins: 23 + Math.floor(Math.random() * 15),
    fileAccess: 156 + Math.floor(Math.random() * 40),
    apiCalls: 389 + Math.floor(Math.random() * 80),
  },
  {
    time: "08:00",
    logins: 189 + Math.floor(Math.random() * 30),
    fileAccess: 892 + Math.floor(Math.random() * 100),
    apiCalls: 1456 + Math.floor(Math.random() * 200),
  },
  {
    time: "12:00",
    logins: 234 + Math.floor(Math.random() * 40),
    fileAccess: 1023 + Math.floor(Math.random() * 120),
    apiCalls: 1789 + Math.floor(Math.random() * 250),
  },
  {
    time: "16:00",
    logins: 198 + Math.floor(Math.random() * 35),
    fileAccess: 945 + Math.floor(Math.random() * 110),
    apiCalls: 1623 + Math.floor(Math.random() * 220),
  },
  {
    time: "20:00",
    logins: 87 + Math.floor(Math.random() * 25),
    fileAccess: 456 + Math.floor(Math.random() * 70),
    apiCalls: 892 + Math.floor(Math.random() * 150),
  },
]

const chartConfig = {
  logins: {
    label: "Logins",
    color: "#a855f7", // Bright purple
  },
  fileAccess: {
    label: "File Access",
    color: "#ec4899", // Bright pink
  },
  apiCalls: {
    label: "API Calls",
    color: "#06b6d4", // Bright cyan
  },
}

export function UserActivityChart() {
  const [data, setData] = useState(generateData())

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateData())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} stroke="#666" />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} stroke="#666" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="logins" stroke={chartConfig.logins.color} strokeWidth={3} />
        <Line type="monotone" dataKey="fileAccess" stroke={chartConfig.fileAccess.color} strokeWidth={3} />
        <Line type="monotone" dataKey="apiCalls" stroke={chartConfig.apiCalls.color} strokeWidth={3} />
      </LineChart>
    </ChartContainer>
  )
}
