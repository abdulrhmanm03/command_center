import { CyberThreatRadar } from "@/components/cyber-threat-radar"
import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"

export const metadata = {
  title: "CyberThreat Radar | VTS Command Centre",
  description: "Real-time threat visualization and attack monitoring",
}

export default function ThreatMapPage() {
  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-hidden">
          <CyberThreatRadar />
        </main>
      </div>
    </div>
  )
}
