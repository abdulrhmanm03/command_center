import { NextResponse } from "next/server"

export async function GET() {
  const now = Date.now()
  const baseInbound = 2500 + Math.random() * 1000
  const baseOutbound = 1800 + Math.random() * 800

  const timeline = Array.from({ length: 24 }, (_, i) => {
    const time = new Date(now - (23 - i) * 5 * 60 * 1000)
    const variance = Math.random() * 0.3 + 0.85 // 85-115% variance
    return {
      time: time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      inbound: Math.floor((baseInbound + Math.sin(i / 3) * 500) * variance),
      outbound: Math.floor((baseOutbound + Math.cos(i / 4) * 400) * variance),
    }
  })

  const metrics = {
    inbound: timeline[timeline.length - 1].inbound,
    outbound: timeline[timeline.length - 1].outbound,
  }

  return NextResponse.json({ timeline, metrics })
}
