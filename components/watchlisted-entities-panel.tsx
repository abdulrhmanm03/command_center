"use client"

import { useState, useEffect } from "react"
import { Users, Database } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface Entity {
  id: string
  identifier: string
  type: "Privileged Users" | "Entity Metadata"
  resources?: string
  icon: "users" | "database"
}

export function WatchlistedEntitiesPanel() {
  const [entities, setEntities] = useState<Entity[]>([])

  useEffect(() => {
    const generateEntities = (): Entity[] => {
      return [
        { id: "1", identifier: "1008", type: "Privileged Users", resources: "Users :", icon: "users" },
        { id: "2", identifier: "1694", type: "Privileged Users", resources: "Users :", icon: "users" },
        { id: "3", identifier: "DALGDC8132", type: "Entity Metadata", resources: "Resources :", icon: "database" },
        { id: "4", identifier: "DALGDC9260", type: "Entity Metadata", resources: "Resources :", icon: "database" },
      ]
    }

    setEntities(generateEntities())
  }, [])

  return (
    <div className="space-y-3">
      {entities.map((entity) => (
        <div
          key={entity.id}
          className="flex items-center justify-between p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 hover:bg-cyan-500/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              {entity.icon === "users" ? (
                <Users className="h-5 w-5 text-cyan-400" />
              ) : (
                <Database className="h-5 w-5 text-cyan-400" />
              )}
            </div>
            <div>
              <h4 className="font-semibold text-sm text-cyan-400">{entity.identifier}</h4>
              {entity.resources && <p className="text-xs text-muted-foreground">{entity.resources}</p>}
            </div>
          </div>
          <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-xs">
            {entity.type}
          </Badge>
        </div>
      ))}
      <div className="text-xs text-muted-foreground text-center pt-2">SHOWING {entities.length} OF 35 RECORDS</div>
    </div>
  )
}
