import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { name, query } = await request.json()

    // In production, save to database
    console.log("[v0] Saving hunt:", { name, query })

    return NextResponse.json({ success: true, id: Math.random().toString(36).substr(2, 9) })
  } catch (error) {
    return NextResponse.json({ error: "Failed to save hunt" }, { status: 500 })
  }
}
