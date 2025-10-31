"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { HelpCircle } from "lucide-react"

interface AISecurityScoreProps {
  score: number
  showDetails?: boolean
}

export function AISecurityScore({ score, showDetails = false }: AISecurityScoreProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 80

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0.75 * Math.PI, 2.25 * Math.PI)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 20
    ctx.stroke()

    // Calculate angle based on score
    const startAngle = 0.75 * Math.PI
    const endAngle = startAngle + (score / 100) * 1.5 * Math.PI

    // Determine color based on score
    let gradient
    if (score >= 76) {
      gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
      gradient.addColorStop(0, "#3b82f6") // blue
      gradient.addColorStop(1, "#8b5cf6") // purple
    } else if (score >= 34) {
      gradient = ctx.createLinearGradient(centerX - radius, centerY, centerX + radius, centerY)
      gradient.addColorStop(0, "#f59e0b") // orange
      gradient.addColorStop(1, "#ef4444") // red
    } else {
      gradient = "#ef4444" // red
    }

    // Draw score arc
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, startAngle, endAngle)
    ctx.strokeStyle = gradient
    ctx.lineWidth = 20
    ctx.lineCap = "round"
    ctx.stroke()

    // Draw needle
    const needleAngle = startAngle + (score / 100) * 1.5 * Math.PI
    const needleLength = radius - 10
    const needleX = centerX + Math.cos(needleAngle) * needleLength
    const needleY = centerY + Math.sin(needleAngle) * needleLength

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(needleX, needleY)
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw center circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI)
    ctx.fillStyle = "#ffffff"
    ctx.fill()
  }, [score])

  return (
    <Card className="bg-card/50 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">AI Security Posture Score</h3>
        <HelpCircle className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="flex items-center justify-center">
        <div className="relative">
          <canvas ref={canvasRef} width={200} height={200} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-5xl font-bold text-foreground">{score}</div>
            <div className="text-sm text-muted-foreground">/ 100</div>
          </div>
        </div>
      </div>

      {showDetails && (
        <div className="mt-6 flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500" />
            <span className="text-muted-foreground">1-33</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-orange-500" />
            <span className="text-muted-foreground">34-75</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-muted-foreground">76-100</span>
          </div>
        </div>
      )}
    </Card>
  )
}
