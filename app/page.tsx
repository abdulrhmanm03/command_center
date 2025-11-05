"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { TopAlertsByType } from "@/components/top-alerts-by-type"
import { ThreatCategoriesDonut } from "@/components/threat-categories-donut"
import { ResponseMetrics } from "@/components/response-metrics"
import { ActiveThreats } from "@/components/active-threats"
import { IntegratedDataFlow } from "@/components/integrated-data-flow"
import { ThreatCorrelationScatter } from "@/components/threat-correlation-scatter"
import { SecurityPostureRadar } from "@/components/security-posture-radar"
import { AlertVolumeArea } from "@/components/alert-volume-area"
import { AttackTimelineHeatmap } from "@/components/attack-timeline-heatmap"
import { MitreAttackMatrix } from "@/components/mitre-attack-matrix"
import { InteractiveThreatTimeline } from "@/components/interactive-threat-timeline"
import { KpiTotalAlerts } from "@/components/kpi-total-alerts"
import { KpiItAlerts } from "@/components/kpi-it-alerts"
import { KpiCriticalAnomalies } from "@/components/kpi-critical-anomalies"
import { KpiMttd } from "@/components/kpi-mttd"
import { LiveMetricsDisplay } from "@/components/live-metrics-display"
import { SiemDataVisibility } from "@/components/siem-data-visibility"
import { AlertTuningWidget } from "@/components/alert-tuning-widget"
import { ComplianceScoreKpi } from "@/components/compliance-score-kpi"
import { CriticalGapsKpi } from "@/components/critical-gaps-kpi"
import { ComplianceAlertBanner } from "@/components/compliance-alert-banner"
import { useState, useEffect } from "react"
import { AICopilotChat } from "@/components/ai-copilot-chat"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import {
  Download,
  AlertTriangle,
  Shield,
  Activity,
  TrendingUp,
  ExternalLink,
  LayoutDashboard,
  Clock,
  Layers,
} from "lucide-react"
import { SIEMLiveTable } from "@/components/siem-live-table"
import { Badge } from "@/components/ui/badge"
import { LogCollectorHealth } from "@/components/log-collector-health"
import Link from "next/link"

const authProviders = [
  "API - Okta Event",
  "API - Azure AD",
  "API - Google Workspace",
  "API - AWS IAM",
  "API - Duo Security",
  "API - Auth0",
  "API - OneLogin",
  "API - Ping Identity",
  "API - UAE Pass",
]

