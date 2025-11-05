import { NextResponse } from "next/server"

export async function GET() {
  const metrics = {
    activeSessions: Math.floor(Math.random() * 5000 + 15000), // 15k-20k sessions
    avgDuration: Math.floor(Math.random() * 30 + 45), // 45-75 seconds
    lateralMovement: Math.floor(Math.random() * 8 + 2), // 2-10 events
    bytesTransferred: (Math.random() * 2 + 8).toFixed(1), // 8-10 TB
  }

  return NextResponse.json({ metrics })
}
