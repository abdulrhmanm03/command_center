"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Download, Clock, Eye, Star, TrendingUp, Users } from "lucide-react"

interface KnowledgeArticleCardProps {
  article: {
    id: number
    title: string
    description: string
    category: string
    type: string
    author: string
    authorRole: string
    updatedAt: string
    views: number
    readTime: number
    tags: string[]
    trending: boolean
    featured: boolean
    rating: number
    contributors: number
  }
  onRead: () => void
  onExport: () => void
}

export function KnowledgeArticleCard({ article, onRead, onExport }: KnowledgeArticleCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Procedures":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30"
      case "Articles":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      case "Threat Profiles":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Guide":
        return "bg-blue-500/20 text-blue-400"
      case "Workflow":
        return "bg-green-500/20 text-green-400"
      case "Checklist":
        return "bg-yellow-500/20 text-yellow-400"
      case "Analysis":
        return "bg-red-500/20 text-red-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <Card className="group border-border/50 bg-card/50 transition-all hover:border-cyan-500/30 hover:bg-card/80 hover:shadow-lg hover:shadow-cyan-500/10">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20">
                <BookOpen className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400">{article.title}</h3>
                  {article.featured && (
                    <Badge variant="outline" className="border-yellow-500/50 bg-yellow-500/10 text-yellow-400">
                      Featured
                    </Badge>
                  )}
                  {article.trending && (
                    <Badge variant="outline" className="border-orange-500/50 bg-orange-500/10 text-orange-400">
                      <TrendingUp className="mr-1 h-3 w-3" />
                      Trending
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400 line-clamp-2">{article.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500" />
                <div>
                  <p className="font-medium text-gray-300">{article.author}</p>
                  <p className="text-[10px]">{article.authorRole}</p>
                </div>
              </div>
              <div className="h-4 w-px bg-border" />
              <span>Updated {article.updatedAt}</span>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{article.views} views</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{article.readTime} min read</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-yellow-400">{article.rating}</span>
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{article.contributors} contributors</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className={getCategoryColor(article.category)}>
                {article.category}
              </Badge>
              <Badge variant="outline" className={getTypeColor(article.type)}>
                {article.type}
              </Badge>
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-gray-800 text-gray-300">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-2">
            <Button size="sm" onClick={onRead} className="bg-cyan-500 text-black hover:bg-cyan-400">
              <BookOpen className="mr-2 h-4 w-4" />
              Read
            </Button>
            <Button size="sm" variant="outline" onClick={onExport} className="border-gray-700 bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
