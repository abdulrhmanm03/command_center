"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Zap } from "lucide-react"

interface CriticalFirmware {
  id: string
  deviceName: string
  currentVersion: string
  latestVersion: string
  cveIds: string[]
  riskScore: number
  threat: string
}

interface CriticalFirmwareAlertsProps {
  criticalUpdates: CriticalFirmware[]
  onPatchNow: (id: string) => void
}

export function CriticalFirmwareAlerts({ criticalUpdates, onPatchNow }: CriticalFirmwareAlertsProps) {
  return (
    <Card className="border-red-500/50 bg-[#1a1a1a]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-red-400">
          <AlertTriangle className="h-5 w-5" />
          {criticalUpdates.length} Critical Firmware Updates Required
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {criticalUpdates.map((firmware) => (
          <div key={firmware.id} className="space-y-2 rounded-lg border border-slate-700 bg-slate-900/50 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-200">{firmware.deviceName}</h4>
                <div className="mt-1 flex items-center gap-2 text-sm">
                  <span className="font-mono text-gray-400">{firmware.currentVersion}</span>
                  <span className="text-gray-500">→</span>
                  <span className="font-mono text-cyan-400">{firmware.latestVersion}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-xs text-gray-400">Risk Score</div>
                  <div className="text-lg font-bold text-red-400">{firmware.riskScore}</div>
                </div>
                <div className="h-12 w-12 rounded-full bg-red-500/20 p-2">
                  <div
                    className="h-full w-full rounded-full border-4 border-red-500"
                    style={{
                      background: `conic-gradient(#ef4444 ${firmware.riskScore}%, transparent ${firmware.riskScore}%)`,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {firmware.cveIds.map((cve) => (
                <Badge key={cve} variant="outline" className="border-red-500 text-red-400">
                  {cve}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-orange-400">
              <Zap className="h-4 w-4" />
              <span>{firmware.threat}</span>
            </div>
            <Button
              onClick={() => onPatchNow(firmware.id)}
              className="w-full bg-red-500 text-white hover:bg-red-600"
              size="sm"
            >
              Patch Now
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
