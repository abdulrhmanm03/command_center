"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, UserPlus, CheckCircle } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const incidents = [
  {
    id: "INC-284",
    title: "Ransomware Attack on File Server",
    severity: "Critical",
    status: "Investigating",
    assignee: { name: "John Smith", initials: "JS" },
    created: "2h ago",
    updated: "15m ago",
  },
  {
    id: "INC-283",
    title: "Data Breach Attempt",
    severity: "Critical",
    status: "Investigating",
    assignee: { name: "Maria Johnson", initials: "MJ" },
    created: "4h ago",
    updated: "1h ago",
  },
  {
    id: "INC-282",
    title: "Phishing Campaign Detected",
    severity: "High",
    status: "Contained",
    assignee: { name: "Kevin Lee", initials: "KL" },
    created: "6h ago",
    updated: "2h ago",
  },
  {
    id: "INC-281",
    title: "Unauthorized Access to Database",
    severity: "Critical",
    status: "Open",
    assignee: null,
    created: "8h ago",
    updated: "8h ago",
  },
  {
    id: "INC-280",
    title: "DDoS Attack on Web Server",
    severity: "High",
    status: "Mitigated",
    assignee: { name: "Sarah Chen", initials: "SC" },
    created: "12h ago",
    updated: "3h ago",
  },
  {
    id: "INC-279",
    title: "Malware Infection Spread",
    severity: "High",
    status: "Investigating",
    assignee: { name: "John Smith", initials: "JS" },
    created: "1d ago",
    updated: "5h ago",
  },
  {
    id: "INC-278",
    title: "Insider Threat Activity",
    severity: "Medium",
    status: "Open",
    assignee: null,
    created: "1d ago",
    updated: "1d ago",
  },
  {
    id: "INC-277",
    title: "Zero-Day Exploit Detected",
    severity: "Critical",
    status: "Resolved",
    assignee: { name: "Maria Johnson", initials: "MJ" },
    created: "2d ago",
    updated: "1d ago",
  },
]

export function IncidentsManagementTable() {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Incident ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead>Actions</TableHead>
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
                <Badge
                  variant={
                    incident.status === "Open"
                      ? "destructive"
                      : incident.status === "Resolved"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {incident.status}
                </Badge>
              </TableCell>
              <TableCell>
                {incident.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{incident.assignee.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{incident.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Unassigned</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">{incident.created}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{incident.updated}</TableCell>
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
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign to Me
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Resolved
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
