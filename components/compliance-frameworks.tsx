import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

const frameworks = [
  { name: "SOC 2 Type II", score: 92, status: "Compliant", controls: 64, passed: 59 },
  { name: "ISO 27001", score: 88, status: "Compliant", controls: 114, passed: 100 },
  { name: "GDPR", score: 85, status: "Compliant", controls: 42, passed: 36 },
  { name: "HIPAA", score: 79, status: "Partial", controls: 78, passed: 62 },
  { name: "PCI DSS", score: 91, status: "Compliant", controls: 329, passed: 299 },
  { name: "NIST CSF", score: 83, status: "Compliant", controls: 108, passed: 90 },
]

export function ComplianceFrameworks() {
  return (
    <div className="space-y-6">
      {frameworks.map((framework) => (
        <div key={framework.name} className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">{framework.name}</h3>
                <Badge variant={framework.status === "Compliant" ? "default" : "secondary"}>{framework.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {framework.passed} of {framework.controls} controls passed
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{framework.score}%</p>
            </div>
          </div>
          <Progress value={framework.score} className="h-2" />
        </div>
      ))}
    </div>
  )
}
