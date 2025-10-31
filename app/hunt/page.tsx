"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Play, Save, Download, Code, Clock, CheckCircle2 } from "lucide-react"
import { useState, useEffect } from "react"

export default function HuntConsolePage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const [savedHunts, setSavedHunts] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    fetchSavedHunts()
  }, [])

  const fetchSavedHunts = async () => {
    try {
      const response = await fetch("/api/hunt/saved")
      const data = await response.json()
      setSavedHunts(data)
    } catch (error) {
      console.error("Failed to fetch saved hunts:", error)
    }
  }

  const handleSearch = async () => {
    if (!query.trim()) return
    setIsSearching(true)

    try {
      const response = await fetch("/api/hunt/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      })
      const data = await response.json()
      setResults(data.results)
    } catch (error) {
      console.error("Hunt query failed:", error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSaveHunt = async () => {
    const name = prompt("Enter hunt name:")
    if (!name) return

    try {
      await fetch("/api/hunt/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, query }),
      })
      fetchSavedHunts()
    } catch (error) {
      console.error("Failed to save hunt:", error)
    }
  }

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-cyan-400">Threat Hunting Console</h1>
            <p className="text-muted-foreground">Query security events and hunt for threats</p>
          </div>

          <Card className="mb-6 border-cyan-500/30">
            <CardHeader>
              <CardTitle className="text-cyan-400">Query Builder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="src_ip:185.* AND event_type:login_failure"
                  className="flex-1 font-mono"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isSearching} className="bg-cyan-500 hover:bg-cyan-600">
                  <Search className="mr-2 h-4 w-4" />
                  {isSearching ? "Searching..." : "Hunt"}
                </Button>
                <Button onClick={handleSaveHunt} variant="outline" disabled={!query.trim()}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>

              <div className="flex gap-2 text-xs text-muted-foreground">
                <span className="rounded bg-muted px-2 py-1">Example: src_ip:185.*</span>
                <span className="rounded bg-muted px-2 py-1">event_type:login_failure</span>
                <span className="rounded bg-muted px-2 py-1">severity:critical</span>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="results" className="space-y-4">
            <TabsList>
              <TabsTrigger value="results">Results ({results.length})</TabsTrigger>
              <TabsTrigger value="saved">Saved Hunts ({savedHunts.length})</TabsTrigger>
              <TabsTrigger value="rules">YARA/Sigma Rules</TabsTrigger>
            </TabsList>

            <TabsContent value="results">
              <Card>
                <CardContent className="p-6">
                  {results.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground">
                      <Search className="mx-auto mb-4 h-12 w-12 opacity-50" />
                      <p>No results yet. Enter a query and click Hunt to start.</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {results.map((result, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent/50"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm text-cyan-400">{result.event_type}</span>
                              <span className="text-xs text-muted-foreground">{result.timestamp}</span>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">{result.details}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-2">
                    {savedHunts.map((hunt) => (
                      <div
                        key={hunt.id}
                        className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent/50"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-cyan-400">{hunt.name}</h4>
                          <p className="mt-1 font-mono text-xs text-muted-foreground">{hunt.query}</p>
                          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Last run: {hunt.last_run || "Never"}
                            </span>
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {hunt.results_count || 0} results
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => setQuery(hunt.query)}>
                            <Play className="mr-1 h-3 w-3" />
                            Run
                          </Button>
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rules">
              <Card>
                <CardHeader>
                  <CardTitle>YARA/Sigma Rule Editor</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea placeholder="Enter YARA or Sigma rule..." className="min-h-[300px] font-mono text-sm" />
                  <div className="mt-4 flex gap-2">
                    <Button className="bg-cyan-500 hover:bg-cyan-600">
                      <Code className="mr-2 h-4 w-4" />
                      Validate Rule
                    </Button>
                    <Button variant="outline">
                      <Save className="mr-2 h-4 w-4" />
                      Save Rule
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Export to Playbook
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
