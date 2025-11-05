"use client"

import { useState, useEffect } from "react"
import { SidebarNav } from "@/components/sidebar-nav"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LayoutDashboard,
  Plus,
  Save,
  Trash2,
  Settings,
  BarChart3,
  LineChart,
  PieChart,
  Table2,
  Activity,
  MapPin,
  TrendingUp,
  Edit,
  X,
  Shield,
  Network,
  AlertTriangle,
  FileCheck,
  Cloud,
  Lock,
  MessageSquare,
  Send,
  Sparkles,
} from "lucide-react"
import {
  Line,
  Bar,
  Area,
  Pie,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  AreaChart as RechartsAreaChart,
  PieChart as RechartsPieChart,
  Cell,
} from "recharts"

interface Widget {
  id: string
  type: "line" | "bar" | "area" | "pie" | "table" | "counter" | "map"
  title: string
  dataSource: string
  refreshInterval: number
  query: string
  position: { x: number; y: number; w: number; h: number }
  config: any
}

interface Dashboard {
  id: string
  name: string
  description: string
  widgets: Widget[]
  createdAt: string
  updatedAt: string
}

const WIDGET_TYPES = [
  { type: "line", icon: LineChart, label: "Line Chart", color: "cyan" },
  { type: "bar", icon: BarChart3, label: "Bar Chart", color: "blue" },
  { type: "area", icon: Activity, label: "Area Chart", color: "purple" },
  { type: "pie", icon: PieChart, label: "Pie Chart", color: "pink" },
  { type: "table", icon: Table2, label: "Data Table", color: "green" },
  { type: "counter", icon: TrendingUp, label: "Counter", color: "orange" },
  { type: "map", icon: MapPin, label: "Geo Map", color: "red" },
]

const DATA_SOURCES = [
  "Security Dashboard",
  "CyberThreat Radar",
  "Security Alerts",
  "Incident Management",
  "Threat Intelligence",
  "Risk Analytics",
  "LLM Risk Scoring",
  "Predictive Forecasting",
  "Network Topology",
  "AI Security Posture",
  "Network Traffic",
  "Authentication Logs",
  "Cloud Security Events",
  "Compliance Reports", // Changed from "Compliance Violations"
  "Data Pipeline",
  "Playbooks",
  "Hunt Console",
  "Knowledge Vault",
  "Firewall Logs",
  "User Activity",
  "System Health",
]

const REFRESH_INTERVALS = [
  { value: 5, label: "5 seconds" },
  { value: 10, label: "10 seconds" },
  { value: 15, label: "15 seconds" },
  { value: 30, label: "30 seconds" },
  { value: 60, label: "1 minute" },
  { value: 300, label: "5 minutes" },
]

const DASHBOARD_TEMPLATES = [
  {
    id: "soc-overview",
    name: "SOC Overview Dashboard",
    description: "Comprehensive security operations center monitoring with key metrics and threat indicators",
    icon: Shield,
    color: "cyan",
    widgets: [
      {
        id: "widget-1",
        type: "counter" as const,
        title: "Total Security Events",
        dataSource: "System Health",
        refreshInterval: 10,
        query: "",
        position: { x: 0, y: 0, w: 4, h: 3 },
        config: {},
      },
      {
        id: "widget-2",
        type: "line" as const,
        title: "Threat Activity Timeline",
        dataSource: "Threat Intelligence",
        refreshInterval: 15,
        query: "",
        position: { x: 4, y: 0, w: 8, h: 4 },
        config: {},
      },
      {
        id: "widget-3",
        type: "pie" as const,
        title: "Alert Distribution by Severity",
        dataSource: "Cloud Security Events",
        refreshInterval: 30,
        query: "",
        position: { x: 0, y: 3, w: 4, h: 4 },
        config: {},
      },
      {
        id: "widget-4",
        type: "table" as const,
        title: "Recent Security Incidents",
        dataSource: "Threat Intelligence",
        refreshInterval: 10,
        query: "",
        position: { x: 4, y: 4, w: 8, h: 4 },
        config: {},
      },
      {
        id: "widget-5",
        type: "bar" as const,
        title: "Top Attack Vectors",
        dataSource: "Threat Intelligence",
        refreshInterval: 20,
        query: "",
        position: { x: 0, y: 7, w: 6, h: 4 },
        config: {},
      },
      {
        id: "widget-6",
        type: "area" as const,
        title: "Authentication Activity",
        dataSource: "Authentication Logs",
        refreshInterval: 15,
        query: "",
        position: { x: 6, y: 7, w: 6, h: 4 },
        config: {},
      },
    ],
  },
  {
    id: "network-security",
    name: "Network Security Dashboard",
    description: "Real-time network traffic monitoring, protocol analysis, and connection tracking",
    icon: Network,
    color: "blue",
    widgets: [
      {
        id: "widget-1",
        type: "area" as const,
        title: "Network Traffic Volume",
        dataSource: "Network Traffic",
        refreshInterval: 10,
        query: "",
        position: { x: 0, y: 0, w: 8, h: 4 },
        config: {},
      },
      {
        id: "widget-2",
        type: "counter" as const,
        title: "Active Connections",
        dataSource: "Network Traffic",
        refreshInterval: 5,
        query: "",
        position: { x: 8, y: 0, w: 4, h: 3 },
        config: {},
      },
      {
        id: "widget-3",
        type: "bar" as const,
        title: "Top Network Protocols",
        dataSource: "Network Traffic",
        refreshInterval: 15,
        query: "",
        position: { x: 0, y: 4, w: 6, h: 4 },
        config: {},
      },
      {
        id: "widget-4",
        type: "pie" as const,
        title: "Traffic Distribution",
        dataSource: "Network Traffic",
        refreshInterval: 20,
        query: "",
        position: { x: 6, y: 4, w: 6, h: 4 },
        config: {},
      },
      {
        id: "widget-5",
        type: "table" as const,
        title: "Recent Network Events",
        dataSource: "Network Traffic",
        refreshInterval: 10,
        query: "",
        position: { x: 0, y: 8, w: 12, h: 4 },
        config: {},
      },
    ],
  },
  {
    id: "threat-intelligence",
    name: "Threat Intelligence Dashboard",
    description: "Advanced threat detection, malware analysis, and threat actor tracking",
    icon: AlertTriangle,
    color: "red",
    widgets: [
      {
        id: "widget-1",
        type: "line" as const,
        title: "Threat Detection Timeline",
        dataSource: "Threat Intelligence",
        refreshInterval: 10,
        query: "",
        position: { x: 0, y: 0, w: 8, h: 4 },
        config: {},
      },
      {
        id: "widget-2",
        type: "counter" as const,
        title: "Active Threats",
        dataSource: "Threat Intelligence",
        refreshInterval: 5,
        query: "",
        position: { x: 8, y: 0, w: 4, h: 3 },
        config: {},
      },
      {
        id: "widget-3",
        type: "pie" as const,
        title: "Threat Categories",
        dataSource: "Threat Intelligence",
        refreshInterval: 30,
        query: "",
        position: { x: 0, y: 4, w: 6, h: 4 },
        config: {},
      },
      {
        id: "widget-4",
        type: "bar" as const,
        title: "Threat Sources",
        dataSource: "Threat Intelligence",
        refreshInterval: 20,
        query: "",
        position: { x: 6, y: 4, w: 6, h: 4 },
        config: {},
      },
      {
        id: "widget-5",
        type: "table" as const,
        title: "Threat Indicators (IOCs)",
        dataSource: "Threat Intelligence",
        refreshInterval: 15,
        query: "",
        position: { x: 0, y: 8, w: 12, h: 4 },
        config: {},
      },
    ],
  },
  {
    id: "compliance-monitoring",
    name: "Compliance Monitoring Dashboard",
    description: "Track compliance violations, framework adherence, and audit readiness",
    icon: FileCheck,
    color: "green",
    widgets: [
      {
        id: "widget-1",
        type: "counter" as const,
        title: "Compliance Score",
        dataSource: "Compliance Reports", // Changed from "System Health"
        refreshInterval: 60,
        query: "",
        position: { x: 0, y: 0, w: 4, h: 3 },
        config: {},
      },
      {
        id: "widget-2",
        type: "area" as const,
        title: "Violations Over Time",
        dataSource: "Compliance Reports", // Changed from "Compliance Violations"
        refreshInterval: 30,
        query: "",
        position: { x: 4, y: 0, w: 8, h: 4 },
        config: {},
      },
      {
        id: "widget-3",
        type: "bar" as const,
        title: "Violations by Framework",
        dataSource: "Compliance Reports", // Changed from "Compliance Violations"
        refreshInterval: 30,
        query: "",
        position: { x: 0, y: 3, w: 6, h: 4 },
        config: {},
      },
      {
        id: "widget-4",
        type: "pie" as const,
        title: "Violation Severity",
        dataSource: "Compliance Reports", // Changed from "Compliance Violations"
        refreshInterval: 30,
        query: "",
        position: { x: 6, y: 3, w: 6, h: 4 },
        config: {},
      },
      {
        id: "widget-5",
        type: "table" as const,
        title: "Recent Compliance Violations",
        dataSource: "Compliance Reports", // Changed from "Compliance Violations"
        refreshInterval: 20,
        query: "",
        position: { x: 0, y: 7, w: 12, h: 4 },
        config: {},
      },
    ],
  },
  {
    id: "cloud-security",
    name: "Cloud Security Dashboard",
    description: "Monitor AWS, Azure, and GCP security events, misconfigurations, and access patterns",
    icon: Cloud,
    color: "purple",
    widgets: [
      {
        id: "widget-1",
        type: "area" as const,
        title: "Cloud Events by Provider",
        dataSource: "Cloud Security Events",
        refreshInterval: 15,
        query: "",
        position: { x: 0, y: 0, w: 8, h: 4 },
        config: {},
      },
      {
        id: "widget-2",
        type: "counter" as const,
        title: "Total Cloud Events",
        dataSource: "Cloud Security Events",
        refreshInterval: 10,
        query: "",
        position: { x: 8, y: 0, w: 4, h: 3 },
        config: {},
      },
      {
        id: "widget-3",
        type: "bar" as const,
        title: "Events by Cloud Provider",
        dataSource: "Cloud Security Events",
        refreshInterval: 20,
        query: "",
        position: { x: 0, y: 4, w: 6, h: 4 },
        config: {},
      },
      {
        id: "widget-4",
        type: "pie" as const,
        title: "Event Severity Distribution",
        dataSource: "Cloud Security Events",
        refreshInterval: 30,
        query: "",
        position: { x: 6, y: 4, w: 6, h: 4 },
        config: {},
      },
      {
        id: "widget-5",
        type: "table" as const,
        title: "Recent Cloud Security Events",
        dataSource: "Cloud Security Events",
        refreshInterval: 10,
        query: "",
        position: { x: 0, y: 8, w: 12, h: 4 },
        config: {},
      },
    ],
  },
  {
    id: "authentication-monitoring",
    name: "Authentication Monitoring Dashboard",
    description: "Track login attempts, failed authentications, and user access patterns",
    icon: Lock,
    color: "orange",
    widgets: [
      {
        id: "widget-1",
        type: "area" as const,
        title: "Authentication Activity",
        dataSource: "Authentication Logs",
        refreshInterval: 10,
        query: "",
        position: { x: 0, y: 0, w: 8, h: 4 },
        config: {},
      },
      {
        id: "widget-2",
        type: "counter" as const,
        title: "Total Authentications",
        dataSource: "Authentication Logs",
        refreshInterval: 5,
        query: "",
        position: { x: 8, y: 0, w: 4, h: 3 },
        config: {},
      },
      {
        id: "widget-3",
        type: "bar" as const,
        title: "Authentication by Source",
        dataSource: "Authentication Logs",
        refreshInterval: 15,
        query: "",
        position: { x: 0, y: 4, w: 6, h: 4 },
        config: {},
      },
      {
        id: "widget-4",
        type: "pie" as const,
        title: "Authentication Status",
        dataSource: "Authentication Logs",
        refreshInterval: 20,
        query: "",
        position: { x: 6, y: 4, w: 6, h: 4 },
        config: {},
      },
      {
        id: "widget-5",
        type: "table" as const,
        title: "Recent Authentication Events",
        dataSource: "Authentication Logs",
        refreshInterval: 10,
        query: "",
        position: { x: 0, y: 8, w: 12, h: 4 },
        config: {},
      },
    ],
  },
]

