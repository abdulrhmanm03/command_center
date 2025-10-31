import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulated certificate data
    const certificates = [
      {
        id: "cert-1",
        domain: "api.vts.com",
        issuer: "Let's Encrypt",
        expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        status: "valid",
        riskScore: 15,
        autoRenew: true,
        algorithm: "RSA 2048",
        san: ["api.vts.com", "www.api.vts.com"],
      },
      {
        id: "cert-2",
        domain: "dashboard.vts.com",
        issuer: "DigiCert",
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        status: "expiring",
        riskScore: 65,
        autoRenew: false,
        algorithm: "RSA 2048",
        san: ["dashboard.vts.com"],
      },
      {
        id: "cert-3",
        domain: "vpn.vts.com",
        issuer: "Let's Encrypt",
        expiryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: "expired",
        riskScore: 95,
        autoRenew: false,
        algorithm: "RSA 2048",
        san: ["vpn.vts.com"],
      },
      {
        id: "cert-4",
        domain: "mail.vts.com",
        issuer: "Sectigo",
        expiryDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(),
        status: "valid",
        riskScore: 10,
        autoRenew: true,
        algorithm: "RSA 4096",
        san: ["mail.vts.com", "smtp.vts.com"],
      },
      {
        id: "cert-5",
        domain: "iot.vts.com",
        issuer: "Let's Encrypt",
        expiryDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        status: "expiring",
        riskScore: 75,
        autoRenew: true,
        algorithm: "RSA 2048",
        san: ["iot.vts.com"],
      },
    ]

    return NextResponse.json({ success: true, data: certificates })
  } catch (error) {
    console.error("Error fetching certificates:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch certificates" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { action, certId } = body

    // Simulate certificate actions
    if (action === "renew") {
      return NextResponse.json({
        success: true,
        message: "Certificate renewal initiated",
        data: { certId, status: "renewing" },
      })
    }

    if (action === "revoke") {
      return NextResponse.json({
        success: true,
        message: "Certificate revoked successfully",
        data: { certId, status: "revoked" },
      })
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error processing certificate action:", error)
    return NextResponse.json({ success: false, error: "Failed to process action" }, { status: 500 })
  }
}
