import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // Simulate AI response (in production, integrate with OpenAI/Anthropic)
    let response = ""
    let action = null

    const lowerMsg = message.toLowerCase()

    if (lowerMsg.includes("top risk") || lowerMsg.includes("biggest threat")) {
      response =
        "The top risk right now is Ransomware C2 communication targeting your S3 bucket from IP 203.0.113.50. We've detected 12 connection attempts in the last hour. This matches the TTP for BlackCat ransomware (MITRE T1071.001). Would you like me to isolate this threat?"
      action = {
        type: "isolate",
        label: "Auto-Remediate",
        data: { ip: "203.0.113.50", threat: "ransomware_c2" },
      }
    } else if (lowerMsg.includes("block ip")) {
      const ipMatch = message.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)
      const ip = ipMatch ? ipMatch[0] : "unknown"
      response = `I'll block IP ${ip} across all firewalls and update the threat intelligence feed. This will take effect in ~30 seconds.`
      action = {
        type: "block_ip",
        label: "Confirm Block",
        data: { ip },
      }
    } else if (lowerMsg.includes("top") && lowerMsg.includes("alert")) {
      response = `Here are the top 5 alerts:\n\n1. Ransomware C2 (Critical) - 203.0.113.50\n2. Brute Force Login (High) - 185.220.101.45\n3. Data Exfiltration (High) - S3 bucket unusual access\n4. Phishing Email (Medium) - 15 users targeted\n5. Privilege Escalation (Medium) - Admin account anomaly`
    } else if (lowerMsg.includes("predict") || lowerMsg.includes("forecast")) {
      response = `Based on current trends, I predict:\n\n• 42 critical alerts in the next 24 hours (↑18%)\n• Unusual login spike expected Thursday 2AM\n• Potential DDoS attack Friday afternoon\n• Confidence: 94%\n\nShould I prepare auto-response playbooks?`
      action = {
        type: "prepare_playbooks",
        label: "Prepare Playbooks",
        data: { scenario: "ddos_defense" },
      }
    } else {
      response = `I can help you with:\n\n• Threat analysis: "What's the top risk?"\n• Actions: "block ip 1.2.3.4"\n• Insights: "show top 5 alerts"\n• Predictions: "predict next 24h"\n\nWhat would you like to know?`
    }

    return NextResponse.json({ response, action })
  } catch (error) {
    return NextResponse.json({ response: "Error processing request" }, { status: 500 })
  }
}
