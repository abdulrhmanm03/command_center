"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/router"
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
    const interval = setInterval(fetchIncidents, 10000) // Update every 10s for live effect
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    applyFilters()
  }, [incidents, filters, searchQuery, sortConfig])

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

    // Apply urgency filter
    if (filters.urgency !== "all") {
      filtered = filtered.filter((i) => i.urgency === filters.urgency)
    }

    // Apply status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((i) => i.status === filters.status)
    }

    // Apply owner filter
    if (filters.owner !== "all") {
      filtered = filtered.filter((i) => i.owner?.toLowerCase().includes(filters.owner.toLowerCase()))
    }

    // Apply domain filter
    if (filters.domain !== "all") {
      filtered = filtered.filter((i) => i.securityDomain === filters.domain)
    }

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(
        (i) =>
          i.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.riskObjectName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.owner?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply sorting
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
    // In production, call API to update incident
    await fetchIncidents()
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
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      <User className="h-3 w-3 mr-1" />
                      Assign
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Close
                    </Button>
                    <Button variant="outline" size="sm" className="text-xs bg-transparent">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Escalate
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
                    <th className="p-3 text-xs font-medium text-gray-400">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/20">
                  {paginatedIncidents.map((incident, idx) => (
                    <>
                      <tr
                        key={incident.id}
                        className={cn(
                          "hover:bg-[#1a1a1a] transition-colors cursor-pointer",
                          expandedRow === incident.id && "bg-[#1a1a1a]",
                        )}
                        onClick={() => router.push(`/incidents/${incident.id}`)}
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
                        <td className="p-3">
                          <span className="text-sm text-gray-300 capitalize">
                            {incident.type === "risk_notable" ? "Risk Notable" : "Notable"}
                          </span>
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
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className={cn("h-4 w-4", getSeverityColor(incident.urgency))} />
                            <span className={cn("text-sm font-medium capitalize", getSeverityColor(incident.urgency))}>
                              {incident.urgency}
                            </span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs border-gray-700 text-gray-300 capitalize">
                            {incident.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-gray-300">{incident.owner}</td>
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1">
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
                          </div>
                        </td>
                      </tr>
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
                  ))}
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
