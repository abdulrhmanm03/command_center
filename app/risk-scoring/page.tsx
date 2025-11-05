"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertTriangle,
  Shield,
  Brain,
  TrendingUp,
  Activity,
  Zap,
  CheckCircle2,
  Search,
  Filter,
  ThumbsUp,
  ThumbsDown,
  X,
  Info,
  Download,
  Lightbulb,
  Server,
  Cloud,
} from "lucide-react"
import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts"

const riskAssessments = [
  {
    id: "ra-001",
    asset: "Production Database Server",
    assetType: "Infrastructure",
    threatSource: "Advanced Persistent Threat",
    vulnerability: "Unpatched SQL Server (CVE-2024-1234)",
    likelihood: "High",
    likelihoodScore: 4,
    impact: "Critical",
    impactScore: 5,
    inherentRisk: 95,
    controlMaturity: 2,
    exposure: 4,
    controlEffectiveness: 30,
    residualRisk: 67,
    nistControl: "SI-2",
    nistControlName: "Flaw Remediation",
    aiRmfFunction: "Manage",
    recommendation: "Apply security patch immediately and implement WAF rules to reduce attack surface",
  },
  {
    id: "ra-002",
    asset: "Email Gateway",
    assetType: "Network",
    threatSource: "Phishing Campaign",
    vulnerability: "Insufficient email filtering",
    likelihood: "High",
    likelihoodScore: 4,
    impact: "High",
    impactScore: 4,
    inherentRisk: 82,
    controlMaturity: 3,
    exposure: 3,
    controlEffectiveness: 45,
    residualRisk: 45,
    nistControl: "SC-7",
    nistControlName: "Boundary Protection",
    aiRmfFunction: "Govern",
    recommendation:
      "Enhance email security controls with advanced threat protection and conduct user awareness training",
  },
  {
    id: "ra-003",
    asset: "User Workstations",
    assetType: "Endpoint",
    threatSource: "Malware Distribution",
    vulnerability: "Outdated antivirus signatures",
    likelihood: "Medium",
    likelihoodScore: 3,
    impact: "High",
    impactScore: 4,
    inherentRisk: 68,
    controlMaturity: 2,
    exposure: 3,
    controlEffectiveness: 35,
    residualRisk: 44,
    nistControl: "SI-3",
    nistControlName: "Malicious Code Protection",
    aiRmfFunction: "Measure",
    recommendation:
      "Update endpoint protection to latest version and enable real-time scanning with behavioral analysis",
  },
  {
    id: "ra-004",
    asset: "Web Application",
    assetType: "Application",
    threatSource: "SQL Injection Attack",
    vulnerability: "Improper input validation",
    likelihood: "Medium",
    likelihoodScore: 3,
    impact: "High",
    impactScore: 4,
    inherentRisk: 71,
    controlMaturity: 3,
    exposure: 2,
    controlEffectiveness: 50,
    residualRisk: 36,
    nistControl: "SI-10",
    nistControlName: "Information Input Validation",
    aiRmfFunction: "Manage",
    recommendation: "Implement parameterized queries, input sanitization, and deploy web application firewall",
  },
  {
    id: "ra-005",
    asset: "Cloud Storage",
    assetType: "Infrastructure",
    threatSource: "Data Breach",
    vulnerability: "Misconfigured access controls",
    likelihood: "High",
    likelihoodScore: 4,
    impact: "Critical",
    impactScore: 5,
    inherentRisk: 92,
    controlMaturity: 2,
    exposure: 4,
    controlEffectiveness: 25,
    residualRisk: 69,
    nistControl: "AC-3",
    nistControlName: "Access Enforcement",
    aiRmfFunction: "Govern",
    recommendation: "Review and remediate cloud storage permissions, implement least privilege access model",
  },
]

