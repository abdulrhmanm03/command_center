"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Activity, AlertTriangle, Globe, Zap, Filter, Download, Shield, TrendingUp, Clock } from "lucide-react"

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

const COUNTRY_FLAGS: Record<string, string> = {
  UAE: "🇦🇪",
  Russia: "🇷🇺",
  China: "🇨🇳",
  "North Korea": "🇰🇵",
  Iran: "🇮🇷",
  USA: "🇺🇸",
  Germany: "🇩🇪",
  Brazil: "🇧🇷",
  India: "🇮🇳",
  UK: "🇬🇧",
  Ukraine: "🇺🇦",
  Israel: "🇮🇱",
  "Saudi Arabia": "🇸🇦",
  Poland: "🇵🇱",
  Nigeria: "🇳🇬",
  Indonesia: "🇮🇩",
  Turkey: "🇹🇷",
  Vietnam: "🇻🇳",
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
  Ukraine: { lat: 48.3794, lng: 31.1656, name: "Ukraine", riskLevel: "high" },
  Israel: { lat: 31.0461, lng: 34.8516, name: "Israel", riskLevel: "medium" },
  "Saudi Arabia": { lat: 23.8859, lng: 45.0792, name: "Saudi Arabia", riskLevel: "medium" },
  Poland: { lat: 51.9194, lng: 19.1451, name: "Poland", riskLevel: "low" },
  Nigeria: { lat: 9.082, lng: 8.6753, name: "Nigeria", riskLevel: "medium" },
  Indonesia: { lat: -0.7893, lng: 113.9213, name: "Indonesia", riskLevel: "medium" },
  Turkey: { lat: 38.9637, lng: 35.2433, name: "Turkey", riskLevel: "medium" },
  Vietnam: { lat: 14.0583, lng: 108.2772, name: "Vietnam", riskLevel: "medium" },
}

const getRadarPosition = (lat: number, lng: number, radius: number, centerX: number, centerY: number) => {
  const angle = ((lng + 180) / 360) * 2 * Math.PI
  const normalizedLat = (lat + 90) / 180
  const distance = radius * (0.4 + normalizedLat * 0.5)
  const x = centerX + Math.cos(angle - Math.PI / 2) * distance
  const y = centerY + Math.sin(angle - Math.PI / 2) * distance
  return { x, y, angle }
}

