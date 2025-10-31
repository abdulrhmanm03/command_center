"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, RefreshCw, XCircle, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface Certificate {
  id: string
  domain: string
  issuer: string
  expiryDate: string
  status: string
  riskScore: number
  autoRenew: boolean
  algorithm: string
  san: string[]
}

interface CertificateManagementTableProps {
  data: Certificate[]
  onRenew: (id: string) => void
  onRevoke: (id: string) => void
}

export function CertificateManagementTable({ data, onRenew, onRevoke }: CertificateManagementTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "bg-green-500/20 text-green-400 border-green-500/50"
      case "expiring":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
      case "expired":
        return "bg-red-500/20 text-red-400 border-red-500/50"
      case "revoked":
        return "bg-gray-500/20 text-gray-400 border-gray-500/50"
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/50"
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-400"
    if (score >= 40) return "text-yellow-400"
    return "text-green-400"
  }

  const getDaysUntilExpiry = (expiryDate: string) => {
    const days = Math.floor((new Date(expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    if (days < 0) return `Expired ${Math.abs(days)}d ago`
    return `${days} days`
  }

  return (
    <div className="rounded-md border border-slate-700">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700 hover:bg-slate-800/50">
            <TableHead className="w-12"></TableHead>
            <TableHead className="text-gray-300">Domain/Asset</TableHead>
            <TableHead className="text-gray-300">Issuer</TableHead>
            <TableHead className="text-gray-300">Expiry</TableHead>
            <TableHead className="text-gray-300">Status</TableHead>
            <TableHead className="text-gray-300">Risk Score</TableHead>
            <TableHead className="text-gray-300">Auto-Renew</TableHead>
            <TableHead className="text-right text-gray-300">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((cert) => (
            <>
              <TableRow key={cert.id} className="border-slate-700 hover:bg-slate-800/50">
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => setExpandedRow(expandedRow === cert.id ? null : cert.id)}
                  >
                    {expandedRow === cert.id ? (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="font-medium text-cyan-400">{cert.domain}</TableCell>
                <TableCell className="text-gray-300">{cert.issuer}</TableCell>
                <TableCell className="text-gray-300">
                  <div className="flex flex-col">
                    <span>{new Date(cert.expiryDate).toLocaleDateString()}</span>
                    <span className="text-xs text-gray-500">{getDaysUntilExpiry(cert.expiryDate)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("capitalize", getStatusColor(cert.status))}>
                    {cert.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={cn("font-bold", getRiskColor(cert.riskScore))}>{cert.riskScore}</span>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      cert.autoRenew ? "border-green-500/50 text-green-400" : "border-gray-500/50 text-gray-400"
                    }
                  >
                    {cert.autoRenew ? "Enabled" : "Disabled"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10 bg-transparent"
                      onClick={() => onRenew(cert.id)}
                      disabled={cert.status === "valid" && cert.riskScore < 50}
                    >
                      <RefreshCw className="mr-1 h-3 w-3" />
                      Renew
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent"
                      onClick={() => onRevoke(cert.id)}
                    >
                      <XCircle className="mr-1 h-3 w-3" />
                      Revoke
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
              {expandedRow === cert.id && (
                <TableRow className="border-slate-700 bg-slate-900/50">
                  <TableCell colSpan={8} className="p-4">
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-gray-400">Algorithm:</span>
                          <span className="ml-2 text-gray-300">{cert.algorithm}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Certificate ID:</span>
                          <span className="ml-2 font-mono text-xs text-gray-300">{cert.id}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400">Subject Alternative Names (SAN):</span>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {cert.san.map((name, idx) => (
                            <Badge key={idx} variant="outline" className="border-slate-600 text-gray-300">
                              {name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="border-slate-600 text-gray-300 bg-transparent">
                          <Eye className="mr-1 h-3 w-3" />
                          View Chain
                        </Button>
                        <Button variant="outline" size="sm" className="border-slate-600 text-gray-300 bg-transparent">
                          Download PEM
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
