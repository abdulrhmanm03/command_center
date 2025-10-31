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
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Plus,
  Settings,
  Save,
  Search,
  Download,
  Copy,
  Trash2,
  Shield,
  FileText,
  Brain,
  Users,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Lock,
  Unlock,
} from "lucide-react";

// Define Policy type locally and provide a minimal PolicyEditorDialog component
export type Policy = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  severity: string;
  rules: {
    id: string;
    pattern: string;
    type: string;
    weight: number;
    description?: string;
  }[];
  thresholds: {
    confidence: number;
    riskScore: number;
  };
  actions: {
    block: boolean;
    alert: boolean;
    log: boolean;
    quarantine: boolean;
  };
  metadata: {
    created: string;
    updated: string;
    version: string;
  };
};

export function PolicyEditorDialog({
  open,
  onOpenChange,
  policy,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy?: Policy;
  onSave: (policy: Policy) => void;
}) {
  const [local, setLocal] = useState<Policy>(
    policy ?? {
      id: `policy_${Date.now()}`,
      name: "",
      description: "",
      enabled: true,
      severity: "medium",
      rules: [],
      thresholds: { confidence: 0.8, riskScore: 50 },
      actions: { block: true, alert: false, log: true, quarantine: false },
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        version: "1.0.0",
      },
    }
  );

  useEffect(() => {
    if (policy) setLocal(policy);
  }, [policy]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded w-full max-w-2xl">
        <h2 className="text-lg font-semibold mb-4">
          {policy ? "Edit Policy" : "New Policy"}
        </h2>
        <div className="space-y-3">
          <Input
            placeholder="Policy name"
            value={local.name}
            onChange={(e) => setLocal({ ...local, name: e.target.value })}
          />
          <Textarea
            placeholder="Description"
            value={local.description}
            onChange={(e) =>
              setLocal({ ...local, description: e.target.value })
            }
            rows={3}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave({
                ...local,
                metadata: {
                  ...local.metadata,
                  updated: new Date().toISOString(),
                },
              });
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SidebarNav } from "@/components/sidebar-nav";

interface DenyPattern {
  id: string;
  type: string;
  category: string;
  pattern: string;
  weight: number;
}

interface IntentCategory {
  name: string;
  enabled: boolean;
}

