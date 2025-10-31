"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Filter } from "lucide-react"

const data = [
  { name: "/app/office365/sso/wsfed/active", value: 643 },
  { name: "/app/v1/authn", value: 191 },
  { name: "/admin/app/active", value: 9 },
  { name: "Background", value: 6 },
  { name: "/api/internal/svc", value: 3 },
  { name: "/api/v1/authn", value: 2 },
  { name: "/api/v1/users", value: 2 },
  { name: "/api/v1/apps/0oa...", value: 1 },
  { name: "/user/welcome/en", value: 1 },
]

export function TopURL() {
  return (
    <Card className="border-border/40 bg-[#1a1a1a]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span>Top URL</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Last 9h 7m</span>
            <Filter className="h-3 w-3 text-muted-foreground" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="horizontal" margin={{ left: 0, right: 0 }}>
            <XAxis type="number" stroke="#666" tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="name" width={0} />
            <Bar dataKey="value" fill="#06b6d4" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 space-y-1 text-xs">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <span className="truncate text-muted-foreground">{item.name}</span>
              <span className="font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
