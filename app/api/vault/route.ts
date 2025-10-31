import { NextResponse } from "next/server"

export async function GET() {
  // Mock vault entries (in production, fetch from database)
  const entries = [
    {
      id: "1",
      title: "2025-01-15 Ransomware Incident",
      content:
        "BlackCat ransomware variant detected targeting S3 buckets. Initial access via phishing email to finance department. Lateral movement through compromised admin credentials. Data exfiltration detected before encryption attempt. Incident contained within 2 hours using automated playbook response.",
      category: "incident",
      tags: ["ransomware", "blackcat", "s3", "phishing"],
      created_by: "SOC Team",
      created_at: "2025-01-15T10:30:00Z",
      root_cause: "Phishing email bypassed email security gateway due to zero-day evasion technique",
      ttps: ["T1566.001", "T1071.001", "T1486", "T1567.002"],
      linked_alerts: ["ALT-2025-0145", "ALT-2025-0146"],
      linked_playbooks: ["PB-RANSOMWARE-01"],
    },
    {
      id: "2",
      title: "Brute Force Defense Playbook",
      content:
        "Automated response playbook for brute force attacks. Triggers on 5+ failed login attempts within 5 minutes. Actions: 1) Block source IP at firewall, 2) Alert user, 3) Require MFA reset, 4) Add to threat intel feed. Success rate: 98%.",
      category: "playbook",
      tags: ["brute-force", "automation", "defense"],
      created_by: "Security Engineering",
      created_at: "2025-01-10T14:00:00Z",
      ttps: ["T1110.001", "T1110.003"],
    },
    {
      id: "3",
      title: "Lessons: MFA Bypass Incident",
      content:
        "Attacker bypassed MFA using SIM swap attack. Lesson learned: Implement hardware security keys for privileged accounts. Updated policy to require FIDO2 keys for all admin access. Reduced MFA bypass risk by 95%.",
      category: "lesson",
      tags: ["mfa", "sim-swap", "policy"],
      created_by: "CISO Office",
      created_at: "2025-01-05T09:00:00Z",
      root_cause: "SMS-based MFA vulnerable to SIM swap attacks",
      ttps: ["T1556.006"],
    },
  ]

  return NextResponse.json(entries)
}
