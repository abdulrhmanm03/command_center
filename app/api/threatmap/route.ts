export const dynamic = "force-dynamic"

export async function GET() {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
      }

      const attackTypes = [
        {
          name: "Ransomware C2",
          ttp: "T1486",
          target: "Financial Sector",
          severity: "critical",
          cvss: 9.8,
          explanation:
            "Data encrypted for impact - Adversaries encrypt data to disrupt availability (CVSS 9.8, IBM X-Force 2025)",
        },
        {
          name: "Brute Force",
          ttp: "T1110",
          target: "Government Portal",
          severity: "high",
          cvss: 7.5,
          explanation:
            "Repeated login attempts to gain unauthorized access using credential guessing (CVSS 7.5, Talos 2025)",
        },
        {
          name: "Phishing Campaign",
          ttp: "T1566",
          target: "Healthcare Org",
          severity: "medium",
          cvss: 6.5,
          explanation: "Spearphishing attachment - Malicious files sent to gain initial access (CVSS 6.5, Cyble 2025)",
        },
        {
          name: "SQL Injection",
          ttp: "T1190",
          target: "E-commerce Site",
          severity: "critical",
          cvss: 9.1,
          explanation:
            "Exploit public-facing application - Database manipulation via SQL injection (CVSS 9.1, OWASP 2025)",
        },
        {
          name: "DDoS Attack",
          ttp: "T1498",
          target: "Cloud Infrastructure",
          severity: "high",
          cvss: 7.8,
          explanation:
            "Network denial of service - Flooding target with traffic to disrupt availability (CVSS 7.8, Cloudflare 2025)",
        },
        {
          name: "Credential Stuffing",
          ttp: "T1078",
          target: "SaaS Platform",
          severity: "medium",
          cvss: 6.8,
          explanation: "Valid accounts - Using stolen credentials from data breaches (CVSS 6.8, DeepStrike 2025)",
        },
        {
          name: "Data Exfiltration",
          ttp: "T1041",
          target: "Database Server",
          severity: "critical",
          cvss: 9.3,
          explanation:
            "Exfiltration over C2 channel - Stealing sensitive data via command and control (CVSS 9.3, CrowdStrike 2025)",
        },
        {
          name: "Recon Scan",
          ttp: "T1595",
          target: "Network Perimeter",
          severity: "low",
          cvss: 4.3,
          explanation: "Active scanning - Probing for vulnerabilities and open ports (CVSS 4.3, Shodan 2025)",
        },
        {
          name: "Malware C2",
          ttp: "T1071",
          target: "Enterprise Network",
          severity: "high",
          cvss: 8.1,
          explanation:
            "Application layer protocol - Malware communicating with command server (CVSS 8.1, Mandiant 2025)",
        },
        {
          name: "Web Exploit",
          ttp: "T1190",
          target: "Web Application",
          severity: "medium",
          cvss: 6.9,
          explanation: "Exploit public-facing application - Leveraging web vulnerabilities (CVSS 6.9, Qualys 2025)",
        },
        {
          name: "Supply Chain Attack",
          ttp: "T1195",
          target: "Software Vendor",
          severity: "critical",
          cvss: 9.6,
          explanation:
            "Compromise software supply chain - Injecting malicious code into trusted software (CVSS 9.6, SolarWinds 2025)",
        },
        {
          name: "Zero-Day Exploit",
          ttp: "T1203",
          target: "Corporate Network",
          severity: "critical",
          cvss: 9.9,
          explanation: "Exploitation for client execution - Using unknown vulnerabilities (CVSS 9.9, ZDI 2025)",
        },
      ]

      const countries = [
        "UAE",
        "Russia",
        "China",
        "North Korea",
        "Iran",
        "USA",
        "Germany",
        "Brazil",
        "India",
        "UK",
        "France",
        "Japan",
        "South Korea",
        "Israel",
        "Turkey",
        "Pakistan",
        "Vietnam",
        "Thailand",
        "Singapore",
        "Australia",
        "Ukraine",
        "Saudi Arabia",
        "Poland",
        "Nigeria",
        "Indonesia",
        "Canada",
        "Mexico",
        "Netherlands",
        "Spain",
        "Italy",
      ]

      const interval = setInterval(() => {
        const attack = attackTypes[Math.floor(Math.random() * attackTypes.length)]
        const sourceCountry = countries[Math.floor(Math.random() * countries.length)]

        const weightedSource =
          Math.random() > 0.7
            ? Math.random() > 0.6
              ? "China"
              : Math.random() > 0.5
                ? "Russia"
                : Math.random() > 0.4
                  ? "Iran"
                  : Math.random() > 0.3
                    ? "North Korea"
                    : "UAE"
            : sourceCountry

        sendEvent({
          type: "attack",
          data: {
            id: Math.random().toString(36).substr(2, 9),
            attacker_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            attacker_country: weightedSource,
            target: attack.target,
            target_ip: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            ttp: attack.ttp,
            attack_type: attack.name,
            severity: attack.severity,
            status: Math.random() > 0.7 ? "blocked" : Math.random() > 0.5 ? "active" : "recon",
            timestamp: new Date().toISOString(),
            volume: Math.floor(Math.random() * 2000) + 100,
            cvss: attack.cvss,
            explanation: attack.explanation,
          },
        })
      }, 4000) // 4 seconds = ~15 threats/min

      const cleanup = () => {
        clearInterval(interval)
        controller.close()
      }

      setTimeout(cleanup, 300000)
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
