export async function GET() {
  const scenarios = [
    {
      id: "ransomware",
      name: "Ransomware Attack",
      probability: 78 + Math.floor(Math.random() * 5),
      impact: "High",
      riskScore: 9.2 + Math.random() * 0.3,
      trend: "increasing",
      mitigations: ["Backup verification", "Network segmentation", "EDR deployment"],
      affectedAssets: 245,
      estimatedLoss: "$2.4M",
    },
    {
      id: "insider",
      name: "Insider Threat",
      probability: 45 + Math.floor(Math.random() * 5),
      impact: "High",
      riskScore: 6.8 + Math.random() * 0.3,
      trend: "stable",
      mitigations: ["User monitoring", "Access reviews", "DLP policies"],
      affectedAssets: 156,
      estimatedLoss: "$890K",
    },
    {
      id: "supply-chain",
      name: "Supply Chain Compromise",
      probability: 32 + Math.floor(Math.random() * 5),
      impact: "Medium",
      riskScore: 7.1 + Math.random() * 0.3,
      trend: "decreasing",
      mitigations: ["Vendor assessments", "Code signing", "SBOMs"],
      affectedAssets: 89,
      estimatedLoss: "$1.2M",
    },
    {
      id: "data-exfil",
      name: "Data Exfiltration",
      probability: 56 + Math.floor(Math.random() * 5),
      impact: "High",
      riskScore: 7.5 + Math.random() * 0.3,
      trend: "increasing",
      mitigations: ["Data classification", "Egress monitoring", "Encryption"],
      affectedAssets: 312,
      estimatedLoss: "$1.8M",
    },
  ]

  const assetRisks = [
    { asset: "Domain controllers", score: 85, category: "Critical", vulnerabilities: 12 },
    { asset: "Financial systems", score: 72, category: "High", vulnerabilities: 9 },
    { asset: "User behavior", score: 68, category: "Medium", vulnerabilities: 7 },
    { asset: "Unpatched critical vulnerabilities", score: 91, category: "Critical", vulnerabilities: 23 },
    { asset: "Network exposure", score: 72, category: "High", vulnerabilities: 15 },
  ]

  const trendData = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    ransomware: 75 + Math.random() * 10,
    insider: 40 + Math.random() * 10,
    supplyChain: 30 + Math.random() * 8,
    dataExfil: 50 + Math.random() * 12,
  }))

  return Response.json({
    scenarios,
    assetRisks,
    trendData,
    summary: {
      totalRisk: 82,
      criticalAssets: 85,
      networkExposure: 72,
      userBehavior: 68,
      vulnerabilityExposure: 91,
    },
  })
}
