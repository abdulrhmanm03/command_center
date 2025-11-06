"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Shield, AlertTriangle, Target, FileText, CheckCircle2, Activity, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { risks } from "@/lib/risk-data"

export default function RiskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const riskId = params.id as string

  const risk = risks.find((r) => r.id === riskId)

  if (!risk) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
        <div className="max-w-7xl mx-auto">
          <Button onClick={() => router.push("/risk-scoring")} variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Risk Assessment
          </Button>
          <Card className="border-red-900/50 bg-red-950/20">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-400">Risk Not Found</h2>
              <p className="text-muted-foreground mt-2">The requested risk could not be found.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const getRiskLevelColor = (score: number) => {
    if (score >= 90) return "text-red-400 border-red-900/50 bg-red-950/30"
    if (score >= 70) return "text-orange-400 border-orange-900/50 bg-orange-950/30"
    if (score >= 40) return "text-yellow-400 border-yellow-900/50 bg-yellow-950/30"
    return "text-emerald-400 border-emerald-900/50 bg-emerald-950/30"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <div className="max-w-[2000px] mx-auto">
        <div className="mb-8">
          <Button
            onClick={() => router.push("/risk-scoring")}
            variant="outline"
            size="default"
            className="mb-6 border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Risk Assessment Center
          </Button>

          <div className="flex items-start justify-between gap-8 p-8 rounded-xl bg-slate-900/50 border border-slate-800 shadow-xl backdrop-blur-sm">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-100 mb-4 leading-tight">{risk.title}</h1>
              <div className="flex items-center gap-3">
                <Badge
                  variant="outline"
                  className="text-sm px-3 py-1 border-slate-700 text-slate-300 bg-slate-800/50 font-medium"
                >
                  {risk.asset.type}
                </Badge>
                <p className="text-lg text-slate-400 font-medium">{risk.asset.name}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge
                className={`text-3xl px-6 py-3 font-bold shadow-lg border ${getRiskLevelColor(risk.inherent_score)}`}
              >
                {risk.inherent_score}
              </Badge>
              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Inherent Risk Score</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Column 1: Summary & Risk Assessment */}
          <div className="space-y-6">
            {/* Risk Summary */}
            <Card className="border border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur-sm hover:border-slate-700 transition-colors">
              <CardHeader className="pb-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-3 text-slate-200 text-xl font-semibold">
                  <Shield className="h-5 w-5 text-blue-400" />
                  Risk Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">Risk ID</p>
                  <p className="text-base font-mono text-slate-300 font-semibold">{risk.id}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">Status</p>
                  <Badge
                    variant="outline"
                    className="border-orange-900/50 text-orange-400 bg-orange-950/30 text-sm px-3 py-1 font-medium"
                  >
                    {risk.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">Owner</p>
                  <p className="text-base text-slate-300 font-medium">{risk.owner}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Threat Source</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{risk.threat_source}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Threat Event</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{risk.threat_event}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">Risk Response</p>
                  <Badge className="border-purple-900/50 text-purple-400 bg-purple-950/30 text-sm px-3 py-1 font-medium">
                    {risk.risk_response}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Likelihood Assessment */}
            <Card className="border border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur-sm hover:border-slate-700 transition-colors">
              <CardHeader className="pb-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-3 text-slate-200 text-xl font-semibold">
                  <TrendingUp className="h-5 w-5 text-orange-400" />
                  Likelihood
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <Badge className="text-2xl px-5 py-2 font-bold border border-orange-900/50 text-orange-400 bg-orange-950/30">
                    {risk.likelihood}/5
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{risk.likelihood_assessment}</p>
              </CardContent>
            </Card>

            {/* Impact Assessment */}
            <Card className="border border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur-sm hover:border-slate-700 transition-colors">
              <CardHeader className="pb-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-3 text-slate-200 text-xl font-semibold">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  Impact
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <Badge className="text-2xl px-5 py-2 font-bold border border-red-900/50 text-red-400 bg-red-950/30">
                    {risk.impact}/5
                  </Badge>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{risk.impact_assessment}</p>
              </CardContent>
            </Card>
          </div>

          {/* Column 2: Vulnerabilities, MITRE & Evidence */}
          <div className="space-y-6">
            {/* Vulnerabilities */}
            <Card className="border border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur-sm hover:border-slate-700 transition-colors">
              <CardHeader className="pb-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-3 text-slate-200 text-xl font-semibold">
                  <AlertTriangle className="h-5 w-5 text-yellow-400" />
                  Vulnerabilities
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {risk.vulnerabilities.map((vuln, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-slate-400 leading-relaxed p-3 rounded-lg bg-slate-800/30 border-l-2 border-yellow-900/50"
                    >
                      <span className="text-yellow-400 text-lg font-bold mt-0.5">•</span>
                      <span>{vuln}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* MITRE ATT&CK Mapping */}
            <Card className="border border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur-sm hover:border-slate-700 transition-colors">
              <CardHeader className="pb-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-3 text-slate-200 text-xl font-semibold">
                  <Target className="h-5 w-5 text-purple-400" />
                  MITRE ATT&CK
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Tactics</p>
                  <div className="flex flex-wrap gap-2">
                    {risk.mitre.tactics.map((tactic) => (
                      <Badge
                        key={tactic}
                        variant="outline"
                        className="border-purple-900/50 text-purple-400 bg-purple-950/30 text-xs px-2.5 py-1 font-medium"
                      >
                        {tactic}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Techniques</p>
                  <div className="space-y-2">
                    {risk.mitre.techniques.map((tech) => (
                      <div
                        key={tech.id}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/30 border-l-2 border-purple-900/50"
                      >
                        <Badge
                          variant="secondary"
                          className="font-mono text-xs px-2 py-0.5 font-medium bg-purple-950/50 text-purple-400"
                        >
                          {tech.id}
                        </Badge>
                        <span className="text-sm text-slate-400 font-medium">{tech.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">
                    Attack Chain Analysis
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed p-3 rounded-lg bg-slate-800/30 border-l-2 border-purple-900/50">
                    {risk.mitre.notes}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Supporting Evidence */}
            <Card className="border border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur-sm hover:border-slate-700 transition-colors">
              <CardHeader className="pb-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-3 text-slate-200 text-xl font-semibold">
                  <FileText className="h-5 w-5 text-blue-400" />
                  Evidence
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  {risk.evidence.map((ev, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border border-slate-800 bg-slate-800/30 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className="text-xs capitalize px-2 py-0.5 font-medium border-blue-900/50 text-blue-400 bg-blue-950/30"
                        >
                          {ev.type}
                        </Badge>
                        <span className="text-xs font-mono text-slate-500 font-medium">{ev.id}</span>
                      </div>
                      <p className="text-sm text-slate-400 leading-relaxed">{ev.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Column 3: RMF Status & Recommendations */}
          <div className="space-y-6">
            {/* NIST 800-37 RMF Status */}
            <Card className="border border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur-sm hover:border-slate-700 transition-colors">
              <CardHeader className="pb-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-3 text-slate-200 text-xl font-semibold">
                  <Activity className="h-5 w-5 text-emerald-400" />
                  RMF Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div>
                  <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">Current RMF Step</p>
                  <Badge className="border-emerald-900/50 text-emerald-400 bg-emerald-950/30 text-base px-3 py-1.5 font-semibold">
                    {risk.rmf_step}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Step Description</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{risk.rmf_step_description}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">
                    Control Implementation
                  </p>
                  <Badge
                    variant="outline"
                    className="border-yellow-900/50 text-yellow-400 bg-yellow-950/30 text-sm px-3 py-1 font-medium"
                  >
                    {risk.control_implementation_status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1.5 font-medium uppercase tracking-wide">
                    Authorization Status
                  </p>
                  <Badge
                    variant="outline"
                    className="border-orange-900/50 text-orange-400 bg-orange-950/30 text-sm px-3 py-1 font-medium"
                  >
                    {risk.authorization_status}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">Authorization Notes</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{risk.authorization_notes}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-2 font-medium uppercase tracking-wide">
                    Continuous Monitoring
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">{risk.continuous_monitoring}</p>
                </div>
              </CardContent>
            </Card>

            {/* Risk Response Strategy */}
            <Card className="border border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur-sm hover:border-slate-700 transition-colors">
              <CardHeader className="pb-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-3 text-slate-200 text-xl font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-indigo-400" />
                  Response Strategy
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm text-slate-400 leading-relaxed">{risk.risk_response_rationale}</p>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border border-slate-800 bg-slate-900/50 shadow-lg backdrop-blur-sm hover:border-slate-700 transition-colors">
              <CardHeader className="pb-4 border-b border-slate-800">
                <CardTitle className="flex items-center gap-3 text-slate-200 text-xl font-semibold">
                  <CheckCircle2 className="h-5 w-5 text-teal-400" />
                  Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {risk.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border border-slate-800 bg-slate-800/30 hover:border-slate-700 transition-colors"
                    >
                      <p className="text-sm text-slate-400 mb-4 leading-relaxed">{rec.text}</p>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          {rec.nist_80053.map((control) => (
                            <Badge
                              key={control}
                              className="border-teal-900/50 text-teal-400 bg-teal-950/30 font-mono text-xs px-2.5 py-1 font-semibold"
                            >
                              {control}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800">
                          <span className="font-medium">
                            Owner: <span className="text-slate-400">{rec.owner}</span>
                          </span>
                          <span className="font-medium">
                            Due: <span className="text-slate-400">{rec.due_date}</span>
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 font-medium">
                          Expected Δ:{" "}
                          <span className="text-teal-400">
                            Likelihood {rec.expected_delta.likelihood}, Impact {rec.expected_delta.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
