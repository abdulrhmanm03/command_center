"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Shield, Ban, SearchIcon } from "lucide-react"

interface SIEMEvent {
  id: string
  time: string
  source_country: string
  source_ip: string
  target_ip: string
  attack_type: string
  ttp: string
  severity: "Critical" | "High" | "Medium" | "Low"
  status: "Active" | "Failed" | "Blocked"
  volume: number
  lat: number
  lng: number
  explanation: string
  cvss: number
}

export function SIEMLiveTable() {
  const [events, setEvents] = useState<SIEMEvent[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCountry, setFilterCountry] = useState("all")
  const [eventsPerMin, setEventsPerMin] = useState(0)
  const [newEventIds, setNewEventIds] = useState<Set<string>>(new Set())
  const tableRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function loadInitialData() {
      try {
        const response = await fetch("/api/siem/initial")
        const data: SIEMEvent[] = await response.json()
        console.log("[v0] Loaded", data.length, "initial SIEM events")
        setEvents(data)
      } catch (error) {
        console.error("[v0] Failed to load initial data:", error)
      }
    }

    loadInitialData()
  }, [])

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch("/api/siem/live-feed")
        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (reader) {
          const { value } = await reader.read()
          if (value) {
            const text = decoder.decode(value)
            const lines = text.split("\n\n")

            lines.forEach((line) => {
              if (line.startsWith("data: ")) {
                const data: SIEMEvent = JSON.parse(line.substring(6))
                console.log("[v0] SIEM event:", data.attack_type, "from", data.source_country)
                setNewEventIds((prev) => new Set(prev).add(data.id))
                setEvents((prev) => [data, ...prev.slice(0, 49)])

                setTimeout(() => {
                  setNewEventIds((prev) => {
                    const next = new Set(prev)
                    next.delete(data.id)
                    return next
                  })
                }, 2000)
              }
            })
          }
          reader.releaseLock()
        }
      } catch (error) {
        console.error("[v0] Polling error:", error)
      }
    }, 3500)

    return () => clearInterval(pollInterval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const oneMinuteAgo = Date.now() - 60000
      const recentEvents = events.filter((e) => {
        const eventTime = new Date()
        const [time, period] = e.time.split(" ")
        const [hours, minutes] = time.split(":").map(Number)
        eventTime.setHours(period === "PM" ? hours + 12 : hours, minutes)
        return eventTime.getTime() > oneMinuteAgo
      })
      setEventsPerMin(recentEvents.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [events])

  const filteredEvents = events.filter((event) => {
    if (filterCountry !== "all" && event.source_country !== filterCountry) return false
    if (searchQuery && !JSON.stringify(event).toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const activeCount = filteredEvents.filter((e) => e.status === "Active").length

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "High":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50"
      case "Medium":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "Low":
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "Blocked":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "Failed":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
    }
  }

  return (
    <div className="space-y-4">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-bold text-cyan-400">Live SIEM Threat Feed</h3>
          <div className="relative flex items-center gap-2 rounded-lg bg-gradient-to-r from-green-500/20 to-cyan-500/20 px-4 py-2 backdrop-blur">
            <div className="relative">
              <div className="absolute h-3 w-3 animate-ping rounded-full bg-green-500 opacity-75" />
              <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />
            </div>
            <span className="text-sm font-bold text-green-400">
              LIVE | {activeCount} Active | {eventsPerMin} events/min
            </span>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-400" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 border-cyan-500/30 bg-gray-900/80 pl-10 text-white placeholder:text-gray-500 focus:border-cyan-500/50"
            />
          </div>
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="rounded-md border border-cyan-500/30 bg-gray-900/80 px-3 py-2 text-sm text-white focus:border-cyan-500/50"
          >
            <option value="all">All Countries</option>
            <option value="UAE">UAE</option>
            <option value="Russia">Russia</option>
            <option value="China">China</option>
            <option value="USA">USA</option>
            <option value="North Korea">North Korea</option>
            <option value="Iran">Iran</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-cyan-500/30 bg-gradient-to-br from-gray-900/90 to-gray-950/90 shadow-2xl shadow-cyan-500/10 backdrop-blur">
        <div ref={tableRef} className="max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-gray-900 via-cyan-950/50 to-gray-900 backdrop-blur">
              <tr className="border-b border-cyan-500/50">
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">Time</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">Source</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Source IP
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Target IP
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Attack Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">
                  MITRE TTP
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Severity
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">Volume</th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent" />
                      <span className="text-cyan-400">Waiting for live data stream...</span>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEvents.map((event, index) => (
                  <tr
                    key={event.id}
                    className={`
                      border-b border-gray-800/50 transition-all duration-500
                      ${
                        newEventIds.has(event.id)
                          ? "animate-in slide-in-from-top-4 bg-cyan-500/20 shadow-lg shadow-cyan-500/20"
                          : "hover:bg-cyan-500/5"
                      }
                    `}
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-200">{event.time}</td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-cyan-300">{event.source_country}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-cyan-400">{event.source_ip}</td>
                    <td className="px-4 py-3 font-mono text-xs text-orange-400">{event.target_ip}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-200">{event.attack_type}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className="border-purple-500/50 bg-purple-500/20 text-purple-300 font-semibold"
                      >
                        {event.ttp}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`${getSeverityColor(event.severity)} font-bold`}>
                        {event.severity}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`${getStatusColor(event.status)} font-bold`}>
                        {event.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-200">{event.volume}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-red-400 hover:bg-red-500/30 hover:text-red-300 transition-all"
                        >
                          <Ban className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-cyan-400 hover:bg-cyan-500/30 hover:text-cyan-300 transition-all"
                        >
                          <Shield className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Streaming Indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-500" />
        <span>Live stream active • Data refreshing every 3.5s</span>
      </div>
    </div>
  )
}
