"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Globe,
  AlertTriangle,
  Activity,
  Shield,
  Filter,
  Download,
  Target,
  Zap,
  Key,
  Network,
  Upload,
  Skull,
  Search,
  Layers,
  Eye,
  Database,
  Radio,
  Lock,
} from "lucide-react"
import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function RiskRadarPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [totalThreats, setTotalThreats] = useState(1)
  const [criticalAlerts, setCriticalAlerts] = useState(1)
  const [countriesAffected, setCountriesAffected] = useState(1)
  const [threatsBlocked, setThreatsBlocked] = useState(0)
  const [threatsPerMin, setThreatsPerMin] = useState(0)
  const [showMitre, setShowMitre] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    critical: true,
    high: true,
    medium: true,
    low: true,
  })

  const [mitreTactics, setMitreTactics] = useState([
    { id: 1, name: "Reconnaissance", techniques: 2, severity: "low", color: "cyan", icon: Search },
    { id: 2, name: "Resource Development", techniques: 1, severity: "low", color: "cyan", icon: Layers },
    { id: 3, name: "Initial Access", techniques: 3, severity: "high", color: "red", icon: Target },
    { id: 4, name: "Execution", techniques: 2, severity: "medium", color: "orange", icon: Zap },
    { id: 5, name: "Persistence", techniques: 2, severity: "medium", color: "yellow", icon: Lock },
    { id: 6, name: "Privilege Escalation", techniques: 2, severity: "high", color: "red", icon: Key },
    { id: 7, name: "Defense Evasion", techniques: 4, severity: "critical", color: "red", icon: Shield },
    { id: 8, name: "Credential Access", techniques: 1, severity: "high", color: "orange", icon: Key },
    { id: 9, name: "Discovery", techniques: 2, severity: "medium", color: "yellow", icon: Eye },
    { id: 10, name: "Lateral Movement", techniques: 1, severity: "medium", color: "yellow", icon: Network },
    { id: 11, name: "Collection", techniques: 1, severity: "medium", color: "orange", icon: Database },
    { id: 12, name: "Command and Control", techniques: 2, severity: "high", color: "orange", icon: Radio },
    { id: 13, name: "Exfiltration", techniques: 1, severity: "critical", color: "red", icon: Upload },
    { id: 14, name: "Impact", techniques: 2, severity: "critical", color: "red", icon: Skull },
  ])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalThreats((prev) => prev + Math.floor(Math.random() * 2))
      setCriticalAlerts((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1))
      setCountriesAffected((prev) => Math.min(10, prev + Math.floor(Math.random() * 2)))
      setThreatsBlocked((prev) => prev + Math.floor(Math.random() * 3))
      setThreatsPerMin(Math.floor(Math.random() * 5))

      setMitreTactics((prev) =>
        prev.map((tactic) => ({
          ...tactic,
          techniques: Math.max(0, tactic.techniques + Math.floor(Math.random() * 3) - 1),
        })),
      )
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-red-950/50",
          border: "border-red-500/40",
          text: "text-red-400",
          glow: "shadow-[0_0_20px_rgba(239,68,68,0.3)]",
        }
      case "high":
        return {
          bg: "bg-orange-950/50",
          border: "border-orange-500/40",
          text: "text-orange-400",
          glow: "shadow-[0_0_20px_rgba(251,146,60,0.3)]",
        }
      case "medium":
        return {
          bg: "bg-yellow-950/50",
          border: "border-yellow-500/40",
          text: "text-yellow-400",
          glow: "shadow-[0_0_20px_rgba(234,179,8,0.3)]",
        }
      case "low":
        return {
          bg: "bg-cyan-950/50",
          border: "border-cyan-500/40",
          text: "text-cyan-400",
          glow: "shadow-[0_0_20px_rgba(6,182,212,0.3)]",
        }
      default:
        return { bg: "bg-gray-950/50", border: "border-gray-500/40", text: "text-gray-400", glow: "" }
    }
  }

  const handleExport = () => {
    const reportData = `GLOBAL RISK RADAR - THREAT INTELLIGENCE REPORT
Generated: ${new Date().toLocaleString()}

=== SUMMARY ===
Total Threats: ${totalThreats}
Critical Alerts: ${criticalAlerts}
Countries Affected: ${countriesAffected}
Threats Blocked: ${threatsBlocked}
Threats Per Minute: ${threatsPerMin}

=== MITRE ATT&CK MAPPING ===
${mitreTactics
  .map((tactic) => `${tactic.name}: ${tactic.techniques} technique(s) - Severity: ${tactic.severity.toUpperCase()}`)
  .join("\n")}

=== ATTACK CHAIN ANALYSIS ===
Initial Access → Privilege Escalation → Defense Evasion → Lateral Movement → Exfiltration → Impact

Report generated by VTS Command Center
`

    const blob = new Blob([reportData], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `global-risk-radar-report-${Date.now()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const filteredTactics = mitreTactics.filter((tactic) => {
    if (tactic.severity === "critical" && !filters.critical) return false
    if (tactic.severity === "high" && !filters.high) return false
    if (tactic.severity === "medium" && !filters.medium) return false
    if (tactic.severity === "low" && !filters.low) return false
    return true
  })

  return (
    <div className="flex min-h-screen flex-col p-8">
      <div className="mb-8 flex items-center justify-between rounded-lg border border-gray-800 bg-gradient-to-r from-gray-950 to-gray-900 p-6 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-cyan-500/10 p-3">
            <Globe className="h-10 w-10 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
                GLOBAL RISK
              </span>{" "}
              <span className="text-white">RADAR</span>
            </h1>
            <p className="mt-1 text-sm text-gray-400">Real-time Threat Intelligence • {new Date().getFullYear()}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Card className="border-green-500/30 bg-green-950/30 px-4 py-2.5 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-green-400">Live Feed</div>
                <div className="text-xs font-mono text-green-300">{formatTime(currentTime)}</div>
              </div>
            </div>
          </Card>

          <Card className="border-cyan-500/30 bg-cyan-950/30 px-4 py-2.5 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-cyan-400" />
              <div>
                <div className="text-2xl font-bold text-cyan-400">{threatsPerMin}</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-cyan-300">Threats/Min</div>
              </div>
            </div>
          </Card>

          <Card className="border-orange-500/30 bg-orange-950/30 px-4 py-2.5 shadow-[0_0_15px_rgba(251,146,60,0.2)]">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-orange-400">{criticalAlerts}</div>
                <div className="text-xs font-semibold uppercase tracking-wider text-orange-300">Active Now</div>
              </div>
            </div>
          </Card>

          <div className="ml-2 flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMitre(!showMitre)}
              className={`border-gray-700 text-gray-300 transition-all ${
                showMitre
                  ? "border-purple-500 bg-purple-500/20 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                  : "bg-gray-900/50 hover:border-gray-600 hover:bg-gray-800"
              }`}
            >
              <Shield className="mr-2 h-4 w-4" />
              MITRE
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(true)}
              className="border-gray-700 bg-gray-900/50 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="border-gray-700 bg-gray-900/50 text-gray-300 hover:border-gray-600 hover:bg-gray-800"
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="border-cyan-500/20 bg-card p-6">
          <div className="flex flex-col items-center space-y-3 text-center">
            <Globe className="h-10 w-10 text-cyan-400" />
            <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase text-cyan-400">
              Live
            </span>
            <div className="text-5xl font-bold text-cyan-400">{totalThreats}</div>
            <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Total Threats</div>
          </div>
        </Card>

        <Card className="border-red-500/20 bg-card p-6">
          <div className="flex flex-col items-center space-y-3 text-center">
            <AlertTriangle className="h-10 w-10 text-red-400" />
            <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase text-red-400">
              Critical
            </span>
            <div className="text-5xl font-bold text-red-400">{criticalAlerts}</div>
            <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Critical Alerts</div>
          </div>
        </Card>

        <Card className="border-purple-500/20 bg-card p-6">
          <div className="flex flex-col items-center space-y-3 text-center">
            <Activity className="h-10 w-10 text-purple-400" />
            <span className="rounded-full bg-purple-500/10 px-3 py-1 text-xs font-semibold uppercase text-purple-400">
              Active
            </span>
            <div className="text-5xl font-bold text-purple-400">{countriesAffected}</div>
            <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Countries Affected</div>
          </div>
        </Card>

        <Card className="border-green-500/20 bg-card p-6">
          <div className="flex flex-col items-center space-y-3 text-center">
            <Shield className="h-10 w-10 text-green-400" />
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase text-green-400">
              Blocked
            </span>
            <div className="text-5xl font-bold text-green-400">{threatsBlocked}</div>
            <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Threats Blocked</div>
          </div>
        </Card>
      </div>

      {showMitre && (
        <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="mb-6 flex items-center justify-between rounded-xl border-2 border-purple-500/50 bg-gradient-to-r from-purple-950/60 to-pink-950/60 p-6 shadow-[0_0_40px_rgba(168,85,247,0.4)]">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-purple-500/30 p-3 shadow-lg">
                <Shield className="h-8 w-8 text-purple-300" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">MITRE ATT&CK Framework</h2>
                <p className="mt-1 text-base text-gray-300">
                  Complete tactical overview • {filteredTactics.length} of 14 tactics displayed
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4 rounded-lg bg-black/30 px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                  <span className="text-sm font-semibold text-red-300">Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(251,146,60,0.6)]" />
                  <span className="text-sm font-semibold text-orange-300">High</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                  <span className="text-sm font-semibold text-yellow-300">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                  <span className="text-sm font-semibold text-cyan-300">Low</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-6">
            {filteredTactics.map((tactic) => {
              const colors = getSeverityColor(tactic.severity)
              const Icon = tactic.icon
              return (
                <Card
                  key={tactic.id}
                  className={`${colors.bg} ${colors.border} ${colors.glow} group relative overflow-hidden border-2 p-6 transition-all duration-300 hover:scale-105 hover:border-opacity-100`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="relative flex flex-col items-center space-y-3 text-center">
                    <div className={`rounded-xl ${colors.bg} p-3 shadow-lg`}>
                      <Icon className={`h-8 w-8 ${colors.text}`} />
                    </div>

                    <div className="text-sm font-bold uppercase tracking-wider text-white">{tactic.name}</div>

                    <div className="flex flex-col items-center">
                      <div className={`text-5xl font-bold ${colors.text}`}>{tactic.techniques}</div>
                      <div className="text-sm font-medium text-gray-300">
                        {tactic.techniques === 1 ? "Technique" : "Techniques"}
                      </div>
                    </div>

                    <div
                      className={`rounded-full ${colors.bg} border ${colors.border} px-4 py-1.5 text-sm font-bold uppercase ${colors.text} shadow-lg`}
                    >
                      {tactic.severity}
                    </div>

                    {tactic.techniques > 0 && (
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 animate-pulse rounded-full ${colors.text.replace("text-", "bg-")} shadow-[0_0_8px_currentColor]`}
                        />
                        <span className="text-sm font-semibold text-gray-300">Active</span>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>

          <div className="mt-8 rounded-xl border-2 border-purple-500/40 bg-gradient-to-r from-purple-950/50 to-pink-950/50 p-8 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
            <h3 className="mb-6 text-center text-2xl font-bold text-white">Attack Chain Flow</h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { name: "Reconnaissance", color: "cyan" },
                { name: "Initial Access", color: "red" },
                { name: "Execution", color: "orange" },
                { name: "Persistence", color: "yellow" },
                { name: "Privilege Escalation", color: "red" },
                { name: "Defense Evasion", color: "red" },
                { name: "Credential Access", color: "orange" },
                { name: "Discovery", color: "yellow" },
                { name: "Lateral Movement", color: "yellow" },
                { name: "Collection", color: "orange" },
                { name: "Command & Control", color: "orange" },
                { name: "Exfiltration", color: "red" },
                { name: "Impact", color: "red" },
              ].map((stage, index) => (
                <div key={stage.name} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`rounded-lg border-2 ${
                        stage.color === "red"
                          ? "border-red-500/50 bg-red-500/20 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                          : stage.color === "orange"
                            ? "border-orange-500/50 bg-orange-500/20 text-orange-300 shadow-[0_0_15px_rgba(251,146,60,0.3)]"
                            : stage.color === "yellow"
                              ? "border-yellow-500/50 bg-yellow-500/20 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                              : "border-cyan-500/50 bg-cyan-500/20 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      } px-4 py-3 text-center transition-all hover:scale-105`}
                    >
                      <div className="text-sm font-bold">{stage.name}</div>
                    </div>
                  </div>
                  {index < 12 && (
                    <div className="mx-2 h-1.5 w-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="border-gray-800 bg-gray-950">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Filter Threats</DialogTitle>
            <DialogDescription className="text-gray-400">
              Select severity levels to display in the MITRE ATT&CK mapping
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="critical"
                checked={filters.critical}
                onCheckedChange={(checked) => setFilters({ ...filters, critical: checked as boolean })}
              />
              <Label htmlFor="critical" className="flex items-center gap-2 text-sm font-medium text-white">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                Critical Severity
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="high"
                checked={filters.high}
                onCheckedChange={(checked) => setFilters({ ...filters, high: checked as boolean })}
              />
              <Label htmlFor="high" className="flex items-center gap-2 text-sm font-medium text-white">
                <div className="h-3 w-3 rounded-full bg-orange-500" />
                High Severity
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="medium"
                checked={filters.medium}
                onCheckedChange={(checked) => setFilters({ ...filters, medium: checked as boolean })}
              />
              <Label htmlFor="medium" className="flex items-center gap-2 text-sm font-medium text-white">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                Medium Severity
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="low"
                checked={filters.low}
                onCheckedChange={(checked) => setFilters({ ...filters, low: checked as boolean })}
              />
              <Label htmlFor="low" className="flex items-center gap-2 text-sm font-medium text-white">
                <div className="h-3 w-3 rounded-full bg-cyan-500" />
                Low Severity
              </Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowFilters(false)}>
              Close
            </Button>
            <Button
              onClick={() => {
                setFilters({ critical: true, high: true, medium: true, low: true })
              }}
            >
              Reset Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
