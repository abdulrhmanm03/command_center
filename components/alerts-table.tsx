"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle, XCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const alerts = [
  {
    id: "ALT-2847",
    title: "Malware Signature Detected",
    severity: "Critical",
    category: "Malware",
    source: "192.168.1.45",
    status: "New",
    time: "2m ago",
  },
  {
    id: "ALT-2846",
    title: "Brute Force Login Attempt",
    severity: "High",
    category: "Intrusion",
    source: "185.220.101.34",
    status: "In Progress",
    time: "8m ago",
  },
  {
    id: "ALT-2845",
    title: "Unusual Network Traffic",
    severity: "Medium",
    category: "Anomaly",
    source: "10.0.0.23",
    status: "In Progress",
    time: "15m ago",
  },
  {
    id: "ALT-2844",
    title: "Unauthorized File Access",
    severity: "High",
    category: "Policy Violation",
    source: "172.16.0.89",
    status: "New",
    time: "22m ago",
  },
  {
    id: "ALT-2843",
    title: "Port Scan Detected",
    severity: "Medium",
    category: "Intrusion",
    source: "203.0.113.45",
    status: "In Progress",
    time: "35m ago",
  },
  {
    id: "ALT-2842",
    title: "SQL Injection Attempt",
    severity: "Critical",
    category: "Intrusion",
    source: "198.51.100.23",
    status: "New",
    time: "41m ago",
  },
  {
    id: "ALT-2841",
    title: "Suspicious Process Execution",
    severity: "High",
    category: "Malware",
    source: "192.168.1.67",
    status: "In Progress",
    time: "1h ago",
  },
  {
    id: "ALT-2840",
    title: "Data Exfiltration Attempt",
    severity: "Critical",
    category: "Anomaly",
    source: "10.0.0.45",
    status: "New",
    time: "1h ago",
  },
]

export function AlertsTable() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Alert ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell className="font-mono text-xs">{alert.id}</TableCell>
              <TableCell className="font-medium">{alert.title}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    alert.severity === "Critical" ? "destructive" : alert.severity === "High" ? "default" : "secondary"
                  }
                >
                  {alert.severity}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{alert.category}</TableCell>
              <TableCell className="font-mono text-xs">{alert.source}</TableCell>
              <TableCell>
                <span className={`text-sm ${alert.status === "New" ? "text-destructive" : "text-warning"}`}>
                  {alert.status}
                </span>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{alert.time}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Resolved
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <XCircle className="mr-2 h-4 w-4" />
                      Dismiss
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
