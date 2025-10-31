"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface ComplianceCheck {
  name: string
  status: "pass" | "warning" | "fail"
  score: number
  description: string
}

export function ComplianceStatusWidget() {
  const [checks, setChecks] = useState<ComplianceCheck[]>([
    { name: "GDPR", status: "pass", score: 98, description: "Data privacy compliance" },
    { name: "SOC 2", status: "pass", score: 95, description: "Security controls" },
    { name: "HIPAA", status: "warning", score: 87, description: "Healthcare data protection" },
    { name: "PCI DSS", status: "pass", score: 92, description: "Payment card security" },
    { name: "ISO 27001", status: "warning", score: 85, description: "Information security" },
  ])

  const [overallScore, setOverallScore] = useState(91.4)

  useEffect(() => {
    const interval = setInterval(() => {
      setChecks((prev) =>
        prev.map((check) => {
          const newScore = Math.max(70, Math.min(100, check.score + (Math.random() - 0.5) * 3))
          return {
            ...check,
            score: newScore,
            status: newScore >= 90 ? "pass" : newScore >= 80 ? "warning" : "fail",
          }
        }),
      )
      setOverallScore((prev) => Math.max(70, Math.min(100, prev + (Math.random() - 0.5) * 2)))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = (status: ComplianceCheck["status"]) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "fail":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusColor = (status: ComplianceCheck["status"]) => {
    switch (status) {
      case "pass":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "fail":
        return "text-red-400"
    }
  }

  return (
    <Card className="border-none bg-white/5 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Shield className="h-5 w-5 text-green-400" />
          Compliance Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Overall Score */}
          <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Overall Compliance</span>
              <span className="text-2xl font-bold text-green-400">{overallScore.toFixed(1)}%</span>
            </div>
            <Progress value={overallScore} className="h-2" />
          </div>

          {/* Individual Checks */}
          <div className="space-y-3">
            {checks.map((check) => (
              <div key={check.name} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <div className="text-sm font-medium text-white">{check.name}</div>
                    <div className="text-xs text-gray-400">{check.description}</div>
                  </div>
                </div>
                <div className={`text-sm font-semibold ${getStatusColor(check.status)}`}>{check.score.toFixed(0)}%</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
