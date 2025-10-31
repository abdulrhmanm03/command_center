export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.playbook_id || !body.incident_id) {
      return Response.json({ error: "Missing required fields: playbook_id, incident_id" }, { status: 400 })
    }

    // Simulate playbook execution
    const execution = {
      id: `EXEC-${Math.random().toString(36).substring(7)}`,
      playbook_id: body.playbook_id,
      incident_id: body.incident_id,
      status: "running",
      started_at: new Date().toISOString(),
      steps: [
        { name: "Validate target", status: "completed", duration: "0.5s" },
        { name: "Execute action", status: "running", duration: null },
        { name: "Verify result", status: "pending", duration: null },
        { name: "Update incident", status: "pending", duration: null },
      ],
    }

    console.log("[v0] Playbook execution started:", execution)

    return Response.json(execution, { status: 200 })
  } catch (error) {
    console.error("[v0] Playbook execution error:", error)
    return Response.json({ error: "Failed to execute playbook" }, { status: 500 })
  }
}
