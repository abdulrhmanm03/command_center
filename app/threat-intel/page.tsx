import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ThreatIntelStats } from "@/components/threat-intel-stats"
import { ThreatActorsTable } from "@/components/threat-actors-table"
import { IOCTable } from "@/components/ioc-table"
import { ThreatTrendsChart } from "@/components/threat-trends-chart"
import { ThreatCategoriesChart } from "@/components/threat-categories-chart"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ThreatIntelPage() {
  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Threat Intelligence</h1>
            <p className="text-muted-foreground">Monitor threat actors and indicators of compromise</p>
          </div>

          <ThreatIntelStats />

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Threat Activity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ThreatTrendsChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Threat Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <ThreatCategoriesChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Threat Actors</CardTitle>
              </CardHeader>
              <CardContent>
                <ThreatActorsTable />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Indicators of Compromise</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList>
                    <TabsTrigger value="all">All IOCs</TabsTrigger>
                    <TabsTrigger value="ip">IP Addresses</TabsTrigger>
                    <TabsTrigger value="domain">Domains</TabsTrigger>
                    <TabsTrigger value="hash">File Hashes</TabsTrigger>
                  </TabsList>
                  <TabsContent value="all" className="mt-4">
                    <IOCTable filter="all" />
                  </TabsContent>
                  <TabsContent value="ip" className="mt-4">
                    <IOCTable filter="ip" />
                  </TabsContent>
                  <TabsContent value="domain" className="mt-4">
                    <IOCTable filter="domain" />
                  </TabsContent>
                  <TabsContent value="hash" className="mt-4">
                    <IOCTable filter="hash" />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
