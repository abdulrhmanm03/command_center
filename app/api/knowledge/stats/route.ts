import { NextResponse } from "next/server"

export async function GET() {
  const stats = {
    totalArticles: 127,
    recentUpdates: 8,
    totalViews: 15234,
    avgRating: 4.7,
    categoryBreakdown: [
      { category: "Procedures", count: 45, percentage: 35 },
      { category: "Articles", count: 52, percentage: 41 },
      { category: "Threat Profiles", count: 30, percentage: 24 },
    ],
    recentActivity: [
      {
        id: 1,
        action: "updated",
        article: "Incident Response Procedures for Ransomware",
        user: "Security Team",
        timestamp: "2 hours ago",
      },
      {
        id: 2,
        action: "created",
        article: "Cloud Security Posture Management",
        user: "Cloud Security Team",
        timestamp: "5 hours ago",
      },
      {
        id: 3,
        action: "updated",
        article: "APT Group Tactics and Techniques",
        user: "Threat Research Team",
        timestamp: "1 day ago",
      },
    ],
    popularTags: [
      { tag: "incident-response", count: 23 },
      { tag: "threat-intel", count: 18 },
      { tag: "cloud", count: 15 },
      { tag: "vulnerability", count: 14 },
      { tag: "mitre-attack", count: 12 },
    ],
  }

  return NextResponse.json(stats)
}
