"use client"

import type React from "react"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
  ChevronDown,
  AlertTriangle,
  ChevronRight,
  X,
  CheckCircle2,
  Clock,
  User,
  Shield,
  Brain,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function IncidentsPage() {
  const router = useRouter()
  const [incidents, setIncidents] = useState<any[]>([])
  const [filteredIncidents, setFilteredIncidents] = useState<any[]>([])
  const [distributions, setDistributions] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [selectedIncidents, setSelectedIncidents] = useState<Set<string>>(new Set())
  const [detailsPanel, setDetailsPanel] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20
  const [triageMode, setTriageMode] = useState(false)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)
  const [quickNoteId, setQuickNoteId] = useState<string | null>(null)
  const [quickNote, setQuickNote] = useState("")

  const [selectedForTriage, setSelectedForTriage] = useState<any | null>(null)
  const [triageQueue, setTriageQueue] = useState<any[]>([])
  const [triageProgress, setTriageProgress] = useState({ completed: 0, total: 0 })
  const [autoAdvance, setAutoAdvance] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)

  const [reassignDialog, setReassignDialog] = useState<{
    incidentId: string
    currentOwner: string
  } | null>(null)

  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    incidentId: string
    currentOwner: string
  } | null>(null)

  const [filters, setFilters] = useState({
    urgency: "all",
    status: "all",
    owner: "all",
    domain: "all",
    searchType: "correlation",
    timeRange: "last_24hrs",
  })

  const handleOwnerContextMenu = (e: React.MouseEvent, incidentId: string, currentOwner: string) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      incidentId,
      currentOwner,
    })
  }

  const handleCloseContextMenu = () => {
    setContextMenu(null)
  }

  useEffect(() => {
    const handleClick = () => setContextMenu(null)
    if (contextMenu) {
      document.addEventListener("click", handleClick)
      return () => document.removeEventListener("click", handleClick)
    }
  }, [contextMenu])

  const fetchIncidents = async () => {
    try {
      const res = await fetch("/api/incidents")
      const data = await res.json()
      setIncidents(data.incidents || [])
      setDistributions(data.distributions || null)
      setLoading(false)
    } catch (error) {
      console.error("[v0] Failed to fetch incidents:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncidents()
  }, [])

  const applyFilters = () => {
    let filtered = [...incidents]

    if (filters.urgency !== "all") {
      filtered = filtered.filter((i) => i.urgency === filters.urgency)
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((i) => i.status === filters.status)
    }

    if (filters.owner !== "all") {
      filtered = filtered.filter((i) => i.owner?.toLowerCase().includes(filters.owner.toLowerCase()))
    }

    if (filters.domain !== "all") {
      filtered = filtered.filter((i) => i.securityDomain === filters.domain)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (i) =>
          i.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.riskObjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.owner?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (sortConfig) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key]
        const bVal = b[sortConfig.key]
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }

    setFilteredIncidents(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [incidents, filters, searchQuery, sortConfig])

  const handleQuickTriageAction = async (action: string) => {
    if (!selectedForTriage) return

    console.log(`[v0] Quick triage action: ${action} on ${selectedForTriage.id}`)

    switch (action) {
      case "critical":
        await handleQuickSeverityChange(selectedForTriage.id, "critical")
        await handleQuickStatusChange(selectedForTriage.id, "in_progress")
        break
      case "escalate":
        await handleQuickStatusChange(selectedForTriage.id, "pending")
        break
      case "resolve":
        await handleQuickStatusChange(selectedForTriage.id, "resolved")
        break
      case "assign_me":
        await handleQuickAssign(selectedForTriage.id, "carl")
        break
    }

    setTriageProgress((prev) => ({ ...prev, completed: prev.completed + 1 }))

    if (autoAdvance) {
      handleNextIncident()
    }
  }

  const handleNextIncident = () => {
    const currentIndex = triageQueue.findIndex((i) => i.id === selectedForTriage?.id)
    if (currentIndex < triageQueue.length - 1) {
      setSelectedForTriage(triageQueue[currentIndex + 1])
    }
  }

  const handlePreviousIncident = () => {
    const currentIndex = triageQueue.findIndex((i) => i.id === selectedForTriage?.id)
    if (currentIndex > 0) {
      setSelectedForTriage(triageQueue[currentIndex - 1])
    }
  }

  const handleSort = (key: string) => {
    setSortConfig((current) => ({
      key,
      direction: current?.key === key && current.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIncidents(new Set(paginatedIncidents.map((i) => i.id)))
    } else {
      setSelectedIncidents(new Set())
    }
  }

  const handleSelectIncident = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIncidents)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIncidents(newSelected)
  }

  const handleQuickAction = async (incidentId: string, action: string) => {
    console.log(`[v0] Quick action: ${action} on incident ${incidentId}`)
    await fetchIncidents()
  }

  const handleQuickStatusChange = async (incidentId: string, newStatus: string) => {
    console.log(`[v0] Changing status of ${incidentId} to ${newStatus}`)
    setIncidents((prev) => prev.map((inc) => (inc.id === incidentId ? { ...inc, status: newStatus } : inc)))
    await fetchIncidents()
  }

  const handleQuickSeverityChange = async (incidentId: string, newSeverity: string) => {
    console.log(`[v0] Changing severity of ${incidentId} to ${newSeverity}`)
    setIncidents((prev) => prev.map((inc) => (inc.id === incidentId ? { ...inc, urgency: newSeverity } : inc)))
    await fetchIncidents()
  }

  const handleQuickAssign = async (incidentId: string, owner: string) => {
    console.log(`[v0] Assigning ${incidentId} to ${owner}`)
    setIncidents((prev) => prev.map((inc) => (inc.id === incidentId ? { ...inc, owner, status: "in_progress" } : inc)))
    await fetchIncidents()
  }

  const handleAddQuickNote = async (incidentId: string) => {
    if (!quickNote.trim()) return
    console.log(`[v0] Adding note to ${incidentId}: ${quickNote}`)
    setQuickNoteId(null)
    setQuickNote("")
  }

  const handleBulkAction = async (action: string) => {
    console.log(`[v0] Bulk action: ${action} on ${selectedIncidents.size} incidents`)
    await fetchIncidents()
    setSelectedIncidents(new Set())
  }

  const getIncidentAge = (time: string) => {
    const now = new Date()
    const incidentTime = new Date(time)
    const diffMs = now.getTime() - incidentTime.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d`
    if (diffHours > 0) return `${diffHours}h`
    return `${diffMins}m`
  }

  const getSLAStatus = (time: string, urgency: string) => {
    const age = new Date().getTime() - new Date(time).getTime()
    const ageHours = age / (1000 * 60 * 60)

    const slaThresholds = {
      critical: 1,
      high: 4,
      medium: 24,
      low: 72,
      info: 168,
    }

    const threshold = slaThresholds[urgency as keyof typeof slaThresholds] || 24
    const remaining = threshold - ageHours

    if (remaining < 0) return { status: "breached", color: "text-red-500", text: "SLA Breached" }
    if (remaining < threshold * 0.25)
      return { status: "critical", color: "text-orange-500", text: `${Math.floor(remaining)}h left` }
    return { status: "ok", color: "text-green-500", text: `${Math.floor(remaining)}h left` }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500"
      case "high":
        return "text-orange-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-blue-500"
      default:
        return "text-gray-500"
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
      case "unassigned":
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          className: "bg-blue-500/20 text-blue-400 border-blue-500/30",
          label: "New",
        }
      case "in_progress":
        return {
          icon: <Clock className="h-3 w-3" />,
          className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
          label: "In Progress",
        }
      case "pending":
        return {
          icon: <Clock className="h-3 w-3" />,
          className: "bg-orange-500/20 text-orange-400 border-orange-500/30",
          label: "Pending",
        }
      case "resolved":
        return {
          icon: <CheckCircle2 className="h-3 w-3" />,
          className: "bg-green-500/20 text-green-400 border-green-500/30",
          label: "Resolved",
        }
      case "closed":
        return {
          icon: <CheckCircle2 className="h-3 w-3" />,
          className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          label: "Closed",
        }
      default:
        return {
          icon: <AlertCircle className="h-3 w-3" />,
          className: "bg-gray-500/20 text-gray-400 border-gray-500/30",
          label: status,
        }
    }
  }

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage)
  const paginatedIncidents = filteredIncidents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const urgencyData =
    distributions && distributions.urgency
      ? Object.entries(distributions.urgency).map(([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: value as number,
          color:
            key === "critical"
              ? "#ef4444"
              : key === "high"
                ? "#f97316"
                : key === "medium"
                  ? "#eab308"
                  : key === "low"
                    ? "#3b82f6"
                    : "#6b7280",
        }))
      : []

  const typeData =
    distributions && distributions.type
      ? [
          { name: "Risk Based Alert", value: distributions.type.risk_notable || 0, color: "#06b6d4" },
          { name: "Notable", value: distributions.type.notable || 0, color: "#8b5cf6" },
        ]
      : []

  const statusData =
    distributions && distributions.status
      ? [
          { name: "Unassigned", value: distributions.status.unassigned || 0, color: "#6b7280" },
          { name: "New", value: distributions.status.new || 0, color: "#3b82f6" },
          { name: "In Progress", value: distributions.status.in_progress || 0, color: "#eab308" },
          { name: "Pending", value: distributions.status.pending || 0, color: "#f97316" },
          { name: "Resolved", value: distributions.status.resolved || 0, color: "#10b981" },
          { name: "Closed", value: distributions.status.closed || 0, color: "#6b7280" },
        ]
      : []

  const ownerData =
    distributions && distributions.owner
      ? Object.entries(distributions.owner).map(([key, value]) => ({
          name: key,
          value: value as number,
          color:
            key === "Carl"
              ? "#06b6d4"
              : key === "Vishal"
                ? "#8b5cf6"
                : key === "Terry"
                  ? "#3b82f6"
                  : key === "Jamie"
                    ? "#f97316"
                    : "#ec4899",
        }))
      : []

  const domainData =
    distributions && distributions.domain
      ? Object.entries(distributions.domain).map(([key, value]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: value as number,
          color:
            key === "access"
              ? "#8b5cf6"
              : key === "endpoint"
                ? "#3b82f6"
                : key === "network"
                  ? "#06b6d4"
                  : key === "threat"
                    ? "#ef4444"
                    : key === "identity"
                      ? "#10b981"
                      : key === "audit"
                        ? "#f97316"
                        : "#6b7280",
        }))
      : []

  // Calculate totals for center labels
  const urgencyTotal = urgencyData.reduce((sum, item) => sum + item.value, 0)
  const typeTotal = typeData.reduce((sum, item) => sum + item.value, 0)
  const statusTotal = statusData.reduce((sum, item) => sum + item.value, 0)
  const ownerTotal = ownerData.reduce((sum, item) => sum + item.value, 0)
  const domainTotal = domainData.reduce((sum, item) => sum + item.value, 0)

  const getFullOwnerName = (owner: string) => {
    const ownerMap: { [key: string]: string } = {
      Carl: "Carl Johnson",
      Vishal: "Vishal Patel",
      Terry: "Terry Chen",
      Jamie: "Jamie Smith",
      Lin: "Lin Wang",
      Unassigned: "Unassigned",
    }
    return ownerMap[owner] || owner
  }

  const handleReassignClick = (e: React.MouseEvent, incidentId: string, currentOwner: string) => {
    e.stopPropagation()
    setReassignDialog({ incidentId, currentOwner })
  }

  const handleReassign = async (incidentId: string, newOwner: string) => {
    await handleQuickAssign(incidentId, newOwner)
    setReassignDialog(null)
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Dashboard Overview */}
          <div className="mb-6">
            <div className="grid grid-cols-5 gap-4">
              {/* Urgency */}
              <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-lg border border-border/30 p-4 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  Urgency
                </h3>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie
                          data={urgencyData.filter((d) => d.value > 0)}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          stroke="#000"
                          strokeWidth={2}
                          paddingAngle={2}
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {urgencyData
                            .filter((d) => d.value > 0)
                            .map((entry, index) => (
                              <Cell key={`urgency-cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-white">{urgencyTotal}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    {urgencyData
                      .filter((d) => d.value > 0)
                      .map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: item.color }} />
                          <span className="text-xs text-gray-300 flex-1">{item.name}</span>
                          <span className="text-xs font-semibold text-white bg-white/5 px-2 py-0.5 rounded">
                            {item.value}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Type */}
              <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-lg border border-border/30 p-4 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                  Type
                </h3>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie
                          data={typeData.filter((d) => d.value > 0)}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          stroke="#000"
                          strokeWidth={2}
                          paddingAngle={2}
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {typeData
                            .filter((d) => d.value > 0)
                            .map((entry, index) => (
                              <Cell key={`type-cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-white">{typeTotal}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    {typeData
                      .filter((d) => d.value > 0)
                      .map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: item.color }} />
                          <span className="text-xs text-gray-300 flex-1">{item.name}</span>
                          <span className="text-xs font-semibold text-white bg-white/5 px-2 py-0.5 rounded">
                            {item.value}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-lg border border-border/30 p-4 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  Status
                </h3>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie
                          data={statusData.filter((d) => d.value > 0)}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          stroke="#000"
                          strokeWidth={2}
                          paddingAngle={2}
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {statusData
                            .filter((d) => d.value > 0)
                            .map((entry, index) => (
                              <Cell key={`status-cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-white">{statusTotal}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    {statusData
                      .filter((d) => d.value > 0)
                      .map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: item.color }} />
                          <span className="text-xs text-gray-300 flex-1">{item.name}</span>
                          <span className="text-xs font-semibold text-white bg-white/5 px-2 py-0.5 rounded">
                            {item.value}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Owner */}
              <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-lg border border-border/30 p-4 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                  Owner
                </h3>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie
                          data={ownerData.filter((d) => d.value > 0)}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          stroke="#000"
                          strokeWidth={2}
                          paddingAngle={2}
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {ownerData
                            .filter((d) => d.value > 0)
                            .map((entry, index) => (
                              <Cell key={`owner-cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-white">{ownerTotal}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    {ownerData
                      .filter((d) => d.value > 0)
                      .map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: item.color }} />
                          <span className="text-xs text-gray-300 flex-1">{item.name}</span>
                          <span className="text-xs font-semibold text-white bg-white/5 px-2 py-0.5 rounded">
                            {item.value}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Security Domain */}
              <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-lg border border-border/30 p-4 hover:border-cyan-500/30 transition-all duration-300">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Security Domain
                </h3>
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie
                          data={domainData.filter((d) => d.value > 0)}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={65}
                          stroke="#000"
                          strokeWidth={2}
                          paddingAngle={2}
                          animationBegin={0}
                          animationDuration={800}
                        >
                          {domainData
                            .filter((d) => d.value > 0)
                            .map((entry, index) => (
                              <Cell key={`domain-cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-2xl font-bold text-white">{domainTotal}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    {domainData
                      .filter((d) => d.value > 0)
                      .map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shadow-lg" style={{ backgroundColor: item.color }} />
                          <span className="text-xs text-gray-300 flex-1">{item.name}</span>
                          <span className="text-xs font-semibold text-white bg-white/5 px-2 py-0.5 rounded">
                            {item.value}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-4 mb-6">
            <div className="grid grid-cols-8 gap-3">
              <Select value={filters.urgency} onValueChange={(v) => setFilters({ ...filters, urgency: v })}>
                <SelectTrigger className="bg-[#1a1a1a] border-border/50">
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(v) => setFilters({ ...filters, status: v })}>
                <SelectTrigger className="bg-[#1a1a1a] border-border/50">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.owner} onValueChange={(v) => setFilters({ ...filters, owner: v })}>
                <SelectTrigger className="bg-[#1a1a1a] border-border/50">
                  <SelectValue placeholder="Owner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="carl">Carl</SelectItem>
                  <SelectItem value="vishal">Vishal</SelectItem>
                  <SelectItem value="terry">Terry</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.domain} onValueChange={(v) => setFilters({ ...filters, domain: v })}>
                <SelectTrigger className="bg-[#1a1a1a] border-border/50">
                  <SelectValue placeholder="Domain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="endpoint">Endpoint</SelectItem>
                  <SelectItem value="network">Network</SelectItem>
                  <SelectItem value="access">Access</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.searchType} onValueChange={(v) => setFilters({ ...filters, searchType: v })}>
                <SelectTrigger className="bg-[#1a1a1a] border-border/50">
                  <SelectValue placeholder="Search Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="correlation">Correlation Search</SelectItem>
                  <SelectItem value="detection">Detection</SelectItem>
                </SelectContent>
              </Select>

              <Input placeholder="Select..." className="bg-[#1a1a1a] border-border/50" />

              <Select value={filters.timeRange} onValueChange={(v) => setFilters({ ...filters, timeRange: v })}>
                <SelectTrigger className="bg-[#1a1a1a] border-border/50">
                  <SelectValue placeholder="Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last_24hrs">Last 24hrs</SelectItem>
                  <SelectItem value="last_7days">Last 7 days</SelectItem>
                  <SelectItem value="last_30days">Last 30 days</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={applyFilters} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                Apply Filters
              </Button>
            </div>
            {(filters.urgency !== "all" || filters.status !== "all" || searchQuery) && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/30">
                <span className="text-xs text-gray-400">Active filters:</span>
                {filters.urgency !== "all" && (
                  <Badge variant="outline" className="text-xs">
                    Urgency: {filters.urgency}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => setFilters({ ...filters, urgency: "all" })}
                    />
                  </Badge>
                )}
                {filters.status !== "all" && (
                  <Badge variant="outline" className="text-xs">
                    Status: {filters.status}
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() => setFilters({ ...filters, status: "all" })}
                    />
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="outline" className="text-xs">
                    Search: {searchQuery}
                    <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                  </Badge>
                )}
              </div>
            )}
          </div>

          {/* Incidents Table */}
          <div className="bg-[#0f0f0f] rounded-lg border border-border/30">
            <div className="p-4 border-b border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-white">
                  {filteredIncidents.length} Notables
                  {selectedIncidents.size > 0 && ` (${selectedIncidents.size} selected)`}
                </span>
                {selectedIncidents.size > 0 && (
                  <>
                    <Select
                      onValueChange={(owner) => {
                        selectedIncidents.forEach((id) => handleQuickAssign(id, owner))
                      }}
                    >
                      <SelectTrigger className="w-32 h-8 text-xs bg-[#1a1a1a]">
                        <User className="h-3 w-3 mr-1" />
                        <SelectValue placeholder="Assign" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="carl">Carl</SelectItem>
                        <SelectItem value="vishal">Vishal</SelectItem>
                        <SelectItem value="terry">Terry</SelectItem>
                        <SelectItem value="jamie">Jamie</SelectItem>
                        <SelectItem value="lin">Lin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      onValueChange={(status) => {
                        selectedIncidents.forEach((id) => handleQuickStatusChange(id, status))
                      }}
                    >
                      <SelectTrigger className="w-36 h-8 text-xs bg-[#1a1a1a]">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        <SelectValue placeholder="Change Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent"
                      onClick={() => handleBulkAction("escalate")}
                    >
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Escalate
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs bg-transparent text-red-400 hover:text-red-300"
                      onClick={() => setSelectedIncidents(new Set())}
                    >
                      <X className="h-3 w-3 mr-1" />
                      Clear
                    </Button>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full table-fixed">
                <thead className="border-b border-border/30 bg-[#1a1a1a]">
                  <tr className="text-left">
                    <th className="w-12 p-3 text-xs font-medium text-gray-400">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600"
                        checked={selectedIncidents.size === paginatedIncidents.length && paginatedIncidents.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th className="w-24 p-3 text-xs font-medium text-gray-400">Age / SLA</th>
                    <th
                      className="w-40 p-3 text-xs font-medium text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("riskObjectName")}
                    >
                      Risk Object <ChevronDown className="inline h-3 w-3" />
                    </th>
                    <th
                      className="w-64 p-3 text-xs font-medium text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("title")}
                    >
                      Title <ChevronDown className="inline h-3 w-3" />
                    </th>
                    <th
                      className="w-24 p-3 text-xs font-medium text-gray-400 cursor-pointer hover:text-white text-center"
                      onClick={() => handleSort("aggregatedRiskScore")}
                    >
                      Risk Score <ChevronDown className="inline h-3 w-3" />
                    </th>
                    <th className="w-24 p-3 text-xs font-medium text-gray-400 text-center">Risk Events</th>
                    <th className="w-32 p-3 text-xs font-medium text-gray-400">Time</th>
                    <th className="w-28 p-3 text-xs font-medium text-gray-400">Domain</th>
                    <th
                      className="w-28 p-3 text-xs font-medium text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("urgency")}
                    >
                      Urgency <ChevronDown className="inline h-3 w-3" />
                    </th>
                    <th className="w-40 p-3 text-xs font-medium text-gray-400">Owner</th>
                    <th className="w-32 p-3 text-xs font-medium text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {paginatedIncidents.map((incident, idx) => {
                    const sla = getSLAStatus(incident.time, incident.urgency)
                    const age = getIncidentAge(incident.time)

                    return (
                      <>
                        <tr
                          key={incident.id}
                          className={cn(
                            "hover:bg-[#1a1a1a] transition-all cursor-pointer group",
                            expandedRow === incident.id && "bg-[#1a1a1a]",
                          )}
                          onClick={() => {
                            window.location.href = `/incidents/${incident.id}`
                          }}
                        >
                          <td className="w-12 p-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="rounded border-gray-600"
                              checked={selectedIncidents.has(incident.id)}
                              onChange={(e) => handleSelectIncident(incident.id, e.target.checked)}
                            />
                          </td>
                          <td className="w-24 p-3">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-gray-400">{age}</span>
                              <span className={cn("text-xs font-medium", sla.color)}>{sla.text}</span>
                            </div>
                          </td>
                          <td className="w-40 p-3">
                            <div className="flex items-center gap-2">
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 text-gray-400 transition-transform flex-shrink-0",
                                  expandedRow === incident.id && "rotate-90",
                                )}
                              />
                              <span className="text-sm text-gray-300 truncate">{incident.riskObjectName}</span>
                            </div>
                          </td>
                          <td className="w-64 p-3">
                            <span className="text-sm text-gray-300 line-clamp-2">{incident.title}</span>
                          </td>
                          <td className="w-24 p-3 text-center">
                            {incident.aggregatedRiskScore ? (
                              <div className="flex items-center justify-center gap-2">
                                <div
                                  className={cn(
                                    "w-2 h-2 rounded-full animate-pulse",
                                    incident.aggregatedRiskScore > 200
                                      ? "bg-red-500"
                                      : incident.aggregatedRiskScore > 150
                                        ? "bg-orange-500"
                                        : "bg-yellow-500",
                                  )}
                                />
                                <span className="text-sm text-white font-medium">{incident.aggregatedRiskScore}</span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-500">--</span>
                            )}
                          </td>
                          <td className="w-24 p-3 text-center">
                            {incident.riskEvents ? (
                              <Button variant="link" className="text-cyan-400 p-0 h-auto text-sm">
                                {incident.riskEvents}
                              </Button>
                            ) : (
                              <span className="text-sm text-gray-500">--</span>
                            )}
                          </td>
                          <td className="w-32 p-3">
                            <span className="text-sm text-gray-300">
                              {new Date(incident.time).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </td>
                          <td className="w-28 p-3">
                            <Badge variant="outline" className="text-xs capitalize">
                              {incident.securityDomain}
                            </Badge>
                          </td>
                          <td className="w-28 p-3">
                            <div className="flex items-center gap-2">
                              <AlertTriangle
                                className={cn("h-4 w-4 flex-shrink-0", getSeverityColor(incident.urgency))}
                              />
                              <span
                                className={cn("text-sm font-medium capitalize", getSeverityColor(incident.urgency))}
                              >
                                {incident.urgency}
                              </span>
                            </div>
                          </td>
                          <td className="w-40 p-3" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              <span className="text-sm text-gray-300 truncate">
                                {getFullOwnerName(incident.owner) || "Unassigned"}
                              </span>
                            </div>
                          </td>
                          <td className="w-32 p-3" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                onClick={() => setDetailsPanel(incident)}
                              >
                                Details
                              </Button>
                            </div>
                          </td>
                        </tr>

                        {quickNoteId === incident.id && (
                          <tr className="bg-[#151515]">
                            <td colSpan={12} className="p-4">
                              <div className="flex items-center gap-3">
                                <Input
                                  placeholder="Add a quick note..."
                                  value={quickNote}
                                  onChange={(e) => setQuickNote(e.target.value)}
                                  className="flex-1 bg-[#1a1a1a] border-border/50"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleAddQuickNote(incident.id)
                                    if (e.key === "Escape") setQuickNoteId(null)
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => handleAddQuickNote(incident.id)}
                                  className="bg-cyan-600 hover:bg-cyan-700"
                                >
                                  Save Note
                                </Button>
                                <Button size="sm" variant="ghost" onClick={() => setQuickNoteId(null)}>
                                  Cancel
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )}
                        {expandedRow === incident.id && (
                          <tr className="bg-[#151515]">
                            <td colSpan={12} className="p-6">
                              <div className="grid grid-cols-3 gap-6">
                                <div>
                                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-cyan-400" />
                                    MITRE ATT&CK Mapping
                                  </h4>
                                  <div className="space-y-2">
                                    <Badge variant="outline" className="text-xs">
                                      T1566 - Phishing
                                    </Badge>
                                    <Badge variant="outline" className="text-xs ml-2">
                                      T1059 - Command Execution
                                    </Badge>
                                    <Badge variant="outline" className="text-xs ml-2">
                                      T1071 - Application Layer Protocol
                                    </Badge>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-cyan-400" />
                                    Timeline
                                  </h4>
                                  <div className="space-y-2 text-xs text-gray-400">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-green-500" />
                                      <span>Detected: {new Date(incident.time).toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                      <span>Assigned: 2 mins ago</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                                      <span>In Progress: 5 mins ago</span>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-white mb-3">Evidence</h4>
                                  <div className="space-y-2 text-xs text-gray-400">
                                    <div>Source IP: 192.168.1.100</div>
                                    <div>Destination: malicious-domain.com</div>
                                    <div>Process: powershell.exe</div>
                                    <div>User: {incident.owner}</div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {detailsPanel && (
        <div className="fixed inset-y-0 right-0 w-96 bg-[#0f0f0f] border-l border-border/30 shadow-2xl z-50 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">Incident Details</h3>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs text-cyan-400 font-medium">LIVE</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setDetailsPanel(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">Incident ID</label>
                <p className="text-sm text-white font-mono font-medium">{detailsPanel.id}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400">Risk Object</label>
                <p className="text-sm text-white font-medium">{detailsPanel.riskObjectName}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400">Title</label>
                <p className="text-sm text-white">{detailsPanel.title}</p>
              </div>

              <div>
                <label className="text-xs text-gray-400">Type</label>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs",
                      detailsPanel.type === "risk_notable"
                        ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
                        : "bg-purple-500/20 text-purple-400 border-purple-500/30",
                    )}
                  >
                    {detailsPanel.type === "risk_notable" ? "Risk Based Alert" : "Notable"}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Urgency</label>
                <div className="mt-1 flex items-center gap-2">
                  <AlertTriangle className={cn("h-4 w-4", getSeverityColor(detailsPanel.urgency))} />
                  <Badge className={cn("capitalize", getSeverityColor(detailsPanel.urgency))}>
                    {detailsPanel.urgency}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Status</label>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs flex items-center gap-1 w-fit",
                      getStatusBadge(detailsPanel.status).className,
                    )}
                  >
                    {getStatusBadge(detailsPanel.status).icon}
                    {getStatusBadge(detailsPanel.status).label}
                  </Badge>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Owner</label>
                <div className="mt-1 flex items-center gap-2">
                  <User className="h-4 w-4 text-cyan-400" />
                  <p className="text-sm text-white font-medium">
                    {detailsPanel.owner || <span className="text-gray-500">Unassigned</span>}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400">Security Domain</label>
                <div className="mt-1">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs capitalize",
                      detailsPanel.securityDomain === "endpoint" &&
                        "bg-purple-500/20 text-purple-400 border-purple-500/30",
                      detailsPanel.securityDomain === "network" && "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
                      detailsPanel.securityDomain === "access" && "bg-blue-500/20 text-blue-400 border-blue-500/30",
                      detailsPanel.securityDomain === "threat" && "bg-red-500/20 text-red-400 border-red-500/30",
                      detailsPanel.securityDomain === "identity" &&
                        "bg-green-500/20 text-green-400 border-green-500/30",
                      detailsPanel.securityDomain === "audit" &&
                        "bg-orange-500/20 text-orange-400 border-orange-500/30",
                    )}
                  >
                    <Shield className="h-3 w-3 mr-1 inline" />
                    {detailsPanel.securityDomain}
                  </Badge>
                </div>
              </div>

              <div className="pt-4 border-t border-border/30">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-400">Risk Score</label>
                    <div className="mt-1 flex items-center gap-2">
                      {detailsPanel.aggregatedRiskScore ? (
                        <>
                          <div
                            className={cn(
                              "w-2 h-2 rounded-full animate-pulse",
                              detailsPanel.aggregatedRiskScore > 200
                                ? "bg-red-500"
                                : detailsPanel.aggregatedRiskScore > 150
                                  ? "bg-orange-500"
                                  : "bg-yellow-500",
                            )}
                          />
                          <span className="text-lg font-bold text-white">{detailsPanel.aggregatedRiskScore}</span>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">Risk Events</label>
                    <div className="mt-1">
                      {detailsPanel.riskEvents ? (
                        <span className="text-lg font-bold text-cyan-400">{detailsPanel.riskEvents}</span>
                      ) : (
                        <span className="text-sm text-gray-500">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border/30 space-y-2">
                <Button
                  className="w-full bg-cyan-600 hover:bg-cyan-700"
                  onClick={() => router.push(`/incidents/${detailsPanel.id}`)}
                >
                  <Shield className="mr-2 h-4 w-4" />
                  View Full Details
                </Button>
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => router.push(`/incidents/${detailsPanel.id}/analyst-mode`)}
                >
                  <Brain className="mr-2 h-4 w-4" />
                  Open Analyst Mode
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {reassignDialog && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[90]" onClick={() => setReassignDialog(null)} />
          <div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1a1a1a] border border-border/50 rounded-lg shadow-2xl z-[100] p-4 min-w-[320px]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-white mb-1">Reassign Incident</h3>
              <p className="text-xs text-gray-400">Current owner: {getFullOwnerName(reassignDialog.currentOwner)}</p>
            </div>
            <div className="space-y-2">
              {[
                { key: "Carl", name: "Carl Johnson" },
                { key: "Vishal", name: "Vishal Patel" },
                { key: "Terry", name: "Terry Chen" },
                { key: "Jamie", name: "Jamie Smith" },
                { key: "Lin", name: "Lin Wang" },
                { key: "Unassigned", name: "Unassigned" },
              ].map((owner) => (
                <button
                  key={owner.key}
                  className={cn(
                    "w-full px-3 py-2 text-left text-sm rounded hover:bg-white/5 transition-colors flex items-center gap-2",
                    reassignDialog.currentOwner === owner.key &&
                      "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30",
                  )}
                  onClick={() => handleReassign(reassignDialog.incidentId, owner.key)}
                >
                  <User className="h-4 w-4" />
                  <span>{owner.name}</span>
                  {reassignDialog.currentOwner === owner.key && (
                    <CheckCircle2 className="h-4 w-4 ml-auto text-cyan-400" />
                  )}
                </button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-border/30">
              <Button
                variant="outline"
                size="sm"
                className="w-full bg-transparent"
                onClick={() => setReassignDialog(null)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </>
      )}

      {contextMenu && (
        <div
          className="fixed bg-[#1a1a1a] border border-border/50 rounded-lg shadow-2xl z-[100] py-1 min-w-[160px]"
          style={{
            left: `${contextMenu.x}px`,
            top: `${contextMenu.y}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-2 border-b border-border/30">
            <p className="text-xs text-gray-400">Reassign to:</p>
          </div>
          {["Carl", "Vishal", "Terry", "Jamie", "Lin", "Unassigned"].map((owner) => (
            <button
              key={owner}
              className={cn(
                "w-full px-3 py-2 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-2",
                contextMenu.currentOwner === owner && "bg-cyan-500/10 text-cyan-400",
              )}
              onClick={() => {
                handleQuickAssign(contextMenu.incidentId, owner)
                handleCloseContextMenu()
              }}
            >
              <User className="h-3 w-3" />
              <span>{owner}</span>
              {contextMenu.currentOwner === owner && <CheckCircle2 className="h-3 w-3 ml-auto text-cyan-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
