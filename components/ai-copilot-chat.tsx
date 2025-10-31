"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Brain, X, Send, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  role: "user" | "assistant"
  content: string
  action?: {
    type: string
    label: string
    data: any
  }
}

export function AICopilotChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your AI Security Analyst. Ask me about threats, risks, or say commands like 'block ip 1.2.3.4' or 'show top 5 alerts'.",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.response, action: data.action }])
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAction = async (action: any) => {
    setIsLoading(true)
    try {
      // Execute the action
      await fetch("/api/ai/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(action),
      })
      setMessages((prev) => [...prev, { role: "assistant", content: `✓ Action completed: ${action.label}` }])
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Failed to execute action." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-all",
          "bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500",
          "hover:scale-110 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]",
        )}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Brain className="h-6 w-6" />}
      </Button>

      {/* Chat Panel */}
      {isOpen && (
        <Card
          className={cn(
            "fixed bottom-24 right-6 z-50 flex h-[600px] w-[400px] flex-col",
            "border-cyan-500/30 bg-card/95 backdrop-blur-xl shadow-2xl",
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-cyan-400">AI Security Analyst</h3>
              <p className="text-xs text-muted-foreground">Powered by GPT-4</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3 text-sm",
                    msg.role === "user" ? "bg-cyan-500/20 text-cyan-100" : "bg-muted text-foreground",
                  )}
                >
                  {msg.content}
                  {msg.action && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAction(msg.action)}
                        className="bg-green-500 text-white hover:bg-green-600"
                      >
                        <CheckCircle2 className="mr-1 h-3 w-3" />
                        {msg.action.label}
                      </Button>
                      <Button size="sm" variant="outline">
                        Dismiss
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-muted p-3">
                  <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about threats or give commands..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading || !input.trim()} size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Try: "What's the top risk?" or "block ip 1.2.3.4"</p>
          </div>
        </Card>
      )}
    </>
  )
}
