"use client"

import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { FileText, LayoutDashboard, Zap, Brain, TrendingUp } from "lucide-react"

const capabilities = [
  { name: "Incident Triage", icon: FileText, path: "/incidents", color: "text-cyan-400" },
  { name: "Dashboards", icon: LayoutDashboard, path: "/", color: "text-teal-400" },
  { name: "Automated Response", icon: Zap, path: "/incidents", color: "text-orange-400" },
  { name: "LLM Risk Scoring", icon: Brain, path: "/risk-scoring", color: "text-yellow-400" },
  { name: "Predictive Forecasting", icon: TrendingUp, path: "/forecasting", color: "text-green-400" },
]

export function NISTCapabilitiesNav() {
  const router = useRouter()

  return (
    <Card className="border-accent/30 bg-gradient-to-r from-emerald-950/40 to-teal-950/40 p-4">
      <div className="grid grid-cols-3 gap-3 lg:grid-cols-5">
        {capabilities.map((capability) => {
          const Icon = capability.icon
          return (
            <button
              key={capability.name}
              onClick={() => router.push(capability.path)}
              className="group flex flex-col items-center gap-2 rounded-lg border border-border/50 bg-background/50 p-3 transition-all hover:scale-105 hover:border-accent hover:bg-background/80 hover:shadow-lg"
            >
              <Icon className={`h-5 w-5 ${capability.color} transition-transform group-hover:scale-110`} />
              <span className="text-center text-xs font-medium text-foreground">{capability.name}</span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
