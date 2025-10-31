"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Play,
  UserPlus,
  Eye,
  Download,
  RefreshCw,
  Shield,
  TrendingUp,
  Clock,
  Filter,
  X,
  BarChart3,
  PieChartIcon,
  Activity,
  Target,
} from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  Legend,
  Treemap,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"

interface ComplianceControl {
  id: string
  control_id: string
  framework: string
  title: string
  status: "passing" | "failing" | "partial" | "unassigned"
  category: string
  evidence: Array<{
    source: string
    result: string
    timestamp: Date
    details?: string
  }>
  checks_passing: number
  checks_total: number
  last_checked: Date
  assigned_to?: string
  priority: "critical" | "high" | "medium" | "low"
  remediation_playbook?: string
  effort: number
  risk_score: number
}

export default function CompliancePage() {
  const [controls, setControls] = useState<ComplianceControl[]>([])
  const [stats, setStats] = useState({
    total: 0,
    passing: 0,
    failing: 0,
    partial: 0,
    unassigned: 0,
    compliance_score: 0,
    critical_gaps: 0,
  })
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("overview")
  const [chartView, setChartView] = useState<"radar" | "bar" | "treemap" | "scatter">("radar")
  const [showFilters, setShowFilters] = useState(false)

  const [selectedFrameworks, setSelectedFrameworks] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [dateRange, setDateRange] = useState("all")

  useEffect(() => {
    fetchComplianceData()
    const interval = setInterval(fetchComplianceData, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchComplianceData = async () => {
    try {
      const response = await fetch("/api/compliance")
      const data = await response.json()
      setControls(data.controls)
      setStats(data.stats)
    } catch (error) {
      console.error("Failed to fetch compliance data:", error)
    }
  }

  const handleFix = async (controlId: string, playbookId: string) => {
    try {
      const response = await fetch("/api/compliance/fix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ control_id: controlId, playbook_id: playbookId }),
      })
      const data = await response.json()
      console.log("Fix initiated:", data)
    } catch (error) {
      console.error("Failed to initiate fix:", error)
    }
  }

  const filteredControls = controls.filter((control) => {
    const matchesFramework = selectedFrameworks.length === 0 || selectedFrameworks.includes(control.framework)
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(control.status)
    const matchesPriority = selectedPriorities.length === 0 || selectedPriorities.includes(control.priority)
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(control.category)
    const matchesSearch =
      searchQuery === "" ||
      control.control_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      control.framework.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesFramework && matchesStatus && matchesPriority && matchesCategory && matchesSearch
  })

  const clearFilters = () => {
    setSelectedFrameworks([])
    setSelectedStatuses([])
    setSelectedPriorities([])
    setSelectedCategories([])
    setSearchQuery("")
    setDateRange("all")
  }

  const activeFilterCount =
    selectedFrameworks.length +
    selectedStatuses.length +
    selectedPriorities.length +
    selectedCategories.length +
    (searchQuery ? 1 : 0)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passing":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "failing":
        return <XCircle className="h-5 w-5 text-red-500" />
      case "partial":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      passing: "bg-green-500/20 text-green-400 border-green-500/30",
      failing: "bg-red-500/20 text-red-400 border-red-500/30",
      partial: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      unassigned: "bg-gray-500/20 text-gray-400 border-gray-500/30",
    }
    return (
      <Badge className={`${styles[status as keyof typeof styles]} border`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const styles = {
      critical: "bg-red-600 text-white",
      high: "bg-orange-500 text-white",
      medium: "bg-yellow-500 text-black",
      low: "bg-blue-500 text-white",
    }
    return <Badge className={styles[priority as keyof typeof styles]}>{priority.toUpperCase()}</Badge>
  }

  const frameworkCoverage = [
    { name: "NIST 800-53", total: 120, passing: 95, failing: 15, partial: 10, coverage: 79, region: "global" },
    { name: "PCI DSS", total: 78, passing: 62, failing: 8, partial: 8, coverage: 79, region: "global" },
    { name: "GDPR", total: 45, passing: 38, failing: 4, partial: 3, coverage: 84, region: "global" },
    { name: "HIPAA", total: 56, passing: 48, failing: 3, partial: 5, coverage: 86, region: "global" },
    { name: "SOC 2", total: 64, passing: 52, failing: 6, partial: 6, coverage: 81, region: "global" },
    { name: "UAE Data Protection Law", total: 42, passing: 28, failing: 8, partial: 6, coverage: 67, region: "uae" },
    { name: "UAE NESA", total: 68, passing: 52, failing: 10, partial: 6, coverage: 76, region: "uae" },
    { name: "DIFC Data Protection", total: 35, passing: 24, failing: 7, partial: 4, coverage: 69, region: "uae" },
  ]

  const radarData = frameworkCoverage.map((f) => ({
    framework: f.name.split(" ")[0],
    coverage: f.coverage,
    fullMark: 100,
  }))

  const categoryData = [
    { name: "Access Control", size: 45, fill: "#06b6d4" },
    { name: "Data Protection", size: 38, fill: "#10b981" },
    { name: "Incident Response", size: 32, fill: "#f59e0b" },
    { name: "Network Security", size: 28, fill: "#8b5cf6" },
    { name: "Audit & Logging", size: 25, fill: "#ec4899" },
    { name: "Risk Management", size: 22, fill: "#f97316" },
  ]

  const scatterData = controls.slice(0, 50).map((c) => ({
    x: c.effort || Math.random() * 10,
    y: c.risk_score || Math.random() * 100,
    z: c.priority === "critical" ? 400 : c.priority === "high" ? 300 : c.priority === "medium" ? 200 : 100,
    name: c.control_id,
    status: c.status,
  }))

  const complianceTrend = [
    { date: "Week 1", score: 72 },
    { date: "Week 2", score: 74 },
    { date: "Week 3", score: 76 },
    { date: "Week 4", score: 78 },
    { date: "Week 5", score: 79 },
    { date: "Week 6", score: 81 },
    { date: "Week 7", score: 82 },
  ]

  const statusDistribution = [
    { name: "Passing", value: stats.passing, color: "#10b981" },
    { name: "Failing", value: stats.failing, color: "#ef4444" },
    { name: "Partial", value: stats.partial, color: "#f59e0b" },
    { name: "Unassigned", value: stats.unassigned, color: "#6b7280" },
  ]

  const frameworks = ["NIST 800-53", "PCI DSS", "GDPR", "HIPAA", "SOC 2", "UAE PDPL", "UAE NESA", "DIFC"]
  const statuses = ["passing", "failing", "partial", "unassigned"]
  const priorities = ["critical", "high", "medium", "low"]
  const categories = [
    "Access Control",
    "Data Protection",
    "Incident Response",
    "Network Security",
    "Audit & Logging",
    "Risk Management",
  ]

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400">Compliance & Frameworks</h1>
              <p className="text-sm text-gray-400">
                Real-time control validation across multiple compliance frameworks
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-cyan-500/30 bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-cyan-500/30 bg-transparent"
                onClick={fetchComplianceData}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Visual Compliance Posture Dashboard */}
          <div className="mb-6 grid grid-cols-4 gap-4">
            <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Overall Compliance</div>
                    <div className="mt-2 text-4xl font-bold text-cyan-400">{stats.compliance_score}%</div>
                    <div className="mt-2 flex items-center gap-1 text-xs text-green-400">
                      <TrendingUp className="h-3 w-3" />
                      +3% this month
                    </div>
                  </div>
                  <Shield className="h-12 w-12 text-cyan-400/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Controls Passing</div>
                    <div className="mt-2 text-4xl font-bold text-green-400">{stats.passing}</div>
                    <div className="mt-2 text-xs text-gray-500">of {stats.total} total</div>
                  </div>
                  <CheckCircle2 className="h-12 w-12 text-green-400/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Critical Gaps</div>
                    <div className="mt-2 text-4xl font-bold text-red-400">{stats.critical_gaps}</div>
                    <div className="mt-2 text-xs text-red-400">Requires immediate action</div>
                  </div>
                  <AlertCircle className="h-12 w-12 text-red-400/30" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 to-transparent">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-400">Pending Review</div>
                    <div className="mt-2 text-4xl font-bold text-yellow-400">{stats.partial + stats.unassigned}</div>
                    <div className="mt-2 text-xs text-gray-500">Needs attention</div>
                  </div>
                  <Clock className="h-12 w-12 text-yellow-400/30" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 grid grid-cols-3 gap-4">
            <Card className="col-span-2 border-cyan-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-cyan-400">
                    <Activity className="h-5 w-5" />
                    Framework Analysis
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant={chartView === "radar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartView("radar")}
                      className={chartView === "radar" ? "bg-cyan-500" : "border-cyan-500/30"}
                    >
                      <Target className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartView === "bar" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartView("bar")}
                      className={chartView === "bar" ? "bg-cyan-500" : "border-cyan-500/30"}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartView === "treemap" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartView("treemap")}
                      className={chartView === "treemap" ? "bg-cyan-500" : "border-cyan-500/30"}
                    >
                      <PieChartIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={chartView === "scatter" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartView("scatter")}
                      className={chartView === "scatter" ? "bg-cyan-500" : "border-cyan-500/30"}
                    >
                      <Activity className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {chartView === "radar" && (
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#374151" />
                      <PolarAngleAxis dataKey="framework" stroke="#9ca3af" style={{ fontSize: "12px" }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
                      <Radar name="Coverage" dataKey="coverage" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.6} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                )}

                {chartView === "bar" && (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={frameworkCoverage}>
                      <XAxis
                        dataKey="name"
                        stroke="#6b7280"
                        style={{ fontSize: "10px" }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar dataKey="passing" fill="#10b981" name="Passing" />
                      <Bar dataKey="partial" fill="#f59e0b" name="Partial" />
                      <Bar dataKey="failing" fill="#ef4444" name="Failing" />
                    </BarChart>
                  </ResponsiveContainer>
                )}

                {chartView === "treemap" && (
                  <ResponsiveContainer width="100%" height={300}>
                    <Treemap
                      data={categoryData}
                      dataKey="size"
                      stroke="#1f2937"
                      fill="#06b6d4"
                      content={({ x, y, width, height, name, size }) => (
                        <g>
                          <rect
                            x={x}
                            y={y}
                            width={width}
                            height={height}
                            style={{
                              fill: categoryData.find((c) => c.name === name)?.fill || "#06b6d4",
                              stroke: "#1f2937",
                              strokeWidth: 2,
                            }}
                          />
                          {width > 60 && height > 40 && (
                            <>
                              <text
                                x={x + width / 2}
                                y={y + height / 2 - 10}
                                textAnchor="middle"
                                fill="#fff"
                                fontSize={12}
                                fontWeight="bold"
                              >
                                {name}
                              </text>
                              <text
                                x={x + width / 2}
                                y={y + height / 2 + 10}
                                textAnchor="middle"
                                fill="#fff"
                                fontSize={14}
                              >
                                {size}
                              </text>
                            </>
                          )}
                        </g>
                      )}
                    />
                  </ResponsiveContainer>
                )}

                {chartView === "scatter" && (
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <XAxis
                        type="number"
                        dataKey="x"
                        name="Effort"
                        stroke="#6b7280"
                        label={{ value: "Implementation Effort", position: "bottom", fill: "#9ca3af" }}
                      />
                      <YAxis
                        type="number"
                        dataKey="y"
                        name="Risk"
                        stroke="#6b7280"
                        label={{ value: "Risk Score", angle: -90, position: "left", fill: "#9ca3af" }}
                      />
                      <ZAxis type="number" dataKey="z" range={[50, 400]} />
                      <Tooltip
                        cursor={{ strokeDasharray: "3 3" }}
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                        }}
                      />
                      <Scatter name="Controls" data={scatterData} fill="#06b6d4" />
                    </ScatterChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Control Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "1px solid #374151",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {statusDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-400">{item.name}</span>
                      </div>
                      <span className="font-semibold text-gray-300">{item.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Compliance Trend Chart */}
          <Card className="mb-6 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <TrendingUp className="h-5 w-5" />
                Compliance Score Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={complianceTrend}>
                  <defs>
                    <linearGradient id="complianceGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }} />
                  <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} domain={[70, 85]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      border: "1px solid #374151",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#06b6d4"
                    strokeWidth={2}
                    fill="url(#complianceGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="bg-card">
              <TabsTrigger value="overview" className="data-[state=active]:text-cyan-400">
                Overview
              </TabsTrigger>
              <TabsTrigger value="controls" className="data-[state=active]:text-cyan-400">
                All Controls ({filteredControls.length})
              </TabsTrigger>
              <TabsTrigger value="requirements" className="data-[state=active]:text-cyan-400">
                By Framework
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Card className="mb-6 border-cyan-500/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-cyan-400">
                  <Filter className="h-5 w-5" />
                  Advanced Filters
                  {activeFilterCount > 0 && (
                    <Badge className="bg-cyan-500 text-white">{activeFilterCount} active</Badge>
                  )}
                </CardTitle>
                <div className="flex gap-2">
                  {activeFilterCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-red-400">
                      <X className="mr-2 h-4 w-4" />
                      Clear All
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="border-cyan-500/30"
                  >
                    {showFilters ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            {showFilters && (
              <CardContent>
                <div className="grid grid-cols-4 gap-6">
                  {/* Framework Filter */}
                  <div>
                    <Label className="mb-3 block text-sm font-semibold text-gray-300">Frameworks</Label>
                    <div className="space-y-2">
                      {frameworks.map((framework) => (
                        <div key={framework} className="flex items-center space-x-2">
                          <Checkbox
                            id={`framework-${framework}`}
                            checked={selectedFrameworks.includes(framework)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedFrameworks([...selectedFrameworks, framework])
                              } else {
                                setSelectedFrameworks(selectedFrameworks.filter((f) => f !== framework))
                              }
                            }}
                          />
                          <label
                            htmlFor={`framework-${framework}`}
                            className="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
                          >
                            {framework}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <Label className="mb-3 block text-sm font-semibold text-gray-300">Status</Label>
                    <div className="space-y-2">
                      {statuses.map((status) => (
                        <div key={status} className="flex items-center space-x-2">
                          <Checkbox
                            id={`status-${status}`}
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedStatuses([...selectedStatuses, status])
                              } else {
                                setSelectedStatuses(selectedStatuses.filter((s) => s !== status))
                              }
                            }}
                          />
                          <label
                            htmlFor={`status-${status}`}
                            className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 capitalize"
                          >
                            {status}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Priority Filter */}
                  <div>
                    <Label className="mb-3 block text-sm font-semibold text-gray-300">Priority</Label>
                    <div className="space-y-2">
                      {priorities.map((priority) => (
                        <div key={priority} className="flex items-center space-x-2">
                          <Checkbox
                            id={`priority-${priority}`}
                            checked={selectedPriorities.includes(priority)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedPriorities([...selectedPriorities, priority])
                              } else {
                                setSelectedPriorities(selectedPriorities.filter((p) => p !== priority))
                              }
                            }}
                          />
                          <label
                            htmlFor={`priority-${priority}`}
                            className="text-sm text-gray-400 cursor-pointer hover:text-gray-300 capitalize"
                          >
                            {priority}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <Label className="mb-3 block text-sm font-semibold text-gray-300">Category</Label>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedCategories([...selectedCategories, category])
                              } else {
                                setSelectedCategories(selectedCategories.filter((c) => c !== category))
                              }
                            }}
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm text-gray-400 cursor-pointer hover:text-gray-300"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Search and Date Range */}
                <div className="mt-6 flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                    <Input
                      placeholder="Search by control ID, framework, or title..."
                      className="border-cyan-500/30 pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-48 border-cyan-500/30">
                      <SelectValue placeholder="Date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 days</SelectItem>
                      <SelectItem value="month">Last 30 days</SelectItem>
                      <SelectItem value="quarter">Last 90 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Controls Table */}
          <Card className="border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-cyan-400">Compliance Controls</CardTitle>
              <p className="text-sm text-gray-400">
                {filteredControls.length} controls • Click to expand for evidence and remediation details
              </p>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-sm text-gray-400">
                      <th className="pb-3 font-medium">Control ID</th>
                      <th className="pb-3 font-medium">Framework</th>
                      <th className="pb-3 font-medium">Title</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Priority</th>
                      <th className="pb-3 font-medium">Evidence</th>
                      <th className="pb-3 font-medium">Last Checked</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredControls.map((control) => (
                      <>
                        <tr
                          key={control.id}
                          className="cursor-pointer border-b border-border transition-colors hover:bg-accent/50"
                          onClick={() => setExpandedRow(expandedRow === control.id ? null : control.id)}
                        >
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              {expandedRow === control.id ? (
                                <ChevronDown className="h-4 w-4 text-cyan-400" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500" />
                              )}
                              <span className="font-mono text-cyan-400">{control.control_id}</span>
                            </div>
                          </td>
                          <td className="py-3">
                            <Badge variant="outline" className="border-cyan-500/30">
                              {control.framework}
                            </Badge>
                          </td>
                          <td className="py-3 text-gray-300">{control.title}</td>
                          <td className="py-3">{getStatusBadge(control.status)}</td>
                          <td className="py-3">{getPriorityBadge(control.priority)}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(control.status)}
                              <span className="text-sm text-gray-400">
                                {control.checks_passing}/{control.checks_total} checks
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-sm text-gray-400">
                            {new Date(control.last_checked).toLocaleString()}
                          </td>
                          <td className="py-3">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-cyan-400 hover:text-cyan-300"
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {control.status === "failing" && control.remediation_playbook && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-green-400 hover:text-green-300"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleFix(control.control_id, control.remediation_playbook!)
                                  }}
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              )}
                              {!control.assigned_to && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-yellow-400 hover:text-yellow-300"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                  }}
                                >
                                  <UserPlus className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                        {expandedRow === control.id && (
                          <tr className="border-b border-border bg-accent/20">
                            <td colSpan={8} className="p-4">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="mb-2 font-semibold text-cyan-400">
                                    Evidence ({control.checks_passing} out of {control.checks_total} checks passing)
                                  </h4>
                                  <div className="space-y-2">
                                    {control.evidence.map((evidence, idx) => (
                                      <div key={idx} className="rounded-lg border border-border bg-card p-3">
                                        <div className="mb-1 flex items-center justify-between">
                                          <span className="font-medium text-gray-300">{evidence.source}</span>
                                          <span className="text-xs text-gray-500">
                                            {new Date(evidence.timestamp).toLocaleString()}
                                          </span>
                                        </div>
                                        <div className="text-sm text-gray-400">{evidence.result}</div>
                                        {evidence.details && (
                                          <div className="mt-2 text-xs text-gray-500">{evidence.details}</div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {control.assigned_to && (
                                  <div>
                                    <span className="text-sm text-gray-400">Assigned to: </span>
                                    <Badge variant="outline" className="border-cyan-500/30">
                                      {control.assigned_to}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
