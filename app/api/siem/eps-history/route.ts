import { NextResponse } from "next/server"

export async function GET() {
  // Generate 7 days of hourly EPS data (168 data points)
  const now = new Date()
  const history = []

  for (let i = 167; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000) // Hourly intervals
    const baseEPS = 8500
    const variation = Math.sin(i / 24) * 1500 // Daily pattern
    const randomNoise = (Math.random() - 0.5) * 500
    const eps = Math.round(baseEPS + variation + randomNoise)

    history.push({
      timestamp: timestamp.toISOString(),
      eps: Math.max(0, eps),
    })
  }

  return NextResponse.json(history)
}
