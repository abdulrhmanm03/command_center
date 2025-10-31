"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Activity,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { StatusChart } from "@/components/status-chart";
import { LiveThreatMonitor } from "@/components/live-threat-monitor";
import { EmbeddingSpaceVisualizer } from "@/components/embedding-space-visualizer";
import { RiskHeatmap } from "@/components/risk-heatmap";
import { BehavioralTrendChart } from "@/components/behavioral-trend-chart";
import { CustomizableWidgets } from "@/components/customizable-widgets";
import { SidebarNav } from "@/components/sidebar-nav";

interface DashboardViewProps {
  onNavigate?: (view: string) => void;
}

export default function DashboardView({ onNavigate }: DashboardViewProps) {
  const router = useRouter();

  const [stats, setStats] = useState([
    {
      title: "Requests Analyzed",
      value: 1247893,
      change: 12.3,
      icon: Activity,
      trend: "up" as const,
      gradient: "from-indigo-900/30 via-indigo-800/10",
      iconColor: "text-indigo-400",
      navigateTo: "/sm-analytics",
    },
    {
      title: "Threats Blocked",
      value: 3421,
      change: 8.1,
      icon: Shield,
      trend: "up" as const,
      gradient: "from-red-900/30 via-red-800/10",
      iconColor: "text-red-400",
      navigateTo: "/sm-threat-detection",
    },
    {
      title: "Active Incidents",
      value: 7,
      change: -23.4,
      icon: AlertTriangle,
      trend: "down" as const,
      gradient: "from-yellow-900/30 via-yellow-800/10",
      iconColor: "text-yellow-400",
      navigateTo: "/sm-incidents",
    },
    {
      title: "Clean Requests",
      value: 99.73,
      change: 0.2,
      icon: CheckCircle2,
      trend: "up" as const,
      gradient: "from-green-900/30 via-green-800/10",
      iconColor: "text-green-400",
      isPercentage: true,
      navigateTo: "/sm-analytics",
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats((prev) =>
        prev.map((stat) => {
          if (stat.title === "Requests Analyzed") {
            return {
              ...stat,
              value: stat.value + Math.floor(Math.random() * 50) + 10,
            };
          }
          if (stat.title === "Threats Blocked") {
            const shouldIncrease = Math.random() > 0.5;
            return {
              ...stat,
              value: shouldIncrease
                ? stat.value + Math.floor(Math.random() * 3) + 1
                : stat.value,
            };
          }
          return stat;
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatValue = (value: number, isPercentage?: boolean) => {
    if (isPercentage) return `${value.toFixed(2)}%`;
    return value.toLocaleString();
  };

  const handleStatClick = (navigateTo: string) => {
    if (onNavigate) onNavigate(navigateTo);
    else router.push(navigateTo);
  };

  return (
    <div className="flex h-screen">
      {/* ✅ Sidebar */}
      <SidebarNav />
      {/* ✅ Main Content */}
      <div className="flex flex-1 flex-col overflow-y-auto hide-scrollbar text-white m-6">
        <div className="space-y-8 p-6 lg:p-8 text-white">
          <div className="space-y-1">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-blue-400 drop-shadow-md">
              AI Pipeline Guardian
            </h1>
            <p className="text-gray-400">
              Real-time AI pipeline protection and threat intelligence
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;
              const trendColor =
                stat.trend === "up" ? "text-green-500" : "text-red-500";

              return (
                <Card
                  key={stat.title}
                  onClick={() => handleStatClick(stat.navigateTo)}
                  className="relative border-none text-white overflow-hidden rounded-2xl bg-white/5 shadow-lg backdrop-blur-md hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all duration-300 cursor-pointer hover:scale-105"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} to-transparent pointer-events-none`}
                  />
                  <div className="relative z-10">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium text-gray-400">
                        {stat.title}
                      </CardTitle>
                      <Icon
                        className={`h-8 w-8 ${stat.iconColor} drop-shadow-md`}
                      />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl lg:text-3xl font-bold drop-shadow-lg">
                        {formatValue(stat.value, stat.isPercentage)}
                      </div>
                      <div
                        className={`text-xs ${trendColor} mt-1 flex items-center gap-1`}
                      >
                        <TrendIcon className="w-4 h-4" />
                        {stat.change > 0 ? "+" : ""}
                        {stat.change}% from last hour
                      </div>
                    </CardContent>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Threat Monitor */}
          <Card className="relative border-none text-white overflow-hidden rounded-2xl bg-white/5 shadow-lg backdrop-blur-md">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-blue-800/10 to-transparent pointer-events-none" />
            <div className="relative z-10 p-4">
              <LiveThreatMonitor onNavigate={onNavigate} />
            </div>
          </Card>

          {/* Risk Analysis Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            <RiskHeatmap />
            <BehavioralTrendChart />
          </div>

          <CustomizableWidgets />

          {/* Charts */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="relative border-none text-white overflow-hidden rounded-2xl bg-white/5 shadow-lg backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-indigo-800/10 to-transparent pointer-events-none" />
              <div className="relative z-10 p-4">
                <StatusChart />
              </div>
            </Card>
            <Card className="relative border-none text-white overflow-hidden rounded-2xl bg-white/5 shadow-lg backdrop-blur-md">
              <div className="absolute inset-0 bg-gradient-to-br from-green-900/30 via-green-800/10 to-transparent pointer-events-none" />
              <div className="relative z-10 p-4">
                <EmbeddingSpaceVisualizer />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
