import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const riskyUsers = [
  { name: "Alex Thompson", email: "a.thompson@company.com", riskScore: 87, anomalies: 12, initials: "AT" },
  { name: "Sarah Martinez", email: "s.martinez@company.com", riskScore: 82, anomalies: 9, initials: "SM" },
  { name: "Michael Chen", email: "m.chen@company.com", riskScore: 76, anomalies: 8, initials: "MC" },
  { name: "Emily Davis", email: "e.davis@company.com", riskScore: 71, anomalies: 7, initials: "ED" },
  { name: "James Wilson", email: "j.wilson@company.com", riskScore: 68, anomalies: 6, initials: "JW" },
]

export function TopRiskyUsersTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Risk Score</TableHead>
          <TableHead>Anomalies</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {riskyUsers.map((user) => (
          <TableRow key={user.email}>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{user.riskScore}</span>
                  <Badge
                    variant={user.riskScore >= 80 ? "destructive" : user.riskScore >= 70 ? "default" : "secondary"}
                  >
                    {user.riskScore >= 80 ? "Critical" : user.riskScore >= 70 ? "High" : "Medium"}
                  </Badge>
                </div>
                <Progress value={user.riskScore} className="h-1" />
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm font-medium">{user.anomalies}</span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
