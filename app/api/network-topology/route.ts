export async function GET() {
  const zones = [
    {
      id: "corporate",
      name: "Corporate Network",
      subnet: "10.0.0.0/16",
      devices: 1247 + Math.floor(Math.random() * 20),
      status: "Healthy",
      lastScan: "2 hours ago",
      bandwidth: "2.4 Gbps",
      threats: 3,
      uptime: 99.8,
    },
    {
      id: "dmz",
      name: "DMZ",
      subnet: "192.168.100.0/24",
      devices: 23 + Math.floor(Math.random() * 5),
      status: "Monitoring",
      lastScan: "1 hour ago",
      bandwidth: "890 Mbps",
      threats: 12,
      uptime: 99.5,
    },
    {
      id: "ot",
      name: "OT Network",
      subnet: "10.45.0.0/16",
      devices: 156 + Math.floor(Math.random() * 10),
      status: "Critical",
      lastScan: "30 minutes ago",
      bandwidth: "1.2 Gbps",
      threats: 28,
      uptime: 98.2,
    },
    {
      id: "guest",
      name: "Guest Network",
      subnet: "172.16.0.0/24",
      devices: 89 + Math.floor(Math.random() * 15),
      status: "Normal",
      lastScan: "45 minutes ago",
      bandwidth: "450 Mbps",
      threats: 7,
      uptime: 99.9,
    },
  ]

  const trafficFlows = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    inbound: Math.floor(Math.random() * 1000) + 500,
    outbound: Math.floor(Math.random() * 800) + 400,
    blocked: Math.floor(Math.random() * 100) + 20,
  }))

  const criticalAssets = [
    { name: "DC-01", ip: "10.0.1.10", type: "Domain Controller", risk: 95, connections: 1247 },
    { name: "DB-PROD-01", ip: "10.0.2.50", type: "Database Server", risk: 88, connections: 456 },
    { name: "WEB-DMZ-01", ip: "192.168.100.10", type: "Web Server", risk: 72, connections: 2341 },
    { name: "SCADA-01", ip: "10.45.1.100", type: "SCADA System", risk: 91, connections: 89 },
  ]

  return Response.json({
    zones,
    trafficFlows,
    criticalAssets,
    summary: {
      totalDevices: zones.reduce((acc, z) => acc + z.devices, 0),
      activeThreats: zones.reduce((acc, z) => acc + z.threats, 0),
      avgUptime: (zones.reduce((acc, z) => acc + z.uptime, 0) / zones.length).toFixed(1),
      totalBandwidth: "4.94 Gbps",
    },
  })
}
