"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import {
  AlertTriangle,
  ArrowLeft,
  Shield,
  Clock,
  User,
  Activity,
  FileText,
  Target,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Network,
  Lock,
  MessageSquare,
  Search,
  Users,
  Send,
  Hash,
  Globe,
  ExternalLink,
  Server,
  Monitor,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingUp,
  Zap,
  Brain,
  UserCheck,
  GitBranch,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const incidentId = params.id as string

  const [incident, setIncident] = useState<any>(null)
  const [liveData, setLiveData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [expandedEntity, setExpandedEntity] = useState<string | null>(null)

  const [assignedTo, setAssignedTo] = useState("Sarah Chen")
  const [workflowStage, setWorkflowStage] = useState("Investigation")

  const [timelineEvents, setTimelineEvents] = useState<any[]>([])
  const [timelineLoading, setTimelineLoading] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [newIOC, setNewIOC] = useState("")
  const [iocType, setIOCType] = useState("ip")
  const [comments, setComments] = useState<any[]>([])
  const [iocs, setIOCs] = useState<any[]>([
    { type: "ip", value: "192.168.1.100", threat: "high", source: "VirusTotal" },
    { type: "ip", value: "10.0.0.45", threat: "medium", source: "AbuseIPDB" },
  ])

  const [investigationProgress, setInvestigationProgress] = useState(65)
  const [triageSteps, setTriageSteps] = useState([
    {
      id: 1,
      step: "Initial Detection",
      status: "completed",
      timestamp: "2025-11-03T10:11:55Z",
      analyst: "Sarah Chen",
      action: "Automated alert triggered by SIEM correlation rule",
      findings: "Multiple failed login attempts detected from 185.199.108.153",
      duration: "2m",
    },
    {
      id: 2,
      step: "Threat Intelligence Enrichment",
      status: "completed",
      timestamp: "2025-11-03T10:14:22Z",
      analyst: "Sarah Chen",
      action: "Queried VirusTotal, AbuseIPDB, and AlienVault OTX for IOC reputation",
      findings: "Source IP flagged by 12/89 vendors. Known APT28 infrastructure. High confidence malicious.",
      duration: "5m",
      enrichment: {
        virusTotal: { malicious: 12, suspicious: 8, clean: 69 },
        abuseIPDB: { abuseScore: 95, reports: 234 },
        alienVault: { pulses: 8, tags: ["APT28", "Fancy Bear", "Credential Stuffing"] },
      },
    },
    {
      id: 3,
      step: "User Account Analysis",
      status: "completed",
      timestamp: "2025-11-03T10:19:45Z",
      analyst: "Sarah Chen",
      action: "Analyzed admin@company.com account activity and privileges",
      findings:
        "Target account has Domain Admin privileges. No successful logins detected. Account locked after 10 failed attempts.",
      duration: "8m",
    },
    {
      id: 4,
      step: "Network Traffic Analysis",
      status: "completed",
      timestamp: "2025-11-03T10:27:33Z",
      analyst: "Michael Rodriguez",
      action: "Deep packet inspection and flow analysis of attack traffic",
      findings:
        "Attack originated from TOR exit nodes. 14 unique source IPs identified. Coordinated botnet activity confirmed.",
      duration: "12m",
      escalation: "Escalated to Threat Hunter for advanced analysis",
    },
    {
      id: 5,
      step: "Lateral Movement Check",
      status: "completed",
      timestamp: "2025-11-03T10:39:18Z",
      analyst: "Michael Rodriguez",
      action: "Searched for indicators of lateral movement across network",
      findings: "No lateral movement detected. Attack contained to admin portal. Firewall rules blocked all attempts.",
      duration: "15m",
    },
    {
      id: 6,
      step: "Containment Actions",
      status: "in_progress",
      timestamp: "2025-11-03T10:54:42Z",
      analyst: "Sarah Chen",
      action: "Implementing containment measures to prevent further attack attempts",
      findings:
        "Blocked 14 source IPs at firewall. Enabled MFA for all admin accounts. Increased monitoring on admin portal.",
      duration: "ongoing",
    },
    {
      id: 7,
      step: "Root Cause Analysis",
      status: "pending",
      timestamp: null,
      analyst: null,
      action: "Determine how attacker obtained target credentials",
      findings: null,
      duration: null,
    },
    {
      id: 8,
      step: "Remediation & Recovery",
      status: "pending",
      timestamp: null,
      analyst: null,
      action: "Implement long-term fixes and restore normal operations",
      findings: null,
      duration: null,
    },
  ])

  const [enrichmentData, setEnrichmentData] = useState({
    threatIntel: {
      reputation: 95,
      category: "Malicious",
      firstSeen: "2024-08-15",
      lastSeen: "2025-11-03",
      associatedMalware: ["Mimikatz", "Cobalt Strike"],
      campaigns: ["APT28 Credential Harvesting 2024-Q4"],
    },
    osint: {
      whois: { org: "Unknown", country: "RU", asn: "AS12345" },
      geolocation: { city: "Moscow", region: "Moscow", country: "Russia" },
      reverseDNS: "no-reverse-dns.example.com",
    },
    iocAnalysis: {
      totalIOCs: 47,
      maliciousIPs: 14,
      suspiciousHashes: 8,
      blockedDomains: 25,
    },
  })

  const [nextSteps, setNextSteps] = useState([
    {
      priority: "critical",
      action: "Reset all administrative credentials immediately",
      assignee: "Security Team",
      eta: "15 minutes",
      status: "in_progress",
    },
    {
      priority: "high",
      action: "Deploy MFA enforcement for all privileged accounts",
      assignee: "Identity Team",
      eta: "1 hour",
      status: "pending",
    },
    {
      priority: "high",
      action: "Conduct forensic analysis on admin-portal-01 server",
      assignee: "Forensics Team",
      eta: "4 hours",
      status: "pending",
    },
    {
      priority: "medium",
      action: "Review and update firewall rules for admin portal access",
      assignee: "Network Team",
      eta: "2 hours",
      status: "pending",
    },
    {
      priority: "medium",
      action: "Implement rate limiting on authentication endpoints",
      assignee: "DevOps Team",
      eta: "6 hours",
      status: "pending",
    },
  ])

  const [aiSummary, setAiSummary] = useState({
    whatHappened: "Analyzing incident patterns...",
    confidence: 0,
    recommendations: [] as string[],
    threatActors: [] as string[],
    mitreTactics: [] as string[],
  })

  const availableAnalysts = [
    { id: "1", name: "Sarah Chen", role: "Senior Analyst", avatar: "SC" },
    { id: "2", name: "Michael Rodriguez", role: "Threat Hunter", avatar: "MR" },
    { id: "3", name: "Emily Watson", role: "SOC Lead", avatar: "EW" },
    { id: "4", name: "David Kim", role: "Incident Responder", avatar: "DK" },
    { id: "5", name: "Jessica Taylor", role: "Security Engineer", avatar: "JT" },
  ]

  const workflowStages = [
    { id: "detection", name: "Detection", color: "blue", icon: AlertTriangle },
    { id: "investigation", name: "Investigation", color: "yellow", icon: Search },
    { id: "containment", name: "Containment", color: "orange", icon: Shield },
    { id: "remediation", name: "Remediation", color: "purple", icon: Target },
    { id: "closed", name: "Closed", color: "green", icon: CheckCircle2 },
  ]

  const entities = [
    {
      id: "1",
      type: "ip",
      value: "185.199.108.153",
      country: "Russia",
      riskScore: 95,
      relatedAlerts: [
        { id: "A-001", title: "Brute Force Attack", severity: "critical", time: "2h ago" },
        { id: "A-045", title: "Port Scan Detected", severity: "high", time: "5h ago" },
        { id: "A-089", title: "Malware C2 Communication", severity: "critical", time: "1d ago" },
      ],
    },
    {
      id: "2",
      type: "ip",
      value: "203.0.113.45",
      country: "China",
      riskScore: 87,
      relatedAlerts: [
        { id: "A-002", title: "Failed Login Attempts", severity: "high", time: "2h ago" },
        { id: "A-067", title: "Suspicious Traffic Pattern", severity: "medium", time: "8h ago" },
      ],
    },
    {
      id: "3",
      type: "user",
      value: "admin@company.com",
      department: "IT",
      riskScore: 72,
      relatedAlerts: [
        { id: "A-003", title: "Account Compromise Attempt", severity: "high", time: "2h ago" },
        { id: "A-112", title: "Unusual Login Location", severity: "medium", time: "3d ago" },
      ],
    },
    {
      id: "4",
      type: "host",
      value: "admin-portal-01",
      os: "Windows Server 2019",
      riskScore: 68,
      relatedAlerts: [
        { id: "A-004", title: "Suspicious Process Execution", severity: "high", time: "1h ago" },
        { id: "A-078", title: "Unauthorized Access Attempt", severity: "medium", time: "6h ago" },
      ],
    },
  ]

  useEffect(() => {
    fetchIncidentDetails()
    fetchTimelineEvents()
    fetchAISummary()
    const interval = setInterval(() => {
      fetchLiveData()
      fetchAISummary() // Update AI summary with live data
    }, 5000)
    return () => clearInterval(interval)
  }, [incidentId])

  const fetchIncidentDetails = async () => {
    try {
      const res = await fetch(`/api/incidents/${incidentId}`)
      const data = await res.json()
      setIncident(data.incident)
      setLiveData(data.liveData)
      setLoading(false)
      console.log("[v0] Loaded incident details:", data)
    } catch (error) {
      console.error("[v0] Failed to fetch incident details:", error)
      setLoading(false)
    }
  }

  const fetchLiveData = async () => {
    try {
      const res = await fetch(`/api/incidents/${incidentId}/live`)
      const data = await res.json()
      setLiveData(data)
      console.log("[v0] Updated live data:", data)
    } catch (error) {
      console.error("[v0] Failed to fetch live data:", error)
    }
  }

  const fetchAISummary = async () => {
    try {
      // Simulate AI analysis with live data
      const confidence = Math.min(95, 60 + Math.floor(Math.random() * 35))
      setAiSummary({
        whatHappened:
          "A coordinated brute-force attack targeting administrative accounts from multiple geographic locations. The attack pattern indicates automated credential stuffing using compromised credential databases. Initial access attempts originated from Russian and Chinese IP addresses with known malicious activity. The attacker successfully executed reconnaissance activities and attempted lateral movement after gaining initial access.",
        confidence,
        recommendations: [
          "Immediately reset credentials for admin@company.com and enforce MFA",
          "Block source IPs 185.199.108.153 and 203.0.113.45 at firewall level",
          "Isolate admin-portal-01 from network and initiate forensic analysis",
          "Review all authentication logs for the past 48 hours for additional compromise indicators",
          "Deploy enhanced monitoring on all administrative accounts and privileged access systems",
        ],
        threatActors: ["APT28 (Fancy Bear)", "Credential Stuffing Botnet"],
        mitreTactics: ["Initial Access (T1078)", "Credential Access (T1110)", "Lateral Movement (T1021)"],
      })
    } catch (error) {
      console.error("[v0] Failed to fetch AI summary:", error)
    }
  }

  const fetchTimelineEvents = async () => {
    setTimelineLoading(true)
    try {
      const res = await fetch(`/api/incidents/${incidentId}/timeline`)
      const data = await res.json()
      setTimelineEvents(data.events || [])
      console.log("[v0] Loaded timeline events:", data.events?.length)
    } catch (error) {
      console.error("[v0] Failed to fetch timeline events:", error)
    } finally {
      setTimelineLoading(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-500 bg-red-500/10 border-red-500/30"
      case "high":
        return "text-orange-500 bg-orange-500/10 border-orange-500/30"
      case "medium":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30"
      case "low":
        return "text-blue-500 bg-blue-500/10 border-blue-500/30"
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/30"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "text-green-500 bg-green-500/10 border-green-500/30"
      case "in_progress":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30"
      case "new":
        return "text-blue-500 bg-blue-500/10 border-blue-500/30"
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/30"
    }
  }

  const getEntityIcon = (type: string) => {
    switch (type) {
      case "ip":
        return <Network className="h-5 w-5" />
      case "user":
        return <User className="h-5 w-5" />
      case "host":
        return <Server className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score >= 90) return "text-red-500"
    if (score >= 70) return "text-orange-500"
    if (score >= 50) return "text-yellow-500"
    return "text-green-500"
  }

  // Added workflow stage badge
  const getWorkflowStageColor = (stage: string) => {
    const stageData = workflowStages.find((s) => s.name === stage)
    if (!stageData) return "text-gray-500 bg-gray-500/10 border-gray-500/30"

    switch (stageData.color) {
      case "blue":
        return "text-blue-500 bg-blue-500/10 border-blue-500/30"
      case "yellow":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/30"
      case "orange":
        return "text-orange-500 bg-orange-500/10 border-orange-500/30"
      case "purple":
        return "text-purple-500 bg-purple-500/10 border-purple-500/30"
      case "green":
        return "text-green-500 bg-green-500/10 border-green-500/30"
      default:
        return "text-gray-500 bg-gray-500/10 border-gray-500/30"
    }
  }

  const handleAssignUser = (analyst: any) => {
    setAssignedTo(analyst.name)
    console.log("[v0] Assigned incident to:", analyst.name)
  }

  const handleChangeStage = (stage: any) => {
    setWorkflowStage(stage.name)
    console.log("[v0] Changed workflow stage to:", stage.name)
  }

  if (loading || !incident) {
    return (
      <div className="flex h-screen">
        <SidebarNav />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4" />
              <p className="text-gray-400">Loading incident details...</p>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/incidents")}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Incidents
          </Button>

          {/* AI Investigation Banner */}
          <div className="relative mb-6 overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-blue-950/30 to-purple-950/20 shadow-2xl">
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-blue-500/5 to-purple-500/5 animate-pulse" />

            <div className="relative p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl shadow-lg">
                    <Brain className="h-7 w-7 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                      AI Investigation Analysis
                    </h2>
                    <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                      <Sparkles className="h-3 w-3 text-cyan-400 animate-pulse" />
                      Real-time threat intelligence powered by machine learning
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-1">Confidence Score</p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000"
                          style={{ width: `${aiSummary.confidence}%` }}
                        />
                      </div>
                      <span className="text-lg font-bold text-cyan-400">{aiSummary.confidence}%</span>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30 animate-pulse px-3 py-1">
                    <Activity className="h-3 w-3 mr-1" />
                    LIVE
                  </Badge>
                </div>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-2 gap-6">
                {/* Left: What Actually Happened */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <h3 className="text-lg font-bold text-white">What Actually Happened?</h3>
                  </div>
                  <div className="bg-black/30 rounded-xl p-5 border border-cyan-500/20 backdrop-blur-sm">
                    <p className="text-gray-200 leading-relaxed text-sm">{aiSummary.whatHappened}</p>
                  </div>

                  {/* Threat Actors */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4 text-red-400" />
                      Suspected Threat Actors
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aiSummary.threatActors.map((actor, idx) => (
                        <Badge
                          key={idx}
                          className="bg-red-500/10 text-red-400 border-red-500/30 px-3 py-1 text-xs font-medium"
                        >
                          {actor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* MITRE ATT&CK */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-purple-400" />
                      MITRE ATT&CK Tactics
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {aiSummary.mitreTactics.map((tactic, idx) => (
                        <Badge
                          key={idx}
                          className="bg-purple-500/10 text-purple-400 border-purple-500/30 px-3 py-1 text-xs font-mono"
                        >
                          {tactic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Recommended Actions */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-bold text-white">Recommended Actions</h3>
                  </div>
                  <div className="bg-black/30 rounded-xl p-5 border border-green-500/20 backdrop-blur-sm space-y-3">
                    {aiSummary.recommendations.map((rec, idx) => (
                      <div key={idx} className="flex gap-3 group hover:bg-green-500/5 p-3 rounded-lg transition-all">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500/20 to-cyan-500/20 flex items-center justify-center text-xs font-bold text-green-400 border border-green-500/30">
                            {idx + 1}
                          </div>
                        </div>
                        <p className="text-sm text-gray-200 leading-relaxed flex-1">{rec}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex gap-2">
                    <Button className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-sm font-semibold shadow-lg">
                      <Zap className="h-4 w-4 mr-2" />
                      Execute All
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-transparent border-cyan-500/30 hover:bg-cyan-500/10 text-sm"
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export Report
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-xl border border-cyan-500/30 shadow-2xl p-8 mb-6">
            {/* Header Row */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 bg-cyan-500/10 rounded-lg">
                    <AlertTriangle className="h-8 w-8 text-cyan-400" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{incident.title}</h1>
                    <p className="text-sm text-gray-400">Incident ID: {incident.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge className={cn("px-4 py-1.5 text-sm font-semibold", getSeverityColor(incident.urgency))}>
                    <AlertTriangle className="h-4 w-4 mr-1.5" />
                    {incident.urgency.toUpperCase()}
                  </Badge>
                  <Badge className={cn("px-4 py-1.5 text-sm font-semibold", getStatusColor(incident.status))}>
                    {incident.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  <Badge className={cn("px-4 py-1.5 text-sm font-semibold", getWorkflowStageColor(workflowStage))}>
                    <GitBranch className="h-4 w-4 mr-1.5" />
                    {workflowStage.toUpperCase()}
                  </Badge>
                  {liveData?.isActive && (
                    <Badge className="px-4 py-1.5 bg-green-500/10 text-green-500 border-green-500/30 animate-pulse text-sm font-semibold">
                      <Activity className="h-4 w-4 mr-1.5" />
                      LIVE
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {/* CHANGE: Added Open Analyst Mode button to the top */}
                <Button
                  onClick={() => router.push(`/incidents/${incidentId}/analyst-mode`)}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 gap-2"
                >
                  <Brain className="h-4 w-4" />
                  Analyst Mode
                </Button>

                <div className="flex items-center gap-2 px-4 py-2 bg-[#0a0a0a] rounded-lg border border-border/30">
                  <UserCheck className="h-4 w-4 text-cyan-400" />
                  <div className="text-left">
                    <p className="text-xs text-gray-400">Assigned To</p>
                    <p className="text-sm font-semibold text-white">{assignedTo}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <User className="h-4 w-4" />
                      Reassign
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-[#1a1a1a] border-border/30">
                    <DropdownMenuLabel className="text-gray-400 text-xs uppercase tracking-wide">
                      Assign to Analyst
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/30" />
                    {availableAnalysts.map((analyst) => (
                      <DropdownMenuItem
                        key={analyst.id}
                        onClick={() => handleAssignUser(analyst)}
                        className="flex items-center gap-3 py-2 cursor-pointer hover:bg-cyan-500/10 focus:bg-cyan-500/10"
                      >
                        <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">
                          {analyst.avatar}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white">{analyst.name}</p>
                          <p className="text-xs text-gray-400">{analyst.role}</p>
                        </div>
                        {assignedTo === analyst.name && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <GitBranch className="h-4 w-4" />
                      Change Stage
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-[#1a1a1a] border-border/30">
                    <DropdownMenuLabel className="text-gray-400 text-xs uppercase tracking-wide">
                      Workflow Stage
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border/30" />
                    {workflowStages.map((stage) => {
                      const Icon = stage.icon
                      return (
                        <DropdownMenuItem
                          key={stage.id}
                          onClick={() => handleChangeStage(stage)}
                          className="flex items-center gap-3 py-2 cursor-pointer hover:bg-cyan-500/10 focus:bg-cyan-500/10"
                        >
                          <Icon className="h-4 w-4" />
                          <span className="flex-1 text-sm text-white">{stage.name}</span>
                          {workflowStage === stage.name && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                        </DropdownMenuItem>
                      )
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Resolve
                </Button>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-red-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Risk Score</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-red-400">{incident.aggregatedRiskScore}</span>
                  <span className="text-sm text-gray-400">/ 300</span>
                </div>
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Events</span>
                </div>
                <span className="text-3xl font-bold text-white">{liveData?.eventsDetected || 0}</span>
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Network className="h-4 w-4 text-orange-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Source IPs</span>
                </div>
                <span className="text-3xl font-bold text-white">{liveData?.sourceIPs || 0}</span>
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-4 border border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-yellow-400" />
                  <span className="text-xs text-gray-400 uppercase tracking-wide">Duration</span>
                </div>
                <span className="text-2xl font-bold text-white">{liveData?.duration || "0m"}</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#0a0a0a] rounded-lg p-5 border border-border/30">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Description
              </h3>
              <p className="text-base text-gray-200 leading-relaxed">
                {incident.description ||
                  "Multiple failed authentication attempts detected from suspicious IP addresses targeting administrative accounts. This indicates a coordinated brute-force attack attempting to gain unauthorized access to the admin portal."}
              </p>
            </div>
          </div>

          <div className="bg-[#0f0f0f] rounded-xl border border-border/30 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="h-6 w-6 text-cyan-400" />
                Entities Involved ({entities.length})
              </h2>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Search className="h-4 w-4" />
                Search Entities
              </Button>
            </div>

            <div className="space-y-3">
              {entities.map((entity) => (
                <div
                  key={entity.id}
                  className="bg-[#1a1a1a] rounded-lg border border-border/20 overflow-hidden hover:border-cyan-500/30 transition-all"
                >
                  {/* Entity Header */}
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedEntity(expandedEntity === entity.id ? null : entity.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={cn(
                            "p-3 rounded-lg",
                            entity.type === "ip" && "bg-cyan-500/10 text-cyan-400",
                            entity.type === "user" && "bg-blue-500/10 text-blue-400",
                            entity.type === "host" && "bg-purple-500/10 text-purple-400",
                          )}
                        >
                          {getEntityIcon(entity.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Badge variant="outline" className="text-xs uppercase">
                              {entity.type}
                            </Badge>
                            <code className="text-base font-semibold text-white font-mono">{entity.value}</code>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            {entity.country && (
                              <span className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                {entity.country}
                              </span>
                            )}
                            {entity.department && (
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {entity.department}
                              </span>
                            )}
                            {entity.os && (
                              <span className="flex items-center gap-1">
                                <Monitor className="h-3 w-3" />
                                {entity.os}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <p className="text-xs text-gray-400 mb-1">Risk Score</p>
                            <p className={cn("text-2xl font-bold", getRiskScoreColor(entity.riskScore))}>
                              {entity.riskScore}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-400 mb-1">Related Alerts</p>
                            <Badge className="bg-red-500/10 text-red-400 border-red-500/30 text-lg font-bold px-3 py-1">
                              {entity.relatedAlerts.length}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {expandedEntity === entity.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400 ml-4" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400 ml-4" />
                      )}
                    </div>
                  </div>

                  {/* Related Alerts (Expandable) */}
                  {expandedEntity === entity.id && (
                    <div className="border-t border-border/20 bg-[#0f0f0f] p-4">
                      <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                        Related Alerts
                      </h4>
                      <div className="space-y-2">
                        {entity.relatedAlerts.map((alert) => (
                          <div
                            key={alert.id}
                            className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border border-border/10 hover:border-cyan-500/30 transition-all cursor-pointer"
                            onClick={() => router.push(`/incidents/${alert.id}`)}
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <Badge className={cn("text-xs font-semibold", getSeverityColor(alert.severity))}>
                                {alert.severity.toUpperCase()}
                              </Badge>
                              <span className="text-sm text-gray-300">{alert.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-400">{alert.time}</span>
                              <code className="text-xs text-cyan-400 font-mono">{alert.id}</code>
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="bg-[#0f0f0f] border border-border/30 p-1">
              <TabsTrigger value="timeline" className="gap-2" onClick={fetchTimelineEvents}>
                <Clock className="h-4 w-4" />
                Timeline
              </TabsTrigger>
              <TabsTrigger value="triage" className="gap-2">
                <Target className="h-4 w-4" />
                Triage
              </TabsTrigger>
              <TabsTrigger value="response" className="gap-2">
                <Shield className="h-4 w-4" />
                Response
              </TabsTrigger>
              <TabsTrigger value="notes" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Notes
              </TabsTrigger>
            </TabsList>

            {/* CHANGE: Removed the Open Analyst Mode button from here */}

            <TabsContent value="timeline" className="mt-6">
              <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Event Timeline</h3>
                {timelineLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
                  </div>
                ) : timelineEvents.length === 0 ? (
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">No events found</p>
                  </div>
                ) : (
                  // Re-implementing the timeline event display here, simplified
                  <div className="space-y-4">
                    {timelineEvents.map((event, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg",
                              event.severity === "critical" && "bg-red-500/20 text-red-400 ring-2 ring-red-500/50",
                              event.severity === "high" && "bg-orange-500/20 text-orange-400 ring-2 ring-orange-500/50",
                              event.severity === "medium" &&
                                "bg-yellow-500/20 text-yellow-400 ring-2 ring-yellow-500/50",
                              event.severity === "low" && "bg-blue-500/20 text-blue-400 ring-2 ring-blue-500/50",
                              event.eventType === "block" && "bg-green-500/20 text-green-400 ring-2 ring-green-500/50",
                            )}
                          >
                            {/* Assuming getEventIcon function is available or simplified */}
                            {event.eventType === "alert" && <AlertTriangle className="h-4 w-4" />}
                            {event.eventType === "login" && <User className="h-4 w-4" />}
                            {event.eventType === "block" && <Shield className="h-4 w-4" />}
                            {event.eventType === "process" && <Activity className="h-4 w-4" />}
                            {event.eventType === "file" && <FileText className="h-4 w-4" />}
                          </div>
                          {idx < timelineEvents.length - 1 && (
                            <div className="w-px h-full bg-gradient-to-b from-cyan-500/50 to-transparent mt-2" />
                          )}
                        </div>

                        <div className="flex-1 bg-[#1a1a1a] rounded-lg p-4 shadow-sm border border-border/20 hover:border-cyan-500/30 transition-all">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-cyan-400 mb-1">
                                {new Date(event.timestamp).toLocaleString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })}
                              </p>
                              <p className="text-base font-semibold text-white mb-1">
                                {event.title || event.description}
                              </p>
                              <p className="text-sm text-gray-300">{event.details || event.description}</p>
                            </div>
                            <Badge
                              className={cn(
                                "text-xs flex-shrink-0 ml-2",
                                event.severity === "critical" && "bg-red-500/10 text-red-400 border-red-500/30",
                                event.severity === "high" && "bg-orange-500/10 text-orange-400 border-orange-500/30",
                                event.severity === "medium" && "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
                                event.severity === "low" && "bg-blue-500/10 text-blue-400 border-blue-500/30",
                              )}
                            >
                              {event.severity.toUpperCase()}
                            </Badge>
                          </div>
                          {(event.sourceIP || event.user || event.hash) && (
                            <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-2 pt-2 border-t border-border/20">
                              {event.sourceIP && (
                                <span className="flex items-center gap-1">
                                  <Network className="h-3 w-3 text-cyan-400" />
                                  <span className="text-gray-500">IP:</span>
                                  <code className="text-cyan-400 font-mono">{event.sourceIP}</code>
                                </span>
                              )}
                              {event.user && (
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3 text-blue-400" />
                                  <span className="text-gray-500">User:</span>
                                  <code className="text-blue-400 font-mono">{event.user}</code>
                                </span>
                              )}
                              {event.hash && (
                                <span className="flex items-center gap-1">
                                  <Hash className="h-3 w-3 text-red-400" />
                                  <span className="text-gray-500">Hash:</span>
                                  <code className="text-red-400 font-mono text-[10px]">{event.hash}</code>
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="triage" className="mt-6">
              <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Triage Actions</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">Change Severity</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                      >
                        Critical
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-orange-500/10 text-orange-400 border-orange-500/30 hover:bg-orange-500/20"
                      >
                        High
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-yellow-500/10 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/20"
                      >
                        Medium
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                      >
                        Low
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">Quick Actions</label>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                        <CheckCircle2 className="h-4 w-4" />
                        Mark as Resolved
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                        <XCircle className="h-4 w-4" />
                        False Positive
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                        <AlertCircle className="h-4 w-4" />
                        Escalate to Tier 2
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                        <Users className="h-4 w-4" />
                        Assign to Team
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="response" className="mt-6">
              <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Response Playbooks</h3>
                <div className="space-y-3">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-sm">Run Containment Playbook</Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent text-xs">
                    <Shield className="h-3 w-3" />
                    Isolation Playbook
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent text-xs">
                    <Lock className="h-3 w-3" />
                    Block & Quarantine
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Analyst Notes</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Add investigation notes..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 bg-[#1a1a1a] border-border/30 text-white resize-none text-sm"
                      rows={2}
                    />
                    <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 h-9 w-9 p-0">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {comments.length === 0 && <p className="text-center text-gray-400 text-xs py-4">No notes yet</p>}
                    {comments.map((comment) => (
                      <div key={comment.id} className="p-3 bg-[#1a1a1a] rounded border border-border/20">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="h-3 w-3 text-cyan-400" />
                          <span className="text-xs font-medium text-white">{comment.author}</span>
                          <span className="text-xs text-gray-400">{comment.time}</span>
                        </div>
                        <p className="text-sm text-gray-300">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
