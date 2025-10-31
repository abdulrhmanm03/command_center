"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, GripVertical } from "lucide-react"
import { TokenUsageWidget } from "@/components/token-usage-widget"
import { ComplianceStatusWidget } from "@/components/compliance-status-widget"

interface Widget {
  id: string
  type: "token-usage" | "compliance" | "custom"
  title: string
  visible: boolean
}

export function CustomizableWidgets() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "1", type: "token-usage", title: "Token Usage", visible: true },
    { id: "2", type: "compliance", title: "Compliance Status", visible: true },
  ])
  const [isCustomizing, setIsCustomizing] = useState(false)

  const toggleWidget = (id: string) => {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, visible: !w.visible } : w)))
  }

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case "token-usage":
        return <TokenUsageWidget />
      case "compliance":
        return <ComplianceStatusWidget />
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Custom Widgets</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsCustomizing(!isCustomizing)}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Settings className="h-4 w-4 mr-2" />
          {isCustomizing ? "Done" : "Customize"}
        </Button>
      </div>

      {isCustomizing && (
        <Card className="border-none bg-white/5 backdrop-blur-md p-4">
          <div className="space-y-2">
            {widgets.map((widget) => (
              <div key={widget.id} className="flex items-center justify-between p-2 bg-white/5 rounded">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                  <span className="text-sm text-white">{widget.title}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleWidget(widget.id)}
                  className={widget.visible ? "text-green-400" : "text-gray-400"}
                >
                  {widget.visible ? "Visible" : "Hidden"}
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {widgets
          .filter((w) => w.visible)
          .map((widget) => (
            <div key={widget.id}>{renderWidget(widget)}</div>
          ))}
      </div>
    </div>
  )
}
