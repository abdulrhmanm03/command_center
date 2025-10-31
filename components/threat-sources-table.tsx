import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const threatSources = [
  { country: "UAE", ip: "5.62.61.x", attacks: 1856, risk: "Critical" }, // Moved to top, increased attacks, upgraded to Critical
  { country: "Russia", ip: "185.220.101.x", attacks: 1247, risk: "Critical" },
  { country: "China", ip: "103.253.145.x", attacks: 892, risk: "High" },
  { country: "North Korea", ip: "175.45.176.x", attacks: 634, risk: "Critical" },
  { country: "Iran", ip: "5.63.151.x", attacks: 421, risk: "High" },
  { country: "Unknown", ip: "TOR Network", attacks: 318, risk: "Medium" },
]

export function ThreatSourcesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Country</TableHead>
          <TableHead>IP Range</TableHead>
          <TableHead>Attacks</TableHead>
          <TableHead>Risk</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {threatSources.map((source, index) => (
          <TableRow key={index} className={source.country === "UAE" ? "bg-yellow-500/10" : ""}>
            <TableCell className="font-medium">
              {source.country}
              {source.country === "UAE" && <span className="ml-2 text-xs text-yellow-500">⭐ PRIORITY</span>}
            </TableCell>
            <TableCell className="font-mono text-xs">{source.ip}</TableCell>
            <TableCell>{source.attacks.toLocaleString()}</TableCell>
            <TableCell>
              <Badge
                variant={source.risk === "Critical" ? "destructive" : source.risk === "High" ? "default" : "secondary"}
              >
                {source.risk}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
