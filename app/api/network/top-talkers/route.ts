import { NextResponse } from "next/server"

export async function GET() {
  const baseIPs = [
    { ip: "192.168.1.100", baseTraffic: 2400 },
    { ip: "10.0.0.45", baseTraffic: 1800 },
    { ip: "172.16.0.23", baseTraffic: 1500 },
    { ip: "192.168.1.87", baseTraffic: 1200 },
    { ip: "10.0.0.156", baseTraffic: 980 },
    { ip: "172.16.0.99", baseTraffic: 850 },
    { ip: "192.168.1.201", baseTraffic: 720 },
    { ip: "10.0.0.78", baseTraffic: 650 },
  ]

  const maxTraffic = baseIPs[0].baseTraffic * 1.1

  const talkers = baseIPs.map(({ ip, baseTraffic }) => {
    const variance = Math.random() * 0.2 + 0.9 // 90-110% variance
    const traffic = Math.floor(baseTraffic * variance)
    return {
      ip,
      traffic: traffic >= 1000 ? `${(traffic / 1000).toFixed(1)} GB` : `${traffic} MB`,
      percentage: Math.floor((traffic / maxTraffic) * 100),
    }
  })

  return NextResponse.json({ talkers })
}
