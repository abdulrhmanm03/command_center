"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"

interface UpdateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  firmware: {
    deviceName: string
    currentVersion: string
    latestVersion: string
    downtimeEstimate: string
  }
  onSchedule: (date: Date) => void
}

export function UpdateModal({ open, onOpenChange, firmware, onSchedule }: UpdateModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const handleSchedule = () => {
    if (selectedDate) {
      onSchedule(selectedDate)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-700 bg-[#1a1a1a] text-gray-200 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-cyan-400">Schedule Firmware Update</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-gray-300">Device</Label>
            <p className="text-sm font-medium text-gray-200">{firmware.deviceName}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Current Version</Label>
              <p className="text-sm font-mono text-gray-400">{firmware.currentVersion}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Target Version</Label>
              <p className="text-sm font-mono text-cyan-400">{firmware.latestVersion}</p>
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Estimated Downtime</Label>
            <p className="text-sm text-orange-400">{firmware.downtimeEstimate}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-gray-300">Select Date & Time</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border border-slate-700 bg-[#0a0a0a]"
              disabled={(date) => date < new Date()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-slate-600 bg-transparent text-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSchedule}
            disabled={!selectedDate}
            className="bg-blue-500 text-white hover:bg-blue-600"
          >
            Schedule Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
