"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Clock, Download, Play, Pause, Search, Calendar, BarChart3 } from "lucide-react"

interface Report {
  id: string
  name: string
  description: string
  category: string
  status: "active" | "available"
  frequency: string
  lastGenerated: string
  format: string
  icon: string
  generationCount: number
  avgGenerationTime: string
}

export function ReportsTab() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/marketplace/reports")
      const data = await response.json()
      setReports(data)
    } catch (error) {
      console.error("Failed to fetch reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (reportId: string, action: "activate" | "deactivate" | "generate") => {
    try {
      await fetch("/api/marketplace/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, action }),
      })
      fetchReports()
    } catch (error) {
      console.error("Action failed:", error)
    }
  }

  const filteredReports = reports.filter(
    (report) =>
      report.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const activeReports = filteredReports.filter((r) => r.status === "active")
  const availableReports = filteredReports.filter((r) => r.status === "available")

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading reports...</div>
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search reports..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 border-slate-700 bg-[#0f1419]"
        />
      </div>

      {activeReports.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Play className="h-5 w-5 text-green-400" />
            <h2 className="text-xl font-semibold text-white">Active Reports ({activeReports.length})</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {activeReports.map((report) => (
              <ReportCard key={report.id} report={report} onAction={handleAction} />
            ))}
          </div>
        </div>
      )}

      {availableReports.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Pause className="h-5 w-5 text-gray-400" />
            <h2 className="text-xl font-semibold text-white">Available Reports ({availableReports.length})</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {availableReports.map((report) => (
              <ReportCard key={report.id} report={report} onAction={handleAction} />
            ))}
          </div>
        </div>
      )}

      {filteredReports.length === 0 && (
        <div className="py-12 text-center text-gray-400">No reports found matching your search.</div>
      )}
    </div>
  )
}

function ReportCard({
  report,
  onAction,
}: {
  report: Report
  onAction: (reportId: string, action: "activate" | "deactivate" | "generate") => void
}) {
  const isActive = report.status === "active"

  return (
    <Card
      className={`border-slate-700 bg-[#0f1419] transition-all hover:shadow-lg ${
        isActive
          ? "border-purple-500/30 hover:border-purple-500/50 hover:shadow-purple-500/10"
          : "hover:border-cyan-500/50 hover:shadow-cyan-500/10"
      }`}
    >
      <CardContent className="p-5">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                  isActive ? "from-purple-500/20 to-pink-500/20" : "from-cyan-500/20 to-blue-500/20"
                }`}
              >
                <FileText className={`h-6 w-6 ${isActive ? "text-purple-400" : "text-cyan-400"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{report.name}</h3>
                <Badge
                  variant="outline"
                  className={`mt-1 border-slate-600 text-xs ${
                    isActive ? "border-purple-500/50 text-purple-400" : "text-gray-400"
                  }`}
                >
                  {report.category}
                </Badge>
              </div>
            </div>
            <Badge
              className={
                isActive
                  ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  : "bg-gray-500/20 text-gray-400 hover:bg-gray-500/30"
              }
            >
              {isActive ? "Active" : "Available"}
            </Badge>
          </div>

          <p className="text-sm text-gray-400 line-clamp-2">{report.description}</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-2">
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Calendar className="h-3 w-3" />
                <span>Frequency</span>
              </div>
              <span className="text-xs font-semibold text-white">{report.frequency}</span>
            </div>

            {isActive && (
              <>
                <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <BarChart3 className="h-3 w-3" />
                    <span>Generated</span>
                  </div>
                  <span className="text-xs font-semibold text-white">{report.generationCount}x</span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="h-3 w-3" />
                    <span>Avg Time</span>
                  </div>
                  <span className="text-xs font-semibold text-white">{report.avgGenerationTime}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FileText className="h-3 w-3" />
                  <span>Last: {report.lastGenerated}</span>
                </div>
              </>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Download className="h-3 w-3" />
              <span>Format: {report.format}</span>
            </div>
          </div>

          <div className="flex gap-2 border-t border-slate-800 pt-3">
            {isActive ? (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500/10"
                  onClick={() => onAction(report.id, "generate")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Generate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-500/50 bg-transparent text-red-400 hover:bg-red-500/10"
                  onClick={() => onAction(report.id, "deactivate")}
                >
                  <Pause className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                className="flex-1 bg-cyan-500 text-white hover:bg-cyan-600"
                onClick={() => onAction(report.id, "activate")}
              >
                <Play className="mr-2 h-4 w-4" />
                Activate
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