export function CyberThreatRadar() {
  const [attacks, setAttacks] = useState<Attack[]>([])
  const [threatsPerMin, setThreatsPerMin] = useState(0)
  const [countryThreatCounts, setCountryThreatCounts] = useState<Record<string, number>>({})
  const [attackTypeCounts, setAttackTypeCounts] = useState<Record<string, number>>({})
  const [sweepAngle, setSweepAngle] = useState(0)
  const eventSourceRef = useRef<EventSource | null>(null)

  const [severityFilter, setSeverityFilter] = useState<string>("all")
  const [countryFilter, setCountryFilter] = useState<string>("all")
  const [attackTypeFilter, setAttackTypeFilter] = useState<string>("all")
  const [showMitreMap, setShowMitreMap] = useState(false)

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await fetch("/api/threatmap/initial")
        const data = await response.json()
        if (data.attacks) {
          setAttacks(data.attacks.map((attack: Attack) => ({ ...attack, progress: Math.random() * 0.3 })))
        }
      } catch (error) {
        console.error("[v0] Failed to load initial data:", error)
        setAttacks(generateFallbackAttacks(40))
      }
    }
    loadInitialData()
  }, [])

  useEffect(() => {
    const eventSource = new EventSource("/api/threatmap")
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === "attack") {
          setAttacks((prev) => [...prev.slice(-49), { ...data.data, progress: 0 }])
        }
      } catch (error) {
        console.error("[v0] Failed to parse SSE data:", error)
      }
    }

    eventSource.onerror = () => {
      eventSource.close()
      const pollInterval = setInterval(() => {
        const newAttack = generateFallbackAttacks(1)[0]
        setAttacks((prev) => [...prev.slice(-49), { ...newAttack, progress: 0 }])
      }, 4000)

      return () => clearInterval(pollInterval)
    }

    return () => eventSource.close()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setAttacks((prev) =>
        prev
          .map((attack) => ({ ...attack, progress: Math.min(attack.progress + 0.008, 1) }))
          .filter((attack) => attack.progress < 1),
      )
    }, 50)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const oneMinuteAgo = Date.now() - 60000
      const recentAttacks = attacks.filter((a) => new Date(a.timestamp).getTime() > oneMinuteAgo)
      setThreatsPerMin(recentAttacks.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [attacks])

  useEffect(() => {
    const counts: Record<string, number> = {}
    const typeCounts: Record<string, number> = {}
    attacks.forEach((attack) => {
      counts[attack.attacker_country] = (counts[attack.attacker_country] || 0) + 1
      typeCounts[attack.attack_type] = (typeCounts[attack.attack_type] || 0) + 1
    })
    setCountryThreatCounts(counts)
    setAttackTypeCounts(typeCounts)
  }, [attacks])

  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle((prev) => (prev + 1.5) % 360)
    }, 30)
    return () => clearInterval(interval)
  }, [])

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

  const getRelativeTime = (timestamp: string) => {
    const now = Date.now()
    const then = new Date(timestamp).getTime()
    const diff = Math.floor((now - then) / 1000) // seconds

    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
    return `${Math.floor(diff / 86400)}d ago`
  }

  const filteredAttacks = useMemo(() => {
    return attacks.filter((attack) => {
      if (severityFilter !== "all" && attack.severity !== severityFilter) return false
      if (countryFilter !== "all" && attack.attacker_country !== countryFilter) return false
      if (attackTypeFilter !== "all" && attack.attack_type !== attackTypeFilter) return false
      return true
    })
  }, [attacks, severityFilter, countryFilter, attackTypeFilter])

  const mitreTactics = useMemo(() => {
    return filteredAttacks.reduce(
      (acc, attack) => {
        const tactic = attack.ttp.split(".")[0]
        acc[tactic] = (acc[tactic] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [filteredAttacks])

  const activeAttacks = useMemo(() => {
    return filteredAttacks.filter((a) => a.status === "active")
  }, [filteredAttacks])

  const sortedCountries = useMemo(() => {
    return Object.entries(countryThreatCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 12)
  }, [countryThreatCounts])

  const sortedAttackTypes = useMemo(() => {
    return Object.entries(attackTypeCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
  }, [attackTypeCounts])

  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-br from-gray-950 via-black to-gray-950">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(to right, #06b6d4 1px, transparent 1px),
            linear-gradient(to bottom, #06b6d4 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* Header with enhanced styling */}
      <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-8 py-6 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Globe className="h-10 w-10 text-cyan-400" />
              <div className="absolute inset-0 animate-ping">
                <Globe className="h-10 w-10 text-cyan-400 opacity-20" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  GLOBAL RISK
                </span>
                <span className="text-white ml-2">RADAR</span>
              </h1>
              <p className="text-xs text-gray-400 font-mono mt-0.5">Real-time Threat Intelligence • 2025</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Live indicator */}
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 px-6 py-3 backdrop-blur-md border border-green-500/40 shadow-lg shadow-green-500/20">
            <div className="relative">
              <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />
              <div className="absolute inset-0 animate-ping">
                <div className="h-3 w-3 rounded-full bg-green-500 opacity-75" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-green-400 uppercase tracking-wider">Live Feed</span>
              <span className="text-[10px] text-green-300/70 font-mono">{new Date().toLocaleTimeString()} GMT</span>
            </div>
          </div>

          {/* Threats per minute */}
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-6 py-3 backdrop-blur-md border border-cyan-500/40 shadow-lg shadow-cyan-500/20">
            <Zap className="h-5 w-5 text-cyan-400" />
            <div className="flex flex-col">
              <span className="text-2xl font-black text-cyan-400">{threatsPerMin}</span>
              <span className="text-[10px] text-cyan-300/70 uppercase tracking-wider">Threats/Min</span>
            </div>
          </div>

          {/* Active threats */}
          <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-red-500/20 to-orange-500/20 px-6 py-3 backdrop-blur-md border border-red-500/40 shadow-lg shadow-red-500/20">
            <AlertTriangle className="h-5 w-5 text-red-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-2xl font-black text-red-400">{activeAttacks.length}</span>
              <span className="text-[10px] text-red-300/70 uppercase tracking-wider">Active Now</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMitreMap(!showMitreMap)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                showMitreMap
                  ? "bg-purple-500/30 border-purple-500/50 text-purple-400"
                  : "bg-gray-800/50 border-gray-700/50 text-gray-400 hover:bg-gray-700/50"
              } border backdrop-blur-sm`}
            >
              <Shield className="h-4 w-4" />
              <span className="text-xs font-bold">MITRE</span>
            </button>

            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:bg-gray-700/50 transition-all duration-200 backdrop-blur-sm">
                <Filter className="h-4 w-4" />
                <span className="text-xs font-bold">Filters</span>
              </button>

              <div className="absolute right-0 top-full mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 shadow-2xl z-50">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 block">
                      Severity
                    </label>
                    <select
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="all">All Severities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 block">
                      Country
                    </label>
                    <select
                      value={countryFilter}
                      onChange={(e) => setCountryFilter(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="all">All Countries</option>
                      {Object.keys(COUNTRIES).map((code) => (
                        <option key={code} value={code}>
                          {code}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2 block">
                      Attack Type
                    </label>
                    <select
                      value={attackTypeFilter}
                      onChange={(e) => setAttackTypeFilter(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-cyan-500"
                    >
                      <option value="all">All Types</option>
                      {Array.from(new Set(attacks.map((a) => a.attack_type))).map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      setSeverityFilter("all")
                      setCountryFilter("all")
                      setAttackTypeFilter("all")
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold hover:bg-cyan-500/30 transition-all duration-200"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700/50 text-gray-400 hover:bg-gray-700/50 transition-all duration-200 backdrop-blur-sm">
              <Download className="h-4 w-4" />
              <span className="text-xs font-bold">Export</span>
            </button>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 pt-32 pb-4 overflow-y-auto">
        <div className="w-full max-w-[1800px] mx-auto px-8 space-y-6">
          {/* Top Statistics Row */}
          <div className="grid grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl p-6 border border-cyan-500/30 backdrop-blur-xl shadow-2xl shadow-cyan-500/10">
              <div className="flex items-center justify-between mb-3">
                <Globe className="h-8 w-8 text-cyan-400" />
                <div className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">LIVE</div>
              </div>
              <div className="text-4xl font-black text-cyan-400 mb-1">{filteredAttacks.length}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Total Threats</div>
            </div>

            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-2xl p-6 border border-red-500/30 backdrop-blur-xl shadow-2xl shadow-red-500/10">
              <div className="flex items-center justify-between mb-3">
                <AlertTriangle className="h-8 w-8 text-red-400 animate-pulse" />
                <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">CRITICAL</div>
              </div>
              <div className="text-4xl font-black text-red-400 mb-1">
                {filteredAttacks.filter((a) => a.severity === "critical").length}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Critical Alerts</div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/30 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
              <div className="flex items-center justify-between mb-3">
                <Activity className="h-8 w-8 text-purple-400" />
                <div className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold">ACTIVE</div>
              </div>
              <div className="text-4xl font-black text-purple-400 mb-1">{Object.keys(countryThreatCounts).length}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Countries Affected</div>
            </div>

            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/30 backdrop-blur-xl shadow-2xl shadow-green-500/10">
              <div className="flex items-center justify-between mb-3">
                <Shield className="h-8 w-8 text-green-400" />
                <div className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold">BLOCKED</div>
              </div>
              <div className="text-4xl font-black text-green-400 mb-1">
                {filteredAttacks.filter((a) => a.status === "blocked").length}
              </div>
              <div className="text-sm text-gray-400 uppercase tracking-wider">Threats Blocked</div>
            </div>
          </div>

          {/* Main Content Grid - Radar with Side Panels */}
          <div className="grid grid-cols-12 gap-6">
            {/* Left Side Panel - Real-time Activity */}
            <div className="col-span-3 space-y-6">
              {/* Threat Activity Timeline */}
              <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl p-5 border border-cyan-500/20 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/30">
                  <div className="p-2 rounded-lg bg-cyan-500/20">
                    <Clock className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Activity Timeline</h3>
                    <p className="text-[10px] text-gray-400">Last 10 threats</p>
                  </div>
                </div>
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
                  {filteredAttacks.slice(0, 10).map((attack, idx) => (
                    <div
                      key={attack.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gray-900/50 hover:bg-cyan-500/10 transition-all duration-200 border border-transparent hover:border-cyan-500/30"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getSeverityColor(attack.severity) }}
                        />
                        {idx < 9 && <div className="w-0.5 h-full bg-gray-800" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm">{COUNTRY_FLAGS[attack.attacker_country]}</span>
                          <span className="font-mono text-xs text-gray-300 font-bold">{attack.attacker_country}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{attack.attack_type}</p>
                        <p className="text-[10px] text-cyan-400 font-mono mt-1">{getRelativeTime(attack.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Attack Origins */}
              <div className="bg-gradient-to-br from-red-500/5 to-orange-500/5 rounded-2xl p-5 border border-red-500/20 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-red-500/30">
                  <div className="p-2 rounded-lg bg-red-500/20">
                    <TrendingUp className="h-5 w-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">Top Origins</h3>
                    <p className="text-[10px] text-gray-400">Most active sources</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {sortedCountries.slice(0, 8).map(([country, count], idx) => (
                    <div
                      key={country}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-gray-900/50 hover:bg-red-500/10 transition-all duration-200 border border-transparent hover:border-red-500/30"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="text-base">{COUNTRY_FLAGS[country]}</span>
                        <span className="font-mono text-sm text-gray-300 font-bold">{country}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-bold text-sm">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Center - Main Radar Visualization */}
            <div className="col-span-6">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 rounded-3xl p-8 border border-cyan-500/20 backdrop-blur-xl shadow-2xl h-[800px]">
                <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="strongGlow">
                      <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="ultraGlow">
                      <feGaussianBlur stdDeviation="20" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <radialGradient id="radarGradient">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#0891b2" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="centerGlow">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
                      <stop offset="50%" stopColor="#0891b2" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <circle cx="600" cy="400" r="350" fill="url(#radarGradient)" opacity="0.8" />
                  <circle cx="600" cy="400" r="330" fill="url(#radarGradient)" opacity="0.6" />

                  {/* Low Risk Ring - Green */}
                  <circle
                    cx="600"
                    cy="400"
                    r="110"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="6"
                    opacity="0.8"
                    filter="url(#strongGlow)"
                  />
                  <circle
                    cx="600"
                    cy="400"
                    r="110"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                    opacity="0.6"
                    strokeDasharray="8,8"
                  >
                    <animate attributeName="stroke-dashoffset" values="0;16" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="600" cy="400" r="110" fill="none" stroke="#10b981" strokeWidth="12" opacity="0.2" />

                  {/* Medium Risk Ring - Orange */}
                  <circle
                    cx="600"
                    cy="400"
                    r="220"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="6"
                    opacity="0.8"
                    filter="url(#strongGlow)"
                  />
                  <circle
                    cx="600"
                    cy="400"
                    r="220"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2"
                    opacity="0.6"
                    strokeDasharray="8,8"
                  >
                    <animate attributeName="stroke-dashoffset" values="0;16" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="600" cy="400" r="220" fill="none" stroke="#f59e0b" strokeWidth="12" opacity="0.2" />

                  {/* High Risk Ring - Red */}
                  <circle
                    cx="600"
                    cy="400"
                    r="330"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="6"
                    opacity="0.9"
                    filter="url(#strongGlow)"
                  />
                  <circle
                    cx="600"
                    cy="400"
                    r="330"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2"
                    opacity="0.7"
                    strokeDasharray="8,8"
                  >
                    <animate attributeName="stroke-dashoffset" values="0;16" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="600" cy="400" r="330" fill="none" stroke="#ef4444" strokeWidth="12" opacity="0.3" />

                  <circle cx="600" cy="400" r="340" fill="none" stroke="#06b6d4" strokeWidth="3" opacity="0.6">
                    <animate attributeName="r" values="340;360;340" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
                  </circle>

                  {/* Risk labels with better styling */}
                  <text
                    x="600"
                    y="305"
                    textAnchor="middle"
                    fill="#10b981"
                    fontSize="16"
                    fontWeight="bold"
                    opacity="1"
                    filter="url(#strongGlow)"
                  >
                    LOW RISK
                  </text>
                  <text
                    x="600"
                    y="195"
                    textAnchor="middle"
                    fill="#f59e0b"
                    fontSize="16"
                    fontWeight="bold"
                    opacity="1"
                    filter="url(#strongGlow)"
                  >
                    MEDIUM RISK
                  </text>
                  <text
                    x="600"
                    y="85"
                    textAnchor="middle"
                    fill="#ef4444"
                    fontSize="16"
                    fontWeight="bold"
                    opacity="1"
                    filter="url(#strongGlow)"
                  >
                    HIGH RISK
                  </text>

                  <line
                    x1="600"
                    y1="400"
                    x2={600 + Math.cos((sweepAngle * Math.PI) / 180 - Math.PI / 2) * 340}
                    y2={400 + Math.sin((sweepAngle * Math.PI) / 180 - Math.PI / 2) * 340}
                    stroke="#06b6d4"
                    strokeWidth="4"
                    opacity="0.8"
                    filter="url(#ultraGlow)"
                  />

                  <circle cx="600" cy="400" r="40" fill="url(#centerGlow)" opacity="0.6">
                    <animate attributeName="r" values="40;60;40" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="600" cy="400" r="25" fill="url(#centerGlow)" opacity="0.8">
                    <animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite" begin="0.5s" />
                  </circle>
                  <circle cx="600" cy="400" r="18" fill="#06b6d4" opacity="1" filter="url(#ultraGlow)">
                    <animate attributeName="r" values="18;22;18" dur="2s" repeatCount="indefinite" begin="1s" />
                  </circle>
                  <circle cx="600" cy="400" r="12" fill="#ffffff" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.5;0.9" dur="1.5s" repeatCount="indefinite" />
                  </circle>

                  {/* Country markers with enhanced visuals */}
                  {Object.entries(COUNTRIES).map(([code, country]) => {
                    const pos = getRadarPosition(country.lat, country.lng, 320, 600, 400)
                    const threatCount = countryThreatCounts[code] || 0
                    const riskColor =
                      country.riskLevel === "high" ? "#ef4444" : country.riskLevel === "medium" ? "#f59e0b" : "#10b981"
                    const isActive = threatCount > 3

                    return (
                      <g key={code}>
                        {isActive && (
                          <>
                            <circle
                              cx={pos.x}
                              cy={pos.y}
                              r="30"
                              fill="none"
                              stroke={riskColor}
                              strokeWidth="2"
                              opacity="0.4"
                            >
                              <animate attributeName="r" values="30;50;30" dur="2s" repeatCount="indefinite" />
                              <animate attributeName="opacity" values="0.4;0;0.4" dur="2s" repeatCount="indefinite" />
                            </circle>
                            <circle
                              cx={pos.x}
                              cy={pos.y}
                              r="20"
                              fill="none"
                              stroke={riskColor}
                              strokeWidth="2"
                              opacity="0.6"
                            >
                              <animate
                                attributeName="r"
                                values="20;35;20"
                                dur="2s"
                                repeatCount="indefinite"
                                begin="0.5s"
                              />
                              <animate
                                attributeName="opacity"
                                values="0.6;0;0.6"
                                dur="2s"
                                repeatCount="indefinite"
                                begin="0.5s"
                              />
                            </circle>
                          </>
                        )}
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={isActive ? 7 : 4}
                          fill={riskColor}
                          opacity="1"
                          filter="url(#glow)"
                        >
                          <animate attributeName="opacity" values="0.8;1;0.8" dur="1.5s" repeatCount="indefinite" />
                        </circle>
                        {isActive && (
                          <>
                            <text
                              x={pos.x}
                              y={pos.y - 14}
                              textAnchor="middle"
                              fill={riskColor}
                              fontSize="11"
                              fontWeight="bold"
                              opacity="1"
                              filter="url(#glow)"
                            >
                              {code}
                            </text>
                            <text
                              x={pos.x}
                              y={pos.y + 22}
                              textAnchor="middle"
                              fill={riskColor}
                              fontSize="9"
                              fontWeight="bold"
                              opacity="0.8"
                            >
                              {threatCount}
                            </text>
                          </>
                        )}
                      </g>
                    )
                  })}

                  {/* Attack lines with enhanced visuals */}
                  {filteredAttacks.map((attack) => {
                    const originCountry = COUNTRIES[attack.attacker_country]
                    if (!originCountry) return null

                    const start = getRadarPosition(originCountry.lat, originCountry.lng, 320, 600, 400)
                    const end = { x: 600, y: 400 }
                    const currentX = start.x + (end.x - start.x) * attack.progress
                    const currentY = start.y + (end.y - start.y) * attack.progress
                    const color = getSeverityColor(attack.severity)

                    return (
                      <g key={attack.id}>
                        <line
                          x1={start.x}
                          y1={start.y}
                          x2={currentX}
                          y2={currentY}
                          stroke={color}
                          strokeWidth="2"
                          opacity="0.6"
                          filter="url(#glow)"
                        />
                        <circle cx={currentX} cy={currentY} r="4" fill={color} opacity="1" filter="url(#strongGlow)">
                          <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite" />
                        </circle>
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>

            {/* Right Side Panel - Attack Details */}
            <div className="col-span-3 space-y-6">
              {/* Attack Types */}
              <div className="bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-2xl p-5 border border-blue-500/20 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-blue-500/30">
                  <div className="p-2 rounded-lg bg-blue-500/20">
                    <Activity className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-blue-400 uppercase tracking-wider">Attack Vectors</h3>
                    <p className="text-[10px] text-gray-400">Common techniques</p>
                  </div>
                </div>
                <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-500/20 scrollbar-track-transparent">
                  {sortedAttackTypes.map(([type, count], idx) => (
                    <div
                      key={type}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-gray-900/50 hover:bg-blue-500/10 transition-all duration-200 border border-transparent hover:border-blue-500/30"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">
                          {idx + 1}
                        </span>
                        <span className="font-mono text-sm text-gray-300 font-medium truncate">{type}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm ml-2">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Live Threats */}
              <div className="bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-2xl p-5 border border-orange-500/20 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-orange-500/30">
                  <div className="p-2 rounded-lg bg-orange-500/20">
                    <AlertTriangle className="h-5 w-5 text-orange-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-orange-400 uppercase tracking-wider">Active Threats</h3>
                    <p className="text-[10px] text-gray-400">In progress now</p>
                  </div>
                </div>
                <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-orange-500/20 scrollbar-track-transparent">
                  {activeAttacks.slice(0, 10).map((attack) => (
                    <div
                      key={attack.id}
                      className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-gray-900/50 hover:bg-orange-500/10 transition-all duration-200 border border-transparent hover:border-orange-500/30"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-base">{COUNTRY_FLAGS[attack.attacker_country]}</span>
                          <span className="font-mono text-xs text-gray-300 font-medium truncate">
                            {attack.attacker_country}
                          </span>
                          <span className="text-gray-500 text-xs">→</span>
                          <span className="font-mono text-xs text-gray-400 truncate">{attack.target}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                          style={{
                            backgroundColor: getSeverityColor(attack.severity) + "30",
                            color: getSeverityColor(attack.severity),
                            border: `1px solid ${getSeverityColor(attack.severity)}40`,
                          }}
                        >
                          {attack.attack_type}
                        </span>
                        <span className="text-[10px] text-cyan-400 font-mono">{getRelativeTime(attack.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* MITRE ATT&CK Map */}
          {showMitreMap && (
            <div className="bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-2xl p-6 border border-purple-500/20 backdrop-blur-xl shadow-2xl">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-purple-500/30">
                <div className="p-2 rounded-lg bg-purple-500/20">
                  <Shield className="h-5 w-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider">
                    MITRE ATT&CK Tactic Distribution
                  </h3>
                  <p className="text-[10px] text-gray-400">Real-time adversary behavior mapping</p>
                </div>
              </div>
              <div className="grid grid-cols-6 gap-4">
                {Object.entries(mitreTactics)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 6)
                  .map(([tactic, count]) => (
                    <div
                      key={tactic}
                      className="flex flex-col items-center justify-center p-4 rounded-xl bg-gray-900/50 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-200"
                    >
                      <span className="text-3xl font-black text-purple-400">{count}</span>
                      <span className="text-xs text-gray-400 uppercase tracking-wider mt-2">{tactic}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Bottom Data Table - Compact */}
          <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl p-6 border border-cyan-500/20 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-4 pb-3 border-b border-cyan-500/30">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Globe className="h-5 w-5 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">Global Threat Map</h3>
                <p className="text-[10px] text-gray-400">All monitored countries and regions</p>
              </div>
              <div className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-xs font-bold">
                {Object.keys(COUNTRIES).length} Countries
              </div>
            </div>
            <div className="max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent">
              <table className="w-full">
                <thead className="sticky top-0 bg-gray-950/95 backdrop-blur-sm z-10">
                  <tr className="border-b border-cyan-500/20">
                    <th className="text-left py-2 px-3 text-xs font-bold text-cyan-400 uppercase tracking-wider">#</th>
                    <th className="text-left py-2 px-3 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Country
                    </th>
                    <th className="text-left py-2 px-3 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Risk Level
                    </th>
                    <th className="text-right py-2 px-3 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Threats
                    </th>
                    <th className="text-right py-2 px-3 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Coordinates
                    </th>
                    <th className="text-center py-2 px-3 text-xs font-bold text-cyan-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(COUNTRIES)
                    .sort(([, a], [, b]) => {
                      const countA = countryThreatCounts[a.name] || 0
                      const countB = countryThreatCounts[b.name] || 0
                      return countB - countA
                    })
                    .map(([code, country], idx) => {
                      const threatCount = countryThreatCounts[code] || 0
                      const riskColor =
                        country.riskLevel === "high"
                          ? "text-red-400 bg-red-500/20 border-red-500/30"
                          : country.riskLevel === "medium"
                            ? "text-yellow-400 bg-yellow-500/20 border-yellow-500/30"
                            : "text-green-400 bg-green-500/20 border-green-500/30"
                      const isActive = threatCount > 0

                      return (
                        <tr
                          key={code}
                          className={`border-b border-gray-800/50 hover:bg-cyan-500/5 transition-all duration-200 ${isActive ? "bg-cyan-500/5" : ""}`}
                        >
                          <td className="py-2.5 px-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-800 text-gray-400 text-xs font-bold">
                              {idx + 1}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{COUNTRY_FLAGS[code]}</span>
                              <span className="font-mono text-sm text-gray-300 font-bold">{code}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-400">{country.name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${riskColor}`}
                            >
                              {country.riskLevel}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            {threatCount > 0 ? (
                              <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 font-bold text-sm border border-red-500/30">
                                {threatCount}
                              </span>
                            ) : (
                              <span className="text-gray-600 text-sm">0</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="font-mono text-xs text-gray-500">
                              {country.lat.toFixed(2)}°, {country.lng.toFixed(2)}°
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {isActive ? (
                              <div className="flex items-center justify-center gap-1.5">
                                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
                                <span className="text-xs text-red-400 font-bold">ACTIVE</span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-600">Monitoring</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function generateFallbackAttacks(count: number): Attack[] {
  const attackTypes = [
    { name: "Ransomware C2", ttp: "T1486", severity: "critical", cvss: 9.8 },
    { name: "Brute Force SSH", ttp: "T1110", severity: "high", cvss: 7.5 },
    { name: "Phishing Campaign", ttp: "T1566", severity: "medium", cvss: 6.5 },
    { name: "SQL Injection", ttp: "T1190", severity: "critical", cvss: 9.1 },
    { name: "DDoS Attack", ttp: "T1498", severity: "high", cvss: 7.8 },
    { name: "Data Exfiltration", ttp: "T1041", severity: "critical", cvss: 9.3 },
    { name: "Zero-Day Exploit", ttp: "T1203", severity: "critical", cvss: 9.9 },
  ]

  const countries = Object.keys(COUNTRIES)
  const targets = ["Financial Sector", "Government Portal", "Healthcare Org", "E-commerce Site", "Cloud Infrastructure"]

  return Array.from({ length: count }, (_, i) => {
    const attack = attackTypes[Math.floor(Math.random() * attackTypes.length)]
    const country = countries[Math.floor(Math.random() * countries.length)]

    return {
      id: `fallback-${i}-${Date.now()}`,
      attacker_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      attacker_country: country,
      target: targets[Math.floor(Math.random() * targets.length)],
      target_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      ttp: attack.ttp,
      attack_type: attack.name,
      severity: attack.severity as "critical" | "high" | "medium" | "low",
      status: (Math.random() > 0.7 ? "blocked" : Math.random() > 0.5 ? "active" : "recon") as
        | "active"
        | "blocked"
        | "recon",
      timestamp: new Date(Date.now() - Math.random() * 30000).toISOString(),
      volume: Math.floor(Math.random() * 2000) + 100,
      progress: Math.random() * 0.2,
      cvss: attack.cvss,
    }
  })
}
