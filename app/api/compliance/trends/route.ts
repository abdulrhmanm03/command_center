import { NextResponse } from "next/server"

export async function GET() {
  const trends = []
  const days = 30

  for (let i = days; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    trends.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      iso27001: 85 + Math.floor(Math.random() * 8),
      nist: 90 + Math.floor(Math.random() * 6),
      pci: 93 + Math.floor(Math.random() * 5),
      gdpr: 87 + Math.floor(Math.random() * 7),
    })
  }

  return NextResponse.json(trends)
}
