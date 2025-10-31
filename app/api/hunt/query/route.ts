import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { query } = await request.json()

    // Simulate hunt results (in production, query SIEM/data lake)
    const mockResults = [
      {
        event_type: "login_failure",
        timestamp: "2025-01-15 14:23:45",
        details: "Failed login attempt from 185.220.101.45 to admin@company.com",
        src_ip: "185.220.101.45",
        severity: "high",
      },
      {
        event_type: "login_failure",
        timestamp: "2025-01-15 14:24:12",
        details: "Failed login attempt from 185.220.101.45 to root@company.com",
        src_ip: "185.220.101.45",
        severity: "high",
      },
      {
        event_type: "login_failure",
        timestamp: "2025-01-15 14:25:03",
        details: "Failed login attempt from 185.220.101.67 to admin@company.com",
        src_ip: "185.220.101.67",
        severity: "high",
      },
    ]

    return NextResponse.json({ results: mockResults, count: mockResults.length })
  } catch (error) {
    return NextResponse.json({ error: "Hunt query failed" }, { status: 500 })
  }
}
