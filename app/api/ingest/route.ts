export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.event_type || !body.source) {
      return Response.json({ error: "Missing required fields: event_type, source" }, { status: 400 })
    }

    // In production, this would insert into Vercel Postgres
    // Example: await sql`INSERT INTO events (event_type, source, details) VALUES (${body.event_type}, ${body.source}, ${JSON.stringify(body.details)})`

    console.log("[v0] Event ingested:", body)

    return Response.json({
      success: true,
      message: "Event ingested successfully",
      id: Math.random().toString(36).substring(7),
    })
  } catch (error) {
    console.error("[v0] Ingestion error:", error)
    return Response.json({ error: "Failed to ingest event" }, { status: 500 })
  }
}
