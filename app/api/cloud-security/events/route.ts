import { NextResponse } from "next/server"

const providers = ["AWS", "Azure", "GCP"] as const
const severities = ["critical", "high", "medium", "low"] as const
const statuses = ["open", "investigating", "resolved"] as const

const awsServices = ["EC2", "S3", "RDS", "Lambda", "IAM", "CloudTrail", "GuardDuty", "SecurityHub"]
const azureServices = ["VM", "Storage", "SQL", "Functions", "AD", "Monitor", "Sentinel", "Defender"]
const gcpServices = ["Compute", "Storage", "CloudSQL", "Functions", "IAM", "Logging", "SCC", "Chronicle"]

const categories = [
  "Unauthorized Access",
  "Configuration Change",
  "Data Exfiltration",
  "Privilege Escalation",
  "Malware Detection",
  "Policy Violation",
  "Compliance Issue",
  "Network Anomaly",
]

const regions = {
  AWS: ["us-east-1", "us-west-2", "eu-west-1", "ap-southeast-1"],
  Azure: ["eastus", "westus2", "westeurope", "southeastasia"],
  GCP: ["us-central1", "us-west1", "europe-west1", "asia-southeast1"],
}

function generateEvent(id: number) {
  const provider = providers[Math.floor(Math.random() * providers.length)]
  const severity = severities[Math.floor(Math.random() * severities.length)]
  const status = statuses[Math.floor(Math.random() * statuses.length)]
  const category = categories[Math.floor(Math.random() * categories.length)]

  let service: string
  if (provider === "AWS") {
    service = awsServices[Math.floor(Math.random() * awsServices.length)]
  } else if (provider === "Azure") {
    service = azureServices[Math.floor(Math.random() * azureServices.length)]
  } else {
    service = gcpServices[Math.floor(Math.random() * gcpServices.length)]
  }

  const region = regions[provider][Math.floor(Math.random() * regions[provider].length)]

  const now = new Date()
  const timestamp = new Date(now.getTime() - Math.random() * 60 * 60 * 1000) // Last hour

  return {
    id: `evt-${Date.now()}-${id}-${Math.random().toString(36).substr(2, 9)}`, // Unique ID with timestamp
    provider,
    timestamp: timestamp.toLocaleTimeString(), // Show time only for real-time feel
    severity,
    category,
    service,
    resource: `${service.toLowerCase()}-resource-${Math.floor(Math.random() * 1000)}`,
    description: `${category} detected in ${service}`,
    status,
    region,
  }
}

export async function GET() {
  const events = Array.from({ length: 100 }, (_, i) => generateEvent(i))
  return NextResponse.json(events)
}