export default function DashboardPage() {
  const [complianceData, setComplianceData] = useState({
    score: "87%",
    change: "+2%",
    criticalGaps: 5,
    gaps: [
      { control_id: "NIST AC-2", framework: "NIST 800-53" },
      { control_id: "GDPR Art.32", framework: "GDPR" },
      { control_id: "PCI 7.1", framework: "PCI DSS" },
    ],
  })

  const [viewMode, setViewMode] = useState<"analyst" | "ciso">("analyst")
  const [currentProvider, setCurrentProvider] = useState(authProviders[0])

  const [threatAnalysisData, setThreatAnalysisData] = useState({
    topThreats: [] as any[],
    attackVectors: [] as any[],
    riskScore: 0,
  })

  const [incidentsData, setIncidentsData] = useState({
    activeIncidents: [] as any[],
    totalIncidents: 0,
    criticalIncidents: 0,
  })

  const [threatIntelData, setThreatIntelData] = useState({
    iocs: [] as any[],
    threatActors: [] as any[],
    emergingThreats: [] as any[],
  })

  const [customDashboards, setCustomDashboards] = useState<any[]>([])

  useEffect(() => {
    const fetchThreatAnalysis = async () => {
      try {
        const res = await fetch("/api/threat-analysis")
        const data = await res.json()
        setThreatAnalysisData(data)
      } catch (error) {
        console.error("Failed to fetch threat analysis:", error)
      }
    }

    const fetchIncidents = async () => {
      try {
        const res = await fetch("/api/incidents")
        const data = await res.json()
        setIncidentsData({
          activeIncidents: data.incidents?.slice(0, 5) || [],
          totalIncidents: data.total || 0,
          criticalIncidents: data.incidents?.filter((i: any) => i.severity === "critical").length || 0,
        })
      } catch (error) {
        console.error("Failed to fetch incidents:", error)
      }
    }

    const fetchThreatIntel = async () => {
      try {
        const res = await fetch("/api/threat-intel")
        const data = await res.json()
        setThreatIntelData(data)
      } catch (error) {
        console.error("Failed to fetch threat intel:", error)
      }
    }

    fetchThreatAnalysis()
    fetchIncidents()
    fetchThreatIntel()

    // Refresh every 10 seconds
    const interval = setInterval(() => {
      fetchThreatAnalysis()
      fetchIncidents()
      fetchThreatIntel()
    }, 10000)

    const loadCustomDashboards = () => {
      try {
        const saved = localStorage.getItem("custom-dashboards")
        if (saved) {
          const dashboards = JSON.parse(saved)
          // Sort by most recent first and take top 4
          const recent = dashboards
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 4)
          setCustomDashboards(recent)
        }
      } catch (error) {
        console.error("Failed to load custom dashboards:", error)
      }
    }

    loadCustomDashboards()

    // Refresh custom dashboards every 5 seconds to catch new saves
    const dashboardInterval = setInterval(loadCustomDashboards, 5000)

    return () => {
      clearInterval(interval)
      clearInterval(dashboardInterval)
    }
  }, [])

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          {/* Title with View Toggle */}
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#06b6d4]">Security Operations Dashboard</h1>
              <p className="text-sm text-gray-400">Real-time security monitoring and threat intelligence</p>
            </div>
            <ToggleGroup type="single" value={viewMode} onValueChange={(v) => v && setViewMode(v as any)}>
              <ToggleGroupItem value="analyst" className="data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-400">
                Analyst View
              </ToggleGroupItem>
              <ToggleGroupItem value="ciso" className="data-[state=on]:bg-cyan-500/20 data-[state=on]:text-cyan-400">
                CISO View
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {viewMode === "ciso" ? (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
                  <CardContent className="p-6">
                    <h3 className="text-sm text-muted-foreground mb-2">Risk Score</h3>
                    <p className="text-4xl font-bold text-cyan-400">87/100</p>
                    <p className="text-xs text-green-400 mt-2">↓ 5 points this week</p>
                  </CardContent>
                </Card>
                <Card className="border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-transparent">
                  <CardContent className="p-6">
                    <h3 className="text-sm text-muted-foreground mb-2">Financial Impact</h3>
                    <p className="text-4xl font-bold text-amber-400">$1.2M</p>
                    <p className="text-xs text-muted-foreground mt-2">Potential breach cost</p>
                  </CardContent>
                </Card>
                <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
                  <CardContent className="p-6">
                    <h3 className="text-sm text-muted-foreground mb-2">Top Risk</h3>
                    <p className="text-lg font-bold text-red-400">Ransomware</p>
                    <p className="text-xs text-muted-foreground mt-2">12 active threats</p>
                  </CardContent>
                </Card>
                <Card className="border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent">
                  <CardContent className="p-6">
                    <h3 className="text-sm text-muted-foreground mb-2">Compliance</h3>
                    <p className="text-4xl font-bold text-green-400">87%</p>
                    <p className="text-xs text-muted-foreground mt-2">NIST, GDPR, ISO</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-cyan-400">Executive Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-white mb-2">Top 3 Risks</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Ransomware C2 communication detected (12 attempts)</li>
                        <li>Insider threat: Unusual data access patterns (3 users)</li>
                        <li>Supply chain: Vulnerable third-party integration</li>
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white mb-2">MTTD/MTTR Trend</h4>
                      <p className="text-sm text-muted-foreground">
                        Mean Time to Detect: <span className="text-green-400">12 minutes</span> (↓ 8 min)
                        <br />
                        Mean Time to Respond: <span className="text-green-400">45 minutes</span> (↓ 15 min)
                      </p>
                    </div>
                    <Button className="bg-cyan-500 hover:bg-cyan-600">
                      <Download className="mr-2 h-4 w-4" />
                      Export PDF for Board
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            // Analyst View (existing dashboard)
            <>
              <div className="mb-6">
                <SIEMLiveTable />
              </div>

              {customDashboards.length > 0 && (
                <Card className="mb-6 border-cyan-500/30 bg-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LayoutDashboard className="h-5 w-5 text-cyan-400" />
                        <CardTitle className="text-cyan-400">Recently Created Dashboards</CardTitle>
                      </div>
                      <Link href="/custom-dashboard">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
                        >
                          View All
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                    <p className="text-sm text-gray-400">Quick access to your custom SIEM dashboards</p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {customDashboards.map((dashboard) => (
                        <Link key={dashboard.id} href={`/custom-dashboard?id=${dashboard.id}`}>
                          <Card className="border-gray-700 bg-gray-900/50 hover:border-cyan-500/50 transition-all cursor-pointer group">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-white group-hover:text-cyan-400 transition-colors mb-1">
                                    {dashboard.name}
                                  </h4>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {new Date(dashboard.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                <Badge variant="outline" className="border-cyan-500/50 text-cyan-400">
                                  <Layers className="h-3 w-3 mr-1" />
                                  {dashboard.widgets?.length || 0}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {dashboard.widgets?.slice(0, 3).map((widget: any, idx: number) => (
                                  <Badge key={idx} variant="secondary" className="text-xs bg-gray-800 text-gray-400">
                                    {widget.type}
                                  </Badge>
                                ))}
                                {dashboard.widgets?.length > 3 && (
                                  <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-400">
                                    +{dashboard.widgets.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Tabs defaultValue="overview" className="mb-6">
                <TabsList className="bg-card">
                  <TabsTrigger
                    value="overview"
                    className="data-[state=active]:bg-accent data-[state=active]:text-[#06b6d4]"
                  >
                    Security Overview
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="data-[state=active]:text-[#06b6d4]">
                    Threat Analysis
                  </TabsTrigger>
                  <TabsTrigger value="incidents" className="data-[state=active]:text-[#06b6d4]">
                    Incidents
                  </TabsTrigger>
                  <TabsTrigger value="intel" className="data-[state=active]:text-[#06b6d4]">
                    Threat Intel
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-6">
                  <div className="mb-6 grid gap-4 grid-cols-7">
                    <KpiTotalAlerts />
                    <KpiItAlerts />
                    <KpiCriticalAnomalies />
                    <KpiMttd />
                    <ComplianceScoreKpi value={complianceData.score} change={complianceData.change} />
                    <CriticalGapsKpi count={complianceData.criticalGaps} />
                  </div>

                  <LiveMetricsDisplay />

                  <LogCollectorHealth />

                  <div className="mb-6">
                    <ComplianceAlertBanner gaps={complianceData.gaps} />
                  </div>

                  <div className="mb-6">
                    <SiemDataVisibility />
                  </div>

                  <div className="mb-6">
                    <AlertTuningWidget />
                  </div>

                  <Card className="mb-6 border-cyan-500/30 bg-card">
                    <CardHeader>
                      <CardTitle className="text-cyan-400">MITRE ATT&CK Framework Coverage</CardTitle>
                      <p className="text-sm text-gray-400">Click tactics to view techniques and detection coverage</p>
                    </CardHeader>
                    <CardContent>
                      <MitreAttackMatrix />
                    </CardContent>
                  </Card>

                  <div className="mb-6">
                    <InteractiveThreatTimeline />
                  </div>

                  <IntegratedDataFlow />

                  <div className="mt-6 grid gap-6 grid-cols-4">
                    <TopAlertsByType />
                    <ThreatCategoriesDonut />
                    <ActiveThreats />
                    <ResponseMetrics />
                  </div>

                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-[#06b6d4]">Threat Correlation Analysis</CardTitle>
                        <p className="text-sm text-gray-400">Severity vs Frequency (bubble size = impact)</p>
                      </CardHeader>
                      <CardContent>
                        <ThreatCorrelationScatter />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-[#06b6d4]">Security Posture Score</CardTitle>
                        <p className="text-sm text-gray-400">Current vs Target across domains</p>
                      </CardHeader>
                      <CardContent>
                        <SecurityPostureRadar />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-[#06b6d4]">Alert Volume by Severity</CardTitle>
                        <p className="text-sm text-gray-400">24-hour stacked area view</p>
                      </CardHeader>
                      <CardContent>
                        <AlertVolumeArea />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-[#06b6d4]">Attack Pattern Heatmap</CardTitle>
                        <p className="text-sm text-gray-400">Weekly attack intensity by time</p>
                      </CardHeader>
                      <CardContent>
                        <AttackTimelineHeatmap />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analysis" className="mt-6">
                  <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Risk Score</p>
                            <p className="text-3xl font-bold text-red-400">{threatAnalysisData.riskScore || 245}</p>
                            <p className="text-xs text-red-400 mt-1">↑ High Risk</p>
                          </div>
                          <AlertTriangle className="h-10 w-10 text-red-400 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Active Threats</p>
                            <p className="text-3xl font-bold text-orange-400">
                              {threatAnalysisData.topThreats?.length || 12}
                            </p>
                            <p className="text-xs text-orange-400 mt-1">Requires attention</p>
                          </div>
                          <Shield className="h-10 w-10 text-orange-400 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Attack Vectors</p>
                            <p className="text-3xl font-bold text-cyan-400">
                              {threatAnalysisData.attackVectors?.length || 8}
                            </p>
                            <p className="text-xs text-cyan-400 mt-1">Identified</p>
                          </div>
                          <Activity className="h-10 w-10 text-cyan-400 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-cyan-400 flex items-center gap-2">
                          <TrendingUp className="h-5 w-5" />
                          Top Threats (Live)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { name: "Brute Force Attack", severity: "critical", count: 127 },
                            { name: "Ransomware C2 Communication", severity: "critical", count: 45 },
                            { name: "Data Exfiltration Attempt", severity: "high", count: 32 },
                            { name: "Privilege Escalation", severity: "high", count: 28 },
                            { name: "Lateral Movement", severity: "medium", count: 19 },
                          ].map((threat, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-gray-800"
                            >
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className={
                                    threat.severity === "critical"
                                      ? "border-red-500 text-red-400"
                                      : threat.severity === "high"
                                        ? "border-orange-500 text-orange-400"
                                        : "border-yellow-500 text-yellow-400"
                                  }
                                >
                                  {threat.severity}
                                </Badge>
                                <span className="text-sm font-medium">{threat.name}</span>
                              </div>
                              <span className="text-sm text-muted-foreground">{threat.count} events</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-cyan-400">Attack Vectors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { vector: "Network", percentage: 45, color: "bg-red-500" },
                            { vector: "Email/Phishing", percentage: 28, color: "bg-orange-500" },
                            { vector: "Web Application", percentage: 18, color: "bg-yellow-500" },
                            { vector: "Endpoint", percentage: 9, color: "bg-cyan-500" },
                          ].map((vector, i) => (
                            <div key={i} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>{vector.vector}</span>
                                <span className="text-muted-foreground">{vector.percentage}%</span>
                              </div>
                              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                <div className={`h-full ${vector.color}`} style={{ width: `${vector.percentage}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-cyan-400">Threat Correlation Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ThreatCorrelationScatter />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="incidents" className="mt-6">
                  <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Critical Incidents</p>
                            <p className="text-3xl font-bold text-red-400">{incidentsData.criticalIncidents || 8}</p>
                            <p className="text-xs text-red-400 mt-1">Requires immediate action</p>
                          </div>
                          <AlertTriangle className="h-10 w-10 text-red-400 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-transparent">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Active Incidents</p>
                            <p className="text-3xl font-bold text-orange-400">
                              {incidentsData.activeIncidents?.length || 24}
                            </p>
                            <p className="text-xs text-orange-400 mt-1">In progress</p>
                          </div>
                          <Activity className="h-10 w-10 text-orange-400 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Total Incidents</p>
                            <p className="text-3xl font-bold text-cyan-400">{incidentsData.totalIncidents || 156}</p>
                            <p className="text-xs text-cyan-400 mt-1">Last 30 days</p>
                          </div>
                          <TrendingUp className="h-10 w-10 text-cyan-400 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-cyan-400">Recent Incidents (Live)</CardTitle>
                        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                          View All
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {(incidentsData.activeIncidents.length > 0
                          ? incidentsData.activeIncidents
                          : [
                              {
                                id: "INC-1000",
                                title: "Brute Force Attack Detected",
                                severity: "critical",
                                status: "in_progress",
                                time: "2 min ago",
                              },
                              {
                                id: "INC-0999",
                                title: "Ransomware C2 Communication",
                                severity: "critical",
                                status: "investigating",
                                time: "15 min ago",
                              },
                              {
                                id: "INC-0998",
                                title: "Data Exfiltration Attempt",
                                severity: "high",
                                status: "in_progress",
                                time: "32 min ago",
                              },
                              {
                                id: "INC-0997",
                                title: "Privilege Escalation Detected",
                                severity: "high",
                                status: "investigating",
                                time: "1 hour ago",
                              },
                              {
                                id: "INC-0996",
                                title: "Suspicious Lateral Movement",
                                severity: "medium",
                                status: "in_progress",
                                time: "2 hours ago",
                              },
                            ]
                        ).map((incident: any, i: number) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-4 bg-card/50 rounded-lg border border-gray-800 hover:border-cyan-500/50 transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <Badge
                                variant="outline"
                                className={
                                  incident.severity === "critical"
                                    ? "border-red-500 text-red-400"
                                    : incident.severity === "high"
                                      ? "border-orange-500 text-orange-400"
                                      : "border-yellow-500 text-yellow-400"
                                }
                              >
                                {incident.severity}
                              </Badge>
                              <div>
                                <p className="font-medium">{incident.title}</p>
                                <p className="text-xs text-muted-foreground">{incident.id}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="border-cyan-500/50 text-cyan-400 mb-1">
                                {incident.status?.replace("_", " ")}
                              </Badge>
                              <p className="text-xs text-muted-foreground">{incident.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mt-6 grid gap-6 lg:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-cyan-400">Response Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ResponseMetrics />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-cyan-400">Incident Timeline</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <InteractiveThreatTimeline />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="intel" className="mt-6">
                  <div className="grid gap-4 md:grid-cols-3 mb-6">
                    <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Active IOCs</p>
                            <p className="text-3xl font-bold text-purple-400">{threatIntelData.iocs?.length || 1247}</p>
                            <p className="text-xs text-purple-400 mt-1">Indicators of Compromise</p>
                          </div>
                          <Shield className="h-10 w-10 text-purple-400 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Threat Actors</p>
                            <p className="text-3xl font-bold text-red-400">
                              {threatIntelData.threatActors?.length || 34}
                            </p>
                            <p className="text-xs text-red-400 mt-1">Tracked groups</p>
                          </div>
                          <AlertTriangle className="h-10 w-10 text-red-400 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-cyan-500/30 bg-gradient-to-br from-cyan-500/10 to-transparent">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Emerging Threats</p>
                            <p className="text-3xl font-bold text-cyan-400">
                              {threatIntelData.emergingThreats?.length || 12}
                            </p>
                            <p className="text-xs text-cyan-400 mt-1">Last 24 hours</p>
                          </div>
                          <TrendingUp className="h-10 w-10 text-cyan-400 opacity-50" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-2 mb-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-cyan-400">Recent IOCs (Live)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {[
                            { type: "IP", value: "185.199.108.153", threat: "Brute Force", severity: "critical" },
                            { type: "Hash", value: "a3f5d8e9c2b1...", threat: "Ransomware", severity: "critical" },
                            { type: "Domain", value: "malicious-c2.com", threat: "C2 Server", severity: "high" },
                            { type: "IP", value: "203.0.113.45", threat: "Data Exfil", severity: "high" },
                            { type: "URL", value: "phishing-site.net", threat: "Phishing", severity: "medium" },
                          ].map((ioc, i) => (
                            <div
                              key={i}
                              className="flex items-center justify-between p-3 bg-card/50 rounded-lg border border-gray-800"
                            >
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="border-purple-500 text-purple-400">
                                  {ioc.type}
                                </Badge>
                                <span className="text-sm font-mono">{ioc.value}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">{ioc.threat}</span>
                                <Badge
                                  variant="outline"
                                  className={
                                    ioc.severity === "critical"
                                      ? "border-red-500 text-red-400"
                                      : ioc.severity === "high"
                                        ? "border-orange-500 text-orange-400"
                                        : "border-yellow-500 text-yellow-400"
                                  }
                                >
                                  {ioc.severity}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-cyan-400">Tracked Threat Actors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            { name: "APT28 (Fancy Bear)", activity: "High", targets: "Government, Military" },
                            { name: "Lazarus Group", activity: "Medium", targets: "Financial, Crypto" },
                            { name: "APT29 (Cozy Bear)", activity: "High", targets: "Healthcare, Research" },
                            { name: "Carbanak", activity: "Low", targets: "Banking, Finance" },
                          ].map((actor, i) => (
                            <div key={i} className="p-3 bg-card/50 rounded-lg border border-gray-800">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">{actor.name}</span>
                                <Badge
                                  variant="outline"
                                  className={
                                    actor.activity === "High"
                                      ? "border-red-500 text-red-400"
                                      : actor.activity === "Medium"
                                        ? "border-orange-500 text-orange-400"
                                        : "border-green-500 text-green-400"
                                  }
                                >
                                  {actor.activity} Activity
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">Targets: {actor.targets}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-cyan-400">Emerging Threats (Last 24h)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {[
                          {
                            title: "New Ransomware Variant Detected",
                            description: "LockBit 4.0 targeting healthcare sector with improved encryption",
                            severity: "critical",
                            time: "2 hours ago",
                          },
                          {
                            title: "Zero-Day Exploit in Popular VPN",
                            description: "CVE-2025-1234 allows remote code execution, patch available",
                            severity: "critical",
                            time: "5 hours ago",
                          },
                          {
                            title: "Phishing Campaign Targeting Finance",
                            description: "Sophisticated spear-phishing using AI-generated content",
                            severity: "high",
                            time: "8 hours ago",
                          },
                        ].map((threat, i) => (
                          <div
                            key={i}
                            className="p-4 bg-card/50 rounded-lg border border-gray-800 hover:border-cyan-500/50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-medium">{threat.title}</h4>
                              <Badge
                                variant="outline"
                                className={
                                  threat.severity === "critical"
                                    ? "border-red-500 text-red-400"
                                    : "border-orange-500 text-orange-400"
                                }
                              >
                                {threat.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{threat.description}</p>
                            <p className="text-xs text-cyan-400">{threat.time}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </main>
      </div>
      <AICopilotChat />
    </div>
  )
}
