"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Shield,
  AlertTriangle,
  Activity,
  ChevronRight,
  Clock,
  Download,
  RefreshCw,
  Search,
  ExternalLink,
  Info,
} from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AIAnalystPage() {
  const [activeTab, setActiveTab] = useState("insights")
  const [selectedPeriod, setSelectedPeriod] = useState("Past 7 Days")
  const [searchQuery, setSearchQuery] = useState("")

  const [metricsData, setMetricsData] = useState({
    mttd: { current: 1.2, previous: 1.4, change: -14.3, target: 1.0, unit: "hours" },
    mttr: { current: 2.4, previous: 2.6, change: -7.7, target: 2.0, unit: "hours" },
    mttrRemediate: { current: 8.6, previous: 9.2, change: -6.5, target: 8.0, unit: "hours" },
    falsePositiveRate: { current: 12, previous: 10, change: 20.0, target: 5, unit: "%" },
    alertTriageRate: { current: 94, previous: 90, change: 4.4, target: 95, unit: "%" },
    slaCompliance: { current: 98.5, previous: 97.2, change: 1.3, target: 99, unit: "%" },
  })

  const [centralMetrics, setCentralMetrics] = useState({
    totalInsights: 136,
    allowed: 54,
    blocked: 82,
    totalThreats: 15000,
    threatsAllowed: 12600,
    threatsBlocked: 2400,
  })

  const [keyInsights, setKeyInsights] = useState([
    {
      id: 1,
      title: "Potential Data Exfiltration Detected",
      description:
        "Unusual outbound connections from SCADA systems to external IP addresses detected in the last 24 hours. Pattern suggests compromised credentials.",
      confidence: 92,
      tags: ["Production SCADA", "Power Management"],
      timestamp: "2 hours ago",
      severity: "critical",
    },
    {
      id: 2,
      title: "Firmware Vulnerability Exploitation Attempt",
      description:
        "Multiple attempts to exploit CVE-2023-1234 on PLCs running outdated firmware. Signature matches known threat actor techniques.",
      confidence: 87,
      tags: ["Assembly Line PLCs", "Packaging Controllers"],
      timestamp: "5 hours ago",
      severity: "high",
    },
    {
      id: 3,
      title: "Unusual Authentication Patterns",
      description:
        "Multiple failed login attempts to OT systems from unusual workstations, followed by successful logins. Possible credential stuffing attack.",
      confidence: 78,
      tags: ["Engineering Workstations", "HMI Terminals"],
      timestamp: "12 hours ago",
      severity: "medium",
    },
    {
      id: 4,
      title: "UAE Critical Infrastructure Targeting Detected",
      description:
        "Coordinated reconnaissance activity targeting UAE government and energy sector systems. Attack patterns match Desert Falcon APT group techniques with focus on Emirates ID authentication systems.",
      confidence: 89,
      tags: ["UAE Pass", "Critical Infrastructure", "Desert Falcon"],
      timestamp: "6 hours ago",
      severity: "critical",
    },
  ])

  const [activeCases, setActiveCases] = useState([
    {
      id: "CASE-001",
      title: "Data Exfiltration Investigation",
      assignee: "Alex Chen",
      severity: "critical",
      timestamp: "2h ago",
    },
    {
      id: "CASE-002",
      title: "Firmware Vulnerability Exploitation",
      assignee: "Jamie Rodriguez",
      severity: "high",
      timestamp: "5h ago",
    },
    {
      id: "CASE-003",
      title: "Unusual Authentication Patterns",
      assignee: "Taylor Kim",
      severity: "medium",
      timestamp: "12h ago",
    },
    {
      id: "CASE-004",
      title: "UAE Infrastructure Reconnaissance",
      assignee: "Fatima Al-Mansoori",
      severity: "high",
      timestamp: "6h ago",
    },
  ])

  const [threatIntelligence, setThreatIntelligence] = useState([
    {
      id: 1,
      title: "APT-27 Activity",
      description: "New campaign targeting industrial control systems with focus on energy sector.",
      timestamp: "2 days ago",
    },
    {
      id: 2,
      title: "CVE-2023-1234",
      description: "Critical vulnerability in PLC firmware being actively exploited in the wild.",
      timestamp: "3 days ago",
    },
    {
      id: 3,
      title: "Desert Falcon APT Campaign",
      description:
        "Increased activity targeting UAE government portals and critical infrastructure with advanced persistent threats.",
      timestamp: "1 day ago",
    },
  ])

  const [recommendations, setRecommendations] = useState({
    critical: [
      {
        title: "Isolate Compromised SCADA Systems",
        description:
          "Immediately isolate the compromised SCADA systems from the network to prevent further data exfiltration and potential control system manipulation.",
        effort: "Medium Effort",
        tags: ["Production SCADA", "Power Management"],
      },
      {
        title: "Update PLC Firmware",
        description:
          "Apply security patches to vulnerable PLCs to address CVE-2023-1234 which is being actively exploited.",
        effort: "High Effort",
        tags: ["Assembly Line PLCs", "Packaging Controllers"],
      },
      {
        title: "Implement Network Segmentation",
        description:
          "Enhance network segmentation between IT and OT networks to prevent lateral movement in case of compromise.",
        effort: "High Effort",
        tags: ["Network Infrastructure"],
      },
    ],
    high: [
      {
        title: "Enhance Authentication Controls",
        description: "Implement multi-factor authentication for all access to OT systems and engineering workstations.",
        effort: "Medium Effort",
        tags: ["Engineering Workstations", "HMI Terminals"],
      },
      {
        title: "Conduct Forensic Investigation",
        description:
          "Perform forensic analysis on compromised systems to determine the full extent of the breach and identify any persistence mechanisms.",
        effort: "High Effort",
        tags: ["Production SCADA", "Engineering Workstations"],
      },
      {
        title: "Review Firewall Rules",
        description: "Audit and tighten firewall rules to restrict unnecessary outbound connections from OT networks.",
        effort: "Medium Effort",
        tags: ["Network Infrastructure"],
      },
    ],
    medium: [
      {
        title: "Enhance Security Monitoring",
        description:
          "Deploy additional security monitoring tools specifically designed for OT environments to improve detection capabilities.",
        effort: "Medium Effort",
        tags: ["Security Infrastructure"],
      },
      {
        title: "Conduct Security Training",
        description:
          "Provide specialized security awareness training for OT personnel focusing on industrial control system threats.",
        effort: "Low Effort",
        tags: ["Personnel"],
      },
      {
        title: "Develop Incident Response Playbooks",
        description: "Create detailed incident response playbooks specifically for OT security incidents.",
        effort: "Medium Effort",
        tags: ["Security Operations"],
      },
    ],
  })

  const [emergingThreats, setEmergingThreats] = useState([
    {
      title: "Increase in OT Network Scanning",
      description:
        "There has been a 35% increase in reconnaissance activity targeting OT networks over the past 14 days. The scanning patterns match those used by APT-27 and indicate potential preparation for targeted attacks.",
      tags: ["Reconnaissance", "OT Networks", "APT-27"],
    },
    {
      title: "New Malware Variant Targeting SCADA Systems",
      description:
        "A new variant of the INDUSTROYER malware has been detected in the wild, specifically targeting SCADA systems in the energy sector. The malware uses advanced evasion techniques and can manipulate industrial control processes.",
      tags: ["Malware", "SCADA", "INDUSTROYER"],
    },
    {
      title: "Supply Chain Compromise Risk",
      description:
        "Intelligence indicates increased risk of supply chain compromises targeting industrial automation vendors. Several vendors have reported attempted breaches of their software development environments.",
      tags: ["Supply Chain", "Vendors", "Software"],
    },
    {
      title: "UAE Pass Authentication System Exploitation Attempts",
      description:
        "Intelligence indicates targeted attacks against UAE Pass digital identity infrastructure. Threat actors are attempting to compromise Emirates ID verification systems and government portal access controls.",
      tags: ["UAE Pass", "Digital Identity", "Government Systems"],
    },
  ])

  const [insights, setInsights] = useState([
    {
      id: 1,
      name: "Data Exfiltration",
      icon: "🔒",
      applications: 18,
      threats: 6500,
      rank: "Most Critical",
      position: 3,
      confidence: 92,
      color: "from-cyan-500 to-blue-500",
      ringColor: "border-cyan-500",
    },
    {
      id: 2,
      name: "Firmware Exploitation",
      icon: "⚙️",
      applications: 8,
      threats: 3500,
      rank: "2nd",
      position: 2,
      confidence: 87,
      color: "from-purple-500 to-pink-500",
      ringColor: "border-purple-500",
    },
    {
      id: 3,
      name: "Authentication Anomaly",
      icon: "🔐",
      applications: 11,
      threats: 2200,
      rank: "3rd",
      position: 1,
      confidence: 78,
      color: "from-green-500 to-emerald-500",
      ringColor: "border-green-500",
    },
    {
      id: 4,
      name: "Malware Detection",
      icon: "🦠",
      applications: 4,
      threats: 1500,
      rank: "4th",
      position: 4,
      confidence: 85,
      color: "from-red-500 to-orange-500",
      ringColor: "border-red-500",
    },
  ])

  const [threatStats, setThreatStats] = useState({
    detected: 53000,
    alerted: 5000,
    blocked: 48000,
  })

  const [sensitiveData, setSensitiveData] = useState({
    assets: 4000,
    alerted: 1500,
    blocked: 2500,
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setCentralMetrics((prev) => ({
        ...prev,
        totalInsights: prev.totalInsights + Math.floor(Math.random() * 2),
        blocked: prev.blocked + Math.floor(Math.random() * 2),
      }))

      setThreatStats((prev) => ({
        ...prev,
        detected: prev.detected + Math.floor(Math.random() * 100),
        blocked: prev.blocked + Math.floor(Math.random() * 50),
      }))

      setSensitiveData((prev) => ({
        ...prev,
        assets: prev.assets + Math.floor(Math.random() * 10),
      }))

      setInsights((prev) =>
        prev.map((insight) => ({
          ...insight,
          confidence: Math.min(99, insight.confidence + Math.random() * 0.3),
          threats: insight.threats + Math.floor(Math.random() * 10),
        })),
      )

      setMetricsData((prev) => ({
        ...prev,
        mttd: { ...prev.mttd, current: Math.max(0.8, prev.mttd.current - 0.01) },
        mttr: { ...prev.mttr, current: Math.max(2.0, prev.mttr.current - 0.01) },
        alertTriageRate: { ...prev.alertTriageRate, current: Math.min(99, prev.alertTriageRate.current + 0.1) },
      }))

      setKeyInsights((prev) =>
        prev.map((insight) => ({
          ...insight,
          confidence: Math.min(99, insight.confidence + Math.random() * 0.2),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const actions = [
    {
      category: "CONTROL",
      items: [
        {
          action: "Enable",
          text: "policy to inspect Sensitive Content and Threats for Sanctioned Gen AI Apps",
          type: "enable",
        },
        { action: "Review", text: "3 policies that allow access to Unsanctioned Gen AI Apps", type: "review" },
        { action: "Sanction", text: "10 apps which are detected through IdP", type: "sanction" },
      ],
    },
    {
      category: "DATA PROTECTION",
      items: [
        { action: "Inspect", text: "PII for 5 allowed Writing Assistant apps", type: "inspect" },
        { action: "Inspect", text: "Secrets and Credentials for 8 Code Assistant and Generator apps", type: "inspect" },
      ],
    },
    {
      category: "THREAT PROTECTION",
      items: [
        {
          action: "Review",
          text: "configurations for ChatGPT plugin detected to have elevated permissions",
          type: "review",
        },
        {
          action: "Enable",
          text: "prompt-based threat inspection for 2 allowed Conversational Agents",
          type: "enable",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">AI Security Analyst</h1>
            <p className="text-sm text-gray-400">Advanced security insights and recommendations</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 border-gray-700 bg-gray-900 pl-10 text-white placeholder:text-gray-500"
            />
          </div>
          <Button variant="outline" size="sm" className="border-gray-700 bg-gray-900 text-white hover:bg-gray-800">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
            Ask AI Analyst
          </Button>
        </div>
      </div>

      <div className="mb-6 border-b border-gray-800">
        <div className="flex gap-6">
          {["insights", "metrics", "trends", "recommendations"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize transition-colors ${
                activeTab === tab ? "border-b-2 border-blue-500 text-white" : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "insights" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Key Security Insights */}
            <Card className="border-gray-800 bg-black/40 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Key Security Insights</h3>
                <div className="space-y-4">
                  {keyInsights.map((insight) => (
                    <div
                      key={insight.id}
                      className={`rounded-lg border p-4 transition-all hover:border-opacity-50 ${
                        insight.severity === "critical"
                          ? "border-red-900/50 bg-red-950/20"
                          : insight.severity === "high"
                            ? "border-orange-900/50 bg-orange-950/20"
                            : "border-blue-900/50 bg-blue-950/20"
                      }`}
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle
                            className={`h-5 w-5 ${
                              insight.severity === "critical"
                                ? "text-red-400"
                                : insight.severity === "high"
                                  ? "text-orange-400"
                                  : "text-blue-400"
                            }`}
                          />
                          <h4
                            className={`font-semibold ${
                              insight.severity === "critical"
                                ? "text-red-300"
                                : insight.severity === "high"
                                  ? "text-orange-300"
                                  : "text-blue-300"
                            }`}
                          >
                            {insight.title}
                          </h4>
                        </div>
                        <Badge
                          className={`${
                            insight.severity === "critical"
                              ? "bg-red-600"
                              : insight.severity === "high"
                                ? "bg-orange-600"
                                : "bg-blue-600"
                          }`}
                        >
                          {insight.confidence.toFixed(0)}% confidence
                        </Badge>
                      </div>
                      <p className="mb-3 text-sm text-gray-300">{insight.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {insight.tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="border-gray-700 text-xs text-gray-400">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{insight.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Threat Correlation Analysis */}
            <Card className="border-gray-800 bg-black/40 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Threat Correlation Analysis</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20">
                      <Info className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="mb-2 font-semibold text-white">Correlated Threat Analysis</h4>
                      <p className="mb-3 text-sm text-gray-300">
                        I've identified a potential{" "}
                        <span className="text-red-400 font-semibold">coordinated attack campaign</span> targeting your
                        OT infrastructure. The unusual outbound connections from SCADA systems correlate with the
                        firmware exploitation attempts and unusual authentication patterns.
                      </p>
                      <p className="mb-3 text-sm text-gray-300">
                        The timing and targeting suggest this may be part of a{" "}
                        <span className="text-orange-400 font-semibold">multi-stage attack</span> attempting to
                        establish persistence in your environment. The techniques match those used by threat actor group
                        APT-27 in recent campaigns against industrial targets.
                      </p>
                      <div className="rounded-lg border border-blue-900/50 bg-blue-950/20 p-3">
                        <p className="text-sm text-blue-300">
                          <span className="font-semibold">Recommended action:</span> Isolate affected systems, implement
                          network segmentation between IT and OT networks, and conduct a forensic investigation of the
                          compromised systems.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                    <span className="text-sm text-gray-400">Correlation confidence: 85%</span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 bg-transparent">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Investigate
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Active Cases */}
            <Card className="border-gray-800 bg-black/40 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Active Cases</h3>
                <div className="space-y-3">
                  {activeCases.map((case_) => (
                    <div key={case_.id} className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-white">{case_.id}</span>
                        <Badge
                          className={`${
                            case_.severity === "critical"
                              ? "bg-red-600"
                              : case_.severity === "high"
                                ? "bg-orange-600"
                                : "bg-blue-600"
                          }`}
                        >
                          {case_.severity}
                        </Badge>
                      </div>
                      <p className="mb-2 text-sm text-gray-300">{case_.title}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Assigned to: {case_.assignee}</span>
                        <span>{case_.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="mt-3 w-full text-blue-400">
                  View All Cases
                </Button>
              </CardContent>
            </Card>

            {/* Threat Intelligence */}
            <Card className="border-gray-800 bg-black/40 backdrop-blur">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-white">Threat Intelligence</h3>
                <div className="space-y-3">
                  {threatIntelligence.map((threat) => (
                    <div key={threat.id} className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
                      <div className="mb-1 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                        <span className="text-sm font-semibold text-white">{threat.title}</span>
                      </div>
                      <p className="mb-2 text-xs text-gray-400">{threat.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{threat.timestamp}</span>
                        <Button variant="link" size="sm" className="h-auto p-0 text-xs text-blue-400">
                          Details <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="link" className="mt-3 w-full text-blue-400">
                  View All Intelligence
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "metrics" && (
        <div className="space-y-6">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-gray-800 bg-gradient-to-br from-blue-950/40 to-black/40 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Mean Time to Detect</p>
                    <p className="mt-2 text-4xl font-bold text-white">{metricsData.mttd.current.toFixed(1)}h</p>
                    <p className="mt-1 text-sm text-green-400">{metricsData.mttd.change.toFixed(1)}% from last month</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600/20">
                    <Clock className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gradient-to-br from-green-950/40 to-black/40 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Mean Time to Respond</p>
                    <p className="mt-2 text-4xl font-bold text-white">{metricsData.mttr.current.toFixed(1)}h</p>
                    <p className="mt-1 text-sm text-green-400">{metricsData.mttr.change.toFixed(1)}% from last month</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600/20">
                    <Activity className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gradient-to-br from-orange-950/40 to-black/40 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">False Positive Rate</p>
                    <p className="mt-2 text-4xl font-bold text-white">{metricsData.falsePositiveRate.current}%</p>
                    <p className="mt-1 text-sm text-red-400">
                      +{metricsData.falsePositiveRate.change.toFixed(1)}% from last month
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-600/20">
                    <AlertTriangle className="h-6 w-6 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gradient-to-br from-purple-950/40 to-black/40 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Threat Detection Rate</p>
                    <p className="mt-2 text-4xl font-bold text-white">
                      {metricsData.alertTriageRate.current.toFixed(0)}%
                    </p>
                    <p className="mt-1 text-sm text-green-400">
                      +{metricsData.alertTriageRate.change.toFixed(1)}% from last month
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600/20">
                    <Shield className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-gray-800 bg-black/40 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Alert Distribution by Source</h3>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 bg-transparent">
                    Filter
                  </Button>
                </div>
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-900/50">
                  <span className="text-gray-500">Alert Distribution Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-black/40 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Alert Severity Trends</h3>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 bg-transparent">
                    Filter
                  </Button>
                </div>
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-900/50">
                  <span className="text-gray-500">Severity Trends Chart</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* SOC Performance Metrics Table */}
          <Card className="border-gray-800 bg-black/40 backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">SOC Performance Metrics</h3>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 bg-transparent">
                    Share
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Metric</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Current</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Previous</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Change</th>
                      <th className="pb-3 text-left text-sm font-medium text-gray-400">Target</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-800">
                      <td className="py-3 text-sm text-white">Mean Time to Detect (MTTD)</td>
                      <td className="py-3 text-sm text-white">{metricsData.mttd.current.toFixed(1)} hours</td>
                      <td className="py-3 text-sm text-gray-400">{metricsData.mttd.previous.toFixed(1)} hours</td>
                      <td className="py-3 text-sm text-green-400">{metricsData.mttd.change.toFixed(1)}%</td>
                      <td className="py-3 text-sm text-gray-400">{metricsData.mttd.target.toFixed(1)} hour</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-3 text-sm text-white">Mean Time to Respond (MTTR)</td>
                      <td className="py-3 text-sm text-white">{metricsData.mttr.current.toFixed(1)} hours</td>
                      <td className="py-3 text-sm text-gray-400">{metricsData.mttr.previous.toFixed(1)} hours</td>
                      <td className="py-3 text-sm text-green-400">{metricsData.mttr.change.toFixed(1)}%</td>
                      <td className="py-3 text-sm text-gray-400">{metricsData.mttr.target.toFixed(1)} hours</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-3 text-sm text-white">Mean Time to Remediate (MTTR)</td>
                      <td className="py-3 text-sm text-white">{metricsData.mttrRemediate.current.toFixed(1)} hours</td>
                      <td className="py-3 text-sm text-gray-400">
                        {metricsData.mttrRemediate.previous.toFixed(1)} hours
                      </td>
                      <td className="py-3 text-sm text-green-400">{metricsData.mttrRemediate.change.toFixed(1)}%</td>
                      <td className="py-3 text-sm text-gray-400">
                        {metricsData.mttrRemediate.target.toFixed(1)} hours
                      </td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-3 text-sm text-white">False Positive Rate</td>
                      <td className="py-3 text-sm text-white">{metricsData.falsePositiveRate.current}%</td>
                      <td className="py-3 text-sm text-gray-400">{metricsData.falsePositiveRate.previous}%</td>
                      <td className="py-3 text-sm text-red-400">+{metricsData.falsePositiveRate.change.toFixed(1)}%</td>
                      <td className="py-3 text-sm text-gray-400">{metricsData.falsePositiveRate.target}%</td>
                    </tr>
                    <tr className="border-b border-gray-800">
                      <td className="py-3 text-sm text-white">Alert Triage Rate</td>
                      <td className="py-3 text-sm text-white">{metricsData.alertTriageRate.current.toFixed(0)}%</td>
                      <td className="py-3 text-sm text-gray-400">{metricsData.alertTriageRate.previous}%</td>
                      <td className="py-3 text-sm text-green-400">+{metricsData.alertTriageRate.change.toFixed(1)}%</td>
                      <td className="py-3 text-sm text-gray-400">{metricsData.alertTriageRate.target}%</td>
                    </tr>
                    <tr>
                      <td className="py-3 text-sm text-white">SLA Compliance</td>
                      <td className="py-3 text-sm text-white">{metricsData.slaCompliance.current.toFixed(1)}%</td>
                      <td className="py-3 text-sm text-gray-400">{metricsData.slaCompliance.previous.toFixed(1)}%</td>
                      <td className="py-3 text-sm text-green-400">+{metricsData.slaCompliance.change.toFixed(1)}%</td>
                      <td className="py-3 text-sm text-gray-400">{metricsData.slaCompliance.target}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "trends" && (
        <div className="space-y-6">
          {/* Charts */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="border-gray-800 bg-black/40 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Alert Trends (Last 30 Days)</h3>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                <div className="flex h-80 items-center justify-center rounded-lg bg-gray-900/50">
                  <span className="text-gray-500">Alert Trends Chart</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-black/40 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Attack Vector Analysis</h3>
                  <Button variant="outline" size="sm" className="border-gray-700 text-gray-300 bg-transparent">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                </div>
                <div className="flex h-80 items-center justify-center rounded-lg bg-gray-900/50">
                  <span className="text-gray-500">Attack Vector Chart</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Emerging Threat Patterns */}
          <Card className="border-gray-800 bg-black/40 backdrop-blur">
            <CardContent className="p-6">
              <h3 className="mb-4 text-lg font-semibold text-white">Emerging Threat Patterns</h3>
              <div className="space-y-4">
                {emergingThreats.map((threat, idx) => (
                  <div key={idx} className="rounded-lg border border-gray-800 bg-gray-900/50 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          idx === 0 ? "bg-blue-600/20" : idx === 1 ? "bg-orange-600/20" : "bg-purple-600/20"
                        }`}
                      >
                        {idx === 0 ? (
                          <Activity className="h-5 w-5 text-blue-400" />
                        ) : idx === 1 ? (
                          <AlertTriangle className="h-5 w-5 text-orange-400" />
                        ) : (
                          <Shield className="h-5 w-5 text-purple-400" />
                        )}
                      </div>
                      <h4 className="font-semibold text-white">{threat.title}</h4>
                    </div>
                    <p className="mb-3 text-sm text-gray-300">{threat.description}</p>
                    <div className="flex gap-2">
                      {threat.tags.map((tag, tagIdx) => (
                        <Badge
                          key={tagIdx}
                          variant="outline"
                          className={`border-gray-700 text-xs ${
                            idx === 0 ? "text-blue-400" : idx === 1 ? "text-orange-400" : "text-purple-400"
                          }`}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "recommendations" && (
        <div className="space-y-6">
          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Critical Recommendations */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-red-400">Critical Recommendations</h3>
              <div className="space-y-4">
                {recommendations.critical.map((rec, idx) => (
                  <Card key={idx} className="border-red-900/50 bg-red-950/20 backdrop-blur">
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold text-red-300">{rec.title}</h4>
                        <Badge className="bg-orange-600 text-xs">{rec.effort}</Badge>
                      </div>
                      <p className="mb-3 text-sm text-gray-300">{rec.description}</p>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {rec.tags.map((tag, tagIdx) => (
                          <Badge key={tagIdx} variant="outline" className="border-gray-700 text-xs text-gray-400">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" className="w-full bg-red-600 hover:bg-red-700">
                        Implement <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* High Priority Recommendations */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-orange-400">High Priority Recommendations</h3>
              <div className="space-y-4">
                {recommendations.high.map((rec, idx) => (
                  <Card key={idx} className="border-orange-900/50 bg-orange-950/20 backdrop-blur">
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold text-orange-300">{rec.title}</h4>
                        <Badge className="bg-orange-600 text-xs">{rec.effort}</Badge>
                      </div>
                      <p className="mb-3 text-sm text-gray-300">{rec.description}</p>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {rec.tags.map((tag, tagIdx) => (
                          <Badge key={tagIdx} variant="outline" className="border-gray-700 text-xs text-gray-400">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700">
                        Implement <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Medium Priority Recommendations */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-blue-400">Medium Priority Recommendations</h3>
              <div className="space-y-4">
                {recommendations.medium.map((rec, idx) => (
                  <Card key={idx} className="border-blue-900/50 bg-blue-950/20 backdrop-blur">
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <h4 className="font-semibold text-blue-300">{rec.title}</h4>
                        <Badge className="bg-blue-600 text-xs">{rec.effort}</Badge>
                      </div>
                      <p className="mb-3 text-sm text-gray-300">{rec.description}</p>
                      <div className="mb-3 flex flex-wrap gap-2">
                        {rec.tags.map((tag, tagIdx) => (
                          <Badge key={tagIdx} variant="outline" className="border-gray-700 text-xs text-gray-400">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                        Implement <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Security Posture Improvement Plan */}
          <Card className="border-gray-800 bg-black/40 backdrop-blur">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/20">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">AI-Generated Security Improvement Plan</h3>
              </div>
              <p className="mb-4 text-sm text-gray-300">
                Based on the current security posture assessment and identified threats, I recommend a three-phase
                approach to improving your OT security posture:
              </p>
              <div className="space-y-4">
                <div className="rounded-lg border border-blue-900/50 bg-blue-950/20 p-4">
                  <h4 className="mb-2 font-semibold text-blue-300">Phase 1 (Immediate):</h4>
                  <p className="text-sm text-gray-300">
                    Address critical vulnerabilities and contain active threats. Isolate compromised systems, implement
                    emergency patches, and enhance monitoring for indicators of compromise.
                  </p>
                </div>
                <div className="rounded-lg border border-blue-900/50 bg-blue-950/20 p-4">
                  <h4 className="mb-2 font-semibold text-blue-300">Phase 2 (30-60 days):</h4>
                  <p className="text-sm text-gray-300">
                    Strengthen security architecture with improved network segmentation, enhanced authentication
                    controls, and deployment of OT-specific security controls based on emerging threats.
                  </p>
                </div>
                <div className="rounded-lg border border-blue-900/50 bg-blue-950/20 p-4">
                  <h4 className="mb-2 font-semibold text-blue-300">Phase 3 (60-90 days):</h4>
                  <p className="text-sm text-gray-300">
                    Develop long-term security strategy including regular security assessments, tabletop exercises, and
                    continuous improvement of security controls based on emerging threats.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
