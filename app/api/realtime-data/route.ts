export const dynamic = "force-dynamic"

const threatMessages = [
  "Suspicious login attempt detected",
  "Malware signature detected in file upload",
  "Brute force attack blocked",
  "Unauthorized API access attempt",
  "SQL injection attempt detected",
  "Cross-site scripting (XSS) blocked",
  "Port scan detected from external IP",
  "Privilege escalation attempt",
  "Data exfiltration attempt blocked",
  "Phishing email detected and quarantined",
  "Ransomware behavior detected",
  "DDoS attack mitigated",
  "Credential stuffing attack blocked",
  "Zero-day exploit attempt detected",
  "Insider threat activity flagged",
]

const severities = ["critical", "high", "medium", "low"] as const

function generateRandomIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}

function generateThreatEvent() {
  return {
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toLocaleTimeString(),
    message: threatMessages[Math.floor(Math.random() * threatMessages.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    ip: Math.random() > 0.3 ? generateRandomIP() : undefined,
  }
}

export async function GET() {
  // Generate 1-3 new threat events
  const numEvents = Math.floor(Math.random() * 3) + 1
  const threats = Array.from({ length: numEvents }, generateThreatEvent)

  // Generate updated metrics
  const metrics = {
    totalAlerts: Math.floor(1287 + Math.random() * 20 - 10),
    itAlerts: Math.floor(1091 + Math.random() * 15 - 7),
    criticalAnomalies: Math.floor(20 + Math.random() * 5 - 2),
    vulnerabilities: Math.floor(230 + Math.random() * 10 - 5),
    mttd: (1.2 + (Math.random() * 0.4 - 0.2)).toFixed(1),
    eventsPerMin: Math.floor(2472 + Math.random() * 100 - 50),
    activeIncidents: Math.floor(8 + Math.random() * 3 - 1),
    blockedThreats: Math.floor(156 + Math.random() * 10 - 5),
  }

  return Response.json({
    threats,
    metrics,
    timestamp: new Date().toISOString(),
  })
}
