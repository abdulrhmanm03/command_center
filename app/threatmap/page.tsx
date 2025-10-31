import { CyberThreatRadar } from "@/components/cyber-threat-radar"

export const metadata = {
  title: "CyberThreat Radar | VTS Command Centre",
  description: "Real-time threat visualization and attack monitoring",
}

export default function ThreatMapPage() {
  return (
    <div className="h-screen w-full overflow-hidden">
      <CyberThreatRadar />
    </div>
  )
}
