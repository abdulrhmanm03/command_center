export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const threatMessages = [
  "Suspicious login attempt from Dubai, UAE",
  "Malware signature detected targeting UAE infrastructure",
  "Brute force attack blocked from Abu Dhabi region",
  "Unauthorized API access attempt - UAE government sector",
  "SQL injection attempt detected on UAE banking system",
  "Cross-site scripting (XSS) blocked - UAE target",
  "Port scan detected from external IP targeting UAE",
  "Privilege escalation attempt on UAE critical infrastructure",
  "Data exfiltration attempt blocked - UAE energy sector",
  "Phishing email detected targeting UAE officials",
  "Ransomware behavior detected - UAE healthcare",
  "DDoS attack mitigated against UAE services",
  "Credential stuffing attack blocked - UAE targets",
  "Zero-day exploit attempt detected in UAE region",
  "Insider threat activity flagged - UAE operations",
  "APT group targeting UAE government detected",
  "Desert Falcon activity detected in UAE",
  "MuddyWater campaign targeting UAE infrastructure",
  "Suspicious authentication from UAE Pass system",
  "Anomalous behavior detected in Dubai data center",
]

const severities = ["critical", "high", "medium", "low"] as const

const locations = [
  "Dubai, UAE",
  "Abu Dhabi, UAE",
  "Sharjah, UAE",
  "United Arab Emirates",
  "USA",
  "China",
  "Russia",
  "UK",
  "Germany",
  "India",
]

const threatTypes = [
  "Malware",
  "Phishing",
  "DDoS",
  "Data Breach",
  "Insider Threat",
  "APT",
  "Ransomware",
  "SQL Injection",
  "XSS",
  "Brute Force",
]

