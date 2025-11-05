import { NextResponse } from "next/server"

export async function GET() {
  const baseValues = {
    HTTPS: 45230,
    HTTP: 32150,
    DNS: 28940,
    SSH: 15670,
    TCP: 12340,
    UDP: 9850,
  }

  const protocols = Object.entries(baseValues).map(([name, baseCount]) => ({
    name,
    count: Math.floor(baseCount + (Math.random() - 0.5) * 2000),
    color: {
      HTTPS: "#10b981",
      HTTP: "#06b6d4",
      DNS: "#8b5cf6",
      SSH: "#f59e0b",
      TCP: "#3b82f6",
      UDP: "#ec4899",
    }[name],
  }))

  return NextResponse.json({ protocols })
}
