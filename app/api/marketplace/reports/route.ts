import { NextResponse } from "next/server"

export async function GET() {
  const reports = [
    {
      id: "executive-summary",
      name: "Executive Security Summary",
      description: "High-level overview of security posture, key metrics, and critical incidents for leadership",
      category: "Executive",
      status: "active",
      frequency: "Daily",
      lastGenerated: "6 hours ago",
      format: "PDF",
      icon: "file-text",
      generationCount: 247,
      avgGenerationTime: "2.3s",
    },
    {
      id: "compliance-audit",
      name: "Compliance Audit Report",
      description: "Detailed compliance status across frameworks including SOC 2, ISO 27001, NIST, and GDPR",
      category: "Compliance",
      status: "active",
      frequency: "Weekly",
      lastGenerated: "2 days ago",
      format: "PDF, Excel",
      icon: "clipboard-check",
      generationCount: 52,
      avgGenerationTime: "8.7s",
    },
    {
      id: "threat-intelligence",
      name: "Threat Intelligence Digest",
      description: "Curated threat intelligence including IOCs, threat actors, and emerging attack patterns",
      category: "Threat Intel",
      status: "available",
      frequency: "Daily",
      lastGenerated: "N/A",
      format: "PDF, JSON",
      icon: "shield-alert",
      generationCount: 0,
      avgGenerationTime: "N/A",
    },
    {
      id: "incident-response",
      name: "Incident Response Summary",
      description: "Comprehensive analysis of security incidents, response actions, and lessons learned",
      category: "Incidents",
      status: "active",
      frequency: "Monthly",
      lastGenerated: "1 week ago",
      format: "PDF",
      icon: "alert-triangle",
      generationCount: 12,
      avgGenerationTime: "15.2s",
    },
    {
      id: "vulnerability-assessment",
      name: "Vulnerability Assessment",
      description: "Detailed vulnerability scan results, risk scores, and remediation recommendations",
      category: "Vulnerabilities",
      status: "available",
      frequency: "Weekly",
      lastGenerated: "N/A",
      format: "PDF, CSV",
      icon: "bug",
      generationCount: 0,
      avgGenerationTime: "N/A",
    },
    {
      id: "user-activity",
      name: "User Activity Analytics",
      description: "User behavior analysis, authentication patterns, and anomaly detection insights",
      category: "Analytics",
      status: "active",
      frequency: "Weekly",
      lastGenerated: "3 days ago",
      format: "PDF, Excel",
      icon: "users",
      generationCount: 36,
      avgGenerationTime: "5.4s",
    },
  ]

  return NextResponse.json(reports)
}

export async function POST(request: Request) {
  const { reportId, action } = await request.json()

  return NextResponse.json({
    success: true,
    message: `${action === "activate" ? "Activated" : action === "generate" ? "Generated" : "Deactivated"} report ${reportId}`,
  })
}
