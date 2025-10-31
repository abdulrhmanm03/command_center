import { NextResponse } from "next/server"

export async function GET() {
  const integrations = [
    {
      id: "crowdstrike-edr",
      name: "CrowdStrike Falcon",
      description: "Endpoint detection and response platform integration for real-time threat detection and response",
      category: "EDR",
      status: "connected",
      version: "v2.5.0",
      eventsPerDay: "2.3M",
      lastSync: "2 minutes ago",
      icon: "shield-check",
      health: 98,
      uptime: 99.9,
    },
    {
      id: "microsoft-sentinel",
      name: "Microsoft Sentinel",
      description: "Cloud-native SIEM and SOAR solution for intelligent security analytics and threat response",
      category: "SIEM",
      status: "connected",
      version: "v3.1.2",
      eventsPerDay: "5.7M",
      lastSync: "1 minute ago",
      icon: "cloud-cog",
      health: 99,
      uptime: 99.95,
    },
    {
      id: "palo-alto-firewall",
      name: "Palo Alto Networks",
      description: "Next-generation firewall integration for network security and threat prevention",
      category: "Firewall",
      status: "available",
      version: "v10.2.0",
      eventsPerDay: "N/A",
      lastSync: "N/A",
      icon: "shield",
      health: 0,
      uptime: 0,
    },
    {
      id: "splunk-enterprise",
      name: "Splunk Enterprise",
      description: "Data platform for searching, monitoring, and analyzing machine-generated data",
      category: "SIEM",
      status: "available",
      version: "v9.1.0",
      eventsPerDay: "N/A",
      lastSync: "N/A",
      icon: "database",
      health: 0,
      uptime: 0,
    },
    {
      id: "okta-identity",
      name: "Okta Identity Cloud",
      description: "Identity and access management platform for secure authentication and authorization",
      category: "IAM",
      status: "connected",
      version: "v2023.10",
      eventsPerDay: "234K",
      lastSync: "5 minutes ago",
      icon: "key",
      health: 97,
      uptime: 99.8,
    },
    {
      id: "aws-security-hub",
      name: "AWS Security Hub",
      description: "Centralized security and compliance center for AWS accounts",
      category: "Cloud Security",
      status: "available",
      version: "v1.0",
      eventsPerDay: "N/A",
      lastSync: "N/A",
      icon: "cloud",
      health: 0,
      uptime: 0,
    },
  ]

  return NextResponse.json(integrations)
}

export async function POST(request: Request) {
  const { integrationId, action } = await request.json()

  return NextResponse.json({
    success: true,
    message: `${action === "connect" ? "Connected" : "Disconnected"} integration ${integrationId}`,
  })
}
