"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Layer {
  neurons: number
  activation: number[]
}

export function NeuralNetworkVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [layers, setLayers] = useState<Layer[]>([
    { neurons: 4, activation: [0.8, 0.6, 0.9, 0.7] },
    { neurons: 8, activation: [0.5, 0.8, 0.3, 0.9, 0.6, 0.7, 0.4, 0.8] },
    { neurons: 8, activation: [0.7, 0.5, 0.8, 0.6, 0.9, 0.4, 0.7, 0.5] },
    { neurons: 4, activation: [0.3, 0.8, 0.6, 0.9] },
    { neurons: 2, activation: [0.2, 0.9] },
  ])
  const [threatDetected, setThreatDetected] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate neural network processing
      const isThreat = Math.random() > 0.7
      setThreatDetected(isThreat)

      setLayers((prev) =>
        prev.map((layer) => ({
          ...layer,
          activation: layer.activation.map(() => Math.random()),
        })),
      )
    }, 1500)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#0f172a"
    ctx.fillRect(0, 0, 800, 400)

    const layerSpacing = 160
    const startX = 50

    // Draw connections first (so they appear behind neurons)
    for (let i = 0; i < layers.length - 1; i++) {
      const currentLayer = layers[i]
      const nextLayer = layers[i + 1]
      const x1 = startX + i * layerSpacing
      const x2 = startX + (i + 1) * layerSpacing

      for (let j = 0; j < currentLayer.neurons; j++) {
        const y1 = 200 - (currentLayer.neurons * 25) / 2 + j * 50
        for (let k = 0; k < nextLayer.neurons; k++) {
          const y2 = 200 - (nextLayer.neurons * 25) / 2 + k * 50

          // Connection strength based on activation
          const strength = (currentLayer.activation[j] + nextLayer.activation[k]) / 2
          ctx.strokeStyle = `rgba(34, 211, 238, ${strength * 0.3})`
          ctx.lineWidth = strength * 2
          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }
    }

    // Draw neurons
    layers.forEach((layer, layerIndex) => {
      const x = startX + layerIndex * layerSpacing

      layer.activation.forEach((activation, neuronIndex) => {
        const y = 200 - (layer.neurons * 25) / 2 + neuronIndex * 50

        // Neuron circle
        ctx.beginPath()
        ctx.arc(x, y, 15, 0, Math.PI * 2)

        // Color based on activation
        const intensity = Math.floor(activation * 255)
        if (layerIndex === layers.length - 1 && neuronIndex === 1 && threatDetected) {
          ctx.fillStyle = `rgb(239, 68, 68)` // Red for threat
        } else {
          ctx.fillStyle = `rgb(${intensity}, ${intensity + 50}, 255)`
        }
        ctx.fill()

        // Glow effect for high activation
        if (activation > 0.7) {
          ctx.strokeStyle = `rgba(34, 211, 238, ${activation})`
          ctx.lineWidth = 3
          ctx.stroke()
        }
      })
    })

    // Draw layer labels
    ctx.fillStyle = "#94a3b8"
    ctx.font = "12px monospace"
    ctx.fillText("Input", startX - 10, 380)
    ctx.fillText("Hidden Layers", startX + layerSpacing * 1.5, 380)
    ctx.fillText("Output", startX + layerSpacing * 4 - 10, 380)
  }, [layers, threatDetected])

  return (
    <Card className="p-6 bg-slate-900/50 border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Neural Network Analysis</h3>
        <Badge
          className={
            threatDetected
              ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
              : "bg-green-500/20 text-green-400 border-green-500/30"
          }
        >
          {threatDetected ? "Threat Detected" : "Normal Processing"}
        </Badge>
      </div>

      <canvas ref={canvasRef} width={800} height={400} className="rounded-lg border border-slate-700" />

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <span className="text-slate-400">Input Layer:</span>
          <span className="ml-2 text-white font-mono">4 neurons</span>
        </div>
        <div>
          <span className="text-slate-400">Hidden Layers:</span>
          <span className="ml-2 text-white font-mono">3 layers (8-8-4)</span>
        </div>
        <div>
          <span className="text-slate-400">Output Layer:</span>
          <span className="ml-2 text-white font-mono">2 neurons (safe/threat)</span>
        </div>
      </div>

      <div className="mt-3 text-sm text-slate-400">
        <p>Real-time visualization of the semantic firewall's neural network processing inputs for threat detection.</p>
      </div>
    </Card>
  )
}
