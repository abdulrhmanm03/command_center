"use client"

import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { time: "00:00", logins: 45, fileAccess: 234, apiCalls: 567 },
  { time: "04:00", logins: 23, fileAccess: 156, apiCalls: 389 },
  { time: "08:00", logins: 189, fileAccess: 892, apiCalls: 1456 },
  { time: "12:00", logins: 234, fileAccess: 1023, apiCalls: 1789 },
  { time: "16:00", logins: 198, fileAccess: 945, apiCalls: 1623 },
  { time: "20:00", logins: 87, fileAccess: 456, apiCalls: 892 },
]

const chartConfig = {
  logins: {
    label: "Logins",
    color: "hsl(var(--chart-1))",
  },
  fileAccess: {
    label: "File Access",
    color: "hsl(var(--chart-2))",
  },
  apiCalls: {
    label: "API Calls",
    color: "hsl(var(--chart-3))",
  },
}

export function UserActivityChart() {
  return (
    <ChartContainer config={chartConfig} className="h-[300px] w-full">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line type="monotone" dataKey="logins" stroke="var(--color-logins)" strokeWidth={2} />
        <Line type="monotone" dataKey="fileAccess" stroke="var(--color-fileAccess)" strokeWidth={2} />
        <Line type="monotone" dataKey="apiCalls" stroke="var(--color-apiCalls)" strokeWidth={2} />
      </LineChart>
    </ChartContainer>
  )
}
