"use client"

import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Activity,
  BarChart3,
  GitBranch,
  MessageSquare,
  TrendingUp,
  Cpu,
  Database,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NavigationProps {
  activeView:
    | "dashboard"
    | "threats"
    | "policies"
    | "incidents"
    | "analytics"
    | "pipelines"
    | "interaction"
    | "behavioral"
    | "execution"
    | "models"
    | "settings" // Added settings to type union
  onViewChange: (
    view:
      | "dashboard"
      | "threats"
      | "policies"
      | "incidents"
      | "analytics"
      | "pipelines"
      | "interaction"
      | "behavioral"
      | "execution"
      | "models"
      | "settings", // Added settings to type union
  ) => void
}

export function Navigation({ activeView, onViewChange }: NavigationProps) {
  const navItems = [
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "pipelines" as const, label: "Pipelines", icon: GitBranch },
    { id: "models" as const, label: "Model Registry", icon: Database },
    { id: "interaction" as const, label: "Interaction Layer", icon: MessageSquare },
    { id: "behavioral" as const, label: "Behavioral Telemetry", icon: TrendingUp },
    { id: "execution" as const, label: "Execution Environment", icon: Cpu },
    { id: "threats" as const, label: "Threat Detection", icon: AlertTriangle },
    { id: "policies" as const, label: "Policies", icon: FileText },
    { id: "incidents" as const, label: "Incidents", icon: Activity },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
    { id: "settings" as const, label: "Settings", icon: Settings }, // Added Settings nav item
  ]

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar shadow-lg">
      <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6 bg-sidebar">
        <img src="/logo.png" alt="Visionary Tech Services" className="h-10 w-10" />
        <div className="flex flex-col">
          <span className="text-sm font-bold text-sidebar-foreground">Semantic Firewall</span>
          <span className="text-xs text-sidebar-foreground/60">by Visionary Tech</span>
        </div>
      </div>
      <nav className="space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                activeView === item.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground hover:shadow-md",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          )
        })}
      </nav>
    </aside>
  )
}
