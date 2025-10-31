export const runtime = "nodejs"

export async function GET() {
  try {
    // Simulate data pipeline sources with realistic metrics
    const sources = [
      {
        id: "crowdstrike-edr",
        name: "CrowdStrike Falcon EDR",
        category: "EDR",
        throughput: 2300,
        throughputUnit: "events/min",
        latency: 45,
        latencyUnit: "ms",
        uptime: 99.8,
        lastSync: new Date(Date.now() - 30000).toISOString(),
        status: "active",
      },
      {
        id: "sentinel-siem",
        name: "Microsoft Sentinel SIEM",
        category: "SIEM",
        throughput: 5700,
        throughputUnit: "events/min",
        latency: 120,
        latencyUnit: "ms",
        uptime: 99.2,
        lastSync: new Date(Date.now() - 60000).toISOString(),
        status: "active",
      },
      {
        id: "proofpoint-email",
        name: "Proofpoint Email Security",
        category: "Email Security",
        throughput: 890,
        throughputUnit: "events/min",
        latency: 250,
        latencyUnit: "ms",
        uptime: 97.5,
        lastSync: new Date(Date.now() - 300000).toISOString(),
        status: "active",
      },
      {
        id: "palo-alto-firewall",
        name: "Palo Alto Firewall",
        category: "Network Security",
        throughput: 12400,
        throughputUnit: "events/min",
        latency: 35,
        latencyUnit: "ms",
        uptime: 99.9,
        lastSync: new Date(Date.now() - 15000).toISOString(),
        status: "active",
      },
      {
        id: "tenable-scanner",
        name: "Tenable Vulnerability Scanner",
        category: "Vulnerability Management",
        throughput: 156,
        throughputUnit: "scans/hour",
        latency: 2.1,
        latencyUnit: "s",
        uptime: 98.7,
        lastSync: new Date(Date.now() - 120000).toISOString(),
        status: "active",
      },
      {
        id: "ot-security",
        name: "OT Security Platform",
        category: "OT/ICS",
        throughput: 1800,
        throughputUnit: "events/min",
        latency: 85,
        latencyUnit: "ms",
        uptime: 99.5,
        lastSync: new Date(Date.now() - 45000).toISOString(),
        status: "active",
      },
      {
        id: "servicenow-itsm",
        name: "ServiceNow ITSM",
        category: "ITSM",
        throughput: 234,
        throughputUnit: "tickets/hour",
        latency: 150,
        latencyUnit: "ms",
        uptime: 99.1,
        lastSync: new Date(Date.now() - 60000).toISOString(),
        status: "active",
      },
    ]

    // Calculate overall metrics
    const totalEventsPerHour = sources.reduce((sum, source) => {
      if (source.throughputUnit === "events/min") {
        return sum + source.throughput * 60
      }
      return sum
    }, 0)

    const avgLatency = Math.round(
      sources.filter((s) => s.latencyUnit === "ms").reduce((sum, s) => sum + s.latency, 0) /
        sources.filter((s) => s.latencyUnit === "ms").length,
    )

    const dataQualityScore = 94.2 + (Math.random() - 0.5) * 2
    const storageUtilization = 67 + (Math.random() - 0.5) * 3

    return Response.json({
      success: true,
      metrics: {
        totalEventsPerHour: Math.round(totalEventsPerHour),
        processingLatency: avgLatency,
        dataQualityScore: Number.parseFloat(dataQualityScore.toFixed(1)),
        storageUtilization: Number.parseFloat(storageUtilization.toFixed(1)),
      },
      sources,
    })
  } catch (error) {
    console.error("[v0] Pipeline API error:", error)
    return Response.json({ error: "Failed to fetch pipeline data" }, { status: 500 })
  }
}
