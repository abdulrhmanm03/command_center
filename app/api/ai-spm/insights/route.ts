import { NextResponse } from "next/server"

export async function GET() {
  // Mock AI threat insights
  const insights = [
    {
      id: "1",
      message:
        "GPT-4 model exposed to prompt injection via public API. 12 attempts detected in last 2 hours. High confidence attack pattern.",
      confidence: 94,
      recommendation:
        "Implement input validation and sanitization. Enable rate limiting on API endpoints. Consider adding prompt injection detection middleware.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    },
    {
      id: "2",
      message:
        "Training dataset publicly writable. Critical security risk detected. Potential for data poisoning attacks.",
      confidence: 98,
      recommendation:
        "Immediately restrict S3 bucket permissions. Enable versioning and MFA delete. Audit recent changes for tampering.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    },
    {
      id: "3",
      message:
        "Unusual query patterns detected on Customer Support Bot. Possible reconnaissance activity for model extraction.",
      confidence: 76,
      recommendation:
        "Monitor query patterns for model theft attempts. Implement query throttling and anomaly detection. Review API access logs.",
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 mins ago
    },
  ]

  return NextResponse.json({ insights })
}
