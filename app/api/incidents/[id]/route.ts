import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const incidentId = params.id

  // Generate comprehensive incident details with live data
  const incident = {
    id: incidentId,
    title: "Brute Force Attack Detected on Admin Portal",
    description:
      "Multiple failed authentication attempts detected from suspicious IP addresses targeting administrative accounts. Potential brute force attack in progress with coordinated attempts from multiple geographic locations.",
    riskObjectName: "admin-portal-01",
    urgency: "critical",
    status: "in_progress",
    owner: "Carl Thompson",
    time: new Date(Date.now() - 3600000).toISOString(),
    aggregatedRiskScore: 245,
    riskEvents: 127,
    type: "risk_notable",
    securityDomain: "access",
  }

  const liveData = {
    isActive: true,
    eventsDetected: 127,
    failedAttempts: 89,
    sourceIPs: 12,
    duration: "1h 23m",
    lastUpdated: "2 seconds ago",

    mitreTactics: [
      {
        id: "T1110",
        name: "Brute Force",
        tactic: "Credential Access",
      },
      {
        id: "T1078",
        name: "Valid Accounts",
        tactic: "Initial Access",
      },
      {
        id: "T1071",
        name: "Application Layer Protocol",
        tactic: "Command and Control",
      },
      {
        id: "T1133",
        name: "External Remote Services",
        tactic: "Persistence",
      },
    ],

    affectedAssets: [
      {
        name: "admin-portal-01",
        ip: "10.0.1.50",
        type: "server",
      },
      {
        name: "auth-service-02",
        ip: "10.0.1.51",
        type: "server",
      },
      {
        name: "firewall-dmz-01",
        ip: "10.0.0.1",
        type: "network",
      },
    ],

    activityTrend: [
      { time: "12:00", events: 5 },
      { time: "12:15", events: 12 },
      { time: "12:30", events: 23 },
      { time: "12:45", events: 34 },
      { time: "13:00", events: 45 },
      { time: "13:15", events: 38 },
      { time: "13:30", events: 27 },
    ],

    timeline: [
      {
        type: "detected",
        title: "Incident Detected",
        description: "Automated detection system identified suspicious authentication patterns",
        time: "1h 23m ago",
      },
      {
        type: "escalated",
        title: "Escalated to Critical",
        description: "Risk score exceeded threshold, escalated to critical priority",
        time: "1h 15m ago",
      },
      {
        type: "action",
        title: "Assigned to Carl Thompson",
        description: "Incident assigned to SOC analyst for investigation",
        time: "1h 10m ago",
      },
      {
        type: "action",
        title: "Firewall Rules Updated",
        description: "Temporary blocking rules applied to suspicious source IPs",
        time: "45m ago",
      },
      {
        type: "action",
        title: "Investigation Started",
        description: "Deep packet inspection and log analysis initiated",
        time: "30m ago",
      },
    ],

    evidence: {
      network: [
        { label: "Source IP", value: "185.220.101.45", type: "IPv4" },
        { label: "Source Country", value: "Russia", type: "GeoIP" },
        { label: "Target Port", value: "443 (HTTPS)", type: "Port" },
        { label: "Protocol", value: "TLS 1.3", type: "Protocol" },
        { label: "User Agent", value: "Mozilla/5.0 (automated)", type: "HTTP" },
      ],
      system: [
        { label: "Process", value: "nginx.exe", type: "Process" },
        { label: "User", value: "admin", type: "Account" },
        { label: "Session ID", value: "sess_a7b9c2d4e5f6", type: "Session" },
        { label: "Log Source", value: "/var/log/auth.log", type: "File" },
      ],
    },

    responseActions: [
      {
        title: "Block Source IPs",
        description: "Added 12 suspicious IPs to firewall blocklist",
        status: "completed",
        executedBy: "Auto-Response System",
        time: "45m ago",
      },
      {
        title: "Enable Rate Limiting",
        description: "Applied aggressive rate limiting on admin portal",
        status: "completed",
        executedBy: "Carl Thompson",
        time: "30m ago",
      },
      {
        title: "Notify Security Team",
        description: "Alert sent to security team via Slack and email",
        status: "completed",
        executedBy: "Auto-Response System",
        time: "1h 15m ago",
      },
      {
        title: "Collect Forensic Data",
        description: "Capturing network traffic and system logs for analysis",
        status: "pending",
        executedBy: "Forensics Bot",
        time: "In progress",
      },
    ],

    relatedIncidents: [
      {
        id: "inc-002",
        title: "Failed SSH Login Attempts",
        severity: "high",
        time: "2 days ago",
        similarity: 87,
      },
      {
        id: "inc-003",
        title: "Suspicious API Access Pattern",
        severity: "medium",
        time: "5 days ago",
        similarity: 65,
      },
      {
        id: "inc-004",
        title: "Credential Stuffing Attack",
        severity: "critical",
        time: "1 week ago",
        similarity: 92,
      },
    ],

    aiRecommendations: [
      "Implement multi-factor authentication (MFA) for all administrative accounts immediately",
      "Deploy CAPTCHA on login pages to prevent automated attacks",
      "Review and strengthen password policies - enforce minimum 12 characters with complexity",
      "Enable account lockout after 3 failed attempts with exponential backoff",
      "Consider implementing IP reputation filtering and geo-blocking for high-risk regions",
    ],
  }

  return NextResponse.json({ incident, liveData })
}
