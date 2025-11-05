import { NextResponse } from "next/server"

export async function GET() {
  // Simulate log sources with realistic data
  const logSources = [
    {
      id: "fw-001",
      name: "Palo Alto FW-Primary",
      type: "Firewall",
      status: "Active",
      eventsPerSec: 21, // ~1247 per min / 60
      totalEvents: 8934521,
      lastEventTime: "2s ago",
      dataRate: "3.2 MB/s",
      latency: 45,
      location: "US-East-1",
    },
    {
      id: "ep-001",
      name: "CrowdStrike Endpoints",
      type: "Endpoint",
      status: "Healthy",
      eventsPerSec: 57, // ~3421 per min / 60
      totalEvents: 24567890,
      lastEventTime: "1s ago",
      dataRate: "5.7 MB/s",
      latency: 67,
      location: "Global",
    },
    {
      id: "cloud-001",
      name: "AWS CloudTrail",
      type: "Cloud",
      status: "Active",
      eventsPerSec: 15, // ~892 per min / 60
      totalEvents: 6234567,
      lastEventTime: "3s ago",
      dataRate: "1.8 MB/s",
      latency: 123,
      location: "US-West-2",
    },
    {
      id: "net-001",
      name: "Cisco Switch Core-01",
      type: "Network",
      status: "Healthy",
      eventsPerSec: 9, // ~567 per min / 60
      totalEvents: 4123456,
      lastEventTime: "2s ago",
      dataRate: "1.2 MB/s",
      latency: 34,
      location: "DC-Primary",
    },
    {
      id: "app-001",
      name: "Exchange Server Logs",
      type: "Application",
      status: "Delayed",
      eventsPerSec: 4, // ~234 per min / 60
      totalEvents: 1876543,
      lastEventTime: "45s ago",
      dataRate: "0.4 MB/s",
      latency: 678,
      location: "US-East-1",
    },
    {
      id: "db-001",
      name: "SQL Server Production",
      type: "Database",
      status: "Active",
      eventsPerSec: 7, // ~445 per min / 60
      totalEvents: 3456789,
      lastEventTime: "1s ago",
      dataRate: "0.9 MB/s",
      latency: 56,
      location: "DC-Primary",
    },
    {
      id: "ids-001",
      name: "Snort IDS-01",
      type: "IDS/IPS",
      status: "Healthy",
      eventsPerSec: 31, // ~1876 per min / 60
      totalEvents: 12345678,
      lastEventTime: "1s ago",
      dataRate: "4.3 MB/s",
      latency: 89,
      location: "Perimeter",
    },
    {
      id: "fw-002",
      name: "Fortinet FW-Secondary",
      type: "Firewall",
      status: "Active",
      eventsPerSec: 15, // ~923 per min / 60
      totalEvents: 6789012,
      lastEventTime: "2s ago",
      dataRate: "2.1 MB/s",
      latency: 52,
      location: "US-West-1",
    },
    {
      id: "cloud-002",
      name: "Azure Activity Logs",
      type: "Cloud",
      status: "Healthy",
      eventsPerSec: 11, // ~678 per min / 60
      totalEvents: 4567890,
      lastEventTime: "4s ago",
      dataRate: "1.5 MB/s",
      latency: 145,
      location: "Azure-East",
    },
    {
      id: "app-002",
      name: "Apache Web Servers",
      type: "Application",
      status: "Active",
      eventsPerSec: 21, // ~1234 per min / 60
      totalEvents: 9876543,
      lastEventTime: "1s ago",
      dataRate: "2.8 MB/s",
      latency: 43,
      location: "DMZ",
    },
    {
      id: "ep-002",
      name: "Windows Defender ATP",
      type: "Endpoint",
      status: "Error",
      eventsPerSec: 0, // ~12 per min / 60
      totalEvents: 234567,
      lastEventTime: "5m ago",
      dataRate: "0.02 MB/s",
      latency: 2345,
      location: "Global",
    },
    {
      id: "net-002",
      name: "F5 Load Balancer",
      type: "Network",
      status: "Active",
      eventsPerSec: 6, // ~345 per min / 60
      totalEvents: 2345678,
      lastEventTime: "2s ago",
      dataRate: "0.7 MB/s",
      latency: 67,
      location: "DC-Primary",
    },
  ]

  // Add some randomization to make it feel live
  const updatedSources = logSources.map((source) => ({
    ...source,
    eventsPerSec: Math.max(0, source.eventsPerSec + Math.floor(Math.random() * 4 - 2)),
    totalEvents: source.totalEvents + Math.floor(Math.random() * 1000),
    latency: Math.max(10, source.latency + Math.floor(Math.random() * 20 - 10)),
  }))

  return NextResponse.json(updatedSources)
}
