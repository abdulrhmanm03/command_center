"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

const initialThreatActors = [
  { name: "APT29 (Cozy Bear)", origin: "Russia", severity: "Critical", campaigns: 8, lastSeen: "2h ago" },
  { name: "Lazarus Group", origin: "North Korea", severity: "Critical", campaigns: 12, lastSeen: "5h ago" },
  { name: "Desert Falcon", origin: "UAE Region", severity: "High", campaigns: 7, lastSeen: "8h ago" },
  { name: "APT28 (Fancy Bear)", origin: "Russia", severity: "High", campaigns: 6, lastSeen: "1d ago" },
  { name: "MuddyWater", origin: "Iran/UAE", severity: "High", campaigns: 5, lastSeen: "1d ago" },
  { name: "Carbanak", origin: "Unknown", severity: "High", campaigns: 4, lastSeen: "2d ago" },
  { name: "APT41", origin: "China", severity: "Critical", campaigns: 9, lastSeen: "3d ago" },
  { name: "Turla", origin: "Russia", severity: "High", campaigns: 7, lastSeen: "4d ago" },
  { name: "APT33", origin: "Iran", severity: "High", campaigns: 5, lastSeen: "5d ago" },
  { name: "FIN7", origin: "Unknown", severity: "Critical", campaigns: 11, lastSeen: "6d ago" },
]

export function ThreatActorsTable() {
  const [threatActors, setThreatActors] = useState(initialThreatActors)

  useEffect(() => {
    const interval = setInterval(() => {
      setThreatActors((prev) =>
        prev.map((actor) => ({
          ...actor,
          campaigns: actor.campaigns + Math.floor(Math.random() * 3) - 1,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="max-h-[400px] overflow-y-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Actor</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Campaigns</TableHead>
            <TableHead>Last Seen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {threatActors.map((actor) => (
            <TableRow key={actor.name}>
              <TableCell className="font-medium">{actor.name}</TableCell>
              <TableCell>{actor.origin}</TableCell>
              <TableCell>
                <Badge variant={actor.severity === "Critical" ? "destructive" : "default"}>{actor.severity}</Badge>
              </TableCell>
              <TableCell>{actor.campaigns}</TableCell>
              <TableCell className="text-sm text-muted-foreground">{actor.lastSeen}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
