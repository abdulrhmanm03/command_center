import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const incidents = [
  {
    id: "#284",
    title: "Suspicious Shellcode Execution",
    severity: "High",
    status: "Open",
    assignee: "J. Smith",
    time: "2m ago",
  },
  {
    id: "#283",
    title: "Brute Force Attack Detected",
    severity: "Critical",
    status: "Investigating",
    assignee: "M. Johnson",
    time: "15m ago",
  },
  {
    id: "#282",
    title: "Unusual Data Transfer",
    severity: "Medium",
    status: "Resolved",
    assignee: "K. Lee",
    time: "1h ago",
  },
  {
    id: "#281",
    title: "Malware Signature Match",
    severity: "Critical",
    status: "Investigating",
    assignee: "J. Smith",
    time: "2h ago",
  },
  {
    id: "#280",
    title: "Unauthorized Access Attempt",
    severity: "High",
    status: "Open",
    assignee: "Unassigned",
    time: "3h ago",
  },
]

export function IncidentsTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Incident</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assignee</TableHead>
          <TableHead>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {incidents.map((incident) => (
          <TableRow key={incident.id}>
            <TableCell className="font-mono text-xs">{incident.id}</TableCell>
            <TableCell className="font-medium">{incident.title}</TableCell>
            <TableCell>
              <Badge
                variant={
                  incident.severity === "Critical"
                    ? "destructive"
                    : incident.severity === "High"
                      ? "default"
                      : "secondary"
                }
              >
                {incident.severity}
              </Badge>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground">{incident.status}</span>
            </TableCell>
            <TableCell className="text-sm">{incident.assignee}</TableCell>
            <TableCell className="text-sm text-muted-foreground">{incident.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
