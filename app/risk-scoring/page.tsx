import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Shield, Brain } from "lucide-react"

const riskAssessments = [
  {
    id: "ra-001",
    asset: "Production Database Server",
    threatSource: "Advanced Persistent Threat",
    vulnerability: "Unpatched SQL Server (CVE-2024-1234)",
    likelihood: "High",
    impact: "Critical",
    riskLevel: 95,
    nistControl: "SI-2 (Flaw Remediation)",
    recommendation: "Apply security patch immediately and implement WAF rules",
  },
  {
    id: "ra-002",
    asset: "Email Gateway",
    threatSource: "Phishing Campaign",
    vulnerability: "Insufficient email filtering",
    likelihood: "High",
    impact: "High",
    riskLevel: 82,
    nistControl: "SC-7 (Boundary Protection)",
    recommendation: "Enhance email security controls and user training",
  },
  {
    id: "ra-003",
    asset: "User Workstations",
    threatSource: "Malware Distribution",
    vulnerability: "Outdated antivirus signatures",
    likelihood: "Medium",
    impact: "High",
    riskLevel: 68,
    nistControl: "SI-3 (Malicious Code Protection)",
    recommendation: "Update endpoint protection and enable real-time scanning",
  },
  {
    id: "ra-004",
    asset: "Web Application",
    threatSource: "SQL Injection Attack",
    vulnerability: "Improper input validation",
    likelihood: "Medium",
    impact: "High",
    riskLevel: 71,
    nistControl: "SI-10 (Information Input Validation)",
    recommendation: "Implement parameterized queries and input sanitization",
  },
]

const nist80030Phases = [
  { phase: "Prepare", status: "Complete", progress: 100 },
  { phase: "Conduct Assessment", status: "In Progress", progress: 75 },
  { phase: "Communicate Results", status: "Pending", progress: 30 },
  { phase: "Maintain Assessment", status: "Scheduled", progress: 0 },
]

export default function RiskScoringPage() {
  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-cyan-400">LLM Risk Scoring</h1>
            <p className="text-muted-foreground">AI-Powered Risk Assessment based on NIST 800-30</p>
          </div>

          {/* NIST 800-30 Process */}
          <Card className="mb-6 border-accent/30 bg-card">
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
                  <div key={phase.phase} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{phase.phase}</span>
                      <Badge variant={phase.progress === 100 ? "default" : "secondary"}>{phase.status}</Badge>
                    </div>
                    <Progress value={phase.progress} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Score Summary */}
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card className="border-red-500/30 bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Critical Risks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">1</div>
                <p className="text-xs text-muted-foreground">Risk Level: 90-100</p>
              </CardContent>
            </Card>
            <Card className="border-orange-500/30 bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">High Risks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-400">3</div>
                <p className="text-xs text-muted-foreground">Risk Level: 70-89</p>
              </CardContent>
            </Card>
            <Card className="border-yellow-500/30 bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Medium Risks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-400">7</div>
                <p className="text-xs text-muted-foreground">Risk Level: 40-69</p>
              </CardContent>
            </Card>
            <Card className="border-green-500/30 bg-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Low Risks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">12</div>
                <p className="text-xs text-muted-foreground">Risk Level: 0-39</p>
              </CardContent>
            </Card>
          </div>

          {/* AI-Powered Risk Assessments */}
          <Card className="border-accent/30 bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-400">
                <Brain className="h-5 w-5" />
                AI-Powered Risk Assessments
              </CardTitle>
              <CardDescription>LLM-analyzed threats with NIST 800-53 control mappings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskAssessments.map((assessment) => (
                  <div
                    key={assessment.id}
                    className="rounded-lg border border-border bg-background p-4 transition-all hover:border-accent"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <h3 className="font-semibold text-cyan-400">{assessment.asset}</h3>
                          <Badge
                            variant="outline"
                            className={
                              assessment.riskLevel >= 90
                                ? "border-red-500 text-red-400"
                                : assessment.riskLevel >= 70
                                  ? "border-orange-500 text-orange-400"
                                  : "border-yellow-500 text-yellow-400"
                            }
                          >
                            Risk: {assessment.riskLevel}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{assessment.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle
                          className={`h-5 w-5 ${
                            assessment.riskLevel >= 90
                              ? "text-red-400"
                              : assessment.riskLevel >= 70
                                ? "text-orange-400"
                                : "text-yellow-400"
                          }`}
                        />
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Threat Source</p>
                        <p className="text-sm text-foreground">{assessment.threatSource}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Vulnerability</p>
                        <p className="text-sm text-foreground">{assessment.vulnerability}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Likelihood</p>
                        <Badge variant="secondary">{assessment.likelihood}</Badge>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground">Impact</p>
                        <Badge variant="secondary">{assessment.impact}</Badge>
                      </div>
                    </div>

                    <div className="mt-3 rounded-md bg-secondary/50 p-3">
                      <p className="mb-1 text-xs font-medium text-teal-400">NIST 800-53 Control</p>
                      <p className="mb-2 text-sm font-mono text-foreground">{assessment.nistControl}</p>
                      <p className="text-xs font-medium text-muted-foreground">AI Recommendation</p>
                      <p className="text-sm text-foreground">{assessment.recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
