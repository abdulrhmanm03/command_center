"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Ban, UserX, Mail, CheckCircle2, AlertCircle, Loader2 } from "lucide-react"

interface ResponseAction {
  id: string
  name: string
  description: string
  icon: typeof Shield
  action: "isolate_endpoint" | "block_ip" | "disable_user" | "delete_email"
  color: string
}

const actions: ResponseAction[] = [
  {
    id: "isolate",
    name: "Isolate Endpoint",
    description: "Disconnect device from network",
    icon: Shield,
    action: "isolate_endpoint",
    color: "text-red-500",
  },
  {
    id: "block",
    name: "Block IP Address",
    description: "Add IP to firewall blocklist",
    icon: Ban,
    action: "block_ip",
    color: "text-orange-500",
  },
  {
    id: "disable",
    name: "Disable User",
    description: "Disable Active Directory account",
    icon: UserX,
    action: "disable_user",
    color: "text-yellow-500",
  },
  {
    id: "delete",
    name: "Delete Email",
    description: "Remove email from all mailboxes",
    icon: Mail,
    action: "delete_email",
    color: "text-blue-500",
  },
]

export function ResponseActionPanel() {
  const [executing, setExecuting] = useState<string | null>(null)
  const [results, setResults] = useState<Record<string, { status: string; message: string }>>({})

  const executeAction = async (action: ResponseAction, target: string) => {
    setExecuting(action.id)

    try {
      const response = await fetch("/api/response-actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: action.action,
          target,
          reason: "Automated response to security incident",
        }),
      })

      const data = await response.json()

      setResults((prev) => ({
        ...prev,
        [action.id]: {
          status: data.status,
          message: data.message,
        },
      }))
    } catch (error) {
      setResults((prev) => ({
        ...prev,
        [action.id]: {
          status: "failed",
          message: "Failed to execute action",
        },
      }))
    } finally {
      setExecuting(null)
    }
  }

  return (
    <Card className="border-accent/30 bg-card">
      <CardHeader>
        <CardTitle className="text-primary">Automated Response Actions</CardTitle>
        <CardDescription>Execute immediate response actions to contain threats</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {actions.map((action) => {
          const Icon = action.icon
          const result = results[action.id]
          const isExecuting = executing === action.id

          return (
            <div
              key={action.id}
              className="flex items-center justify-between rounded-lg border border-border bg-background p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-full bg-secondary p-2 ${action.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-medium text-foreground">{action.name}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                  {result && (
                    <div className="mt-1 flex items-center gap-2">
                      {result.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-destructive" />
                      )}
                      <span className="text-xs text-muted-foreground">{result.message}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                onClick={() => executeAction(action, "192.168.1.100")}
                disabled={isExecuting}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isExecuting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Executing...
                  </>
                ) : (
                  "Execute"
                )}
              </Button>
            </div>
          )
        })}

        <div className="mt-4 rounded-lg border border-accent/30 bg-secondary/50 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-warning mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <strong>Note:</strong> All automated actions are logged and can be audited. Critical actions require
              approval before execution.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
