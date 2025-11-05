import { NextResponse } from "next/server"

export async function GET() {
  const metrics = [
    {
      provider: "AWS",
      totalEvents: Math.floor(Math.random() * 500) + 800,
      criticalEvents: Math.floor(Math.random() * 20) + 5,
      highEvents: Math.floor(Math.random() * 50) + 30,
      mediumEvents: Math.floor(Math.random() * 100) + 80,
      lowEvents: Math.floor(Math.random() * 200) + 150,
      openIssues: Math.floor(Math.random() * 30) + 10,
      resolvedToday: Math.floor(Math.random() * 50) + 20,
      trend: Math.floor(Math.random() * 20) - 5, // Integer trend for cleaner display
      complianceScore: Math.floor(Math.random() * 10) + 88,
      activeResources: Math.floor(Math.random() * 500) + 1200,
    },
    {
      provider: "Azure",
      totalEvents: Math.floor(Math.random() * 400) + 600,
      criticalEvents: Math.floor(Math.random() * 15) + 3,
      highEvents: Math.floor(Math.random() * 40) + 25,
      mediumEvents: Math.floor(Math.random() * 80) + 60,
      lowEvents: Math.floor(Math.random() * 150) + 120,
      openIssues: Math.floor(Math.random() * 25) + 8,
      resolvedToday: Math.floor(Math.random() * 40) + 15,
      trend: Math.floor(Math.random() * 20) - 5, // Integer trend for cleaner display
      complianceScore: Math.floor(Math.random() * 10) + 85,
      activeResources: Math.floor(Math.random() * 400) + 900,
    },
    {
      provider: "GCP",
      totalEvents: Math.floor(Math.random() * 300) + 400,
      criticalEvents: Math.floor(Math.random() * 10) + 2,
      highEvents: Math.floor(Math.random() * 30) + 20,
      mediumEvents: Math.floor(Math.random() * 60) + 40,
      lowEvents: Math.floor(Math.random() * 100) + 80,
      openIssues: Math.floor(Math.random() * 20) + 5,
      resolvedToday: Math.floor(Math.random() * 30) + 10,
      trend: Math.floor(Math.random() * 20) - 5, // Integer trend for cleaner display
      complianceScore: Math.floor(Math.random() * 10) + 90,
      activeResources: Math.floor(Math.random() * 300) + 600,
    },
  ]

  return NextResponse.json(metrics)
}
