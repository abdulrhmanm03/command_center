export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get("severity")
    const status = searchParams.get("status")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    // In production, this would query Vercel Postgres
    // Example: await sql`SELECT * FROM alerts WHERE severity = ${severity} ORDER BY timestamp DESC LIMIT ${limit}`

    // Mock data for now
    const mockAlerts = Array.from({ length: 10 }, (_, i) => ({
      id: `alert-${i}`,
      timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      severity: ["critical", "high", "medium", "low"][i % 4],
      category: ["Malware", "Intrusion", "Policy Violation", "Anomaly"][i % 4],
      message: `Security alert ${i + 1}`,
      source_ip: `192.168.1.${i + 1}`,
      status: "open",
    }))

    return Response.json({
      alerts: mockAlerts,
      total: mockAlerts.length,
    })
  } catch (error) {
    console.error("[v0] Alerts fetch error:", error)
    return Response.json({ error: "Failed to fetch alerts" }, { status: 500 })
  }
}
