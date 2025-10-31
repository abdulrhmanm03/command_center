"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { KpiVulnerabilities } from "@/components/kpi-vulnerabilities"
import { KpiMttd } from "@/components/kpi-mttd"
import { LiveMetricsDisplay } from "@/components/live-metrics-display"
import { SiemDataVisibility } from "@/components/siem-data-visibility"
import { AlertTuningWidget } from "@/components/alert-tuning-widget"
import { ComplianceScoreKpi } from "@/components/compliance-score-kpi"
import { CriticalGapsKpi } from "@/components/critical-gaps-kpi"
import { ComplianceAlertBanner } from "@/components/compliance-alert-banner"
import { useState } from "react"
import { AICopilotChat } from "@/components/ai-copilot-chat"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { SIEMLiveTable } from "@/components/siem-live-table"

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

              {/* Tabs */}
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
              </Tabs>

              <div className="mb-6 grid gap-4 grid-cols-7">
                <KpiTotalAlerts />
                <KpiItAlerts />
                <KpiCriticalAnomalies />
                <KpiVulnerabilities />
                <KpiMttd />
                <ComplianceScoreKpi value={complianceData.score} change={complianceData.change} />
                <CriticalGapsKpi count={complianceData.criticalGaps} />
              </div>

              <LiveMetricsDisplay />

              <div className="mb-6">
                <ComplianceAlertBanner gaps={complianceData.gaps} />
              </div>

              <div className="mb-6">
                <SiemDataVisibility />
              </div>

              <div className="mb-6">
                <AlertTuningWidget />
              </div>

              {/* MITRE ATT&CK Framework Section */}
              <Card className="mb-6 border-cyan-500/30 bg-card">
                <CardHeader>
                  <CardTitle className="text-cyan-400">MITRE ATT&CK Framework Coverage</CardTitle>
                  <p className="text-sm text-gray-400">Click tactics to view techniques and detection coverage</p>
                </CardHeader>
                <CardContent>
                  <MitreAttackMatrix />
                </CardContent>
              </Card>

              {/* Interactive Threat Timeline */}
              <div className="mb-6">
                <InteractiveThreatTimeline />
              </div>

              {/* Integrated Data Flow */}
              <IntegratedDataFlow />

              {/* Bottom Row - 4 Cards */}
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
            </>
          )}
        </main>
      </div>
      <AICopilotChat />
    </div>
  )
}
