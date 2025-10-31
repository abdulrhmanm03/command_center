"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Brain, Database, Plug, User, GitBranch, Shield, AlertTriangle, Play, Lock, FileText } from "lucide-react"
import type { AIAsset } from "@/lib/db"

interface AIAssetInventoryProps {
  assets: AIAsset[]
  onScan: (assetId: string) => void
  onIsolate: (assetId: string) => void
  onRemediate: (assetId: string) => void
  onAudit: (assetId: string) => void
}

const assetIcons = {
  LLM: Brain,
  Dataset: Database,
  Plugin: Plug,
  Actor: User,
  Pipeline: GitBranch,
  VectorDB: Database,
}

const cloudLogos = {
  AWS: "🟠",
  GCP: "🔵",
  Azure: "🔷",
  OpenAI: "🟢",
  Anthropic: "🟣",
}

export function AIAssetInventory({ assets, onScan, onIsolate, onRemediate, onAudit }: AIAssetInventoryProps) {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([])

  const toggleAsset = (id: string) => {
    setSelectedAssets((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-500"
    if (score >= 60) return "text-orange-500"
    if (score >= 40) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <Card className="h-full bg-card/50 p-6 backdrop-blur-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">AI Asset Inventory</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" disabled={selectedAssets.length === 0}>
            Scan All
          </Button>
          <Button size="sm" variant="outline" disabled={selectedAssets.length === 0}>
            Auto-Remediate
          </Button>
        </div>
      </div>

      <div className="space-y-2 overflow-y-auto" style={{ maxHeight: "calc(100vh - 400px)" }}>
        {assets.map((asset) => {
          const Icon = assetIcons[asset.asset_type]
          return (
            <div
              key={asset.id}
              className="group rounded-lg border border-border bg-background/50 p-4 transition-all hover:border-cyan-500/50 hover:bg-background/80"
            >
              <div className="flex items-start gap-3">
                <Checkbox checked={selectedAssets.includes(asset.id)} onCheckedChange={() => toggleAsset(asset.id)} />

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/20">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-foreground">{asset.name}</div>
                      <div className="text-xs text-muted-foreground">{asset.provider}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={asset.environment === "Production" ? "destructive" : "secondary"}>
                        {asset.environment}
                      </Badge>
                      <span className="text-lg">{cloudLogos[asset.cloud]}</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3 text-cyan-400" />
                        <span className="text-muted-foreground">{asset.assets_discovered}</span>
                      </div>
                      <div className={`font-semibold ${getRiskColor(asset.risk_score)}`}>
                        Risk: {asset.risk_score}/100
                      </div>
                      {asset.risks > 0 && (
                        <Badge variant="destructive" className="h-5">
                          {asset.risks}
                        </Badge>
                      )}
                    </div>

                    <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button size="sm" variant="ghost" onClick={() => onScan(asset.id)}>
                        <Play className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onIsolate(asset.id)}>
                        <Lock className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onRemediate(asset.id)}>
                        <Shield className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => onAudit(asset.id)}>
                        <FileText className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {asset.top_risk && (
                    <div className="mt-2 flex items-center gap-2 rounded bg-red-500/10 px-2 py-1 text-xs">
                      <AlertTriangle className="h-3 w-3 text-red-400" />
                      <span className="text-red-400">{asset.top_risk}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
