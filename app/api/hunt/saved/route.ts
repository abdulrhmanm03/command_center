import { NextResponse } from "next/server"

export async function GET() {
  // Mock saved hunts (in production, fetch from database)
  const savedHunts = [
    {
      id: "1",
      name: "Daily Brute Force Scan",
      query: "src_ip:185.* AND event_type:login_failure",
      last_run: "2025-01-15 08:00:00",
      results_count: 127,
      status: "active",
      schedule: "daily",
    },
    {
      id: "2",
      name: "Suspicious Data Exfiltration",
      query: "event_type:file_transfer AND size:>100MB",
      last_run: "2025-01-14 22:00:00",
      results_count: 3,
      status: "active",
      schedule: "hourly",
    },
  ]

  return NextResponse.json(savedHunts)
}
