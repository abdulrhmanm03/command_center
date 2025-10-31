"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DataPoint {
  x: number
  y: number
  type: "normal" | "anomaly" | "attack"
  label: string
}

export function EmbeddingSpaceVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([])
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null)

  useEffect(() => {
    // Generate initial data points (normal cluster)
    const points: DataPoint[] = []

    // Normal cluster (center)
    for (let i = 0; i < 50; i++) {
      points.push({
        x: 250 + (Math.random() - 0.5) * 150,
        y: 250 + (Math.random() - 0.5) * 150,
        type: "normal",
        label: "Benign Request",
      })
    }

    setDataPoints(points)

    // Continuously add new points
    const interval = setInterval(() => {
      setDataPoints((prev) => {
        const newPoints = [...prev]

        // Randomly add normal or anomalous points
        const isAnomaly = Math.random() > 0.7
        const isAttack = Math.random() > 0.85

        if (isAttack) {
          newPoints.push({
            x: Math.random() * 500,
            y: Math.random() * 500,
            type: "attack",
            label: "Attack Vector",
          })
        } else if (isAnomaly) {
          newPoints.push({
            x: 250 + (Math.random() - 0.5) * 300,
            y: 250 + (Math.random() - 0.5) * 300,
            type: "anomaly",
            label: "Anomalous Input",
          })
        } else {
          newPoints.push({
            x: 250 + (Math.random() - 0.5) * 150,
            y: 250 + (Math.random() - 0.5) * 150,
            type: "normal",
            label: "Benign Request",
          })
        }

        // Keep only last 100 points
        return newPoints.slice(-100)
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, 500, 500)

    // Draw grid
    ctx.strokeStyle = "#1e293b"
    ctx.lineWidth = 1
    for (let i = 0; i <= 500; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, 500)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(500, i)
      ctx.stroke()
    }

    // Draw center crosshair
    ctx.strokeStyle = "#334155"
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(250, 0)
    ctx.lineTo(250, 500)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, 250)
    ctx.lineTo(500, 250)
    ctx.stroke()

    // Draw data points
    dataPoints.forEach((point) => {
      ctx.beginPath()
      ctx.arc(point.x, point.y, point.type === "attack" ? 8 : 5, 0, Math.PI * 2)

      switch (point.type) {
        case "normal":
          ctx.fillStyle = "#22d3ee"
          break
        case "anomaly":
          ctx.fillStyle = "#fbbf24"
          break
        case "attack":
          ctx.fillStyle = "#ef4444"
          break
      }

      ctx.fill()

      // Add glow effect for attacks
      if (point.type === "attack") {
        ctx.strokeStyle = "#ef4444"
        ctx.lineWidth = 2
        ctx.stroke()
      }
    })
  }, [dataPoints])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Find closest point
    let closest: DataPoint | null = null
    let minDist = Number.POSITIVE_INFINITY

    dataPoints.forEach((point) => {
      const dist = Math.sqrt((point.x - x) ** 2 + (point.y - y) ** 2)
      if (dist < 15 && dist < minDist) {
        closest = point
        minDist = dist
      }
    })

    setHoveredPoint(closest)
  }

  const stats = {
    normal: dataPoints.filter((p) => p.type === "normal").length,
    anomaly: dataPoints.filter((p) => p.type === "anomaly").length,
    attack: dataPoints.filter((p) => p.type === "attack").length,
  }

  return (
    <Card className="p-6 bg-slate-900/50 border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Embedding Space Monitor</h3>
        <div className="flex gap-3">
          <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Normal: {stats.normal}</Badge>
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Anomaly: {stats.anomaly}</Badge>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Attack: {stats.attack}</Badge>
        </div>
      </div>

      <div className="relative">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="rounded-lg border border-slate-700"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredPoint(null)}
        />

        {hoveredPoint && (
          <div className="absolute top-2 left-2 bg-slate-800 border border-slate-700 rounded-lg p-3 text-sm">
            <div className="font-semibold text-white mb-1">{hoveredPoint.label}</div>
            <div className="text-slate-400">
              Position: ({hoveredPoint.x.toFixed(0)}, {hoveredPoint.y.toFixed(0)})
            </div>
            <div className="text-slate-400">
              Type:{" "}
              <span
                className={
                  hoveredPoint.type === "attack"
                    ? "text-red-400"
                    : hoveredPoint.type === "anomaly"
                      ? "text-yellow-400"
                      : "text-cyan-400"
                }
              >
                {hoveredPoint.type}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-slate-400">
        <p>
          Real-time visualization of input embeddings in 2D projection space. Anomalies and attacks are detected based
          on distance from normal cluster.
        </p>
      </div>
    </Card>
  )
}
