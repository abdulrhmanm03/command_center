"use client"

import { useEffect, useState } from "react"
import { Cell, Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const generateData = () => [
  { name: "Office Network", value: 68 + Math.floor(Math.random() * 5), color: "#22c55e" }, // Bright green
  { name: "VPN", value: 22 + Math.floor(Math.random() * 3), color: "#06b6d4" }, // Bright cyan
  { name: "Remote", value: 7 + Math.floor(Math.random() * 2), color: "#a855f7" }, // Bright purple
  { name: "Unknown", value: 3 + Math.floor(Math.random() * 2), color: "#ef4444" }, // Bright red
]

const chartConfig = {
  office: {
    label: "Office Network",
  },
  vpn: {
    label: "VPN",
  },
  remote: {
    label: "Remote",
  },
  unknown: {
    label: "Unknown",
  },
}

export function LoginPatternsChart() {
  const [data, setData] = useState(generateData())

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateData())
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-4">
      <ChartContainer config={chartConfig} className="mx-auto h-[200px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>
      <div className="space-y-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-sm">{item.name}</span>
            </div>
            <span className="text-sm font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}
