"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

const regions = [
  { name: "North America", lat: 40, lng: -100, color: "#3b82f6" },
  { name: "Europe", lat: 50, lng: 10, color: "#8b5cf6" },
  { name: "Asia", lat: 35, lng: 105, color: "#06b6d4" },
  { name: "UAE", lat: 24, lng: 54, color: "#eab308", highlight: true },
  { name: "Australia", lat: -25, lng: 135, color: "#22c55e" },
  { name: "South America", lat: -15, lng: -60, color: "#f97316" },
  { name: "Africa", lat: 0, lng: 20, color: "#ec4899" },
  { name: "Middle East", lat: 30, lng: 50, color: "#ef4444" },
]

export function AuthWorldMap() {
  const [regionData, setRegionData] = useState(
    regions.map((region) => ({
      ...region,
      origin: region.highlight ? Math.floor(Math.random() * 400) + 600 : Math.floor(Math.random() * 200) + 50,
      impacted: region.highlight ? Math.floor(Math.random() * 200) + 300 : Math.floor(Math.random() * 100) + 20,
    })),
  )

  useEffect(() => {
    const interval = setInterval(() => {
      setRegionData(
        regions.map((region) => ({
          ...region,
          origin: region.highlight ? Math.floor(Math.random() * 400) + 600 : Math.floor(Math.random() * 200) + 50,
          impacted: region.highlight ? Math.floor(Math.random() * 200) + 300 : Math.floor(Math.random() * 100) + 20,
        })),
      )
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const maxValue = Math.max(...regionData.map((r) => r.origin + r.impacted))

  return (
    <Card className="border-border/40 bg-[#1a1a1a]">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between">
          <span className="text-base font-semibold">Global Authentication Activity</span>
          <Badge variant="outline" className="border-green-500/50 text-green-400">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative h-[400px]">
          <svg viewBox="0 0 1000 500" className="absolute inset-0 h-full w-full opacity-10">
            <path
              d="M150,100 L200,80 L250,90 L300,85 L350,95 L400,90 L450,100 L500,95 L550,105 L600,100 L650,110 L700,105 L750,115 L800,110 L850,120"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M100,150 Q150,140 200,150 T300,160 T400,155 T500,165 T600,160 T700,170 T800,165 T900,175"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M50,200 Q100,190 150,200 T250,210 T350,205 T450,215 T550,210 T650,220 T750,215 T850,225 T950,220"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
            />
          </svg>

          {regionData.map((region, idx) => {
            const total = region.origin + region.impacted
            const size = (total / maxValue) * 100 + 40
            const opacity = (total / maxValue) * 0.8 + 0.2

            return (
              <div
                key={idx}
                className="absolute transition-all duration-1000"
                style={{
                  left: `${((region.lng + 180) / 360) * 100}%`,
                  top: `${((90 - region.lat) / 180) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {/* Bubble */}
                <div
                  className="rounded-full transition-all duration-1000"
                  style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    backgroundColor: region.color,
                    opacity: opacity,
                    boxShadow: region.highlight ? `0 0 30px ${region.color}` : `0 0 15px ${region.color}`,
                  }}
                />

                {/* Label */}
                <div className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap text-center">
                  <div className="text-xs font-semibold" style={{ color: region.color }}>
                    {region.name}
                    {region.highlight && " ⭐"}
                  </div>
                  <div className="text-xs text-muted-foreground">{total.toLocaleString()}</div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 grid grid-cols-4 gap-4 border-t border-border/40 pt-4">
          {regionData.slice(0, 4).map((region, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: region.color }} />
                <span className="text-xs font-medium text-foreground">{region.name}</span>
              </div>
              <div className="ml-5 space-y-0.5 text-xs text-muted-foreground">
                <div>Origin: {region.origin.toLocaleString()}</div>
                <div>Impacted: {region.impacted.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
