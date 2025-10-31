import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

const vulnerabilities = [
  {
    cve: "CVE-2024-1234",
    title: "Remote Code Execution in Apache",
    severity: "Critical",
    cvss: 9.8,
    affected: "Apache 2.4.x",
    status: "Open",
    discovered: "2d ago",
  },
  {
    cve: "CVE-2024-5678",
    title: "SQL Injection in Web Application",
    severity: "High",
    cvss: 8.1,
    affected: "Custom App v3.2",
    status: "In Progress",
    discovered: "5d ago",
  },
  {
    cve: "CVE-2024-9012",
    title: "Cross-Site Scripting Vulnerability",
    severity: "Medium",
    cvss: 6.5,
    affected: "Portal v2.1",
    status: "In Progress",
    discovered: "1w ago",
  },
  {
    cve: "CVE-2024-3456",
    title: "Privilege Escalation in Linux Kernel",
    severity: "Critical",
    cvss: 9.3,
    affected: "Linux 5.15.x",
    status: "Open",
    discovered: "1w ago",
  },
  {
    cve: "CVE-2024-7890",
    title: "Buffer Overflow in Network Service",
    severity: "High",
    cvss: 7.8,
    affected: "Network Daemon v1.4",
    status: "Patched",
    discovered: "2w ago",
  },
  {
    cve: "CVE-2024-2345",
    title: "Authentication Bypass",
    severity: "Critical",
    cvss: 9.1,
    affected: "Auth Service v2.0",
    status: "In Progress",
    discovered: "2w ago",
  },
  {
    cve: "CVE-2024-6789",
    title: "Information Disclosure",
    severity: "Medium",
    cvss: 5.3,
    affected: "API Gateway v1.8",
    status: "Open",
    discovered: "3w ago",
  },
  {
    cve: "CVE-2024-4567",
    title: "Denial of Service Vulnerability",
    severity: "High",
    cvss: 7.5,
    affected: "Load Balancer v3.1",
    status: "Patched",
    discovered: "3w ago",
  },
]

export function VulnerabilitiesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>CVE ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>CVSS</TableHead>
          <TableHead>Affected System</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Discovered</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {vulnerabilities.map((vuln) => (
          <TableRow key={vuln.cve}>
            <TableCell className="font-mono text-xs">{vuln.cve}</TableCell>
            <TableCell className="font-medium">{vuln.title}</TableCell>
            <TableCell>
              <Badge
                variant={
                  vuln.severity === "Critical" ? "destructive" : vuln.severity === "High" ? "default" : "secondary"
                }
              >
                {vuln.severity}
              </Badge>
            </TableCell>
            <TableCell>
              <span
                className={`font-semibold ${vuln.cvss >= 9 ? "text-destructive" : vuln.cvss >= 7 ? "text-warning" : ""}`}
              >
                {vuln.cvss}
              </span>
            </TableCell>
            <TableCell className="text-sm">{vuln.affected}</TableCell>
            <TableCell>
              <Badge
                variant={vuln.status === "Open" ? "destructive" : vuln.status === "Patched" ? "outline" : "secondary"}
              >
                {vuln.status}
              </Badge>
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">{vuln.discovered}</TableCell>
            <TableCell>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-3 w-3" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
