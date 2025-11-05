import { NextResponse } from "next/server"

export async function GET() {
  const severities = ["critical", "high", "medium", "low"] as const
  const statuses = ["open", "in_progress", "resolved"] as const
  const frameworks = ["ISO 27001", "NIST 800-53", "PCI-DSS", "GDPR", "HIPAA", "CIS"]

  const violations = [
    {
      id: "v1",
      control: "A.9.4.2",
      framework: "ISO 27001",
      severity: "critical" as const,
      description: "Privileged access management - CloudTrail disabled on production account",
      affectedResources: 3,
      detectedAt: "5 minutes ago",
      status: "open" as const,
      assignee: "Security Team",
    },
    {
      id: "v2",
      control: "AC-2",
      framework: "NIST 800-53",
      severity: "high" as const,
      description: "Account Management - 12 inactive user accounts detected",
      affectedResources: 12,
      detectedAt: "15 minutes ago",
      status: "in_progress" as const,
      assignee: "IAM Team",
    },
    {
      id: "v3",
      control: "10.2",
      framework: "PCI-DSS",
      severity: "critical" as const,
      description: "Audit logging - Missing audit logs for privileged operations",
      affectedResources: 5,
      detectedAt: "8 minutes ago",
      status: "open" as const,
    },
    {
      id: "v4",
      control: "Art. 32",
      framework: "GDPR",
      severity: "high" as const,
      description: "Security of processing - Unencrypted S3 buckets containing PII",
      affectedResources: 7,
      detectedAt: "22 minutes ago",
      status: "open" as const,
      assignee: "Data Protection",
    },
    {
      id: "v5",
      control: "164.312(a)(1)",
      framework: "HIPAA",
      severity: "medium" as const,
      description: "Access Control - MFA not enforced for all users",
      affectedResources: 18,
      detectedAt: "1 hour ago",
      status: "in_progress" as const,
    },
    {
      id: "v6",
      control: "5.1",
      framework: "CIS",
      severity: "high" as const,
      description: "Identity and Access Management - Root account usage detected",
      affectedResources: 2,
      detectedAt: "12 minutes ago",
      status: "open" as const,
    },
    {
      id: "v7",
      control: "A.12.4.1",
      framework: "ISO 27001",
      severity: "medium" as const,
      description: "Event logging - Incomplete logging configuration on 8 systems",
      affectedResources: 8,
      detectedAt: "35 minutes ago",
      status: "in_progress" as const,
    },
    {
      id: "v8",
      control: "SI-4",
      framework: "NIST 800-53",
      severity: "low" as const,
      description: "System Monitoring - GuardDuty findings not being reviewed",
      affectedResources: 1,
      detectedAt: "2 hours ago",
      status: "resolved" as const,
    },
  ]

  return NextResponse.json(violations)
}
