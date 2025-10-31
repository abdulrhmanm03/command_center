"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { date: "Jan 1", apt: 12, ransomware: 8, phishing: 45, malware: 34 },
  { date: "Jan 8", apt: 15, ransomware: 12, phishing: 52, malware: 38 },
  { date: "Jan 15", apt: 18, ransomware: 15, phishing: 48, malware: 42 },
  { date: "Jan 22", apt: 14, ransomware: 18, phishing: 56, malware: 45 },
  { date: "Jan 29", apt: 20, ransomware: 22, phishing: 61, malware: 48 },
  { date: "Feb 5", apt: 17, ransomware: 19, phishing: 58, malware: 51 },
]

const chartConfig = {
  apt: {
    label: "APT Groups",
    color: "hsl(var(--chart-4))",
  },
  ransomware: {
    label: "Ransomware",
    color: "hsl(var(--chart-3))",
  },
  phishing: {
    label: "Phishing",
    color: "hsl(var(--chart-1))",
  },
  malware: {
    label: "Malware",
    color: "hsl(var(--chart-2))",
  },
}

export function ThreatTrendsChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Area
          type="monotone"
          dataKey="apt"
          stackId="1"
          stroke="var(--color-apt)"
          fill="var(--color-apt)"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="ransomware"
          stackId="1"
          stroke="var(--color-ransomware)"
          fill="var(--color-ransomware)"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="phishing"
          stackId="1"
          stroke="var(--color-phishing)"
          fill="var(--color-phishing)"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="malware"
          stackId="1"
          stroke="var(--color-malware)"
          fill="var(--color-malware)"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ChartContainer>
  )
}
