"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TopRiskyUsersTable } from "@/components/top-risky-users-table"
import { UserBehaviorStats } from "@/components/user-behavior-stats"
import { Shield } from "lucide-react"
import { TopThreatsPanel } from "@/components/top-threats-panel"
import { DepartingEmployeesPanel } from "@/components/departing-employees-panel"
import { WatchlistedEntitiesPanel } from "@/components/watchlisted-entities-panel"
import { TopViolationsPanel } from "@/components/top-violations-panel"
import { WatchlistedHostsPanel } from "@/components/watchlisted-hosts-panel"

export default function UserAnalyticsPage() {
  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-purple-400" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                User Entity Behaviour Analytics
              </h1>
            </div>
            <p className="text-muted-foreground">
              Advanced behavioral analysis and anomaly detection for user entities
            </p>
          </div>

          <UserBehaviorStats />

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Card className="border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-purple-400">Top Violators</CardTitle>
              </CardHeader>
              <CardContent>
                <TopRiskyUsersTable />
              </CardContent>
            </Card>

            <Card className="border-red-500/20">
              <CardHeader>
                <CardTitle className="text-red-400">Top Threats</CardTitle>
              </CardHeader>
              <CardContent>
                <TopThreatsPanel />
              </CardContent>
            </Card>

            <Card className="border-orange-500/20">
              <CardHeader>
                <CardTitle className="text-orange-400">Departing Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <DepartingEmployeesPanel />
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <Card className="border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400">Watchlisted Entities</CardTitle>
              </CardHeader>
              <CardContent>
                <WatchlistedEntitiesPanel />
              </CardContent>
            </Card>

            <Card className="border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-yellow-400">Top Violations</CardTitle>
              </CardHeader>
              <CardContent>
                <TopViolationsPanel />
              </CardContent>
            </Card>

            <Card className="border-pink-500/20">
              <CardHeader>
                <CardTitle className="text-pink-400">Watchlisted Hosts</CardTitle>
              </CardHeader>
              <CardContent>
                <WatchlistedHostsPanel />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
