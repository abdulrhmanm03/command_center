"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
  Search,
  ChevronDown,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  X,
  CheckCircle2,
  Clock,
  User,
  Shield,
  Zap,
  Target,
  TrendingUp,
  Brain,
  Keyboard,
  ArrowRight,
  Play,
  Pause,
  Layers,
  Database,
  Mail,
  Network,
  Server,
  Cloud,
  FileText,
  Activity,
  GitBranch,
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

  const [filters, setFilters] = useState({
    urgency: "all",
    status: "all",
    owner: "all",
    domain: "all",
    searchType: "correlation",
    timeRange: "last_24hrs",
  })

  useEffect(() => {
    fetchIncidents()
    const interval = setInterval(fetchIncidents, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    applyFilters()
  }, [incidents, filters, searchQuery, sortConfig])

  useEffect(() => {
    if (!triageMode) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "1":
            e.preventDefault()
            handleQuickTriageAction("critical")
            break
          case "2":
            e.preventDefault()
            handleQuickTriageAction("escalate")
            break
          case "3":
            e.preventDefault()
            handleQuickTriageAction("resolve")
            break
          case "n":
            e.preventDefault()
            handleNextIncident()
            break
          case "?":
            e.preventDefault()
            setShowKeyboardShortcuts(!showKeyboardShortcuts)
            break
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [triageMode, selectedForTriage, showKeyboardShortcuts])

  useEffect(() => {
    if (triageMode && triageQueue.length === 0) {
      const untriaged = filteredIncidents.filter((i) => i.status === "new" || i.status === "unassigned")
      setTriageQueue(untriaged)
      setTriageProgress({ completed: 0, total: untriaged.length })
      if (untriaged.length > 0) {
        setSelectedForTriage(untriaged[0])
      }
    } else if (!triageMode) {
      setTriageQueue([])
      setSelectedForTriage(null)
    }
  }, [triageMode, filteredIncidents, setTriageQueue, setTriageProgress, setSelectedForTriage])

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

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage)
  const paginatedIncidents = filteredIncidents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const urgencyData = distributions
    ? [
        { name: "Critical", value: distributions.urgency.critical, color: "#ef4444" },
        { name: "High", value: distributions.urgency.high, color: "#f97316" },
        { name: "Medium", value: distributions.urgency.medium, color: "#eab308" },
        { name: "Low", value: distributions.urgency.low, color: "#3b82f6" },
        { name: "Info", value: distributions.urgency.info, color: "#6b7280" },
      ]
    : []

  const typeData = distributions
    ? [
        { name: "Risk Based Alert", value: distributions.type.risk_notable, color: "#06b6d4" },
        { name: "Notable", value: distributions.type.notable, color: "#8b5cf6" },
      ]
    : []

  const statusData = distributions
    ? [
        { name: "Unassigned", value: distributions.status.unassigned, color: "#6b7280" },
        { name: "New", value: distributions.status.new, color: "#3b82f6" },
        { name: "In Progress", value: distributions.status.in_progress, color: "#eab308" },
        { name: "Pending", value: distributions.status.pending, color: "#f97316" },
        { name: "Resolved", value: distributions.status.resolved, color: "#10b981" },
        { name: "Closed", value: distributions.status.closed, color: "#6b7280" },
      ]
    : []

  const ownerData = distributions
    ? [
        { name: "Carl", value: distributions.owner.carl, color: "#06b6d4" },
        { name: "Vishal", value: distributions.owner.vishal, color: "#8b5cf6" },
        { name: "Terry", value: distributions.owner.terry, color: "#10b981" },
        { name: "Jamie", value: distributions.owner.jamie, color: "#f59e0b" },
        { name: "Lin", value: distributions.owner.lin, color: "#ec4899" },
      ]
    : []

  const domainData = distributions
    ? [
        { name: "Access", value: distributions.securityDomain.access, color: "#3b82f6" },
        { name: "Endpoint", value: distributions.securityDomain.endpoint, color: "#8b5cf6" },
        { name: "Network", value: distributions.securityDomain.network, color: "#06b6d4" },
        { name: "Threat", value: distributions.securityDomain.threat, color: "#ef4444" },
        { name: "Identity", value: distributions.securityDomain.identity, color: "#10b981" },
        { name: "Audit", value: distributions.securityDomain.audit, color: "#f59e0b" },
      ]
    : []

  if (triageMode) {
    return (
      <div className="flex h-screen">
        <SidebarNav />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#0f1419] to-[#0a0a0a] relative">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.1),transparent_50%)] animate-pulse" />

            {/* Header */}
            <div className="relative z-10 border-b border-cyan-500/30 bg-[#0a0a0a]/80 backdrop-blur-xl">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse shadow-lg shadow-cyan-500/50" />
                    <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                      ANALYST MODE
                    </h1>
                  </div>
                  <div className="h-6 w-px bg-cyan-500/30" />
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-4 w-4 text-cyan-400" />
                    <span className="text-gray-400">
                      Progress: <span className="text-cyan-400 font-semibold">{triageProgress.completed}</span> /{" "}
                      {triageProgress.total}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
                    className="gap-2 bg-transparent border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                  >
                    <Keyboard className="h-4 w-4" />
                    Shortcuts
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAutoAdvance(!autoAdvance)}
                    className={cn(
                      "gap-2 bg-transparent border-cyan-500/30",
                      autoAdvance ? "text-cyan-400 bg-cyan-500/10" : "text-gray-400",
                    )}
                  >
                    {autoAdvance ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    Auto-Advance
                  </Button>
                  <Button
                    onClick={() => setTriageMode(false)}
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10"
                  >
                    <X className="h-4 w-4" />
                    Exit Analyst Mode
                  </Button>
                </div>
              </div>
            </div>

            {/* Main Content - Split View */}
            <div className="relative z-10 flex h-[calc(100vh-140px)]">
              {/* Left: Incident Queue (30%) */}
              <div className="w-[30%] border-r border-cyan-500/30 bg-[#0a0a0a]/50 backdrop-blur-sm overflow-y-auto">
                <div className="p-4 border-b border-cyan-500/20 bg-[#0f0f0f]/50">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    TRIAGE QUEUE ({triageQueue.length})
                  </h3>
                  <Input
                    placeholder="Filter queue..."
                    className="bg-[#1a1a1a] border-cyan-500/30 text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="divide-y divide-cyan-500/10">
                  {triageQueue.map((incident, idx) => {
                    const isSelected = selectedForTriage?.id === incident.id
                    const sla = getSLAStatus(incident.time, incident.urgency)

                    return (
                      <div
                        key={incident.id}
                        onClick={() => setSelectedForTriage(incident)}
                        className={cn(
                          "p-4 cursor-pointer transition-all duration-200",
                          isSelected
                            ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-l-4 border-cyan-400 shadow-lg shadow-cyan-500/20"
                            : "hover:bg-[#1a1a1a]/50",
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-gray-500">#{idx + 1}</span>
                            <AlertTriangle className={cn("h-4 w-4", getSeverityColor(incident.urgency))} />
                          </div>
                          <span className={cn("text-xs font-medium", sla.color)}>{sla.text}</span>
                        </div>
                        <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">{incident.title}</h4>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                          <Badge variant="outline" className="text-xs capitalize">
                            {incident.urgency}
                          </Badge>
                          <span>•</span>
                          <span>{incident.securityDomain}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right: Triage Workspace (70%) */}
              <div className="flex-1 overflow-y-auto">
                {selectedForTriage ? (
                  <div className="p-6 space-y-6">
                    {/* Incident Header */}
                    <div className="bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] rounded-lg border border-cyan-500/30 p-6 shadow-xl shadow-cyan-500/10">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className={cn("h-6 w-6", getSeverityColor(selectedForTriage.urgency))} />
                            <h2 className="text-2xl font-bold text-white">{selectedForTriage.title}</h2>
                          </div>
                          <p className="text-gray-400 text-sm">{selectedForTriage.riskObjectName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handlePreviousIncident}
                            disabled={triageQueue.findIndex((i) => i.id === selectedForTriage.id) === 0}
                            className="bg-transparent border-cyan-500/30"
                          >
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleNextIncident}
                            disabled={
                              triageQueue.findIndex((i) => i.id === selectedForTriage.id) === triageQueue.length - 1
                            }
                            className="bg-transparent border-cyan-500/30"
                          >
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-4">
                        <div className="bg-[#0a0a0a]/50 rounded-lg p-3 border border-cyan-500/20">
                          <div className="text-xs text-gray-400 mb-1">Severity</div>
                          <div
                            className={cn("text-lg font-bold capitalize", getSeverityColor(selectedForTriage.urgency))}
                          >
                            {selectedForTriage.urgency}
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a]/50 rounded-lg p-3 border border-cyan-500/20">
                          <div className="text-xs text-gray-400 mb-1">Risk Score</div>
                          <div className="text-lg font-bold text-white">
                            {selectedForTriage.aggregatedRiskScore || "N/A"}
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a]/50 rounded-lg p-3 border border-cyan-500/20">
                          <div className="text-xs text-gray-400 mb-1">Domain</div>
                          <div className="text-lg font-bold text-white capitalize">
                            {selectedForTriage.securityDomain}
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a]/50 rounded-lg p-3 border border-cyan-500/20">
                          <div className="text-xs text-gray-400 mb-1">Age</div>
                          <div className="text-lg font-bold text-white">{getIncidentAge(selectedForTriage.time)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Alert Sources & Detection */}
                    <div className="bg-gradient-to-r from-[#0f0f0f] to-[#1a1a1a] rounded-lg border border-cyan-500/30 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-cyan-400" />
                        Alert Sources & Detection
                      </h3>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="bg-[#0a0a0a]/50 rounded-lg p-3 border border-green-500/30 flex items-center gap-3">
                          <Shield className="h-5 w-5 text-green-400" />
                          <div>
                            <div className="text-xs text-gray-400">SIEM</div>
                            <div className="text-sm font-semibold text-green-400">Active</div>
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a]/50 rounded-lg p-3 border border-green-500/30 flex items-center gap-3">
                          <Server className="h-5 w-5 text-green-400" />
                          <div>
                            <div className="text-xs text-gray-400">XDR</div>
                            <div className="text-sm font-semibold text-green-400">Detected</div>
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a]/50 rounded-lg p-3 border border-gray-500/30 flex items-center gap-3">
                          <Network className="h-5 w-5 text-gray-400" />
                          <div>
                            <div className="text-xs text-gray-400">IDS/IPS</div>
                            <div className="text-sm font-semibold text-gray-400">Inactive</div>
                          </div>
                        </div>
                        <div className="bg-[#0a0a0a]/50 rounded-lg p-3 border border-green-500/30 flex items-center gap-3">
                          <Mail className="h-5 w-5 text-green-400" />
                          <div>
                            <div className="text-xs text-gray-400">Email Sec</div>
                            <div className="text-sm font-semibold text-green-400">Correlated</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Exabot Triage AI Analysis */}
                    <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/30 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-400 animate-pulse" />
                        Exabot Triage Analysis
                      </h3>

                      {/* False Positive Detection */}
                      <div className="mb-4 p-4 bg-green-900/20 rounded-lg border border-green-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-400" />
                            <span className="text-sm font-semibold text-white">False Positive Detection</span>
                          </div>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Confidence: 12%</Badge>
                        </div>
                        <p className="text-xs text-gray-400">
                          Low probability of false positive. Alert shows genuine threat indicators with high confidence.
                        </p>
                      </div>

                      {/* AI Recommendations */}
                      <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-[#0a0a0a]/50 rounded-lg border border-yellow-500/20">
                          <Zap className="h-5 w-5 text-yellow-400 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-white">Escalate to Tier 2</span>
                              <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                Confidence: 87%
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-400">
                              Similar incidents required advanced analysis. Recommend escalation based on complexity
                              patterns.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-[#0a0a0a]/50 rounded-lg border border-cyan-500/20">
                          <CheckCircle2 className="h-5 w-5 text-green-400 mt-0.5" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-white">Assign to Network Team</span>
                              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                                Confidence: 92%
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-400">
                              Network domain expertise required. Team has 95% resolution rate for similar incidents.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Feedback Loop Indicator */}
                      <div className="mt-4 p-3 bg-[#0a0a0a]/50 rounded-lg border border-cyan-500/20 flex items-center gap-3">
                        <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
                        <div className="flex-1">
                          <div className="text-xs text-gray-400 mb-1">Feedback Loop Active</div>
                          <div className="text-sm text-white">Learning from 247 similar historical incidents</div>
                        </div>
                      </div>
                    </div>

                    {/* Full Contextualization Panel */}
                    <div className="bg-[#0f0f0f] rounded-lg border border-cyan-500/30 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Database className="h-5 w-5 text-cyan-400" />
                        Full Contextualization
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="p-3 bg-[#0a0a0a]/50 rounded-lg border border-cyan-500/20">
                            <div className="text-xs text-gray-400 mb-1">Threat Intelligence</div>
                            <div className="text-sm text-white">Known APT28 tactics detected</div>
                            <div className="text-xs text-cyan-400 mt-1">Source: MISP, AlienVault OTX</div>
                          </div>
                          <div className="p-3 bg-[#0a0a0a]/50 rounded-lg border border-cyan-500/20">
                            <div className="text-xs text-gray-400 mb-1">User Context</div>
                            <div className="text-sm text-white">High-privilege account</div>
                            <div className="text-xs text-cyan-400 mt-1">Finance Department, VPN access</div>
                          </div>
                          <div className="p-3 bg-[#0a0a0a]/50 rounded-lg border border-cyan-500/20">
                            <div className="text-xs text-gray-400 mb-1">Asset Context</div>
                            <div className="text-sm text-white">Critical server - Production DB</div>
                            <div className="text-xs text-cyan-400 mt-1">PCI-DSS scope, 24/7 monitoring</div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="p-3 bg-[#0a0a0a]/50 rounded-lg border border-cyan-500/20">
                            <div className="text-xs text-gray-400 mb-1">Historical Behavior</div>
                            <div className="text-sm text-white">Anomalous login pattern</div>
                            <div className="text-xs text-cyan-400 mt-1">First login from this location</div>
                          </div>
                          <div className="p-3 bg-[#0a0a0a]/50 rounded-lg border border-cyan-500/20">
                            <div className="text-xs text-gray-400 mb-1">Related Incidents</div>
                            <div className="text-sm text-white">3 similar alerts this week</div>
                            <div className="text-xs text-cyan-400 mt-1">2 resolved, 1 escalated</div>
                          </div>
                          <div className="p-3 bg-[#0a0a0a]/50 rounded-lg border border-cyan-500/20">
                            <div className="text-xs text-gray-400 mb-1">Business Impact</div>
                            <div className="text-sm text-white">High - Revenue system</div>
                            <div className="text-xs text-cyan-400 mt-1">$50K/hour downtime cost</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Workflows & Playbooks */}
                    <div className="bg-[#0f0f0f] rounded-lg border border-cyan-500/30 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <GitBranch className="h-5 w-5 text-cyan-400" />
                        Dynamic Workflows & SOAR Playbooks
                      </h3>

                      {/* Recommended Workflow */}
                      <div className="mb-4 p-4 bg-purple-900/20 rounded-lg border border-purple-500/30">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-purple-400" />
                            <span className="text-sm font-semibold text-white">Recommended Workflow</span>
                          </div>
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">Auto-selected</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center text-green-400">
                              1
                            </div>
                            <span>Isolate affected endpoint</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center text-yellow-400">
                              2
                            </div>
                            <span>Collect forensic artifacts</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center text-blue-400">
                              3
                            </div>
                            <span>Block malicious IPs at firewall</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-300">
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center text-purple-400">
                              4
                            </div>
                            <span>Notify security team & stakeholders</span>
                          </div>
                        </div>
                      </div>

                      {/* Available Playbooks */}
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-start gap-2 bg-[#0a0a0a]/50 border-cyan-500/30 hover:bg-cyan-500/10"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <Shield className="h-4 w-4 text-cyan-400" />
                            <span className="text-sm font-semibold text-white">Ransomware Response</span>
                          </div>
                          <span className="text-xs text-gray-400">8 steps • 15 min avg</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-start gap-2 bg-[#0a0a0a]/50 border-cyan-500/30 hover:bg-cyan-500/10"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <AlertCircle className="h-4 w-4 text-orange-400" />
                            <span className="text-sm font-semibold text-white">Phishing Investigation</span>
                          </div>
                          <span className="text-xs text-gray-400">6 steps • 10 min avg</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-start gap-2 bg-[#0a0a0a]/50 border-cyan-500/30 hover:bg-cyan-500/10"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <Network className="h-4 w-4 text-green-400" />
                            <span className="text-sm font-semibold text-white">Network Intrusion</span>
                          </div>
                          <span className="text-xs text-gray-400">10 steps • 20 min avg</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="h-auto p-4 flex flex-col items-start gap-2 bg-[#0a0a0a]/50 border-cyan-500/30 hover:bg-cyan-500/10"
                        >
                          <div className="flex items-center gap-2 w-full">
                            <Database className="h-4 w-4 text-purple-400" />
                            <span className="text-sm font-semibold text-white">Data Exfiltration</span>
                          </div>
                          <span className="text-xs text-gray-400">12 steps • 25 min avg</span>
                        </Button>
                      </div>

                      <Button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                        <Play className="mr-2 h-4 w-4" />
                        Execute Recommended Workflow
                      </Button>
                    </div>

                    {/* Logs & Evidence */}
                    <div className="bg-[#0f0f0f] rounded-lg border border-cyan-500/30 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-cyan-400" />
                        Logs & Evidence
                      </h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        <div className="p-3 bg-[#0a0a0a]/50 rounded-lg border border-cyan-500/20 font-mono text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <Cloud className="h-3 w-3 text-blue-400" />
                            <span className="text-gray-400">Cloud Logs</span>
                            <span className="text-cyan-400">AWS CloudTrail</span>
                          </div>
                          <div className="text-gray-300">
                            2024-01-15 14:32:15 | AssumeRole | user@company.com | 192.168.1.100
                          </div>
                        </div>
                        <div className="p-3 bg-[#0a0a0a]/50 rounded-lg border border-cyan-500/20 font-mono text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <Server className="h-3 w-3 text-green-400" />
                            <span className="text-gray-400">Endpoint Logs</span>
                            <span className="text-cyan-400">Windows Event</span>
                          </div>
                          <div className="text-gray-300">
                            2024-01-15 14:32:18 | Process Created | powershell.exe | SYSTEM
                          </div>
                        </div>
                        <div className="p-3 bg-[#0a0a0a]/50 rounded-lg border border-cyan-500/20 font-mono text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <Network className="h-3 w-3 text-purple-400" />
                            <span className="text-gray-400">Network Logs</span>
                            <span className="text-cyan-400">Firewall</span>
                          </div>
                          <div className="text-gray-300">
                            2024-01-15 14:32:20 | Connection | 192.168.1.100 → 185.220.101.5:443
                          </div>
                        </div>
                        <div className="p-3 bg-[#0a0a0a]/50 rounded-lg border border-cyan-500/20 font-mono text-xs">
                          <div className="flex items-center gap-2 mb-1">
                            <Mail className="h-3 w-3 text-orange-400" />
                            <span className="text-gray-400">Email Logs</span>
                            <span className="text-cyan-400">O365</span>
                          </div>
                          <div className="text-gray-300">
                            2024-01-15 14:30:05 | Email Received | suspicious@external.com
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full mt-4 bg-transparent border-cyan-500/30">
                        <FileText className="mr-2 h-4 w-4" />
                        View Full Log Timeline
                      </Button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-[#0f0f0f] rounded-lg border border-cyan-500/30 p-6">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                        <Zap className="h-5 w-5 text-cyan-400" />
                        Quick Triage Actions
                      </h3>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          onClick={() => handleQuickTriageAction("critical")}
                          className="h-16 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-500/20"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="text-sm font-semibold">Mark Critical</span>
                            <span className="text-xs opacity-75">Ctrl+1</span>
                          </div>
                        </Button>
                        <Button
                          onClick={() => handleQuickTriageAction("escalate")}
                          className="h-16 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white shadow-lg shadow-orange-500/20"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <TrendingUp className="h-5 w-5" />
                            <span className="text-sm font-semibold">Escalate</span>
                            <span className="text-xs opacity-75">Ctrl+2</span>
                          </div>
                        </Button>
                        <Button
                          onClick={() => handleQuickTriageAction("resolve")}
                          className="h-16 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg shadow-green-500/20"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <CheckCircle2 className="h-5 w-5" />
                            <span className="text-sm font-semibold">Resolve</span>
                            <span className="text-xs opacity-75">Ctrl+3</span>
                          </div>
                        </Button>
                        <Button
                          onClick={() => handleQuickTriageAction("assign_me")}
                          className="h-16 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 text-white shadow-lg shadow-cyan-500/20"
                        >
                          <div className="flex flex-col items-center gap-1">
                            <User className="h-5 w-5" />
                            <span className="text-sm font-semibold">Assign to Me</span>
                            <span className="text-xs opacity-75">Ctrl+A</span>
                          </div>
                        </Button>
                      </div>
                    </div>

                    {/* Detailed Actions */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-[#0f0f0f] rounded-lg border border-cyan-500/30 p-6">
                        <h3 className="text-sm font-semibold text-white mb-4">Change Severity</h3>
                        <Select
                          value={selectedForTriage.urgency}
                          onValueChange={(v) => handleQuickSeverityChange(selectedForTriage.id, v)}
                        >
                          <SelectTrigger className="bg-[#1a1a1a] border-cyan-500/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="critical">Critical</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="info">Info</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="bg-[#0f0f0f] rounded-lg border border-cyan-500/30 p-6">
                        <h3 className="text-sm font-semibold text-white mb-4">Assign Owner</h3>
                        <Select
                          value={selectedForTriage.owner}
                          onValueChange={(v) => handleQuickAssign(selectedForTriage.id, v)}
                        >
                          <SelectTrigger className="bg-[#1a1a1a] border-cyan-500/30">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="carl">Carl</SelectItem>
                            <SelectItem value="vishal">Vishal</SelectItem>
                            <SelectItem value="terry">Terry</SelectItem>
                            <SelectItem value="jamie">Jamie</SelectItem>
                            <SelectItem value="lin">Lin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* View Full Details */}
                    <Button
                      onClick={() => router.push(`/incidents/${selectedForTriage.id}?tab=triage`)}
                      className="w-full h-12 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20"
                    >
                      <Shield className="mr-2 h-5 w-5" />
                      Open Full Triage Workspace
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <Target className="h-16 w-16 text-cyan-400/50 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">No Incident Selected</h3>
                      <p className="text-gray-400">Select an incident from the queue to begin triage</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Keyboard Shortcuts Overlay */}
            {showKeyboardShortcuts && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-[#0f0f0f] rounded-lg border border-cyan-500/30 p-8 max-w-2xl w-full mx-4 shadow-2xl shadow-cyan-500/20">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <Keyboard className="h-6 w-6 text-cyan-400" />
                      Keyboard Shortcuts
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowKeyboardShortcuts(false)}
                      className="text-gray-400"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <span className="text-gray-300">Mark Critical</span>
                      <kbd className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm font-mono">Ctrl+1</kbd>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <span className="text-gray-300">Escalate</span>
                      <kbd className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm font-mono">Ctrl+2</kbd>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <span className="text-gray-300">Resolve</span>
                      <kbd className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm font-mono">Ctrl+3</kbd>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <span className="text-gray-300">Next Incident</span>
                      <kbd className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm font-mono">Ctrl+N</kbd>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <span className="text-gray-300">Toggle Shortcuts</span>
                      <kbd className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm font-mono">Ctrl+?</kbd>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    )
  }

  // Standard Incident Review Page
  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">Incident Review</h1>
              <p className="text-sm text-gray-400">Automated incident response and workflows</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setTriageMode(!triageMode)}
                variant={triageMode ? "default" : "outline"}
                size="sm"
                className={cn(
                  "gap-2 transition-all",
                  triageMode
                    ? "bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-500/50 animate-pulse"
                    : "bg-transparent",
                )}
              >
                <Shield className="h-4 w-4" />
                {triageMode ? "Triage Mode: ACTIVE" : "Enable Triage Mode"}
              </Button>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search incidents..."
                  className="pl-10 w-64 bg-[#1a1a1a] border-border/50"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={fetchIncidents} variant="outline" size="sm" className="gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Triage Mode banner */}
          {triageMode && (
            <div className="bg-gradient-to-r from-cyan-900/30 to-cyan-800/20 border border-cyan-500/30 rounded-lg p-4 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-semibold text-cyan-400">Triage Mode Active</h3>
                  <p className="text-xs text-gray-400">
                    Click any incident to open the Triage tab for quick investigation and response
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTriageMode(false)}
                className="text-cyan-400 hover:text-cyan-300"
              >
                Exit Triage Mode
              </Button>
            </div>
          )}

          {/* Donut Charts */}
          <div className="grid grid-cols-5 gap-4 mb-6">
            {/* Urgency */}
            <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Urgency</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={urgencyData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={55}>
                      {urgencyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1">
                  {urgencyData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-400">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Type */}
            <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Type</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={typeData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={55}>
                      {typeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1">
                  {typeData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-400">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Status</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={statusData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={55}>
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1">
                  {statusData.slice(0, 6).map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-400">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Owner */}
            <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Owner</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={ownerData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={55}>
                      {ownerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1">
                  {ownerData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-400">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Security Domain */}
            <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-4">
              <h3 className="text-sm font-semibold text-white mb-3">Security Domain</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={120} height={120}>
                  <PieChart>
                    <Pie data={domainData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={55}>
                      {domainData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-1">
                  {domainData.map((item) => (
                    <div key={item.name} className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                      <span className="text-gray-400">{item.name}</span>
                    </div>
                  ))}
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
              <table className="w-full">
                <thead className="border-b border-border/30 bg-[#1a1a1a]">
                  <tr className="text-left">
                    <th className="p-3 text-xs font-medium text-gray-400">
                      <input
                        type="checkbox"
                        className="rounded border-gray-600"
                        checked={selectedIncidents.size === paginatedIncidents.length && paginatedIncidents.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th className="p-3 text-xs font-medium text-gray-400">Age / SLA</th>
                    <th
                      className="p-3 text-xs font-medium text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("riskObjectName")}
                    >
                      Risk Object Name <ChevronDown className="inline h-3 w-3" />
                    </th>
                    <th
                      className="p-3 text-xs font-medium text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("title")}
                    >
                      Title <ChevronDown className="inline h-3 w-3" />
                    </th>
                    <th
                      className="p-3 text-xs font-medium text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("aggregatedRiskScore")}
                    >
                      Risk Score <ChevronDown className="inline h-3 w-3" />
                    </th>
                    <th className="p-3 text-xs font-medium text-gray-400">Risk Events</th>
                    <th className="p-3 text-xs font-medium text-gray-400">Type</th>
                    <th
                      className="p-3 text-xs font-medium text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("time")}
                    >
                      Time <ChevronDown className="inline h-3 w-3" />
                    </th>
                    <th className="p-3 text-xs font-medium text-gray-400">Domain</th>
                    <th
                      className="p-3 text-xs font-medium text-gray-400 cursor-pointer hover:text-white"
                      onClick={() => handleSort("urgency")}
                    >
                      Urgency <ChevronDown className="inline h-3 w-3" />
                    </th>
                    <th className="p-3 text-xs font-medium text-gray-400">Status</th>
                    <th className="p-3 text-xs font-medium text-gray-400">Owner</th>
                    <th className="p-3 text-xs font-medium text-gray-400">
                      {triageMode ? "Triage Actions" : "Action"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {paginatedIncidents.map((incident, idx) => {
                    const sla = getSLAStatus(incident.time, incident.urgency)
                    const age = getIncidentAge(incident.time)
                    const isHovered = hoveredRow === incident.id

                    return (
                      <>
                        <tr
                          key={incident.id}
                          className={cn(
                            "hover:bg-[#1a1a1a] transition-all cursor-pointer group",
                            expandedRow === incident.id && "bg-[#1a1a1a]",
                            triageMode &&
                              "hover:border-l-4 hover:border-cyan-500 hover:shadow-lg hover:shadow-cyan-500/20",
                          )}
                          onClick={() => {
                            if (triageMode) {
                              window.location.href = `/incidents/${incident.id}?tab=triage`
                            } else {
                              window.location.href = `/incidents/${incident.id}`
                            }
                          }}
                          onMouseEnter={() => setHoveredRow(incident.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          <td className="p-3" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="checkbox"
                              className="rounded border-gray-600"
                              checked={selectedIncidents.has(incident.id)}
                              onChange={(e) => handleSelectIncident(incident.id, e.target.checked)}
                            />
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-gray-400">{age}</span>
                              <span className={cn("text-xs font-medium", sla.color)}>{sla.text}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 text-gray-400 transition-transform",
                                  expandedRow === incident.id && "rotate-90",
                                )}
                              />
                              <span className="text-sm text-gray-300">{incident.riskObjectName}</span>
                            </div>
                          </td>
                          <td className="p-3 text-sm text-gray-300 max-w-xs">{incident.title}</td>
                          <td className="p-3">
                            {incident.aggregatedRiskScore ? (
                              <div className="flex items-center gap-2">
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
                          <td className="p-3">
                            {incident.riskEvents ? (
                              <Button variant="link" className="text-cyan-400 p-0 h-auto text-sm">
                                {incident.riskEvents}
                              </Button>
                            ) : (
                              <span className="text-sm text-gray-500">--</span>
                            )}
                          </td>
                          <td className="p-3 text-sm text-gray-300">
                            {new Date(incident.time).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="text-xs capitalize">
                              {incident.securityDomain}
                            </Badge>
                          </td>
                          <td className="p-3" onClick={(e) => e.stopPropagation()}>
                            {triageMode ? (
                              <Select
                                value={incident.urgency}
                                onValueChange={(v) => handleQuickSeverityChange(incident.id, v)}
                              >
                                <SelectTrigger className="w-28 h-7 text-xs bg-[#1a1a1a] border-border/50">
                                  <AlertTriangle className={cn("h-3 w-3 mr-1", getSeverityColor(incident.urgency))} />
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="critical">Critical</SelectItem>
                                  <SelectItem value="high">High</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="low">Low</SelectItem>
                                  <SelectItem value="info">Info</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <div className="flex items-center gap-2">
                                <AlertTriangle className={cn("h-4 w-4", getSeverityColor(incident.urgency))} />
                                <span
                                  className={cn("text-sm font-medium capitalize", getSeverityColor(incident.urgency))}
                                >
                                  {incident.urgency}
                                </span>
                              </div>
                            )}
                          </td>
                          <td className="p-3" onClick={(e) => e.stopPropagation()}>
                            {triageMode ? (
                              <Select
                                value={incident.status}
                                onValueChange={(v) => handleQuickStatusChange(incident.id, v)}
                              >
                                <SelectTrigger className="w-32 h-7 text-xs bg-[#1a1a1a] border-border/50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">New</SelectItem>
                                  <SelectItem value="in_progress">In Progress</SelectItem>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="resolved">Resolved</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant="outline" className="text-xs border-gray-700 text-gray-300 capitalize">
                                {incident.status.replace("_", " ")}
                              </Badge>
                            )}
                          </td>
                          <td className="p-3" onClick={(e) => e.stopPropagation()}>
                            {triageMode ? (
                              <Select value={incident.owner} onValueChange={(v) => handleQuickAssign(incident.id, v)}>
                                <SelectTrigger className="w-28 h-7 text-xs bg-[#1a1a1a] border-border/50">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="carl">Carl</SelectItem>
                                  <SelectItem value="vishal">Vishal</SelectItem>
                                  <SelectItem value="terry">Terry</SelectItem>
                                  <SelectItem value="jamie">Jamie</SelectItem>
                                  <SelectItem value="lin">Lin</SelectItem>
                                  <SelectItem value="unassigned">Unassigned</SelectItem>
                                </SelectContent>
                              </Select>
                            ) : (
                              <span className="text-sm text-gray-300">{incident.owner}</span>
                            )}
                          </td>
                          <td className="p-3" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              {triageMode ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => setQuickNoteId(incident.id)}
                                  >
                                    Add Note
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleQuickAction(incident.id, "escalate")}
                                  >
                                    Escalate
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => handleQuickAction(incident.id, "assign")}
                                  >
                                    Assign
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-xs"
                                    onClick={() => setDetailsPanel(incident)}
                                  >
                                    Details
                                  </Button>
                                </>
                              )}
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
              <h3 className="text-lg font-bold text-white">Incident Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setDetailsPanel(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-400">Risk Object</label>
                <p className="text-sm text-white font-medium">{detailsPanel.riskObjectName}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400">Title</label>
                <p className="text-sm text-white">{detailsPanel.title}</p>
              </div>
              <div>
                <label className="text-xs text-gray-400">Urgency</label>
                <Badge className={cn("mt-1", getSeverityColor(detailsPanel.urgency))}>{detailsPanel.urgency}</Badge>
              </div>
              <div>
                <label className="text-xs text-gray-400">Status</label>
                <p className="text-sm text-white capitalize">{detailsPanel.status.replace("_", " ")}</p>
              </div>
              <div className="pt-4 border-t border-border/30">
                <Button className="w-full bg-cyan-600 hover:bg-cyan-700">Take Action</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
