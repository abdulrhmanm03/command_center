export const runtime = "nodejs"

export async function GET() {
  try {
    const stats = {
      totalPlaybooks: 6,
      activePlaybooks: 6,
      totalExecutions: 558,
      avgSuccessRate: 92.7,
      avgResponseTime: "6m 15s",
      executionsToday: 23,
      executionTrend: [
        { time: "00:00", count: 2 },
        { time: "04:00", count: 1 },
        { time: "08:00", count: 5 },
        { time: "12:00", count: 8 },
        { time: "16:00", count: 4 },
        { time: "20:00", count: 3 },
      ],
      categoryBreakdown: [
        { category: "Malware", count: 168, percentage: 30 },
        { category: "Email Security", count: 89, percentage: 16 },
        { category: "Authentication", count: 234, percentage: 42 },
        { category: "OT/ICS", count: 67, percentage: 12 },
      ],
    }

    return Response.json(stats)
  } catch (error) {
    console.error("[v0] Stats fetch error:", error)
    return Response.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
