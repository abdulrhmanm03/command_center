"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function EventFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <Label>Search Events</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="IP, hostname, user..." className="pl-10" />
          </div>
        </div>

        {/* Severity Filter */}
        <div className="space-y-3">
          <Label>Severity</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="critical" defaultChecked />
              <label
                htmlFor="critical"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Critical
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="high" defaultChecked />
              <label
                htmlFor="high"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                High
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="medium" defaultChecked />
              <label
                htmlFor="medium"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Medium
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="low" />
              <label
                htmlFor="low"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Low
              </label>
            </div>
          </div>
        </div>

        {/* Event Type Filter */}
        <div className="space-y-3">
          <Label>Event Type</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="malware" defaultChecked />
              <label
                htmlFor="malware"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Malware
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="intrusion" defaultChecked />
              <label
                htmlFor="intrusion"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Intrusion
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="anomaly" defaultChecked />
              <label
                htmlFor="anomaly"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Anomaly
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="policy" />
              <label
                htmlFor="policy"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Policy Violation
              </label>
            </div>
          </div>
        </div>

        {/* Status Filter */}
        <div className="space-y-3">
          <Label>Status</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="new" defaultChecked />
              <label
                htmlFor="new"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                New
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="investigating" defaultChecked />
              <label
                htmlFor="investigating"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Investigating
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="resolved" />
              <label
                htmlFor="resolved"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Resolved
              </label>
            </div>
          </div>
        </div>

        <Button className="w-full bg-transparent" variant="outline">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  )
}
