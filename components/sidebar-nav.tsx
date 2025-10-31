"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  AlertTriangle,
  FileText,
  Target,
  Shield,
  Settings,
  LogOut,
  BarChart3,
  Network,
  Database,
  BookOpen,
  Layers,
  Brain,
  TrendingUp,
  Store,
  CheckSquare,
  Radar,
  Search,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Security Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "CyberThreat Radar",
    href: "/threatmap",
    icon: Radar,
  },
  {
    title: "Security Alerts",
    href: "/alerts",
    icon: AlertTriangle,
    badge: "12",
  },
  {
    title: "Incident Management",
    href: "/incidents",
    icon: FileText,
  },
  {
    title: "Vulnerability Management",
    href: "/vulnerability",
    icon: Target,
  },
  {
    title: "Authentication Activity",
    href: "/auth-activity",
    icon: Shield,
  },
  {
    title: "Compliance & Frameworks",
    href: "/compliance",
    icon: CheckSquare,
  },
];

const intelligenceItems = [
  {
    title: "Threat Intel",
    href: "/threat-intel",
    icon: Shield,
  },
  {
    title: "Risk Analytics",
    href: "/user-analytics",
    icon: BarChart3,
  },
  {
    title: "LLM Risk Scoring",
    href: "/risk-scoring",
    icon: Brain,
  },
  {
    title: "Predictive Forecasting",
    href: "/forecasting",
    icon: TrendingUp,
  },
  {
    title: "Network Topology",
    href: "/network",
    icon: Network,
  },
  {
    title: "AI Security Posture",
    href: "/ai-spm",
    icon: Brain,
  },
];

const automationItems = [
  {
    title: "Data Pipeline",
    href: "/pipeline",
    icon: Database,
  },
  {
    title: "Playbooks",
    href: "/playbooks",
    icon: Layers,
  },
  {
    title: "Hunt Console",
    href: "/hunt",
    icon: Search,
  },
  {
    title: "Knowledge Vault",
    href: "/vault",
    icon: BookOpen,
  },
  {
    title: "Marketplace",
    href: "/marketplace",
    icon: Store,
  },
];

const semanticFirewall = [
  {
    title: "Dashboard",
    href: "/sm-dashboard",
    icon: Database,
  },
  {
    title: "Pipelines",
    href: "/sm-pipelines",
    icon: Layers,
  },
  {
    title: "Model Registry",
    href: "/sm-model-registry",
    icon: Search,
  },
  {
    title: "Interaction Layer",
    href: "/sm-interaction-layer",
    icon: BookOpen,
  },
  {
    title: "Behavioral Telemetry",
    href: "/sm-behavioral-telemetry",
    icon: Store,
  },
  {
    title: "EXecution Environment",
    href: "/sm-execution-environment",
    icon: Store,
  },
  {
    title: "Threat Detection",
    href: "/sm-threat-detection",
    icon: Store,
  },
  {
    title: "Policies",
    href: "/sm-policies",
    icon: Store,
  },
  {
    title: "Incidents",
    href: "/sm-incidents",
    icon: Store,
  },
  {
    title: "Analytics",
    href: "/sm-analytics",
    icon: Store,
  },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-72 flex-col border-r border-border bg-sidebar">
      <Link
        href="/"
        className="flex h-24 flex-col items-start justify-center border-b border-border px-6 py-4 transition-opacity hover:opacity-80"
      >
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-cyan-400 drop-shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
          <div className="flex flex-col leading-tight">
            <div className="text-xl font-bold tracking-tight">
              <span className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]">
                VTS
              </span>
              <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.7)]">
                {" "}
                Command
              </span>
            </div>
            <div className="text-xl font-bold tracking-tight">
              <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.7)]">
                Centre
              </span>
            </div>
            <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]">
              Security Operations
            </div>
          </div>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto hide-scrollbar p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          const isSecurityDashboard = item.title === "Security Dashboard";

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? isSecurityDashboard
                    ? "bg-cyan-500/20 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]"
                    : "bg-accent text-accent-foreground"
                  : isSecurityDashboard
                  ? "text-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_8px_rgba(6,182,212,0.2)]"
                  : "text-sidebar-foreground hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-4 w-4",
                    isSecurityDashboard && "text-cyan-400"
                  )}
                />
                <span className={isSecurityDashboard ? "font-bold" : ""}>
                  {item.title}
                </span>
              </div>
              {item.badge && (
                <span className="rounded-full bg-destructive px-2 py-0.5 text-xs font-bold text-destructive-foreground">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="pt-4">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-yellow-500">
            Intelligence
          </div>
          {intelligenceItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-sidebar-foreground hover:bg-accent/50 hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>

        <div className="pt-4">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-yellow-500">
            Automation
          </div>
          {automationItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-sidebar-foreground hover:bg-accent/50 hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>

        <div className="pt-4">
          <div className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-yellow-500">
            Semantic Firewall
          </div>
          {semanticFirewall.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-sidebar-foreground hover:bg-accent/50 hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Bottom Section */}
      <div className="space-y-1 border-t border-border p-4">
        <Link
          href="/settings"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-accent/50 hover:text-accent-foreground"
        >
          <Settings className="h-4 w-4" />
          <span>System Settings</span>
        </Link>
        <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-accent/50 hover:text-accent-foreground">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
