"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { useEffect, useState } from "react"

interface IOCTableProps {
  filter: "all" | "ip" | "domain" | "hash" | "url"
}

const generateIOCs = () => [
  {
    type: "IP Address",
    value: "185.220.101.34",
    threat: "APT29",
    confidence: "High",
    firstSeen: "2h ago",
    matches: 12 + Math.floor(Math.random() * 10),
  },
  {
    type: "Domain",
    value: "malicious-site.com",
    threat: "Phishing Campaign",
    confidence: "Critical",
    firstSeen: "5h ago",
    matches: 45 + Math.floor(Math.random() * 20),
  },
  {
    type: "File Hash",
    value: "a3f5d8e9c2b1f4a7...",
    threat: "Ransomware",
    confidence: "Critical",
    firstSeen: "8h ago",
    matches: 8 + Math.floor(Math.random() * 5),
  },
  {
    type: "URL",
    value: "https://evil-site.com/payload.exe",
    threat: "Malware Distribution",
    confidence: "Critical",
    firstSeen: "3h ago",
    matches: 28 + Math.floor(Math.random() * 15),
  },
  {
    type: "IP Address",
    value: "203.0.113.45",
    threat: "Lazarus Group",
    confidence: "High",
    firstSeen: "12h ago",
    matches: 23 + Math.floor(Math.random() * 15),
  },
  {
    type: "Domain",
    value: "fake-login.net",
    threat: "Credential Theft",
    confidence: "Medium",
    firstSeen: "1d ago",
    matches: 34 + Math.floor(Math.random() * 10),
  },
  {
    type: "URL",
    value: "http://phishing-portal.org/login",
    threat: "Credential Harvesting",
    confidence: "High",
    firstSeen: "6h ago",
    matches: 56 + Math.floor(Math.random() * 20),
  },
  {
    type: "File Hash",
    value: "b7c4e1f3a9d2c8f5...",
    threat: "Malware",
    confidence: "High",
    firstSeen: "1d ago",
    matches: 15 + Math.floor(Math.random() * 8),
  },
  {
    type: "IP Address",
    value: "198.51.100.23",
    threat: "Port Scanner",
    confidence: "Medium",
    firstSeen: "2d ago",
    matches: 67 + Math.floor(Math.random() * 25),
  },
  {
    type: "URL",
    value: "https://c2-server.xyz/beacon",
    threat: "C2 Communication",
    confidence: "Critical",
    firstSeen: "4h ago",
    matches: 91 + Math.floor(Math.random() * 30),
  },
  {
    type: "Domain",
    value: "c2-server.xyz",
    threat: "C2 Infrastructure",
    confidence: "Critical",
    firstSeen: "2d ago",
    matches: 89 + Math.floor(Math.random() * 30),
  },
  {
    type: "IP Address",
    value: "192.0.2.156",
    threat: "APT28",
    confidence: "High",
    firstSeen: "3d ago",
    matches: 41 + Math.floor(Math.random() * 15),
  },
  {
    type: "Domain",
    value: "phishing-portal.org",
    threat: "Credential Harvesting",
    confidence: "Critical",
    firstSeen: "3d ago",
    matches: 78 + Math.floor(Math.random() * 20),
  },
  {
    type: "File Hash",
    value: "c9e2f1d4b8a3e7f6...",
    threat: "Trojan",
    confidence: "High",
    firstSeen: "4d ago",
    matches: 19 + Math.floor(Math.random() * 10),
  },
  {
    type: "URL",
    value: "http://malware-drop.net/download",
    threat: "Trojan Downloader",
    confidence: "High",
    firstSeen: "7h ago",
    matches: 37 + Math.floor(Math.random() * 15),
  },
  {
    type: "IP Address",
    value: "172.16.254.89",
    threat: "Brute Force Attack",
    confidence: "Medium",
    firstSeen: "4d ago",
    matches: 52 + Math.floor(Math.random() * 20),
  },
]

export function IOCTable({ filter }: IOCTableProps) {
  const [iocs, setIocs] = useState(generateIOCs())

  useEffect(() => {
    const interval = setInterval(() => {
      setIocs(generateIOCs())
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  const filteredIOCs = iocs.filter((ioc) => {
    if (filter === "all") return true
    if (filter === "ip") return ioc.type === "IP Address"
    if (filter === "domain") return ioc.type === "Domain"
    if (filter === "hash") return ioc.type === "File Hash"
    if (filter === "url") return ioc.type === "URL"
    return true
  })

  return (
    <div className="max-h-[500px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Associated Threat</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead>First Seen</TableHead>
            <TableHead>Matches</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredIOCs.map((ioc, index) => (
            <TableRow key={index}>
              <TableCell>
                <Badge variant="outline">{ioc.type}</Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">{ioc.value}</TableCell>
              <TableCell className="font-medium">{ioc.threat}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    ioc.confidence === "Critical" ? "destructive" : ioc.confidence === "High" ? "default" : "secondary"
                  }
                >
                  {ioc.confidence}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{ioc.firstSeen}</TableCell>
              <TableCell>{ioc.matches}</TableCell>
              <TableCell>
                <Button variant="ghost" size="sm">
                  <Copy className="h-3 w-3" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
