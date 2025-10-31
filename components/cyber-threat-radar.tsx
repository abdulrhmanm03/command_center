"use client"

import { useState, useEffect, useRef } from "react"

interface Attack {
  id: string
  attacker_ip: string
  attacker_country: string
  target: string
  target_ip: string
  ttp: string
  attack_type: string
  severity: "critical" | "high" | "medium" | "low"
  status: "active" | "blocked" | "recon"
  timestamp: string
  volume: number
  progress: number
  cvss?: number
  explanation?: string
}

const COUNTRIES: Record<string, { lat: number; lng: number; name: string; riskLevel: "low" | "medium" | "high" }> = {
  UAE: { lat: 25.2769, lng: 55.2963, name: "UAE", riskLevel: "medium" },
  Russia: { lat: 61.524, lng: 105.3188, name: "Russia", riskLevel: "high" },
  China: { lat: 35.8617, lng: 104.1954, name: "China", riskLevel: "high" },
  "North Korea": { lat: 40.3399, lng: 127.5101, name: "North Korea", riskLevel: "high" },
  Iran: { lat: 32.4279, lng: 53.688, name: "Iran", riskLevel: "high" },
  USA: { lat: 37.0902, lng: -95.7129, name: "USA", riskLevel: "medium" },
  Germany: { lat: 51.1657, lng: 10.4515, name: "Germany", riskLevel: "low" },
  Brazil: { lat: -14.235, lng: -51.9253, name: "Brazil", riskLevel: "medium" },
  India: { lat: 20.5937, lng: 78.9629, name: "India", riskLevel: "medium" },
  UK: { lat: 55.3781, lng: -3.436, name: "UK", riskLevel: "low" },
  France: { lat: 46.2276, lng: 2.2137, name: "France", riskLevel: "low" },
  Japan: { lat: 36.2048, lng: 138.2529, name: "Japan", riskLevel: "low" },
  Ukraine: { lat: 48.3794, lng: 31.1656, name: "Ukraine", riskLevel: "high" },
  Israel: { lat: 31.0461, lng: 34.8516, name: "Israel", riskLevel: "medium" },
  "Saudi Arabia": { lat: 23.8859, lng: 45.0792, name: "Saudi Arabia", riskLevel: "medium" },
  Poland: { lat: 51.9194, lng: 19.1451, name: "Poland", riskLevel: "low" },
  Nigeria: { lat: 9.082, lng: 8.6753, name: "Nigeria", riskLevel: "medium" },
  Indonesia: { lat: -0.7893, lng: 113.9213, name: "Indonesia", riskLevel: "medium" },
  "South Korea": { lat: 35.9078, lng: 127.7669, name: "South Korea", riskLevel: "low" },
  Turkey: { lat: 38.9637, lng: 35.2433, name: "Turkey", riskLevel: "medium" },
  Pakistan: { lat: 30.3753, lng: 69.3451, name: "Pakistan", riskLevel: "medium" },
  Vietnam: { lat: 14.0583, lng: 108.2772, name: "Vietnam", riskLevel: "medium" },
  Thailand: { lat: 15.87, lng: 100.9925, name: "Thailand", riskLevel: "low" },
  Singapore: { lat: 1.3521, lng: 103.8198, name: "Singapore", riskLevel: "low" },
  Australia: { lat: -25.2744, lng: 133.7751, name: "Australia", riskLevel: "low" },
  Canada: { lat: 56.1304, lng: -106.3468, name: "Canada", riskLevel: "low" },
  Mexico: { lat: 23.6345, lng: -102.5528, name: "Mexico", riskLevel: "medium" },
  Netherlands: { lat: 52.1326, lng: 5.2913, name: "Netherlands", riskLevel: "low" },
  Spain: { lat: 40.4637, lng: -3.7492, name: "Spain", riskLevel: "low" },
  Italy: { lat: 41.8719, lng: 12.5674, name: "Italy", riskLevel: "low" },
}

