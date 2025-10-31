import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Generate live updating data
  const liveData = {
    isActive: Math.random() > 0.3, // 70% chance of being active
    eventsDetected: Math.floor(Math.random() * 50) + 100,
    failedAttempts: Math.floor(Math.random() * 30) + 70,
    sourceIPs: Math.floor(Math.random() * 5) + 10,
    duration: `${Math.floor(Math.random() * 2) + 1}h ${Math.floor(Math.random() * 60)}m`,
    lastUpdated: "Just now",

    activityTrend: Array.from({ length: 7 }, (_, i) => ({
      time: `${12 + Math.floor(i / 4)}:${(i % 4) * 15}`,
      events: Math.floor(Math.random() * 40) + 10,
    })),
  }

  return NextResponse.json(liveData)
}
