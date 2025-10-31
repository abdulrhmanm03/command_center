"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Database,
  GitBranch,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowRight,
  RefreshCw,
  Eye,
  Play,
  Ban,
  Check,
  Download,
  Search,
  Activity,
  FileText,
  Settings,
  Trash2,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Zap,
  Shield,
  AlertCircle,
  BarChart3,
  Network,
} from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { SidebarNav } from "@/components/sidebar-nav";

interface DataSource {
  id: string;
  name: string;
  type: "internal" | "external";
  status: "active" | "inactive" | "warning";
  lastAccess: string;
  totalRequests: number;
  dataVolume: string;
  location: string;
  latency: number;
  errorRate: number;
  dependencies: string[];
  tags: string[];
}

interface ETLJob {
  id: string;
  name: string;
  source: string;
  target: string;
  transformations: string[];
  timestamp: string;
  status: "success" | "failed" | "running" | "queued";
  duration: string;
  recordsProcessed: number;
  errorMessage?: string;
  logs: string[];
  retryCount: number;
  schedule: string;
  owner: string;
}

interface FeatureAccess {
  id: string;
  feature: string;
  model: string;
  frequency: number;
  lastAccess: string;
  anomaly: boolean;
  avgLatency: number;
  dataSize: string;
  usageHistory: { time: string; count: number }[];
  qualityScore: number;
}

interface ModelDrift {
  id: string;
  model: string;
  previousVersion: string;
  currentVersion: string;
  changeType: "version" | "parameters" | "architecture";
  timestamp: string;
  authorized: boolean;
  changedBy: string;
  reason?: string;
  impactScore: number;
  affectedPipelines: string[];
}

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  status: "success" | "failed";
  details: string;
}

