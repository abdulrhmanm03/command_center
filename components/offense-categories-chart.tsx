"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"

const data = [
  { name: "Malicious", value: 8, color: "#f97316" },
  { name: "Compliance", value: 10, color: "#10b981" },
  { name: "Access", value: 12, color: "#ef4444" },
  { name: "User Auth", value: 15, color: "#a855f7" },
  { name: "Data Loss", value: 18, color: "#78716c" },
  { name: "Threat", value: 14, color: "#ec4899" },
  { name: "Config", value: 16, color: "#64748b" },
  { name: "Network", value: 11, color: "#eab308" },
  { name: "Recon", value: 13, color: "#06b6d4" },
  { name: "Policy", value: 19, color: "#0ea5e9" },
  { name: "Exploit", value: 22, color: "#f97316" },
  { name: "Lateral", value: 25, color: "#a855f7" },
]

export function OffenseCategoriesChart() {
  return (
    <div className="h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ left: -30, right: 10 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="name" hide />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Bar key={`bar-${index}`} dataKey="value" fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
