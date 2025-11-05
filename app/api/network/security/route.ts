import { NextResponse } from "next/server"

export async function GET() {
  const metrics = {
    blocked: Math.floor(Math.random() * 50 + 120), // 120-170 blocked
    allowed: Math.floor(Math.random() * 200 + 1800), // 1800-2000 allowed
    dnsAnomalies: Math.floor(Math.random() * 15 + 5), // 5-20 anomalies
    encryptedRatio: Math.random() * 15 + 75, // 75-90% encrypted
  }

  const events = Array.from({ length: 15 }, (_, i) => {
    const severities = ["critical", "high", "medium", "low"]
    const protocols = ["HTTPS", "HTTP", "SSH", "RDP", "DNS"]
    const statuses = ["blocked", "allowed"]

    const status = Math.random() > 0.85 ? "blocked" : "allowed"
    const severity =
      status === "blocked"
        ? severities[Math.floor(Math.random() * 2)] // critical or high
        : severities[Math.floor(Math.random() * 2) + 2] // medium or low

    return {
      time: new Date(Date.now() - i * 2 * 60 * 1000).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      sourceIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      destIp: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      protocol: protocols[Math.floor(Math.random() * protocols.length)],
      port: Math.floor(Math.random() * 60000 + 1024),
      bytes: `${(Math.random() * 10 + 1).toFixed(1)} MB`,
      status,
      severity,
    }
  })

  return NextResponse.json({ metrics, events })
}
