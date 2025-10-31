"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Clock,
  Download,
  FileText,
  Search,
  TrendingDown,
  TrendingUp,
  Zap,
  Eye,
  RefreshCw,
  Users,
  Shield,
  Target,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Area,
  AreaChart,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { SidebarNav } from "@/components/sidebar-nav";

interface TrafficLog {
  id: string;
  timestamp: Date;
  source: string;
  user: string;
  action: string;
  behaviorScore: number;
  latency: number;
  status: "blocked" | "allowed" | "flagged";
  intent: string;
  model: string;
}

interface AnomalyEvent {
  id: string;
  timestamp: Date;
  type: string;
  severity: "critical" | "high" | "medium" | "low";
  description: string;
  sessionId: string;
  user: string;
  intentShift: number;
  behaviorChange: number;
}

interface PerformanceMetric {
  timestamp: Date;
  latency: number;
  throughput: number;
  falsePositives: number;
  falseNegatives: number;
  cpuUsage: number;
  memoryUsage: number;
}

export default function AnalyticsView() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  const [trafficLogs, setTrafficLogs] = useState<TrafficLog[]>([]);
  const [anomalies, setAnomalies] = useState<AnomalyEvent[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceMetric[]>(
    []
  );
  const [selectedLog, setSelectedLog] = useState<TrafficLog | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AnomalyEvent | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [behaviorFilter, setBehaviorFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("24h");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState<string[]>([]);

  useEffect(() => {
    const generateTrafficLogs = () => {
      const logs: TrafficLog[] = [];
      const actions = [
        "prompt_analysis",
        "response_generation",
        "embedding_lookup",
        "model_inference",
      ];
      const intents = [
        "information_seeking",
        "code_generation",
        "creative_writing",
        "data_extraction",
        "jailbreak_attempt",
      ];
      const models = [
        "vts-llm-1",
        "vts-llm-2",
        "client-model-a",
        "client-model-b",
      ]; // Replaced specific models with VTS/Client models
      const users = [
        "user_001",
        "user_002",
        "user_003",
        "admin_001",
        "service_account",
      ];
      const statuses: ("blocked" | "allowed" | "flagged")[] = [
        "blocked",
        "allowed",
        "flagged",
      ];

      for (let i = 0; i < 50; i++) {
        const behaviorScore = Math.random();
        logs.push({
          id: `log_${i}`,
          timestamp: new Date(Date.now() - Math.random() * 86400000),
          source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
            Math.random() * 255
          )}`,
          user: users[Math.floor(Math.random() * users.length)],
          action: actions[Math.floor(Math.random() * actions.length)],
          behaviorScore,
          latency: Math.random() * 500 + 50,
          status:
            behaviorScore > 0.7
              ? "blocked"
              : behaviorScore > 0.4
              ? "flagged"
              : "allowed",
          intent: intents[Math.floor(Math.random() * intents.length)],
          model: models[Math.floor(Math.random() * models.length)],
        });
      }
      return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    };

    setTrafficLogs(generateTrafficLogs());
  }, []);

  useEffect(() => {
    const generateAnomalies = () => {
      const anomalies: AnomalyEvent[] = [];
      const types = [
        "Intent Shift",
        "Behavior Escalation",
        "Pattern Deviation",
        "Session Anomaly",
        "Velocity Spike",
      ];
      const severities: ("critical" | "high" | "medium" | "low")[] = [
        "critical",
        "high",
        "medium",
        "low",
      ];
      const users = ["user_001", "user_002", "user_003", "admin_001"];

      for (let i = 0; i < 30; i++) {
        anomalies.push({
          id: `anomaly_${i}`,
          timestamp: new Date(Date.now() - Math.random() * 86400000),
          type: types[Math.floor(Math.random() * types.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          description: `Detected unusual ${types[
            Math.floor(Math.random() * types.length)
          ].toLowerCase()} in user session`,
          sessionId: `session_${Math.floor(Math.random() * 1000)}`,
          user: users[Math.floor(Math.random() * users.length)],
          intentShift: Math.random() * 0.8 + 0.2,
          behaviorChange: Math.random() * 0.9 + 0.1,
        });
      }
      return anomalies.sort(
        (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
      );
    };

    setAnomalies(generateAnomalies());
  }, []);

  useEffect(() => {
    const generatePerformanceData = () => {
      const data: PerformanceMetric[] = [];
      const now = Date.now();

      for (let i = 23; i >= 0; i--) {
        data.push({
          timestamp: new Date(now - i * 3600000),
          latency: Math.random() * 100 + 50,
          throughput: Math.random() * 1000 + 500,
          falsePositives: Math.random() * 10,
          falseNegatives: Math.random() * 5,
          cpuUsage: Math.random() * 40 + 30,
          memoryUsage: Math.random() * 30 + 40,
        });
      }
      return data;
    };

    setPerformanceData(generatePerformanceData());
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setTrafficLogs((prev) => {
        const newLog: TrafficLog = {
          id: `log_${Date.now()}`,
          timestamp: new Date(),
          source: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(
            Math.random() * 255
          )}`,
          user: ["user_001", "user_002", "user_003"][
            Math.floor(Math.random() * 3)
          ],
          action: ["prompt_analysis", "response_generation"][
            Math.floor(Math.random() * 2)
          ],
          behaviorScore: Math.random(),
          latency: Math.random() * 500 + 50,
          status:
            Math.random() > 0.7
              ? "blocked"
              : Math.random() > 0.4
              ? "flagged"
              : "allowed",
          intent: ["information_seeking", "code_generation"][
            Math.floor(Math.random() * 2)
          ],
          model: ["vts-llm-1", "vts-llm-2"][Math.floor(Math.random() * 2)], // Replaced specific models with VTS models
        };
        return [newLog, ...prev].slice(0, 100);
      });

      // Update performance data
      setPerformanceData((prev) => {
        const newMetric: PerformanceMetric = {
          timestamp: new Date(),
          latency: Math.random() * 100 + 50,
          throughput: Math.random() * 1000 + 500,
          falsePositives: Math.random() * 10,
          falseNegatives: Math.random() * 5,
          cpuUsage: Math.random() * 40 + 30,
          memoryUsage: Math.random() * 30 + 40,
        };
        return [...prev.slice(1), newMetric];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const filteredLogs = trafficLogs.filter((log) => {
    const matchesSearch =
      searchQuery === "" ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.includes(searchQuery) ||
      log.intent.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesBehavior =
      behaviorFilter === "all" ||
      (behaviorFilter === "high" && log.behaviorScore > 0.7) ||
      (behaviorFilter === "medium" &&
        log.behaviorScore > 0.4 &&
        log.behaviorScore <= 0.7) ||
      (behaviorFilter === "low" && log.behaviorScore <= 0.4);

    const matchesStatus = statusFilter === "all" || log.status === statusFilter;

    return matchesSearch && matchesBehavior && matchesStatus;
  });

  const overviewMetrics = {
    totalRequests: trafficLogs.length,
    blockedRequests: trafficLogs.filter((l) => l.status === "blocked").length,
    avgLatency:
      trafficLogs.reduce((sum, l) => sum + l.latency, 0) / trafficLogs.length,
    avgBehaviorScore:
      trafficLogs.reduce((sum, l) => sum + l.behaviorScore, 0) /
      trafficLogs.length,
    criticalAnomalies: anomalies.filter((a) => a.severity === "critical")
      .length,
    falsePositiveRate:
      performanceData.length > 0
        ? performanceData.reduce((sum, p) => sum + p.falsePositives, 0) /
          performanceData.length
        : 0,
  };

  const handleExport = (type: string) => {
    let data: any[] = [];
    let filename = "";

    switch (type) {
      case "traffic":
        data = filteredLogs;
        filename = "traffic_logs.json";
        break;
      case "anomalies":
        data = anomalies;
        filename = "anomalies.json";
        break;
      case "performance":
        data = performanceData;
        filename = "performance_metrics.json";
        break;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Export Successful",
      description: `${filename} has been downloaded`,
    });
  };

  const handleGenerateReport = () => {
    if (selectedReportType.length === 0) {
      toast({
        title: "No Report Type Selected",
        description: "Please select at least one report type",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Report Generated",
      description: `Audit report with ${selectedReportType.join(
        ", "
      )} has been generated`,
    });
    setReportDialogOpen(false);
    setSelectedReportType([]);
  };

  return (
    <div className="flex h-screen">
      {/* ✅ Sidebar */}
      <SidebarNav />
      {/* ✅ Main Content */}
      <div className="flex flex-1 flex-col overflow-y-auto hide-scrollbar text-white m-6">
        <div className="space-y-6 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Monitoring & Analytics
              </h1>
              <p className="text-muted-foreground">
                Continuous oversight with behavioral forensics and semantic
                logging
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${
                    autoRefresh ? "animate-spin" : ""
                  }`}
                />
                {autoRefresh ? "Auto-Refresh On" : "Auto-Refresh Off"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setReportDialogOpen(true)}
              >
                <FileText className="mr-2 h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="traffic">Traffic Logs</TabsTrigger>
              <TabsTrigger value="anomalies">Anomaly Timeline</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="forensics">Forensics</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Requests
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {overviewMetrics.totalRequests.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last 24 hours
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Blocked
                    </CardTitle>
                    <Shield className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {overviewMetrics.blockedRequests}
                    </div>
                    <p className="text-xs text-destructive">
                      {(
                        (overviewMetrics.blockedRequests /
                          overviewMetrics.totalRequests) *
                        100
                      ).toFixed(1)}
                      % of total
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg Latency
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {overviewMetrics.avgLatency.toFixed(0)}ms
                    </div>
                    <p className="text-xs text-chart-2">
                      <TrendingDown className="inline h-3 w-3" /> -5ms from avg
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Behavior Score
                    </CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(overviewMetrics.avgBehaviorScore * 100).toFixed(1)}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Average risk level
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Critical Anomalies
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {overviewMetrics.criticalAnomalies}
                    </div>
                    <p className="text-xs text-destructive">
                      Requires attention
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      False Positive Rate
                    </CardTitle>
                    <TrendingDown className="h-4 w-4 text-chart-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {overviewMetrics.falsePositiveRate.toFixed(2)}%
                    </div>
                    <p className="text-xs text-chart-2">
                      Within acceptable range
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Request Volume & Latency</CardTitle>
                    <CardDescription>
                      Traffic patterns over the last 24 hours
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        throughput: {
                          label: "Throughput",
                          color: "hsl(var(--chart-1))",
                        },
                        latency: {
                          label: "Latency (ms)",
                          color: "hsl(var(--chart-2))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <AreaChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={(value) =>
                            new Date(value).getHours() + ":00"
                          }
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend
                          content={<ChartLegendContent payload={undefined} />}
                        />
                        <Area
                          type="monotone"
                          dataKey="throughput"
                          stroke="hsl(var(--chart-1))"
                          fill="hsl(var(--chart-1))"
                          fillOpacity={0.2}
                        />
                        <Area
                          type="monotone"
                          dataKey="latency"
                          stroke="hsl(var(--chart-2))"
                          fill="hsl(var(--chart-2))"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>False Positive/Negative Trends</CardTitle>
                    <CardDescription>
                      Detection accuracy over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer
                      config={{
                        falsePositives: {
                          label: "False Positives",
                          color: "hsl(var(--chart-4))",
                        },
                        falseNegatives: {
                          label: "False Negatives",
                          color: "hsl(var(--chart-5))",
                        },
                      }}
                      className="h-[300px]"
                    >
                      <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={(value) =>
                            new Date(value).getHours() + ":00"
                          }
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <ChartLegend
                          content={<ChartLegendContent payload={undefined} />}
                        />
                        <Line
                          type="monotone"
                          dataKey="falsePositives"
                          stroke="hsl(var(--chart-4))"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="falseNegatives"
                          stroke="hsl(var(--chart-5))"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="traffic" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Live Traffic Logs</CardTitle>
                      <CardDescription>
                        Real-time request monitoring with behavioral scoring
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport("traffic")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Search by user, IP, or intent..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Select
                      value={behaviorFilter}
                      onValueChange={setBehaviorFilter}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Behavior Score" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Scores</SelectItem>
                        <SelectItem value="high">
                          High Risk (&gt;70%)
                        </SelectItem>
                        <SelectItem value="medium">
                          Medium Risk (40-70%)
                        </SelectItem>
                        <SelectItem value="low">Low Risk (&lt;40%)</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="flagged">Flagged</SelectItem>
                        <SelectItem value="allowed">Allowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {filteredLogs.map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center gap-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedLog(log)}
                        >
                          <div className="flex-shrink-0">
                            <Badge
                              variant={
                                log.status === "blocked"
                                  ? "destructive"
                                  : log.status === "flagged"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {log.status}
                            </Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium truncate">
                                {log.user}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                •
                              </span>
                              <p className="text-xs text-muted-foreground font-mono">
                                {log.source}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground">
                                {log.action}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                •
                              </span>
                              <p className="text-xs text-muted-foreground">
                                {log.intent}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                •
                              </span>
                              <p className="text-xs text-muted-foreground">
                                {log.model}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {(log.behaviorScore * 100).toFixed(0)}%
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Risk Score
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {log.latency.toFixed(0)}ms
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Latency
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground">
                                {log.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="anomalies" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Anomaly Timeline</CardTitle>
                      <CardDescription>
                        Session graphs showing intent shifts and behavioral
                        changes
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExport("anomalies")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px]">
                    <div className="space-y-4">
                      {anomalies.map((anomaly) => (
                        <div
                          key={anomaly.id}
                          className="flex items-start gap-4 rounded-lg border p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedAnomaly(anomaly)}
                        >
                          <div className="flex-shrink-0 mt-1">
                            <div
                              className={`h-3 w-3 rounded-full ${
                                anomaly.severity === "critical"
                                  ? "bg-destructive animate-pulse"
                                  : anomaly.severity === "high"
                                  ? "bg-orange-500"
                                  : anomaly.severity === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge
                                variant={
                                  anomaly.severity === "critical" ||
                                  anomaly.severity === "high"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {anomaly.severity}
                              </Badge>
                              <p className="text-sm font-medium">
                                {anomaly.type}
                              </p>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {anomaly.description}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>User: {anomaly.user}</span>
                              <span>•</span>
                              <span>Session: {anomaly.sessionId}</span>
                              <span>•</span>
                              <span>{anomaly.timestamp.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-4 mt-2">
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-destructive"
                                    style={{
                                      width: `${anomaly.intentShift * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  Intent Shift:{" "}
                                  {(anomaly.intentShift * 100).toFixed(0)}%
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-24 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-orange-500"
                                    style={{
                                      width: `${anomaly.behaviorChange * 100}%`,
                                    }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  Behavior Change:{" "}
                                  {(anomaly.behaviorChange * 100).toFixed(0)}%
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            Investigate
                          </Button>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Avg Latency
                    </CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(
                        performanceData.reduce((sum, p) => sum + p.latency, 0) /
                        performanceData.length
                      ).toFixed(0)}
                      ms
                    </div>
                    <p className="text-xs text-chart-2">
                      <TrendingDown className="inline h-3 w-3" /> -8ms from
                      yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Throughput
                    </CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(
                        performanceData.reduce(
                          (sum, p) => sum + p.throughput,
                          0
                        ) / performanceData.length
                      ).toFixed(0)}
                      /s
                    </div>
                    <p className="text-xs text-chart-2">
                      <TrendingUp className="inline h-3 w-3" /> +12% from
                      yesterday
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      CPU Usage
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(
                        performanceData.reduce(
                          (sum, p) => sum + p.cpuUsage,
                          0
                        ) / performanceData.length
                      ).toFixed(1)}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Within normal range
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Memory Usage
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {(
                        performanceData.reduce(
                          (sum, p) => sum + p.memoryUsage,
                          0
                        ) / performanceData.length
                      ).toFixed(1)}
                      %
                    </div>
                    <p className="text-xs text-muted-foreground">Stable</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>System Performance Over Time</CardTitle>
                  <CardDescription>
                    Latency, throughput, and resource utilization (last 24
                    hours)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      latency: {
                        label: "Latency (ms)",
                        color: "hsl(var(--chart-1))",
                      },
                      cpuUsage: {
                        label: "CPU Usage (%)",
                        color: "hsl(var(--chart-2))",
                      },
                      memoryUsage: {
                        label: "Memory Usage (%)",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[400px]"
                  >
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) =>
                          new Date(value).getHours() + ":00"
                        }
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend
                        content={<ChartLegendContent payload={undefined} />}
                      />
                      <Line
                        type="monotone"
                        dataKey="latency"
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="cpuUsage"
                        stroke="hsl(var(--chart-2))"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="memoryUsage"
                        stroke="hsl(var(--chart-3))"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Detection Accuracy Metrics</CardTitle>
                  <CardDescription>
                    False positive and false negative rates over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      falsePositives: {
                        label: "False Positives",
                        color: "hsl(var(--chart-4))",
                      },
                      falseNegatives: {
                        label: "False Negatives",
                        color: "hsl(var(--chart-5))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <BarChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="timestamp"
                        tickFormatter={(value) =>
                          new Date(value).getHours() + ":00"
                        }
                      />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend
                        content={<ChartLegendContent payload={undefined} />}
                      />
                      <Bar
                        dataKey="falsePositives"
                        fill="hsl(var(--chart-4))"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="falseNegatives"
                        fill="hsl(var(--chart-5))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="forensics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Behavioral Forensics</CardTitle>
                  <CardDescription>
                    Deep dive analysis of user sessions and behavioral patterns
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Top Users by Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            "user_001",
                            "user_002",
                            "user_003",
                            "admin_001",
                          ].map((user, idx) => {
                            const userLogs = trafficLogs.filter(
                              (l) => l.user === user
                            );
                            const avgScore =
                              userLogs.reduce(
                                (sum, l) => sum + l.behaviorScore,
                                0
                              ) / userLogs.length;
                            return (
                              <div
                                key={user}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span className="text-sm font-medium">
                                    {user}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <span className="text-sm text-muted-foreground">
                                    {userLogs.length} requests
                                  </span>
                                  <Badge
                                    variant={
                                      avgScore > 0.5
                                        ? "destructive"
                                        : "secondary"
                                    }
                                  >
                                    {(avgScore * 100).toFixed(0)}% risk
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">
                          Intent Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {[
                            "information_seeking",
                            "code_generation",
                            "creative_writing",
                            "data_extraction",
                            "jailbreak_attempt",
                          ].map((intent) => {
                            const intentLogs = trafficLogs.filter(
                              (l) => l.intent === intent
                            );
                            const percentage =
                              (intentLogs.length / trafficLogs.length) * 100;
                            return (
                              <div key={intent} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="capitalize">
                                    {intent.replace("_", " ")}
                                  </span>
                                  <span className="text-muted-foreground">
                                    {percentage.toFixed(1)}%
                                  </span>
                                </div>
                                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-primary"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Session Analysis
                      </CardTitle>
                      <CardDescription>
                        Detailed breakdown of user sessions and behavioral
                        patterns
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Select a user or session from the Traffic Logs or
                        Anomaly Timeline to view detailed forensic analysis
                        including session replay, intent progression, and
                        behavioral fingerprinting.
                      </p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog
            open={!!selectedLog}
            onOpenChange={() => setSelectedLog(null)}
          >
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Traffic Log Details</DialogTitle>
                <DialogDescription>
                  Comprehensive analysis of request behavior and semantics
                </DialogDescription>
              </DialogHeader>
              {selectedLog && (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        User
                      </Label>
                      <p className="text-sm font-medium">{selectedLog.user}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Source IP
                      </Label>
                      <p className="text-sm font-mono">{selectedLog.source}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Action
                      </Label>
                      <p className="text-sm">{selectedLog.action}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Model
                      </Label>
                      <p className="text-sm">{selectedLog.model}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Intent
                      </Label>
                      <p className="text-sm capitalize">
                        {selectedLog.intent.replace("_", " ")}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Status
                      </Label>
                      <Badge
                        variant={
                          selectedLog.status === "blocked"
                            ? "destructive"
                            : selectedLog.status === "flagged"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedLog.status}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Behavior Score
                    </Label>
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            selectedLog.behaviorScore > 0.7
                              ? "bg-destructive"
                              : selectedLog.behaviorScore > 0.4
                              ? "bg-orange-500"
                              : "bg-chart-2"
                          }`}
                          style={{
                            width: `${selectedLog.behaviorScore * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {(selectedLog.behaviorScore * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Latency
                      </Label>
                      <p className="text-sm font-medium">
                        {selectedLog.latency.toFixed(2)}ms
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Timestamp
                      </Label>
                      <p className="text-sm">
                        {selectedLog.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Full Session
                    </Button>
                    <Button variant="outline" size="sm">
                      Block User
                    </Button>
                    <Button variant="outline" size="sm">
                      Export Details
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog
            open={!!selectedAnomaly}
            onOpenChange={() => setSelectedAnomaly(null)}
          >
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Anomaly Details</DialogTitle>
                <DialogDescription>
                  Behavioral forensics and intent shift analysis
                </DialogDescription>
              </DialogHeader>
              {selectedAnomaly && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        selectedAnomaly.severity === "critical" ||
                        selectedAnomaly.severity === "high"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {selectedAnomaly.severity}
                    </Badge>
                    <h3 className="text-lg font-semibold">
                      {selectedAnomaly.type}
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {selectedAnomaly.description}
                  </p>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        User
                      </Label>
                      <p className="text-sm font-medium">
                        {selectedAnomaly.user}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Session ID
                      </Label>
                      <p className="text-sm font-mono">
                        {selectedAnomaly.sessionId}
                      </p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Timestamp
                      </Label>
                      <p className="text-sm">
                        {selectedAnomaly.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Intent Shift
                      </Label>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-destructive"
                            style={{
                              width: `${selectedAnomaly.intentShift * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {(selectedAnomaly.intentShift * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>

                    <div>
                      <Label className="text-xs text-muted-foreground">
                        Behavior Change
                      </Label>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex-1 h-3 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500"
                            style={{
                              width: `${selectedAnomaly.behaviorChange * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {(selectedAnomaly.behaviorChange * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      View Session Timeline
                    </Button>
                    <Button variant="outline" size="sm">
                      Create Incident
                    </Button>
                    <Button variant="outline" size="sm">
                      Export Analysis
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Generate Audit Report</DialogTitle>
                <DialogDescription>
                  Select the data to include in your exportable audit report
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-3">
                  {[
                    {
                      id: "traffic",
                      label: "Traffic Logs",
                      description: "All request logs with behavioral scores",
                    },
                    {
                      id: "anomalies",
                      label: "Anomaly Events",
                      description: "Intent shifts and behavioral changes",
                    },
                    {
                      id: "performance",
                      label: "Performance Metrics",
                      description: "Latency, throughput, and accuracy data",
                    },
                    {
                      id: "threats",
                      label: "Threat Summary",
                      description: "Detected threats and blocked requests",
                    },
                    {
                      id: "compliance",
                      label: "Compliance Data",
                      description: "Audit trail and policy enforcement",
                    },
                  ].map((type) => (
                    <div key={type.id} className="flex items-start gap-3">
                      <Checkbox
                        id={type.id}
                        checked={selectedReportType.includes(type.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedReportType([
                              ...selectedReportType,
                              type.id,
                            ]);
                          } else {
                            setSelectedReportType(
                              selectedReportType.filter((t) => t !== type.id)
                            );
                          }
                        }}
                      />
                      <div className="space-y-1">
                        <Label
                          htmlFor={type.id}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {type.label}
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {type.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleGenerateReport} className="flex-1">
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setReportDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
