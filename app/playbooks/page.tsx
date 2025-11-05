"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlaybookCard } from "@/components/playbook-card"
import { ExecutionTimeline } from "@/components/execution-timeline"
import {
  Plus,
  RefreshCw,
  Search,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  BarChart3,
  Mail,
  Bug,
  Lock,
  Shield,
  Database,
  UserX,
  Key,
  AlertTriangle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { useRouter } from "next/navigation"

export default function PlaybooksPage() {
  const router = useRouter()
  const [playbooks, setPlaybooks] = useState<any[]>([])
  const [executions, setExecutions] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const playbookTemplates = [
    {
      id: "template-1",
      name: "Phishing Email Response",
      description:
        "Automated workflow to investigate, contain, and remediate phishing attacks. Includes email analysis, user notification, and threat intelligence enrichment.",
      category: "Email Security",
      trigger: "Phishing email reported",
      steps: 7,
      estimatedTime: "5-10 minutes",
      automationLevel: "Full",
      tags: ["Phishing", "Email", "SOAR"],
      icon: "Mail",
      color: "from-red-500/20 to-orange-500/20",
      borderColor: "border-red-500/50",
    },
    {
      id: "template-2",
      name: "Malware Containment",
      description:
        "Isolate infected endpoints, block malicious IPs, and initiate forensic analysis. Includes EDR integration and automated quarantine.",
      category: "Endpoint Security",
      trigger: "Malware detected on endpoint",
      steps: 9,
      estimatedTime: "3-7 minutes",
      automationLevel: "Full",
      tags: ["Malware", "EDR", "Containment"],
      icon: "Bug",
      color: "from-purple-500/20 to-pink-500/20",
      borderColor: "border-purple-500/50",
    },
    {
      id: "template-3",
      name: "Ransomware Response",
      description:
        "Rapid response to ransomware incidents with network isolation, backup verification, and stakeholder notification.",
      category: "Incident Response",
      trigger: "Ransomware activity detected",
      steps: 12,
      estimatedTime: "10-15 minutes",
      automationLevel: "Semi-Automated",
      tags: ["Ransomware", "Critical", "IR"],
      icon: "Lock",
      color: "from-red-500/20 to-red-600/20",
      borderColor: "border-red-600/50",
    },
    {
      id: "template-4",
      name: "DDoS Mitigation",
      description:
        "Detect and mitigate distributed denial of service attacks with traffic analysis, rate limiting, and CDN activation.",
      category: "Network Security",
      trigger: "Abnormal traffic spike detected",
      steps: 6,
      estimatedTime: "2-5 minutes",
      automationLevel: "Full",
      tags: ["DDoS", "Network", "Availability"],
      icon: "Shield",
      color: "from-cyan-500/20 to-blue-500/20",
      borderColor: "border-cyan-500/50",
    },
    {
      id: "template-5",
      name: "Data Breach Response",
      description:
        "Comprehensive data breach investigation and response including data classification, impact assessment, and regulatory notification.",
      category: "Data Protection",
      trigger: "Unauthorized data access detected",
      steps: 15,
      estimatedTime: "20-30 minutes",
      automationLevel: "Semi-Automated",
      tags: ["Data Breach", "Compliance", "Privacy"],
      icon: "Database",
      color: "from-orange-500/20 to-yellow-500/20",
      borderColor: "border-orange-500/50",
    },
    {
      id: "template-6",
      name: "Insider Threat Investigation",
      description:
        "Monitor and investigate suspicious insider activity with user behavior analytics, access review, and evidence collection.",
      category: "User Security",
      trigger: "Anomalous user behavior detected",
      steps: 10,
      estimatedTime: "15-25 minutes",
      automationLevel: "Semi-Automated",
      tags: ["Insider Threat", "UEBA", "Investigation"],
      icon: "UserX",
      color: "from-yellow-500/20 to-orange-500/20",
      borderColor: "border-yellow-500/50",
    },
    {
      id: "template-7",
      name: "Brute Force Attack Response",
      description:
        "Detect and block brute force login attempts with account lockout, IP blocking, and security team notification.",
      category: "Access Control",
      trigger: "Multiple failed login attempts",
      steps: 5,
      estimatedTime: "1-3 minutes",
      automationLevel: "Full",
      tags: ["Brute Force", "Authentication", "IAM"],
      icon: "Key",
      color: "from-green-500/20 to-emerald-500/20",
      borderColor: "border-green-500/50",
    },
    {
      id: "template-8",
      name: "Vulnerability Remediation",
      description:
        "Automated vulnerability patching workflow with asset prioritization, patch deployment, and verification testing.",
      category: "Vulnerability Management",
      trigger: "Critical vulnerability identified",
      steps: 8,
      estimatedTime: "30-60 minutes",
      automationLevel: "Semi-Automated",
      tags: ["Vulnerability", "Patching", "Remediation"],
      icon: "AlertTriangle",
      color: "from-pink-500/20 to-purple-500/20",
      borderColor: "border-pink-500/50",
    },
  ]

  const fetchData = async () => {
    try {
      const [playbooksRes, executionsRes, statsRes] = await Promise.all([
        fetch("/api/playbooks"),
        fetch("/api/playbooks/executions"),
        fetch("/api/playbooks/stats"),
      ])
      const playbooksData = await playbooksRes.json()
      const executionsData = await executionsRes.json()
      const statsData = await statsRes.json()

      setPlaybooks(playbooksData)
      setExecutions(executionsData)
      setStats(statsData)
    } catch (error) {
      console.error("Failed to fetch playbooks data:", error)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 10000) // Refresh every 10 seconds
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const filteredPlaybooks = playbooks.filter(
    (pb) =>
      pb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pb.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pb.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredTemplates = playbookTemplates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400">Security Playbooks</h1>
              <p className="text-muted-foreground">Automated incident response and workflows</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-gray-700 bg-transparent"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button
                size="sm"
                className="bg-cyan-500 text-black hover:bg-cyan-400"
                onClick={() => router.push("/playbooks/new")}
              >
                <Plus className="mr-2 h-4 w-4" />
                New Playbook
              </Button>
            </div>
          </div>

          {stats && (
            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <Card className="border-slate-700 bg-gradient-to-br from-cyan-500/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Active Playbooks</p>
                      <p className="text-3xl font-bold text-white">{stats.activePlaybooks}</p>
                      <p className="text-xs text-cyan-400">of {stats.totalPlaybooks} total</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20">
                      <Zap className="h-6 w-6 text-cyan-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-gradient-to-br from-green-500/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Success Rate</p>
                      <p className="text-3xl font-bold text-white">{stats.avgSuccessRate}%</p>
                      <p className="text-xs text-green-400">Average across all playbooks</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                      <CheckCircle2 className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-gradient-to-br from-orange-500/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Avg Response Time</p>
                      <p className="text-3xl font-bold text-white">{stats.avgResponseTime}</p>
                      <p className="text-xs text-orange-400">Mean time to resolution</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20">
                      <Clock className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-gradient-to-br from-purple-500/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Executions Today</p>
                      <p className="text-3xl font-bold text-white">{stats.executionsToday}</p>
                      <p className="text-xs text-purple-400">of {stats.totalExecutions} total</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
                      <TrendingUp className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {stats && (
            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-cyan-400">Execution Trend (24h)</h3>
                  <ChartContainer
                    config={{
                      count: {
                        label: "Executions",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={stats.executionTrend}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="time" stroke="#666" fontSize={12} />
                        <YAxis stroke="#666" fontSize={12} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "1px solid #333",
                            borderRadius: "8px",
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorCount)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-cyan-400">Category Breakdown</h3>
                  <div className="space-y-4">
                    {stats.categoryBreakdown.map((cat: any) => (
                      <div key={cat.category}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-gray-300">{cat.category}</span>
                          <span className="font-semibold text-white">
                            {cat.count} ({cat.percentage}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="active" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-card">
                <TabsTrigger value="active" className="data-[state=active]:text-cyan-400">
                  Active Playbooks
                </TabsTrigger>
                <TabsTrigger value="executions" className="data-[state=active]:text-cyan-400">
                  Recent Executions
                </TabsTrigger>
                <TabsTrigger value="templates" className="data-[state=active]:text-cyan-400">
                  Templates
                </TabsTrigger>
              </TabsList>

              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Search playbooks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-card border-border/50"
                />
              </div>
            </div>

            <TabsContent value="active" className="space-y-4">
              {filteredPlaybooks.map((playbook) => (
                <PlaybookCard
                  key={playbook.id}
                  playbook={playbook}
                  onRun={() => console.log("Run playbook:", playbook.id)}
                  onConfigure={() => console.log("Configure playbook:", playbook.id)}
                />
              ))}
            </TabsContent>

            <TabsContent value="executions">
              <ExecutionTimeline executions={executions} />
            </TabsContent>

            <TabsContent value="templates">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className={`border-2 ${template.borderColor} bg-gradient-to-br ${template.color} hover:shadow-lg transition-all cursor-pointer`}
                    onClick={() => router.push(`/playbooks/new?template=${template.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="mb-4 flex items-start justify-between">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br ${template.color}`}
                        >
                          {template.icon === "Mail" && <Mail className="h-6 w-6 text-red-400" />}
                          {template.icon === "Bug" && <Bug className="h-6 w-6 text-purple-400" />}
                          {template.icon === "Lock" && <Lock className="h-6 w-6 text-red-400" />}
                          {template.icon === "Shield" && <Shield className="h-6 w-6 text-cyan-400" />}
                          {template.icon === "Database" && <Database className="h-6 w-6 text-orange-400" />}
                          {template.icon === "UserX" && <UserX className="h-6 w-6 text-yellow-400" />}
                          {template.icon === "Key" && <Key className="h-6 w-6 text-green-400" />}
                          {template.icon === "AlertTriangle" && <AlertTriangle className="h-6 w-6 text-pink-400" />}
                        </div>
                        <span className="rounded-full bg-cyan-500/20 px-2 py-1 text-xs font-semibold text-cyan-400">
                          {template.automationLevel}
                        </span>
                      </div>

                      <h3 className="mb-2 text-lg font-bold text-white">{template.name}</h3>
                      <p className="mb-4 text-sm text-gray-400 line-clamp-2">{template.description}</p>

                      <div className="mb-4 space-y-2 text-xs text-gray-500">
                        <div className="flex items-center justify-between">
                          <span>Category:</span>
                          <span className="font-semibold text-gray-300">{template.category}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Steps:</span>
                          <span className="font-semibold text-gray-300">{template.steps}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Est. Time:</span>
                          <span className="font-semibold text-gray-300">{template.estimatedTime}</span>
                        </div>
                      </div>

                      <div className="mb-4 flex flex-wrap gap-1">
                        {template.tags.map((tag) => (
                          <span key={tag} className="rounded bg-gray-800 px-2 py-1 text-xs text-gray-400">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <Button className="w-full bg-cyan-500 text-black hover:bg-cyan-400">Use Template</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <Card className="border-border/50 bg-card/50">
                  <CardContent className="p-12 text-center">
                    <BarChart3 className="mx-auto mb-4 h-12 w-12 text-gray-600" />
                    <h3 className="mb-2 text-lg font-semibold text-white">No Templates Found</h3>
                    <p className="text-sm text-gray-400">
                      Try adjusting your search query to find relevant playbook templates
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