const nistControls = {
  "SI-2": {
    name: "Flaw Remediation",
    family: "System and Information Integrity",
    description: "Identify, report, and correct information system flaws in a timely manner",
    mappedAssets: ["Production Database Server"],
  },
  "SC-7": {
    name: "Boundary Protection",
    family: "System and Communications Protection",
    description: "Monitor and control communications at external boundaries and key internal boundaries",
    mappedAssets: ["Email Gateway"],
  },
  "SI-3": {
    name: "Malicious Code Protection",
    family: "System and Information Integrity",
    description: "Implement malicious code protection mechanisms at information system entry and exit points",
    mappedAssets: ["User Workstations"],
  },
  "SI-10": {
    name: "Information Input Validation",
    family: "System and Information Integrity",
    description: "Check the validity of information inputs to the information system",
    mappedAssets: ["Web Application"],
  },
  "AC-3": {
    name: "Access Enforcement",
    family: "Access Control",
    description: "Enforce approved authorizations for logical access to information and system resources",
    mappedAssets: ["Cloud Storage"],
  },
}

const llmModelRisks = [
  {
    model: "GPT-4-Turbo",
    type: "SaaS",
    inherentRisk: 88,
    residualRisk: 52,
    vulnerability: "Prompt Injection",
    recommendation: "Add input sanitisation & context isolation",
    confidence: 87,
  },
  {
    model: "Internal LLM",
    type: "On-Prem",
    inherentRisk: 73,
    residualRisk: 44,
    vulnerability: "Model Drift",
    recommendation: "Implement continuous evaluation pipeline",
    confidence: 82,
  },
  {
    model: "Claude-3-Opus",
    type: "SaaS",
    inherentRisk: 79,
    residualRisk: 48,
    vulnerability: "Data Leakage",
    recommendation: "Enable data residency controls & audit logging",
    confidence: 85,
  },
]

const missingControls = [
  { control: "AC-17", name: "Remote Access", priority: "High" },
  { control: "IR-4", name: "Incident Handling", priority: "Critical" },
  { control: "AU-6", name: "Audit Review", priority: "Medium" },
  { control: "CM-7", name: "Least Functionality", priority: "High" },
]

const nist80030Phases = [
  {
    phase: "Prepare",
    status: "Complete",
    progress: 100,
    aiSuggestion: "Review stakeholder requirements quarterly",
  },
  {
    phase: "Conduct Assessment",
    status: "In Progress",
    progress: 75,
    aiSuggestion: "Prioritize critical infrastructure assets",
  },
  {
    phase: "Communicate Results",
    status: "Pending",
    progress: 30,
    aiSuggestion: "Generate automated executive summary",
  },
  {
    phase: "Maintain Assessment",
    status: "Scheduled",
    progress: 0,
    aiSuggestion: "Schedule monthly risk re-scoring",
  },
]

