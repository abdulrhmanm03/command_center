"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AIAssetInventory } from "@/components/ai-asset-inventory"
import { AISPMRadar } from "@/components/ai-spm-radar"
import { AIThreatAnalyst } from "@/components/ai-threat-analyst"
import { AISecurityScore } from "@/components/ai-security-score"
import { Brain, Database, Plug, User, TrendingUp, TrendingDown, Play, Pause } from "lucide-react"
import type { AIAsset } from "@/lib/db"

export default function AISPMPage() {
  const [assets, setAssets] = useState<AIAsset[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [postureScore, setPostureScore] = useState(78)
  const [isPlaying, setIsPlaying] = useState(true)
  const [timelinePosition, setTimelinePosition] = useState(50)

  // Fetch AI assets
  useEffect(() => {
    fetch("/api/ai-spm/assets")
      .then((res) => res.json())
      .then((data) => setAssets(data.assets || []))
      .catch(console.error)
  }, [])

  // Fetch AI insights
  useEffect(() => {
    fetch("/api/ai-spm/insights")
      .then((res) => res.json())
      .then((data) => setInsights(data.insights || []))
      .catch(console.error)
  }, [])

  // Calculate stats
  const stats = {
    modelEndpoints: assets.filter((a) => a.asset_type === "LLM").length,
    datasets: assets.filter((a) => a.asset_type === "Dataset").length,
    plugins: assets.filter((a) => a.asset_type === "Plugin").length,
    actors: assets.filter((a) => a.asset_type === "Actor").length,
    totalAssets: assets.length,
    atRisk: Math.round((assets.filter((a) => a.risk_score >= 60).length / assets.length) * 100) || 34,
    protected: Math.round((assets.filter((a) => a.runtime_protection).length / assets.length) * 100) || 76,
  }

  const handleScan = (assetId: string) => {
    console.log("Scanning asset:", assetId)
  }

  const handleIsolate = (assetId: string) => {
    console.log("Isolating asset:", assetId)
  }

  const handleRemediate = (assetId: string) => {
    console.log("Remediating asset:", assetId)
  }

  const handleAudit = (assetId: string) => {
    console.log("Auditing asset:", assetId)
  }

  const handleAutoFix = (insightId: string) => {
    console.log("Auto-fixing insight:", insightId)
  }

  const handleDismiss = (insightId: string) => {
    setInsights((prev) => prev.filter((i) => i.id !== insightId))
  }

  const handleAddToHunt = (insightId: string) => {
    console.log("Adding to hunt:", insightId)
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI Security Posture Management</h1>
            <p className="text-sm text-muted-foreground">Real-time AI asset monitoring and threat detection</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="border-green-500/50 text-green-400">
              <span className="mr-1 h-2 w-2 animate-pulse rounded-full bg-green-400" />
              LIVE
            </Badge>
            <Button size="sm" variant="outline">
              All Assets
            </Button>
            <Button size="sm" variant="outline">
              All Risks
            </Button>
            <Button size="sm" variant="outline">
              Auto-Fix
            </Button>
            <Button size="sm" variant="outline">
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 gap-6 overflow-hidden p-6">
        {/* Left: AI Resources + Asset Inventory */}
        <div className="flex w-[30%] flex-col gap-6">
          {/* AI Resources Stats */}
          <Card className="bg-card/50 p-6 backdrop-blur-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">AI Resources</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/20">
                  <Brain className="h-5 w-5 text-pink-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{stats.modelEndpoints}</div>
                  <div className="text-xs text-muted-foreground">Model Endpoints</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-500/20">
                  <Database className="h-5 w-5 text-teal-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{stats.datasets}</div>
                  <div className="text-xs text-muted-foreground">Datasets</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/20">
                  <Plug className="h-5 w-5 text-orange-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{stats.plugins}</div>
                  <div className="text-xs text-muted-foreground">Plug-ins</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                  <User className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-foreground">{stats.actors}</div>
                  <div className="text-xs text-muted-foreground">Actors</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Asset Inventory */}
          <AIAssetInventory
            assets={assets}
            onScan={handleScan}
            onIsolate={handleIsolate}
            onRemediate={handleRemediate}
            onAudit={handleAudit}
          />
        </div>

        {/* Center: Radar + Score */}
        <div className="flex w-[40%] flex-col gap-6">
          <AISPMRadar assets={assets} />

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card/50 p-4 backdrop-blur-sm">
              <div className="mb-2 text-sm text-muted-foreground">Applications at Risk</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-blue-400">{stats.atRisk}%</div>
                <Badge variant="outline" className="border-red-500/50 text-red-400">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +2%
                </Badge>
              </div>
              <Button size="sm" variant="link" className="mt-2 h-auto p-0 text-xs text-cyan-400">
                Show Risks
              </Button>
            </Card>

            <Card className="bg-card/50 p-4 backdrop-blur-sm">
              <div className="mb-2 text-sm text-muted-foreground">Runtime Protection</div>
              <div className="flex items-baseline gap-2">
                <div className="text-3xl font-bold text-yellow-400">{stats.protected}%</div>
                <Badge variant="outline" className="border-green-500/50 text-green-400">
                  <TrendingDown className="mr-1 h-3 w-3" />
                  -1%
                </Badge>
              </div>
              <Button size="sm" variant="link" className="mt-2 h-auto p-0 text-xs text-cyan-400">
                Add AI Runtime Security
              </Button>
            </Card>
          </div>
        </div>

        {/* Right: Security Score + Threat Analyst */}
        <div className="flex w-[30%] flex-col gap-6">
          <AISecurityScore score={postureScore} showDetails />

          {/* Posture Score Over Time */}
          <Card className="bg-card/50 p-4 backdrop-blur-sm">
            <div className="mb-2 text-sm font-semibold text-foreground">Posture Score Over Time</div>
            <div className="flex items-center gap-2 text-xs text-green-400">
              <TrendingUp className="h-3 w-3" />
              <span>14% last 7 days</span>
            </div>
            <div className="mt-4 h-16 rounded bg-gradient-to-r from-blue-500/20 to-purple-500/20" />
          </Card>

          <AIThreatAnalyst
            insights={insights}
            onAutoFix={handleAutoFix}
            onDismiss={handleDismiss}
            onAddToHunt={handleAddToHunt}
          />
        </div>
      </div>

      {/* Bottom: 24H Activity Timeline */}
      <div className="border-t border-border bg-card/50 px-6 py-4 backdrop-blur-sm">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">24H AI Activity Timeline</h3>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <span className="text-xs text-muted-foreground">1x</span>
          </div>
        </div>
        <div className="relative">
          <input
            type="range"
            min="0"
            max="100"
            value={timelinePosition}
            onChange={(e) => setTimelinePosition(Number(e.target.value))}
            className="w-full"
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>MON</span>
            <span>TUE</span>
            <span>WED</span>
            <span>THU</span>
            <span>FRI</span>
            <span>SAT</span>
            <span>SUN</span>
          </div>
        </div>
      </div>
    </div>
  )
}
