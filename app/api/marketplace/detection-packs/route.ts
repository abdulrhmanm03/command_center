import { NextResponse } from "next/server"

export async function GET() {
  const detectionPacks = [
    {
      id: "ransomware-detection",
      name: "Ransomware Detection Pack",
      description:
        "Comprehensive detection rules for ransomware activities including encryption patterns, file modifications, and C2 communications",
      category: "Ransomware",
      status: "installed",
      rules: 45,
      mitreTechniques: 23,
      version: "v2.41",
      updatedAt: "2 days ago",
      icon: "shield",
      rating: 4.8,
      downloads: 12500,
      popularity: 95,
    },
    {
      id: "apt-threat-intel",
      name: "APT Threat Intelligence",
      description:
        "Advanced persistent threat detection based on latest threat intelligence feeds and IOCs from major APT groups",
      category: "APT Detection",
      status: "installed",
      rules: 128,
      mitreTechniques: 67,
      version: "v3.1.0",
      updatedAt: "1 week ago",
      icon: "target",
      rating: 4.9,
      downloads: 18200,
      popularity: 92,
    },
    {
      id: "cloud-security",
      name: "Cloud Security Monitoring",
      description:
        "Detection rules for AWS, Azure, and GCP environments covering misconfigurations, unauthorized access, and data exposure",
      category: "Cloud Security",
      status: "available",
      rules: 89,
      mitreTechniques: 34,
      version: "v1.8.2",
      updatedAt: "3 days ago",
      icon: "cloud",
      rating: 4.6,
      downloads: 9800,
      popularity: 88,
    },
    {
      id: "insider-threat",
      name: "Insider Threat Detection",
      description:
        "Behavioral analytics and anomaly detection for identifying potential insider threats and data exfiltration attempts",
      category: "Insider Threat",
      status: "available",
      rules: 56,
      mitreTechniques: 28,
      version: "v2.0.5",
      updatedAt: "5 days ago",
      icon: "user-x",
      rating: 4.5,
      downloads: 7300,
      popularity: 78,
    },
    {
      id: "phishing-detection",
      name: "Phishing & Social Engineering",
      description:
        "Email security rules detecting phishing attempts, credential harvesting, and social engineering campaigns",
      category: "Malware",
      status: "available",
      rules: 72,
      mitreTechniques: 19,
      version: "v1.9.3",
      updatedAt: "1 week ago",
      icon: "mail",
      rating: 4.7,
      downloads: 11400,
      popularity: 85,
    },
    {
      id: "network-intrusion",
      name: "Network Intrusion Detection",
      description:
        "Comprehensive network-based detection for scanning, exploitation attempts, lateral movement, and command & control",
      category: "Network Security",
      status: "installed",
      rules: 156,
      mitreTechniques: 45,
      version: "v4.2.1",
      updatedAt: "4 days ago",
      icon: "network",
      rating: 4.9,
      downloads: 15600,
      popularity: 91,
    },
  ]

  return NextResponse.json(detectionPacks)
}

export async function POST(request: Request) {
  const { packId, action } = await request.json()

  // Simulate install/update action
  return NextResponse.json({
    success: true,
    message: `${action === "install" ? "Installed" : "Updated"} pack ${packId}`,
  })
}
