"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Package, Shield, Activity, Download, RefreshCw, Star, TrendingUp, Search, Filter } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface DetectionPack {
  id: string
  name: string
  description: string
  category: string
  status: "installed" | "available"
  rules: number
  mitreTechniques: number
  version: string
  updatedAt: string
  icon: string
  rating: number
  downloads: number
  popularity: number
}

export function DetectionPacksTab() {
  const [packs, setPacks] = useState<DetectionPack[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    fetchPacks()
  }, [])

  const fetchPacks = async () => {
    try {
      const response = await fetch("/api/marketplace/detection-packs")
      const data = await response.json()
      setPacks(data)
    } catch (error) {
      console.error("Failed to fetch detection packs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (packId: string, action: "install" | "update") => {
    try {
      await fetch("/api/marketplace/detection-packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packId, action }),
      })
      fetchPacks()
    } catch (error) {
      console.error("Action failed:", error)
    }
  }

  const categories = ["all", ...Array.from(new Set(packs.map((p) => p.category)))]
  const filteredPacks = packs.filter((pack) => {
    const matchesSearch =
      pack.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pack.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || pack.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const featuredPacks = filteredPacks.filter((p) => p.popularity > 80)
  const regularPacks = filteredPacks.filter((p) => p.popularity <= 80)

  if (loading) {
    return <div className="text-center text-muted-foreground">Loading detection packs...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search detection packs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-slate-700 bg-[#0f1419]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                size="sm"
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={
                  selectedCategory === category
                    ? "bg-cyan-500 text-white hover:bg-cyan-600"
                    : "border-slate-700 bg-transparent text-gray-400 hover:bg-slate-800"
                }
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {featuredPacks.length > 0 && (
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-400" />
            <h2 className="text-xl font-semibold text-white">Featured Packs</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {featuredPacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} onAction={handleAction} featured />
            ))}
          </div>
        </div>
      )}

      <div>
        {featuredPacks.length > 0 && <h2 className="mb-4 text-xl font-semibold text-white">All Detection Packs</h2>}
        <div className="space-y-4">
          {regularPacks.map((pack) => (
            <PackCard key={pack.id} pack={pack} onAction={handleAction} />
          ))}
        </div>
      </div>

      {filteredPacks.length === 0 && (
        <div className="py-12 text-center text-gray-400">No detection packs found matching your criteria.</div>
      )}
    </div>
  )
}

function PackCard({
  pack,
  onAction,
  featured = false,
}: {
  pack: DetectionPack
  onAction: (packId: string, action: "install" | "update") => void
  featured?: boolean
}) {
  return (
    <Card
      className={`border-slate-700 bg-[#0f1419] transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 ${
        featured ? "border-yellow-500/30" : ""
      }`}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400">
            <Package className="h-7 w-7" />
            {featured && (
              <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500">
                <Star className="h-3 w-3 fill-white text-white" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-lg font-semibold text-white">{pack.name}</h3>
                  {pack.status === "installed" && (
                    <Badge className="bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30">Installed</Badge>
                  )}
                  <Badge
                    variant="outline"
                    className="border-slate-600 text-xs"
                    style={{
                      borderColor: getCategoryColor(pack.category),
                      color: getCategoryColor(pack.category),
                    }}
                  >
                    {pack.category}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-gray-400 line-clamp-2">{pack.description}</p>
              </div>

              <div className="shrink-0">
                {pack.status === "installed" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-cyan-500/50 bg-transparent text-cyan-400 hover:bg-cyan-500/10"
                    onClick={() => onAction(pack.id, "update")}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Update
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-cyan-500 text-white hover:bg-cyan-600"
                    onClick={() => onAction(pack.id, "install")}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Install
                  </Button>
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Shield className="h-4 w-4 text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rules</p>
                  <p className="font-semibold text-white">{pack.rules}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-500/10">
                  <Activity className="h-4 w-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">MITRE</p>
                  <p className="font-semibold text-white">{pack.mitreTechniques}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Star className="h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Rating</p>
                  <p className="font-semibold text-white">{pack.rating.toFixed(1)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Downloads</p>
                  <p className="font-semibold text-white">{formatNumber(pack.downloads)}</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-gray-500">Popularity</span>
                <span className="font-semibold text-cyan-400">{pack.popularity}%</span>
              </div>
              <Progress value={pack.popularity} className="h-1.5" />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3 text-xs text-gray-500">
              <span>Version {pack.version}</span>
              <span>Updated {pack.updatedAt}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Ransomware: "#ef4444",
    "APT Detection": "#f59e0b",
    "Cloud Security": "#3b82f6",
    "Insider Threat": "#8b5cf6",
    "Network Security": "#10b981",
    Malware: "#ec4899",
  }
  return colors[category] || "#6b7280"
}

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}
