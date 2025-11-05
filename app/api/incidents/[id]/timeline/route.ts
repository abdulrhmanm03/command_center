import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const bruteForceEvents = [
    {
      id: "e1",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      eventType: "alert",
      severity: "critical",
      title: "Brute-Force Detection Triggered",
      description: "Rate of failed logins exceeds 30/min on admin-portal-01",
      details:
        "Automated brute-force attack detected targeting administrative accounts with high velocity login attempts",
      sourceIP: "185.199.108.153",
      user: null,
      hash: null,
    },
    {
      id: "e2",
      timestamp: new Date(Date.now() - 3540000).toISOString(), // 59 min ago
      eventType: "login",
      severity: "high",
      title: "Failed Login Attempt",
      description: "Authentication failed for admin account",
      details: "Username: admin, Password: *****, Attempt: 1/30",
      sourceIP: "185.199.108.153",
      user: "admin",
      hash: null,
    },
    {
      id: "e3",
      timestamp: new Date(Date.now() - 3480000).toISOString(), // 58 min ago
      eventType: "login",
      severity: "high",
      title: "Failed Login Attempt",
      description: "Authentication failed for admin account",
      details: "Username: admin, Password: *****, Attempt: 2/30",
      sourceIP: "185.199.108.153",
      user: "admin",
      hash: null,
    },
    {
      id: "e4",
      timestamp: new Date(Date.now() - 3420000).toISOString(), // 57 min ago
      eventType: "login",
      severity: "high",
      title: "Failed Login Attempt",
      description: "Authentication failed for admin account",
      details: "Username: admin, Password: *****, Attempt: 5/30",
      sourceIP: "185.199.109.12",
      user: "admin",
      hash: null,
    },
    {
      id: "e5",
      timestamp: new Date(Date.now() - 3300000).toISOString(), // 55 min ago
      eventType: "alert",
      severity: "high",
      title: "Multiple Failed Logins Detected",
      description: "10+ failed login attempts in 2 minutes",
      details: "Threshold exceeded for failed authentication attempts from single source",
      sourceIP: "185.199.108.153",
      user: "admin",
      hash: null,
    },
    {
      id: "e6",
      timestamp: new Date(Date.now() - 3000000).toISOString(), // 50 min ago
      eventType: "login",
      severity: "high",
      title: "Failed Login Attempt",
      description: "Authentication failed for root account",
      details: "Username: root, Password: *****, Attempt: 15/30",
      sourceIP: "185.199.108.153",
      user: "root",
      hash: null,
    },
    {
      id: "e7",
      timestamp: new Date(Date.now() - 2700000).toISOString(), // 45 min ago
      eventType: "block",
      severity: "medium",
      title: "IP Blocked by WAF",
      description: "Source IP blocked for 15 minutes",
      details: "185.199.108.153 blocked due to excessive failed login attempts",
      sourceIP: "185.199.108.153",
      user: null,
      hash: null,
    },
    {
      id: "e8",
      timestamp: new Date(Date.now() - 2400000).toISOString(), // 40 min ago
      eventType: "alert",
      severity: "high",
      title: "New Source IP Detected",
      description: "Additional attacker IP identified",
      details: "Attack continues from new IP address: 203.0.113.45",
      sourceIP: "203.0.113.45",
      user: null,
      hash: null,
    },
    {
      id: "e9",
      timestamp: new Date(Date.now() - 2100000).toISOString(), // 35 min ago
      eventType: "login",
      severity: "high",
      title: "Failed Login Attempt",
      description: "Authentication failed for admin account",
      details: "Username: admin, Password: *****, Attempt: 20/30 from new IP",
      sourceIP: "203.0.113.45",
      user: "admin",
      hash: null,
    },
    {
      id: "e10",
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
      eventType: "process",
      severity: "critical",
      title: "Suspicious Process Spawned",
      description: "Unauthorized process execution detected",
      details: "powershell.exe launched by admin-portal-01 with suspicious parameters",
      sourceIP: "203.0.113.45",
      user: "admin",
      hash: null,
    },
    {
      id: "e11",
      timestamp: new Date(Date.now() - 1500000).toISOString(), // 25 min ago
      eventType: "file",
      severity: "critical",
      title: "Malicious File Downloaded",
      description: "File hash matches known malware signature",
      details: "CLIENT UPDATE.EXE downloaded and executed on admin-portal-01",
      sourceIP: "203.0.113.45",
      user: "admin",
      hash: "17150A137C43235AD07011B55F29FF27",
    },
    {
      id: "e12",
      timestamp: new Date(Date.now() - 1200000).toISOString(), // 20 min ago
      eventType: "alert",
      severity: "critical",
      title: "Malware Execution Detected",
      description: "Known malicious file hash executed",
      details: "VirusTotal match: Trojan.Generic.KD.12345678 - High confidence detection",
      sourceIP: "203.0.113.45",
      user: "admin",
      hash: "17150A137C43235AD07011B55F29FF27",
    },
    {
      id: "e13",
      timestamp: new Date(Date.now() - 900000).toISOString(), // 15 min ago
      eventType: "block",
      severity: "medium",
      title: "Endpoint Isolated",
      description: "admin-portal-01 quarantined via EDR",
      details: "Automatic isolation triggered by EDR to prevent lateral movement",
      sourceIP: null,
      user: null,
      hash: null,
    },
    {
      id: "e14",
      timestamp: new Date(Date.now() - 600000).toISOString(), // 10 min ago
      eventType: "block",
      severity: "medium",
      title: "Additional IP Blocked",
      description: "203.0.113.45 blocked at firewall level",
      details: "Permanent block applied to prevent further attack attempts",
      sourceIP: "203.0.113.45",
      user: null,
      hash: null,
    },
    {
      id: "e15",
      timestamp: new Date(Date.now() - 300000).toISOString(), // 5 min ago
      eventType: "alert",
      severity: "medium",
      title: "Incident Escalated",
      description: "Incident escalated to Tier 2 SOC",
      details: "Manual escalation due to confirmed malware execution and potential data exfiltration",
      sourceIP: null,
      user: null,
      hash: null,
    },
  ]

  return NextResponse.json({
    events: bruteForceEvents,
    summary: {
      totalEvents: bruteForceEvents.length,
      criticalEvents: bruteForceEvents.filter((e) => e.severity === "critical").length,
      highEvents: bruteForceEvents.filter((e) => e.severity === "high").length,
      mediumEvents: bruteForceEvents.filter((e) => e.severity === "medium").length,
      lowEvents: bruteForceEvents.filter((e) => e.severity === "low").length,
    },
  })
}
