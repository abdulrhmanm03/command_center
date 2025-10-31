"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { AuthWorldMap } from "@/components/auth-world-map"
import { TopMPERules } from "@/components/top-mpe-rules"
import { TopIPOrigin } from "@/components/top-ip-origin"
import { TopClassification } from "@/components/top-classification"
import { TopLocationOrigin } from "@/components/top-location-origin"
import { TopUserImpacted } from "@/components/top-user-impacted"
import { TopUserOrigin } from "@/components/top-user-origin"
import { TopCommonEvent } from "@/components/top-common-event"
import { TopObject } from "@/components/top-object"
import { TopSubject } from "@/components/top-subject"
import { TopURL } from "@/components/top-url"
import { TopCommand } from "@/components/top-command"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"
import { useState } from "react"

const authProviders = [
  "API - Okta Event",
  "API - Azure AD",
  "API - Google Workspace",
  "API - AWS IAM",
  "API - Duo Security",
  "API - Auth0",
  "API - OneLogin",
  "API - Ping Identity",
  "API - UAE Pass",
]

export default function AuthActivityPage() {
  const [currentProvider, setCurrentProvider] = useState(authProviders[0])

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Authentication Provider:</span>
              <Select value={currentProvider} onValueChange={setCurrentProvider}>
                <SelectTrigger className="w-[240px] border-border/40 bg-[#1a1a1a]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {authProviders.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-6">
            {/* World Map - Full Width */}
            <AuthWorldMap />

            <div className="grid grid-cols-4 gap-4">
              <TopMPERules />
              <TopCommonEvent />
              <TopUserImpacted />
              <TopIPOrigin />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <TopClassification />
              <TopLocationOrigin />
              <TopUserOrigin />
              <TopObject />
            </div>

            <div className="grid grid-cols-4 gap-4">
              <TopSubject />
              <TopURL />
              <TopCommand />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
