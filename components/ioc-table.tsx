import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface IOCTableProps {
  filter: "all" | "ip" | "domain" | "hash"
}

const iocs = [
  {
    type: "IP Address",
    value: "185.220.101.34",
    threat: "APT29",
    confidence: "High",
    firstSeen: "2h ago",
    matches: 12,
  },
  {
    type: "Domain",
    value: "malicious-site.com",
    threat: "Phishing Campaign",
    confidence: "Critical",
    firstSeen: "5h ago",
    matches: 45,
  },
  {
    type: "File Hash",
    value: "a3f5d8e9c2b1...",
    threat: "Ransomware",
    confidence: "Critical",
    firstSeen: "8h ago",
    matches: 8,
  },
  {
    type: "IP Address",
    value: "203.0.113.45",
    threat: "Lazarus Group",
    confidence: "High",
    firstSeen: "12h ago",
    matches: 23,
  },
  {
    type: "Domain",
    value: "fake-login.net",
    threat: "Credential Theft",
    confidence: "Medium",
    firstSeen: "1d ago",
    matches: 34,
  },
  {
    type: "File Hash",
    value: "b7c4e1f3a9d2...",
    threat: "Malware",
    confidence: "High",
    firstSeen: "1d ago",
    matches: 15,
  },
  {
    type: "IP Address",
    value: "198.51.100.23",
    threat: "Port Scanner",
    confidence: "Medium",
    firstSeen: "2d ago",
    matches: 67,
  },
  {
    type: "Domain",
    value: "c2-server.xyz",
    threat: "C2 Infrastructure",
    confidence: "Critical",
    firstSeen: "2d ago",
    matches: 89,
  },
]

export function IOCTable({ filter }: IOCTableProps) {
  const filteredIOCs = iocs.filter((ioc) => {
    if (filter === "all") return true
    if (filter === "ip") return ioc.type === "IP Address"
    if (filter === "domain") return ioc.type === "Domain"
    if (filter === "hash") return ioc.type === "File Hash"
    return true
  })

  return (
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
  )
}
