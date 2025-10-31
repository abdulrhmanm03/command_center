"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

export function StatusChart() {
  const data = [
    { time: "00:00", clean: 4200, blocked: 120 },
    { time: "04:00", clean: 3800, blocked: 98 },
    { time: "08:00", clean: 5200, blocked: 156 },
    { time: "12:00", clean: 6100, blocked: 203 },
    { time: "16:00", clean: 5800, blocked: 187 },
    { time: "20:00", clean: 4900, blocked: 142 },
    { time: "23:59", clean: 4500, blocked: 128 },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Analysis</CardTitle>
        <CardDescription>Clean vs blocked requests over the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            clean: {
              label: "Clean",
              color: "hsl(var(--chart-2))",
            },
            blocked: {
              label: "Blocked",
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[300px]"
        >
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="clean"
              stackId="1"
              stroke="hsl(var(--chart-2))"
              fill="hsl(var(--chart-2))"
              fillOpacity={0.6}
            />
            <Area
              type="monotone"
              dataKey="blocked"
              stackId="1"
              stroke="hsl(var(--chart-4))"
              fill="hsl(var(--chart-4))"
              fillOpacity={0.6}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
