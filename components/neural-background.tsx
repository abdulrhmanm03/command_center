"use client"

import { useEffect, useRef } from "react"

export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Neural network nodes
    const nodes: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      pulsePhase: number
    }> = []

    // Create nodes
    const nodeCount = 80
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
        pulsePhase: Math.random() * Math.PI * 2,
      })
    }

    // Floating particles
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    const particleCount = 50
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    let animationFrame: number
    let time = 0

    const animate = () => {
      time += 0.01
      ctx.fillStyle = "rgba(10, 15, 30, 0.1)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw nodes
      nodes.forEach((node, i) => {
        // Update position
        node.x += node.vx
        node.y += node.vy

        // Bounce off edges
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1

        // Keep in bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x))
        node.y = Math.max(0, Math.min(canvas.height, node.y))

        // Draw connections
        nodes.forEach((otherNode, j) => {
          if (i === j) return
          const dx = otherNode.x - node.x
          const dy = otherNode.y - node.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 150) {
            const opacity = (1 - distance / 150) * 0.3
            ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(node.x, node.y)
            ctx.lineTo(otherNode.x, otherNode.y)
            ctx.stroke()
          }
        })

        // Draw node with pulse
        const pulse = Math.sin(time * 2 + node.pulsePhase) * 0.5 + 0.5
        const glowSize = node.radius + pulse * 2

        // Outer glow
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, glowSize * 3)
        gradient.addColorStop(0, `rgba(59, 130, 246, ${0.4 + pulse * 0.3})`)
        gradient.addColorStop(0.5, `rgba(59, 130, 246, ${0.1 + pulse * 0.1})`)
        gradient.addColorStop(1, "rgba(59, 130, 246, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, glowSize * 3, 0, Math.PI * 2)
        ctx.fill()

        // Core node
        ctx.fillStyle = `rgba(96, 165, 250, ${0.8 + pulse * 0.2})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // Update and draw particles
      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        particle.x = Math.max(0, Math.min(canvas.width, particle.x))
        particle.y = Math.max(0, Math.min(canvas.height, particle.y))

        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 w-full h-full" />
}
