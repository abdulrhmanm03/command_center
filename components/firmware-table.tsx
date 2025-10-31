"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Calendar, Play } from "lucide-react"
import { UpdateModal } from "./update-modal"
import { ProgressLog } from "./progress-log"

interface FirmwareUpdate {
  id: string
  assetId: string
  deviceName: string
  vendor: string
  currentVersion: string
  latestVersion: string
  status: string
  riskScore: number
  cveIds: string[]
  scheduledAt: string | null
  appliedAt: string | null
  downtimeEstimate: string
  releaseNotes: string
}

interface FirmwareTableProps {
  data: FirmwareUpdate[]
  onSchedule: (id: string, date: Date) => void
  onApply: (id: string) => void
}

export function FirmwareTable({ data, onSchedule, onApply }: FirmwareTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false)
  const [applyModalOpen, setApplyModalOpen] = useState(false)
  const [selectedFirmware, setSelectedFirmware] = useState<FirmwareUpdate | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "bg-green-500 text-white hover:bg-green-600"
      case "outdated":
        return "bg-orange-500 text-white hover:bg-orange-600"
      case "critical":
        return "bg-red-500 text-white hover:bg-red-600"
      case "scheduled":
        return "bg-blue-500 text-white hover:bg-blue-600"
      default:
        return "bg-gray-500 text-white hover:bg-gray-600"
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-500"
    if (score >= 60) return "text-orange-500"
    if (score >= 40) return "text-yellow-500"
    return "text-green-500"
  }

  const getTimeUntilUpdate = (scheduledAt: string | null) => {
    if (!scheduledAt) return null
    const now = new Date()
    const scheduled = new Date(scheduledAt)
    const diff = scheduled.getTime() - now.getTime()

    if (diff < 0) return "Overdue"

    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700">
              <TableHead className="w-8"></TableHead>
              <TableHead className="text-gray-300">Device / Asset</TableHead>
              <TableHead className="text-gray-300">Vendor</TableHead>
              <TableHead className="text-gray-300">Current Firmware</TableHead>
              <TableHead className="text-gray-300">Latest Available</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-gray-300">Risk</TableHead>
              <TableHead className="text-gray-300">Next Update</TableHead>
              <TableHead className="text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((firmware) => (
              <>
                <TableRow key={firmware.id} className="border-slate-800 hover:bg-slate-900/50">
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedRow(expandedRow === firmware.id ? null : firmware.id)}
                      className="h-6 w-6 p-0"
                    >
                      {expandedRow === firmware.id ? (
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="font-medium text-gray-200">{firmware.deviceName}</TableCell>
                  <TableCell className="text-gray-400">{firmware.vendor}</TableCell>
                  <TableCell className="font-mono text-sm text-gray-300">{firmware.currentVersion}</TableCell>
                  <TableCell className="font-mono text-sm text-cyan-400">{firmware.latestVersion}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(firmware.status)}>{firmware.status.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`font-bold ${getRiskColor(firmware.riskScore)}`}>{firmware.riskScore}</span>
                  </TableCell>
                  <TableCell>
                    {firmware.scheduledAt ? (
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-blue-400">{getTimeUntilUpdate(firmware.scheduledAt)}</span>
                      </div>
                    ) : firmware.appliedAt ? (
                      <span className="text-sm text-green-400">Applied</span>
                    ) : (
                      <span className="text-sm text-gray-500">Not scheduled</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 bg-transparent text-blue-400 hover:bg-blue-500/10"
                        onClick={() => {
                          setSelectedFirmware(firmware)
                          setScheduleModalOpen(true)
                        }}
                      >
                        <Calendar className="mr-1 h-3 w-3" />
                        Schedule
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-slate-600 bg-transparent text-green-400 hover:bg-green-500/10"
                        onClick={() => {
                          setSelectedFirmware(firmware)
                          setApplyModalOpen(true)
                        }}
                        disabled={firmware.status === "up-to-date"}
                      >
                        <Play className="mr-1 h-3 w-3" />
                        Apply Now
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
                {expandedRow === firmware.id && (
                  <TableRow className="border-slate-800 bg-slate-900/30">
                    <TableCell colSpan={9} className="p-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="mb-2 font-semibold text-cyan-400">Release Notes</h4>
                          <p className="text-sm text-gray-300">{firmware.releaseNotes}</p>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <h4 className="mb-1 font-semibold text-cyan-400">Risk Score</h4>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-full rounded-full bg-slate-700">
                                <div
                                  className={`h-2 rounded-full ${firmware.riskScore >= 80 ? "bg-red-500" : firmware.riskScore >= 60 ? "bg-orange-500" : "bg-yellow-500"}`}
                                  style={{ width: `${firmware.riskScore}%` }}
                                />
                              </div>
                              <span className={`font-bold ${getRiskColor(firmware.riskScore)}`}>
                                {firmware.riskScore}
                              </span>
                            </div>
                          </div>
                          <div>
                            <h4 className="mb-1 font-semibold text-cyan-400">Estimated Downtime</h4>
                            <p className="text-sm text-gray-300">{firmware.downtimeEstimate}</p>
                          </div>
                          {firmware.cveIds.length > 0 && (
                            <div>
                              <h4 className="mb-1 font-semibold text-cyan-400">Related CVEs</h4>
                              <div className="flex flex-wrap gap-2">
                                {firmware.cveIds.map((cve) => (
                                  <Badge key={cve} variant="outline" className="border-red-500 text-red-400">
                                    {cve}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedFirmware && (
        <>
          <UpdateModal
            open={scheduleModalOpen}
            onOpenChange={setScheduleModalOpen}
            firmware={selectedFirmware}
            onSchedule={(date) => {
              onSchedule(selectedFirmware.id, date)
              setScheduleModalOpen(false)
            }}
          />
          <ProgressLog
            open={applyModalOpen}
            onOpenChange={setApplyModalOpen}
            firmware={selectedFirmware}
            onComplete={() => {
              onApply(selectedFirmware.id)
              setApplyModalOpen(false)
            }}
          />
        </>
      )}
    </>
  )
}
