"use client"

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ZAxis } from "recharts"

const data = [
  { severity: 8, frequency: 45, size: 120, name: "Malware Detection" },
  { severity: 9, frequency: 32, size: 180, name: "Unauthorized Access" },
  { severity: 6, frequency: 78, size: 90, name: "Data Exfiltration" },
  { severity: 7, frequency: 56, size: 110, name: "Phishing Attempt" },
  { severity: 10, frequency: 12, size: 200, name: "Ransomware" },
  { severity: 5, frequency: 95, size: 70, name: "Policy Violation" },
  { severity: 8, frequency: 38, size: 140, name: "Brute Force" },
  { severity: 6, frequency: 67, size: 85, name: "SQL Injection" },
  { severity: 9, frequency: 28, size: 160, name: "Zero-Day Exploit" },
  { severity: 4, frequency: 120, size: 50, name: "Failed Login" },
]

export function ThreatCorrelationScatter() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          type="number"
          dataKey="severity"
          name="Severity"
          domain={[0, 10]}
          stroke="hsl(var(--muted-foreground))"
          label={{
            value: "Severity Score",
            position: "insideBottom",
            offset: -10,
            fill: "hsl(var(--muted-foreground))",
          }}
        />
        <YAxis
          type="number"
          dataKey="frequency"
          name="Frequency"
          stroke="hsl(var(--muted-foreground))"
          label={{ value: "Events/Day", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
        />
        <ZAxis type="number" dataKey="size" range={[50, 400]} />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border border-accent/30 bg-card p-3 shadow-lg">
                  <p className="font-semibold text-foreground">{payload[0].payload.name}</p>
                  <p className="text-sm text-muted-foreground">Severity: {payload[0].value}</p>
                  <p className="text-sm text-muted-foreground">Frequency: {payload[1].value}/day</p>
                </div>
              )
            }
            return null
          }}
        />
        <Scatter name="Threats" data={data} fill="hsl(var(--primary))" />
      </ScatterChart>
    </ResponsiveContainer>
  )
}
