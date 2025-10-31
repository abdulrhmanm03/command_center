"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DetectionPacksTab } from "@/components/detection-packs-tab"
import { IntegrationsTab } from "@/components/integrations-tab"
import { ReportsTab } from "@/components/reports-tab"
import { Card, CardContent } from "@/components/ui/card"
import { Package, Plug, FileText, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"

export default function MarketplacePage() {
  const [stats, setStats] = useState({
    totalPacks: 0,
    installedPacks: 0,
    connectedIntegrations: 0,
    activeReports: 0,
  })

  useEffect(() => {
    // Fetch marketplace stats
    const fetchStats = async () => {
      try {
        const [packsRes, integrationsRes, reportsRes] = await Promise.all([
          fetch("/api/marketplace/detection-packs"),
          fetch("/api/marketplace/integrations"),
          fetch("/api/marketplace/reports"),
        ])
        const packs = await packsRes.json()
        const integrations = await integrationsRes.json()
        const reports = await reportsRes.json()

        setStats({
          totalPacks: packs.length,
          installedPacks: packs.filter((p: any) => p.status === "installed").length,
          connectedIntegrations: integrations.filter((i: any) => i.status === "connected").length,
          activeReports: reports.filter((r: any) => r.status === "active").length,
        })
      } catch (error) {
        console.error("Failed to fetch marketplace stats:", error)
      }
    }
    fetchStats()
  }, [])

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-cyan-400">Marketplace</h1>
            <p className="text-muted-foreground">
              Extend your security capabilities with detection packs, integrations, and reports
            </p>
          </div>

          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card className="border-slate-700 bg-gradient-to-br from-cyan-500/10 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Detection Packs</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.installedPacks}/{stats.totalPacks}
                    </p>
                    <p className="text-xs text-cyan-400">Installed</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20">
                    <Package className="h-6 w-6 text-cyan-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-green-500/10 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Integrations</p>
                    <p className="text-2xl font-bold text-white">{stats.connectedIntegrations}</p>
                    <p className="text-xs text-green-400">Connected</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                    <Plug className="h-6 w-6 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-purple-500/10 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Active Reports</p>
                    <p className="text-2xl font-bold text-white">{stats.activeReports}</p>
                    <p className="text-xs text-purple-400">Scheduled</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
                    <FileText className="h-6 w-6 text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-gradient-to-br from-orange-500/10 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Coverage</p>
                    <p className="text-2xl font-bold text-white">
                      {stats.totalPacks > 0 ? Math.round((stats.installedPacks / stats.totalPacks) * 100) : 0}%
                    </p>
                    <p className="text-xs text-orange-400">Deployment</p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/20">
                    <TrendingUp className="h-6 w-6 text-orange-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="detection-packs" className="space-y-6">
            <TabsList className="bg-card">
              <TabsTrigger value="detection-packs" className="data-[state=active]:text-cyan-400">
                Detection Content Packs
              </TabsTrigger>
              <TabsTrigger value="integrations" className="data-[state=active]:text-cyan-400">
                Integrations
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:text-cyan-400">
                Reports
              </TabsTrigger>
            </TabsList>

            <TabsContent value="detection-packs">
              <DetectionPacksTab />
            </TabsContent>

            <TabsContent value="integrations">
              <IntegrationsTab />
            </TabsContent>

            <TabsContent value="reports">
              <ReportsTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
