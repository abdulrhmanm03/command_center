import { NextResponse } from "next/server"

export async function GET() {
  const predictions = [
    {
      id: 1,
      threat: "Ransomware Attack",
      probability: 87,
      timeframe: "Next 7 days",
      daysUntil: 7,
      confidence: 95,
      trend: "increasing",
      indicators: ["Increased phishing attempts", "Dark web chatter", "Similar attacks in sector"],
      mitigation: "Enhance backup procedures, user awareness training",
      impactScore: 9.2,
      historicalOccurrences: 23,
    },
    {
      id: 2,
      threat: "DDoS Attack",
      probability: 72,
      timeframe: "Next 14 days",
      daysUntil: 14,
      confidence: 78,
      trend: "stable",
      indicators: ["Botnet activity detected", "Reconnaissance scans", "Historical patterns"],
      mitigation: "Scale CDN capacity, implement rate limiting",
      impactScore: 7.5,
      historicalOccurrences: 45,
    },
    {
      id: 3,
      threat: "Insider Threat",
      probability: 45,
      timeframe: "Next 30 days",
      daysUntil: 30,
      confidence: 65,
      trend: "decreasing",
      indicators: ["Unusual data access patterns", "After-hours activity", "Privilege escalation attempts"],
      mitigation: "Enhanced monitoring, access reviews, DLP policies",
      impactScore: 8.1,
      historicalOccurrences: 12,
    },
    {
      id: 4,
      threat: "Supply Chain Attack",
      probability: 38,
      timeframe: "Next 60 days",
      daysUntil: 60,
      confidence: 52,
      trend: "increasing",
      indicators: ["Third-party vulnerabilities", "Industry trends", "Vendor risk scores"],
      mitigation: "Vendor security assessments, code signing verification",
      impactScore: 8.8,
      historicalOccurrences: 8,
    },
  ]

  const trendData = [
    {
      category: "Phishing Attempts",
      trend: "up",
      change: 23,
      severity: "high",
      count: 1247,
      historical: [820, 890, 945, 1050, 1120, 1180, 1247],
    },
    {
      category: "Malware Detections",
      trend: "up",
      change: 15,
      severity: "medium",
      count: 856,
      historical: [745, 760, 780, 795, 810, 835, 856],
    },
    {
      category: "Failed Login Attempts",
      trend: "down",
      change: -8,
      severity: "low",
      count: 2341,
      historical: [2545, 2510, 2480, 2450, 2410, 2370, 2341],
    },
    {
      category: "Data Exfiltration Attempts",
      trend: "up",
      change: 31,
      severity: "critical",
      count: 89,
      historical: [68, 72, 75, 78, 82, 85, 89],
    },
  ]

  return NextResponse.json({ predictions, trendData })
}