export function CyberThreatRadar() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [selectedAttack, setSelectedAttack] = useState<Attack | null>(null)
  const [autoRotate, setAutoRotate] = useState(true)
  const [timelinePosition, setTimelinePosition] = useState(100)
  const [isPlaying, setIsPlaying] = useState(true)
  const [aiAnalysis, setAiAnalysis] = useState<string>("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [filterSeverity, setFilterSeverity] = useState<string>("all")
  const [filterCountry, setFilterCountry] = useState<string>("all")
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [showLabels, setShowLabels] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [dataDensity, setDataDensity] = useState<"low" | "medium" | "high">("medium")
  const [aiInsights, setAiInsights] = useState<
    Array<{ id: string; message: string; severity: string; timestamp: string }>
  >([])
  const eventSourceRef = useRef<EventSource | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rotationRef = useRef(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<keyof Attack>("timestamp")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)
  const [threatsPerMin, setThreatsPerMin] = useState(0)

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetch("/api/threatmap/initial")
        const data = await response.json()
        if (data.attacks) {
          setAttacks(data.attacks.map((attack: Attack) => ({ ...attack, progress: 1 })))
        }
      } catch (error) {
        console.error("Failed to load initial data:", error)
      }
    }

    loadInitialData()
  }, [])

  // Connect to SSE for live updates
  useEffect(() => {
    const eventSource = new EventSource("/api/threatmap")
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)

      if (data.type === "attack") {
        setAttacks((prev) => [...prev.slice(-49), { ...data.data, progress: 0 }])

        if (data.data.severity === "critical" || (data.data.severity === "high" && Math.random() > 0.6)) {
          analyzeAttack(data.data)
        }
      }
    }

    return () => {
      eventSource.close()
    }
  }, [])

  // Animate attack progress
  useEffect(() => {
    const interval = setInterval(() => {
      setAttacks((prev) =>
        prev
          .map((attack) => ({
            ...attack,
            progress: Math.min(attack.progress + 0.02, 1),
          }))
          .filter((attack) => attack.progress < 1),
      )
    }, 50)

    return () => clearInterval(interval)
  }, [])

  // Calculate threats per minute
  useEffect(() => {
    const interval = setInterval(() => {
      const oneMinuteAgo = Date.now() - 60000
      const recentAttacks = attacks.filter((a) => new Date(a.timestamp).getTime() > oneMinuteAgo)
      setThreatsPerMin(recentAttacks.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [attacks])

  const analyzeAttack = (attack: Attack) => {
    setIsAnalyzing(true)

    setTimeout(() => {
      const analyses = [
        `🎯 High-confidence ${attack.attack_type} campaign from ${attack.attacker_country} → ${attack.target}. ${Math.floor(Math.random() * 20) + 5} attempts detected. Recommend: Immediate firewall rule + rate limiting.`,
        `⚠️ Coordinated attack pattern detected: ${attack.attacker_country} targeting multiple regions. MITRE ${attack.ttp} technique observed. Suggest global threat hunt.`,
        `🔴 Critical threat: ${attack.attack_type} with ${attack.volume.toLocaleString()} requests. Similar to recent APT campaigns. Recommend: Full incident response + forensics.`,
        `🛡️ Automated defense triggered for ${attack.attacker_country} → ${attack.target}. ${attack.attack_type} blocked at edge. Monitoring for lateral movement.`,
        `📊 Threat intelligence correlation: ${attack.attacker_country} IP matches known threat actor IOCs. Confidence: 94%. Recommend: Block + notify CERT.`,
      ]

      const analysis = analyses[Math.floor(Math.random() * analyses.length)]
      setAiAnalysis(analysis)

      setAiInsights((prev) => [
        {
          id: Math.random().toString(36).substr(2, 9),
          message: analysis,
          severity: attack.severity,
          timestamp: new Date().toISOString(),
        },
        ...prev.slice(0, 4),
      ])

      setIsAnalyzing(false)
    }, 1500)
  }

  const handleAction = async (attackId: string, action: string, ip: string) => {
    setActionLoading(attackId)

    try {
      const response = await fetch("/api/threatmap/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attackId, action, ip }),
      })

      const result = await response.json()

      if (result.success) {
        setAttacks((prev) => prev.map((a) => (a.id === attackId ? { ...a, status: "blocked" } : a)))
      }
    } catch (error) {
      console.error("Action failed:", error)
    } finally {
      setActionLoading(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#ef4444"
      case "blocked":
        return "#22c55e"
      case "recon":
        return "#eab308"
      default:
        return "#6b7280"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#dc2626"
      case "high":
        return "#f59e0b"
      case "medium":
        return "#eab308"
      case "low":
        return "#3b82f6"
      default:
        return "#6b7280"
    }
  }

  const filteredAttacks = attacks.filter((attack) => {
    if (filterSeverity !== "all" && attack.severity !== filterSeverity) return false
    if (filterCountry !== "all" && attack.attacker_country !== filterCountry) return false
    if (filterStatus !== "all" && attack.status !== filterStatus) return false
    return true
  })

  const activeAttacks = filteredAttacks.filter((a) => a.status === "active")
  const blockedCount = filteredAttacks.filter((a) => a.status === "blocked").length

  const getCountryPosition = (country: string) => {
    const countryData = COUNTRIES[country]
    if (!countryData) return { x: 400, y: 300 }

    const angle = ((countryData.lng + 180) / 360) * Math.PI * 2
    const riskRadius = countryData.riskLevel === "high" ? 280 : countryData.riskLevel === "medium" ? 180 : 80

    const x = 400 + riskRadius * Math.cos(angle)
    const y = 300 + riskRadius * Math.sin(angle)

    return { x, y }
  }

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animFrame: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const cx = canvas.width / 2
      const cy = canvas.height / 2

      const bgGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 400)
      bgGrad.addColorStop(0, "#06b6d460")
      bgGrad.addColorStop(0.3, "#06b6d430")
      bgGrad.addColorStop(0.6, "#06b6d410")
      bgGrad.addColorStop(1, "transparent")
      ctx.fillStyle = bgGrad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const rings = [
        { radius: 120, color: "#10b981", label: "LOW RISK", width: 3 },
        { radius: 220, color: "#f59e0b", label: "MEDIUM RISK", width: 3 },
        { radius: 320, color: "#ef4444", label: "HIGH RISK", width: 3 },
      ]

      rings.forEach((ring) => {
        ctx.beginPath()
        ctx.arc(cx, cy, ring.radius, 0, Math.PI * 2)
        ctx.strokeStyle = ring.color + "60"
        ctx.lineWidth = ring.width
        ctx.stroke()

        ctx.strokeStyle = ring.color + "15"
        ctx.lineWidth = 25
        ctx.stroke()

        if (showLabels) {
          ctx.fillStyle = ring.color
          ctx.font = "bold 11px sans-serif"
          ctx.textAlign = "center"
          ctx.fillText(ring.label, cx, cy - ring.radius - 15)
        }
      })

      if (autoRotate) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.rotate((rotationRef.current * Math.PI) / 180)

        const sweepGrad = ctx.createLinearGradient(0, 0, 320, 0)
        sweepGrad.addColorStop(0, "#06b6d490")
        sweepGrad.addColorStop(0.2, "#06b6d460")
        sweepGrad.addColorStop(0.5, "#06b6d430")
        sweepGrad.addColorStop(1, "transparent")

        ctx.beginPath()
        ctx.moveTo(0, 0)
        ctx.arc(0, 0, 320, 0, Math.PI / 3)
        ctx.closePath()
        ctx.fillStyle = sweepGrad
        ctx.fill()

        ctx.restore()

        rotationRef.current = (rotationRef.current + 0.5) % 360
      }

      const pulseSize = 50 + 15 * Math.sin(Date.now() / 500)
      const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, pulseSize)
      centerGrad.addColorStop(0, "#06b6d4")
      centerGrad.addColorStop(0.4, "#06b6d480")
      centerGrad.addColorStop(1, "transparent")
      ctx.fillStyle = centerGrad
      ctx.beginPath()
      ctx.arc(cx, cy, pulseSize, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#06b6d4"
      ctx.beginPath()
      ctx.arc(cx, cy, 20, 0, Math.PI * 2)
      ctx.fill()

      animFrame = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animFrame)
  }, [autoRotate, showLabels])

  return (
    <div className="relative h-full w-full overflow-auto bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="absolute left-6 top-6 z-20 flex items-center gap-4">
        <h1 className="text-3xl font-bold">
          <span className="text-cyan-400">GLOBAL RISK</span> <span className="text-white">RADAR 2025</span>
        </h1>
        <div className="flex items-center gap-2 rounded-lg bg-green-500/20 px-4 py-2 backdrop-blur">
          <div className="h-3 w-3 animate-pulse rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
          <span className="text-sm font-bold text-green-400">
            LIVE | {threatsPerMin} threats/min | {new Date().toLocaleTimeString()} GMT
          </span>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center pt-20">
        <div className="relative" style={{ width: "800px", height: "600px" }}>
          <canvas ref={canvasRef} width={800} height={600} className="absolute inset-0" />

          <svg className="absolute inset-0" width="800" height="600" viewBox="0 0 800 600">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {filteredAttacks.map((attack) => {
              const pos = getCountryPosition(attack.attacker_country)
              const startX = pos.x
              const startY = pos.y
              const endX = 400 + (pos.x - 400) * (1 - attack.progress)
              const endY = 300 + (pos.y - 300) * (1 - attack.progress)
              const color = getStatusColor(attack.status)

              return (
                <g key={attack.id}>
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke={color}
                    strokeWidth="2"
                    opacity={0.6 * (1 - attack.progress * 0.3)}
                    filter="url(#glow)"
                  />
                  {attack.status === "active" && (
                    <circle cx={endX} cy={endY} r="6" fill={color} opacity="0.9">
                      <animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle cx={startX} cy={startY} r={8} fill={color} opacity="0.8" filter="url(#glow)" />
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}
