"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

const ipAddresses = [
  "20.157.120.98",
  "185.53.236.1",
  "231.114.75.225",
  "115.176",
  "12.200.230.220",
  "87.124",
  "32.246.145.133",
]

export function IntegratedDataFlow() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % ipAddresses.length)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="mb-6 border-accent/30 bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-success">Integrated Data Flow</CardTitle>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-success" />
            <span className="text-xs text-muted-foreground">Active | 2472 events/min</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Flowing IP Addresses */}
        <div className="mb-4 flex items-center gap-2 overflow-hidden rounded-lg bg-secondary/50 p-3">
          <div className="flex animate-pulse gap-2">
            {ipAddresses.map((ip, index) => (
              <span
                key={index}
                className={`whitespace-nowrap rounded px-2 py-1 text-xs font-mono transition-colors ${
                  index === activeIndex
                    ? "bg-destructive text-white"
                    : index === (activeIndex + 1) % ipAddresses.length
                      ? "bg-warning text-black"
                      : index === (activeIndex + 2) % ipAddresses.length
                        ? "bg-primary text-black"
                        : "bg-accent text-white"
                }`}
              >
                {ip}
              </span>
            ))}
          </div>
        </div>

        {/* Category Badges */}
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-accent bg-accent/10 text-accent">
            Network <span className="ml-2 font-bold">156</span>
          </Badge>
          <Badge variant="outline" className="border-success bg-success/10 text-success">
            Endpoint <span className="ml-2 font-bold">89</span>
          </Badge>
          <Badge variant="outline" className="border-warning bg-warning/10 text-warning">
            Identity <span className="ml-2 font-bold">42</span>
          </Badge>
          <Badge variant="outline" className="border-primary bg-primary/10 text-primary">
            Cloud <span className="ml-2 font-bold">78</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
