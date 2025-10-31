"use client"

import { Cell, Pie, PieChart } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Malware Detection", value: 52, color: "hsl(var(--chart-4))" },
  { name: "Unauthorized Access", value: 34, color: "hsl(var(--chart-3))" },
  { name: "Data Exfiltration", value: 14, color: "hsl(var(--chart-1))" },
]

const chartConfig = {
  malware: {
    label: "Malware Detection",
    color: "hsl(var(--chart-4))",
  },
  unauthorized: {
    label: "Unauthorized Access",
    color: "hsl(var(--chart-3))",
  },
  exfiltration: {
    label: "Data Exfiltration",
    color: "hsl(var(--chart-1))",
  },
}

export function AlertDistributionChart() {
  return (
    <div className="space-y-4">
      <ChartContainer config={chartConfig} className="mx-auto h-[200px] w-full">
        <PieChart>
          <ChartTooltip content={<ChartTooltipContent />} />
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80}>
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
