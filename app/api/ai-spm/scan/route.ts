import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { assetId } = await request.json()

  // Mock scan trigger
  console.log(`[AI-SPM] Scanning asset: ${assetId}`)

  // Simulate scan delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return NextResponse.json({
    success: true,
    message: `Scan initiated for asset ${assetId}`,
    scanId: `scan-${Date.now()}`,
  })
}
