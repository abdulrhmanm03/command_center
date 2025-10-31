export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  // Mock scanning status - in production, query from database
  const scanningStatus = {
    activeScans: 42,
    totalDevices: 42,
    lastCompleted: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    nextScan: new Date(Date.now() + 8 * 60 * 1000).toISOString(),
    status: "idle",
    progress: 100,
  }

  return Response.json({ success: true, data: scanningStatus })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action } = body

    if (action === "pause") {
      return Response.json({
        success: true,
        message: "Scanning paused",
        data: { status: "paused" },
      })
    } else if (action === "resume") {
      return Response.json({
        success: true,
        message: "Scanning resumed",
        data: { status: "scanning" },
      })
    } else if (action === "start") {
      return Response.json({
        success: true,
        message: "Scan started",
        data: { status: "scanning", startedAt: new Date().toISOString() },
      })
    }

    return Response.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("[v0] Error updating scan status:", error)
    return Response.json({ success: false, error: "Failed to update scan status" }, { status: 500 })
  }
}
