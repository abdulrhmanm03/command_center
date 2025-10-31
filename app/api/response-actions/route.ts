export const runtime = "nodejs"

interface ResponseAction {
  action: "isolate_endpoint" | "block_ip" | "disable_user" | "delete_email"
  target: string
  reason: string
}

export async function POST(request: Request) {
  try {
    const body: ResponseAction = await request.json()

    if (!body.action || !body.target) {
      return Response.json({ error: "Missing required fields: action, target" }, { status: 400 })
    }

    // Simulate automated response actions
    const actionResults: Record<string, string> = {
      isolate_endpoint: `Endpoint ${body.target} has been isolated from the network`,
      block_ip: `IP address ${body.target} has been blocked at the firewall`,
      disable_user: `User account ${body.target} has been disabled in Active Directory`,
      delete_email: `Email ${body.target} has been deleted from all mailboxes`,
    }

    const result = {
      id: `ACTION-${Math.random().toString(36).substring(7)}`,
      action: body.action,
      target: body.target,
      status: "completed",
      message: actionResults[body.action] || "Action completed",
      executed_at: new Date().toISOString(),
      executed_by: "VTS Automation",
    }

    console.log("[v0] Response action executed:", result)

    return Response.json(result, { status: 200 })
  } catch (error) {
    console.error("[v0] Response action error:", error)
    return Response.json({ error: "Failed to execute response action" }, { status: 500 })
  }
}
