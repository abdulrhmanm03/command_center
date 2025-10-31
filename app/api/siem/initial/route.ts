export const runtime = "nodejs"
export const dynamic = "force-dynamic"

interface SIEMEvent {
  id: string
  time: string
  source_country: string
  source_ip: string
  target_ip: string
  attack_type: string
  ttp: string
  severity: "Critical" | "High" | "Medium" | "Low"
  status: "Active" | "Failed" | "Blocked"
  volume: number
  lat: number
  lng: number
  explanation: string
  cvss: number
}

const COUNTRIES = [
  { name: "UAE", lat: 25.2769, lng: 55.2963, weight: 0.12 },
  { name: "Russia", lat: 61.524, lng: 105.3188, weight: 0.15 },
  { name: "China", lat: 35.8617, lng: 104.1954, weight: 0.14 },
  { name: "North Korea", lat: 40.3399, lng: 127.5101, weight: 0.08 },
  { name: "Iran", lat: 32.4279, lng: 53.688, weight: 0.09 },
  { name: "USA", lat: 37.0902, lng: -95.7129, weight: 0.07 },
  { name: "Ukraine", lat: 48.3794, lng: 31.1656, weight: 0.06 },
  { name: "Israel", lat: 31.0461, lng: 34.8516, weight: 0.05 },
  { name: "Brazil", lat: -14.235, lng: -51.9253, weight: 0.04 },
  { name: "India", lat: 20.5937, lng: 78.9629, weight: 0.04 },
  { name: "Germany", lat: 51.1657, lng: 10.4515, weight: 0.03 },
  { name: "UK", lat: 55.3781, lng: -3.436, weight: 0.03 },
  { name: "Saudi Arabia", lat: 23.8859, lng: 45.0792, weight: 0.03 },
  { name: "Poland", lat: 51.9194, lng: 19.1451, weight: 0.02 },
  { name: "Nigeria", lat: 9.082, lng: 8.6753, weight: 0.02 },
  { name: "Turkey", lat: 38.9637, lng: 35.2433, weight: 0.02 },
  { name: "Vietnam", lat: 14.0583, lng: 108.2772, weight: 0.01 },
]

const ATTACK_TYPES = [
  {
    type: "Ransomware C2",
    ttp: "T1486",
    cvss: 9.1,
    explanation: "Command & Control beacon for ransomware data exfiltration (Splunk 2025)",
  },
  {
    type: "DDoS Amplification",
    ttp: "T1498",
    cvss: 7.5,
    explanation: "Distributed denial-of-service using DNS/NTP reflection (Cloudflare 2025)",
  },
  {
    type: "SQL Injection",
    ttp: "T1190",
    cvss: 8.6,
    explanation: "Database exploitation via malformed queries (OWASP Top 10)",
  },
  {
    type: "Brute Force SSH",
    ttp: "T1110",
    cvss: 6.8,
    explanation: "Automated credential stuffing on SSH port 22 (CrowdStrike)",
  },
  {
    type: "Phishing Campaign",
    ttp: "T1566",
    cvss: 7.2,
    explanation: "Spear-phishing with malicious attachments (Proofpoint 2025)",
  },
  {
    type: "Cryptojacking",
    ttp: "T1496",
    cvss: 5.3,
    explanation: "Unauthorized cryptocurrency mining via browser exploit (Talos)",
  },
  {
    type: "Zero-Day Exploit",
    ttp: "T1203",
    cvss: 9.8,
    explanation: "CVE-2025-XXXX exploitation in the wild (IBM X-Force)",
  },
  {
    type: "Lateral Movement",
    ttp: "T1021",
    cvss: 8.1,
    explanation: "Internal network traversal via SMB/RDP (MITRE ATT&CK)",
  },
  {
    type: "Data Exfiltration",
    ttp: "T1041",
    cvss: 8.9,
    explanation: "Sensitive data transfer to external C2 server (Mandiant)",
  },
  {
    type: "Supply Chain Attack",
    ttp: "T1195",
    cvss: 9.3,
    explanation: "Compromised third-party software update (SolarWinds-style)",
  },
]

function generateSIEMEvent(timestamp: number): SIEMEvent {
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)]
  const attack = ATTACK_TYPES[Math.floor(Math.random() * ATTACK_TYPES.length)]
  const severities: Array<"Critical" | "High" | "Medium" | "Low"> = ["Critical", "High", "Medium", "Low"]
  const statuses: Array<"Active" | "Failed" | "Blocked"> = ["Active", "Failed", "Blocked"]

  const severity = severities[Math.floor(Math.random() * severities.length)]
  const status = statuses[Math.floor(Math.random() * statuses.length)]

  return {
    id: `siem-${timestamp}-${Math.random().toString(36).substr(2, 9)}`,
    time: new Date(timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    source_country: country.name,
    source_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    target_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    attack_type: attack.type,
    ttp: attack.ttp,
    severity,
    status,
    volume: Math.floor(Math.random() * 50) + 1,
    lat: country.lat,
    lng: country.lng,
    explanation: attack.explanation,
    cvss: attack.cvss,
  }
}

export async function GET() {
  // Generate 30 initial events spread over the last 5 minutes
  const now = Date.now()
  const events: SIEMEvent[] = []

  for (let i = 0; i < 30; i++) {
    const timestamp = now - i * 10000 // 10 seconds apart
    events.push(generateSIEMEvent(timestamp))
  }

  return Response.json(events)
}
