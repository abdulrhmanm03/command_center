"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Loader2 } from "lucide-react"

interface ProgressLogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  firmware: {
    deviceName: string
    currentVersion: string
    latestVersion: string
  }
  onComplete: () => void
}

export function ProgressLog({ open, onOpenChange, firmware, onComplete }: ProgressLogProps) {
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    if (!open) {
      setProgress(0)
      setLogs([])
      setIsComplete(false)
      return
    }

    const logMessages = [
      "Initializing firmware update process...",
      "Backing up current configuration...",
      "Downloading firmware package...",
      "Verifying firmware signature...",
      "Preparing device for update...",
      "Installing firmware update...",
      "Rebooting device...",
      "Verifying installation...",
      "Restoring configuration...",
      "Update completed successfully!",
    ]

    let currentLog = 0
    const interval = setInterval(() => {
      if (currentLog < logMessages.length) {
        setLogs((prev) => [...prev, logMessages[currentLog]])
        setProgress(((currentLog + 1) / logMessages.length) * 100)
        currentLog++
      } else {
        setIsComplete(true)
        clearInterval(interval)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [open])

  const handleClose = () => {
    if (isComplete) {
      onComplete()
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="border-slate-700 bg-[#1a1a1a] text-gray-200 sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-cyan-400">Applying Firmware Update</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">{firmware.deviceName}</span>
              <span className="text-gray-400">
                {firmware.currentVersion} → {firmware.latestVersion}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{Math.round(progress)}% complete</span>
              {isComplete && (
                <span className="flex items-center gap-1 text-green-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Success
                </span>
              )}
            </div>
          </div>
          <div className="max-h-[300px] space-y-1 overflow-y-auto rounded-md border border-slate-700 bg-[#0a0a0a] p-4 font-mono text-xs">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start gap-2 text-gray-300">
                {index === logs.length - 1 && !isComplete ? (
                  <Loader2 className="mt-0.5 h-3 w-3 animate-spin text-blue-400" />
                ) : (
                  <CheckCircle2 className="mt-0.5 h-3 w-3 text-green-400" />
                )}
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
        {isComplete && (
          <div className="flex justify-end">
            <Button onClick={handleClose} className="bg-green-500 text-white hover:bg-green-600">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
