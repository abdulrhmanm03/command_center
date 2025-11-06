"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertTriangle,
  Shield,
  Brain,
  TrendingUp,
  Filter,
  X,
  Download,
  Eye,
  ChevronRight,
  Target,
  FileText,
  AlertCircle,
  Award,
  Bug,
  Activity,
  CheckCircle2,
  Server,
  Layers,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
} from "lucide-react"
import { useState } from "react"
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useRouter } from "next/navigation" // Added import
import { risks } from "@/lib/risk-data" // Import risks from shared data file

const assets = [
  {
    id: "asset-001",
    name: "GPT-4 Turbo API Gateway",
    type: "LLM API",
    category: "SaaS LLM Service",
    nist_categorization: { confidentiality: "High", integrity: "High", availability: "Moderate" },
    overall_impact: "High",
    risk_count: 1,
    status: "Active",
  },
  {
    id: "asset-002",
    name: "Internal LLM Fine-Tuning Pipeline",
    type: "ML Pipeline",
    category: "Data Processing",
    nist_categorization: { confidentiality: "High", integrity: "High", availability: "High" },
    overall_impact: "High",
    risk_count: 1,
    status: "Active",
  },
  {
    id: "asset-003",
    name: "Internal Customer Service LLM v2.1",
    type: "LLM Model",
    category: "Internal LLM",
    nist_categorization: { confidentiality: "Moderate", integrity: "High", availability: "High" },
    overall_impact: "Moderate",
    risk_count: 1,
    status: "Active",
  },
  {
    id: "asset-004",
    name: "Claude 3.5 Sonnet Fine-Tuned Model",
    type: "LLM Model",
    category: "Internal LLM",
    nist_categorization: { confidentiality: "High", integrity: "High", availability: "Moderate" },
    overall_impact: "High",
    risk_count: 1,
    status: "Active",
  },
  {
    id: "asset-005",
    name: "GPT-4 Customer Support Chatbot",
    type: "LLM Application",
    category: "Customer-Facing Application",
    nist_categorization: { confidentiality: "High", integrity: "High", availability: "High" },
    overall_impact: "High",
    risk_count: 1,
    status: "Active",
  },
  {
    id: "asset-006",
    name: "Hugging Face Model Repository",
    type: "Model Supply Chain",
    category: "External Dependency",
    nist_categorization: { confidentiality: "Moderate", integrity: "High", availability: "Moderate" },
    overall_impact: "Moderate",
    risk_count: 1,
    status: "Active",
  },
]

// const risks = [ ... ] - REMOVED

