import { NextResponse } from "next/server"

export async function GET() {
  // Simulate live threat analysis data
  const data = {
    riskScore: Math.floor(Math.random() * 50) + 200, // 200-250
    topThreats: [
      { name: "Brute Force Attack", severity: "critical", count: Math.floor(Math.random() * 50) + 100 },
      { name: "Ransomware C2 Communication", severity: "critical", count: Math.floor(Math.random() * 30) + 30 },
      { name: "Data Exfiltration Attempt", severity: "high", count: Math.floor(Math.random() * 20) + 20 },
      { name: "Privilege Escalation", severity: "high", count: Math.floor(Math.random() * 20) + 15 },
      { name: "Lateral Movement", severity: "medium", count: Math.floor(Math.random() * 15) + 10 },
    ],
    attackVectors: [
      { vector: "Network", percentage: 45 },
      { vector: "Email/Phishing", percentage: 28 },
      { vector: "Web Application", percentage: 18 },
      { vector: "Endpoint", percentage: 9 },
    ],
  }

  return NextResponse.json(data)
}
