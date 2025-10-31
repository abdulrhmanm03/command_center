"use client"

import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from "recharts"

const data = [{ name: "Event 1", success: 150, failure: 100, policy: 80, audit: 60, network: 40, login: 90, other: 30 }]

export function AuthenticationEventsChart() {
  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="horizontal">
          <XAxis type="number" stroke="#64748b" />
          <YAxis type="category" dataKey="name" hide />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="square"
            iconSize={12}
            formatter={(value) => <span className="text-xs text-gray-300">{value}</span>}
          />
          <Bar dataKey="success" stackId="a" fill="#3b82f6" name="Success Audit: An account was successfully logg..." />
          <Bar dataKey="failure" stackId="a" fill="#f97316" name="Successful Network Logon" />
          <Bar dataKey="policy" stackId="a" fill="#10b981" name="Successful Logon" />
          <Bar dataKey="audit" stackId="a" fill="#ef4444" name="Failure Audit: Network Policy Server discarded ..." />
          <Bar
            dataKey="network"
            stackId="a"
            fill="#a855f7"
            name="Failure Audit: The network connection to the controller per expi..."
          />
          <Bar dataKey="login" stackId="a" fill="#ec4899" name="Failure Audit: An account failed to log on" />
          <Bar dataKey="other" stackId="a" fill="#eab308" name="Logon failure: The logon attempt failed for ot..." />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