// Changed function name from RiskScoringPage to LLMRiskScoringPage
export default function LLMRiskScoringPage() {
  const router = useRouter() // useRouter hook added
  // Changed activeTab type to be more specific
  const [activeTab, setActiveTab] = useState<"overview" | "assets" | "actions">("overview")
  const [viewMode, setViewMode] = useState<"inherent" | "residual">("inherent")
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>("all")
  const [threatSourceFilter, setThreatSourceFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedCell, setSelectedCell] = useState<{ likelihood: number; impact: number } | null>(null)
  const [selectedRisk, setSelectedRisk] = useState<(typeof risks)[0] | null>(null)
  const [showCellModal, setShowCellModal] = useState(false)
  const [showRiskModal, setShowRiskModal] = useState(false)
  const [showAssetModal, setShowAssetModal] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<(typeof assets)[0] | null>(null)
  const [decisionAction, setDecisionAction] = useState<string>("")
  const [decisionNotes, setDecisionNotes] = useState<string>("")

  const getHeatmapData = () => {
    const buckets: Record<string, { count: number; risk_ids: string[] }> = {}

    filteredRisks.forEach((risk) => {
      const likelihood = viewMode === "inherent" ? risk.likelihood : risk.residual_likelihood
      const impact = viewMode === "inherent" ? risk.impact : risk.residual_impact
      const key = `${likelihood}-${impact}`

      if (!buckets[key]) {
        buckets[key] = { count: 0, risk_ids: [] }
      }
      buckets[key].count++
      buckets[key].risk_ids.push(risk.id)
    })

    return buckets
  }

  const filteredRisks = risks.filter((risk) => {
    if (assetTypeFilter !== "all" && risk.asset.type !== assetTypeFilter) return false
    if (threatSourceFilter !== "all" && risk.threat_source !== threatSourceFilter) return false
    if (statusFilter !== "all" && risk.status !== statusFilter) return false
    return true
  })

  const heatmapData = getHeatmapData()

  const riskCounts = {
    critical: filteredRisks.filter((r) => (viewMode === "inherent" ? r.inherent_score >= 90 : r.residual_score >= 90))
      .length,
    high: filteredRisks.filter((r) => {
      const score = viewMode === "inherent" ? r.inherent_score : r.residual_score
      return score >= 70 && score < 90
    }).length,
    medium: filteredRisks.filter((r) => {
      const score = viewMode === "inherent" ? r.inherent_score : r.residual_score
      return score >= 40 && score < 70
    }).length,
    low: filteredRisks.filter((r) => {
      const score = viewMode === "inherent" ? r.inherent_score : r.residual_score
      return score < 40
    }).length,
  }

  const totalRisks = riskCounts.critical + riskCounts.high + riskCounts.medium + riskCounts.low

  const getCellColor = (likelihood: number, impact: number) => {
    const score = likelihood * impact * 4
    if (score >= 90) return "bg-red-500/80 border-red-500 hover:bg-red-500"
    if (score >= 70) return "bg-orange-500/80 border-orange-500 hover:bg-orange-500"
    if (score >= 40) return "bg-yellow-500/80 border-yellow-500 hover:bg-yellow-500"
    return "bg-green-500/80 border-green-500 hover:bg-green-500"
  }

  const handleCellClick = (likelihood: number, impact: number) => {
    setSelectedCell({ likelihood, impact })
    setShowCellModal(true)
  }

  const getCellRisks = (likelihood: number, impact: number) => {
    return filteredRisks.filter((risk) => {
      const l = viewMode === "inherent" ? risk.likelihood : risk.residual_likelihood
      const i = viewMode === "inherent" ? risk.impact : risk.residual_impact
      return l === likelihood && i === impact
    })
  }

  const handleExport = () => {
    const timestamp = new Date().toISOString().split("T")[0]
    const csvContent = [
      [
        "ID",
        "Title",
        "Asset",
        "Asset Type",
        "Threat Event",
        "Threat Source",
        "Likelihood",
        "Impact",
        "Inherent Score",
        "Residual Score",
        "Status",
        "Owner",
      ].join(","),
      ...filteredRisks.map((risk) =>
        [
          risk.id,
          `"${risk.title}"`,
          `"${risk.asset.name}"`,
          risk.asset.type,
          `"${risk.threat_event}"`,
          risk.threat_source,
          risk.likelihood,
          risk.impact,
          risk.inherent_score,
          risk.residual_score,
          risk.status,
          `"${risk.owner}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `llm-risk-register-${timestamp}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleGenerateReport = () => {
    const timestamp = new Date().toISOString().split("T")[0]
    const reportWindow = window.open("", "_blank")

    if (!reportWindow) {
      alert("Please allow pop-ups to generate the report")
      return
    }

    const reportHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>LLM Risk Assessment Report - ${timestamp}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: white;
      padding: 40px;
      max-width: 1200px;
      margin: 0 auto;
    }
    .header {
      background: linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #06b6d4 100%);
      color: white;
      padding: 40px;
      border-radius: 12px;
      margin-bottom: 40px;
      text-align: center;
    }
    .header h1 { font-size: 36px; margin-bottom: 10px; }
    .header p { font-size: 18px; opacity: 0.9; }
    .section {
      margin-bottom: 40px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 24px;
      font-weight: bold;
      color: #8b5cf6;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 3px solid #8b5cf6;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 30px;
    }
    .metric-card {
      background: #f8f9fa;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }
    .metric-label {
      font-size: 14px;
      color: #6c757d;
      text-transform: uppercase;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .metric-value {
      font-size: 36px;
      font-weight: bold;
      color: #1a1a1a;
    }
    .metric-value.critical { color: #dc2626; }
    .metric-value.high { color: #f97316; }
    .metric-value.medium { color: #eab308; }
    .metric-value.low { color: #22c55e; }
    .heatmap-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 4px;
      margin: 20px 0;
    }
    .heatmap-table th, .heatmap-table td {
      padding: 20px;
      text-align: center;
      font-weight: bold;
      border: 2px solid white;
    }
    .heatmap-table th {
      background: #f8f9fa;
      color: #6c757d;
      font-size: 12px;
      text-transform: uppercase;
    }
    .heatmap-cell {
      font-size: 24px;
      color: white;
      position: relative;
    }
    .risk-critical { background: #dc2626; }
    .risk-high { background: #f97316; }
    .risk-medium { background: #eab308; color: #1a1a1a; }
    .risk-low { background: #22c55e; }
    .risk-list {
      list-style: none;
    }
    .risk-item {
      background: #f8f9fa;
      border-left: 4px solid #8b5cf6;
      padding: 20px;
      margin-bottom: 15px;
      border-radius: 4px;
    }
    .risk-item-header {
      display: flex;
      justify-content: space-between;
      align-items: start;
      margin-bottom: 10px;
    }
    .risk-title {
      font-size: 18px;
      font-weight: bold;
      color: #1a1a1a;
      flex: 1;
    }
    .risk-score {
      font-size: 24px;
      font-weight: bold;
      padding: 8px 16px;
      border-radius: 6px;
      margin-left: 20px;
    }
    .risk-score.critical { background: #dc2626; color: white; }
    .risk-score.high { background: #f97316; color: white; }
    .risk-score.medium { background: #eab308; color: #1a1a1a; }
    .risk-details {
      font-size: 14px;
      color: #6c757d;
      margin-top: 8px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 600;
      margin-right: 8px;
      margin-top: 8px;
    }
    .badge-secondary { background: #e9ecef; color: #495057; }
    .asset-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .asset-table th, .asset-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e9ecef;
    }
    .asset-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
      text-transform: uppercase;
      font-size: 12px;
    }
    .footer {
      margin-top: 60px;
      padding-top: 20px;
      border-top: 2px solid #e9ecef;
      text-align: center;
      color: #6c757d;
      font-size: 14px;
    }
    .legend {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin: 20px 0;
      flex-wrap: wrap;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .legend-color {
      width: 30px;
      height: 30px;
      border-radius: 4px;
      border: 2px solid white;
    }
    @media print {
      body { padding: 20px; }
      .section { page-break-inside: avoid; }
      .no-print { display: none; }
    }
    .print-button {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #8b5cf6;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      z-index: 1000;
    }
    .print-button:hover {
      background: #7c3aed;
    }
  </style>
</head>
<body>
  <button class="print-button no-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
  
  <div class="header">
    <h1>LLM Risk Assessment Report</h1>
    <p>Comprehensive Risk Analysis & NIST 800-30 Assessment</p>
    <p style="margin-top: 10px; font-size: 16px;">Generated: ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}</p>
  </div>

  <div class="section">
    <h2 class="section-title">Executive Summary</h2>
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Total Risks</div>
        <div class="metric-value">${totalRisks}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Critical</div>
        <div class="metric-value critical">${riskCounts.critical}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">High</div>
        <div class="metric-value high">${riskCounts.high}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Medium</div>
        <div class="metric-value medium">${riskCounts.medium}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Low</div>
        <div class="metric-value low">${riskCounts.low}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Alert Level</div>
        <div class="metric-value ${alertLevel.color}">${alertLevel.level}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Maturity Grade</div>
        <div class="metric-value ${maturityRating.color}">${maturityRating.grade}</div>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Impact × Likelihood Risk Heatmap (${viewMode === "inherent" ? "Inherent" : "Residual"})</h2>
    <table class="heatmap-table">
      <thead>
        <tr>
          <th></th>
          <th>Very Low (1)</th>
          <th>Low (2)</th>
          <th>Moderate (3)</th>
          <th>High (4)</th>
          <th>Very High (5)</th>
        </tr>
      </thead>
      <tbody>
        ${[5, 4, 3, 2, 1]
          .map(
            (impact) => `
          <tr>
            <th>${impact === 5 ? "Severe" : impact === 4 ? "Major" : impact === 3 ? "Moderate" : impact === 2 ? "Minor" : "Negligible"} (${impact})</th>
            ${[1, 2, 3, 4, 5]
              .map((likelihood) => {
                const key = `${likelihood}-${impact}`
                const bucket = heatmapData[key]
                const count = bucket?.count || 0
                const score = likelihood * impact * 4
                let cellClass = "risk-low"
                if (score >= 90) cellClass = "risk-critical"
                else if (score >= 70) cellClass = "risk-high"
                else if (score >= 40) cellClass = "risk-medium"
                return `<td class="heatmap-cell ${cellClass}">${count}</td>`
              })
              .join("")}
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
    <div class="legend">
      <div class="legend-item">
        <div class="legend-color" style="background: #22c55e;"></div>
        <span>Low (0-39)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #eab308;"></div>
        <span>Medium (40-69)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #f97316;"></div>
        <span>High (70-89)</span>
      </div>
      <div class="legend-item">
        <div class="legend-color" style="background: #dc2626;"></div>
        <span>Critical (90-100)</span>
      </div>
    </div>
  </div>

  <div class="section">
    <h2 class="section-title">Top 5 Open Risks</h2>
    <ul class="risk-list">
      ${topRisks
        .map((risk) => {
          const score = viewMode === "inherent" ? risk.inherent_score : risk.residual_score
          let scoreClass = "low"
          if (score >= 90) scoreClass = "critical"
          else if (score >= 70) scoreClass = "high"
          else if (score >= 40) scoreClass = "medium"

          return `
          <li class="risk-item">
            <div class="risk-item-header">
              <div class="risk-title">${risk.title}</div>
              <div class="risk-score ${scoreClass}">${score}</div>
            </div>
            <div class="risk-details">
              <strong>Asset:</strong> ${risk.asset.name}<br>
              <strong>Threat Event:</strong> ${risk.threat_event}<br>
              <strong>Threat Source:</strong> ${risk.threat_source}<br>
              <strong>Owner:</strong> ${risk.owner}
            </div>
            <div>
              <span class="badge badge-secondary">${risk.asset.type}</span>
              <span class="badge badge-secondary">${risk.status}</span>
              <span class="badge badge-secondary">L:${viewMode === "inherent" ? risk.likelihood : risk.residual_likelihood} × I:${viewMode === "inherent" ? risk.impact : risk.residual_impact}</span>
            </div>
          </li>
        `
        })
        .join("")}
    </ul>
  </div>

  <div class="section">
    <h2 class="section-title">LLM Asset Inventory</h2>
    <table class="asset-table">
      <thead>
        <tr>
          <th>Asset Name</th>
          <th>Type</th>
          <th>Category</th>
          <th>Impact</th>
          <th>Confidentiality</th>
          <th>Integrity</th>
          <th>Availability</th>
          <th>Risks</th>
        </tr>
      </thead>
      <tbody>
        ${assets
          .map(
            (asset) => `
          <tr>
            <td><strong>${asset.name}</strong></td>
            <td>${asset.type}</td>
            <td>${asset.category}</td>
            <td><span class="badge ${asset.overall_impact === "High" ? "risk-high" : "risk-medium"}" style="color: white;">${asset.overall_impact}</span></td>
            <td>${asset.nist_categorization.confidentiality}</td>
            <td>${asset.nist_categorization.integrity}</td>
            <td>${asset.nist_categorization.availability}</td>
            <td><strong>${asset.risk_count}</strong></td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  </div>

  <div class="section">
    <h2 class="section-title">Risk Susceptibility Analysis</h2>
    <p style="margin-bottom: 20px;">Top recurring risk themes across the organization:</p>
    <ul class="risk-list">
      ${susceptibilityData
        .map(
          (item) => `
        <li class="risk-item">
          <div class="risk-item-header">
            <div class="risk-title">${item.theme}</div>
            <div class="risk-score medium">${item.count}</div>
          </div>
          <div class="risk-details">Occurrences across assessed risks</div>
        </li>
      `,
        )
        .join("")}
    </ul>
  </div>

  <div class="section">
    <h2 class="section-title">Key Recommendations</h2>
    <ul class="risk-list">
      ${topRisks
        .slice(0, 3)
        .map(
          (risk) => `
        <li class="risk-item">
          <div class="risk-title">${risk.title}</div>
          <div class="risk-details" style="margin-top: 12px;">
            ${risk.recommendations
              .map(
                (rec) => `
              <p style="margin-bottom: 12px;"><strong>•</strong> ${rec.text}</p>
              <p style="margin-left: 20px; margin-bottom: 8px; font-size: 13px;">
                <strong>NIST 800-53 Controls:</strong> ${rec.nist_80053.join(", ")}<br>
                <strong>Owner:</strong> ${rec.owner} | <strong>Due:</strong> ${rec.due_date}
              </p>
            `,
              )
              .join("")}
          </div>
        </li>
      `,
        )
        .join("")}
    </ul>
  </div>

  <div class="footer">
    <p><strong>LLM Risk Assessment Report</strong></p>
    <p>Generated from VTS Command Center | NIST 800-30 Risk Assessment Framework</p>
    <p>Report Date: ${timestamp} | View Mode: ${viewMode === "inherent" ? "Inherent Risk" : "Residual Risk"}</p>
    <p style="margin-top: 10px; font-size: 12px;">This report contains confidential information. Distribution should be limited to authorized personnel only.</p>
  </div>
</body>
</html>
    `

    reportWindow.document.write(reportHTML)
    reportWindow.document.close()
  }

  const trendData = [
    { month: "Jun", count: 3 },
    { month: "Jul", count: 4 },
    { month: "Aug", count: 5 },
    { month: "Sep", count: 4 },
    { month: "Oct", count: 6 },
    { month: "Nov", count: 6 },
  ]

  const getAlertLevel = () => {
    if (riskCounts.critical > 0) return { level: "Severe", color: "red" }
    if (riskCounts.high >= 3) return { level: "High", color: "orange" }
    if (riskCounts.high > 0 || riskCounts.medium >= 5) return { level: "Elevated", color: "yellow" }
    return { level: "Moderate", color: "green" }
  }

  const getMaturityRating = () => {
    const totalInherent = filteredRisks.reduce((sum, r) => sum + r.inherent_score, 0)
    const totalResidual = filteredRisks.reduce((sum, r) => sum + r.residual_score, 0)
    const reductionPercent = totalInherent > 0 ? ((totalInherent - totalResidual) / totalInherent) * 100 : 0

    if (reductionPercent >= 60) return { grade: "A+", color: "green", description: "Excellent" }
    if (reductionPercent >= 50) return { grade: "A", color: "green", description: "Strong" }
    if (reductionPercent >= 40) return { grade: "B+", color: "cyan", description: "Good" }
    if (reductionPercent >= 30) return { grade: "B", color: "yellow", description: "Adequate" }
    if (reductionPercent >= 20) return { grade: "C", color: "orange", description: "Developing" }
    return { grade: "D", color: "red", description: "Weak" }
  }

  const alertLevel = getAlertLevel()
  const maturityRating = getMaturityRating()

  const susceptibilityData = [
    { theme: "Prompt Injection", count: 5, fullMark: 5 },
    { theme: "Data Leakage", count: 4, fullMark: 5 },
    { theme: "Model Drift", count: 3, fullMark: 5 },
    { theme: "Training Data Poisoning", count: 4, fullMark: 5 },
    { theme: "Supply Chain", count: 3, fullMark: 5 },
  ]

  const topRisks = [...filteredRisks]
    .sort((a, b) => {
      const scoreA = viewMode === "inherent" ? a.inherent_score : a.residual_score
      const scoreB = viewMode === "inherent" ? b.inherent_score : b.residual_score
      return scoreB - scoreA
    })
    .slice(0, 5)

  const assetTypeDistribution = [
    { name: "LLM API", value: 1, color: "#8b5cf6" },
    { name: "LLM Model", value: 2, color: "#ec4899" },
    { name: "LLM Application", value: 1, color: "#06b6d4" },
    { name: "ML Pipeline", value: 1, color: "#f59e0b" },
    { name: "Supply Chain", value: 1, color: "#10b981" },
  ]

  const riskByAssetCategory = [
    { category: "SaaS LLM", risks: 1, critical: 1, high: 0 },
    { category: "Internal LLM", risks: 2, critical: 0, high: 2 },
    { category: "Data Processing", risks: 1, critical: 0, high: 1 },
    { category: "Customer-Facing", risks: 1, critical: 0, high: 1 },
    { category: "External Dependency", risks: 1, critical: 0, high: 0 },
  ]

  const handleDecisionSubmit = () => {
    if (selectedRisk && decisionAction) {
      console.log("[v0] Decision submitted:", {
        risk_id: selectedRisk.id,
        action: decisionAction,
        notes: decisionNotes,
      })
      // In a real app, this would update the risk status
      alert(`Decision recorded: ${decisionAction} for ${selectedRisk.title}`)
      setDecisionAction("")
      setDecisionNotes("")
    }
  }

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 p-8 border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <div className="flex items-center gap-4 mb-3">
              <div className="rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 p-4 shadow-lg shadow-purple-500/50">
                <Target className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  LLM Risk Assessment Center
                </h1>
                <p className="text-base text-cyan-300 leading-relaxed">Forward-looking risk view</p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-3 bg-purple-500/20 border-2 border-purple-500/40">
              <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500">
                <Target className="h-4 w-4 mr-2" />
                Risk Overview
              </TabsTrigger>
              <TabsTrigger value="assets" className="data-[state=active]:bg-cyan-500">
                <Server className="h-4 w-4 mr-2" />
                Asset Inventory
              </TabsTrigger>
              <TabsTrigger value="actions" className="data-[state=active]:bg-pink-500">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Risk Actions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <Card className="mb-6 border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-400 text-lg">
                    <Filter className="h-6 w-6" />
                    Filters
                  </CardTitle>
                  <CardDescription className="text-base">
                    Filter risks by asset type, threat source, or status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Asset Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Asset Types</SelectItem>
                        <SelectItem value="LLM API">LLM API</SelectItem>
                        <SelectItem value="LLM Model">LLM Model</SelectItem>
                        <SelectItem value="LLM Application">LLM Application</SelectItem>
                        <SelectItem value="ML Pipeline">ML Pipeline</SelectItem>
                        <SelectItem value="Model Supply Chain">Model Supply Chain</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={threatSourceFilter} onValueChange={setThreatSourceFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Threat Source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Threat Sources</SelectItem>
                        <SelectItem value="External Attacker">External Attacker</SelectItem>
                        <SelectItem value="Insider">Insider</SelectItem>
                        <SelectItem value="Environmental">Environmental</SelectItem>
                        <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                        <SelectItem value="Malicious Actor">Malicious Actor</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="Accepted">Accepted</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setAssetTypeFilter("all")
                        setThreatSourceFilter("all")
                        setStatusFilter("all")
                      }}
                      className="border-cyan-500/50 hover:bg-cyan-500/10"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Clear
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 lg:grid-cols-4">
                <div className="lg:col-span-3 space-y-6">
                  <div className="grid gap-4 md:grid-cols-5">
                    <Card className="border-2 border-purple-500/60 bg-gradient-to-br from-purple-600/20 to-purple-500/10 shadow-lg shadow-purple-500/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium text-purple-200">Total Risks</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-5xl font-bold text-purple-400">{totalRisks}</div>
                        <p className="text-xs text-purple-300 mt-2">Open risk items</p>
                      </CardContent>
                    </Card>

                    <Card
                      className={`border-2 border-${alertLevel.color}-500/60 bg-gradient-to-br from-${alertLevel.color}-600/20 to-${alertLevel.color}-500/10 shadow-lg shadow-${alertLevel.color}-500/20`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className={`text-sm font-medium text-${alertLevel.color}-200`}>
                            Alert Level
                          </CardTitle>
                          <AlertTriangle className={`h-6 w-6 text-${alertLevel.color}-400`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-4xl font-bold text-${alertLevel.color}-400`}>{alertLevel.level}</div>
                        <p className={`text-xs text-${alertLevel.color}-300 mt-2`}>Current posture</p>
                      </CardContent>
                    </Card>

                    <Card
                      className={`border-2 border-${maturityRating.color}-500/60 bg-gradient-to-br from-${maturityRating.color}-600/20 to-${maturityRating.color}-500/10 shadow-lg shadow-${maturityRating.color}-500/20`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className={`text-sm font-medium text-${maturityRating.color}-200`}>
                            Maturity
                          </CardTitle>
                          <Award className={`h-6 w-6 text-${maturityRating.color}-400`} />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className={`text-5xl font-bold text-${maturityRating.color}-400`}>
                          {maturityRating.grade}
                        </div>
                        <p className={`text-xs text-${maturityRating.color}-300 mt-2`}>{maturityRating.description}</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-red-500/60 bg-gradient-to-br from-red-600/20 to-red-500/10 shadow-lg shadow-red-500/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-red-200">Critical</CardTitle>
                          <AlertTriangle className="h-6 w-6 text-red-400" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-5xl font-bold text-red-400">{riskCounts.critical}</div>
                        <p className="text-xs text-red-300 mt-2">Score: 90-100</p>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-orange-500/60 bg-gradient-to-br from-orange-600/20 to-orange-500/10 shadow-lg shadow-orange-500/20">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-sm font-medium text-orange-200">High</CardTitle>
                          <TrendingUp className="h-6 w-6 text-orange-400" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="text-5xl font-bold text-orange-400">{riskCounts.high}</div>
                        <p className="text-xs text-orange-300 mt-2">Score: 70-89</p>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="border-2 border-purple-500/60 bg-gradient-to-br from-purple-600/10 to-pink-600/10 shadow-xl shadow-purple-500/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-3 text-purple-400 text-2xl">
                            <Target className="h-7 w-7" />
                            Impact × Likelihood Heatmap
                          </CardTitle>
                          <CardDescription className="text-base mt-2">
                            Click any cell to drill down into risks • Showing {viewMode} risk scores
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={viewMode === "inherent" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("inherent")}
                            className={
                              viewMode === "inherent"
                                ? "bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/50"
                                : "border-purple-500/50"
                            }
                          >
                            Inherent
                          </Button>
                          <Button
                            variant={viewMode === "residual" ? "default" : "outline"}
                            size="sm"
                            onClick={() => setViewMode("residual")}
                            className={
                              viewMode === "residual"
                                ? "bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/50"
                                : "border-cyan-500/50"
                            }
                          >
                            Residual
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={handleGenerateReport}
                            className="ml-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg shadow-purple-500/50"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Generate Report
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            className="border-purple-500/50 hover:bg-purple-500/10 bg-transparent"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-8">
                        <div className="relative bg-white/5 rounded-xl p-8 border border-white/10">
                          {/* Y-axis label - Impact */}
                          <div className="absolute -left-12 top-1/2 -translate-y-1/2 -rotate-90">
                            <div className="text-sm font-bold text-slate-400 tracking-wider uppercase whitespace-nowrap">
                              Impact
                            </div>
                          </div>

                          <div className="grid grid-cols-6 gap-0">
                            {/* Header row - Likelihood labels */}
                            <div></div>
                            {[1, 2, 3, 4, 5].map((l) => (
                              <div key={l} className="text-center pb-3">
                                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                  {l === 1
                                    ? "Very Low"
                                    : l === 2
                                      ? "Low"
                                      : l === 3
                                        ? "Moderate"
                                        : l === 4
                                          ? "High"
                                          : "Very High"}
                                </div>
                              </div>
                            ))}

                            {/* Grid rows (Impact 5 to 1, top to bottom) */}
                            {[5, 4, 3, 2, 1].map((impact) => (
                              <>
                                {/* Impact label column */}
                                <div key={`label-${impact}`} className="flex items-center justify-end pr-3">
                                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide text-right">
                                    {impact === 5
                                      ? "Severe"
                                      : impact === 4
                                        ? "Major"
                                        : impact === 3
                                          ? "Moderate"
                                          : impact === 2
                                            ? "Minor"
                                            : "Negligible"}
                                  </div>
                                </div>

                                {/* Heatmap cells */}
                                {[1, 2, 3, 4, 5].map((likelihood) => {
                                  const key = `${likelihood}-${impact}`
                                  const bucket = heatmapData[key]
                                  const count = bucket?.count || 0
                                  const score = likelihood * impact * 4

                                  // Professional color system matching reference image
                                  let bgColor = ""
                                  let textColor = "text-white"

                                  if (score >= 90) {
                                    // Critical - Bright red
                                    bgColor = "bg-red-600"
                                  } else if (score >= 80) {
                                    // High-Critical - Red-orange
                                    bgColor = "bg-red-500"
                                  } else if (score >= 70) {
                                    // High - Orange-red
                                    bgColor = "bg-orange-600"
                                  } else if (score >= 60) {
                                    // Medium-High - Orange
                                    bgColor = "bg-orange-500"
                                  } else if (score >= 50) {
                                    // Medium - Light orange
                                    bgColor = "bg-orange-400"
                                  } else if (score >= 40) {
                                    // Medium-Low - Yellow
                                    bgColor = "bg-yellow-400"
                                    textColor = "text-gray-900"
                                  } else if (score >= 30) {
                                    // Low-Medium - Light yellow
                                    bgColor = "bg-yellow-300"
                                    textColor = "text-gray-900"
                                  } else if (score >= 20) {
                                    // Low - Light green
                                    bgColor = "bg-green-400"
                                  } else if (score >= 10) {
                                    // Very Low - Medium green
                                    bgColor = "bg-green-500"
                                  } else {
                                    // Minimal - Dark green
                                    bgColor = "bg-green-700"
                                  }

                                  return (
                                    <button
                                      key={key}
                                      onClick={() => handleCellClick(likelihood, impact)}
                                      className={`relative aspect-square border-2 border-white/20 transition-all duration-200 flex items-center justify-center cursor-pointer hover:border-white/60 hover:scale-105 hover:z-10 ${bgColor}`}
                                    >
                                      {/* Risk count - prominently displayed */}
                                      <span className={`text-4xl font-bold ${textColor} drop-shadow-sm`}>{count}</span>

                                      {/* Tooltip on hover */}
                                      <div className="absolute inset-0 bg-black/90 opacity-0 hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-1 p-2">
                                        <div className="text-xs text-white/70 uppercase tracking-wide">Risk Score</div>
                                        <div className="text-2xl font-bold text-white">{score}</div>
                                        <div className="text-xs text-white/70">
                                          L:{likelihood} × I:{impact} × 4
                                        </div>
                                        <div className="text-xs text-white/70 mt-1">
                                          {count} {count === 1 ? "Risk" : "Risks"}
                                        </div>
                                      </div>
                                    </button>
                                  )
                                })}
                              </>
                            ))}
                          </div>

                          {/* X-axis label - Likelihood */}
                          <div className="text-center mt-3">
                            <div className="text-sm font-bold text-slate-400 tracking-wider uppercase">Likelihood</div>
                          </div>
                        </div>

                        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wide">
                              Risk Level Classification
                            </h4>
                            <div className="text-xs text-slate-500">Based on NIST 800-30 Risk Scoring</div>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            {/* Low Risk */}
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded bg-green-500 border-2 border-white/20 flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-green-400 uppercase">Low</div>
                                <div className="text-xs text-slate-400">Score: 0-39</div>
                              </div>
                            </div>

                            {/* Medium Risk */}
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded bg-yellow-400 border-2 border-white/20 flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-yellow-400 uppercase">Medium</div>
                                <div className="text-xs text-slate-400">Score: 40-69</div>
                              </div>
                            </div>

                            {/* High Risk */}
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded bg-orange-500 border-2 border-white/20 flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-orange-400 uppercase">High</div>
                                <div className="text-xs text-slate-400">Score: 70-89</div>
                              </div>
                            </div>

                            {/* Critical Risk */}
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded bg-red-600 border-2 border-white/20 flex-shrink-0"></div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-red-400 uppercase">Critical</div>
                                <div className="text-xs text-slate-400">Score: 90-100</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-2 border-pink-500/50 bg-gradient-to-br from-pink-600/10 to-purple-600/10 shadow-lg shadow-pink-500/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-pink-400 text-lg">
                          <Target className="h-6 w-6" />
                          Susceptibility Index
                        </CardTitle>
                        <CardDescription className="text-base mt-2">Top recurring risk themes</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={280}>
                          <RadarChart data={susceptibilityData} margin={{ top: 30, right: 60, bottom: 30, left: 60 }}>
                            <PolarGrid stroke="#666" strokeWidth={1.5} />
                            <PolarAngleAxis dataKey="theme" tick={{ fill: "#ec4899", fontSize: 10, fontWeight: 600 }} />
                            <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: "#ec4899", fontWeight: 600 }} />
                            <Radar
                              name="Risk Count"
                              dataKey="count"
                              stroke="#ec4899"
                              strokeWidth={3}
                              fill="#ec4899"
                              fillOpacity={0.7}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    <Card className="border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 shadow-lg shadow-cyan-500/20">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-cyan-400 text-lg">
                          <TrendingUp className="h-6 w-6" />
                          Risk Count Trend
                        </CardTitle>
                        <CardDescription className="text-base">Risk count over the last 6 months</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={240}>
                          <LineChart data={trendData}>
                            <XAxis
                              dataKey="month"
                              stroke="#06b6d4"
                              strokeWidth={2}
                              tick={{ fill: "#06b6d4", fontWeight: 600 }}
                            />
                            <YAxis stroke="#06b6d4" strokeWidth={2} tick={{ fill: "#06b6d4", fontWeight: 600 }} />
                            <RechartsTooltip
                              contentStyle={{
                                backgroundColor: "#1a1a1a",
                                border: "2px solid #06b6d4",
                                borderRadius: "12px",
                                boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
                              }}
                            />
                            <Line
                              type="monotone"
                              dataKey="count"
                              stroke="#06b6d4"
                              strokeWidth={4}
                              dot={{ r: 8, fill: "#06b6d4", strokeWidth: 2, stroke: "#fff" }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card className="border-2 border-orange-500/50 bg-gradient-to-br from-orange-600/10 to-red-600/10 shadow-lg shadow-orange-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-400 text-lg">
                        <AlertCircle className="h-6 w-6" />
                        Top 5 Open Risks
                      </CardTitle>
                      <CardDescription className="text-base">Highest {viewMode} scores</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {topRisks.map((risk) => {
                          const score = viewMode === "inherent" ? risk.inherent_score : risk.residual_score
                          return (
                            <div
                              key={risk.id}
                              className="p-4 rounded-xl border-2 border-border bg-background/50 hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer"
                              onClick={() => {
                                router.push(`/risk-scoring/${risk.id}`)
                              }}
                            >
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="text-sm font-semibold text-foreground line-clamp-2">{risk.title}</h4>
                                <Badge
                                  variant="outline"
                                  className={
                                    score >= 90
                                      ? "border-red-500 text-red-400 bg-red-500/20 font-bold text-base px-2 py-1"
                                      : score >= 70
                                        ? "border-orange-500 text-orange-400 bg-orange-500/20 font-bold text-base px-2 py-1"
                                        : "border-yellow-500 text-yellow-400 bg-yellow-500/20 font-bold text-base px-2 py-1"
                                  }
                                >
                                  {score}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{risk.asset.name}</p>
                              <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="text-xs">
                                  {risk.asset.type}
                                </Badge>
                                <Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-orange-500/10">
                                  View
                                  <ChevronRight className="h-3 w-3 ml-1" />
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <Dialog open={showCellModal} onOpenChange={setShowCellModal}>
                <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-purple-400 text-xl">
                      <Target className="h-6 w-6" />
                      Risks: Likelihood {selectedCell?.likelihood} × Impact {selectedCell?.impact}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      {selectedCell &&
                        `${getCellRisks(selectedCell.likelihood, selectedCell.impact).length} risk(s) in this cell`}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-3">
                    {selectedCell &&
                      getCellRisks(selectedCell.likelihood, selectedCell.impact).map((risk) => {
                        const score = viewMode === "inherent" ? risk.inherent_score : risk.residual_score
                        return (
                          <div
                            key={risk.id}
                            className="p-4 rounded-lg border-2 border-border bg-background/50 hover:border-purple-500/60 hover:shadow-lg transition-all cursor-pointer"
                            onClick={() => {
                              setSelectedRisk(risk)
                              setShowRiskModal(true)
                              setShowCellModal(false)
                            }}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h4 className="font-semibold text-cyan-400 mb-1 text-base">{risk.title}</h4>
                                <p className="text-sm text-muted-foreground">{risk.asset.name}</p>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  score >= 90
                                    ? "border-red-500 text-red-400 bg-red-500/20 font-bold text-lg px-3 py-1"
                                    : score >= 70
                                      ? "border-orange-500 text-orange-400 bg-orange-500/20 font-bold text-lg px-3 py-1"
                                      : "border-yellow-500 text-yellow-400 bg-yellow-500/20 font-bold text-lg px-3 py-1"
                                }
                              >
                                {score}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary" className="text-xs">
                                {risk.asset.type}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {risk.threat_source}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {risk.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-foreground mb-3">{risk.threat_event}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full border-purple-500/50 hover:bg-purple-500/10 bg-transparent"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Full Details
                            </Button>
                          </div>
                        )
                      })}
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showRiskModal} onOpenChange={setShowRiskModal}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  {selectedRisk && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-3 text-purple-400 text-3xl">
                          <FileText className="h-8 w-8" />
                          {selectedRisk.title}
                        </DialogTitle>
                        <DialogDescription className="text-base flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-sm">
                            {selectedRisk.id}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              selectedRisk.status === "Open"
                                ? "border-orange-500 text-orange-400 bg-orange-500/20"
                                : "border-green-500 text-green-400 bg-green-500/20"
                            }
                          >
                            {selectedRisk.status}
                          </Badge>
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        {/* Summary Section - Vertical Layout */}
                        <div className="p-6 rounded-xl bg-purple-500/10 border-2 border-purple-500/50 shadow-lg">
                          <h3 className="text-2xl font-bold text-purple-400 mb-5 flex items-center gap-3">
                            <Target className="h-7 w-7" />
                            Risk Summary (NIST 800-30)
                          </h3>
                          <div className="space-y-3">
                            <div className="p-4 rounded-lg bg-background/50 border border-border">
                              <p className="text-sm font-bold text-purple-300 mb-2">Asset</p>
                              <p className="text-lg font-semibold text-foreground">{selectedRisk.asset.name}</p>
                              <Badge variant="secondary" className="text-sm mt-2">
                                {selectedRisk.asset.type}
                              </Badge>
                            </div>
                            <div className="p-4 rounded-lg bg-background/50 border border-border">
                              <p className="text-sm font-bold text-purple-300 mb-2">Threat Source</p>
                              <p className="text-lg font-semibold text-foreground">{selectedRisk.threat_source}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-background/50 border border-border">
                              <p className="text-sm font-bold text-purple-300 mb-2">Threat Event</p>
                              <p className="text-lg font-semibold text-foreground">{selectedRisk.threat_event}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-background/50 border border-border">
                              <p className="text-sm font-bold text-purple-300 mb-2">Risk Owner</p>
                              <p className="text-lg font-semibold text-foreground">{selectedRisk.owner}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-red-500/20 border-2 border-red-500/60 shadow-md">
                              <p className="text-sm font-bold text-red-300 mb-3">Inherent Risk Score</p>
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className="border-red-500 text-red-400 text-2xl font-bold px-4 py-2"
                                >
                                  {selectedRisk.inherent_score}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  (L:{selectedRisk.likelihood} × I:{selectedRisk.impact} × 4)
                                </span>
                              </div>
                            </div>
                            <div className="p-4 rounded-xl bg-green-500/20 border-2 border-green-500/60 shadow-md">
                              <p className="text-sm font-bold text-green-300 mb-3">Residual Risk Score</p>
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="outline"
                                  className="border-green-500 text-green-400 text-2xl font-bold px-4 py-2"
                                >
                                  {selectedRisk.residual_score}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  (L:{selectedRisk.residual_likelihood} × I:{selectedRisk.residual_impact} × 4)
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* RMF Section - Vertical Layout */}
                        <div className="p-6 rounded-xl bg-indigo-500/10 border-2 border-indigo-500/50 shadow-lg">
                          <h3 className="text-2xl font-bold text-indigo-400 mb-5 flex items-center gap-3">
                            <Activity className="h-7 w-7" />
                            NIST 800-37 Risk Management Framework (RMF)
                          </h3>
                          <div className="space-y-3">
                            <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/40">
                              <p className="text-base font-bold text-indigo-300 mb-3">Current RMF Step</p>
                              <Badge
                                variant="outline"
                                className="border-indigo-500 text-indigo-400 bg-indigo-500/20 text-lg px-4 py-2 mb-3"
                              >
                                {selectedRisk.rmf_step}
                              </Badge>
                              <p className="text-base text-foreground leading-relaxed">
                                {selectedRisk.rmf_step_description}
                              </p>
                            </div>
                            <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/40">
                              <p className="text-base font-bold text-cyan-300 mb-3">Control Implementation Status</p>
                              <Badge
                                variant="outline"
                                className={
                                  selectedRisk.control_implementation_status === "Implemented"
                                    ? "border-green-500 text-green-400 bg-green-500/20 text-lg px-4 py-2"
                                    : selectedRisk.control_implementation_status === "In Progress"
                                      ? "border-yellow-500 text-yellow-400 bg-yellow-500/20 text-lg px-4 py-2"
                                      : "border-blue-500 text-blue-400 bg-blue-500/20 text-lg px-4 py-2"
                                }
                              >
                                {selectedRisk.control_implementation_status}
                              </Badge>
                            </div>
                            <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/40">
                              <p className="text-base font-bold text-purple-300 mb-3">Authorization Status</p>
                              <Badge
                                variant="outline"
                                className={
                                  selectedRisk.authorization_status === "Authorized"
                                    ? "border-green-500 text-green-400 bg-green-500/20 text-lg px-4 py-2"
                                    : selectedRisk.authorization_status === "Emergency Authorization"
                                      ? "border-red-500 text-red-400 bg-red-500/20 text-lg px-4 py-2"
                                      : selectedRisk.authorization_status === "Assessment In Progress"
                                        ? "border-yellow-500 text-yellow-400 bg-yellow-500/20 text-lg px-4 py-2"
                                        : "border-gray-500 text-gray-400 bg-gray-500/20 text-lg px-4 py-2"
                                }
                              >
                                {selectedRisk.authorization_status}
                              </Badge>
                              <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                                {selectedRisk.authorization_notes}
                              </p>
                            </div>
                            <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/40">
                              <p className="text-base font-bold text-teal-300 mb-3">Continuous Monitoring Plan</p>
                              <p className="text-base text-foreground leading-relaxed">
                                {selectedRisk.continuous_monitoring}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Vulnerabilities Section */}
                        <div className="p-6 rounded-xl bg-red-500/10 border-2 border-red-500/50 shadow-lg">
                          <h3 className="text-2xl font-bold text-red-400 mb-5 flex items-center gap-3">
                            <Bug className="h-7 w-7" />
                            Vulnerabilities & Weaknesses
                          </h3>
                          <div className="space-y-3">
                            {selectedRisk.vulnerabilities.map((vuln, idx) => (
                              <div
                                key={idx}
                                className="p-4 rounded-lg bg-red-500/10 border border-red-500/40 flex items-start gap-3"
                              >
                                <AlertCircle className="h-6 w-6 text-red-400 mt-0.5 flex-shrink-0" />
                                <p className="text-base text-foreground leading-relaxed">{vuln}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Likelihood Assessment */}
                        <div className="p-6 rounded-xl bg-orange-500/10 border-2 border-orange-500/50 shadow-lg">
                          <h3 className="text-2xl font-bold text-orange-400 mb-5 flex items-center gap-3">
                            <Activity className="h-7 w-7" />
                            Likelihood Assessment
                          </h3>
                          <div className="p-4 rounded-lg bg-background/50 border border-border">
                            <div className="flex items-center gap-3 mb-4">
                              <Badge
                                variant="outline"
                                className="border-orange-500 text-orange-400 text-2xl font-bold px-4 py-2"
                              >
                                {selectedRisk.likelihood}/5
                              </Badge>
                              <span className="text-lg font-semibold text-orange-300">
                                {selectedRisk.likelihood === 5
                                  ? "Very High"
                                  : selectedRisk.likelihood === 4
                                    ? "High"
                                    : selectedRisk.likelihood === 3
                                      ? "Moderate"
                                      : selectedRisk.likelihood === 2
                                        ? "Low"
                                        : "Very Low"}
                              </span>
                            </div>
                            <p className="text-base text-foreground leading-relaxed">
                              {selectedRisk.likelihood_assessment}
                            </p>
                          </div>
                        </div>

                        {/* Impact Assessment */}
                        <div className="p-6 rounded-xl bg-pink-500/10 border-2 border-pink-500/50 shadow-lg">
                          <h3 className="text-2xl font-bold text-pink-400 mb-5 flex items-center gap-3">
                            <AlertTriangle className="h-7 w-7" />
                            Impact Assessment
                          </h3>
                          <div className="p-4 rounded-lg bg-background/50 border border-border">
                            <div className="flex items-center gap-3 mb-4">
                              <Badge
                                variant="outline"
                                className="border-pink-500 text-pink-400 text-2xl font-bold px-4 py-2"
                              >
                                {selectedRisk.impact}/5
                              </Badge>
                              <span className="text-lg font-semibold text-pink-300">
                                {selectedRisk.impact === 5
                                  ? "Severe"
                                  : selectedRisk.impact === 4
                                    ? "Major"
                                    : selectedRisk.impact === 3
                                      ? "Moderate"
                                      : selectedRisk.impact === 2
                                        ? "Minor"
                                        : "Negligible"}
                              </span>
                            </div>
                            <p className="text-base text-foreground leading-relaxed">
                              {selectedRisk.impact_assessment}
                            </p>
                          </div>
                        </div>

                        {/* Risk Response Strategy */}
                        <div className="p-6 rounded-xl bg-yellow-500/10 border-2 border-yellow-500/50 shadow-lg">
                          <h3 className="text-2xl font-bold text-yellow-400 mb-5 flex items-center gap-3">
                            <CheckCircle2 className="h-7 w-7" />
                            Risk Response Strategy
                          </h3>
                          <div className="p-4 rounded-lg bg-background/50 border border-border">
                            <div className="flex items-center gap-3 mb-4">
                              <Badge
                                variant="outline"
                                className={
                                  selectedRisk.risk_response === "Mitigate"
                                    ? "border-yellow-500 text-yellow-400 bg-yellow-500/20 text-lg px-4 py-2"
                                    : selectedRisk.risk_response === "Accept"
                                      ? "border-green-500 text-green-400 bg-green-500/20 text-lg px-4 py-2"
                                      : "border-blue-500 text-blue-400 bg-blue-500/20 text-lg px-4 py-2"
                                }
                              >
                                {selectedRisk.risk_response}
                              </Badge>
                            </div>
                            <p className="text-base text-foreground leading-relaxed">
                              {selectedRisk.risk_response_rationale}
                            </p>
                          </div>
                        </div>

                        {/* MITRE ATT&CK Mapping */}
                        <div className="p-6 rounded-xl bg-cyan-500/10 border-2 border-cyan-500/60 shadow-lg">
                          <h3 className="text-2xl font-bold text-cyan-400 mb-5 flex items-center gap-3">
                            <Shield className="h-7 w-7" />
                            MITRE ATT&CK Mapping
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <p className="text-base font-bold text-cyan-300 mb-3">Tactics</p>
                              <div className="flex flex-wrap gap-2">
                                {selectedRisk.mitre.tactics.map((tactic) => (
                                  <Badge
                                    key={tactic}
                                    variant="outline"
                                    className="border-cyan-500 text-cyan-400 bg-cyan-500/20 text-base px-4 py-2"
                                  >
                                    {tactic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-base font-bold text-cyan-300 mb-3">Techniques</p>
                              <div className="space-y-2">
                                {selectedRisk.mitre.techniques.map((technique) => (
                                  <div
                                    key={technique.id}
                                    className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-between hover:border-cyan-500/60 transition-all"
                                  >
                                    <span className="text-base font-medium text-foreground">{technique.name}</span>
                                    <Badge
                                      variant="secondary"
                                      className="text-sm bg-cyan-500/20 text-cyan-400 border-cyan-500/60"
                                    >
                                      {technique.id}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/30">
                              <p className="text-sm font-semibold text-cyan-300 mb-2">Mapping Rationale</p>
                              <p className="text-base text-foreground italic leading-relaxed">
                                {selectedRisk.mitre.notes}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Evidence */}
                        <div className="p-6 rounded-xl bg-blue-500/10 border-2 border-blue-500/50 shadow-lg">
                          <h3 className="text-2xl font-bold text-blue-400 mb-5 flex items-center gap-3">
                            <FileText className="h-7 w-7" />
                            Supporting Evidence
                          </h3>
                          <div className="space-y-3">
                            {selectedRisk.evidence.map((ev, idx) => (
                              <div key={idx} className="p-4 rounded-lg bg-background/50 border border-border">
                                <div className="flex items-start gap-3">
                                  <Badge variant="secondary" className="text-sm mt-1">
                                    {ev.type}
                                  </Badge>
                                  <div className="flex-1">
                                    <p className="text-base font-mono text-cyan-400 mb-2">{ev.id}</p>
                                    <p className="text-base text-muted-foreground leading-relaxed">{ev.description}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Recommendations with NIST 800-53 - Vertical Layout */}
                        <div className="p-6 rounded-xl bg-green-500/10 border-2 border-green-500/60 shadow-lg">
                          <h3 className="text-2xl font-bold text-green-400 mb-5 flex items-center gap-3">
                            <Brain className="h-7 w-7" />
                            Recommendations (NIST 800-53 Controls)
                          </h3>
                          <div className="space-y-5">
                            {selectedRisk.recommendations.map((rec, idx) => (
                              <div
                                key={idx}
                                className="p-5 rounded-xl bg-green-500/10 border border-green-500/40 shadow-md"
                              >
                                <p className="text-lg text-foreground mb-5 font-medium leading-relaxed">{rec.text}</p>
                                <div className="space-y-3">
                                  <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/40">
                                    <p className="text-base font-bold text-teal-400 mb-3 flex items-center gap-2">
                                      <FileText className="h-5 w-5" />
                                      NIST 800-53 Controls
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {rec.nist_80053.map((control) => (
                                        <Badge
                                          key={control}
                                          variant="outline"
                                          className="border-teal-500 text-teal-400 bg-teal-500/20 text-base px-4 py-2 font-bold"
                                        >
                                          {control}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/40">
                                    <p className="text-base font-bold text-purple-400 mb-2">Expected Risk Reduction</p>
                                    <p className="text-base text-foreground">
                                      <span className="font-semibold text-purple-300">Likelihood:</span>{" "}
                                      {rec.expected_delta.likelihood} |
                                      <span className="font-semibold text-purple-300 ml-2">Impact:</span>{" "}
                                      {rec.expected_delta.impact}
                                    </p>
                                  </div>
                                  <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/40">
                                    <p className="text-base font-bold text-cyan-400 mb-2">Assigned Owner</p>
                                    <p className="text-base text-foreground font-medium">{rec.owner}</p>
                                  </div>
                                  <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/40">
                                    <p className="text-base font-bold text-orange-400 mb-2">Target Due Date</p>
                                    <p className="text-base text-foreground font-medium">{rec.due_date}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </TabsContent>

            <TabsContent value="assets" className="mt-6">
              <div className="space-y-6">
                <Card className="border-2 border-cyan-500/60 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 shadow-xl shadow-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-cyan-400 text-2xl">
                      <Server className="h-7 w-7" />
                      LLM Asset Inventory (NIST 800-30 Categorization)
                    </CardTitle>
                    <CardDescription className="text-base">
                      Organization's LLM/AI assets with NIST impact categorization
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {assets.map((asset) => (
                        <div
                          key={asset.id}
                          className="p-5 rounded-xl border-2 border-cyan-500/40 bg-background/50 hover:border-cyan-500/80 hover:shadow-lg hover:shadow-cyan-500/20 transition-all cursor-pointer"
                          onClick={() => {
                            setSelectedAsset(asset)
                            setShowAssetModal(true)
                          }}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-cyan-400 mb-2">{asset.name}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{asset.category}</p>
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-sm">
                                  {asset.type}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={
                                    asset.overall_impact === "High"
                                      ? "border-red-500 text-red-400 bg-red-500/20"
                                      : "border-yellow-500 text-yellow-400 bg-yellow-500/20"
                                  }
                                >
                                  {asset.overall_impact} Impact
                                </Badge>
                                <Badge variant="outline" className="border-green-500 text-green-400 bg-green-500/20">
                                  {asset.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-muted-foreground mb-1">Associated Risks</p>
                              <Badge
                                variant="outline"
                                className="border-orange-500 text-orange-400 bg-orange-500/20 text-2xl font-bold px-4 py-2"
                              >
                                {asset.risk_count}
                              </Badge>
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-3 mt-4">
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/40">
                              <p className="text-xs font-bold text-red-300 mb-1">Confidentiality</p>
                              <p className="text-sm font-semibold text-foreground">
                                {asset.nist_categorization.confidentiality}
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/40">
                              <p className="text-xs font-bold text-yellow-300 mb-1">Integrity</p>
                              <p className="text-sm font-semibold text-foreground">
                                {asset.nist_categorization.integrity}
                              </p>
                            </div>
                            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/40">
                              <p className="text-xs font-bold text-green-300 mb-1">Availability</p>
                              <p className="text-sm font-semibold text-foreground">
                                {asset.nist_categorization.availability}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="border-2 border-purple-500/50 bg-gradient-to-br from-purple-600/10 to-pink-600/10 shadow-lg shadow-purple-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-purple-400 text-lg">
                        <Layers className="h-6 w-6" />
                        Asset Type Distribution
                      </CardTitle>
                      <CardDescription className="text-base">Assets by type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={assetTypeDistribution}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) => `${name}: ${value}`}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {assetTypeDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "#1a1a1a",
                              border: "2px solid #8b5cf6",
                              borderRadius: "12px",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-orange-500/50 bg-gradient-to-br from-orange-600/10 to-red-600/10 shadow-lg shadow-orange-500/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-orange-400 text-lg">
                        <AlertTriangle className="h-6 w-6" />
                        Risks by Asset Category
                      </CardTitle>
                      <CardDescription className="text-base">Risk distribution across asset categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={riskByAssetCategory}>
                          <XAxis dataKey="category" stroke="#f97316" tick={{ fill: "#f97316", fontSize: 11 }} />
                          <YAxis stroke="#f97316" tick={{ fill: "#f97316" }} />
                          <RechartsTooltip
                            contentStyle={{
                              backgroundColor: "#1a1a1a",
                              border: "2px solid #f97316",
                              borderRadius: "12px",
                            }}
                          />
                          <Bar dataKey="critical" stackId="a" fill="#ef4444" />
                          <Bar dataKey="high" stackId="a" fill="#f97316" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="mt-6">
              <Card className="border-2 border-pink-500/60 bg-gradient-to-br from-pink-600/10 to-purple-600/10 shadow-xl shadow-pink-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-pink-400 text-2xl">
                    <CheckCircle2 className="h-7 w-7" />
                    Risk Decision & Action Center
                  </CardTitle>
                  <CardDescription className="text-base">
                    Review pending risks and make decisions on risk response actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {risks
                      .filter((r) => r.status === "Open")
                      .map((risk) => {
                        const score = viewMode === "inherent" ? risk.inherent_score : risk.residual_score
                        return (
                          <div
                            key={risk.id}
                            className="p-6 rounded-xl border-2 border-pink-500/40 bg-background/50 hover:border-pink-500/80 hover:shadow-lg hover:shadow-pink-500/20 transition-all"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-pink-400 mb-2">{risk.title}</h4>
                                <p className="text-sm text-muted-foreground mb-3">{risk.threat_event}</p>
                                <div className="flex items-center gap-2 mb-3">
                                  <Badge variant="secondary" className="text-sm">
                                    {risk.asset.name}
                                  </Badge>
                                  <Badge variant="secondary" className="text-sm">
                                    {risk.threat_source}
                                  </Badge>
                                </div>
                              </div>
                              <Badge
                                variant="outline"
                                className={
                                  score >= 90
                                    ? "border-red-500 text-red-400 bg-red-500/20 font-bold text-3xl px-5 py-3"
                                    : score >= 70
                                      ? "border-orange-500 text-orange-400 bg-orange-500/20 font-bold text-3xl px-5 py-3"
                                      : "border-yellow-500 text-yellow-400 bg-yellow-500/20 font-bold text-3xl px-5 py-3"
                                }
                              >
                                {score}
                              </Badge>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2 mb-4">
                              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/40">
                                <p className="text-sm font-bold text-orange-300 mb-2">Recommended Response</p>
                                <Badge
                                  variant="outline"
                                  className="border-orange-500 text-orange-400 bg-orange-500/20 text-base px-3 py-1"
                                >
                                  {risk.risk_response}
                                </Badge>
                              </div>
                              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/40">
                                <p className="text-sm font-bold text-cyan-300 mb-2">Target Date</p>
                                <p className="text-base font-semibold text-foreground">{risk.target_date}</p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="text-sm font-bold text-pink-300 mb-2 block">Decision Action</label>
                                <Select
                                  value={selectedRisk?.id === risk.id ? decisionAction : ""}
                                  onValueChange={(value) => {
                                    setSelectedRisk(risk)
                                    setDecisionAction(value)
                                  }}
                                >
                                  <SelectTrigger className="border-pink-500/50">
                                    <SelectValue placeholder="Select action..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="approve_mitigation">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                        Approve Mitigation Plan
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="accept_risk">
                                      <div className="flex items-center gap-2">
                                        <UserCheck className="h-4 w-4 text-blue-400" />
                                        Accept Risk
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="request_more_info">
                                      <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                                        Request More Information
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="escalate">
                                      <div className="flex items-center gap-2">
                                        <AlertTriangle className="h-4 w-4 text-red-400" />
                                        Escalate to Leadership
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="defer">
                                      <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                        Defer Decision
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {selectedRisk?.id === risk.id && decisionAction && (
                                <>
                                  <div>
                                    <label className="text-sm font-bold text-pink-300 mb-2 block">Decision Notes</label>
                                    <Textarea
                                      value={decisionNotes}
                                      onChange={(e) => setDecisionNotes(e.target.value)}
                                      placeholder="Enter justification, additional context, or instructions..."
                                      className="min-h-[100px] border-pink-500/50"
                                    />
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <Button
                                      onClick={handleDecisionSubmit}
                                      className="flex-1 bg-pink-500 hover:bg-pink-600 shadow-lg shadow-pink-500/50"
                                    >
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Submit Decision
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setSelectedRisk(null)
                                        setDecisionAction("")
                                        setDecisionNotes("")
                                      }}
                                      className="border-pink-500/50"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Cancel
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedRisk(risk)
                                setShowRiskModal(true)
                              }}
                              className="w-full mt-4 border-pink-500/50 hover:bg-pink-500/10"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Full Risk Details
                            </Button>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog open={showAssetModal} onOpenChange={setShowAssetModal}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              {selectedAsset && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-cyan-400 text-2xl">
                      <Server className="h-7 w-7" />
                      {selectedAsset.name}
                    </DialogTitle>
                    <DialogDescription className="text-base flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-sm">
                        {selectedAsset.id}
                      </Badge>
                      <Badge variant="secondary" className="text-sm">
                        {selectedAsset.type}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          selectedAsset.overall_impact === "High"
                            ? "border-red-500 text-red-400 bg-red-500/20"
                            : "border-yellow-500 text-yellow-400 bg-yellow-500/20"
                        }
                      >
                        {selectedAsset.overall_impact} Impact
                      </Badge>
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    <div className="p-6 rounded-xl bg-cyan-500/10 border-2 border-cyan-500/50 shadow-lg">
                      <h3 className="text-xl font-bold text-cyan-400 mb-4">NIST 800-30 Categorization</h3>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-lg bg-red-500/20 border-2 border-red-500/60">
                          <p className="text-sm font-bold text-red-300 mb-2">Confidentiality</p>
                          <p className="text-2xl font-bold text-foreground">
                            {selectedAsset.nist_categorization.confidentiality}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-yellow-500/20 border-2 border-yellow-500/60">
                          <p className="text-sm font-bold text-yellow-300 mb-2">Integrity</p>
                          <p className="text-2xl font-bold text-foreground">
                            {selectedAsset.nist_categorization.integrity}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-green-500/20 border-2 border-green-500/60">
                          <p className="text-sm font-bold text-green-300 mb-2">Availability</p>
                          <p className="text-2xl font-bold text-foreground">
                            {selectedAsset.nist_categorization.availability}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-orange-500/10 border-2 border-orange-500/50 shadow-lg">
                      <h3 className="text-xl font-bold text-orange-400 mb-4">Associated Risks</h3>
                      <div className="space-y-3">
                        {risks
                          .filter((r) => r.asset.id === selectedAsset.id)
                          .map((risk) => (
                            <div
                              key={risk.id}
                              className="p-4 rounded-lg border-2 border-border bg-background/50 hover:border-orange-500/60 transition-all cursor-pointer"
                              onClick={() => {
                                setSelectedRisk(risk)
                                setShowRiskModal(true)
                                setShowAssetModal(false)
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-orange-400 mb-1">{risk.title}</h4>
                                  <p className="text-sm text-muted-foreground">{risk.threat_event}</p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    risk.inherent_score >= 90
                                      ? "border-red-500 text-red-400 bg-red-500/20 font-bold text-lg px-3 py-1"
                                      : risk.inherent_score >= 70
                                        ? "border-orange-500 text-orange-400 bg-orange-500/20 font-bold text-lg px-3 py-1"
                                        : "border-yellow-500 text-yellow-400 bg-yellow-500/20 font-bold text-lg px-3 py-1"
                                  }
                                >
                                  {risk.inherent_score}
                                </Badge>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* ... existing risk detail modal code ... */}
        </main>
      </div>
    </div>
  )
}
