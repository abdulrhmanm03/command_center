"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AlertsFilters() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Range */}
        <div className="space-y-2">
          <Label>Time Range</Label>
          <Select defaultValue="24h">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Severity */}
        <div className="space-y-3">
          <Label>Severity</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="alert-critical" defaultChecked />
              <label htmlFor="alert-critical" className="text-sm font-medium leading-none">
                Critical
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="alert-high" defaultChecked />
              <label htmlFor="alert-high" className="text-sm font-medium leading-none">
                High
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="alert-medium" defaultChecked />
              <label htmlFor="alert-medium" className="text-sm font-medium leading-none">
                Medium
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="alert-low" />
              <label htmlFor="alert-low" className="text-sm font-medium leading-none">
                Low
              </label>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="space-y-3">
          <Label>Status</Label>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="alert-new" defaultChecked />
              <label htmlFor="alert-new" className="text-sm font-medium leading-none">
                New
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="alert-progress" defaultChecked />
              <label htmlFor="alert-progress" className="text-sm font-medium leading-none">
                In Progress
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="alert-resolved" />
              <label htmlFor="alert-resolved" className="text-sm font-medium leading-none">
                Resolved
              </label>
            </div>
          </div>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>Category</Label>
          <Select defaultValue="all">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="malware">Malware</SelectItem>
              <SelectItem value="intrusion">Intrusion</SelectItem>
              <SelectItem value="anomaly">Anomaly</SelectItem>
              <SelectItem value="policy">Policy Violation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full bg-transparent" variant="outline">
          Reset Filters
        </Button>
      </CardContent>
    </Card>
  )
}