export default function RiskScoringPage() {
  const [riskCounts, setRiskCounts] = useState({
    critical: 2,
    high: 2,
    medium: 1,
    low: 0,
  })

  const [assetTypeFilter, setAssetTypeFilter] = useState<string>("all")
  const [threatSourceFilter, setThreatSourceFilter] = useState<string>("all")
  const [impactFilter, setImpactFilter] = useState<string>("all")
  const [controlFamilyFilter, setControlFamilyFilter] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const [selectedControl, setSelectedControl] = useState<string | null>(null)
  const [selectedRiskSegment, setSelectedRiskSegment] = useState<string | null>(null)
  const [showControlModal, setShowControlModal] = useState(false)
  const [showRiskModal, setShowRiskModal] = useState(false)

  const [showAboutModal, setShowAboutModal] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setRiskCounts({
        critical: Math.floor(Math.random() * 3) + 1,
        high: Math.floor(Math.random() * 3) + 2,
        medium: Math.floor(Math.random() * 2) + 1,
        low: Math.floor(Math.random() * 2),
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const filteredRisks = riskAssessments.filter((risk) => {
    if (assetTypeFilter !== "all" && risk.assetType !== assetTypeFilter) return false
    if (threatSourceFilter !== "all" && risk.threatSource !== threatSourceFilter) return false
    if (impactFilter !== "all" && risk.impact !== impactFilter) return false
    if (controlFamilyFilter !== "all") {
      const controlFamily = nistControls[risk.nistControl as keyof typeof nistControls]?.family
      if (controlFamily !== controlFamilyFilter) return false
    }
    if (searchQuery && !risk.asset.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const displayedRisks = filteredRisks

  const handleExportCSV = () => {
    const csvContent = [
      ["Asset", "Threat Source", "Inherent Risk", "Residual Risk", "NIST Control", "Recommendation"].join(","),
      ...displayedRisks.map((risk) =>
        [
          risk.asset,
          risk.threatSource,
          risk.inherentRisk,
          risk.residualRisk,
          risk.nistControl,
          `"${risk.recommendation}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "llm-risk-assessment.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const pieData = [
    { name: "Critical", value: riskCounts.critical, color: "#ef4444" },
    { name: "High", value: riskCounts.high, color: "#f97316" },
    { name: "Medium", value: riskCounts.medium, color: "#eab308" },
    { name: "Low", value: riskCounts.low, color: "#22c55e" },
  ]

  const controlData = [
    { control: "SI-2", count: 1, color: "#06b6d4" },
    { control: "SC-7", count: 1, color: "#8b5cf6" },
    { control: "SI-3", count: 1, color: "#ec4899" },
    { control: "SI-10", count: 1, color: "#f59e0b" },
    { control: "AC-3", count: 1, color: "#10b981" },
  ]

  const handlePieClick = (data: any) => {
    setSelectedRiskSegment(data.name)
    setShowRiskModal(true)
  }

  const handleBarClick = (data: any) => {
    setSelectedControl(data.control)
    setShowControlModal(true)
  }

  const totalRisks = riskCounts.critical + riskCounts.high + riskCounts.medium + riskCounts.low

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-8 rounded-xl bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 p-6 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-3">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    LLM Risk Scoring
                  </h1>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-purple-500/20"
                    onClick={() => setShowAboutModal(true)}
                  >
                    <Info className="h-5 w-5 text-purple-400" />
                  </Button>
                </div>
                <p className="text-muted-foreground mt-1">AI-Powered Risk Assessment</p>
                <p className="text-sm text-cyan-400 mt-2 leading-relaxed">
                  Evaluate and prioritise LLM-related risks across infrastructure, data pipelines, and AI assets, mapped
                  to NIST 800-53 controls and AI RMF functions.
                </p>
              </div>
            </div>
          </div>

          <Card className="mb-6 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400">
                <Filter className="h-5 w-5" />
                Filter & Drill-Down
              </CardTitle>
              <CardDescription>
                Sort risks by asset type, threat source, impact level, or NIST control family
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Asset Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Asset Types</SelectItem>
                    <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                    <SelectItem value="Network">Network</SelectItem>
                    <SelectItem value="Endpoint">Endpoint</SelectItem>
                    <SelectItem value="Application">Application</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={threatSourceFilter} onValueChange={setThreatSourceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Threat Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Threats</SelectItem>
                    <SelectItem value="Advanced Persistent Threat">APT</SelectItem>
                    <SelectItem value="Phishing Campaign">Phishing</SelectItem>
                    <SelectItem value="Malware Distribution">Malware</SelectItem>
                    <SelectItem value="SQL Injection Attack">SQL Injection</SelectItem>
                    <SelectItem value="Data Breach">Data Breach</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={impactFilter} onValueChange={setImpactFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Impact Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Impacts</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={controlFamilyFilter} onValueChange={setControlFamilyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Control Family" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Families</SelectItem>
                    <SelectItem value="System and Information Integrity">SI - System Integrity</SelectItem>
                    <SelectItem value="System and Communications Protection">SC - Communications</SelectItem>
                    <SelectItem value="Access Control">AC - Access Control</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setAssetTypeFilter("all")
                    setThreatSourceFilter("all")
                    setImpactFilter("all")
                    setControlFamilyFilter("all")
                    setSearchQuery("")
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card className="border-red-500/50 bg-gradient-to-br from-red-500/10 to-red-500/5 hover:border-red-500 transition-all hover:shadow-lg hover:shadow-red-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Critical Risks</CardTitle>
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-red-400 mb-2">{riskCounts.critical}</div>
                <Progress value={95} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">Risk Level: 90-100</p>
              </CardContent>
            </Card>
            <Card className="border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-orange-500/5 hover:border-orange-500 transition-all hover:shadow-lg hover:shadow-orange-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">High Risks</CardTitle>
                  <TrendingUp className="h-5 w-5 text-orange-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-orange-400 mb-2">{riskCounts.high}</div>
                <Progress value={80} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">Risk Level: 70-89</p>
              </CardContent>
            </Card>
            <Card className="border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 hover:border-yellow-500 transition-all hover:shadow-lg hover:shadow-yellow-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Medium Risks</CardTitle>
                  <Activity className="h-5 w-5 text-yellow-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-yellow-400 mb-2">{riskCounts.medium}</div>
                <Progress value={55} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">Risk Level: 40-69</p>
              </CardContent>
            </Card>
            <Card className="border-green-500/50 bg-gradient-to-br from-green-500/10 to-green-500/5 hover:border-green-500 transition-all hover:shadow-lg hover:shadow-green-500/20">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Low Risks</CardTitle>
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-green-400 mb-2">{riskCounts.low}</div>
                <Progress value={25} className="h-2 mb-2" />
                <p className="text-xs text-muted-foreground">Risk Level: 0-39</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <Card className="border-2 border-purple-500/50 bg-gradient-to-br from-purple-500/10 to-pink-500/10 shadow-xl shadow-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-400 text-xl">
                  <Activity className="h-6 w-6" />
                  Risk Distribution
                </CardTitle>
                <CardDescription className="text-base">
                  Click segments to drill down • Current risk levels across all assets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={8}
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      onClick={handlePieClick}
                      className="cursor-pointer"
                      strokeWidth={0}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "2px solid #8b5cf6",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <p className="text-5xl font-bold text-purple-400">{totalRisks}</p>
                  <p className="text-base font-semibold text-muted-foreground">Total Risks</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-500/10 to-teal-500/10 shadow-xl shadow-cyan-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-cyan-400 text-xl">
                  <Zap className="h-6 w-6" />
                  NIST Control Coverage
                </CardTitle>
                <CardDescription className="text-base">
                  Click bars to view control details • Most frequently mapped security controls
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={controlData} onClick={handleBarClick}>
                    <XAxis dataKey="control" stroke="#888" style={{ fontSize: "14px", fontWeight: "bold" }} />
                    <YAxis stroke="#888" style={{ fontSize: "14px", fontWeight: "bold" }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1a1a1a",
                        border: "2px solid #06b6d4",
                        borderRadius: "8px",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    />
                    <Bar dataKey="count" radius={[12, 12, 0, 0]} className="cursor-pointer" strokeWidth={0}>
                      {controlData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>

                <div className="mt-6 pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold text-orange-400 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Top Missing Controls
                  </h4>
                  <div className="space-y-2">
                    {missingControls.map((control) => (
                      <div
                        key={control.control}
                        className="flex items-center justify-between p-2 rounded-lg bg-orange-500/10 border border-orange-500/30"
                      >
                        <div>
                          <span className="font-mono font-semibold text-sm text-foreground">{control.control}</span>
                          <span className="text-xs text-muted-foreground ml-2">{control.name}</span>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            control.priority === "Critical"
                              ? "border-red-500 text-red-400"
                              : control.priority === "High"
                                ? "border-orange-500 text-orange-400"
                                : "border-yellow-500 text-yellow-400"
                          }
                        >
                          {control.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 border-teal-500/30 bg-gradient-to-br from-teal-500/10 to-cyan-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-400">
                <Shield className="h-5 w-5" />
                NIST 800-30 Risk Assessment Process
              </CardTitle>
              <CardDescription>Guide for Conducting Risk Assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                {nist80030Phases.map((phase) => (
                  <div
                    key={phase.phase}
                    className="space-y-2 p-4 rounded-lg bg-background/50 border border-border hover:border-teal-500/50 transition-all group"
                    title={`${phase.phase}: ${phase.status}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-foreground">{phase.phase}</span>
                      <Badge
                        variant={phase.progress === 100 ? "default" : "secondary"}
                        className={phase.progress === 100 ? "bg-green-500/20 text-green-400 border-green-500/50" : ""}
                      >
                        {phase.status}
                      </Badge>
                    </div>
                    <Progress value={phase.progress} className="h-3" />
                    <p className="text-xs text-muted-foreground">{phase.progress}% Complete</p>

                    <div className="mt-3 p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                      <p className="text-xs font-semibold text-purple-400 mb-1 flex items-center gap-1">
                        <Lightbulb className="h-3 w-3" />
                        AI Suggestion
                      </p>
                      <p className="text-xs text-foreground">{phase.aiSuggestion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-pink-500/30 bg-gradient-to-br from-pink-500/5 to-purple-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-pink-400">
                <Server className="h-5 w-5" />
                AI Model-Specific Risks
              </CardTitle>
              <CardDescription>LLM deployment risks across SaaS and on-premise infrastructure</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {llmModelRisks.map((model) => (
                  <div
                    key={model.model}
                    className="rounded-xl border-2 border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-purple-500/10 p-4 hover:border-pink-500 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-pink-500/20">
                          {model.type === "SaaS" ? (
                            <Cloud className="h-5 w-5 text-pink-400" />
                          ) : (
                            <Server className="h-5 w-5 text-purple-400" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-lg text-pink-400">{model.model}</h4>
                          <Badge variant="outline" className="text-xs mt-1">
                            {model.type}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="border-red-500 text-red-400 bg-red-500/10">
                          Inherent: {model.inherentRisk}
                        </Badge>
                        <Badge variant="outline" className="border-green-500 text-green-400 bg-green-500/10">
                          Residual: {model.residualRisk}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2 mb-3">
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <p className="text-xs font-semibold text-orange-400 mb-1">Vulnerability</p>
                        <p className="text-sm text-foreground font-medium">{model.vulnerability}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-background/50 border border-border">
                        <p className="text-xs font-semibold text-cyan-400 mb-1">Confidence Score</p>
                        <div className="flex items-center gap-2">
                          <Progress value={model.confidence} className="h-2 flex-1" />
                          <span className="text-sm font-bold text-cyan-400">{model.confidence}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30">
                      <p className="text-xs font-semibold text-purple-400 mb-1 flex items-center gap-1">
                        <Brain className="h-3 w-3" />
                        AI Recommendation
                      </p>
                      <p className="text-sm text-foreground">{model.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/30 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-purple-400 text-xl">
                    <Brain className="h-6 w-6" />
                    AI-Powered Risk Assessments
                  </CardTitle>
                  <CardDescription>
                    LLM-analyzed threats with NIST 800-53 control mappings • Showing {displayedRisks.length} of{" "}
                    {riskAssessments.length} risks
                  </CardDescription>
                </div>
                <Button onClick={handleExportCSV} variant="outline" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {displayedRisks.length === 0 ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No LLM risks found</h3>
                  <p className="text-sm text-muted-foreground mb-4">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayedRisks.map((assessment) => (
                    <div
                      key={assessment.id}
                      className={`rounded-xl border-2 p-5 transition-all hover:shadow-xl ${
                        /* Removed extra border glow for search results */
                        assessment.inherentRisk >= 90
                          ? "border-red-500/50 bg-gradient-to-br from-red-500/10 to-red-500/5 hover:border-red-500 hover:shadow-red-500/20"
                          : assessment.inherentRisk >= 70
                            ? "border-orange-500/50 bg-gradient-to-br from-orange-500/10 to-orange-500/5 hover:border-orange-500 hover:shadow-orange-500/20"
                            : "border-yellow-500/50 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 hover:border-yellow-500 hover:shadow-yellow-500/20"
                      }`}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-bold text-cyan-400">{assessment.asset}</h3>
                            <Badge
                              variant="outline"
                              className="text-xs bg-purple-500/10 border-purple-500 text-purple-400"
                            >
                              {assessment.assetType}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-base font-bold px-3 py-1 ${
                                assessment.inherentRisk >= 90
                                  ? "border-red-500 text-red-400 bg-red-500/10"
                                  : assessment.inherentRisk >= 70
                                    ? "border-orange-500 text-orange-400 bg-orange-500/10"
                                    : "border-yellow-500 text-yellow-400 bg-yellow-500/10"
                              }`}
                            >
                              Inherent: {assessment.inherentRisk}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-base font-bold px-3 py-1 border-green-500 text-green-400 bg-green-500/10"
                            >
                              Residual: {assessment.residualRisk}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">{assessment.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <AlertTriangle
                            className={`h-7 w-7 ${
                              assessment.inherentRisk >= 90
                                ? "text-red-400"
                                : assessment.inherentRisk >= 70
                                  ? "text-orange-400"
                                  : "text-yellow-400"
                            }`}
                          />
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3 mb-4">
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <p className="text-xs font-semibold text-purple-400 mb-1">Threat Source</p>
                          <p className="text-sm text-foreground font-medium">{assessment.threatSource}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <p className="text-xs font-semibold text-pink-400 mb-1">Vulnerability</p>
                          <p className="text-sm text-foreground font-medium">{assessment.vulnerability}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <p className="text-xs font-semibold text-cyan-400 mb-1">AI RMF Function</p>
                          <Badge variant="secondary" className="mt-1">
                            {assessment.aiRmfFunction}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3 mb-4">
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <p className="text-xs font-semibold text-orange-400 mb-2">Control Maturity</p>
                          <Progress value={assessment.controlMaturity * 20} className="h-2 mb-1" />
                          <p className="text-xs text-muted-foreground">Level {assessment.controlMaturity}/5</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <p className="text-xs font-semibold text-cyan-400 mb-2">Exposure</p>
                          <Progress value={assessment.exposure * 20} className="h-2 mb-1" />
                          <p className="text-xs text-muted-foreground">Level {assessment.exposure}/5</p>
                        </div>
                        <div className="p-3 rounded-lg bg-background/50 border border-border">
                          <p className="text-xs font-semibold text-green-400 mb-2">Control Effectiveness</p>
                          <Progress value={assessment.controlEffectiveness} className="h-2 mb-1" />
                          <p className="text-xs text-muted-foreground">{assessment.controlEffectiveness}%</p>
                        </div>
                      </div>

                      <div className="rounded-lg bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border border-teal-500/30 p-4">
                        <p className="mb-2 text-sm font-bold text-teal-400 flex items-center gap-2">
                          <Shield className="h-4 w-4" />
                          NIST 800-53 Control
                        </p>
                        <p className="mb-3 text-base font-mono font-bold text-foreground">
                          {assessment.nistControl} - {assessment.nistControlName}
                        </p>
                        <p className="text-xs font-bold text-purple-400 mb-1 flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          AI Recommendation
                          <Badge variant="outline" className="ml-auto border-cyan-500 text-cyan-400 bg-cyan-500/10">
                            Confidence: {Math.floor(Math.random() * 15) + 80}%
                          </Badge>
                        </p>
                        <p className="text-sm text-foreground leading-relaxed mb-3">{assessment.recommendation}</p>

                        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                          <p className="text-xs text-muted-foreground mr-2">Was this helpful?</p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs hover:bg-green-500/20 hover:border-green-500 bg-transparent"
                          >
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            Yes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs hover:bg-red-500/20 hover:border-red-500 bg-transparent"
                          >
                            <ThumbsDown className="h-3 w-3 mr-1" />
                            No
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Dialog open={showControlModal} onOpenChange={setShowControlModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-cyan-400">
                  <Shield className="h-5 w-5" />
                  NIST Control: {selectedControl}
                </DialogTitle>
                <DialogDescription>
                  {selectedControl && nistControls[selectedControl as keyof typeof nistControls]?.name}
                </DialogDescription>
              </DialogHeader>
              {selectedControl && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                    <p className="text-sm font-semibold text-cyan-400 mb-2">Control Family</p>
                    <p className="text-foreground">
                      {nistControls[selectedControl as keyof typeof nistControls]?.family}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                    <p className="text-sm font-semibold text-purple-400 mb-2">Description</p>
                    <p className="text-foreground">
                      {nistControls[selectedControl as keyof typeof nistControls]?.description}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                    <p className="text-sm font-semibold text-orange-400 mb-2">Mapped Assets</p>
                    <div className="space-y-2">
                      {nistControls[selectedControl as keyof typeof nistControls]?.mappedAssets.map((asset) => (
                        <Badge key={asset} variant="outline" className="mr-2">
                          {asset}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-sm font-semibold text-green-400 mb-2 flex items-center gap-2">
                      <Brain className="h-4 w-4" />
                      AI Recommendations
                    </p>
                    <p className="text-foreground text-sm">
                      Implement automated patch management system with testing protocols. Deploy web application
                      firewall with custom rules. Establish continuous monitoring for control effectiveness.
                    </p>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={showRiskModal} onOpenChange={setShowRiskModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-purple-400">
                  <Activity className="h-5 w-5" />
                  {selectedRiskSegment} Risk Assets
                </DialogTitle>
                <DialogDescription>
                  Detailed breakdown of {selectedRiskSegment?.toLowerCase()} risk level assets
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {riskAssessments
                  .filter((risk) => {
                    if (selectedRiskSegment === "Critical") return risk.inherentRisk >= 90
                    if (selectedRiskSegment === "High") return risk.inherentRisk >= 70 && risk.inherentRisk < 90
                    if (selectedRiskSegment === "Medium") return risk.inherentRisk >= 40 && risk.inherentRisk < 70
                    return risk.inherentRisk < 40
                  })
                  .map((risk) => (
                    <div key={risk.id} className="p-4 rounded-lg border border-border bg-background/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-cyan-400">{risk.asset}</h4>
                        <Badge variant="outline" className="text-orange-400 border-orange-500">
                          Score: {risk.inherentRisk}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{risk.vulnerability}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {risk.nistControl}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {risk.assetType}
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAboutModal} onOpenChange={setShowAboutModal}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-purple-400">
                  <Info className="h-5 w-5" />
                  About LLM Risk Scoring
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <h4 className="font-semibold text-purple-400 mb-2">What is LLM Risk?</h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    LLM (Large Language Model) risks include data leakage, prompt injection, model poisoning,
                    adversarial attacks, bias amplification, and unauthorized access to sensitive information through AI
                    systems.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                  <h4 className="font-semibold text-cyan-400 mb-2">How Scoring Works</h4>
                  <p className="text-sm text-foreground leading-relaxed mb-2">
                    <strong>Inherent Risk</strong> = Likelihood × Impact (before controls)
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    <strong>Residual Risk</strong> = Inherent Risk × (1 - Control Effectiveness ÷ 100)
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Control effectiveness is calculated based on maturity level and exposure reduction.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/30">
                  <h4 className="font-semibold text-orange-400 mb-2">Why NIST Mapping Matters</h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    NIST 800-53 controls provide a standardized framework for security and privacy controls. Mapping
                    risks to NIST controls ensures compliance, enables consistent risk management, and facilitates
                    communication with stakeholders and auditors.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
