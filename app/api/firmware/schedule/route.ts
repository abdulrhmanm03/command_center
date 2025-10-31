export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { firmwareId, scheduledAt } = body

    if (!firmwareId || !scheduledAt) {
      return Response.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // In production, update the database
    // await db.query('UPDATE firmware_updates SET scheduled_at = $1, status = $2 WHERE id = $3', [scheduledAt, 'scheduled', firmwareId])

    return Response.json({
      success: true,
      message: "Firmware update scheduled successfully",
      data: {
        firmwareId,
        scheduledAt,
        status: "scheduled",
      },
    })
  } catch (error) {
    console.error("[v0] Error scheduling firmware update:", error)
    return Response.json({ success: false, error: "Failed to schedule update" }, { status: 500 })
  }
}
