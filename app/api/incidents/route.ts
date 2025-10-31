export const runtime = "nodejs"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const severity = searchParams.get("severity")
    const limit = Number.parseInt(searchParams.get("limit") || "50")

    const mockIncidents = Array.from({ length: 236 }, (_, i) => ({
      id: `INC-${1000 + i}`,
      riskObjectName: [
        "David's Laptop",
        "WIN-50039N7",
        "WIN-50012N0",
        "User: james.laker",
        "Adam's Desktop",
        "AWS-API-001",
        "AWS-API-002",
        "AWS-API-003",
        "WIN-50012N1",
        "WIN-50044N4",
      ][i % 10],
      title: [
        "24 hour risk threshold exceeded",
        "6 hour risk threshold exceeded",
        "24 hour risk threshold exceeded",
        "Personally Identifiable Information Detected",
        "24 hour risk threshold exceeded",
        "AWS Guard Duty Alert (AWS_API_CALL)",
        "AWS Guard Duty Alert (AWS_API_CALL)",
        "AWS Guard Duty Alert (AWS_API_CALL)",
        "12 hour risk threshold exceeded",
        "24 hour risk threshold exceeded",
      ][i % 10],
      severity: [
        "critical",
        "critical",
        "critical",
        "high",
        "critical",
        "high",
        "high",
        "high",
        "critical",
        "critical",
      ][i % 10],
      urgency: ["critical", "critical", "critical", "high", "critical", "high", "high", "high", "critical", "critical"][
        i % 10
      ],
      status: ["new", "new", "new", "in_progress", "pending", "new", "in_progress", "pending", "new", "new"][i % 10],
      type: [
        "risk_notable",
        "risk_notable",
        "risk_notable",
        "notable",
        "risk_notable",
        "notable",
        "notable",
        "notable",
        "risk_notable",
        "risk_notable",
      ][i % 10],
      owner: [
        "Tony Highlander",
        "Jason Bond",
        "Evan Landal",
        "James Laker",
        "Bishop Holding",
        "Ben Parker",
        "Peter Park",
        "Casy Runner",
        "Boris Johnson",
        "Jen Anderson",
      ][i % 10],
      securityDomain: [
        "endpoint",
        "endpoint",
        "endpoint",
        "access",
        "endpoint",
        "network",
        "network",
        "network",
        "endpoint",
        "endpoint",
      ][i % 10],
      aggregatedRiskScore: [210, 190, 190, null, 200, null, null, null, 160, 170][i % 10],
      riskEvents: [14, 12, 12, null, 9, null, null, null, 10, 11][i % 10],
      time: new Date(Date.now() - i * 3600000 * 2).toISOString(),
      created_at: new Date(Date.now() - i * 3600000 * 2).toISOString(),
    }))

    return Response.json({
      incidents: mockIncidents,
      total: mockIncidents.length,
      distributions: {
        urgency: {
          critical: mockIncidents.filter((i) => i.urgency === "critical").length,
          high: mockIncidents.filter((i) => i.urgency === "high").length,
          medium: mockIncidents.filter((i) => i.urgency === "medium").length,
          low: mockIncidents.filter((i) => i.urgency === "low").length,
          info: mockIncidents.filter((i) => i.urgency === "info").length,
        },
        type: {
          risk_notable: mockIncidents.filter((i) => i.type === "risk_notable").length,
          notable: mockIncidents.filter((i) => i.type === "notable").length,
        },
        status: {
          unassigned: mockIncidents.filter((i) => !i.owner).length,
          new: mockIncidents.filter((i) => i.status === "new").length,
          in_progress: mockIncidents.filter((i) => i.status === "in_progress").length,
          pending: mockIncidents.filter((i) => i.status === "pending").length,
          resolved: mockIncidents.filter((i) => i.status === "resolved").length,
          closed: mockIncidents.filter((i) => i.status === "closed").length,
        },
        owner: {
          carl: mockIncidents.filter((i) => i.owner?.includes("Carl")).length,
          vishal: mockIncidents.filter((i) => i.owner?.includes("Vishal")).length,
          terry: mockIncidents.filter((i) => i.owner?.includes("Terry")).length,
          jamie: mockIncidents.filter((i) => i.owner?.includes("Jamie")).length,
          lin: mockIncidents.filter((i) => i.owner?.includes("Lin")).length,
        },
        securityDomain: {
          access: mockIncidents.filter((i) => i.securityDomain === "access").length,
          endpoint: mockIncidents.filter((i) => i.securityDomain === "endpoint").length,
          network: mockIncidents.filter((i) => i.securityDomain === "network").length,
          threat: mockIncidents.filter((i) => i.securityDomain === "threat").length,
          identity: mockIncidents.filter((i) => i.securityDomain === "identity").length,
          audit: mockIncidents.filter((i) => i.securityDomain === "audit").length,
        },
      },
    })
  } catch (error) {
    console.error("[v0] Incidents fetch error:", error)
    return Response.json({ error: "Failed to fetch incidents" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    if (!body.title || !body.severity) {
      return Response.json({ error: "Missing required fields: title, severity" }, { status: 400 })
    }

    // In production, insert into Vercel Postgres
    const newIncident = {
      id: `INC-${Math.floor(Math.random() * 9000) + 1000}`,
      ...body,
      created_at: new Date().toISOString(),
      status: "open",
    }

    console.log("[v0] Incident created:", newIncident)

    return Response.json(newIncident, { status: 201 })
  } catch (error) {
    console.error("[v0] Incident creation error:", error)
    return Response.json({ error: "Failed to create incident" }, { status: 500 })
  }
}