export default function CustomDashboardPage() {
  const [dashboards, setDashboards] = useState<Dashboard[]>([])
  const [currentDashboard, setCurrentDashboard] = useState<Dashboard | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false)
  const [showDataSourceSelector, setShowDataSourceSelector] = useState(false)
  const [selectedDataSource, setSelectedDataSource] = useState<string>("")
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null)
  const [dashboardName, setDashboardName] = useState("")
  const [dashboardDescription, setDashboardDescription] = useState("")
  const [widgetData, setWidgetData] = useState<Record<string, any>>({})
  const [showTemplateSelector, setShowTemplateSelector] = useState(false) // Added this line
  const [showAIChat, setShowAIChat] = useState(false)
  const [aiChatMessages, setAiChatMessages] = useState<Array<{ role: string; content: string }>>([])
  const [aiChatInput, setAiChatInput] = useState("")
  const [isAIThinking, setIsAIThinking] = useState(false)

  // Load saved dashboards from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("custom-dashboards")
    if (saved) {
      const parsed = JSON.parse(saved)
      setDashboards(parsed)
      if (parsed.length > 0) {
        setCurrentDashboard(parsed[0])
      }
    }
  }, [])

  // Save dashboards to localStorage
  const saveDashboards = (updatedDashboards: Dashboard[]) => {
    localStorage.setItem("custom-dashboards", JSON.stringify(updatedDashboards))
    setDashboards(updatedDashboards)
  }

  const createNewDashboard = () => {
    const newDashboard: Dashboard = {
      id: `dashboard-${Date.now()}`,
      name: dashboardName || "New Dashboard",
      description: dashboardDescription || "Custom SIEM dashboard",
      widgets: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [...dashboards, newDashboard]
    saveDashboards(updated)
    setCurrentDashboard(newDashboard)
    setDashboardName("")
    setDashboardDescription("")
    setIsEditing(true)
  }

  const createFromTemplate = (template: (typeof DASHBOARD_TEMPLATES)[0]) => {
    const newDashboard: Dashboard = {
      id: `dashboard-${Date.now()}`,
      name: template.name,
      description: template.description,
      widgets: template.widgets.map((w) => ({ ...w, id: `widget-${Date.now()}-${Math.random()}` })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const updated = [...dashboards, newDashboard]
    saveDashboards(updated)
    setCurrentDashboard(newDashboard)
    setShowTemplateSelector(false) // Corrected variable name
  }

  const addWidget = (type: string) => {
    if (!currentDashboard) return

    const newWidget: Widget = {
      id: `widget-${Date.now()}`,
      type: type as any,
      title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Widget`,
      dataSource: selectedDataSource || DATA_SOURCES[0],
      refreshInterval: 15,
      query: "",
      position: { x: 0, y: 0, w: 6, h: 4 },
      config: {},
    }

    const initialData = generateRealisticData(newWidget)
    setWidgetData((prev) => ({
      ...prev,
      [newWidget.id]: initialData,
    }))

    const updated = {
      ...currentDashboard,
      widgets: [...currentDashboard.widgets, newWidget],
      updatedAt: new Date().toISOString(), // Added updated timestamp
    }

    setCurrentDashboard(updated)
    setShowWidgetLibrary(false)
    setShowDataSourceSelector(false)
    setSelectedDataSource("") // Reset selected data source
    setIsEditing(false) // Reset editing mode

    // Save to localStorage
    const allDashboards = dashboards.map((d) => (d.id === updated.id ? updated : d))
    setDashboards(allDashboards)
    localStorage.setItem("custom-dashboards", JSON.stringify(allDashboards)) // Corrected item name
  }

  const handleAddWidgetClick = () => {
    setShowDataSourceSelector(true)
  }

  const handleDataSourceSelected = (dataSource: string) => {
    setSelectedDataSource(dataSource)
    setShowDataSourceSelector(false)
    setShowWidgetLibrary(true)
  }

  const deleteWidget = (widgetId: string) => {
    if (!currentDashboard) return

    const updated = {
      ...currentDashboard,
      widgets: currentDashboard.widgets.filter((w) => w.id !== widgetId),
      updatedAt: new Date().toISOString(),
    }

    setCurrentDashboard(updated)
    const updatedDashboards = dashboards.map((d) => (d.id === updated.id ? updated : d))
    saveDashboards(updatedDashboards)
  }

  const updateWidget = (widgetId: string, updates: Partial<Widget>) => {
    if (!currentDashboard) return

    const updated = {
      ...currentDashboard,
      widgets: currentDashboard.widgets.map((w) => (w.id === widgetId ? { ...w, ...updates } : w)),
      updatedAt: new Date().toISOString(),
    }

    setCurrentDashboard(updated)
    const updatedDashboards = dashboards.map((d) => (d.id === updated.id ? updated : d))
    saveDashboards(updatedDashboards)
  }

  const deleteDashboard = (dashboardId: string) => {
    const updated = dashboards.filter((d) => d.id !== dashboardId)
    saveDashboards(updated)
    if (currentDashboard?.id === dashboardId) {
      setCurrentDashboard(updated[0] || null)
    }
  }

  const generateRealisticData = (widget: Widget) => {
    const now = new Date()
    const timeLabels = Array.from({ length: 12 }, (_, i) => {
      const time = new Date(now.getTime() - (11 - i) * 5 * 60000)
      return time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    })

    switch (widget.dataSource) {
      case "Security Dashboard":
        if (widget.type === "line" || widget.type === "area") {
          return timeLabels.map((time) => ({
            name: time,
            events: Math.floor(Math.random() * 1000) + 2000,
            threats: Math.floor(Math.random() * 200) + 100,
            alerts: Math.floor(Math.random() * 150) + 50,
          }))
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 100000) + 250000
        } else if (widget.type === "pie") {
          return [
            { name: "Critical", value: Math.floor(Math.random() * 50) + 20, color: "#ef4444" },
            { name: "High", value: Math.floor(Math.random() * 100) + 80, color: "#f59e0b" },
            { name: "Medium", value: Math.floor(Math.random() * 200) + 150, color: "#eab308" },
            { name: "Low", value: Math.floor(Math.random() * 300) + 250, color: "#22c55e" },
          ]
        }
        break

      case "CyberThreat Radar":
        if (widget.type === "line" || widget.type === "area") {
          return timeLabels.map((time) => ({
            name: time,
            global: Math.floor(Math.random() * 500) + 1000,
            regional: Math.floor(Math.random() * 300) + 500,
            local: Math.floor(Math.random() * 200) + 300,
          }))
        } else if (widget.type === "bar") {
          return [
            { name: "North America", count: Math.floor(Math.random() * 1000) + 2000 },
            { name: "Europe", count: Math.floor(Math.random() * 800) + 1500 },
            { name: "Asia", count: Math.floor(Math.random() * 1200) + 2500 },
            { name: "South America", count: Math.floor(Math.random() * 400) + 800 },
            { name: "Africa", count: Math.floor(Math.random() * 300) + 600 },
          ]
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 5000) + 15000
        }
        break

      case "Security Alerts":
        if (widget.type === "line" || widget.type === "area") {
          return timeLabels.map((time) => ({
            name: time,
            critical: Math.floor(Math.random() * 20) + 10,
            high: Math.floor(Math.random() * 50) + 30,
            medium: Math.floor(Math.random() * 100) + 80,
          }))
        } else if (widget.type === "table") {
          return Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            alert: ["Brute Force Attack", "SQL Injection", "DDoS Attempt", "Malware Detected"][
              Math.floor(Math.random() * 4)
            ],
            severity: ["Critical", "High", "Medium"][Math.floor(Math.random() * 3)],
            source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            time: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(),
          }))
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 500) + 1200
        }
        break

      case "Incident Management":
        if (widget.type === "bar") {
          return [
            { name: "Open", count: Math.floor(Math.random() * 50) + 30 },
            { name: "In Progress", count: Math.floor(Math.random() * 40) + 25 },
            { name: "Resolved", count: Math.floor(Math.random() * 100) + 150 },
            { name: "Closed", count: Math.floor(Math.random() * 200) + 300 },
          ]
        } else if (widget.type === "table") {
          return Array.from({ length: 8 }, (_, i) => ({
            id: `INC-${1000 + i}`,
            title: ["Data Breach", "Ransomware", "Phishing Campaign", "Insider Threat"][Math.floor(Math.random() * 4)],
            status: ["Open", "In Progress", "Resolved"][Math.floor(Math.random() * 3)],
            priority: ["Critical", "High", "Medium"][Math.floor(Math.random() * 3)],
          }))
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 100) + 150
        }
        break

      case "Risk Analytics":
        if (widget.type === "line" || widget.type === "area") {
          return timeLabels.map((time) => ({
            name: time,
            riskScore: Math.floor(Math.random() * 30) + 50,
            vulnerabilities: Math.floor(Math.random() * 20) + 30,
            exposure: Math.floor(Math.random() * 25) + 40,
          }))
        } else if (widget.type === "pie") {
          return [
            { name: "Critical Risk", value: Math.floor(Math.random() * 30) + 20, color: "#ef4444" },
            { name: "High Risk", value: Math.floor(Math.random() * 50) + 40, color: "#f59e0b" },
            { name: "Medium Risk", value: Math.floor(Math.random() * 80) + 70, color: "#eab308" },
            { name: "Low Risk", value: Math.floor(Math.random() * 100) + 90, color: "#22c55e" },
          ]
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 20) + 65
        }
        break

      case "LLM Risk Scoring":
        if (widget.type === "bar") {
          return [
            { name: "Prompt Injection", count: Math.floor(Math.random() * 50) + 30 },
            { name: "Data Leakage", count: Math.floor(Math.random() * 40) + 25 },
            { name: "Model Poisoning", count: Math.floor(Math.random() * 30) + 20 },
            { name: "Adversarial Input", count: Math.floor(Math.random() * 35) + 22 },
          ]
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 20) + 75
        } else if (widget.type === "table") {
          return Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            model: ["GPT-4", "Claude", "Llama", "Gemini"][Math.floor(Math.random() * 4)],
            riskScore: Math.floor(Math.random() * 40) + 60,
            threats: Math.floor(Math.random() * 10) + 5,
            status: ["Monitored", "Alert", "Safe"][Math.floor(Math.random() * 3)],
          }))
        }
        break

      case "Predictive Forecasting":
        if (widget.type === "line" || widget.type === "area") {
          return timeLabels.map((time) => ({
            name: time,
            predicted: Math.floor(Math.random() * 500) + 1000,
            actual: Math.floor(Math.random() * 450) + 950,
            confidence: Math.floor(Math.random() * 20) + 75,
          }))
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 1000) + 3500
        }
        break

      case "Network Topology":
        if (widget.type === "bar") {
          return [
            { name: "Routers", count: Math.floor(Math.random() * 20) + 15 },
            { name: "Switches", count: Math.floor(Math.random() * 50) + 40 },
            { name: "Firewalls", count: Math.floor(Math.random() * 15) + 10 },
            { name: "Endpoints", count: Math.floor(Math.random() * 200) + 300 },
            { name: "Servers", count: Math.floor(Math.random() * 80) + 100 },
          ]
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 500) + 800
        } else if (widget.type === "table") {
          return Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            device: ["Router", "Switch", "Firewall", "Server"][Math.floor(Math.random() * 4)],
            ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            status: Math.random() > 0.2 ? "Online" : "Offline",
            connections: Math.floor(Math.random() * 100) + 50,
          }))
        }
        break

      case "AI Security Posture":
        if (widget.type === "line" || widget.type === "area") {
          return timeLabels.map((time) => ({
            name: time,
            posture: Math.floor(Math.random() * 15) + 75,
            threats: Math.floor(Math.random() * 10) + 5,
            compliance: Math.floor(Math.random() * 10) + 85,
          }))
        } else if (widget.type === "pie") {
          return [
            { name: "Secure", value: Math.floor(Math.random() * 100) + 150, color: "#22c55e" },
            { name: "At Risk", value: Math.floor(Math.random() * 50) + 30, color: "#eab308" },
            { name: "Vulnerable", value: Math.floor(Math.random() * 30) + 15, color: "#f59e0b" },
            { name: "Critical", value: Math.floor(Math.random() * 20) + 10, color: "#ef4444" },
          ]
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 15) + 82
        }
        break

      case "Data Pipeline":
        if (widget.type === "line" || widget.type === "area") {
          return timeLabels.map((time) => ({
            name: time,
            ingested: Math.floor(Math.random() * 5000) + 10000,
            processed: Math.floor(Math.random() * 4500) + 9500,
            stored: Math.floor(Math.random() * 4000) + 9000,
          }))
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 50000) + 200000
        } else if (widget.type === "bar") {
          return [
            { name: "Logs", count: Math.floor(Math.random() * 10000) + 50000 },
            { name: "Events", count: Math.floor(Math.random() * 8000) + 40000 },
            { name: "Alerts", count: Math.floor(Math.random() * 5000) + 25000 },
            { name: "Metrics", count: Math.floor(Math.random() * 15000) + 75000 },
          ]
        }
        break

      case "Playbooks":
        if (widget.type === "bar") {
          return [
            { name: "Active", count: Math.floor(Math.random() * 20) + 15 },
            { name: "Scheduled", count: Math.floor(Math.random() * 15) + 10 },
            { name: "Completed", count: Math.floor(Math.random() * 50) + 80 },
            { name: "Failed", count: Math.floor(Math.random() * 10) + 5 },
          ]
        } else if (widget.type === "table") {
          return Array.from({ length: 8 }, (_, i) => ({
            id: `PB-${100 + i}`,
            name: ["Incident Response", "Threat Hunting", "Vulnerability Scan", "Compliance Check"][
              Math.floor(Math.random() * 4)
            ],
            status: ["Active", "Scheduled", "Completed"][Math.floor(Math.random() * 3)],
            executions: Math.floor(Math.random() * 100) + 50,
          }))
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 50) + 120
        }
        break

      case "Hunt Console":
        if (widget.type === "table") {
          return Array.from({ length: 8 }, (_, i) => ({
            id: `HUNT-${200 + i}`,
            query: ["IOC Search", "Lateral Movement", "Privilege Escalation", "Data Exfiltration"][
              Math.floor(Math.random() * 4)
            ],
            results: Math.floor(Math.random() * 50) + 10,
            status: ["Running", "Completed", "Pending"][Math.floor(Math.random() * 3)],
          }))
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 100) + 250
        } else if (widget.type === "bar") {
          return [
            { name: "IOC Matches", count: Math.floor(Math.random() * 50) + 30 },
            { name: "Anomalies", count: Math.floor(Math.random() * 40) + 25 },
            { name: "Suspicious Activity", count: Math.floor(Math.random() * 60) + 40 },
            { name: "False Positives", count: Math.floor(Math.random() * 30) + 20 },
          ]
        }
        break

      case "Knowledge Vault":
        if (widget.type === "bar") {
          return [
            { name: "Threat Reports", count: Math.floor(Math.random() * 100) + 150 },
            { name: "IOCs", count: Math.floor(Math.random() * 500) + 1000 },
            { name: "Playbooks", count: Math.floor(Math.random() * 50) + 80 },
            { name: "Documentation", count: Math.floor(Math.random() * 200) + 300 },
          ]
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 1000) + 2500
        } else if (widget.type === "table") {
          return Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            type: ["Threat Report", "IOC", "Playbook", "Documentation"][Math.floor(Math.random() * 4)],
            title: `Document ${i + 1}`,
            category: ["Malware", "Phishing", "Ransomware", "APT"][Math.floor(Math.random() * 4)],
            updated: new Date(Date.now() - Math.random() * 86400000 * 7).toLocaleDateString(),
          }))
        }
        break

      case "Network Traffic":
        if (widget.type === "line" || widget.type === "area") {
          return timeLabels.map((time) => ({
            name: time,
            inbound: Math.floor(Math.random() * 2000) + 3000,
            outbound: Math.floor(Math.random() * 1500) + 2000,
          }))
        } else if (widget.type === "bar") {
          return [
            { name: "HTTP", count: Math.floor(Math.random() * 5000) + 8000 },
            { name: "HTTPS", count: Math.floor(Math.random() * 4000) + 10000 },
            { name: "DNS", count: Math.floor(Math.random() * 3000) + 5000 },
            { name: "SSH", count: Math.floor(Math.random() * 1000) + 2000 },
            { name: "FTP", count: Math.floor(Math.random() * 500) + 1000 },
          ]
        } else if (widget.type === "pie") {
          return [
            { name: "Internal", value: Math.floor(Math.random() * 3000) + 5000, color: "#22c55e" },
            { name: "External", value: Math.floor(Math.random() * 2000) + 3000, color: "#3b82f6" },
            { name: "Cloud", value: Math.floor(Math.random() * 1500) + 2000, color: "#a855f7" },
            { name: "VPN", value: Math.floor(Math.random() * 1000) + 1500, color: "#f59e0b" },
          ]
        } else if (widget.type === "table") {
          return Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            destination: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            protocol: ["HTTP", "HTTPS", "DNS", "SSH"][Math.floor(Math.random() * 4)],
            bytes: Math.floor(Math.random() * 100000) + 10000,
          }))
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 50000) + 150000
        }
        break

      case "Authentication Logs":
        if (widget.type === "line" || widget.type === "area") {
          return timeLabels.map((time) => ({
            name: time,
            successful: Math.floor(Math.random() * 500) + 800,
            failed: Math.floor(Math.random() * 100) + 50,
          }))
        } else if (widget.type === "bar") {
          return [
            { name: "Windows AD", count: Math.floor(Math.random() * 2000) + 5000 },
            { name: "Linux PAM", count: Math.floor(Math.random() * 1500) + 3000 },
            { name: "Cloud SSO", count: Math.floor(Math.random() * 1000) + 2500 },
            { name: "VPN", count: Math.floor(Math.random() * 800) + 1500 },
            { name: "Database", count: Math.floor(Math.random() * 500) + 1000 },
          ]
        } else if (widget.type === "pie") {
          return [
            { name: "Success", value: Math.floor(Math.random() * 5000) + 10000, color: "#22c55e" },
            { name: "Failed", value: Math.floor(Math.random() * 500) + 200, color: "#ef4444" },
            { name: "Locked", value: Math.floor(Math.random() * 100) + 50, color: "#f59e0b" },
            { name: "MFA", value: Math.floor(Math.random() * 2000) + 3000, color: "#3b82f6" },
          ]
        } else if (widget.type === "table") {
          return Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            user: `user${Math.floor(Math.random() * 1000)}`,
            source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            status: Math.random() > 0.2 ? "Success" : "Failed",
            time: new Date(Date.now() - Math.random() * 3600000).toLocaleTimeString(),
          }))
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 10000) + 25000
        }
        break

      case "Cloud Security Events":
        if (widget.type === "line" || widget.type === "area") {
          return timeLabels.map((time) => ({
            name: time,
            aws: Math.floor(Math.random() * 300) + 500,
            azure: Math.floor(Math.random() * 250) + 400,
            gcp: Math.floor(Math.random() * 200) + 300,
          }))
        } else if (widget.type === "bar") {
          return [
            { name: "AWS", count: Math.floor(Math.random() * 1000) + 2500 },
            { name: "Azure", count: Math.floor(Math.random() * 800) + 2000 },
            { name: "GCP", count: Math.floor(Math.random() * 600) + 1500 },
          ]
        } else if (widget.type === "pie") {
          return [
            { name: "Critical", value: Math.floor(Math.random() * 50) + 20, color: "#ef4444" },
            { name: "High", value: Math.floor(Math.random() * 150) + 100, color: "#f59e0b" },
            { name: "Medium", value: Math.floor(Math.random() * 300) + 250, color: "#eab308" },
            { name: "Low", value: Math.floor(Math.random() * 500) + 400, color: "#22c55e" },
          ]
        } else if (widget.type === "table") {
          return Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            provider: ["AWS", "Azure", "GCP"][Math.floor(Math.random() * 3)],
            service: ["EC2", "S3", "Lambda", "RDS", "CloudTrail"][Math.floor(Math.random() * 5)],
            event: ["Access Denied", "Config Change", "Resource Created", "Policy Modified"][
              Math.floor(Math.random() * 4)
            ],
            severity: ["Critical", "High", "Medium", "Low"][Math.floor(Math.random() * 4)],
          }))
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 5000) + 12000
        }
        break

      case "Threat Intelligence":
        if (widget.type === "line" || widget.type === "area") {
          return timeLabels.map((time) => ({
            name: time,
            malware: Math.floor(Math.random() * 50) + 20,
            phishing: Math.floor(Math.random() * 80) + 40,
            botnet: Math.floor(Math.random() * 30) + 10,
          }))
        } else if (widget.type === "bar") {
          return [
            { name: "Malware", count: Math.floor(Math.random() * 200) + 150 },
            { name: "Phishing", count: Math.floor(Math.random() * 300) + 250 },
            { name: "Botnet", count: Math.floor(Math.random() * 150) + 100 },
            { name: "C2", count: Math.floor(Math.random() * 100) + 80 },
            { name: "Exploit", count: Math.floor(Math.random() * 80) + 50 },
          ]
        } else if (widget.type === "pie") {
          return [
            { name: "Malware", value: Math.floor(Math.random() * 200) + 150, color: "#ef4444" },
            { name: "Phishing", value: Math.floor(Math.random() * 300) + 250, color: "#f59e0b" },
            { name: "Botnet", value: Math.floor(Math.random() * 150) + 100, color: "#a855f7" },
            { name: "Ransomware", value: Math.floor(Math.random() * 100) + 50, color: "#ec4899" },
          ]
        } else if (widget.type === "table") {
          return Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            indicator: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
            type: ["Malware", "Phishing", "Botnet", "C2"][Math.floor(Math.random() * 4)],
            confidence: `${Math.floor(Math.random() * 30) + 70}%`,
            source: ["VirusTotal", "AlienVault", "Shodan", "ThreatFox"][Math.floor(Math.random() * 4)],
          }))
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 1000) + 2500
        }
        break

      case "Compliance Violations": // This case should be removed or renamed to match the updated DATA_SOURCES
        if (widget.type === "line" || widget.type === "area") {
          return timeLabels.map((time) => ({
            name: time,
            critical: Math.floor(Math.random() * 10) + 5,
            high: Math.floor(Math.random() * 20) + 15,
            medium: Math.floor(Math.random() * 30) + 25,
          }))
        } else if (widget.type === "bar") {
          return [
            { name: "PCI-DSS", count: Math.floor(Math.random() * 50) + 30 },
            { name: "HIPAA", count: Math.floor(Math.random() * 40) + 25 },
            { name: "GDPR", count: Math.floor(Math.random() * 60) + 40 },
            { name: "SOC 2", count: Math.floor(Math.random() * 35) + 20 },
            { name: "ISO 27001", count: Math.floor(Math.random() * 45) + 30 },
          ]
        } else if (widget.type === "pie") {
          return [
            { name: "Critical", value: Math.floor(Math.random() * 20) + 10, color: "#ef4444" },
            { name: "High", value: Math.floor(Math.random() * 40) + 30, color: "#f59e0b" },
            { name: "Medium", value: Math.floor(Math.random() * 60) + 50, color: "#eab308" },
            { name: "Low", value: Math.floor(Math.random() * 80) + 70, color: "#22c55e" },
          ]
        } else if (widget.type === "table") {
          return Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            framework: ["PCI-DSS", "HIPAA", "GDPR", "SOC 2"][Math.floor(Math.random() * 4)],
            control: `${["AC", "AU", "CM", "IA"][Math.floor(Math.random() * 4)]}-${Math.floor(Math.random() * 20) + 1}`,
            status: Math.random() > 0.3 ? "Compliant" : "Violation",
            severity: ["Critical", "High", "Medium", "Low"][Math.floor(Math.random() * 4)],
          }))
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 200) + 150
        }
        break

      case "System Health":
        if (widget.type === "line" || widget.type === "area") {
          return timeLabels.map((time) => ({
            name: time,
            cpu: Math.floor(Math.random() * 30) + 40,
            memory: Math.floor(Math.random() * 25) + 50,
            disk: Math.floor(Math.random() * 20) + 30,
          }))
        } else if (widget.type === "bar") {
          return [
            { name: "SIEM", count: Math.floor(Math.random() * 30) + 85 },
            { name: "Firewall", count: Math.floor(Math.random() * 20) + 90 },
            { name: "IDS/IPS", count: Math.floor(Math.random() * 25) + 88 },
            { name: "EDR", count: Math.floor(Math.random() * 15) + 92 },
            { name: "SOAR", count: Math.floor(Math.random() * 20) + 87 },
          ]
        } else if (widget.type === "pie") {
          return [
            { name: "Healthy", value: Math.floor(Math.random() * 50) + 80, color: "#22c55e" },
            { name: "Warning", value: Math.floor(Math.random() * 20) + 10, color: "#eab308" },
            { name: "Critical", value: Math.floor(Math.random() * 10) + 5, color: "#ef4444" },
            { name: "Offline", value: Math.floor(Math.random() * 5) + 2, color: "#6b7280" },
          ]
        } else if (widget.type === "table") {
          return Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            component: ["SIEM", "Firewall", "IDS/IPS", "EDR", "SOAR"][Math.floor(Math.random() * 5)],
            status: Math.random() > 0.2 ? "Healthy" : "Warning",
            uptime: `${Math.floor(Math.random() * 10) + 90}.${Math.floor(Math.random() * 99)}%`,
            latency: `${Math.floor(Math.random() * 50) + 10}ms`,
          }))
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 10) + 95
        }
        break

      default:
        // Generic fallback data
        if (widget.type === "line" || widget.type === "area" || widget.type === "bar") {
          return timeLabels.map((time) => ({
            name: time,
            value: Math.floor(Math.random() * 1000) + 500,
            value2: Math.floor(Math.random() * 800) + 300,
          }))
        } else if (widget.type === "pie") {
          return [
            { name: "Category A", value: Math.floor(Math.random() * 100) + 50, color: "#22c55e" },
            { name: "Category B", value: Math.floor(Math.random() * 150) + 100, color: "#3b82f6" },
            { name: "Category C", value: Math.floor(Math.random() * 200) + 150, color: "#a855f7" },
            { name: "Category D", value: Math.floor(Math.random() * 300) + 200, color: "#f59e0b" },
          ]
        } else if (widget.type === "table") {
          return Array.from({ length: 8 }, (_, i) => ({
            id: i + 1,
            field1: `Value ${i + 1}`,
            field2: Math.floor(Math.random() * 1000),
            field3: ["Status A", "Status B", "Status C"][Math.floor(Math.random() * 3)],
          }))
        } else if (widget.type === "counter") {
          return Math.floor(Math.random() * 10000) + 5000
        }
    }

    return []
  }

  useEffect(() => {
    if (!currentDashboard) return

    // Initialize data for all widgets
    const initialData: Record<string, any> = {}
    currentDashboard.widgets.forEach((widget) => {
      initialData[widget.id] = generateRealisticData(widget)
    })
    setWidgetData(initialData)

    // Set up intervals for each widget
    const intervals: NodeJS.Timeout[] = []
    currentDashboard.widgets.forEach((widget) => {
      const interval = setInterval(() => {
        setWidgetData((prev) => ({
          ...prev,
          [widget.id]: generateRealisticData(widget),
        }))
      }, widget.refreshInterval * 1000)
      intervals.push(interval)
    })

    return () => {
      intervals.forEach((interval) => clearInterval(interval))
    }
  }, [currentDashboard])

  const renderWidget = (widget: Widget) => {
    const data = widgetData[widget.id] || []

    return (
      <Card className="relative h-full border-gray-700 bg-gray-900/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={widget.title}
                  onChange={(e) => updateWidget(widget.id, { title: e.target.value })}
                  className="mb-1 border-gray-700 bg-gray-800 text-white"
                />
              ) : (
                <CardTitle className="text-base">{widget.title}</CardTitle>
              )}
              <CardDescription className="text-xs">
                {widget.dataSource} • Refreshes every {widget.refreshInterval}s
              </CardDescription>
            </div>
            {isEditing && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedWidget(widget)}
                  className="h-7 w-7 p-0 text-gray-400 hover:text-cyan-400"
                >
                  <Settings className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteWidget(widget.id)}
                  className="h-7 w-7 p-0 text-gray-400 hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)]">
          {widget.type === "line" && (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                />
                <Legend />
                {Object.keys(data[0] || {})
                  .filter((key) => key !== "name")
                  .map((key, index) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={["#06b6d4", "#8b5cf6", "#22c55e"][index % 3]}
                      strokeWidth={2}
                      dot={false}
                    />
                  ))}
              </RechartsLineChart>
            </ResponsiveContainer>
          )}

          {widget.type === "bar" && (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6" />
              </RechartsBarChart>
            </ResponsiveContainer>
          )}

          {widget.type === "area" && (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <YAxis stroke="#9ca3af" tick={{ fill: "#9ca3af", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                />
                <Legend />
                {Object.keys(data[0] || {})
                  .filter((key) => key !== "name")
                  .map((key, index) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={["#a855f7", "#ec4899", "#22c55e"][index % 3]}
                      fill={["#a855f7", "#ec4899", "#22c55e"][index % 3]}
                      fillOpacity={0.3}
                    />
                  ))}
              </RechartsAreaChart>
            </ResponsiveContainer>
          )}

          {widget.type === "pie" && (
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {data.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          )}

          {widget.type === "table" && (
            <div className="h-full overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-800">
                  <tr className="border-b border-gray-700">
                    {Object.keys(data[0] || {}).map((key) => (
                      <th key={key} className="px-2 py-2 text-left text-xs font-semibold text-gray-400 capitalize">
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row: any, index: number) => (
                    <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                      {Object.entries(row).map(([key, value]: [string, any]) => (
                        <td key={key} className="px-2 py-2 text-xs">
                          {key === "severity" || key === "status" ? (
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                value === "Critical"
                                  ? "border-red-500/50 bg-red-500/10 text-red-400"
                                  : value === "High"
                                    ? "border-orange-500/50 bg-orange-500/10 text-orange-400"
                                    : value === "Medium"
                                      ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                                      : value === "Low"
                                        ? "border-green-500/50 bg-green-500/10 text-green-400"
                                        : value === "Success" || value === "Healthy" || value === "Compliant"
                                          ? "border-green-500/50 bg-green-500/10 text-green-400"
                                          : value === "Failed" || value === "Violation"
                                            ? "border-red-500/50 bg-red-500/10 text-red-400"
                                            : "border-gray-500/50 bg-gray-500/10 text-gray-400"
                              }`}
                            >
                              {value}
                            </Badge>
                          ) : (
                            <span
                              className={
                                key.includes("ip") || key.includes("source")
                                  ? "font-mono text-cyan-400"
                                  : "text-gray-300"
                              }
                            >
                              {value}
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {widget.type === "counter" && (
            <div className="flex h-full flex-col items-center justify-center">
              <div className="text-6xl font-bold text-cyan-400">
                {typeof data === "number" ? data.toLocaleString() : "0"}
              </div>
              <div className="mt-2 text-sm text-gray-400">{widget.dataSource}</div>
              <div className="mt-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">
                  +{Math.floor(Math.random() * 20) + 5}% from last period
                </span>
              </div>
            </div>
          )}

          {widget.type === "map" && (
            <div className="flex h-full items-center justify-center">
              <div className="text-center">
                <MapPin className="mx-auto h-16 w-16 text-red-400" />
                <p className="mt-4 text-sm text-gray-400">Geographic visualization</p>
                <p className="text-xs text-gray-500">Map integration coming soon</p>
              </div>
            </div>
          )}
        </CardContent>
        <div className="absolute bottom-2 right-2">
          <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-400">
            <div className="mr-1 h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            LIVE
          </Badge>
        </div>
      </Card>
    )
  }

  const handleAIChat = async () => {
    if (!aiChatInput.trim() || !currentDashboard) return

    const userMessage = aiChatInput.trim()
    setAiChatInput("")
    setAiChatMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsAIThinking(true)

    try {
      // Parse user intent and create widget configuration
      const widgetConfig = parseUserIntent(userMessage)

      if (widgetConfig) {
        // Create the widget
        const newWidget: Widget = {
          id: `widget-${Date.now()}`,
          type: widgetConfig.type,
          title: widgetConfig.title,
          dataSource: widgetConfig.dataSource,
          refreshInterval: widgetConfig.refreshInterval,
          query: widgetConfig.query || "",
          position: { x: 0, y: 0, w: 6, h: 4 },
          config: {},
        }

        const updated = {
          ...currentDashboard,
          widgets: [...currentDashboard.widgets, newWidget],
          updatedAt: new Date().toISOString(),
        }

        setCurrentDashboard(updated)
        const updatedDashboards = dashboards.map((d) => (d.id === updated.id ? updated : d))
        saveDashboards(updatedDashboards)

        const assistantMessage = `I've created a ${widgetConfig.type} chart widget titled "${widgetConfig.title}" that shows ${widgetConfig.dataSource} data. It will refresh every ${widgetConfig.refreshInterval} seconds. You can customize it further by clicking the settings icon on the widget.`

        setAiChatMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }])
      } else {
        const assistantMessage =
          "I can help you create widgets for your dashboard. Try asking me things like:\n\n• Show me network traffic over time\n• Create a pie chart for threat distribution\n• Add a table with recent authentication logs\n• Display cloud security events as a bar chart\n\nWhat would you like to visualize?"

        setAiChatMessages((prev) => [...prev, { role: "assistant", content: assistantMessage }])
      }
    } catch (error) {
      setAiChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I encountered an error creating the widget. Please try rephrasing your request.",
        },
      ])
    } finally {
      setIsAIThinking(false)
    }
  }

  const parseUserIntent = (input: string): Partial<Widget> | null => {
    const lowerInput = input.toLowerCase()

    // Determine widget type
    let type: Widget["type"] = "line"
    if (lowerInput.includes("pie chart") || lowerInput.includes("distribution") || lowerInput.includes("breakdown")) {
      type = "pie"
    } else if (lowerInput.includes("bar chart") || lowerInput.includes("comparison") || lowerInput.includes("top")) {
      type = "bar"
    } else if (
      lowerInput.includes("area chart") ||
      lowerInput.includes("stacked") ||
      lowerInput.includes("cumulative")
    ) {
      type = "area"
    } else if (lowerInput.includes("table") || lowerInput.includes("list") || lowerInput.includes("recent")) {
      type = "table"
    } else if (lowerInput.includes("counter") || lowerInput.includes("total") || lowerInput.includes("count")) {
      type = "counter"
    } else if (lowerInput.includes("map") || lowerInput.includes("geographic") || lowerInput.includes("location")) {
      type = "map"
    } else if (
      lowerInput.includes("line chart") ||
      lowerInput.includes("over time") ||
      lowerInput.includes("timeline") ||
      lowerInput.includes("trend")
    ) {
      type = "line"
    }

    // Determine data source
    let dataSource = "System Health"
    let title = "Custom Widget"

    if (lowerInput.includes("network") || lowerInput.includes("traffic") || lowerInput.includes("protocol")) {
      dataSource = "Network Traffic"
      title = type === "line" ? "Network Traffic Timeline" : type === "bar" ? "Top Network Protocols" : "Network Data"
    } else if (
      lowerInput.includes("auth") ||
      lowerInput.includes("login") ||
      lowerInput.includes("authentication") ||
      lowerInput.includes("user access")
    ) {
      dataSource = "Authentication Logs"
      title =
        type === "line"
          ? "Authentication Activity"
          : type === "bar"
            ? "Authentication by Source"
            : "Authentication Data"
    } else if (lowerInput.includes("cloud") || lowerInput.includes("aws") || lowerInput.includes("azure")) {
      dataSource = "Cloud Security Events"
      title = type === "line" ? "Cloud Events Timeline" : type === "bar" ? "Events by Provider" : "Cloud Security Data"
    } else if (lowerInput.includes("threat") || lowerInput.includes("malware") || lowerInput.includes("attack")) {
      dataSource = "Threat Intelligence"
      title = type === "line" ? "Threat Activity" : type === "bar" ? "Top Threats" : "Threat Intelligence Data"
    } else if (lowerInput.includes("compliance") || lowerInput.includes("violation") || lowerInput.includes("audit")) {
      dataSource = "Compliance Reports" // Updated data source
      title = type === "line" ? "Compliance Trends" : type === "bar" ? "Compliance by Framework" : "Compliance Data"
    } else if (lowerInput.includes("firewall") || lowerInput.includes("blocked") || lowerInput.includes("allowed")) {
      dataSource = "Firewall Logs"
      title = type === "line" ? "Firewall Activity" : type === "bar" ? "Top Blocked IPs" : "Firewall Data"
    } else if (lowerInput.includes("user") || lowerInput.includes("behavior") || lowerInput.includes("activity")) {
      dataSource = "User Activity"
      title = type === "line" ? "User Activity Timeline" : type === "bar" ? "Top Active Users" : "User Activity Data"
    } else if (lowerInput.includes("security dashboard")) {
      dataSource = "Security Dashboard"
      title = type === "line" ? "Security Events Over Time" : "Security Dashboard Overview"
    } else if (lowerInput.includes("cyberthreat radar")) {
      dataSource = "CyberThreat Radar"
      title = type === "line" ? "Threats by Region" : "CyberThreat Overview"
    } else if (lowerInput.includes("security alerts")) {
      dataSource = "Security Alerts"
      title = type === "line" ? "Alerts Over Time" : "Recent Security Alerts"
    } else if (lowerInput.includes("incident management")) {
      dataSource = "Incident Management"
      title = type === "table" ? "Incident Log" : "Incident Status"
    } else if (lowerInput.includes("risk analytics")) {
      dataSource = "Risk Analytics"
      title = type === "line" ? "Risk Trends" : "Risk Assessment"
    } else if (lowerInput.includes("llm risk scoring")) {
      dataSource = "LLM Risk Scoring"
      title = type === "bar" ? "LLM Threat Breakdown" : "LLM Risk Overview"
    } else if (lowerInput.includes("predictive forecasting")) {
      dataSource = "Predictive Forecasting"
      title = type === "line" ? "Forecasted Trends" : "Predictive Analysis"
    } else if (lowerInput.includes("network topology")) {
      dataSource = "Network Topology"
      title = type === "table" ? "Device Inventory" : "Network Structure"
    } else if (lowerInput.includes("ai security posture")) {
      dataSource = "AI Security Posture"
      title = type === "line" ? "Posture Trends" : "AI Security Overview"
    } else if (lowerInput.includes("data pipeline")) {
      dataSource = "Data Pipeline"
      title = type === "line" ? "Pipeline Throughput" : "Data Pipeline Status"
    } else if (lowerInput.includes("playbooks")) {
      dataSource = "Playbooks"
      title = type === "table" ? "Playbook List" : "Playbook Execution Status"
    } else if (lowerInput.includes("hunt console")) {
      dataSource = "Hunt Console"
      title = type === "table" ? "Hunt Queries" : "Hunt Console Overview"
    } else if (lowerInput.includes("knowledge vault")) {
      dataSource = "Knowledge Vault"
      title = type === "bar" ? "Vault Contents" : "Knowledge Base Overview"
    }

    // Determine refresh interval
    let refreshInterval = 15
    if (lowerInput.includes("real-time") || lowerInput.includes("live") || lowerInput.includes("fast")) {
      refreshInterval = 5
    } else if (lowerInput.includes("slow") || lowerInput.includes("minute")) {
      refreshInterval = 60
    }

    return {
      type,
      title,
      dataSource,
      refreshInterval,
    }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <SidebarNav />
      <div className="flex-1 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">Custom Dashboard Builder</h1>
            <p className="text-sm text-gray-400">Create and manage custom SIEM dashboards with live data widgets</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-green-500/30 bg-green-500/10 text-green-400">
              <div className="mr-1 h-2 w-2 animate-pulse rounded-full bg-green-500" />
              LIVE DATA
            </Badge>
            <span className="text-xs text-gray-500">Updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {!currentDashboard ? (
          <Card className="border-gray-700 bg-gray-900/50">
            <CardHeader>
              <CardTitle>Create Your First Dashboard</CardTitle>
              <CardDescription>Start from a template or build a custom dashboard from scratch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => setShowTemplateSelector(true)}
                className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              >
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Start from Template
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-500">Or create from scratch</span>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Dashboard Name</label>
                <Input
                  placeholder="e.g., SOC Overview, Network Monitoring, Threat Intelligence"
                  value={dashboardName}
                  onChange={(e) => setDashboardName(e.target.value)}
                  className="border-gray-700 bg-gray-800 text-white"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">Description</label>
                <Input
                  placeholder="Brief description of this dashboard's purpose"
                  value={dashboardDescription}
                  onChange={(e) => setDashboardDescription(e.target.value)}
                  className="border-gray-700 bg-gray-800 text-white"
                />
              </div>
              <Button onClick={createNewDashboard} variant="outline" className="w-full bg-transparent">
                <Plus className="mr-2 h-4 w-4" />
                Create Blank Dashboard
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <select
                  value={currentDashboard.id}
                  onChange={(e) => {
                    const dashboard = dashboards.find((d) => d.id === e.target.value)
                    if (dashboard) setCurrentDashboard(dashboard)
                  }}
                  className="rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-white"
                >
                  {dashboards.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddWidgetClick}
                  className="border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Widget
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className={isEditing ? "border-cyan-500 bg-cyan-500/10 text-cyan-400" : ""}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  {isEditing ? "Done Editing" : "Edit Widgets"}
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => deleteDashboard(currentDashboard.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDashboardName("")
                    setDashboardDescription("")
                    setCurrentDashboard(null)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Dashboard
                </Button>
              </div>
            </div>

            {currentDashboard.widgets.length === 0 ? (
              <Card className="border-gray-700 bg-gray-900/50">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <LayoutDashboard className="h-16 w-16 text-gray-600" />
                  <p className="mt-4 text-lg font-semibold text-gray-400">No widgets yet</p>
                  <p className="text-sm text-gray-500">Click "Add Widget" to start building your dashboard</p>
                  <Button onClick={() => setShowWidgetLibrary(true)} className="mt-4 bg-cyan-600 hover:bg-cyan-700">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Widget
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentDashboard.widgets.map((widget) => (
                  <div key={widget.id} className="h-80">
                    {renderWidget(widget)}
                  </div>
                ))}
              </div>
            )}

            {currentDashboard.widgets.length > 0 && (
              <>
                <button
                  onClick={handleAddWidgetClick}
                  className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/50 transition-all hover:scale-110 hover:shadow-xl hover:shadow-green-500/60"
                  title="Add Widget"
                >
                  <Plus className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={() => setShowAIChat(true)}
                  className="fixed bottom-24 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 transition-all hover:scale-110 hover:shadow-xl hover:shadow-purple-500/60"
                  title="AI Assistant"
                >
                  <Sparkles className="h-6 w-6 text-white" />
                </button>
              </>
            )}
          </>
        )}

        {showDataSourceSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-2xl border-gray-700 bg-gray-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Select Data Source</CardTitle>
                    <CardDescription>Choose what type of data you want to visualize</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowDataSourceSelector(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 max-h-[60vh] overflow-auto pr-2">
                  {DATA_SOURCES.map((source) => {
                    // Determine icon and color based on data source
                    let icon = Shield
                    let color = "cyan"

                    if (source.includes("Network")) {
                      icon = Network
                      color = "blue"
                    } else if (source.includes("Threat") || source.includes("Alert")) {
                      icon = AlertTriangle
                      color = "red"
                    } else if (source.includes("Cloud")) {
                      icon = Cloud
                      color = "purple"
                    } else if (source.includes("Compliance") || source.includes("Audit")) {
                      icon = FileCheck
                      color = "green"
                    } else if (source.includes("Auth") || source.includes("User")) {
                      icon = Lock
                      color = "orange"
                    }

                    const Icon = icon

                    return (
                      <button
                        key={source}
                        onClick={() => handleDataSourceSelected(source)}
                        className={`flex items-center gap-3 rounded-lg border border-${color}-500/30 bg-${color}-500/10 p-4 text-left transition-all hover:border-${color}-500/50 hover:bg-${color}-500/20`}
                      >
                        <div className={`rounded-lg border border-${color}-500/30 bg-${color}-500/10 p-2`}>
                          <Icon className={`h-5 w-5 text-${color}-400`} />
                        </div>
                        <span className={`text-sm font-semibold text-${color}-400`}>{source}</span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Widget Library Modal */}
        {showWidgetLibrary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-2xl border-gray-700 bg-gray-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Widget Library</CardTitle>
                    <CardDescription>
                      Choose a widget type for <span className="text-cyan-400 font-semibold">{selectedDataSource}</span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowWidgetLibrary(false)
                      setSelectedDataSource("")
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {WIDGET_TYPES.map((widgetType) => {
                    const Icon = widgetType.icon
                    return (
                      <button
                        key={widgetType.type}
                        onClick={() => addWidget(widgetType.type)}
                        className={`flex flex-col items-center gap-3 rounded-lg border border-${widgetType.color}-500/30 bg-${widgetType.color}-500/10 p-6 transition-all hover:border-${widgetType.color}-500/50 hover:bg-${widgetType.color}-500/20`}
                      >
                        <Icon className={`h-8 w-8 text-${widgetType.color}-400`} />
                        <span className={`text-sm font-semibold text-${widgetType.color}-400`}>{widgetType.label}</span>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Widget Configuration Modal */}
        {selectedWidget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <Card className="w-full max-w-lg border-gray-700 bg-gray-900">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Configure Widget</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedWidget(null)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Widget Title</label>
                  <Input
                    value={selectedWidget.title}
                    onChange={(e) => updateWidget(selectedWidget.id, { title: e.target.value })}
                    className="border-gray-700 bg-gray-800 text-white"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Data Source</label>
                  <select
                    value={selectedWidget.dataSource}
                    onChange={(e) => updateWidget(selectedWidget.id, { dataSource: e.target.value })}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                  >
                    {DATA_SOURCES.map((source) => (
                      <option key={source} value={source}>
                        {source}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Refresh Interval</label>
                  <select
                    value={selectedWidget.refreshInterval}
                    onChange={(e) => updateWidget(selectedWidget.id, { refreshInterval: Number(e.target.value) })}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white"
                  >
                    {REFRESH_INTERVALS.map((interval) => (
                      <option key={interval.value} value={interval.value}>
                        {interval.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Query (Optional)</label>
                  <Input
                    value={selectedWidget.query}
                    onChange={(e) => updateWidget(selectedWidget.id, { query: e.target.value })}
                    placeholder="e.g., source_ip:192.168.* AND severity:high"
                    className="border-gray-700 bg-gray-800 text-white"
                  />
                </div>
                <Button onClick={() => setSelectedWidget(null)} className="w-full bg-cyan-600 hover:bg-cyan-700">
                  <Save className="mr-2 h-4 w-4" />
                  Save Configuration
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {showTemplateSelector && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-5xl border-gray-700 bg-gray-900 max-h-[90vh] overflow-auto">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Dashboard Templates</CardTitle>
                    <CardDescription>Choose a pre-configured dashboard to get started quickly</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowTemplateSelector(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {DASHBOARD_TEMPLATES.map((template) => {
                    const Icon = template.icon
                    return (
                      <Card
                        key={template.id}
                        className={`cursor-pointer border-${template.color}-500/30 bg-${template.color}-500/5 transition-all hover:border-${template.color}-500/50 hover:bg-${template.color}-500/10`}
                        onClick={() => createFromTemplate(template)}
                      >
                        <CardHeader>
                          <div className="flex items-start gap-3">
                            <div
                              className={`rounded-lg border border-${template.color}-500/30 bg-${template.color}-500/10 p-2`}
                            >
                              <Icon className={`h-6 w-6 text-${template.color}-400`} />
                            </div>
                            <div className="flex-1">
                              <CardTitle className="text-base">{template.name}</CardTitle>
                              <CardDescription className="mt-1 text-xs">{template.description}</CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between text-xs text-gray-400">
                            <span>{template.widgets.length} widgets</span>
                            <Badge
                              variant="outline"
                              className={`border-${template.color}-500/30 text-${template.color}-400`}
                            >
                              Ready to use
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {showAIChat && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <Card className="w-full max-w-2xl border-gray-700 bg-gray-900 flex flex-col max-h-[80vh]">
              <CardHeader className="border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-2">
                      <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">AI Dashboard Assistant</CardTitle>
                      <CardDescription>Describe what you want to visualize, and I'll create it for you</CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setShowAIChat(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto p-4 space-y-4">
                {aiChatMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <MessageSquare className="h-16 w-16 text-purple-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-300 mb-2">How can I help you today?</h3>
                    <p className="text-sm text-gray-400 mb-6 max-w-md">
                      I can help you create widgets for your dashboard. Just tell me what you want to see!
                    </p>
                    <div className="grid grid-cols-1 gap-2 w-full max-w-md text-left">
                      <button
                        onClick={() => setAiChatInput("Show me network traffic over time")}
                        className="p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 text-sm text-purple-300 hover:bg-purple-500/20 transition-colors text-left"
                      >
                        💡 Show me network traffic over time
                      </button>
                      <button
                        onClick={() => setAiChatInput("Create a pie chart for threat distribution")}
                        className="p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 text-sm text-purple-300 hover:bg-purple-500/20 transition-colors text-left"
                      >
                        💡 Create a pie chart for threat distribution
                      </button>
                      <button
                        onClick={() => setAiChatInput("Add a table with recent authentication logs")}
                        className="p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 text-sm text-purple-300 hover:bg-purple-500/20 transition-colors text-left"
                      >
                        💡 Add a table with recent authentication logs
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {aiChatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.role === "user"
                              ? "bg-cyan-600 text-white"
                              : "bg-gray-800 text-gray-200 border border-gray-700"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    ))}
                    {isAIThinking && (
                      <div className="flex justify-start">
                        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse" />
                              <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse delay-75" />
                              <div className="h-2 w-2 rounded-full bg-purple-400 animate-pulse delay-150" />
                            </div>
                            <span className="text-sm text-gray-400">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
              <div className="border-t border-gray-700 p-4">
                <div className="flex items-center gap-2">
                  <Input
                    value={aiChatInput}
                    onChange={(e) => setAiChatInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleAIChat()
                      }
                    }}
                    placeholder="Describe the widget you want to create..."
                    className="flex-1 border-gray-700 bg-gray-800 text-white"
                    disabled={isAIThinking}
                  />
                  <Button
                    onClick={handleAIChat}
                    disabled={!aiChatInput.trim() || isAIThinking}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