export default function PoliciesView() {
  const [policies, setPolicies] = useState<Policy[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("firewall-policies");
    if (stored) {
      setPolicies(JSON.parse(stored));
    } else {
      // Default policies
      setPolicies([
        {
          id: "data_poisoning",
          name: "Data Poisoning Detection",
          description:
            "Detect and block malicious training data with adversarial patterns and backdoor triggers",
          enabled: true,
          severity: "critical",
          rules: [
            {
              id: "dp1",
              pattern: "\\b(trigger|backdoor|poison)\\s+word\\b",
              type: "regex",
              weight: 0.9,
              description: "Backdoor trigger keywords",
            },
            {
              id: "dp2",
              pattern: "malicious\\s+payload",
              type: "keyword",
              weight: 0.8,
              description: "Malicious payload indicators",
            },
          ],
          thresholds: {
            confidence: 0.85,
            riskScore: 70,
          },
          actions: {
            block: true,
            alert: true,
            log: true,
            quarantine: true,
          },
          metadata: {
            created: "2024-01-15T10:00:00Z",
            updated: "2024-01-20T14:30:00Z",
            version: "2.1.0",
          },
        },
        {
          id: "prompt_injection",
          name: "Prompt Injection Prevention",
          description:
            "Block attempts to override system instructions or extract sensitive data through prompt manipulation",
          enabled: true,
          severity: "high",
          rules: [
            {
              id: "pi1",
              pattern: "ignore\\s+(previous|above|all)\\s+instructions?",
              type: "regex",
              weight: 0.95,
              description: "Instruction override attempts",
            },
            {
              id: "pi2",
              pattern: "system\\s*:\\s*you\\s+are\\s+now",
              type: "regex",
              weight: 0.9,
              description: "System role manipulation",
            },
          ],
          thresholds: {
            confidence: 0.8,
            riskScore: 65,
          },
          actions: {
            block: true,
            alert: true,
            log: true,
            quarantine: false,
          },
          metadata: {
            created: "2024-01-10T09:00:00Z",
            updated: "2024-01-22T11:15:00Z",
            version: "3.0.1",
          },
        },
        {
          id: "jailbreak",
          name: "Jailbreak Detection",
          description:
            "Identify and prevent jailbreak attempts like DAN, AIM, and similar patterns that bypass safety measures",
          enabled: true,
          severity: "critical",
          rules: [
            {
              id: "jb1",
              pattern: "DAN\\s+mode",
              type: "keyword",
              weight: 1.0,
              description: "DAN mode activation",
            },
            {
              id: "jb2",
              pattern: "developer\\s+mode",
              type: "keyword",
              weight: 0.85,
              description: "Developer mode bypass",
            },
          ],
          thresholds: {
            confidence: 0.9,
            riskScore: 80,
          },
          actions: {
            block: true,
            alert: true,
            log: true,
            quarantine: true,
          },
          metadata: {
            created: "2024-01-12T08:30:00Z",
            updated: "2024-01-21T16:45:00Z",
            version: "2.5.0",
          },
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (policies.length > 0) {
      localStorage.setItem("firewall-policies", JSON.stringify(policies));
    }
  }, [policies]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | undefined>();
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [denyPatterns, setDenyPatterns] = useState<DenyPattern[]>([]);
  const [newDenyPattern, setNewDenyPattern] = useState({
    type: "semantic",
    category: "harmful",
    pattern: "",
    weight: 0.9,
  });

  useEffect(() => {
    const stored = localStorage.getItem("firewall-deny-patterns");
    if (stored) {
      setDenyPatterns(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    if (denyPatterns.length > 0) {
      localStorage.setItem(
        "firewall-deny-patterns",
        JSON.stringify(denyPatterns)
      );
    }
  }, [denyPatterns]);

  // Dynamic tuning state
  const [autoTuningEnabled, setAutoTuningEnabled] = useState(true);
  const [adjustmentSensitivity, setAdjustmentSensitivity] = useState(70);
  const [learningRate, setLearningRate] = useState(50);
  const [tuningMetrics, setTuningMetrics] = useState({
    falsePositives: 12,
    falseNegatives: 3,
    accuracy: 94.5,
    lastTuned: new Date().toISOString(),
  });

  // Role-based enforcement state
  const [roleConfigs, setRoleConfigs] = useState([
    {
      role: "admin",
      strictness: "low",
      policies: ["prompt_injection", "jailbreak"],
    },
    {
      role: "user",
      strictness: "medium",
      policies: ["prompt_injection", "jailbreak", "data_poisoning"],
    },
    {
      role: "guest",
      strictness: "high",
      policies: ["prompt_injection", "jailbreak", "data_poisoning"],
    },
  ]);

  const [newRole, setNewRole] = useState({
    role: "",
    strictness: "medium",
    policies: [] as string[],
  });

  // Semantic whitelist state
  const [allowedIntents, setAllowedIntents] = useState([
    {
      intent: "information_retrieval",
      confidence: 0.9,
      examples: ["What is...", "Tell me about..."],
    },
    {
      intent: "creative_writing",
      confidence: 0.85,
      examples: ["Write a story...", "Create a poem..."],
    },
    {
      intent: "code_generation",
      confidence: 0.8,
      examples: ["Generate code for...", "Write a function..."],
    },
  ]);

  const [intentCategories, setIntentCategories] = useState<IntentCategory[]>([
    { name: "Information Retrieval", enabled: true },
    { name: "Creative Writing", enabled: true },
    { name: "Code Generation", enabled: true },
    { name: "Translation", enabled: true },
    { name: "Summarization", enabled: true },
    { name: "Analysis", enabled: true },
  ]);

  const [whitelistThreshold, setWhitelistThreshold] = useState(85);

  useEffect(() => {
    const stored = localStorage.getItem("firewall-intent-categories");
    if (stored) {
      setIntentCategories(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "firewall-intent-categories",
      JSON.stringify(intentCategories)
    );
  }, [intentCategories]);

  // Analytics data
  const [policyAnalytics, setPolicyAnalytics] = useState({
    totalBlocked: 1247,
    totalAllowed: 8953,
    blockRate: 12.2,
    topPolicies: [
      { name: "Prompt Injection", blocks: 543, effectiveness: 96.2 },
      { name: "Jailbreak Detection", blocks: 421, effectiveness: 94.8 },
      { name: "Data Poisoning", blocks: 283, effectiveness: 92.1 },
    ],
    trendData: [
      { date: "Mon", blocked: 180, allowed: 1420 },
      { date: "Tue", blocked: 195, allowed: 1380 },
      { date: "Wed", blocked: 210, allowed: 1450 },
      { date: "Thu", blocked: 175, allowed: 1390 },
      { date: "Fri", blocked: 220, allowed: 1510 },
      { date: "Sat", blocked: 145, allowed: 1120 },
      { date: "Sun", blocked: 122, allowed: 1683 },
    ],
  });

  // Compliance templates
  const complianceTemplates = [
    {
      id: "gdpr",
      name: "GDPR Compliance",
      description: "EU General Data Protection Regulation compliance policies",
      icon: FileText,
      policies: [
        "PII Detection and Masking",
        "Data Minimization",
        "Right to Erasure",
        "Consent Management",
        "Data Breach Notification",
      ],
    },
    {
      id: "ai_trism",
      name: "AI TRiSM",
      description: "AI Trust, Risk and Security Management framework",
      icon: Shield,
      policies: [
        "Model Explainability",
        "Bias Detection",
        "Adversarial Robustness",
        "Privacy Preservation",
        "Fairness Monitoring",
      ],
    },
    {
      id: "owasp",
      name: "OWASP LLM Top 10",
      description: "OWASP Top 10 for Large Language Model Applications",
      icon: AlertTriangle,
      policies: [
        "Prompt Injection Prevention",
        "Insecure Output Handling",
        "Training Data Poisoning",
        "Model Denial of Service",
        "Supply Chain Vulnerabilities",
        "Sensitive Information Disclosure",
        "Insecure Plugin Design",
        "Excessive Agency",
        "Overreliance",
        "Model Theft",
      ],
    },
  ];

  // Update tuning metrics periodically
  useEffect(() => {
    if (!autoTuningEnabled) return;

    const interval = setInterval(() => {
      setTuningMetrics((prev) => ({
        ...prev,
        falsePositives: Math.max(
          0,
          prev.falsePositives + Math.floor(Math.random() * 3) - 1
        ),
        falseNegatives: Math.max(
          0,
          prev.falseNegatives + Math.floor(Math.random() * 2) - 1
        ),
        accuracy: Math.min(100, prev.accuracy + (Math.random() - 0.5) * 0.5),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, [autoTuningEnabled]);

  const filteredPolicies = policies.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const togglePolicy = (id: string) => {
    setPolicies(
      policies.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    );
    setHasChanges(true);
    toast.success(
      `Policy ${
        policies.find((p) => p.id === id)?.enabled ? "disabled" : "enabled"
      }`
    );
  };

  const handleEditPolicy = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsEditorOpen(true);
  };

  const handleCreatePolicy = () => {
    setSelectedPolicy(undefined);
    setIsEditorOpen(true);
  };

  const handleSavePolicy = (policy: Policy) => {
    const existingIndex = policies.findIndex((p) => p.id === policy.id);
    if (existingIndex >= 0) {
      setPolicies(policies.map((p) => (p.id === policy.id ? policy : p)));
      toast.success("Policy updated successfully");
    } else {
      setPolicies([...policies, policy]);
      toast.success("Policy created successfully");
    }
    setHasChanges(true);
  };

  const handleDuplicatePolicy = (policy: Policy) => {
    const duplicated: Policy = {
      ...policy,
      id: `${policy.id}_copy_${Date.now()}`,
      name: `${policy.name} (Copy)`,
      metadata: {
        ...policy.metadata,
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        version: "1.0.0",
      },
    };
    setPolicies([...policies, duplicated]);
    setHasChanges(true);
    toast.success("Policy duplicated");
  };

  const handleDeletePolicy = (id: string) => {
    setPolicies(policies.filter((p) => p.id !== id));
    setHasChanges(true);
    toast.success("Policy deleted");
  };

  const handleExportPolicies = () => {
    const dataStr = JSON.stringify(policies, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `firewall-policies-${Date.now()}.json`;
    link.click();
    toast.success("Policies exported");
  };

  const handleSaveChanges = () => {
    setHasChanges(false);
    toast.success("All policy changes deployed successfully!");
  };

  const applyComplianceTemplate = (templateId: string) => {
    const template = complianceTemplates.find((t) => t.id === templateId);
    if (!template) return;

    // Create policies from template
    const newPolicies = template.policies.map((policyName, idx) => ({
      id: `${templateId}_${idx}_${Date.now()}`,
      name: policyName,
      description: `Auto-generated from ${template.name} compliance template`,
      enabled: true,
      severity: "high" as const,
      rules: [
        {
          id: `rule_${idx}`,
          pattern: policyName.toLowerCase().replace(/\s+/g, "_"),
          type: "semantic" as const,
          weight: 0.85,
          description: `${policyName} detection rule`,
        },
      ],
      thresholds: {
        confidence: 0.8,
        riskScore: 70,
      },
      actions: {
        block: true,
        alert: true,
        log: true,
        quarantine: false,
      },
      metadata: {
        created: new Date().toISOString(),
        updated: new Date().toISOString(),
        version: "1.0.0",
      },
    }));

    setPolicies([...policies, ...newPolicies]);
    setHasChanges(true);
    toast.success(
      `Applied ${template.name} template - ${newPolicies.length} policies created`
    );
  };

  const handleAddDenyPattern = () => {
    if (!newDenyPattern.pattern.trim()) {
      toast.error("Pattern cannot be empty");
      return;
    }

    const pattern: DenyPattern = {
      id: `deny_${Date.now()}`,
      ...newDenyPattern,
    };

    setDenyPatterns([...denyPatterns, pattern]);
    setNewDenyPattern({
      type: "semantic",
      category: "harmful",
      pattern: "",
      weight: 0.9,
    });
    toast.success("Deny pattern added successfully");
  };

  const handleRemoveDenyPattern = (id: string) => {
    setDenyPatterns(denyPatterns.filter((p) => p.id !== id));
    toast.success("Deny pattern removed");
  };

  const addAllowedIntent = () => {
    setAllowedIntents([
      ...allowedIntents,
      { intent: "new_intent", confidence: 0.8, examples: [] },
    ]);
  };

  const removeAllowedIntent = (index: number) => {
    setAllowedIntents(allowedIntents.filter((_, i) => i !== index));
  };

  const handleRunManualTuning = () => {
    toast.info("Running manual tuning...");

    // Simulate tuning process
    setTimeout(() => {
      setTuningMetrics({
        falsePositives: Math.max(
          0,
          tuningMetrics.falsePositives - Math.floor(Math.random() * 5)
        ),
        falseNegatives: Math.max(
          0,
          tuningMetrics.falseNegatives - Math.floor(Math.random() * 2)
        ),
        accuracy: Math.min(100, tuningMetrics.accuracy + Math.random() * 2),
        lastTuned: new Date().toISOString(),
      });
      toast.success("Manual tuning completed successfully!");
    }, 2000);
  };

  const handleAddRoleConfig = () => {
    if (!newRole.role.trim()) {
      toast.error("Role name cannot be empty");
      return;
    }

    setRoleConfigs([...roleConfigs, { ...newRole }]);
    setNewRole({
      role: "",
      strictness: "medium",
      policies: [],
    });
    toast.success("Role configuration added");
  };

  const toggleIntentCategory = (index: number) => {
    const updated = [...intentCategories];
    updated[index].enabled = !updated[index].enabled;
    setIntentCategories(updated);
    toast.success(
      `${updated[index].name} ${
        updated[index].enabled ? "enabled" : "disabled"
      }`
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-chart-4 text-primary-foreground";
      case "medium":
        return "bg-chart-3 text-primary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex h-screen">
      {/* ✅ Sidebar */}
      <SidebarNav />

      {/* ✅ Main Content */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
        <div className="space-y-6 p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Policy Management
              </h1>
              <p className="text-muted-foreground">
                Define and enforce semantic/behavioral guardrails with adaptive
                learning
              </p>
            </div>
            <div className="flex gap-2">
              {hasChanges && (
                <Button
                  onClick={handleSaveChanges}
                  className="animate-pulse-glow"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Deploy Changes
                </Button>
              )}
              <Button variant="outline" onClick={handleExportPolicies}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={handleCreatePolicy}>
                <Plus className="mr-2 h-4 w-4" />
                New Policy
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="builder">Rule Builder</TabsTrigger>
              <TabsTrigger value="compliance">Compliance</TabsTrigger>
              <TabsTrigger value="tuning">Dynamic Tuning</TabsTrigger>
              <TabsTrigger value="roles">Role-Based</TabsTrigger>
              <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search policies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{filteredPolicies.length} policies</span>
                  <span>•</span>
                  <span>
                    {filteredPolicies.filter((p) => p.enabled).length} enabled
                  </span>
                </div>
              </div>

              <div className="grid gap-4">
                {filteredPolicies.map((policy) => (
                  <Card
                    key={policy.id}
                    className={!policy.enabled ? "opacity-60" : ""}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">
                              {policy.name}
                            </CardTitle>
                            <Badge
                              className={getSeverityColor(policy.severity)}
                            >
                              {policy.severity}
                            </Badge>
                            <Badge variant="outline">
                              v{policy.metadata.version}
                            </Badge>
                          </div>
                          <CardDescription>
                            {policy.description}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {policy.enabled ? "Enabled" : "Disabled"}
                            </span>
                            <Switch
                              checked={policy.enabled}
                              onCheckedChange={() => togglePolicy(policy.id)}
                            />
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6 text-sm text-muted-foreground">
                          <span>{policy.rules.length} detection rules</span>
                          <span>
                            Confidence:{" "}
                            {(policy.thresholds.confidence * 100).toFixed(0)}%
                          </span>
                          <span>Risk: {policy.thresholds.riskScore}/100</span>
                          <div className="flex gap-1">
                            {policy.actions.block && (
                              <Badge variant="outline">Block</Badge>
                            )}
                            {policy.actions.alert && (
                              <Badge variant="outline">Alert</Badge>
                            )}
                            {policy.actions.quarantine && (
                              <Badge variant="outline">Quarantine</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditPolicy(policy)}
                          >
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDuplicatePolicy(policy)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePolicy(policy.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Rule Builder Tab */}
            <TabsContent value="builder" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      Intent Allowlist
                    </CardTitle>
                    <CardDescription>
                      Define allowed intents for positive security model
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {allowedIntents.map((intent, idx) => (
                      <div
                        key={idx}
                        className="p-4 border rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <Input
                            value={intent.intent}
                            onChange={(e) => {
                              const updated = [...allowedIntents];
                              updated[idx].intent = e.target.value;
                              setAllowedIntents(updated);
                            }}
                            placeholder="Intent name"
                            className="flex-1 mr-2"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeAllowedIntent(idx)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">Confidence:</Label>
                          <Input
                            type="number"
                            min="0"
                            max="1"
                            step="0.05"
                            value={intent.confidence}
                            onChange={(e) => {
                              const updated = [...allowedIntents];
                              updated[idx].confidence = Number.parseFloat(
                                e.target.value
                              );
                              setAllowedIntents(updated);
                            }}
                            className="w-20"
                          />
                        </div>
                        <Textarea
                          placeholder="Example prompts (one per line)"
                          value={intent.examples.join("\n")}
                          onChange={(e) => {
                            const updated = [...allowedIntents];
                            updated[idx].examples = e.target.value.split("\n");
                            setAllowedIntents(updated);
                          }}
                          rows={2}
                          className="text-xs"
                        />
                      </div>
                    ))}
                    <Button
                      onClick={addAllowedIntent}
                      variant="outline"
                      className="w-full bg-transparent"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Allowed Intent
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      Harmful Behavior Deny Patterns
                    </CardTitle>
                    <CardDescription>
                      Define patterns for harmful behaviors to block
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {denyPatterns.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <Label className="text-xs font-medium">
                          Existing Patterns:
                        </Label>
                        {denyPatterns.map((pattern) => (
                          <div
                            key={pattern.id}
                            className="flex items-center justify-between p-2 border rounded text-xs"
                          >
                            <div className="flex-1">
                              <div className="font-medium">
                                {pattern.category}
                              </div>
                              <div className="text-muted-foreground truncate">
                                {pattern.pattern}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRemoveDenyPattern(pattern.id)
                              }
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Pattern Type</Label>
                      <Select
                        value={newDenyPattern.type}
                        onValueChange={(value) =>
                          setNewDenyPattern({ ...newDenyPattern, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="semantic">
                            Semantic Analysis
                          </SelectItem>
                          <SelectItem value="regex">
                            Regular Expression
                          </SelectItem>
                          <SelectItem value="keyword">Keyword Match</SelectItem>
                          <SelectItem value="embedding">
                            Embedding Distance
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Behavior Category</Label>
                      <Select
                        value={newDenyPattern.category}
                        onValueChange={(value) =>
                          setNewDenyPattern({
                            ...newDenyPattern,
                            category: value,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="harmful">
                            Harmful Content
                          </SelectItem>
                          <SelectItem value="manipulation">
                            Manipulation Attempts
                          </SelectItem>
                          <SelectItem value="extraction">
                            Data Extraction
                          </SelectItem>
                          <SelectItem value="jailbreak">
                            Jailbreak Patterns
                          </SelectItem>
                          <SelectItem value="injection">
                            Injection Attacks
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Pattern</Label>
                      <Textarea
                        placeholder="Enter pattern or description..."
                        rows={3}
                        value={newDenyPattern.pattern}
                        onChange={(e) =>
                          setNewDenyPattern({
                            ...newDenyPattern,
                            pattern: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Severity Weight (0-1)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={newDenyPattern.weight}
                        onChange={(e) =>
                          setNewDenyPattern({
                            ...newDenyPattern,
                            weight: Number.parseFloat(e.target.value),
                          })
                        }
                      />
                    </div>
                    <Button className="w-full" onClick={handleAddDenyPattern}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Deny Pattern
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Compliance Templates Tab */}
            <TabsContent value="compliance" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-6">
                {complianceTemplates.map((template) => (
                  <Card
                    key={template.id}
                    className="hover:border-primary transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <template.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {template.name}
                          </CardTitle>
                        </div>
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-medium">
                          Included Policies:
                        </Label>
                        <ul className="space-y-1">
                          {template.policies.map((policy, idx) => (
                            <li
                              key={idx}
                              className="text-xs text-muted-foreground flex items-center gap-2"
                            >
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                              {policy}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Button
                        onClick={() => applyComplianceTemplate(template.id)}
                        className="w-full"
                      >
                        Apply Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Dynamic Tuning Tab */}
            <TabsContent value="tuning" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Brain className="h-5 w-5" />
                        ML-Based Policy Tuning
                      </CardTitle>
                      <CardDescription>
                        Automatically adjust policies based on traffic patterns
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {autoTuningEnabled ? "Enabled" : "Disabled"}
                      </span>
                      <Switch
                        checked={autoTuningEnabled}
                        onCheckedChange={setAutoTuningEnabled}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                          False Positives
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {tuningMetrics.falsePositives}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Last 24 hours
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                          False Negatives
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {tuningMetrics.falseNegatives}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Last 24 hours
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-medium">
                          Accuracy
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">
                          {tuningMetrics.accuracy.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Current model
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Auto-Adjustment Sensitivity</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Input
                          type="range"
                          min="0"
                          max="100"
                          value={adjustmentSensitivity}
                          onChange={(e) =>
                            setAdjustmentSensitivity(
                              Number.parseInt(e.target.value)
                            )
                          }
                          className="flex-1"
                        />
                        <span className="text-sm font-mono w-12">
                          {adjustmentSensitivity}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Higher sensitivity means more aggressive policy
                        adjustments
                      </p>
                    </div>

                    <div>
                      <Label>Learning Rate</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Input
                          type="range"
                          min="0"
                          max="100"
                          value={learningRate}
                          onChange={(e) =>
                            setLearningRate(Number.parseInt(e.target.value))
                          }
                          className="flex-1"
                        />
                        <span className="text-sm font-mono w-12">
                          {(learningRate / 100).toFixed(1)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Controls how quickly policies adapt to new patterns
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg bg-muted/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Last Tuning Run
                        </span>
                        <Badge variant="outline">
                          {new Date(
                            tuningMetrics.lastTuned
                          ).toLocaleTimeString()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Next automatic tuning in 2 hours 15 minutes
                      </p>
                    </div>

                    <Button className="w-full" onClick={handleRunManualTuning}>
                      <Zap className="mr-2 h-4 w-4" />
                      Run Manual Tuning Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Role-Based Enforcement Tab */}
            <TabsContent value="roles" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Role-Based Policy Enforcement
                  </CardTitle>
                  <CardDescription>
                    Configure different policy strictness levels for user roles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {roleConfigs.map((config, idx) => (
                    <div key={idx} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="capitalize">
                            {config.role}
                          </Badge>
                          <Select
                            value={config.strictness}
                            onValueChange={(value) => {
                              const updated = [...roleConfigs];
                              updated[idx].strictness = value;
                              setRoleConfigs(updated);
                            }}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex items-center gap-2">
                          {config.strictness === "low" && (
                            <Unlock className="h-4 w-4 text-green-500" />
                          )}
                          {config.strictness === "medium" && (
                            <Lock className="h-4 w-4 text-yellow-500" />
                          )}
                          {config.strictness === "high" && (
                            <Lock className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Applied Policies:</Label>
                        <div className="flex flex-wrap gap-1">
                          {config.policies.map((policyId) => (
                            <Badge
                              key={policyId}
                              variant="secondary"
                              className="text-xs"
                            >
                              {policies.find((p) => p.id === policyId)?.name ||
                                policyId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 border rounded-lg space-y-3 bg-muted/30">
                    <Label className="text-sm font-medium">Add New Role</Label>
                    <div className="grid gap-3">
                      <Input
                        placeholder="Role name (e.g., developer, analyst)"
                        value={newRole.role}
                        onChange={(e) =>
                          setNewRole({ ...newRole, role: e.target.value })
                        }
                      />
                      <Select
                        value={newRole.strictness}
                        onValueChange={(value) =>
                          setNewRole({ ...newRole, strictness: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select strictness level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={handleAddRoleConfig}
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Role Configuration
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Semantic Whitelist Tab */}
            <TabsContent value="whitelist" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    Semantic Whitelisting
                  </CardTitle>
                  <CardDescription>
                    Positive security model - define allowed behaviors instead
                    of blocked ones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border rounded-lg bg-green-500/10 border-green-500/20">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Positive Security Model Active
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Only explicitly allowed intents and behaviors will be
                          permitted. All others will be blocked.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label>Allowed Intent Categories</Label>
                      <div className="grid md:grid-cols-2 gap-3 mt-2">
                        {intentCategories.map((category, idx) => (
                          <div
                            key={category.name}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <span className="text-sm">{category.name}</span>
                            <Switch
                              checked={category.enabled}
                              onCheckedChange={() => toggleIntentCategory(idx)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label>Behavioral Consistency Threshold</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Input
                          type="range"
                          min="0"
                          max="100"
                          value={whitelistThreshold}
                          onChange={(e) =>
                            setWhitelistThreshold(
                              Number.parseInt(e.target.value)
                            )
                          }
                          className="flex-1"
                        />
                        <span className="text-sm font-mono w-12">
                          {whitelistThreshold}%
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum similarity to allowed patterns required for
                        approval
                      </p>
                    </div>

                    <div className="p-4 border rounded-lg space-y-2">
                      <Label className="text-sm">Whitelist Statistics</Label>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold">
                            {intentCategories.filter((c) => c.enabled).length}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Allowed Intents
                          </p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">8,953</div>
                          <p className="text-xs text-muted-foreground">
                            Approved Requests
                          </p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">98.2%</div>
                          <p className="text-xs text-muted-foreground">
                            Accuracy
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Total Blocked
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {policyAnalytics.totalBlocked.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last 30 days
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Total Allowed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {policyAnalytics.totalAllowed.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Last 30 days
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Block Rate
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {policyAnalytics.blockRate}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Average rate
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Active Policies
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {policies.filter((p) => p.enabled).length}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Currently enabled
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Policy Effectiveness
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {policyAnalytics.topPolicies.map((policy) => (
                        <div key={policy.name} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span>{policy.name}</span>
                            <span className="font-mono">
                              {policy.effectiveness}%
                            </span>
                          </div>
                          <Progress
                            value={policy.effectiveness}
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground">
                            {policy.blocks} blocks
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Weekly Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={policyAnalytics.trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="blocked"
                          stroke="#ef4444"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="allowed"
                          stroke="#22c55e"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <PolicyEditorDialog
            open={isEditorOpen}
            onOpenChange={setIsEditorOpen}
            policy={selectedPolicy}
            onSave={handleSavePolicy}
          />
        </div>
      </div>
    </div>
  );
}
