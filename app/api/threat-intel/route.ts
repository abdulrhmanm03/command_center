import { NextResponse } from "next/server"

export async function GET() {
  // Simulate live threat intelligence data
  const data = {
    iocs: Array.from({ length: Math.floor(Math.random() * 100) + 1200 }, (_, i) => ({
      id: i,
      type: ["IP", "Hash", "Domain", "URL"][Math.floor(Math.random() * 4)],
      value: `ioc-${i}`,
    })),
    threatActors: [
      { name: "APT28 (Fancy Bear)", activity: "High", targets: "Government, Military" },
      { name: "Lazarus Group", activity: "Medium", targets: "Financial, Crypto" },
      { name: "APT29 (Cozy Bear)", activity: "High", targets: "Healthcare, Research" },
      { name: "Carbanak", activity: "Low", targets: "Banking, Finance" },
    ],
    emergingThreats: [
      {
        title: "New Ransomware Variant Detected",
        description: "LockBit 4.0 targeting healthcare sector",
        severity: "critical",
      },
      {
        title: "Zero-Day Exploit in Popular VPN",
        description: "CVE-2025-1234 allows remote code execution",
        severity: "critical",
      },
      {
        title: "Phishing Campaign Targeting Finance",
        description: "Sophisticated spear-phishing using AI",
        severity: "high",
      },
    ],
  }

  return NextResponse.json(data)
}
