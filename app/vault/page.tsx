"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, BookOpen, AlertTriangle, Layers, Lightbulb, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"

export default function KnowledgeVaultPage() {
  const [entries, setEntries] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await fetch("/api/vault")
      const data = await response.json()
      setEntries(data)
    } catch (error) {
      console.error("Failed to fetch vault entries:", error)
    }
  }

  const filteredEntries = entries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "incident":
        return <AlertTriangle className="h-4 w-4" />
      case "playbook":
        return <Layers className="h-4 w-4" />
      case "threat":
        return <AlertTriangle className="h-4 w-4" />
      case "lesson":
        return <Lightbulb className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-cyan-400">Knowledge Vault</h1>
              <p className="text-muted-foreground">Incident wiki, lessons learned, and security knowledge base</p>
            </div>
            <Button className="bg-cyan-500 hover:bg-cyan-600">
              <Plus className="mr-2 h-4 w-4" />
              New Entry
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge vault..."
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Entries ({entries.length})</TabsTrigger>
              <TabsTrigger value="incidents">Incidents</TabsTrigger>
              <TabsTrigger value="playbooks">Playbooks</TabsTrigger>
              <TabsTrigger value="lessons">Lessons Learned</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {filteredEntries.map((entry) => (
                <Card key={entry.id} className="border-border/50 hover:border-cyan-500/50 transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getCategoryIcon(entry.category)}
                          <CardTitle className="text-lg text-cyan-400">{entry.title}</CardTitle>
                        </div>
                        <p className="text-sm text-muted-foreground">{entry.content.substring(0, 200)}...</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag: string) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    {entry.root_cause && (
                      <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/30 p-3">
                        <p className="text-xs font-semibold text-amber-400 mb-1">Root Cause</p>
                        <p className="text-sm text-muted-foreground">{entry.root_cause}</p>
                      </div>
                    )}
                    {entry.ttps && entry.ttps.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <span className="text-xs text-muted-foreground">MITRE TTPs:</span>
                        {entry.ttps.map((ttp: string) => (
                          <Badge key={ttp} variant="outline" className="text-xs">
                            {ttp}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="incidents">
              <div className="text-center py-12 text-muted-foreground">
                <AlertTriangle className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Filter by incident entries</p>
              </div>
            </TabsContent>

            <TabsContent value="playbooks">
              <div className="text-center py-12 text-muted-foreground">
                <Layers className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Filter by playbook entries</p>
              </div>
            </TabsContent>

            <TabsContent value="lessons">
              <div className="text-center py-12 text-muted-foreground">
                <Lightbulb className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Filter by lessons learned</p>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
