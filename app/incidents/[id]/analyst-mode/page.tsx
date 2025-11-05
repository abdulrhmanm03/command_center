"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  Activity,
  User,
  Shield,
  AlertTriangle,
  Server,
  Laptop,
  Network,
  ArrowRight,
  MessageSquare,
  Send,
  FileText,
  Plus,
  Eye,
  Lock,
  Crosshair,
  Globe,
  FileCode,
  Database,
  Link,
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AnalystModePage() {
  const params = useParams()
  const router = useRouter()
  const incidentId = params.id as string

  const [incidentData, setIncidentData] = useState<any>(null)
  const [investigationProgress, setInvestigationProgress] = useState(65)
  const [liveMetrics, setLiveMetrics] = useState({
    eventsAnalyzed: 0,
    iocsIdentified: 0,
    threatsBlocked: 0,
    alertsTriggered: 0,
  })

  useEffect(() => {
    const fetchIncidentData = async () => {
      try {
        const response = await fetch(`/api/incidents/${incidentId}`)
        const data = await response.json()
        setIncidentData(data)

        // Set initial metrics from real incident data
        setLiveMetrics({
          eventsAnalyzed: data.incident.riskEvents || 127,
          iocsIdentified: (data.liveData?.sourceIPs || 12) * 4,
          threatsBlocked: data.liveData?.sourceIPs || 12,
          alertsTriggered: Math.floor((data.incident.riskEvents || 127) / 15),
        })
      } catch (error) {
        console.error("[v0] Failed to fetch incident data:", error)
      }
    }
    fetchIncidentData()
  }, [incidentId])

  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      user: "Sarah Chen",
      role: "Lead Analyst",
      message: "Initial triage complete. Source IP confirmed malicious by multiple threat intel sources.",
      timestamp: "10:15 AM",
      avatar: "SC",
    },
    {
      id: 2,
      user: "Michael Rodriguez",
      role: "Threat Hunter",
      message: "Running deep packet inspection now. Will update with findings in 10 minutes.",
      timestamp: "10:28 AM",
      avatar: "MR",
    },
    {
      id: 3,
      user: "Sarah Chen",
      role: "Lead Analyst",
      message: "Good. Also check for any lateral movement indicators. This looks like APT28 infrastructure.",
      timestamp: "10:30 AM",
      avatar: "SC",
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const [analystNotes, setAnalystNotes] = useState([
    {
      id: 1,
      analyst: "Sarah Chen",
      timestamp: "10:15 AM",
      category: "Finding",
      note: "Source IP 185.199.108.153 flagged by 12/89 vendors on VirusTotal. High confidence malicious.",
    },
    {
      id: 2,
      analyst: "Michael Rodriguez",
      timestamp: "10:32 AM",
      category: "Action",
      note: "Blocked 14 source IPs at perimeter firewall. Monitoring for additional attack vectors.",
    },
  ])
  const [newNote, setNewNote] = useState("")
  const [noteCategory, setNoteCategory] = useState("Finding")

  const mitreAttackMapping = [
    {
      tactic: "Initial Access",
      technique: "T1078 - Valid Accounts",
      status: "detected",
      time: "10:11 AM",
      icon: AlertTriangle,
      color: "red",
      description: "Brute force attack on admin credentials",
      severity: "critical",
      detectionConfidence: 98,
    },
    {
      tactic: "Credential Access",
      technique: "T1110 - Brute Force",
      status: "detected",
      time: "10:14 AM",
      icon: Lock,
      color: "orange",
      description: "89 failed authentication attempts",
      severity: "critical",
      detectionConfidence: 100,
    },
    {
      tactic: "Discovery",
      technique: "T1087 - Account Discovery",
      status: "detected",
      time: "10:20 AM",
      icon: Eye,
      color: "yellow",
      description: "Enumeration of admin accounts",
      severity: "high",
      detectionConfidence: 85,
    },
    {
      tactic: "Lateral Movement",
      technique: "T1021 - Remote Services",
      status: "blocked",
      time: "10:27 AM",
      icon: Network,
      color: "blue",
      description: "Attempted network propagation blocked",
      severity: "high",
      detectionConfidence: 92,
    },
    {
      tactic: "Command and Control",
      technique: "T1071 - Application Layer Protocol",
      status: "blocked",
      time: "10:35 AM",
      icon: Globe,
      color: "green",
      description: "C2 communication prevented",
      severity: "medium",
      detectionConfidence: 78,
    },
  ]

  const networkTopology = {
    attacker: {
      ip: "185.199.108.153",
      country: "Russia",
      risk: 95,
      asn: "AS12345",
      org: "Unknown Hosting",
    },
    target: {
      name: incidentData?.incident?.riskObjectName || "admin-portal-01",
      type: "Windows Server 2019",
      risk: 68,
      ip: "10.0.1.50",
    },
    affected: [
      {
        name: "admin@company.com",
        type: "User Account",
        risk: 72,
        attempts: 45,
      },
      {
        name: "David's Laptop",
        type: "Endpoint",
        risk: 85,
        attempts: 23,
      },
      {
        name: "auth-service-02",
        type: "Auth Server",
        risk: 78,
        attempts: 21,
      },
    ],
  }

  const entities = [
    {
      id: 1,
      type: "IP Address",
      name: "185.199.108.153",
      icon: Globe,
      risk: 95,
      country: "Russia",
      relatedAlerts: 3,
      relationships: ["Attacked admin-portal-01", "Targeted admin@company.com", "Connected from TOR"],
    },
    {
      id: 2,
      type: "IP Address",
      name: "203.0.113.45",
      icon: Globe,
      risk: 87,
      country: "China",
      relatedAlerts: 2,
      relationships: ["Attacked admin-portal-01", "Part of botnet"],
    },
    {
      id: 3,
      type: "User",
      name: "admin@company.com",
      icon: User,
      risk: 72,
      department: "IT",
      relatedAlerts: 2,
      relationships: ["Targeted by 185.199.108.153", "Account locked", "Has Domain Admin privileges"],
    },
    {
      id: 4,
      type: "Host",
      name: "admin-portal-01",
      icon: Server,
      risk: 68,
      os: "Windows Server 2019",
      relatedAlerts: 2,
      relationships: ["Attacked by 185.199.108.153", "Hosts admin portal", "Connected to auth-service-02"],
    },
    {
      id: 5,
      type: "Host",
      name: "David's Laptop",
      icon: Laptop,
      risk: 85,
      os: "Windows 11",
      relatedAlerts: 1,
      relationships: ["Accessed by admin@company.com", "Connected to admin-portal-01"],
    },
    {
      id: 6,
      type: "Service",
      name: "auth-service-02",
      icon: Database,
      risk: 78,
      service: "Authentication",
      relatedAlerts: 1,
      relationships: ["Processes logins for admin-portal-01", "Locked admin@company.com account"],
    },
    {
      id: 7,
      type: "File",
      name: "mimikatz.exe",
      icon: FileCode,
      risk: 98,
      hash: "a1b2c3d4e5f6...",
      relatedAlerts: 1,
      relationships: ["Detected on David's Laptop", "Known credential dumper"],
    },
  ]

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
      step: "Containment Actions",
      status: "completed",
      timestamp: "2025-11-03T10:54:42Z",
      analyst: "Sarah Chen",
      action: "Implementing containment measures to prevent further attack attempts",
      findings:
        "Blocked 14 source IPs at firewall. Enabled MFA for all admin accounts. Increased monitoring on admin portal.",
      duration: "15m",
    },
    {
      id: 6,
      step: "Root Cause Analysis",
      status: "in_progress", // Changed from "pending" to "in_progress" to show live data
      timestamp: "2025-11-03T11:10:15Z",
      analyst: "Sarah Chen",
      action: "Determine how attacker obtained target credentials",
      findings: "Analyzing attack vectors and exploited vulnerabilities in real-time",
      duration: "ongoing",
    },
    {
      id: 7,
      step: "Remediation & Recovery",
      status: "in_progress", // Changed from "pending" to "in_progress" to show live data
      timestamp: "2025-11-03T11:15:30Z",
      analyst: "Security Team",
      action: "Implement long-term fixes and restore normal operations",
      findings: "Executing remediation actions and monitoring recovery progress",
      duration: "ongoing",
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

  // Added real-time data for Root Cause Analysis and Remediation
  const [rootCauseData, setRootCauseData] = useState({
    vulnerabilities: [
      { id: "CVE-2024-1234", severity: "high", description: "Weak password policy on admin accounts" },
      { id: "CVE-2024-5678", severity: "medium", description: "Missing rate limiting on auth endpoints" },
    ],
    attackVector: "Credential stuffing using compromised credential database",
    initialCompromise: "Weak password on admin@company.com account",
    exploitedWeaknesses: ["No MFA enforcement", "Insufficient account lockout policy", "Weak password complexity"],
    timeline: [
      { time: "10:05 AM", event: "Attacker reconnaissance of admin portal" },
      { time: "10:11 AM", event: "Brute force attack initiated" },
      { time: "10:14 AM", event: "89 failed login attempts detected" },
      { time: "10:27 AM", event: "Lateral movement attempt blocked" },
    ],
  })

  const [remediationData, setRemediationData] = useState({
    immediateActions: [
      { action: "Block malicious IPs at firewall", status: "completed", timestamp: "10:54 AM" },
      { action: "Reset admin credentials", status: "in_progress", timestamp: "11:02 AM" },
      { action: "Enable MFA for all admin accounts", status: "pending", timestamp: null },
    ],
    longTermFixes: [
      { fix: "Implement password complexity requirements", priority: "critical", eta: "2 hours" },
      { fix: "Deploy rate limiting on authentication endpoints", priority: "high", eta: "4 hours" },
      { fix: "Enable account lockout after 3 failed attempts", priority: "high", eta: "1 hour" },
      { fix: "Implement IP reputation filtering", priority: "medium", eta: "1 day" },
    ],
    recoverySteps: [
      { step: "Verify no data exfiltration occurred", status: "in_progress" },
      { step: "Restore normal operations", status: "pending" },
      { step: "Conduct post-incident review", status: "pending" },
    ],
  })

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setChatMessages([
        ...chatMessages,
        {
          id: chatMessages.length + 1,
          user: "You",
          role: "Analyst",
          message: newMessage,
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          avatar: "YO",
        },
      ])
      setNewMessage("")
    }
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      setAnalystNotes([
        ...analystNotes,
        {
          id: analystNotes.length + 1,
          analyst: "You",
          timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          category: noteCategory,
          note: newNote,
        },
      ])
      setNewNote("")
    }
  }

  useEffect(() => {
    if (!incidentData) return

    const interval = setInterval(() => {
      setInvestigationProgress((prev) => Math.min(100, prev + Math.random() * 1))
      setLiveMetrics((prev) => ({
        eventsAnalyzed: prev.eventsAnalyzed + Math.floor(Math.random() * 2),
        iocsIdentified: prev.iocsIdentified + (Math.random() > 0.8 ? 1 : 0),
        threatsBlocked: prev.threatsBlocked + (Math.random() > 0.9 ? 1 : 0),
        alertsTriggered: prev.alertsTriggered + (Math.random() > 0.95 ? 1 : 0),
      }))

      setRootCauseData((prev) => {
        const updated = { ...prev }
        // Randomly add new timeline events
        if (Math.random() > 0.7 && updated.timeline.length < 8) {
          const newEvents = [
            {
              time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
              event: "Additional IOC discovered in network logs",
            },
            {
              time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
              event: "Credential database breach confirmed",
            },
            {
              time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
              event: "Similar attack pattern detected in historical data",
            },
          ]
          const randomEvent = newEvents[Math.floor(Math.random() * newEvents.length)]
          if (!updated.timeline.some((e) => e.event === randomEvent.event)) {
            updated.timeline = [...updated.timeline, randomEvent]
          }
        }
        // Randomly add new vulnerabilities
        if (Math.random() > 0.85 && updated.vulnerabilities.length < 4) {
          const newVulns = [
            { id: "CVE-2024-9012", severity: "medium", description: "Outdated authentication library" },
            { id: "CVE-2024-3456", severity: "high", description: "Session management vulnerability" },
          ]
          const randomVuln = newVulns[Math.floor(Math.random() * newVulns.length)]
          if (!updated.vulnerabilities.some((v) => v.id === randomVuln.id)) {
            updated.vulnerabilities = [...updated.vulnerabilities, randomVuln]
          }
        }
        return updated
      })

      setRemediationData((prev) => {
        const updated = { ...prev }

        // Simulate progress on immediate actions
        updated.immediateActions = updated.immediateActions.map((action) => {
          if (action.status === "in_progress" && Math.random() > 0.6) {
            return {
              ...action,
              status: "completed",
              timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            }
          }
          if (action.status === "pending" && Math.random() > 0.8) {
            return {
              ...action,
              status: "in_progress",
              timestamp: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
            }
          }
          return action
        })

        // Simulate progress on recovery steps
        updated.recoverySteps = updated.recoverySteps.map((step) => {
          if (step.status === "pending" && Math.random() > 0.85) {
            return { ...step, status: "in_progress" }
          }
          if (step.status === "in_progress" && Math.random() > 0.9) {
            return { ...step, status: "completed" }
          }
          return step
        })

        return updated
      })
    }, 3000) // Reduced interval to 3 seconds for more frequent updates

    return () => clearInterval(interval)
  }, [incidentData])

  if (!incidentData) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <Brain className="h-12 w-12 text-purple-400 animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">Loading incident data...</p>
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
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/incidents/${incidentId}`)}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Incident
          </Button>

          {/* Progress Banner */}
          <div className="bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 rounded-xl border border-purple-500/30 shadow-2xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl animate-pulse">
                  <Brain className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Analyst Mode</h2>
                  <p className="text-sm text-gray-400">Real-time Investigation Workspace</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-1">Investigation Progress</p>
                <div className="flex items-center gap-3">
                  <div className="h-3 w-48 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 transition-all duration-1000"
                      style={{ width: `${investigationProgress}%` }}
                    />
                  </div>
                  <span className="text-2xl font-bold text-purple-400">{investigationProgress.toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-lg p-4 border border-cyan-500/30">
                <p className="text-xs text-gray-400 mb-1">Events Analyzed</p>
                <p className="text-2xl font-bold text-cyan-400">{liveMetrics.eventsAnalyzed}</p>
                <Badge className="mt-2 text-[9px] bg-cyan-500/20 text-cyan-400 border-cyan-500/50 animate-pulse">
                  LIVE
                </Badge>
              </div>
              <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/30">
                <p className="text-xs text-gray-400 mb-1">IOCs Identified</p>
                <p className="text-2xl font-bold text-purple-400">{liveMetrics.iocsIdentified}</p>
                <Badge className="mt-2 text-[9px] bg-purple-500/20 text-purple-400 border-purple-500/50 animate-pulse">
                  LIVE
                </Badge>
              </div>
              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/30">
                <p className="text-xs text-gray-400 mb-1">Threats Blocked</p>
                <p className="text-2xl font-bold text-green-400">{liveMetrics.threatsBlocked}</p>
                <Badge className="mt-2 text-[9px] bg-green-500/20 text-green-400 border-green-500/50 animate-pulse">
                  LIVE
                </Badge>
              </div>
              <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/30">
                <p className="text-xs text-gray-400 mb-1">Alerts Triggered</p>
                <p className="text-2xl font-bold text-orange-400">{liveMetrics.alertsTriggered}</p>
                <Badge className="mt-2 text-[9px] bg-orange-500/20 text-orange-400 border-orange-500/50 animate-pulse">
                  LIVE
                </Badge>
              </div>
            </div>
          </div>

          <Tabs defaultValue="investigation" className="w-full">
            <TabsList className="bg-[#0f0f0f] border border-border/30 mb-6">
              <TabsTrigger
                value="investigation"
                className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400"
              >
                <Activity className="h-4 w-4 mr-2" />
                Investigation
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
              >
                <Shield className="h-4 w-4 mr-2" />
                Security & Entities
              </TabsTrigger>
            </TabsList>

            <TabsContent value="investigation" className="space-y-6">
              <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-xl border border-cyan-500/30 shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Shield className="h-5 w-5 text-cyan-400" />
                    MITRE ATT&CK Framework Mapping
                  </h3>
                  <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-xs">
                    {mitreAttackMapping.length} Tactics Detected
                  </Badge>
                </div>
                <div className="relative">
                  {/* Connection Lines */}
                  <div className="absolute top-14 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-blue-500 to-green-500 opacity-30" />

                  <div className="flex items-start justify-between gap-2 relative">
                    {mitreAttackMapping.map((item, idx) => (
                      <div key={idx} className="flex flex-col items-center flex-1 relative">
                        {/* Tactic Badge */}
                        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                          <Badge className="text-[10px] bg-gray-800 text-gray-400 border-gray-700">{item.tactic}</Badge>
                        </div>

                        {/* Icon Container */}
                        <div
                          className={cn(
                            "w-28 h-28 rounded-2xl flex flex-col items-center justify-center mb-3 border-2 transition-all relative z-10 p-2",
                            item.color === "red" && "bg-red-500/20 border-red-500 shadow-lg shadow-red-500/50",
                            item.color === "orange" &&
                              "bg-orange-500/20 border-orange-500 shadow-lg shadow-orange-500/50",
                            item.color === "yellow" &&
                              "bg-yellow-500/20 border-yellow-500 shadow-lg shadow-yellow-500/50",
                            item.color === "blue" && "bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/50",
                            item.color === "green" &&
                              "bg-green-500/20 border-green-500 shadow-lg shadow-green-500/50 animate-pulse",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-8 w-8 mb-2",
                              item.color === "red" && "text-red-400",
                              item.color === "orange" && "text-orange-400",
                              item.color === "yellow" && "text-yellow-400",
                              item.color === "blue" && "text-blue-400",
                              item.color === "green" && "text-green-400",
                            )}
                          />
                          <p className="text-[10px] font-mono text-center text-white">{item.technique}</p>
                        </div>

                        {/* Status & Details */}
                        <Badge
                          className={cn(
                            "text-[9px] mb-2",
                            item.color === "red" && "bg-red-500/20 text-red-400 border-red-500/50",
                            item.color === "orange" && "bg-orange-500/20 text-orange-400 border-orange-500/50",
                            item.color === "yellow" && "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
                            item.color === "blue" && "bg-blue-500/20 text-blue-400 border-blue-500/50",
                            item.color === "green" && "bg-green-500/20 text-green-400 border-green-500/50",
                          )}
                        >
                          {item.status.toUpperCase()}
                        </Badge>
                        <p className="text-xs text-gray-300 text-center mb-1 px-1">{item.description}</p>
                        <div className="flex items-center gap-1 mb-1">
                          <Badge
                            className={cn(
                              "text-[8px]",
                              item.severity === "critical" && "bg-red-500/10 text-red-400 border-red-500/30",
                              item.severity === "high" && "bg-orange-500/10 text-orange-400 border-orange-500/30",
                              item.severity === "medium" && "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
                            )}
                          >
                            {item.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="h-1 w-16 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full",
                                item.color === "red" && "bg-red-500",
                                item.color === "orange" && "bg-orange-500",
                                item.color === "yellow" && "bg-yellow-500",
                                item.color === "blue" && "bg-blue-500",
                                item.color === "green" && "bg-green-500",
                              )}
                              style={{ width: `${item.detectionConfidence}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-gray-400">{item.detectionConfidence}%</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Network Topology */}
              <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-xl border border-red-500/30 shadow-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Network className="h-5 w-5 text-red-400" />
                  Network Topology & Attack Path
                </h3>
                <div className="flex items-center justify-center gap-6">
                  {/* Attacker */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-red-500/30 rounded-2xl blur-xl animate-pulse" />
                      <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-red-500/20 to-red-600/20 border-2 border-red-500 shadow-2xl shadow-red-500/50 flex items-center justify-center mb-3">
                        <AlertTriangle className="h-14 w-14 text-red-400" />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white mb-1">Threat Actor</p>
                    <p className="text-xs text-gray-400 font-mono mb-1">{networkTopology.attacker.ip}</p>
                    <Badge className="text-[9px] bg-red-500/20 text-red-400 border-red-500/50 mb-1">
                      🇷🇺 {networkTopology.attacker.country}
                    </Badge>
                    <p className="text-xs text-gray-500 mb-1">{networkTopology.attacker.org}</p>
                    <div className="flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded">
                      <Crosshair className="h-3 w-3 text-red-400" />
                      <span className="text-xs text-gray-400">Risk:</span>
                      <span className="text-sm font-bold text-red-400">{networkTopology.attacker.risk}</span>
                    </div>
                  </div>

                  {/* Attack Arrow */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-0.5 w-16 bg-gradient-to-r from-red-500 to-orange-500 animate-pulse" />
                      <ArrowRight className="h-10 w-10 text-red-400 animate-pulse" />
                      <div className="h-0.5 w-16 bg-gradient-to-r from-red-500 to-orange-500 animate-pulse" />
                    </div>
                    <Badge className="mt-2 text-[9px] bg-red-500/20 text-red-400 border-red-500/50 animate-pulse">
                      ACTIVE ATTACK
                    </Badge>
                  </div>

                  {/* Target */}
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-orange-500/30 rounded-2xl blur-xl" />
                      <div className="relative w-32 h-32 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-2 border-orange-500 shadow-2xl shadow-orange-500/50 flex items-center justify-center mb-3">
                        <Server className="h-14 w-14 text-orange-400" />
                      </div>
                    </div>
                    <p className="text-sm font-bold text-white mb-1">Primary Target</p>
                    <p className="text-xs text-gray-400 mb-1">{networkTopology.target.name}</p>
                    <p className="text-xs text-gray-500 font-mono mb-1">{networkTopology.target.ip}</p>
                    <Badge className="text-[9px] bg-orange-500/20 text-orange-400 border-orange-500/50 mb-1">
                      {networkTopology.target.type}
                    </Badge>
                    <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded">
                      <Shield className="h-3 w-3 text-orange-400" />
                      <span className="text-xs text-gray-400">Risk:</span>
                      <span className="text-sm font-bold text-orange-400">{networkTopology.target.risk}</span>
                    </div>
                  </div>

                  {/* Lateral Movement Arrow */}
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <div className="h-0.5 w-12 bg-gradient-to-r from-orange-500 to-yellow-500" />
                      <ArrowRight className="h-8 w-8 text-yellow-400" />
                      <div className="h-0.5 w-12 bg-gradient-to-r from-orange-500 to-yellow-500" />
                    </div>
                    <Badge className="mt-2 text-[9px] bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                      LATERAL SPREAD
                    </Badge>
                  </div>

                  {/* Affected Systems */}
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-white text-center mb-1">Affected Assets</p>
                    {networkTopology.affected.map((system, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 bg-yellow-500/10 rounded-lg p-2 border border-yellow-500/30"
                      >
                        <div className="w-12 h-12 rounded-lg bg-yellow-500/20 border border-yellow-500 flex items-center justify-center flex-shrink-0">
                          {system.type === "User Account" ? (
                            <User className="h-6 w-6 text-yellow-400" />
                          ) : system.type === "Endpoint" ? (
                            <Laptop className="h-6 w-6 text-yellow-400" />
                          ) : (
                            <Server className="h-6 w-6 text-yellow-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-white truncate">{system.name}</p>
                          <Badge className="text-[8px] bg-yellow-500/20 text-yellow-400 border-yellow-500/50 mt-1">
                            {system.type}
                          </Badge>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-gray-400">Risk: {system.risk}</span>
                            <span className="text-[10px] text-gray-500">• {system.attempts} attempts</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                {/* Investigation Steps - Column 1 */}
                <div className="col-span-4 space-y-4">
                  <div className="bg-[#0f0f0f] rounded-xl border border-border/30 p-5">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-cyan-400" />
                      Investigation Steps
                    </h3>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                      {triageSteps.map((step) => (
                        <div
                          key={step.id}
                          className={cn(
                            "bg-[#1a1a1a] rounded-lg border p-4 transition-all",
                            step.status === "completed" && "border-green-500/30",
                            step.status === "in_progress" && "border-yellow-500/30 shadow-lg shadow-yellow-500/10",
                            step.status === "pending" && "border-border/20 opacity-60",
                          )}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "w-6 h-6 rounded-full flex items-center justify-center",
                                  step.status === "completed" && "bg-green-500/20 text-green-400",
                                  step.status === "in_progress" && "bg-yellow-500/20 text-yellow-400",
                                  step.status === "pending" && "bg-gray-700 text-gray-400",
                                )}
                              >
                                {step.status === "completed" && <CheckCircle2 className="h-3 w-3" />}
                                {step.status === "in_progress" && <Activity className="h-3 w-3 animate-pulse" />}
                                {step.status === "pending" && <span className="text-[10px]">{step.id}</span>}
                              </div>
                              <h4 className="text-sm font-semibold text-white">{step.step}</h4>
                            </div>
                            {step.duration && (
                              <Badge variant="outline" className="text-[10px]">
                                {step.duration}
                              </Badge>
                            )}
                          </div>

                          {step.analyst && (
                            <p className="text-xs text-gray-400 mb-2">
                              <User className="h-3 w-3 inline mr-1" />
                              {step.analyst}
                            </p>
                          )}

                          {step.findings && <p className="text-xs text-gray-300">{step.findings}</p>}

                          {step.step === "Root Cause Analysis" && step.status === "in_progress" && (
                            <div className="mt-3 pt-3 border-t border-border/20">
                              <div className="flex items-center gap-2 mb-3">
                                <Badge className="text-[9px] bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse">
                                  LIVE ANALYSIS
                                </Badge>
                                <div className="flex gap-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse delay-75" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse delay-150" />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div className="bg-cyan-500/5 rounded-lg p-2 border border-cyan-500/20">
                                  <p className="text-xs font-semibold text-white mb-1">Attack Vector:</p>
                                  <p className="text-xs text-gray-300">{rootCauseData.attackVector}</p>
                                </div>
                                <div className="bg-orange-500/5 rounded-lg p-2 border border-orange-500/20">
                                  <p className="text-xs font-semibold text-white mb-1">Initial Compromise:</p>
                                  <p className="text-xs text-gray-300">{rootCauseData.initialCompromise}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3 text-red-400" />
                                    Exploited Weaknesses:
                                  </p>
                                  <div className="flex flex-wrap gap-1">
                                    {rootCauseData.exploitedWeaknesses.map((weakness, idx) => (
                                      <Badge
                                        key={idx}
                                        className="text-[8px] bg-red-500/10 text-red-400 border-red-500/30"
                                      >
                                        {weakness}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1">
                                    <Shield className="h-3 w-3 text-orange-400" />
                                    Vulnerabilities ({rootCauseData.vulnerabilities.length}):
                                  </p>
                                  {rootCauseData.vulnerabilities.map((vuln, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-start gap-2 mb-2 bg-orange-500/5 rounded p-2 border border-orange-500/20"
                                    >
                                      <Badge
                                        className={cn(
                                          "text-[8px] flex-shrink-0",
                                          vuln.severity === "high" &&
                                            "bg-orange-500/10 text-orange-400 border-orange-500/30",
                                          vuln.severity === "medium" &&
                                            "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
                                        )}
                                      >
                                        {vuln.id}
                                      </Badge>
                                      <span className="text-[10px] text-gray-300">{vuln.description}</span>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1">
                                    <Activity className="h-3 w-3 text-purple-400 animate-pulse" />
                                    Attack Timeline ({rootCauseData.timeline.length} events):
                                  </p>
                                  <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {rootCauseData.timeline.map((event, idx) => (
                                      <div key={idx} className="flex items-start gap-2 text-[10px]">
                                        <span className="text-cyan-400 font-mono flex-shrink-0">{event.time}</span>
                                        <span className="text-gray-300">{event.event}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {step.step === "Remediation & Recovery" && step.status === "in_progress" && (
                            <div className="mt-3 pt-3 border-t border-border/20">
                              <div className="flex items-center gap-2 mb-3">
                                <Badge className="text-[9px] bg-green-500/10 text-green-400 border-green-500/30 animate-pulse">
                                  LIVE REMEDIATION
                                </Badge>
                                <div className="flex gap-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse delay-75" />
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse delay-150" />
                                </div>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1">
                                    <CheckCircle2 className="h-3 w-3 text-green-400" />
                                    Immediate Actions:
                                  </p>
                                  {remediationData.immediateActions.map((action, idx) => (
                                    <div
                                      key={idx}
                                      className={cn(
                                        "flex items-center gap-2 mb-2 p-2 rounded border",
                                        action.status === "completed" && "bg-green-500/5 border-green-500/20",
                                        action.status === "in_progress" &&
                                          "bg-yellow-500/5 border-yellow-500/20 animate-pulse",
                                        action.status === "pending" && "bg-gray-500/5 border-gray-500/20",
                                      )}
                                    >
                                      {action.status === "completed" && (
                                        <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" />
                                      )}
                                      {action.status === "in_progress" && (
                                        <Activity className="h-3 w-3 text-yellow-400 animate-pulse flex-shrink-0" />
                                      )}
                                      {action.status === "pending" && (
                                        <div className="h-3 w-3 rounded-full border border-gray-500 flex-shrink-0" />
                                      )}
                                      <span className="text-[10px] text-gray-300 flex-1">{action.action}</span>
                                      {action.timestamp && (
                                        <span className="text-[9px] text-gray-500 font-mono">{action.timestamp}</span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1">
                                    <Shield className="h-3 w-3 text-blue-400" />
                                    Long-term Fixes:
                                  </p>
                                  {remediationData.longTermFixes.map((fix, idx) => (
                                    <div key={idx} className="mb-2 bg-blue-500/5 rounded p-2 border border-blue-500/20">
                                      <div className="flex items-center gap-2 mb-1">
                                        <Badge
                                          className={cn(
                                            "text-[8px]",
                                            fix.priority === "critical" &&
                                              "bg-red-500/10 text-red-400 border-red-500/30",
                                            fix.priority === "high" &&
                                              "bg-orange-500/10 text-orange-400 border-orange-500/30",
                                            fix.priority === "medium" &&
                                              "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
                                          )}
                                        >
                                          {fix.priority.toUpperCase()}
                                        </Badge>
                                        <span className="text-[10px] text-gray-300 flex-1">{fix.fix}</span>
                                      </div>
                                      <div className="flex items-center gap-1 ml-1">
                                        <span className="text-[9px] text-gray-500">ETA:</span>
                                        <span className="text-[9px] text-cyan-400 font-mono">{fix.eta}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div>
                                  <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1">
                                    <Activity className="h-3 w-3 text-purple-400" />
                                    Recovery Progress:
                                  </p>
                                  {remediationData.recoverySteps.map((step, idx) => (
                                    <div
                                      key={idx}
                                      className={cn(
                                        "flex items-center gap-2 mb-1 p-2 rounded border",
                                        step.status === "completed" && "bg-green-500/5 border-green-500/20",
                                        step.status === "in_progress" && "bg-purple-500/5 border-purple-500/20",
                                        step.status === "pending" && "bg-gray-500/5 border-gray-500/20",
                                      )}
                                    >
                                      {step.status === "completed" && (
                                        <CheckCircle2 className="h-3 w-3 text-green-400 flex-shrink-0" />
                                      )}
                                      {step.status === "in_progress" && (
                                        <Activity className="h-3 w-3 text-purple-400 animate-pulse flex-shrink-0" />
                                      )}
                                      {step.status === "pending" && (
                                        <div className="h-3 w-3 rounded-full border border-gray-500 flex-shrink-0" />
                                      )}
                                      <span className="text-[10px] text-gray-300">{step.step}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="col-span-4 space-y-4">
                  <div className="bg-[#0f0f0f] rounded-xl border border-purple-500/30 p-5">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-400" />
                      Analyst Notes
                    </h3>

                    {/* Add Note Form */}
                    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-border/20 mb-4">
                      <p className="text-sm font-semibold text-white mb-3">Add Triage Note</p>
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Category</label>
                          <select
                            value={noteCategory}
                            onChange={(e) => setNoteCategory(e.target.value)}
                            className="w-full bg-[#0f0f0f] border border-border/30 rounded-lg px-3 py-2 text-sm text-white"
                          >
                            <option value="Finding">Finding</option>
                            <option value="Action">Action</option>
                            <option value="Observation">Observation</option>
                            <option value="Recommendation">Recommendation</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-gray-400 mb-1 block">Note</label>
                          <Textarea
                            placeholder="Enter your triage findings, actions taken, or observations..."
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="bg-[#0f0f0f] border-border/30 text-white placeholder:text-gray-500 min-h-[100px]"
                          />
                        </div>
                        <Button
                          onClick={handleAddNote}
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Note
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-3">
                        📝 Document your investigation findings and actions for the incident record
                      </p>
                    </div>

                    {/* Notes List */}
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      <p className="text-sm font-semibold text-white mb-2">Recent Notes</p>
                      {analystNotes.map((note) => (
                        <div key={note.id} className="bg-[#1a1a1a] rounded-lg p-3 border border-border/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Badge
                                className={cn(
                                  "text-[9px]",
                                  note.category === "Finding" && "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
                                  note.category === "Action" && "bg-green-500/20 text-green-400 border-green-500/50",
                                  note.category === "Observation" &&
                                    "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
                                  note.category === "Recommendation" &&
                                    "bg-purple-500/20 text-purple-400 border-purple-500/50",
                                )}
                              >
                                {note.category}
                              </Badge>
                              <span className="text-xs text-gray-400">{note.timestamp}</span>
                            </div>
                          </div>
                          <p className="text-xs text-gray-300 mb-1">{note.note}</p>
                          <p className="text-xs text-gray-500">— {note.analyst}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enrichment Data */}
                  <div className="bg-[#0f0f0f] rounded-xl border border-border/30 p-5">
                    <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                      <Shield className="h-4 w-4 text-red-400" />
                      Threat Intel
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Reputation Score</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                              style={{ width: `${enrichmentData.threatIntel.reputation}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-red-400">
                            {enrichmentData.threatIntel.reputation}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Category</p>
                        <Badge className="bg-red-500/10 text-red-400 border-red-500/30 text-xs">
                          {enrichmentData.threatIntel.category}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-2">Associated Malware</p>
                        <div className="flex flex-wrap gap-1">
                          {enrichmentData.threatIntel.associatedMalware.map((malware, idx) => (
                            <Badge
                              key={idx}
                              className="text-[10px] px-2 py-0.5 bg-purple-500/10 text-purple-400 border-purple-500/30"
                            >
                              {malware}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-4 space-y-4">
                  <div className="bg-[#0f0f0f] rounded-xl border border-cyan-500/30 p-5 h-[700px] flex flex-col">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <MessageSquare className="h-5 w-5 text-cyan-400" />
                      Analyst Collaboration
                    </h3>

                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="bg-[#1a1a1a] rounded-lg p-3 border border-border/20">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                              {msg.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="text-sm font-semibold text-white">{msg.user}</p>
                                <Badge className="text-[9px] bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                                  {msg.role}
                                </Badge>
                                <span className="text-xs text-gray-400 ml-auto">{msg.timestamp}</span>
                              </div>
                              <p className="text-sm text-gray-300">{msg.message}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Input */}
                    <div className="border-t border-border/30 pt-4">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message to the team..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                          className="flex-1 bg-[#1a1a1a] border-border/30 text-white placeholder:text-gray-500"
                        />
                        <Button
                          onClick={handleSendMessage}
                          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        💡 Collaborate with your team in real-time during the investigation
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              {/* Entity Relationship Diagram */}
              <div className="bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] rounded-xl border border-purple-500/30 shadow-2xl p-6">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <Network className="h-5 w-5 text-purple-400" />
                  Entity Relationship Map
                </h3>

                <div className="flex items-center justify-center gap-8 mb-8">
                  {/* Attacker IPs */}
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-white text-center mb-2">Threat Actors</p>
                    {entities
                      .filter((e) => e.type === "IP Address")
                      .map((entity) => (
                        <div
                          key={entity.id}
                          className="flex items-center gap-3 bg-red-500/10 rounded-lg p-3 border border-red-500/30 w-64"
                        >
                          <div className="w-10 h-10 rounded-lg bg-red-500/20 border border-red-500 flex items-center justify-center flex-shrink-0">
                            <entity.icon className="h-5 w-5 text-red-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{entity.name}</p>
                            <Badge className="text-[8px] bg-red-500/20 text-red-400 border-red-500/50 mt-1">
                              🌍 {entity.country}
                            </Badge>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-gray-400">Risk: {entity.risk}</span>
                              <span className="text-[10px] text-gray-500">• {entity.relatedAlerts} alerts</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Connection Arrow */}
                  <div className="flex flex-col items-center">
                    <ArrowRight className="h-12 w-12 text-red-400 animate-pulse" />
                    <Badge className="mt-2 text-[9px] bg-red-500/20 text-red-400 border-red-500/50 animate-pulse">
                      ATTACKS
                    </Badge>
                  </div>

                  {/* Targets */}
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-white text-center mb-2">Targets</p>
                    {entities
                      .filter((e) => e.type === "User" || e.type === "Host")
                      .map((entity) => (
                        <div
                          key={entity.id}
                          className="flex items-center gap-3 bg-orange-500/10 rounded-lg p-3 border border-orange-500/30 w-64"
                        >
                          <div className="w-10 h-10 rounded-lg bg-orange-500/20 border border-orange-500 flex items-center justify-center flex-shrink-0">
                            <entity.icon className="h-5 w-5 text-orange-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{entity.name}</p>
                            <Badge className="text-[8px] bg-orange-500/20 text-orange-400 border-orange-500/50 mt-1">
                              {entity.type}
                            </Badge>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-gray-400">Risk: {entity.risk}</span>
                              <span className="text-[10px] text-gray-500">• {entity.relatedAlerts} alerts</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Connection Arrow */}
                  <div className="flex flex-col items-center">
                    <ArrowRight className="h-10 w-10 text-yellow-400" />
                    <Badge className="mt-2 text-[9px] bg-yellow-500/20 text-yellow-400 border-yellow-500/50">
                      CONNECTS
                    </Badge>
                  </div>

                  {/* Related Assets */}
                  <div className="flex flex-col gap-3">
                    <p className="text-xs font-semibold text-white text-center mb-2">Related Assets</p>
                    {entities
                      .filter((e) => e.type === "Service" || e.type === "File")
                      .map((entity) => (
                        <div
                          key={entity.id}
                          className="flex items-center gap-3 bg-purple-500/10 rounded-lg p-3 border border-purple-500/30 w-64"
                        >
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 border border-purple-500 flex items-center justify-center flex-shrink-0">
                            <entity.icon className="h-5 w-5 text-purple-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{entity.name}</p>
                            <Badge className="text-[8px] bg-purple-500/20 text-purple-400 border-purple-500/50 mt-1">
                              {entity.type}
                            </Badge>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] text-gray-400">Risk: {entity.risk}</span>
                              <span className="text-[10px] text-gray-500">• {entity.relatedAlerts} alerts</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Detailed Entity List */}
              <div className="grid grid-cols-2 gap-6">
                {entities.map((entity) => (
                  <div key={entity.id} className="bg-[#0f0f0f] rounded-xl border border-border/30 p-5">
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={cn(
                          "w-14 h-14 rounded-xl flex items-center justify-center border-2",
                          entity.risk >= 90 && "bg-red-500/20 border-red-500",
                          entity.risk >= 70 && entity.risk < 90 && "bg-orange-500/20 border-orange-500",
                          entity.risk < 70 && "bg-yellow-500/20 border-yellow-500",
                        )}
                      >
                        <entity.icon
                          className={cn(
                            "h-7 w-7",
                            entity.risk >= 90 && "text-red-400",
                            entity.risk >= 70 && entity.risk < 90 && "text-orange-400",
                            entity.risk < 70 && "text-yellow-400",
                          )}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-bold text-white">{entity.name}</h4>
                          <Badge
                            className={cn(
                              "text-[9px]",
                              entity.risk >= 90 && "bg-red-500/20 text-red-400 border-red-500/50",
                              entity.risk >= 70 &&
                                entity.risk < 90 &&
                                "bg-orange-500/20 text-orange-400 border-orange-500/50",
                              entity.risk < 70 && "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
                            )}
                          >
                            Risk: {entity.risk}
                          </Badge>
                        </div>
                        <Badge className="text-[9px] bg-purple-500/10 text-purple-400 border-purple-500/30 mb-2">
                          {entity.type}
                        </Badge>
                        {entity.country && <p className="text-xs text-gray-400 mb-1">🌍 {entity.country}</p>}
                        {entity.department && <p className="text-xs text-gray-400 mb-1">👤 {entity.department}</p>}
                        {entity.os && <p className="text-xs text-gray-400 mb-1">💻 {entity.os}</p>}
                        {entity.service && <p className="text-xs text-gray-400 mb-1">⚙️ {entity.service}</p>}
                        {entity.hash && <p className="text-xs text-gray-400 font-mono mb-1">🔒 {entity.hash}</p>}
                      </div>
                    </div>

                    <div className="border-t border-border/30 pt-3">
                      <p className="text-xs font-semibold text-white mb-2 flex items-center gap-1">
                        <Link className="h-3 w-3" />
                        Relationships ({entity.relationships.length})
                      </p>
                      <div className="space-y-1">
                        {entity.relationships.map((rel, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-1 h-1 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                            <p className="text-xs text-gray-300">{rel}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-border/30 pt-3 mt-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">Related Alerts</p>
                        <Badge className="text-[9px] bg-cyan-500/10 text-cyan-400 border-cyan-500/30">
                          {entity.relatedAlerts} alerts
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
