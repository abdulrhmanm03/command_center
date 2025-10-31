"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import type { AIAsset } from "@/lib/db"

interface AISPMRadarProps {
  assets: AIAsset[]
  onAssetClick?: (asset: AIAsset) => void
}

export function AISPMRadar({ assets, onAssetClick }: AISPMRadarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw concentric risk rings
    const rings = [
      { radius: 240, label: "HIGH", color: "rgba(239, 68, 68, 0.2)", stroke: "rgba(239, 68, 68, 0.4)" },
      { radius: 160, label: "MEDIUM", color: "rgba(234, 179, 8, 0.2)", stroke: "rgba(234, 179, 8, 0.4)" },
      { radius: 80, label: "LOW", color: "rgba(34, 197, 94, 0.2)", stroke: "rgba(34, 197, 94, 0.4)" },
    ]

    rings.forEach((ring) => {
      ctx.beginPath()
      ctx.arc(centerX, centerY, ring.radius, 0, 2 * Math.PI)
      ctx.fillStyle = ring.color
      ctx.fill()
      ctx.strokeStyle = ring.stroke
      ctx.lineWidth = 1
      ctx.stroke()

      // Draw label
      ctx.fillStyle = "rgba(255, 255, 255, 0.6)"
      ctx.font = "10px sans-serif"
      ctx.textAlign = "center"
      ctx.fillText(ring.label, centerX, centerY - ring.radius + 15)
    })

    // Draw center pulse
    const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 30)
    gradient.addColorStop(0, "rgba(6, 182, 212, 0.8)")
    gradient.addColorStop(1, "rgba(6, 182, 212, 0)")
    ctx.beginPath()
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI)
    ctx.fillStyle = gradient
    ctx.fill()

    // Draw center dot
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
    ctx.fillStyle = "#06b6d4"
    ctx.fill()
    ctx.shadowColor = "#06b6d4"
    ctx.shadowBlur = 20
    ctx.fill()
    ctx.shadowBlur = 0
  }, [])

  // Position assets in risk rings
  const positionedAssets = assets.map((asset, index) => {
    const angle = (index / assets.length) * 2 * Math.PI
    let radius = 80 // Low risk
    if (asset.risk_score >= 80)
      radius = 240 // High risk
    else if (asset.risk_score >= 40) radius = 160 // Medium risk

    const x = 400 + Math.cos(angle) * radius
    const y = 400 + Math.sin(angle) * radius

    return { ...asset, x, y }
  })

  return (
    <Card className="relative bg-card/50 p-6 backdrop-blur-sm">
      <div className="mb-4 text-center">
        <h3 className="text-lg font-semibold text-foreground">AI Risk Radar</h3>
        <p className="text-xs text-muted-foreground">Real-time AI asset risk visualization</p>
      </div>

      <div className="relative flex items-center justify-center">
        <canvas ref={canvasRef} width={800} height={800} className="absolute" />
        <svg ref={svgRef} width={800} height={800} className="relative">
          {positionedAssets.map((asset) => {
            const color = asset.risk_score >= 80 ? "#ef4444" : asset.risk_score >= 40 ? "#eab308" : "#22c55e"

            return (
              <g
                key={asset.id}
                onClick={() => onAssetClick?.(asset)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <circle cx={asset.x} cy={asset.y} r={12} fill={color} opacity={0.8} className="animate-pulse" />
                <circle cx={asset.x} cy={asset.y} r={8} fill={color} />
                <title>
                  {asset.name} - Risk: {asset.risk_score}/100
                  {asset.top_risk && `\n${asset.top_risk}`}
                </title>
              </g>
            )
          })}
        </svg>
      </div>
    </Card>
  )
}
