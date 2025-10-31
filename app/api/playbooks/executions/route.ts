export const runtime = "nodejs"

export async function GET() {
  try {
    // Mock recent executions
    const executions = Array.from({ length: 10 }, (_, i) => ({
      id: `EXEC-${1000 + i}`,
      playbookId: ["PB-001", "PB-002", "PB-003", "PB-001", "PB-005", "PB-002", "PB-003", "PB-006", "PB-001", "PB-002"][
        i
      ],
      playbookName: [
        "Malware Incident Response",
        "Phishing Email Response",
        "Brute Force Attack Mitigation",
        "Malware Incident Response",
        "OT Security Incident",
        "Phishing Email Response",
        "Brute Force Attack Mitigation",
        "Ransomware Containment",
        "Malware Incident Response",
        "Phishing Email Response",
      ][i],
      status: [
        "completed",
        "completed",
        "running",
        "completed",
        "failed",
        "completed",
        "completed",
        "completed",
        "running",
        "completed",
      ][i],
      startedAt: new Date(Date.now() - i * 600000).toISOString(),
      duration: [
        "8m 23s",
        "2m 45s",
        "In progress",
        "7m 12s",
        "Failed at 5m",
        "3m 01s",
        "1m 58s",
        "4m 33s",
        "In progress",
        "2m 55s",
      ][i],
      triggeredBy: [
        "EDR Alert",
        "User Report",
        "SIEM Alert",
        "File Hash Match",
        "OT Anomaly",
        "Email Security Alert",
        "Failed Login Threshold",
        "Ransomware Detection",
        "EDR Alert",
        "User Report",
      ][i],
      incidentId: `INC-${2000 + i}`,
      stepsCompleted: [12, 8, 4, 12, 7, 8, 6, 9, 5, 8][i],
      totalSteps: [12, 8, 6, 12, 10, 8, 6, 9, 12, 8][i],
    }))

    return Response.json(executions)
  } catch (error) {
    console.error("[v0] Executions fetch error:", error)
    return Response.json({ error: "Failed to fetch executions" }, { status: 500 })
  }
}
