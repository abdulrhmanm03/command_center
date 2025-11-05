"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useEffect, useState } from "react"

const generateTrendData = () => [
  {
    date: "Sep 15",
    apt: 18 + Math.floor(Math.random() * 5),
    ransomware: 14 + Math.floor(Math.random() * 4),
    phishing: 52 + Math.floor(Math.random() * 10),
    malware: 41 + Math.floor(Math.random() * 8),
  },
  {
    date: "Sep 22",
    apt: 21 + Math.floor(Math.random() * 5),
    ransomware: 17 + Math.floor(Math.random() * 4),
    phishing: 58 + Math.floor(Math.random() * 10),
    malware: 45 + Math.floor(Math.random() * 8),
  },
  {
    date: "Sep 29",
    apt: 19 + Math.floor(Math.random() * 5),
    ransomware: 20 + Math.floor(Math.random() * 4),
    phishing: 61 + Math.floor(Math.random() * 10),
    malware: 48 + Math.floor(Math.random() * 8),
  },
  {
    date: "Oct 6",
    apt: 23 + Math.floor(Math.random() * 5),
    ransomware: 22 + Math.floor(Math.random() * 4),
    phishing: 64 + Math.floor(Math.random() * 10),
    malware: 52 + Math.floor(Math.random() * 8),
  },
  {
    date: "Oct 13",
    apt: 25 + Math.floor(Math.random() * 5),
    ransomware: 25 + Math.floor(Math.random() * 4),
    phishing: 68 + Math.floor(Math.random() * 10),
    malware: 55 + Math.floor(Math.random() * 8),
  },
  {
    date: "Oct 20",
    apt: 22 + Math.floor(Math.random() * 5),
    ransomware: 23 + Math.floor(Math.random() * 4),
    phishing: 71 + Math.floor(Math.random() * 10),
    malware: 58 + Math.floor(Math.random() * 8),
  },
  {
    date: "Oct 27",
    apt: 27 + Math.floor(Math.random() * 5),
    ransomware: 28 + Math.floor(Math.random() * 4),
    phishing: 75 + Math.floor(Math.random() * 10),
    malware: 61 + Math.floor(Math.random() * 8),
  },
  {
    date: "Nov 3",
    apt: 29 + Math.floor(Math.random() * 5),
    ransomware: 30 + Math.floor(Math.random() * 4),
    phishing: 78 + Math.floor(Math.random() * 10),
    malware: 64 + Math.floor(Math.random() * 8),
  },
]

const chartConfig = {
  apt: {
    label: "APT Groups",
    color: "#06b6d4", // Bright cyan
  },
  ransomware: {
    label: "Ransomware",
    color: "#a855f7", // Bright purple
  },
  phishing: {
    label: "Phishing",
    color: "#f97316", // Bright orange
  },
  malware: {
    label: "Malware",
    color: "#ef4444", // Bright red
  },
}

export function ThreatTrendsChart() {
  const [data, setData] = useState(generateTrendData())

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateTrendData())
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} stroke="hsl(var(--muted-foreground))" />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} stroke="hsl(var(--muted-foreground))" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="apt"
          stackId="1"
          stroke="var(--color-apt)"
          fill="var(--color-apt)"
          fillOpacity={0.8}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="ransomware"
          stackId="1"
          stroke="var(--color-ransomware)"
          fill="var(--color-ransomware)"
          fillOpacity={0.8}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="phishing"
          stackId="1"
          stroke="var(--color-phishing)"
          fill="var(--color-phishing)"
          fillOpacity={0.8}
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="malware"
          stackId="1"
          stroke="var(--color-malware)"
          fill="var(--color-malware)"
          fillOpacity={0.8}
          strokeWidth={2}
        />
      </AreaChart>
    </ChartContainer>
  )
}
