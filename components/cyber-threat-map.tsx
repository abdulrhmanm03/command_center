"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Share2 } from "lucide-react"

interface ThreatLine {
  id: string
  from: number
  to: number
  type: "incoming" | "outgoing"
  protocol: string
  progress: number
}

interface CountryNode {
  name: string
  angle: number
  threats: number
  active: boolean
}

interface CountryStats {
  country: string
  rank: number
  DOS: number
  WEB: number
  MAL: number
  SSH: number
  MAIL: number
  FTP: number
  P2P: number
  BRUT: number
}

const protocols = ["DOS", "WEB", "MAL", "SSH", "MAIL", "FTP", "P2P", "BRUT"]

const countries: CountryNode[] = [
  { name: "USA", angle: 0, threats: 1250, active: false },
  { name: "UK", angle: 30, threats: 980, active: false },
  { name: "GERMANY", angle: 60, threats: 1120, active: false },
  { name: "UAE", angle: 75, threats: 2350, active: false }, // Increased threats significantly
  { name: "POLAND", angle: 90, threats: 1450, active: true },
  { name: "RUSSIA", angle: 120, threats: 2100, active: false },
  { name: "CHINA", angle: 150, threats: 2400, active: false },
  { name: "JAPAN", angle: 180, threats: 1680, active: false },
  { name: "INDIA", angle: 210, threats: 1320, active: false },
  { name: "AUSTRALIA", angle: 240, threats: 890, active: false },
  { name: "BRAZIL", angle: 270, threats: 1050, active: false },
  { name: "CANADA", angle: 300, threats: 1180, active: false },
  { name: "FRANCE", angle: 330, threats: 1090, active: false },
]

const countryData: Record<string, CountryStats> = {
  USA: {
    country: "USA",
    rank: 3,
    DOS: 45230,
    WEB: 38920,
    MAL: 2340,
    SSH: 31200,
    MAIL: 52100,
    FTP: 1890,
    P2P: 412000,
    BRUT: 890,
  },
  UK: {
    country: "UK",
    rank: 12,
    DOS: 22100,
    WEB: 19800,
    MAL: 1560,
    SSH: 18900,
    MAIL: 28400,
    FTP: 980,
    P2P: 198000,
    BRUT: 450,
  },
  GERMANY: {
    country: "GERMANY",
    rank: 8,
    DOS: 31200,
    WEB: 27600,
    MAL: 1980,
    SSH: 24500,
    MAIL: 39200,
    FTP: 1340,
    P2P: 287000,
    BRUT: 670,
  },
  POLAND: {
    country: "POLAND",
    rank: 18,
    DOS: 28956,
    WEB: 21908,
    MAL: 1864,
    SSH: 26276,
    MAIL: 46148,
    FTP: 1258,
    P2P: 321945,
    BRUT: 0,
  },
  RUSSIA: {
    country: "RUSSIA",
    rank: 2,
    DOS: 58900,
    WEB: 49200,
    MAL: 3120,
    SSH: 42300,
    MAIL: 67800,
    FTP: 2340,
    P2P: 523000,
    BRUT: 1200,
  },
  CHINA: {
    country: "CHINA",
    rank: 1,
    DOS: 72400,
    WEB: 61200,
    MAL: 4230,
    SSH: 53400,
    MAIL: 89200,
    FTP: 3120,
    P2P: 678000,
    BRUT: 1560,
  },
  JAPAN: {
    country: "JAPAN",
    rank: 6,
    DOS: 36700,
    WEB: 32100,
    MAL: 2230,
    SSH: 28900,
    MAIL: 44500,
    FTP: 1670,
    P2P: 156000,
    BRUT: 340,
  },
  INDIA: {
    country: "INDIA",
    rank: 10,
    DOS: 29800,
    WEB: 24500,
    MAL: 1890,
    SSH: 22100,
    MAIL: 35600,
    FTP: 1120,
    P2P: 267000,
    BRUT: 560,
  },
  AUSTRALIA: {
    country: "AUSTRALIA",
    rank: 22,
    DOS: 18900,
    WEB: 15600,
    MAL: 1230,
    SSH: 14500,
    MAIL: 22300,
    FTP: 780,
    P2P: 156000,
    BRUT: 340,
  },
  BRAZIL: {
    country: "BRAZIL",
    rank: 15,
    DOS: 24500,
    WEB: 20100,
    MAL: 1560,
    SSH: 18200,
    MAIL: 29800,
    FTP: 990,
    P2P: 212000,
    BRUT: 490,
  },
  CANADA: {
    country: "CANADA",
    rank: 14,
    DOS: 26300,
    WEB: 22400,
    MAL: 1670,
    SSH: 19800,
    MAIL: 32100,
    FTP: 1090,
    P2P: 234000,
    BRUT: 520,
  },
  FRANCE: {
    country: "FRANCE",
    rank: 11,
    DOS: 27800,
    WEB: 23900,
    MAL: 1780,
    SSH: 21200,
    MAIL: 34500,
    FTP: 1150,
    P2P: 245000,
    BRUT: 580,
  },
  UAE: {
    country: "UAE",
    rank: 2, // Promoted from rank 7 to rank 2
    DOS: 64200, // Increased from 34200
    WEB: 55800, // Increased from 29800
    MAL: 3920, // Increased from 2120
    SSH: 48600, // Increased from 27600
    MAIL: 71300, // Increased from 41300
    FTP: 2860, // Increased from 1560
    P2P: 598000, // Increased from 298000
    BRUT: 1580, // Increased from 780
  },
}

