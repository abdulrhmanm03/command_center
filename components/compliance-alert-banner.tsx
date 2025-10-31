"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ComplianceAlertBannerProps {
  gaps: Array<{ control_id: string; framework: string }>
}

export function ComplianceAlertBanner({ gaps }: ComplianceAlertBannerProps) {
  if (gaps.length === 0) return null

  return (
    <div className="flex items-center justify-between rounded-lg border border-red-500/30 bg-red-500/10 p-4">
      <div className="flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <div>
          <p className="font-semibold text-red-400">{gaps.length} CRITICAL GAPS DETECTED</p>
          <p className="text-sm text-gray-400">{gaps.map((g) => g.control_id).join(", ")}</p>
        </div>
      </div>
      <Link href="/compliance">
        <Button variant="destructive" size="sm">
          Fix Now
        </Button>
      </Link>
    </div>
  )
}
