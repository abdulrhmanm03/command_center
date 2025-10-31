"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Filter } from "lucide-react"
import { useState, useEffect } from "react"

const authEvents = [
  // Okta events
  { name: "Sign in Failed - Invalid Credentials", value: 269, provider: "Okta" },
  { name: "Active Directory authentication failed: bad username or password", value: 244, provider: "AD" },
  { name: "Sign in Failed - User is currently locked out", value: 226, provider: "Okta" },
  { name: "Sign in Failed - User not activated", value: 97, provider: "Okta" },
  { name: "User provisioned to app", value: 18, provider: "Okta" },
  // Azure AD events
  { name: "Azure AD - MFA Challenge Failed", value: 187, provider: "Azure AD" },
  { name: "Azure AD - Conditional Access Policy Blocked", value: 156, provider: "Azure AD" },
  { name: "Azure AD - Password Reset Requested", value: 134, provider: "Azure AD" },
  { name: "Azure AD - Risky Sign-in Detected", value: 98, provider: "Azure AD" },
  { name: "Azure AD - Token Refresh Failed", value: 76, provider: "Azure AD" },
  // Google Workspace events
  { name: "Google - Suspicious Login Blocked", value: 203, provider: "Google" },
  { name: "Google - 2FA Verification Failed", value: 178, provider: "Google" },
  { name: "Google - Account Recovery Attempt", value: 145, provider: "Google" },
  { name: "Google - OAuth Token Revoked", value: 112, provider: "Google" },
  { name: "Google - Admin Console Access", value: 89, provider: "Google" },
  // AWS IAM events
  { name: "AWS - Access Key Authentication Failed", value: 234, provider: "AWS" },
  { name: "AWS - MFA Device Not Found", value: 198, provider: "AWS" },
  { name: "AWS - Root Account Login Detected", value: 167, provider: "AWS" },
  { name: "AWS - IAM Role Assumption Failed", value: 143, provider: "AWS" },
  { name: "AWS - Session Token Expired", value: 121, provider: "AWS" },
  // Duo Security events
  { name: "Duo - Push Notification Denied", value: 189, provider: "Duo" },
  { name: "Duo - Bypass Code Used", value: 156, provider: "Duo" },
  { name: "Duo - Device Not Trusted", value: 134, provider: "Duo" },
  { name: "Duo - Authentication Timeout", value: 109, provider: "Duo" },
  { name: "Duo - Fraud Alert Triggered", value: 87, provider: "Duo" },
  // Auth0 events
  { name: "Auth0 - Brute Force Protection Triggered", value: 212, provider: "Auth0" },
  { name: "Auth0 - Social Login Failed", value: 176, provider: "Auth0" },
  { name: "Auth0 - Passwordless Login Attempt", value: 154, provider: "Auth0" },
  { name: "Auth0 - API Authorization Failed", value: 128, provider: "Auth0" },
  { name: "Auth0 - User Blocked", value: 95, provider: "Auth0" },
  // OneLogin events
  { name: "OneLogin - SAML Assertion Failed", value: 198, provider: "OneLogin" },
  { name: "OneLogin - Smart Factor Challenge", value: 167, provider: "OneLogin" },
  { name: "OneLogin - Session Expired", value: 143, provider: "OneLogin" },
  { name: "OneLogin - IP Whitelist Violation", value: 119, provider: "OneLogin" },
  { name: "OneLogin - User Deprovisioned", value: 92, provider: "OneLogin" },
  // Ping Identity events
  { name: "Ping - Federation Authentication Failed", value: 201, provider: "Ping" },
  { name: "Ping - Adaptive Authentication Triggered", value: 178, provider: "Ping" },
  { name: "Ping - Certificate Validation Failed", value: 156, provider: "Ping" },
  { name: "Ping - SSO Session Terminated", value: 132, provider: "Ping" },
  { name: "Ping - Risk Score Exceeded Threshold", value: 108, provider: "Ping" },
  // UAE Pass events
  { name: "UAE Pass - Emirates ID Verification Failed", value: 215, provider: "UAE Pass" },
  { name: "UAE Pass - Government Portal Access Denied", value: 189, provider: "UAE Pass" },
  { name: "UAE Pass - Digital Signature Validation Error", value: 167, provider: "UAE Pass" },
  { name: "UAE Pass - Smart Card Authentication Failed", value: 143, provider: "UAE Pass" },
  { name: "UAE Pass - Biometric Verification Timeout", value: 121, provider: "UAE Pass" },
  { name: "UAE Pass - Critical Infrastructure Access", value: 98, provider: "UAE Pass" },
]

export function TopSubject() {
  const [data, setData] = useState(authEvents.slice(0, 10))
  const [updateCount, setUpdateCount] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateCount((prev) => {
        const next = prev + 1
        // Shuffle and select 10 random events
        const shuffled = [...authEvents].sort(() => Math.random() - 0.5)
        const selected = shuffled.slice(0, 10).map((event) => ({
          ...event,
          // Add slight random variation to values for real-time effect
          value: event.value + Math.floor(Math.random() * 20) - 10,
        }))
        setData(selected)
        return next
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-border/40 bg-[#1a1a1a]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span>Top Subject</span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Last 9h 7m</span>
            <Filter className="h-3 w-3 text-muted-foreground" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="horizontal" margin={{ left: 0, right: 0 }}>
            <XAxis type="number" stroke="#666" tick={{ fontSize: 10 }} />
            <YAxis type="category" dataKey="name" width={0} />
            <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-2 space-y-1 text-xs">
          {data.slice(0, 5).map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate text-muted-foreground">{item.name}</span>
                <span className="shrink-0 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-400">
                  {item.provider}
                </span>
              </div>
              <span className="shrink-0 font-medium text-foreground">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
