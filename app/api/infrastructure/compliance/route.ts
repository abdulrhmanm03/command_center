import { NextResponse } from "next/server"

export async function GET() {
  try {
    const compliance = {
      totalAssets: 156,
      compliantAssets: 142,
      nonCompliantAssets: 14,
      complianceScore: 91,
      frameworks: [
        {
          name: "NIST CSF",
          score: 94,
          compliant: 145,
          total: 156,
          issues: ["2 assets missing encryption", "3 assets with outdated firmware"],
        },
        {
          name: "HIPAA",
          score: 88,
          compliant: 137,
          total: 156,
          issues: ["5 assets with expired certificates", "4 assets missing audit logs"],
        },
        {
          name: "ISO 27001",
          score: 92,
          compliant: 143,
          total: 156,
          issues: ["3 assets with weak ciphers", "2 assets missing backups"],
        },
      ],
      nonCompliantAssetsList: [
        { id: "asset-1", name: "Legacy Server 01", issues: ["Expired certificate", "Outdated firmware"], risk: 85 },
        { id: "asset-2", name: "IoT Device 12", issues: ["Weak encryption"], risk: 65 },
        { id: "asset-3", name: "Router R5", issues: ["Missing security patch"], risk: 75 },
        { id: "asset-4", name: "Firewall FW2", issues: ["Outdated firmware"], risk: 70 },
        { id: "asset-5", name: "Switch SW8", issues: ["Expired certificate"], risk: 60 },
      ],
    }

    return NextResponse.json({ success: true, data: compliance })
  } catch (error) {
    console.error("Error fetching compliance data:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch compliance data" }, { status: 500 })
  }
}
