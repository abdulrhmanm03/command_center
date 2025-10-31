import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserActivityChart } from "@/components/user-activity-chart"
import { RiskScoreChart } from "@/components/risk-score-chart"
import { TopRiskyUsersTable } from "@/components/top-risky-users-table"
import { UserBehaviorStats } from "@/components/user-behavior-stats"
import { AnomalousActivityChart } from "@/components/anomalous-activity-chart"
import { LoginPatternsChart } from "@/components/login-patterns-chart"
import { VulnerabilityTreemap } from "@/components/vulnerability-treemap"

export default function UserAnalyticsPage() {
  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">User Behavior Analytics</h1>
            <p className="text-muted-foreground">Monitor user activity and detect anomalies</p>
          </div>

          <UserBehaviorStats />

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>User Activity Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <UserActivityChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Score Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <RiskScoreChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Anomalous Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <AnomalousActivityChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Login Patterns</CardTitle>
              </CardHeader>
              <CardContent>
                <LoginPatternsChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Asset Vulnerability Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Size represents vulnerability count</p>
              </CardHeader>
              <CardContent>
                <VulnerabilityTreemap />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>High-Risk Users</CardTitle>
              </CardHeader>
              <CardContent>
                <TopRiskyUsersTable />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
