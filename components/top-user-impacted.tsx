"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"
import { useState, useEffect } from "react"

const COLORS = ["#eab308", "#3b82f6"]

export function TopUserImpacted() {
  const [data, setData] = useState([
    { name: "Origin", value: 750 },
    { name: "Impacted", value: 320 },
  ])

  useEffect(() => {
    const interval = setInterval(() => {
      setData([
        { name: "Origin", value: 700 + Math.floor(Math.random() * 250) },
        { name: "Impacted", value: 250 + Math.floor(Math.random() * 180) },
      ])
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-border/40 bg-[#1a1a1a]">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold">User Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
              label={({ value }) => value.toLocaleString()}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              formatter={(value, entry: any) => (
                <span className="text-xs text-muted-foreground">
                  {value}: {entry.payload.value.toLocaleString()}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
