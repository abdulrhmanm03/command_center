export const runtime = "nodejs"

export async function GET() {
  try {
    // Mock playbooks data with comprehensive metrics
    const playbooks = [
      {
        id: "PB-001",
        name: "Malware Incident Response",
        description: "Automated response to malware detection alerts",
        status: "active",
        lastRun: "2 hours ago",
        successRate: 94,
        avgDuration: "8 minutes",
        executions: 156,
        triggers: ["EDR Alert", "File Hash Match"],
        steps: 12,
        automationLevel: "semi-automated",
        category: "Malware",
        trend: "+5%",
      },
      {
        id: "PB-002",
        name: "Phishing Email Response",
        description: "Quarantine and analyze suspicious emails",
        status: "active",
        lastRun: "45 minutes ago",
        successRate: 98,
        avgDuration: "3 minutes",
        executions: 89,
        triggers: ["Email Security Alert", "User Report"],
        steps: 8,
        automationLevel: "fully-automated",
        category: "Email Security",
        trend: "+12%",
      },
      {
        id: "PB-003",
        name: "Brute Force Attack Mitigation",
        description: "Block IPs and disable accounts after failed logins",
        status: "active",
        lastRun: "1 hour ago",
        successRate: 91,
        avgDuration: "2 minutes",
        executions: 234,
        triggers: ["Failed Login Threshold", "SIEM Alert"],
        steps: 6,
        automationLevel: "fully-automated",
        category: "Authentication",
        trend: "+8%",
      },
      {
        id: "PB-004",
        name: "Data Exfiltration Response",
        description: "Investigate and contain potential data theft",
        status: "active",
        lastRun: "Never",
        successRate: 0,
        avgDuration: "15 minutes",
        executions: 0,
        triggers: ["DLP Alert", "Unusual Data Transfer"],
        steps: 15,
        automationLevel: "manual",
        category: "Data Protection",
        trend: "0%",
      },
      {
        id: "PB-005",
        name: "OT Security Incident",
        description: "Respond to operational technology security events",
        status: "active",
        lastRun: "3 hours ago",
        successRate: 87,
        avgDuration: "12 minutes",
        executions: 67,
        triggers: ["OT Anomaly", "Protocol Violation"],
        steps: 10,
        automationLevel: "semi-automated",
        category: "OT/ICS",
        trend: "+3%",
      },
      {
        id: "PB-006",
        name: "Ransomware Containment",
        description: "Isolate infected systems and prevent spread",
        status: "active",
        lastRun: "5 days ago",
        successRate: 96,
        avgDuration: "5 minutes",
        executions: 12,
        triggers: ["Ransomware Detection", "File Encryption Alert"],
        steps: 9,
        automationLevel: "fully-automated",
        category: "Malware",
        trend: "+15%",
      },
    ]

    return Response.json(playbooks)
  } catch (error) {
    console.error("[v0] Playbooks fetch error:", error)
    return Response.json({ error: "Failed to fetch playbooks" }, { status: 500 })
  }
}
