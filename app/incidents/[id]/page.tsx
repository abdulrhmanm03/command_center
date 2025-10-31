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
  Zap,
  CheckCircle2,
  XCircle,
  AlertCircle,
  TrendingUp,
  Database,
  Network,
  Lock,
  Eye,
  Play,
  MessageSquare,
  Tag,
  Link2,
  FileDown,
  Search,
  Users,
  GitMerge,
  Send,
  Plus,
  Hash,
  Globe,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"

export default function IncidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const incidentId = params.id as string

  const [incident, setIncident] = useState<any>(null)
  const [liveData, setLiveData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const [newComment, setNewComment] = useState("")
  const [newTag, setNewTag] = useState("")
  const [newIOC, setNewIOC] = useState("")
  const [iocType, setIOCType] = useState("ip")
  const [comments, setComments] = useState<any[]>([])
  const [tags, setTags] = useState<string[]>(["brute-force", "authentication"])
  const [iocs, setIOCs] = useState<any[]>([
    { type: "ip", value: "192.168.1.100", threat: "high", source: "VirusTotal" },
    { type: "ip", value: "10.0.0.45", threat: "medium", source: "AbuseIPDB" },
  ])
  const [playbookRunning, setPlaybookRunning] = useState(false)
  const [playbookProgress, setPlaybookProgress] = useState(0)

  useEffect(() => {
    fetchIncidentDetails()
    const interval = setInterval(fetchLiveData, 5000) // Update every 5s
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

  const handleAddComment = () => {
    if (!newComment.trim()) return
    const comment = {
      id: Date.now(),
      author: "Current User",
      text: newComment,
      time: new Date().toLocaleTimeString(),
    }
    setComments([comment, ...comments])
    setNewComment("")
  }

  const handleAddTag = () => {
    if (!newTag.trim() || tags.includes(newTag)) return
    setTags([...tags, newTag.toLowerCase()])
    setNewTag("")
  }

  const handleAddIOC = () => {
    if (!newIOC.trim()) return
    const ioc = {
      type: iocType,
      value: newIOC,
      threat: "unknown",
      source: "Manual",
    }
    setIOCs([...iocs, ioc])
    setNewIOC("")
  }

  const handleRunPlaybook = () => {
    setPlaybookRunning(true)
    setPlaybookProgress(0)
    const interval = setInterval(() => {
      setPlaybookProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setPlaybookRunning(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleEnrichIP = async (ip: string) => {
    console.log("[v0] Enriching IP:", ip)
    // Simulate enrichment
    alert(`Enriching IP: ${ip}\n\nThreat Score: 85/100\nCountry: Russia\nISP: Unknown\nLast Seen: 2 hours ago`)
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
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/incidents")}
              className="mb-4 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Incidents
            </Button>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-white">{incident.title}</h1>
                  <Badge className={cn("px-3 py-1", getSeverityColor(incident.urgency))}>
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    {incident.urgency.toUpperCase()}
                  </Badge>
                  <Badge className={cn("px-3 py-1", getStatusColor(incident.status))}>
                    {incident.status.replace("_", " ").toUpperCase()}
                  </Badge>
                  {liveData?.isActive && (
                    <Badge className="px-3 py-1 bg-green-500/10 text-green-500 border-green-500/30 animate-pulse">
                      <Activity className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                  )}
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="px-2 py-1 text-xs">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="text-gray-400 text-sm">Incident ID: {incident.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <User className="h-4 w-4" />
                  Assign to Me
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-transparent"
                  onClick={handleRunPlaybook}
                  disabled={playbookRunning}
                >
                  <Play className="h-4 w-4" />
                  {playbookRunning ? `Running ${playbookProgress}%` : "Run Playbook"}
                </Button>
                <Button className="gap-2 bg-cyan-600 hover:bg-cyan-700">
                  <CheckCircle2 className="h-4 w-4" />
                  Resolve Incident
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-1 mb-6 border-b border-border/30">
            {["overview", "timeline", "evidence", "response", "related", "triage"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 text-sm font-medium capitalize transition-colors",
                  activeTab === tab ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-400 hover:text-white",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Main Info */}
              <div className="col-span-2 space-y-6">
                {/* Summary Card */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-cyan-400" />
                    Incident Summary
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Description</label>
                      <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                        {incident.description ||
                          "Multiple failed authentication attempts detected from suspicious IP addresses targeting administrative accounts. Potential brute force attack in progress."}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wide">Risk Object</label>
                        <p className="text-sm text-white mt-1 font-medium">{incident.riskObjectName}</p>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wide">Security Domain</label>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {incident.securityDomain}
                        </Badge>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wide">Risk Score</label>
                        <div className="flex items-center gap-2 mt-1">
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full animate-pulse",
                              incident.aggregatedRiskScore > 200
                                ? "bg-red-500"
                                : incident.aggregatedRiskScore > 150
                                  ? "bg-orange-500"
                                  : "bg-yellow-500",
                            )}
                          />
                          <span className="text-lg text-white font-bold">{incident.aggregatedRiskScore}</span>
                          <span className="text-xs text-gray-400">/ 300</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-400 uppercase tracking-wide">Risk Events</label>
                        <p className="text-sm text-cyan-400 mt-1 font-medium">{incident.riskEvents || 0} events</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* MITRE ATT&CK Mapping */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-cyan-400" />
                    MITRE ATT&CK Mapping
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {liveData?.mitreTactics?.map((tactic: any, idx: number) => (
                      <div key={idx} className="bg-[#1a1a1a] rounded-lg p-4 border border-border/20">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                            <Target className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-white mb-1">{tactic.id}</h4>
                            <p className="text-xs text-gray-400 mb-2">{tactic.name}</p>
                            <Badge variant="outline" className="text-xs">
                              {tactic.tactic}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Affected Assets */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Database className="h-5 w-5 text-cyan-400" />
                    Affected Assets
                  </h3>
                  <div className="space-y-3">
                    {liveData?.affectedAssets?.map((asset: any, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg border border-border/20"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                            {asset.type === "server" && <Database className="h-5 w-5 text-cyan-400" />}
                            {asset.type === "network" && <Network className="h-5 w-5 text-cyan-400" />}
                            {asset.type === "endpoint" && <Lock className="h-5 w-5 text-cyan-400" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-white">{asset.name}</p>
                            <p className="text-xs text-gray-400">{asset.ip}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          {asset.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Activity Graph */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                    Live Activity Trend
                  </h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={liveData?.activityTrend || []}>
                      <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: "12px" }} />
                      <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1a1a1a",
                          border: "1px solid #333",
                          borderRadius: "8px",
                        }}
                      />
                      <Line type="monotone" dataKey="events" stroke="#06b6d4" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Right Column - Live Stats & Actions */}
              <div className="space-y-6">
                {/* Live Stats */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-cyan-400" />
                    Live Statistics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm text-gray-400">Events Detected</span>
                      </div>
                      <span className="text-lg font-bold text-white">{liveData?.eventsDetected || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-400" />
                        <span className="text-sm text-gray-400">Failed Attempts</span>
                      </div>
                      <span className="text-lg font-bold text-white">{liveData?.failedAttempts || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <div className="flex items-center gap-2">
                        <Network className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Source IPs</span>
                      </div>
                      <span className="text-lg font-bold text-white">{liveData?.sourceIPs || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Duration</span>
                      </div>
                      <span className="text-sm font-medium text-white">{liveData?.duration || "0m"}</span>
                    </div>
                  </div>
                </div>

                {/* Incident Details */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Created</label>
                      <p className="text-sm text-white mt-1">
                        {new Date(incident.time).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Owner</label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <User className="h-3 w-3 text-cyan-400" />
                        </div>
                        <span className="text-sm text-white">{incident.owner || "Unassigned"}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Type</label>
                      <p className="text-sm text-white mt-1 capitalize">
                        {incident.type === "risk_notable" ? "Risk Notable" : "Notable"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Last Updated</label>
                      <p className="text-sm text-white mt-1">{liveData?.lastUpdated || "Just now"}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-cyan-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button className="w-full justify-start gap-2 bg-red-600 hover:bg-red-700">
                      <XCircle className="h-4 w-4" />
                      Block Source IPs
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <Lock className="h-4 w-4" />
                      Isolate Affected Assets
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <Shield className="h-4 w-4" />
                      Enable MFA
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <AlertTriangle className="h-4 w-4" />
                      Escalate to SOC
                    </Button>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-cyan-400" />
                    AI Recommendations
                  </h3>
                  <div className="space-y-3">
                    {liveData?.aiRecommendations?.map((rec: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-300">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column - Live Stats & Actions */}
              <div className="space-y-6">
                {/* Live Stats */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-cyan-400" />
                    Live Statistics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-cyan-400" />
                        <span className="text-sm text-gray-400">Events Detected</span>
                      </div>
                      <span className="text-lg font-bold text-white">{liveData?.eventsDetected || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-orange-400" />
                        <span className="text-sm text-gray-400">Failed Attempts</span>
                      </div>
                      <span className="text-lg font-bold text-white">{liveData?.failedAttempts || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <div className="flex items-center gap-2">
                        <Network className="h-4 w-4 text-blue-400" />
                        <span className="text-sm text-gray-400">Source IPs</span>
                      </div>
                      <span className="text-lg font-bold text-white">{liveData?.sourceIPs || 0}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm text-gray-400">Duration</span>
                      </div>
                      <span className="text-sm font-medium text-white">{liveData?.duration || "0m"}</span>
                    </div>
                  </div>
                </div>

                {/* Incident Details */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Details</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Created</label>
                      <p className="text-sm text-white mt-1">
                        {new Date(incident.time).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Owner</label>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                          <User className="h-3 w-3 text-cyan-400" />
                        </div>
                        <span className="text-sm text-white">{incident.owner || "Unassigned"}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Type</label>
                      <p className="text-sm text-white mt-1 capitalize">
                        {incident.type === "risk_notable" ? "Risk Notable" : "Notable"}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide">Last Updated</label>
                      <p className="text-sm text-white mt-1">{liveData?.lastUpdated || "Just now"}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-cyan-400" />
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <Button className="w-full justify-start gap-2 bg-red-600 hover:bg-red-700">
                      <XCircle className="h-4 w-4" />
                      Block Source IPs
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <Lock className="h-4 w-4" />
                      Isolate Affected Assets
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <Shield className="h-4 w-4" />
                      Enable MFA
                    </Button>
                    <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                      <AlertTriangle className="h-4 w-4" />
                      Escalate to SOC
                    </Button>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-cyan-400" />
                    AI Recommendations
                  </h3>
                  <div className="space-y-3">
                    {liveData?.aiRecommendations?.map((rec: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-300">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Incident Timeline</h3>
              <div className="space-y-4">
                {liveData?.timeline?.map((event: any, idx: number) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-3 h-3 rounded-full",
                          event.type === "detected" && "bg-green-500",
                          event.type === "escalated" && "bg-orange-500",
                          event.type === "action" && "bg-blue-500",
                          event.type === "resolved" && "bg-cyan-500",
                        )}
                      />
                      {idx < (liveData?.timeline?.length || 0) - 1 && (
                        <div className="w-0.5 h-full bg-border/30 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-white">{event.title}</p>
                        <span className="text-xs text-gray-400">{event.time}</span>
                      </div>
                      <p className="text-sm text-gray-400">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Tab */}
          {activeTab === "evidence" && (
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Network Evidence</h3>
                <div className="space-y-3 font-mono text-xs">
                  {liveData?.evidence?.network?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-[#1a1a1a] rounded border border-border/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400">{item.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-cyan-400">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">System Evidence</h3>
                <div className="space-y-3 font-mono text-xs">
                  {liveData?.evidence?.system?.map((item: any, idx: number) => (
                    <div key={idx} className="p-3 bg-[#1a1a1a] rounded border border-border/20">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-gray-400">{item.label}</span>
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      <p className="text-cyan-400">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Response Tab */}
          {activeTab === "response" && (
            <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Response Actions</h3>
              <div className="space-y-4">
                {liveData?.responseActions?.map((action: any, idx: number) => (
                  <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-border/20">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center",
                            action.status === "completed" && "bg-green-500/10",
                            action.status === "pending" && "bg-yellow-500/10",
                            action.status === "failed" && "bg-red-500/10",
                          )}
                        >
                          {action.status === "completed" && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                          {action.status === "pending" && <Clock className="h-5 w-5 text-yellow-400" />}
                          {action.status === "failed" && <XCircle className="h-5 w-5 text-red-400" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{action.title}</p>
                          <p className="text-xs text-gray-400">{action.description}</p>
                        </div>
                      </div>
                      <Badge
                        className={cn(
                          action.status === "completed" && "bg-green-500/10 text-green-400 border-green-500/30",
                          action.status === "pending" && "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
                          action.status === "failed" && "bg-red-500/10 text-red-400 border-red-500/30",
                        )}
                      >
                        {action.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mt-3">
                      <span>Executed by: {action.executedBy}</span>
                      <span>•</span>
                      <span>{action.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Tab */}
          {activeTab === "related" && (
            <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Related Incidents</h3>
              <div className="space-y-3">
                {liveData?.relatedIncidents?.map((related: any, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#1a1a1a] rounded-lg border border-border/20 hover:border-cyan-500/30 transition-colors cursor-pointer"
                    onClick={() => router.push(`/incidents/${related.id}`)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium text-white">{related.title}</p>
                      <Badge className={getSeverityColor(related.severity)}>{related.severity}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{related.time}</span>
                      <span>•</span>
                      <span>Similarity: {related.similarity}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "triage" && (
            <div className="grid grid-cols-3 gap-6">
              {/* Left Column - Investigation Tools */}
              <div className="col-span-2 space-y-6">
                {/* Comments & Collaboration */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-cyan-400" />
                    Comments & Collaboration
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-3">
                      <Textarea
                        placeholder="Add a comment... Use @username to mention team members"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="flex-1 bg-[#1a1a1a] border-border/30 text-white resize-none"
                        rows={3}
                      />
                      <Button onClick={handleAddComment} className="bg-cyan-600 hover:bg-cyan-700">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {comments.map((comment) => (
                        <div key={comment.id} className="p-4 bg-[#1a1a1a] rounded-lg border border-border/20">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center">
                              <User className="h-4 w-4 text-cyan-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">{comment.author}</p>
                              <p className="text-xs text-gray-400">{comment.time}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-300 ml-10">{comment.text}</p>
                        </div>
                      ))}
                      {comments.length === 0 && (
                        <p className="text-center text-gray-400 text-sm py-8">
                          No comments yet. Start the conversation!
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* IOC Management */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Hash className="h-5 w-5 text-cyan-400" />
                    Indicators of Compromise (IOCs)
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <select
                        value={iocType}
                        onChange={(e) => setIOCType(e.target.value)}
                        className="px-3 py-2 bg-[#1a1a1a] border border-border/30 rounded-lg text-white text-sm"
                      >
                        <option value="ip">IP Address</option>
                        <option value="domain">Domain</option>
                        <option value="hash">File Hash</option>
                        <option value="url">URL</option>
                        <option value="email">Email</option>
                      </select>
                      <Input
                        placeholder={`Enter ${iocType}...`}
                        value={newIOC}
                        onChange={(e) => setNewIOC(e.target.value)}
                        className="flex-1 bg-[#1a1a1a] border-border/30 text-white"
                      />
                      <Button onClick={handleAddIOC} className="bg-cyan-600 hover:bg-cyan-700">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {iocs.map((ioc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border border-border/20"
                        >
                          <div className="flex items-center gap-3 flex-1">
                            <Badge variant="outline" className="text-xs capitalize">
                              {ioc.type}
                            </Badge>
                            <code className="text-sm text-cyan-400 font-mono">{ioc.value}</code>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={cn(
                                "text-xs",
                                ioc.threat === "high" && "bg-red-500/10 text-red-400 border-red-500/30",
                                ioc.threat === "medium" && "bg-orange-500/10 text-orange-400 border-orange-500/30",
                                ioc.threat === "low" && "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
                                ioc.threat === "unknown" && "bg-gray-500/10 text-gray-400 border-gray-500/30",
                              )}
                            >
                              {ioc.threat}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEnrichIP(ioc.value)}
                              className="h-8 w-8 p-0"
                            >
                              <Search className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Threat Intelligence Enrichment */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-cyan-400" />
                    Threat Intelligence Enrichment
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="justify-start gap-2 bg-transparent">
                      <ExternalLink className="h-4 w-4" />
                      VirusTotal Lookup
                    </Button>
                    <Button variant="outline" className="justify-start gap-2 bg-transparent">
                      <ExternalLink className="h-4 w-4" />
                      AbuseIPDB Check
                    </Button>
                    <Button variant="outline" className="justify-start gap-2 bg-transparent">
                      <ExternalLink className="h-4 w-4" />
                      WHOIS Lookup
                    </Button>
                    <Button variant="outline" className="justify-start gap-2 bg-transparent">
                      <ExternalLink className="h-4 w-4" />
                      Shodan Search
                    </Button>
                    <Button variant="outline" className="justify-start gap-2 bg-transparent">
                      <ExternalLink className="h-4 w-4" />
                      AlienVault OTX
                    </Button>
                    <Button variant="outline" className="justify-start gap-2 bg-transparent">
                      <ExternalLink className="h-4 w-4" />
                      Hybrid Analysis
                    </Button>
                  </div>
                </div>
              </div>

              {/* Right Column - Triage Actions */}
              <div className="space-y-6">
                {/* Triage Actions */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Zap className="h-5 w-5 text-cyan-400" />
                    Triage Actions
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
                        Change Severity
                      </label>
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
                      <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">Change Status</label>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                          <CheckCircle2 className="h-4 w-4" />
                          Mark as Resolved
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                          <XCircle className="h-4 w-4" />
                          Mark as False Positive
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                          <AlertCircle className="h-4 w-4" />
                          Escalate to Tier 2
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">Assignment</label>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                          <User className="h-4 w-4" />
                          Assign to Me
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                          <Users className="h-4 w-4" />
                          Assign to Team
                        </Button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-400 uppercase tracking-wide mb-2 block">
                        Advanced Actions
                      </label>
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                          <GitMerge className="h-4 w-4" />
                          Merge with Incident
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                          <Link2 className="h-4 w-4" />
                          Link to Ticket
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                          <FileDown className="h-4 w-4" />
                          Export Report
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags Management */}
                <div className="bg-[#0f0f0f] rounded-lg border border-border/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Tag className="h-5 w-5 text-cyan-400" />
                    Tags
                  </h3>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleAddTag()}
                        className="flex-1 bg-[#1a1a1a] border-border/30 text-white"
                      />
                      <Button onClick={handleAddTag} size="sm" className="bg-cyan-600 hover:bg-cyan-700">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Playbook Execution */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/30 p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Play className="h-5 w-5 text-cyan-400" />
                    Automated Playbooks
                  </h3>
                  <div className="space-y-3">
                    <Button
                      onClick={handleRunPlaybook}
                      disabled={playbookRunning}
                      className="w-full bg-cyan-600 hover:bg-cyan-700"
                    >
                      {playbookRunning ? `Running... ${playbookProgress}%` : "Run Containment Playbook"}
                    </Button>
                    {playbookRunning && (
                      <div className="space-y-2">
                        <div className="w-full bg-[#1a1a1a] rounded-full h-2">
                          <div
                            className="bg-cyan-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${playbookProgress}%` }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 text-center">Executing automated response actions...</p>
                      </div>
                    )}
                    <div className="space-y-2 mt-4">
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                        <Shield className="h-4 w-4" />
                        Isolation Playbook
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                        <Lock className="h-4 w-4" />
                        Block & Quarantine
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-transparent">
                        <AlertTriangle className="h-4 w-4" />
                        Emergency Response
                      </Button>
                    </div>
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
