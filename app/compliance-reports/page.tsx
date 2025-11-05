"use client"

import { useState, useEffect } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  Activity,
  Clock,
  Target,
  AlertCircle,
} from "lucide-react"
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface ComplianceData {
  framework: string
  score: number
  trend: number
  passing: number
  failing: number
  nonApplicable: number
  totalControls: number
  lastAudit: string
}

interface ControlViolation {
  id: string
  control: string
  framework: string
  severity: "critical" | "high" | "medium" | "low"
  description: string
  affectedResources: number
  detectedAt: string
  status: "open" | "in_progress" | "resolved"
  assignee?: string
}

interface EvidenceItem {
  id: string
  control: string
  framework: string
  eventType: string
  count: number
  lastEvent: string
  status: "compliant" | "non_compliant" | "warning"
}

export default function ComplianceReportsPage() {
  const [selectedFramework, setSelectedFramework] = useState<string>("all")
  const [timeRange, setTimeRange] = useState<string>("30d")
  const [complianceData, setComplianceData] = useState<ComplianceData[]>([])
  const [violations, setViolations] = useState<ControlViolation[]>([])
  const [evidenceItems, setEvidenceItems] = useState<EvidenceItem[]>([])
  const [trendData, setTrendData] = useState<any[]>([])
  const [isLive, setIsLive] = useState(true)

  // Fetch compliance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complianceRes, violationsRes, evidenceRes, trendRes] = await Promise.all([
          fetch("/api/compliance/frameworks"),
          fetch("/api/compliance/violations"),
          fetch("/api/compliance/evidence"),
          fetch("/api/compliance/trends"),
        ])

        const compliance = await complianceRes.json()
        const violationsData = await violationsRes.json()
        const evidence = await evidenceRes.json()
        const trends = await trendRes.json()

        setComplianceData(compliance)
        setViolations(violationsData)
        setEvidenceItems(evidence)
        setTrendData(trends)
      } catch (error) {
        console.error("Error fetching compliance data:", error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [selectedFramework, timeRange])

  const frameworks = [
    { value: "all", label: "All Frameworks" },
    { value: "iso27001", label: "ISO 27001" },
    { value: "nist", label: "NIST 800-53" },
    { value: "pci", label: "PCI-DSS" },
    { value: "gdpr", label: "GDPR" },
    { value: "hipaa", label: "HIPAA" },
    { value: "cis", label: "CIS Benchmarks" },
    { value: "uae_pdpl", label: "UAE PDPL" },
    { value: "nesa_ias", label: "NESA IAS" },
    { value: "uae_cyber", label: "UAE Cybersecurity Law" },
    { value: "dubai_data", label: "Dubai Data Law" },
  ]

  const filteredData =
    selectedFramework === "all"
      ? complianceData
      : complianceData.filter((d) => d.framework.toLowerCase().includes(selectedFramework))

  const overallScore =
    filteredData.length > 0 ? Math.round(filteredData.reduce((acc, d) => acc + d.score, 0) / filteredData.length) : 0

  const totalPassing = filteredData.reduce((acc, d) => acc + d.passing, 0)
  const totalFailing = filteredData.reduce((acc, d) => acc + d.failing, 0)
  const totalControls = filteredData.reduce((acc, d) => acc + d.totalControls, 0)

  const criticalViolations = violations.filter((v) => v.severity === "critical" && v.status === "open").length
  const openViolations = violations.filter((v) => v.status === "open").length

  const COLORS = {
    passing: "#10b981",
    failing: "#ef4444",
    warning: "#f59e0b",
    nonApplicable: "#6b7280",
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <SidebarNav />

      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-foreground">Compliance Reports</h1>
                {isLive && (
                  <Badge className="animate-pulse bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                    <Activity className="mr-1 h-3 w-3" />
                    LIVE
                  </Badge>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                Continuous compliance monitoring and evidence generation
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {frameworks.map((fw) => (
                    <SelectItem key={fw.value} value={fw.value}>
                      {fw.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="bg-cyan-600 hover:bg-cyan-700">
                <Download className="mr-2 h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Overall Compliance Score */}
          <div className="mb-8 grid gap-6 md:grid-cols-4">
            <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Score</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-4xl font-bold text-cyan-400">{overallScore}%</h3>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      +2.3%
                    </Badge>
                  </div>
                </div>
                <Target className="h-12 w-12 text-cyan-400 opacity-50" />
              </div>
              <Progress value={overallScore} className="mt-4 h-2" />
            </Card>

            <Card className="border-green-500/20 bg-gradient-to-br from-green-500/10 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Passing Controls</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-4xl font-bold text-green-400">{totalPassing}</h3>
                    <span className="text-sm text-muted-foreground">/ {totalControls}</span>
                  </div>
                </div>
                <CheckCircle2 className="h-12 w-12 text-green-400 opacity-50" />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                {Math.round((totalPassing / totalControls) * 100)}% compliance rate
              </p>
            </Card>

            <Card className="border-red-500/20 bg-gradient-to-br from-red-500/10 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Critical Violations</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-4xl font-bold text-red-400">{criticalViolations}</h3>
                    <Badge className="bg-red-500/20 text-red-400 border-red-500/50 animate-pulse">URGENT</Badge>
                  </div>
                </div>
                <AlertCircle className="h-12 w-12 text-red-400 opacity-50" />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{openViolations} total open violations</p>
            </Card>

            <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-transparent p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Evidence Items</p>
                  <div className="mt-2 flex items-baseline gap-2">
                    <h3 className="text-4xl font-bold text-yellow-400">{evidenceItems.length}</h3>
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                      <Activity className="mr-1 h-3 w-3 animate-pulse" />
                      LIVE
                    </Badge>
                  </div>
                </div>
                <FileText className="h-12 w-12 text-yellow-400 opacity-50" />
              </div>
              <p className="mt-4 text-xs text-muted-foreground">Auto-generated from SIEM data</p>
            </Card>
          </div>

          {/* Framework Compliance Cards */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Framework Compliance Status</h2>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                <Clock className="mr-1 h-3 w-3" />
                Updated 2s ago
              </Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredData.map((framework) => (
                <Card
                  key={framework.framework}
                  className="border-border/50 p-6 hover:border-cyan-500/50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg text-foreground">{framework.framework}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Last audit: {framework.lastAudit}</p>
                    </div>
                    <Badge
                      className={framework.trend >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}
                    >
                      {framework.trend >= 0 ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                      {Math.abs(framework.trend)}%
                    </Badge>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-3xl font-bold text-cyan-400">{framework.score}%</span>
                      <span className="text-sm text-muted-foreground">compliance</span>
                    </div>
                    <Progress value={framework.score} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 text-green-400">
                        <CheckCircle2 className="h-4 w-4" />
                        <span className="font-bold">{framework.passing}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Passing</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-red-400">
                        <XCircle className="h-4 w-4" />
                        <span className="font-bold">{framework.failing}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Failing</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 text-gray-400">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="font-bold">{framework.nonApplicable}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">N/A</p>
                    </div>
                  </div>

                  <Button className="w-full mt-4 bg-transparent" variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Evidence Pack
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Compliance Trend Chart */}
          <div className="mb-8 grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Compliance Score Trend</h2>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 animate-pulse">
                  <Activity className="mr-1 h-3 w-3" />
                  LIVE
                </Badge>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="iso27001" stroke="#06b6d4" strokeWidth={2} dot={{ fill: "#06b6d4" }} />
                  <Line type="monotone" dataKey="nist" stroke="#10b981" strokeWidth={2} dot={{ fill: "#10b981" }} />
                  <Line type="monotone" dataKey="pci" stroke="#f59e0b" strokeWidth={2} dot={{ fill: "#f59e0b" }} />
                  <Line type="monotone" dataKey="gdpr" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: "#8b5cf6" }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="border-border/50 p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Control Status Distribution</h2>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: "Passing", value: totalPassing, color: COLORS.passing },
                      { name: "Failing", value: totalFailing, color: COLORS.failing },
                      {
                        name: "Non-Applicable",
                        value: totalControls - totalPassing - totalFailing,
                        color: COLORS.nonApplicable,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {[
                      { name: "Passing", value: totalPassing, color: COLORS.passing },
                      { name: "Failing", value: totalFailing, color: COLORS.failing },
                      {
                        name: "Non-Applicable",
                        value: totalControls - totalPassing - totalFailing,
                        color: COLORS.nonApplicable,
                      },
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#000" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #333" }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Active Violations */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Active Compliance Violations</h2>
              <Badge className="bg-red-500/20 text-red-400 border-red-500/50 animate-pulse">
                {openViolations} OPEN
              </Badge>
            </div>
            <Card className="border-border/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50 bg-muted/20">
                    <tr>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Control ID</th>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Framework</th>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Description</th>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Severity</th>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Resources</th>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Status</th>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Detected</th>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {violations.slice(0, 10).map((violation) => (
                      <tr key={violation.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                        <td className="p-4">
                          <code className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
                            {violation.control}
                          </code>
                        </td>
                        <td className="p-4 text-sm text-foreground">{violation.framework}</td>
                        <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{violation.description}</td>
                        <td className="p-4">
                          <Badge
                            className={
                              violation.severity === "critical"
                                ? "bg-red-500/20 text-red-400 border-red-500/50"
                                : violation.severity === "high"
                                  ? "bg-orange-500/20 text-orange-400 border-orange-500/50"
                                  : violation.severity === "medium"
                                    ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                    : "bg-blue-500/20 text-blue-400 border-blue-500/50"
                            }
                          >
                            {violation.severity.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 text-sm text-foreground">{violation.affectedResources}</td>
                        <td className="p-4">
                          <Badge
                            className={
                              violation.status === "open"
                                ? "bg-red-500/20 text-red-400 border-red-500/50"
                                : violation.status === "in_progress"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                  : "bg-green-500/20 text-green-400 border-green-500/50"
                            }
                          >
                            {violation.status.replace("_", " ").toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4 text-xs text-muted-foreground">{violation.detectedAt}</td>
                        <td className="p-4">
                          <Button size="sm" variant="outline">
                            Remediate
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Evidence Generation */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-foreground">Auto-Generated Evidence</h2>
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">
                <Activity className="mr-1 h-3 w-3 animate-pulse" />
                {evidenceItems.length} ITEMS
              </Badge>
            </div>
            <Card className="border-border/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border/50 bg-muted/20">
                    <tr>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Control</th>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Framework</th>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Event Type</th>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Event Count</th>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Last Event</th>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Status</th>
                      <th className="p-4 text-left text-xs font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {evidenceItems.slice(0, 10).map((item) => (
                      <tr key={item.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                        <td className="p-4">
                          <code className="text-xs text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">{item.control}</code>
                        </td>
                        <td className="p-4 text-sm text-foreground">{item.framework}</td>
                        <td className="p-4 text-sm text-muted-foreground">{item.eventType}</td>
                        <td className="p-4 text-sm text-foreground font-mono">{item.count.toLocaleString()}</td>
                        <td className="p-4 text-xs text-muted-foreground">{item.lastEvent}</td>
                        <td className="p-4">
                          <Badge
                            className={
                              item.status === "compliant"
                                ? "bg-green-500/20 text-green-400 border-green-500/50"
                                : item.status === "warning"
                                  ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
                                  : "bg-red-500/20 text-red-400 border-red-500/50"
                            }
                          >
                            {item.status.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button size="sm" variant="outline">
                            <Download className="mr-2 h-3 w-3" />
                            Export
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
