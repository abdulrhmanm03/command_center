import { NextResponse } from "next/server"

export async function GET() {
  const evidence = [
    {
      id: "e1",
      control: "A.9.4.2",
      framework: "ISO 27001",
      eventType: "Privileged Access Attempts",
      count: 1247 + Math.floor(Math.random() * 50),
      lastEvent: "2 minutes ago",
      status: "compliant" as const,
    },
    {
      id: "e2",
      control: "AC-2",
      framework: "NIST 800-53",
      eventType: "Account Creation/Deletion",
      count: 342 + Math.floor(Math.random() * 20),
      lastEvent: "5 minutes ago",
      status: "compliant" as const,
    },
    {
      id: "e3",
      control: "10.2",
      framework: "PCI-DSS",
      eventType: "Audit Log Events",
      count: 8934 + Math.floor(Math.random() * 100),
      lastEvent: "1 minute ago",
      status: "warning" as const,
    },
    {
      id: "e4",
      control: "Art. 32",
      framework: "GDPR",
      eventType: "Data Encryption Events",
      count: 2156 + Math.floor(Math.random() * 30),
      lastEvent: "3 minutes ago",
      status: "non_compliant" as const,
    },
    {
      id: "e5",
      control: "164.312(a)(1)",
      framework: "HIPAA",
      eventType: "MFA Authentication",
      count: 4521 + Math.floor(Math.random() * 40),
      lastEvent: "4 minutes ago",
      status: "compliant" as const,
    },
    {
      id: "e6",
      control: "5.1",
      framework: "CIS",
      eventType: "Root Account Usage",
      count: 12 + Math.floor(Math.random() * 5),
      lastEvent: "10 minutes ago",
      status: "warning" as const,
    },
    {
      id: "e7",
      control: "A.12.4.1",
      framework: "ISO 27001",
      eventType: "System Logging Events",
      count: 15678 + Math.floor(Math.random() * 200),
      lastEvent: "1 minute ago",
      status: "compliant" as const,
    },
    {
      id: "e8",
      control: "SI-4",
      framework: "NIST 800-53",
      eventType: "Security Monitoring Alerts",
      count: 892 + Math.floor(Math.random() * 25),
      lastEvent: "6 minutes ago",
      status: "compliant" as const,
    },
  ]

  return NextResponse.json(evidence)
}