export default function PipelineDataflowView() {
  const [dataSources, setDataSources] = useState<DataSource[]>([]);
  const [etlJobs, setETLJobs] = useState<ETLJob[]>([]);
  const [featureAccess, setFeatureAccess] = useState<FeatureAccess[]>([]);
  const [modelDrift, setModelDrift] = useState<ModelDrift[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedModel, setSelectedModel] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [dateRange, setDateRange] = useState<string>("24h");

  const [selectedDetail, setSelectedDetail] = useState<any>(null);
  const [detailType, setDetailType] = useState<string>("");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCompareDialog, setShowCompareDialog] = useState(false);
  const [compareItems, setCompareItems] = useState<any[]>([]);

  const { toast } = useToast();

  useEffect(() => {
    setDataSources([
      {
        id: "ds-1",
        name: "Internal Training DB",
        type: "internal",
        status: "active",
        lastAccess: "2 min ago",
        totalRequests: 15234,
        dataVolume: "2.3 TB",
        location: "us-east-1",
        latency: 45,
        errorRate: 0.02,
        dependencies: ["ETL-Pipeline-1", "Feature-Store"],
        tags: ["production", "training"],
      },
      {
        id: "ds-2",
        name: "External API - DataCorp",
        type: "external",
        status: "warning",
        lastAccess: "5 min ago",
        totalRequests: 8921,
        dataVolume: "1.1 TB",
        location: "eu-west-1",
        latency: 234,
        errorRate: 2.3,
        dependencies: ["ETL-Pipeline-2"],
        tags: ["external", "third-party"],
      },
      {
        id: "ds-3",
        name: "User Upload Storage",
        type: "internal",
        status: "active",
        lastAccess: "1 min ago",
        totalRequests: 23456,
        dataVolume: "4.7 TB",
        location: "us-west-2",
        latency: 32,
        errorRate: 0.01,
        dependencies: ["Validation-Pipeline"],
        tags: ["production", "user-data"],
      },
      {
        id: "ds-4",
        name: "Third-party Dataset",
        type: "external",
        status: "inactive",
        lastAccess: "2 hours ago",
        totalRequests: 342,
        dataVolume: "156 GB",
        location: "ap-south-1",
        latency: 567,
        errorRate: 0.5,
        dependencies: [],
        tags: ["archived"],
      },
    ]);

    setETLJobs([
      {
        id: "etl-1",
        name: "Data Sanitization Pipeline",
        source: "External API - DataCorp",
        target: "Training Dataset",
        transformations: ["Remove PII", "Normalize text", "Tokenization"],
        timestamp: "3 min ago",
        status: "success",
        duration: "2m 34s",
        recordsProcessed: 12450,
        logs: [
          "[INFO] Pipeline started at 14:32:01",
          "[INFO] Connected to source: External API - DataCorp",
          "[INFO] Processing 12,450 records",
          "[INFO] Applied PII removal: 234 fields redacted",
          "[INFO] Text normalization complete",
          "[INFO] Tokenization complete: avg 156 tokens/record",
          "[SUCCESS] Pipeline completed successfully",
        ],
        retryCount: 0,
        schedule: "Every 15 minutes",
        owner: "data-team@company.com",
      },
      {
        id: "etl-2",
        name: "Feature Engineering",
        source: "Internal Training DB",
        target: "Feature Store",
        transformations: [
          "Extract embeddings",
          "Calculate statistics",
          "Apply filters",
        ],
        timestamp: "1 min ago",
        status: "running",
        duration: "1m 12s",
        recordsProcessed: 8923,
        logs: [
          "[INFO] Pipeline started at 14:35:12",
          "[INFO] Extracting embeddings using model: text-embedding-3-large",
          "[PROGRESS] 8,923 / 15,000 records processed (59%)",
        ],
        retryCount: 0,
        schedule: "Every 30 minutes",
        owner: "ml-ops@company.com",
      },
      {
        id: "etl-3",
        name: "Data Validation",
        source: "User Upload Storage",
        target: "Inference Queue",
        transformations: ["Schema validation", "Quality checks"],
        timestamp: "5 min ago",
        status: "failed",
        duration: "45s",
        recordsProcessed: 3421,
        errorMessage:
          "Schema mismatch: expected field 'user_id' not found in 234 records",
        logs: [
          "[INFO] Pipeline started at 14:30:45",
          "[INFO] Validating schema for 3,421 records",
          "[ERROR] Schema validation failed: missing required field 'user_id'",
          "[ERROR] Failed records: 234 / 3,421 (6.8%)",
          "[FAILED] Pipeline terminated with errors",
        ],
        retryCount: 2,
        schedule: "On demand",
        owner: "data-team@company.com",
      },
    ]);

    setFeatureAccess([
      {
        id: "fa-1",
        feature: "user_embeddings",
        model: "gpt-4",
        frequency: 1247,
        lastAccess: "1 min ago",
        anomaly: false,
        avgLatency: 45,
        dataSize: "2.3 MB",
        usageHistory: [
          { time: "14:00", count: 120 },
          { time: "14:15", count: 145 },
          { time: "14:30", count: 132 },
        ],
        qualityScore: 98.5,
      },
      {
        id: "fa-2",
        feature: "context_vectors",
        model: "claude-3",
        frequency: 892,
        lastAccess: "2 min ago",
        anomaly: false,
        avgLatency: 32,
        dataSize: "1.8 MB",
        usageHistory: [
          { time: "14:00", count: 89 },
          { time: "14:15", count: 92 },
          { time: "14:30", count: 87 },
        ],
        qualityScore: 99.2,
      },
      {
        id: "fa-3",
        feature: "sentiment_scores",
        model: "gpt-4",
        frequency: 3421,
        lastAccess: "30 sec ago",
        anomaly: true,
        avgLatency: 78,
        dataSize: "5.2 MB",
        usageHistory: [
          { time: "14:00", count: 234 },
          { time: "14:15", count: 1245 },
          { time: "14:30", count: 1942 },
        ],
        qualityScore: 87.3,
      },
    ]);

    setModelDrift([
      {
        id: "md-1",
        model: "gpt-4",
        previousVersion: "gpt-4-0613",
        currentVersion: "gpt-4-1106",
        changeType: "version",
        timestamp: "1 hour ago",
        authorized: true,
        changedBy: "admin@company.com",
        reason: "Scheduled upgrade to latest version",
        impactScore: 3.2,
        affectedPipelines: ["Feature Engineering", "Inference Pipeline"],
      },
      {
        id: "md-2",
        model: "claude-3",
        previousVersion: "claude-3-opus",
        currentVersion: "claude-3-sonnet",
        changeType: "architecture",
        timestamp: "15 min ago",
        authorized: false,
        changedBy: "unknown",
        impactScore: 8.7,
        affectedPipelines: ["Content Moderation", "Classification Pipeline"],
      },
      {
        id: "md-3",
        model: "llama-3",
        previousVersion: "temp=0.7",
        currentVersion: "temp=0.3",
        changeType: "parameters",
        timestamp: "5 min ago",
        authorized: true,
        changedBy: "ml-ops@company.com",
        reason: "Reduce randomness for production stability",
        impactScore: 2.1,
        affectedPipelines: ["Response Generation"],
      },
    ]);

    setAuditLogs([
      {
        id: "al-1",
        timestamp: "2 min ago",
        user: "admin@company.com",
        action: "APPROVE_MODEL_CHANGE",
        resource: "gpt-4",
        status: "success",
        details: "Approved version upgrade from gpt-4-0613 to gpt-4-1106",
      },
      {
        id: "al-2",
        timestamp: "5 min ago",
        user: "data-team@company.com",
        action: "RETRY_ETL_JOB",
        resource: "Data Validation",
        status: "success",
        details: "Manually triggered retry for failed validation pipeline",
      },
      {
        id: "al-3",
        timestamp: "15 min ago",
        user: "unknown",
        action: "MODIFY_MODEL",
        resource: "claude-3",
        status: "failed",
        details: "Unauthorized attempt to change model architecture",
      },
    ]);

    const interval = setInterval(() => {
      setFeatureAccess((prev) =>
        prev.map((fa) => ({
          ...fa,
          frequency: fa.frequency + Math.floor(Math.random() * 10),
          anomaly: fa.anomaly ? Math.random() > 0.3 : Math.random() > 0.95,
          avgLatency: Math.max(
            20,
            fa.avgLatency + Math.floor(Math.random() * 10) - 5
          ),
        }))
      );

      setDataSources((prev) =>
        prev.map((ds) => ({
          ...ds,
          totalRequests: ds.totalRequests + Math.floor(Math.random() * 5),
          latency: Math.max(
            10,
            ds.latency + Math.floor(Math.random() * 20) - 10
          ),
        }))
      );

      setETLJobs((prev) =>
        prev.map((job) => {
          if (job.status === "running") {
            const newProgress =
              job.recordsProcessed + Math.floor(Math.random() * 500);
            if (newProgress >= 15000) {
              return {
                ...job,
                status: "success" as const,
                recordsProcessed: 15000,
              };
            }
            return { ...job, recordsProcessed: newProgress };
          }
          return job;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleViewDetails = (item: any, type: string) => {
    setSelectedDetail(item);
    setDetailType(type);
  };

  const handleRetryETL = (etlId: string) => {
    toast({
      title: "ETL Job Restarted",
      description: "The transformation pipeline has been queued for retry.",
    });
    setETLJobs((prev) =>
      prev.map((etl) =>
        etl.id === etlId
          ? {
              ...etl,
              status: "running" as const,
              retryCount: etl.retryCount + 1,
              logs: [...etl.logs, "[INFO] Manual retry initiated"],
            }
          : etl
      )
    );
  };

  const handleStopETL = (etlId: string) => {
    toast({
      title: "ETL Job Stopped",
      description: "The pipeline has been terminated.",
      variant: "destructive",
    });
    setETLJobs((prev) =>
      prev.map((etl) =>
        etl.id === etlId
          ? {
              ...etl,
              status: "failed" as const,
              logs: [...etl.logs, "[STOPPED] Pipeline manually terminated"],
            }
          : etl
      )
    );
  };

  const handleDeleteETL = (etlId: string) => {
    toast({
      title: "ETL Job Deleted",
      description: "The pipeline configuration has been removed.",
    });
    setETLJobs((prev) => prev.filter((etl) => etl.id !== etlId));
  };

  const handleApproveChange = (driftId: string) => {
    toast({
      title: "Change Approved",
      description: "Model change has been authorized and logged.",
    });
    setModelDrift((prev) =>
      prev.map((drift) =>
        drift.id === driftId ? { ...drift, authorized: true } : drift
      )
    );

    const drift = modelDrift.find((d) => d.id === driftId);
    if (drift) {
      setAuditLogs((prev) => [
        {
          id: `al-${Date.now()}`,
          timestamp: "Just now",
          user: "current-user@company.com",
          action: "APPROVE_MODEL_CHANGE",
          resource: drift.model,
          status: "success",
          details: `Approved ${drift.changeType} change from ${drift.previousVersion} to ${drift.currentVersion}`,
        },
        ...prev,
      ]);
    }
  };

  const handleRejectChange = (driftId: string) => {
    toast({
      title: "Change Rejected",
      description: "Model will be rolled back to previous version.",
      variant: "destructive",
    });

    const drift = modelDrift.find((d) => d.id === driftId);
    if (drift) {
      setAuditLogs((prev) => [
        {
          id: `al-${Date.now()}`,
          timestamp: "Just now",
          user: "current-user@company.com",
          action: "REJECT_MODEL_CHANGE",
          resource: drift.model,
          status: "success",
          details: `Rejected ${drift.changeType} change and initiated rollback`,
        },
        ...prev,
      ]);
    }

    setModelDrift((prev) => prev.filter((drift) => drift.id !== driftId));
  };

  const handleInvestigateAnomaly = (featureId: string) => {
    const feature = featureAccess.find((f) => f.id === featureId);
    if (feature) {
      handleViewDetails(feature, "feature");
      toast({
        title: "Investigation Started",
        description: `Analyzing anomaly in ${feature.feature}`,
      });
    }
  };

  const handleExportReport = () => {
    toast({
      title: "Report Generated",
      description: "Pipeline monitoring report has been exported to CSV.",
    });
  };

  const handleBatchAction = (action: string) => {
    if (selectedItems.size === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to perform batch actions.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: `Batch ${action}`,
      description: `Performing ${action} on ${selectedItems.size} selected items.`,
    });
    setSelectedItems(new Set());
  };

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const toggleSelected = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const handleCompare = () => {
    if (selectedItems.size < 2) {
      toast({
        title: "Select Multiple Items",
        description: "Please select at least 2 items to compare.",
        variant: "destructive",
      });
      return;
    }

    const items = Array.from(selectedItems)
      .map(
        (id) =>
          dataSources.find((ds) => ds.id === id) ||
          etlJobs.find((job) => job.id === id) ||
          featureAccess.find((fa) => fa.id === id)
      )
      .filter(Boolean);

    setCompareItems(items);
    setShowCompareDialog(true);
  };

  const filteredETLJobs = etlJobs.filter((job) => {
    const matchesStatus =
      selectedStatus === "all" || job.status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      job.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredFeatureAccess = featureAccess.filter((fa) => {
    const matchesModel = selectedModel === "all" || fa.model === selectedModel;
    const matchesSearch =
      searchQuery === "" ||
      fa.feature.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesModel && matchesSearch;
  });

  const filteredDataSources = dataSources.filter((ds) => {
    const matchesSource =
      selectedSource === "all" || ds.type === selectedSource;
    const matchesSearch =
      searchQuery === "" ||
      ds.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const unauthorizedDrifts = modelDrift.filter((d) => !d.authorized).length;
  const failedETL = etlJobs.filter((t) => t.status === "failed").length;
  const anomalousFeatures = featureAccess.filter((f) => f.anomaly).length;
  const runningJobs = etlJobs.filter((j) => j.status === "running").length;

  return (
    <div className="flex h-screen">
      {/* ✅ Sidebar */}
      <SidebarNav />
      {/* ✅ Main Content */}
      <div className="flex flex-1 flex-col overflow-y-auto hide-scrollbar text-white m-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                Pipeline & Dataflow Monitoring
              </h2>
              <p className="text-muted-foreground mt-2">
                Track data lineage, ETL provenance, and model selection to
                detect data poisoning and unauthorized changes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowCreateDialog(true)}
                variant="default"
              >
                <Play className="h-4 w-4 mr-2" />
                New Pipeline
              </Button>
              <Button onClick={handleExportReport} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                onClick={handleCompare}
                variant="outline"
                disabled={selectedItems.size < 2}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Compare
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Unauthorized Changes
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{unauthorizedDrifts}</div>
                <p className="text-xs text-muted-foreground">
                  Require immediate attention
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Failed Jobs
                </CardTitle>
                <XCircle className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{failedETL}</div>
                <p className="text-xs text-muted-foreground">
                  ETL transformation failures
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Anomalies</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{anomalousFeatures}</div>
                <p className="text-xs text-muted-foreground">
                  Unusual access patterns
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:bg-accent/50 transition-colors">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Jobs
                </CardTitle>
                <Activity className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{runningJobs}</div>
                <p className="text-xs text-muted-foreground">
                  Currently processing
                </p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="lineage">Data Lineage</TabsTrigger>
              <TabsTrigger value="etl">ETL Jobs</TabsTrigger>
              <TabsTrigger value="features">Feature Store</TabsTrigger>
              <TabsTrigger value="drift">Model Drift</TabsTrigger>
              <TabsTrigger value="audit">Audit Log</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Network className="h-5 w-5" />
                    Data Flow Pipeline
                  </CardTitle>
                  <CardDescription>
                    Visual representation of data movement through the system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-6 bg-muted/30 rounded-lg">
                    <div className="flex flex-col items-center gap-2">
                      <Database className="h-10 w-10 text-blue-500" />
                      <span className="text-sm font-medium">Data Sources</span>
                      <Badge variant="secondary">
                        {dataSources.length} active
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {
                          dataSources.filter((ds) => ds.status === "active")
                            .length
                        }{" "}
                        healthy
                      </div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    <div className="flex flex-col items-center gap-2">
                      <GitBranch className="h-10 w-10 text-purple-500" />
                      <span className="text-sm font-medium">ETL Pipeline</span>
                      <Badge variant="secondary">{etlJobs.length} jobs</Badge>
                      <div className="text-xs text-muted-foreground">
                        {runningJobs} running
                      </div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    <div className="flex flex-col items-center gap-2">
                      <Database className="h-10 w-10 text-green-500" />
                      <span className="text-sm font-medium">Feature Store</span>
                      <Badge variant="secondary">
                        {featureAccess.length} features
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {anomalousFeatures} anomalies
                      </div>
                    </div>
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                    <div className="flex flex-col items-center gap-2">
                      <Zap className="h-10 w-10 text-orange-500" />
                      <span className="text-sm font-medium">AI Models</span>
                      <Badge variant="secondary">
                        {modelDrift.length} tracked
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {unauthorizedDrifts} unauthorized
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {auditLogs.slice(0, 5).map((log) => (
                        <div
                          key={log.id}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div
                            className={`mt-0.5 h-2 w-2 rounded-full ${
                              log.status === "success"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />
                          <div className="flex-1">
                            <div className="font-medium">
                              {log.action.replace(/_/g, " ")}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {log.details}
                            </div>
                            <div className="text-muted-foreground text-xs">
                              {log.user} • {log.timestamp}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">System Health</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Data Source Health</span>
                        <span className="font-medium">
                          {Math.round(
                            (dataSources.filter((ds) => ds.status === "active")
                              .length /
                              dataSources.length) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (dataSources.filter((ds) => ds.status === "active")
                            .length /
                            dataSources.length) *
                          100
                        }
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>ETL Success Rate</span>
                        <span className="font-medium">
                          {Math.round(
                            (etlJobs.filter((j) => j.status === "success")
                              .length /
                              etlJobs.length) *
                              100
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          (etlJobs.filter((j) => j.status === "success")
                            .length /
                            etlJobs.length) *
                          100
                        }
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Feature Quality Score</span>
                        <span className="font-medium">
                          {Math.round(
                            featureAccess.reduce(
                              (acc, fa) => acc + fa.qualityScore,
                              0
                            ) / featureAccess.length
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          featureAccess.reduce(
                            (acc, fa) => acc + fa.qualityScore,
                            0
                          ) / featureAccess.length
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="lineage" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Data Lineage
                      </CardTitle>
                      <CardDescription>
                        Track where training and inference data originates
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search sources..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 w-[200px]"
                        />
                      </div>
                      <Select
                        value={selectedSource}
                        onValueChange={setSelectedSource}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Filter by source" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Sources</SelectItem>
                          <SelectItem value="internal">
                            Internal Only
                          </SelectItem>
                          <SelectItem value="external">
                            External Only
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedItems.size > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBatchAction("export")}
                        >
                          Export Selected ({selectedItems.size})
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredDataSources.map((source) => (
                      <div key={source.id} className="border rounded-lg">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4 flex-1">
                            <Checkbox
                              checked={selectedItems.has(source.id)}
                              onCheckedChange={() => toggleSelected(source.id)}
                            />
                            <Database
                              className={`h-8 w-8 ${
                                source.type === "internal"
                                  ? "text-blue-500"
                                  : "text-orange-500"
                              }`}
                            />
                            <div className="flex-1">
                              <div className="font-medium">{source.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {source.totalRequests.toLocaleString()} requests
                                • {source.dataVolume} • {source.location}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <div className="text-xs text-muted-foreground">
                                  Latency: {source.latency}ms
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Error Rate: {source.errorRate}%
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Last: {source.lastAccess}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                source.type === "internal"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {source.type}
                            </Badge>
                            <Badge
                              variant={
                                source.status === "active"
                                  ? "default"
                                  : source.status === "warning"
                                  ? "destructive"
                                  : "outline"
                              }
                            >
                              {source.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleExpanded(source.id)}
                            >
                              {expandedItems.has(source.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleViewDetails(source, "source")
                              }
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {expandedItems.has(source.id) && (
                          <div className="border-t p-4 bg-muted/30 space-y-3">
                            <div>
                              <div className="text-sm font-medium mb-2">
                                Dependencies
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {source.dependencies.map((dep, idx) => (
                                  <Badge key={idx} variant="outline">
                                    {dep}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-2">
                                Tags
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {source.tags.map((tag, idx) => (
                                  <Badge key={idx} variant="secondary">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline">
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View Full Lineage
                              </Button>
                              <Button size="sm" variant="outline">
                                <Settings className="h-4 w-4 mr-1" />
                                Configure
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="etl" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <GitBranch className="h-5 w-5" />
                        ETL Jobs
                      </CardTitle>
                      <CardDescription>
                        Transformations applied to data before model ingestion
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search jobs..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 w-[200px]"
                        />
                      </div>
                      <Select
                        value={selectedStatus}
                        onValueChange={setSelectedStatus}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="success">Success</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="running">Running</SelectItem>
                          <SelectItem value="queued">Queued</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedItems.size > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBatchAction("retry")}
                        >
                          Retry Selected ({selectedItems.size})
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredETLJobs.map((job) => (
                      <div key={job.id} className="border rounded-lg">
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-start gap-3 flex-1">
                              <Checkbox
                                checked={selectedItems.has(job.id)}
                                onCheckedChange={() => toggleSelected(job.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="font-medium flex items-center gap-2">
                                  {job.name}
                                  {job.status === "running" && (
                                    <RefreshCw className="h-4 w-4 animate-spin text-blue-500" />
                                  )}
                                </div>
                                <div className="text-sm text-muted-foreground mt-1">
                                  {job.timestamp} • Duration: {job.duration} •{" "}
                                  {job.recordsProcessed.toLocaleString()}{" "}
                                  records
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Owner: {job.owner} • Schedule: {job.schedule}{" "}
                                  • Retries: {job.retryCount}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  job.status === "success"
                                    ? "default"
                                    : job.status === "failed"
                                    ? "destructive"
                                    : "secondary"
                                }
                              >
                                {job.status}
                              </Badge>
                              {job.status === "running" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStopETL(job.id)}
                                >
                                  <Ban className="h-4 w-4" />
                                </Button>
                              )}
                              {job.status === "failed" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRetryETL(job.id)}
                                >
                                  <Play className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleExpanded(job.id)}
                              >
                                {expandedItems.has(job.id) ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 text-sm mb-3">
                            <span className="text-muted-foreground">
                              {job.source}
                            </span>
                            <ArrowRight className="h-4 w-4" />
                            <span className="text-muted-foreground">
                              {job.target}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {job.transformations.map((transform, idx) => (
                              <Badge key={idx} variant="outline">
                                {transform}
                              </Badge>
                            ))}
                          </div>

                          {job.status === "running" && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between text-sm mb-1">
                                <span className="text-muted-foreground">
                                  Progress
                                </span>
                                <span className="font-medium">
                                  {Math.round(
                                    (job.recordsProcessed / 15000) * 100
                                  )}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={(job.recordsProcessed / 15000) * 100}
                              />
                            </div>
                          )}

                          {job.status === "failed" && job.errorMessage && (
                            <div className="p-2 bg-destructive/10 border border-destructive/20 rounded text-sm text-destructive">
                              <strong>Error:</strong> {job.errorMessage}
                            </div>
                          )}
                        </div>

                        {expandedItems.has(job.id) && (
                          <div className="border-t p-4 bg-muted/30 space-y-3">
                            <div>
                              <div className="text-sm font-medium mb-2 flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                Execution Logs
                              </div>
                              <div className="bg-black/90 text-green-400 p-3 rounded font-mono text-xs space-y-1 max-h-48 overflow-y-auto">
                                {job.logs.map((log, idx) => (
                                  <div key={idx}>{log}</div>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(job, "etl")}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Full Details
                              </Button>
                              <Button size="sm" variant="outline">
                                <Copy className="h-4 w-4 mr-1" />
                                Duplicate
                              </Button>
                              <Button size="sm" variant="outline">
                                <Settings className="h-4 w-4 mr-1" />
                                Configure
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteETL(job.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Feature Store Access</CardTitle>
                      <CardDescription>
                        Frequency and type of features requested by models
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search features..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-8 w-[200px]"
                        />
                      </div>
                      <Select
                        value={selectedModel}
                        onValueChange={setSelectedModel}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Filter model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Models</SelectItem>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="claude-3">Claude-3</SelectItem>
                          <SelectItem value="llama-3">Llama-3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {filteredFeatureAccess.map((fa) => (
                      <div key={fa.id} className="border rounded-lg">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4 flex-1">
                            <Checkbox
                              checked={selectedItems.has(fa.id)}
                              onCheckedChange={() => toggleSelected(fa.id)}
                            />
                            <div className="flex-1">
                              <div className="font-medium flex items-center gap-2">
                                {fa.feature}
                                {fa.anomaly && (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {fa.model} • {fa.lastAccess}
                              </div>
                              <div className="flex items-center gap-3 mt-1">
                                <div className="text-xs text-muted-foreground">
                                  Latency: {fa.avgLatency}ms
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Size: {fa.dataSize}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  Quality: {fa.qualityScore}%
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="font-bold text-lg">
                                {fa.frequency}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                requests
                              </div>
                            </div>
                            {fa.anomaly && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleInvestigateAnomaly(fa.id)}
                              >
                                <Search className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleExpanded(fa.id)}
                            >
                              {expandedItems.has(fa.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {expandedItems.has(fa.id) && (
                          <div className="border-t p-4 bg-muted/30 space-y-3">
                            <div>
                              <div className="text-sm font-medium mb-2">
                                Usage History (Last 3 intervals)
                              </div>
                              <div className="flex items-end gap-2 h-24">
                                {fa.usageHistory.map((hist, idx) => (
                                  <div
                                    key={idx}
                                    className="flex-1 flex flex-col items-center gap-1"
                                  >
                                    <div
                                      className="w-full bg-blue-500 rounded-t"
                                      style={{
                                        height: `${
                                          (hist.count /
                                            Math.max(
                                              ...fa.usageHistory.map(
                                                (h) => h.count
                                              )
                                            )) *
                                          100
                                        }%`,
                                      }}
                                    />
                                    <div className="text-xs text-muted-foreground">
                                      {hist.time}
                                    </div>
                                    <div className="text-xs font-medium">
                                      {hist.count}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {fa.anomaly && (
                              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                                <div className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mb-1 flex items-center gap-2">
                                  <AlertCircle className="h-4 w-4" />
                                  Anomaly Detected
                                </div>
                                <div className="text-sm">
                                  Unusual spike in request frequency. Current
                                  rate is{" "}
                                  {(
                                    fa.usageHistory[2].count /
                                    fa.usageHistory[0].count
                                  ).toFixed(1)}
                                  x higher than baseline. Recommend
                                  investigating for potential data exfiltration
                                  or abuse.
                                </div>
                              </div>
                            )}
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(fa, "feature")}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Full Analytics
                              </Button>
                              <Button size="sm" variant="outline">
                                <Shield className="h-4 w-4 mr-1" />
                                Set Alert Threshold
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="drift" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Model Selection Drift</CardTitle>
                  <CardDescription>
                    Unexpected model or parameter changes with impact analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {modelDrift.map((drift) => (
                      <div
                        key={drift.id}
                        className={`border rounded-lg ${
                          !drift.authorized
                            ? "border-destructive bg-destructive/5"
                            : ""
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="font-medium flex items-center gap-2">
                                {drift.model}
                                {!drift.authorized && (
                                  <AlertTriangle className="h-4 w-4 text-destructive" />
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground mt-1">
                                {drift.timestamp} • By: {drift.changedBy}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">
                                {drift.changeType}
                              </Badge>
                              {drift.authorized ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <XCircle className="h-4 w-4 text-destructive" />
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">
                                From:
                              </span>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {drift.previousVersion}
                              </code>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-muted-foreground">To:</span>
                              <code className="text-xs bg-muted px-2 py-1 rounded">
                                {drift.currentVersion}
                              </code>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="text-sm text-muted-foreground mb-1">
                              Impact Score
                            </div>
                            <div className="flex items-center gap-2">
                              <Progress
                                value={drift.impactScore * 10}
                                className="flex-1"
                              />
                              <span className="text-sm font-medium">
                                {drift.impactScore}/10
                              </span>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="text-sm text-muted-foreground mb-2">
                              Affected Pipelines
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {drift.affectedPipelines.map((pipeline, idx) => (
                                <Badge key={idx} variant="secondary">
                                  {pipeline}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {drift.reason && (
                            <div className="text-sm text-muted-foreground italic mb-3">
                              Reason: {drift.reason}
                            </div>
                          )}

                          {!drift.authorized && (
                            <div className="flex items-center gap-2 pt-3 border-t">
                              <div className="text-xs text-destructive font-medium flex-1 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                Unauthorized change detected - requires approval
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveChange(drift.id)}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleRejectChange(drift.id)}
                              >
                                <Ban className="h-4 w-4 mr-1" />
                                Reject & Rollback
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="audit" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Audit Log
                      </CardTitle>
                      <CardDescription>
                        Complete history of all pipeline and model changes
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Time range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">Last Hour</SelectItem>
                          <SelectItem value="24h">Last 24 Hours</SelectItem>
                          <SelectItem value="7d">Last 7 Days</SelectItem>
                          <SelectItem value="30d">Last 30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export Audit Log
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {auditLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div
                          className={`mt-1 h-2 w-2 rounded-full ${
                            log.status === "success"
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <div className="font-medium text-sm">
                              {log.action.replace(/_/g, " ")}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {log.timestamp}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {log.details}
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="outline" className="text-xs">
                              {log.user}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {log.resource}
                            </Badge>
                            <Badge
                              variant={
                                log.status === "success"
                                  ? "default"
                                  : "destructive"
                              }
                              className="text-xs"
                            >
                              {log.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <Dialog
            open={!!selectedDetail}
            onOpenChange={() => setSelectedDetail(null)}
          >
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {detailType === "source" && "Data Source Details"}
                  {detailType === "etl" && "ETL Job Details"}
                  {detailType === "feature" && "Feature Analytics"}
                </DialogTitle>
                <DialogDescription>
                  Comprehensive information and metrics
                </DialogDescription>
              </DialogHeader>
              {selectedDetail && (
                <div className="space-y-4">
                  {detailType === "source" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">Name</Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.name}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Type</Label>
                          <div>
                            <Badge
                              variant={
                                selectedDetail.type === "internal"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {selectedDetail.type}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Total Requests
                          </Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.totalRequests.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Data Volume
                          </Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.dataVolume}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Location
                          </Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.location}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Status
                          </Label>
                          <div>
                            <Badge
                              variant={
                                selectedDetail.status === "active"
                                  ? "default"
                                  : "outline"
                              }
                            >
                              {selectedDetail.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Average Latency
                          </Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.latency}ms
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Error Rate
                          </Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.errorRate}%
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Dependencies
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedDetail.dependencies.map(
                            (dep: string, idx: number) => (
                              <Badge key={idx} variant="outline">
                                {dep}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Tags</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedDetail.tags.map(
                            (tag: string, idx: number) => (
                              <Badge key={idx} variant="secondary">
                                {tag}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                    </>
                  )}
                  {detailType === "etl" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">
                            Pipeline Name
                          </Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.name}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Status
                          </Label>
                          <div>
                            <Badge
                              variant={
                                selectedDetail.status === "success"
                                  ? "default"
                                  : selectedDetail.status === "failed"
                                  ? "destructive"
                                  : "secondary"
                              }
                            >
                              {selectedDetail.status}
                            </Badge>
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Duration
                          </Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.duration}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Records Processed
                          </Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.recordsProcessed.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Owner</Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.owner}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Schedule
                          </Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.schedule}
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Data Flow
                        </Label>
                        <div className="flex items-center gap-2 p-3 bg-muted rounded mt-2">
                          <span>{selectedDetail.source}</span>
                          <ArrowRight className="h-4 w-4" />
                          <span>{selectedDetail.target}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Transformations Applied
                        </Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedDetail.transformations.map(
                            (t: string, i: number) => (
                              <Badge key={i} variant="outline">
                                {t}
                              </Badge>
                            )
                          )}
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Execution Logs
                        </Label>
                        <div className="bg-black/90 text-green-400 p-3 rounded font-mono text-xs space-y-1 max-h-48 overflow-y-auto mt-2">
                          {selectedDetail.logs.map(
                            (log: string, idx: number) => (
                              <div key={idx}>{log}</div>
                            )
                          )}
                        </div>
                      </div>
                      {selectedDetail.errorMessage && (
                        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded">
                          <Label className="text-destructive">
                            Error Message
                          </Label>
                          <div className="text-sm mt-1">
                            {selectedDetail.errorMessage}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  {detailType === "feature" && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-muted-foreground">
                            Feature Name
                          </Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.feature}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">Model</Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.model}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Request Frequency
                          </Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.frequency.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Average Latency
                          </Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.avgLatency}ms
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Data Size
                          </Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.dataSize}
                          </div>
                        </div>
                        <div>
                          <Label className="text-muted-foreground">
                            Quality Score
                          </Label>
                          <div className="text-lg font-semibold">
                            {selectedDetail.qualityScore}%
                          </div>
                        </div>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Usage Trend
                        </Label>
                        <div className="flex items-end gap-2 h-32 mt-2">
                          {selectedDetail.usageHistory.map(
                            (hist: any, idx: number) => (
                              <div
                                key={idx}
                                className="flex-1 flex flex-col items-center gap-1"
                              >
                                <div
                                  className="w-full bg-blue-500 rounded-t"
                                  style={{
                                    height: `${
                                      (hist.count /
                                        Math.max(
                                          ...selectedDetail.usageHistory.map(
                                            (h: any) => h.count
                                          )
                                        )) *
                                      100
                                    }%`,
                                  }}
                                />
                                <div className="text-xs text-muted-foreground">
                                  {hist.time}
                                </div>
                                <div className="text-xs font-medium">
                                  {hist.count}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                      {selectedDetail.anomaly && (
                        <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
                          <Label className="text-yellow-700 dark:text-yellow-400">
                            Anomaly Analysis
                          </Label>
                          <div className="text-sm mt-1">
                            Unusual spike in request frequency detected. Current
                            rate is{" "}
                            {(
                              selectedDetail.usageHistory[2].count /
                              selectedDetail.usageHistory[0].count
                            ).toFixed(1)}
                            x higher than baseline average. Recommend
                            investigating for potential data exfiltration or
                            abuse.
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDetail(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Pipeline</DialogTitle>
                <DialogDescription>
                  Configure a new ETL transformation pipeline
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Pipeline Name</Label>
                  <Input placeholder="Enter pipeline name" />
                </div>
                <div>
                  <Label>Source</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data source" />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSources.map((ds) => (
                        <SelectItem key={ds.id} value={ds.id}>
                          {ds.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Target</Label>
                  <Input placeholder="Enter target destination" />
                </div>
                <div>
                  <Label>Schedule</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-demand">On Demand</SelectItem>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                      <SelectItem value="30min">Every 30 minutes</SelectItem>
                      <SelectItem value="1hour">Every hour</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea placeholder="Describe the pipeline purpose and transformations" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast({
                      title: "Pipeline Created",
                      description:
                        "New ETL pipeline has been configured successfully.",
                    });
                    setShowCreateDialog(false);
                  }}
                >
                  Create Pipeline
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={showCompareDialog} onOpenChange={setShowCompareDialog}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Compare Items</DialogTitle>
                <DialogDescription>
                  Side-by-side comparison of selected items
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                {compareItems.slice(0, 2).map((item, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {item?.name || item?.feature}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      {Object.entries(item || {}).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground">{key}:</span>
                          <span className="font-medium">{String(value)}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowCompareDialog(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}