export function CyberThreatMap() {
  const [threatLines, setThreatLines] = useState<ThreatLine[]>([])
  const [nodes, setNodes] = useState<CountryNode[]>(countries)
  const [selectedCountry, setSelectedCountry] = useState<CountryStats>(countryData.POLAND)
  const [time, setTime] = useState(new Date())
  const [autoRotate, setAutoRotate] = useState(true)
  const [currentCountryIndex, setCurrentCountryIndex] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => {
      const fromIdx = Math.floor(Math.random() * countries.length)
      let toIdx = Math.floor(Math.random() * countries.length)
      while (toIdx === fromIdx) {
        toIdx = Math.floor(Math.random() * countries.length)
      }

      const newLine: ThreatLine = {
        id: Math.random().toString(36),
        from: fromIdx,
        to: toIdx,
        type: Math.random() > 0.5 ? "incoming" : "outgoing",
        protocol: protocols[Math.floor(Math.random() * protocols.length)],
        progress: 0,
      }

      setThreatLines((prev) => [...prev.slice(-15), newLine])
    }, 600)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setThreatLines((prev) =>
        prev
          .map((line) => ({
            ...line,
            progress: Math.min(line.progress + 0.015, 1),
          }))
          .filter((line) => line.progress < 1),
      )
    }, 30)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          threats: node.threats + Math.floor(Math.random() * 5),
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!autoRotate) return

    const interval = setInterval(() => {
      setCurrentCountryIndex((prev) => {
        const nextIndex = (prev + 1) % countries.length
        const nextCountry = countries[nextIndex]
        setSelectedCountry(countryData[nextCountry.name])
        return nextIndex
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [autoRotate])

  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedCountry((prev) => ({
        ...prev,
        DOS: prev.DOS + Math.floor(Math.random() * 15),
        WEB: prev.WEB + Math.floor(Math.random() * 12),
        MAL: prev.MAL + Math.floor(Math.random() * 5),
        SSH: prev.SSH + Math.floor(Math.random() * 18),
        MAIL: prev.MAIL + Math.floor(Math.random() * 22),
        FTP: prev.FTP + Math.floor(Math.random() * 3),
        P2P: prev.P2P + Math.floor(Math.random() * 80),
        BRUT: prev.BRUT + Math.floor(Math.random() * 8),
      }))
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const centerX = 1000
  const centerY = 500
  const radius = 380

  const getNodePosition = (angle: number) => {
    const rad = (angle * Math.PI) / 180
    return {
      x: centerX + radius * Math.cos(rad),
      y: centerY + radius * Math.sin(rad),
    }
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Header */}
      <div className="absolute left-6 top-6 z-20 flex items-center gap-4">
        <h1 className="text-2xl font-bold text-cyan-400">
          CYBERTHREAT <span className="text-white">REAL-TIME MAP</span>
        </h1>
        <div className="flex items-center gap-2 rounded bg-green-500/20 px-3 py-1">
          <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
          <span className="text-sm font-medium text-green-400">LIVE</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAutoRotate(!autoRotate)}
          className={`border-cyan-500/50 ${autoRotate ? "bg-cyan-500/20 text-cyan-400" : "bg-black/50 text-gray-400"}`}
        >
          {autoRotate ? "Auto-Rotate ON" : "Auto-Rotate OFF"}
        </Button>
      </div>

      {/* Top Right Actions */}
      <div className="absolute right-6 top-6 z-20 flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="border-cyan-500/50 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
        >
          Download Trial
        </Button>
        <Button variant="ghost" size="icon" className="text-white hover:text-cyan-400">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>

      {/* Left Sidebar - Country Stats */}
      <Card className="absolute left-6 top-24 z-20 w-64 border-cyan-500/30 bg-black/90 backdrop-blur">
        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">{selectedCountry.country}</h2>
            {autoRotate && (
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 animate-pulse rounded-full bg-magenta-500" />
                <span className="text-xs text-magenta-400">AUTO</span>
              </div>
            )}
          </div>
          <p className="text-sm text-cyan-400">#{selectedCountry.rank} MOST ATTACKED COUNTRY</p>

          <div className="mt-6 space-y-3">
            {protocols.map((protocol) => (
              <div key={protocol} className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-400">{protocol}</span>
                <span className="font-mono text-sm text-white">
                  {selectedCountry[protocol as keyof typeof selectedCountry].toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs text-gray-500">Detections discovered since 00:00 GMT</p>

          <Button variant="link" className="mt-2 h-auto p-0 text-cyan-400">
            More details
          </Button>

          <div className="mt-4 border-t border-cyan-500/30 pt-4">
            <p className="text-xs text-gray-400">Share data</p>
            <div className="mt-2 flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-cyan-400 hover:text-cyan-300">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Right Sidebar - Controls */}
      <div className="absolute right-6 top-24 z-20 flex flex-col gap-2">
        <Button
          variant="outline"
          size="icon"
          className="border-cyan-500/50 bg-black/80 text-cyan-400 hover:bg-cyan-500/20"
        >
          {/* Globe icon is replaced */}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-cyan-500/50 bg-black/80 text-cyan-400 hover:bg-cyan-500/20"
          onClick={() => {
            // Zoom functionality is removed
          }}
        >
          {/* ZoomIn icon is replaced */}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-cyan-500/50 bg-black/80 text-cyan-400 hover:bg-cyan-500/20"
          onClick={() => {
            // ZoomOut functionality is removed
          }}
        >
          {/* ZoomOut icon is replaced */}
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="border-cyan-500/50 bg-black/80 text-cyan-400 hover:bg-cyan-500/20"
          onClick={() => {
            setThreatLines([])
            setNodes(countries.map((node) => ({ ...node, active: false })))
            setSelectedCountry(countryData.POLAND)
            setCurrentCountryIndex(3)
            setAutoRotate(true)
          }}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Main Radial Network Visualization */}
      <div className="relative h-full w-full overflow-hidden">
        <svg className="h-full w-full" viewBox="0 0 2000 1000" preserveAspectRatio="xMidYMid meet">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id="centerGlow">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00ffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={centerX} cy={centerY} r="300" fill="url(#centerGlow)" opacity="0.4" />

          {[100, 200, 300, 380].map((r, i) => (
            <circle
              key={r}
              cx={centerX}
              cy={centerY}
              r={r}
              fill="none"
              stroke="#00ffff"
              strokeWidth="1"
              opacity={0.15 - i * 0.03}
              strokeDasharray="5,5"
            />
          ))}

          {threatLines.map((line) => {
            const fromPos = getNodePosition(nodes[line.from].angle)
            const toPos = getNodePosition(nodes[line.to].angle)

            const color = line.type === "incoming" ? "#00ffff" : "#ff00ff"
            const opacity = 0.7 * (1 - line.progress * 0.4)

            const controlX = centerX + (Math.random() - 0.5) * 100
            const controlY = centerY + (Math.random() - 0.5) * 100

            return (
              <g key={line.id}>
                <path
                  d={`M ${fromPos.x} ${fromPos.y} Q ${controlX} ${controlY} ${toPos.x} ${toPos.y}`}
                  stroke={color}
                  strokeWidth="2.5"
                  fill="none"
                  opacity={opacity}
                  filter="url(#glow)"
                  strokeDasharray="8,4"
                  strokeDashoffset={-line.progress * 150}
                />

                <circle cx={fromPos.x} cy={fromPos.y} r="4" fill={color} opacity={opacity}>
                  <animateMotion
                    dur="2s"
                    repeatCount="1"
                    path={`M 0 0 Q ${controlX - fromPos.x} ${controlY - fromPos.y} ${toPos.x - fromPos.x} ${toPos.y - fromPos.y}`}
                  />
                </circle>
              </g>
            )
          })}

          {nodes.map((node, idx) => {
            const pos = getNodePosition(node.angle)
            const isActive = node.name === selectedCountry.country
            const nodeColor = isActive ? "#ff00ff" : "#00ffff"
            const nodeSize = isActive ? 16 : 12

            return (
              <g
                key={node.name}
                className="cursor-pointer transition-all"
                onClick={() => {
                  setAutoRotate(false)
                  setSelectedCountry(countryData[node.name])
                  setCurrentCountryIndex(idx)
                }}
              >
                {node.name === "UAE" && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={nodeSize + 20}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="3"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="r"
                      values={`${nodeSize + 20};${nodeSize + 35};${nodeSize + 20}`}
                      dur="2s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeSize + 8}
                  fill="none"
                  stroke={nodeColor}
                  strokeWidth="2"
                  opacity="0.3"
                >
                  <animate
                    attributeName="r"
                    values={`${nodeSize + 8};${nodeSize + 18};${nodeSize + 8}`}
                    dur="2s"
                    repeatCount="indefinite"
                  />
                  <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
                </circle>

                <circle cx={pos.x} cy={pos.y} r={nodeSize} fill={nodeColor} opacity="0.9" filter="url(#glow)">
                  <animate attributeName="opacity" values="0.9;1;0.9" dur="1.5s" repeatCount="indefinite" />
                </circle>

                <text
                  x={pos.x}
                  y={pos.y - nodeSize - 12}
                  fill={node.name === "UAE" ? "#fbbf24" : nodeColor}
                  fontSize={node.name === "UAE" ? "15" : "13"}
                  textAnchor="middle"
                  className="font-mono font-bold"
                >
                  {node.name}
                  {node.name === "UAE" && " ⭐"}
                </text>

                <text
                  x={pos.x}
                  y={pos.y + nodeSize + 20}
                  fill="#ffffff"
                  fontSize="11"
                  textAnchor="middle"
                  className="font-mono"
                >
                  {node.threats.toLocaleString()}
                </text>
              </g>
            )
          })}

          <circle cx={centerX} cy={centerY} r="20" fill="#00ffff" opacity="0.2" />
          <circle cx={centerX} cy={centerY} r="10" fill="#00ffff" opacity="0.5">
            <animate attributeName="r" values="10;15;10" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
          <text
            x={centerX}
            y={centerY + 5}
            fill="#00ffff"
            fontSize="12"
            textAnchor="middle"
            className="font-mono font-bold"
          >
            VTS
          </text>
        </svg>
      </div>

      {/* Bottom Timeline */}
      <div className="absolute bottom-6 left-1/2 z-20 w-[600px] -translate-x-1/2">
        <Card className="border-cyan-500/30 bg-black/80 backdrop-blur">
          <div className="p-4">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>MON</span>
              <span>TUE</span>
              <span>WED</span>
              <span>THU</span>
              <span>FRI</span>
              <span>SAT</span>
              <span>SUN</span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-cyan-500/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-magenta-500"
                style={{ width: `${(time.getDay() / 7) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-center text-xs text-cyan-400">{time.toLocaleTimeString()} GMT</p>
          </div>
        </Card>
      </div>

      {/* Stats Counter */}
      <div className="absolute bottom-6 right-6 z-20">
        <Card className="border-cyan-500/30 bg-black/80 backdrop-blur">
          <div className="p-4">
            <p className="text-xs text-gray-400">Total Threats Detected</p>
            <p className="text-2xl font-bold text-cyan-400">
              {Object.values(selectedCountry)
                .reduce((acc, val) => (typeof val === "number" ? acc + val : acc), 0)
                .toLocaleString()}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
