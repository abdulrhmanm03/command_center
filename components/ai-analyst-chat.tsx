"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, X, Minimize2, Maximize2 } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
}

export function AIAnalystChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI Security Analyst. Ask me anything about threats, incidents, or security recommendations.",
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Based on the current threat landscape, I recommend isolating the affected endpoint immediately.",
        "Dan Jones shows elevated risk score due to unusual login patterns from multiple geographic locations.",
        "The malware signature matches a known APT group. I suggest implementing additional network segmentation.",
        "Current incident severity is HIGH. Estimated impact: 15 endpoints. Recommended action: Execute containment playbook.",
      ]
      const aiMessage: Message = {
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      }
      setMessages((prev) => [...prev, aiMessage])
    }, 1000)

    setInput("")
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-all hover:scale-110"
      >
        <Bot className="h-6 w-6" />
      </button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 border-accent/30 bg-card shadow-2xl transition-all ${
        isMinimized ? "h-14 w-80" : "h-[500px] w-96"
      }`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <CardTitle className="text-sm font-semibold">AI Analyst</CardTitle>
          <div className="h-2 w-2 animate-pulse-glow rounded-full bg-success" />
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsOpen(false)}>
            <X className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col gap-3 p-4 pt-0">
          <ScrollArea className="h-[340px] pr-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <Input
              placeholder="Ask about threats, incidents..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
