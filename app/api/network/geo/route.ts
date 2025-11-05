import { NextResponse } from "next/server"

export async function GET() {
  const baseCountries = [
    { name: "United States", baseConnections: 1250, risk: "low" },
    { name: "United Kingdom", baseConnections: 890, risk: "low" },
    { name: "Germany", baseConnections: 720, risk: "low" },
    { name: "China", baseConnections: 450, risk: "high" },
    { name: "Russia", baseConnections: 380, risk: "high" },
    { name: "Brazil", baseConnections: 340, risk: "medium" },
    { name: "India", baseConnections: 310, risk: "medium" },
    { name: "Japan", baseConnections: 280, risk: "low" },
    { name: "France", baseConnections: 250, risk: "low" },
  ]

  const countries = baseCountries.map(({ name, baseConnections, risk }) => ({
    name,
    connections: Math.floor(baseConnections + (Math.random() - 0.5) * 100),
    risk,
  }))

  return NextResponse.json({ countries })
}
