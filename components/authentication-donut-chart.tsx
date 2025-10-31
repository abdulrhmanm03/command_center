"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts"

const successData = [
  { name: "GvQBSLtvDny3YkTW1EO4+w", value: 15.6, color: "#3b82f6" },
  { name: "V9ZevAuYdaoPp31CmOA", value: 13.4, color: "#10b981" },
  { name: "zyYWhvCdvemqrQhShHg", value: 13.2, color: "#ef4444" },
  { name: "sxBTlYuGBYyDoYhuaBG", value: 13.5, color: "#a855f7" },
  { name: "qDahQNYdkaBbN+EqGhQ", value: 8.44, color: "#78716c" },
  { name: "3bPHaaBZhyHnBmjQQ", value: 6.78, color: "#ec4899" },
  { name: "UmYYDgYZdpZXLGgJTYw", value: 6.27, color: "#f59e0b" },
  { name: "PkqyWBZhKPkaesDOLMZJk", value: 13.6, color: "#f97316" },
]

const failureData = [
  { name: "bb3eRcaXbGp+mzpHXb.kg", value: 19.2, color: "#3b82f6" },
  { name: "zyYWhvCdvemqrQhShHg", value: 13.2, color: "#10b981" },
  { name: "Ak+kMGx7Y/01Z2+eA8Oi8A", value: 13.6, color: "#f59e0b" },
  { name: "UQNr2vHSuzL53yWZEqGhQ", value: 11.7, color: "#ef4444" },
  { name: "GvQBSLtvDny3YkTW1EO4+w", value: 8.71, color: "#eab308" },
  { name: "HXLBYBZXbkYpA6EGhQ", value: 6.35, color: "#ec4899" },
  { name: "1LUQTlYeGnxgyyYYYEqGhQ", value: 11.5, color: "#a855f7" },
  { name: "60PmLXMqZYmBYaQMSA", value: 6.49, color: "#78716c" },
]

export function AuthenticationDonutChart({ type }: { type: "success" | "failure" }) {
  const data = type === "success" ? successData : failureData

  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={8}
            formatter={(value, entry: any) => (
              <span className="text-xs text-gray-300">
                {entry.payload.value}% {value.substring(0, 20)}...
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
