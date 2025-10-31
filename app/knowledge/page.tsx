"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KnowledgeArticleCard } from "@/components/knowledge-article-card"
import { Plus, RefreshCw, Search, BookOpen, TrendingUp, Eye, Star, Activity } from "lucide-react"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"

export default function KnowledgeVaultPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      const [articlesRes, statsRes] = await Promise.all([fetch("/api/knowledge"), fetch("/api/knowledge/stats")])
      const articlesData = await articlesRes.json()
      const statsData = await statsRes.json()

      setArticles(articlesData)
      setStats(statsData)
    } catch (error) {
      console.error("Failed to fetch knowledge vault data:", error)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
    setTimeout(() => setIsRefreshing(false), 500)
  }

  const filteredArticles = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = !selectedCategory || article.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const featuredArticles = articles.filter((a) => a.featured)
  const trendingArticles = articles.filter((a) => a.trending)

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400">Knowledge Vault</h1>
              <p className="text-muted-foreground">Security knowledge base and procedures</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-gray-700 bg-transparent"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button size="sm" className="bg-cyan-500 text-black hover:bg-cyan-400">
                <Plus className="mr-2 h-4 w-4" />
                Add Article
              </Button>
            </div>
          </div>

          {stats && (
            <div className="mb-6 grid gap-4 md:grid-cols-4">
              <Card className="border-slate-700 bg-gradient-to-br from-cyan-500/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Articles</p>
                      <p className="text-3xl font-bold text-white">{stats.totalArticles}</p>
                      <p className="text-xs text-cyan-400">{stats.recentUpdates} updated recently</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20">
                      <BookOpen className="h-6 w-6 text-cyan-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-gradient-to-br from-purple-500/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Views</p>
                      <p className="text-3xl font-bold text-white">{stats.totalViews.toLocaleString()}</p>
                      <p className="text-xs text-purple-400">Across all articles</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20">
                      <Eye className="h-6 w-6 text-purple-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-gradient-to-br from-yellow-500/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Avg Rating</p>
                      <p className="text-3xl font-bold text-white">{stats.avgRating}</p>
                      <p className="text-xs text-yellow-400">Community feedback</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-500/20">
                      <Star className="h-6 w-6 text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-slate-700 bg-gradient-to-br from-green-500/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Recent Activity</p>
                      <p className="text-3xl font-bold text-white">{stats.recentActivity.length}</p>
                      <p className="text-xs text-green-400">Updates today</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/20">
                      <Activity className="h-6 w-6 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {stats && (
            <div className="mb-6 grid gap-4 md:grid-cols-3">
              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-cyan-400">Category Breakdown</h3>
                  <div className="space-y-4">
                    {stats.categoryBreakdown.map((cat: any) => (
                      <div key={cat.category}>
                        <div className="mb-2 flex items-center justify-between text-sm">
                          <span className="text-gray-300">{cat.category}</span>
                          <span className="font-semibold text-white">
                            {cat.count} ({cat.percentage}%)
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-gray-800">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-cyan-400">Recent Activity</h3>
                  <div className="space-y-3">
                    {stats.recentActivity.map((activity: any) => (
                      <div key={activity.id} className="flex items-start gap-3 text-sm">
                        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
                        <div className="flex-1">
                          <p className="text-gray-300">
                            <span className="font-medium text-white">{activity.user}</span>{" "}
                            <span className="text-gray-500">{activity.action}</span>
                          </p>
                          <p className="text-gray-400 line-clamp-1">{activity.article}</p>
                          <p className="text-xs text-gray-600">{activity.timestamp}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold text-cyan-400">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {stats.popularTags.map((tag: any) => (
                      <Badge
                        key={tag.tag}
                        variant="secondary"
                        className="cursor-pointer bg-gray-800 text-gray-300 hover:bg-cyan-500/20 hover:text-cyan-400"
                      >
                        {tag.tag} ({tag.count})
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <Tabs defaultValue="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-card">
                <TabsTrigger value="all" className="data-[state=active]:text-cyan-400">
                  All Articles
                </TabsTrigger>
                <TabsTrigger value="featured" className="data-[state=active]:text-cyan-400">
                  Featured
                </TabsTrigger>
                <TabsTrigger value="trending" className="data-[state=active]:text-cyan-400">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Trending
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={selectedCategory === null ? "default" : "outline"}
                    onClick={() => setSelectedCategory(null)}
                    className={selectedCategory === null ? "bg-cyan-500 text-black" : "border-gray-700"}
                  >
                    All
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedCategory === "Procedures" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("Procedures")}
                    className={selectedCategory === "Procedures" ? "bg-cyan-500 text-black" : "border-gray-700"}
                  >
                    Procedures
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedCategory === "Articles" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("Articles")}
                    className={selectedCategory === "Articles" ? "bg-cyan-500 text-black" : "border-gray-700"}
                  >
                    Articles
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedCategory === "Threat Profiles" ? "default" : "outline"}
                    onClick={() => setSelectedCategory("Threat Profiles")}
                    className={selectedCategory === "Threat Profiles" ? "bg-cyan-500 text-black" : "border-gray-700"}
                  >
                    Threat Profiles
                  </Button>
                </div>

                <div className="relative w-80">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    placeholder="Search knowledge base..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-border/50 bg-card pl-9"
                  />
                </div>
              </div>
            </div>

            <TabsContent value="all" className="space-y-4">
              {filteredArticles.map((article) => (
                <KnowledgeArticleCard
                  key={article.id}
                  article={article}
                  onRead={() => console.log("Read article:", article.id)}
                  onExport={() => console.log("Export article:", article.id)}
                />
              ))}
            </TabsContent>

            <TabsContent value="featured" className="space-y-4">
              {featuredArticles
                .filter((article) => {
                  const matchesSearch =
                    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    article.description.toLowerCase().includes(searchQuery.toLowerCase())
                  const matchesCategory = !selectedCategory || article.category === selectedCategory
                  return matchesSearch && matchesCategory
                })
                .map((article) => (
                  <KnowledgeArticleCard
                    key={article.id}
                    article={article}
                    onRead={() => console.log("Read article:", article.id)}
                    onExport={() => console.log("Export article:", article.id)}
                  />
                ))}
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              {trendingArticles
                .filter((article) => {
                  const matchesSearch =
                    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    article.description.toLowerCase().includes(searchQuery.toLowerCase())
                  const matchesCategory = !selectedCategory || article.category === selectedCategory
                  return matchesSearch && matchesCategory
                })
                .map((article) => (
                  <KnowledgeArticleCard
                    key={article.id}
                    article={article}
                    onRead={() => console.log("Read article:", article.id)}
                    onExport={() => console.log("Export article:", article.id)}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