function generateRandomIP() {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`
}

function generateThreatEvent() {
  const isUAE = Math.random() > 0.4
  return {
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toISOString(),
    message: threatMessages[Math.floor(Math.random() * threatMessages.length)],
    severity: severities[Math.floor(Math.random() * severities.length)],
    ip: generateRandomIP(),
    location: isUAE
      ? locations[Math.floor(Math.random() * 4)]
      : locations[Math.floor(Math.random() * locations.length)],
    type: threatTypes[Math.floor(Math.random() * threatTypes.length)],
    risk: Math.floor(Math.random() * 100),
  }
}

function generateMetricsUpdate() {
  return {
    type: "metrics",
    timestamp: new Date().toISOString(),
    data: {
      totalAlerts: Math.floor(1287 + Math.random() * 20 - 10),
      itAlerts: Math.floor(1091 + Math.random() * 15 - 7),
      criticalAnomalies: Math.floor(20 + Math.random() * 5 - 2),
      vulnerabilities: Math.floor(230 + Math.random() * 10 - 5),
      mttd: (1.2 + (Math.random() * 0.4 - 0.2)).toFixed(1),
      eventsPerMin: Math.floor(2472 + Math.random() * 100 - 50),
      activeIncidents: Math.floor(8 + Math.random() * 3 - 1),
      blockedThreats: Math.floor(156 + Math.random() * 10 - 5),
      uaeThreats: Math.floor(89 + Math.random() * 15 - 7),
    },
  }
}

function generateFirmwareEvent() {
  const devices = ["Cisco Router R1", "Windows Server 2019", "Ubiquiti AP", "FortiGate Firewall", "Palo Alto Firewall"]
  const statuses = ["scheduled", "applying", "completed", "failed"]
  const device = devices[Math.floor(Math.random() * devices.length)]
  const status = statuses[Math.floor(Math.random() * statuses.length)]

  return {
    type: "firmware",
    timestamp: new Date().toISOString(),
    asset: device,
    status,
    time: status === "scheduled" ? `${Math.floor(Math.random() * 4) + 1}h` : undefined,
    progress: status === "applying" ? Math.floor(Math.random() * 100) : undefined,
  }
}

const vulnerabilityCVEs = [
  "CVE-2024-1234",
  "CVE-2024-5678",
  "CVE-2024-9012",
  "CVE-2024-3456",
  "CVE-2024-7890",
  "CVE-2024-2345",
  "CVE-2024-6789",
  "CVE-2024-4567",
]

const vulnerabilityTitles = [
  "Remote Code Execution vulnerability",
  "SQL Injection vulnerability",
  "Cross-Site Scripting vulnerability",
  "Privilege Escalation vulnerability",
  "Buffer Overflow vulnerability",
  "Authentication Bypass vulnerability",
  "Information Disclosure vulnerability",
  "Denial of Service vulnerability",
]

const vulnerabilityCategories = ["Web Apps", "Network", "Endpoints", "Cloud", "Database", "API", "Mobile"]

function generateVulnerabilityEvent() {
  const severity = severities[Math.floor(Math.random() * severities.length)]
  return {
    type: "vulnerability",
    timestamp: new Date().toISOString(),
    data: {
      cve: vulnerabilityCVEs[Math.floor(Math.random() * vulnerabilityCVEs.length)],
      title: vulnerabilityTitles[Math.floor(Math.random() * vulnerabilityTitles.length)],
      severity: severity.charAt(0).toUpperCase() + severity.slice(1),
      cvss: (Math.random() * 4 + 5).toFixed(1),
      category: vulnerabilityCategories[Math.floor(Math.random() * vulnerabilityCategories.length)],
      status: "Open",
    },
  }
}

export async function GET() {
  const encoder = new TextEncoder()
  let threatInterval: NodeJS.Timeout | null = null
  let metricsInterval: NodeJS.Timeout | null = null
  let firmwareInterval: NodeJS.Timeout | null = null
  let vulnerabilityInterval: NodeJS.Timeout | null = null
  let isClosed = false

  const stream = new ReadableStream({
    start(controller) {
      try {
        // Send initial metrics immediately
        const initialMetrics = generateMetricsUpdate()
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(initialMetrics)}\n\n`))

        threatInterval = setInterval(() => {
          if (isClosed) return
          try {
            const event = generateThreatEvent()
            const data = `data: ${JSON.stringify({ type: "threat", ...event })}\n\n`
            controller.enqueue(encoder.encode(data))
          } catch (error) {
            console.error("[v0] Error sending threat event:", error)
          }
        }, 800)

        metricsInterval = setInterval(() => {
          if (isClosed) return
          try {
            const metrics = generateMetricsUpdate()
            const data = `data: ${JSON.stringify(metrics)}\n\n`
            controller.enqueue(encoder.encode(data))
          } catch (error) {
            console.error("[v0] Error sending metrics:", error)
          }
        }, 2000)

        firmwareInterval = setInterval(() => {
          if (isClosed) return
          try {
            const firmwareEvent = generateFirmwareEvent()
            const data = `data: ${JSON.stringify(firmwareEvent)}\n\n`
            controller.enqueue(encoder.encode(data))
          } catch (error) {
            console.error("[v0] Error sending firmware event:", error)
          }
        }, 5000)

        vulnerabilityInterval = setInterval(() => {
          if (isClosed) return
          try {
            const vulnEvent = generateVulnerabilityEvent()
            const data = `data: ${JSON.stringify(vulnEvent)}\n\n`
            controller.enqueue(encoder.encode(data))
          } catch (error) {
            console.error("[v0] Error sending vulnerability event:", error)
          }
        }, 8000)
      } catch (error) {
        console.error("[v0] Error in SSE stream start:", error)
        controller.error(error)
      }
    },
    cancel() {
      isClosed = true
      if (threatInterval) {
        clearInterval(threatInterval)
        threatInterval = null
      }
      if (metricsInterval) {
        clearInterval(metricsInterval)
        metricsInterval = null
      }
      if (firmwareInterval) {
        clearInterval(firmwareInterval)
        firmwareInterval = null
      }
      if (vulnerabilityInterval) {
        clearInterval(vulnerabilityInterval)
        vulnerabilityInterval = null
      }
      console.log("[v0] SSE connection closed and cleaned up")
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  })
}
