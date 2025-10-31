"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Download,
  Upload,
  Plus,
  Trash2,
  Edit,
  Save,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
  status: "active" | "inactive"
  lastLogin: string
  permissions: string[]
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
}

interface APIKey {
  id: string
  name: string
  key: string
  created: string
  lastUsed: string
  status: "active" | "revoked"
  permissions: string[]
}

interface ModelConfig {
  id: string
  name: string
  version: string
  status: "active" | "training" | "idle"
  accuracy: number
  lastTrained: string
  dataset: string
}

export function SettingsView() {
  const { toast } = useToast()

  const [users, setUsers] = useState<User[]>([])

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("firewall-users")
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers))
    } else {
      // Initialize with default users if none exist
      const defaultUsers = [
        {
          id: "1",
          name: "John Doe",
          email: "john@company.com",
          role: "Admin",
          status: "active" as const,
          lastLogin: "2 hours ago",
          permissions: ["all"],
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@company.com",
          role: "Security Analyst",
          status: "active" as const,
          lastLogin: "1 day ago",
          permissions: ["view_threats", "manage_policies"],
        },
        {
          id: "3",
          name: "Bob Johnson",
          email: "bob@company.com",
          role: "Viewer",
          status: "active" as const,
          lastLogin: "3 days ago",
          permissions: ["view_threats"],
        },
        {
          id: "4",
          name: "Alice Williams",
          email: "alice@company.com",
          role: "Security Analyst",
          status: "inactive" as const,
          lastLogin: "1 week ago",
          permissions: ["view_threats", "manage_policies"],
        },
      ]
      setUsers(defaultUsers)
      localStorage.setItem("firewall-users", JSON.stringify(defaultUsers))
    }
  }, [])

  // Save users to localStorage whenever they change
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem("firewall-users", JSON.stringify(users))
    }
  }, [users])

  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "Viewer",
    status: "active" as "active" | "inactive",
  })

  const [roles, setRoles] = useState<Role[]>([
    { id: "1", name: "Admin", description: "Full system access", permissions: ["all"], userCount: 1 },
    {
      id: "2",
      name: "Security Analyst",
      description: "Manage threats and policies",
      permissions: ["view_threats", "manage_policies", "view_analytics"],
      userCount: 2,
    },
    { id: "3", name: "Viewer", description: "Read-only access", permissions: ["view_threats"], userCount: 1 },
  ])

  const [apiKeys, setApiKeys] = useState<APIKey[]>([
    {
      id: "1",
      name: "Production API",
      key: "sk_live_abc123...xyz789",
      created: "2024-01-15",
      lastUsed: "2 hours ago",
      status: "active",
      permissions: ["read", "write"],
    },
    {
      id: "2",
      name: "Development API",
      key: "sk_test_def456...uvw012",
      created: "2024-02-01",
      lastUsed: "1 day ago",
      status: "active",
      permissions: ["read"],
    },
    {
      id: "3",
      name: "Legacy API",
      key: "sk_live_ghi789...rst345",
      created: "2023-12-01",
      lastUsed: "2 months ago",
      status: "revoked",
      permissions: ["read"],
    },
  ])

  const [models, setModels] = useState<ModelConfig[]>([
    {
      id: "1",
      name: "Prompt Injection Detector",
      version: "v2.3.1",
      status: "active",
      accuracy: 94.5,
      lastTrained: "2024-01-20",
      dataset: "custom_prompts_v3",
    },
    {
      id: "2",
      name: "Toxicity Classifier",
      version: "v1.8.0",
      status: "active",
      accuracy: 91.2,
      lastTrained: "2024-01-18",
      dataset: "toxicity_corpus_v2",
    },
    {
      id: "3",
      name: "Jailbreak Detector",
      version: "v3.0.0",
      status: "training",
      accuracy: 96.8,
      lastTrained: "2024-01-25",
      dataset: "jailbreak_patterns_v4",
    },
  ])

  const [userDialog, setUserDialog] = useState(false)
  const [roleDialog, setRoleDialog] = useState(false)
  const [apiKeyDialog, setApiKeyDialog] = useState(false)
  const [modelDialog, setModelDialog] = useState(false)
  const [backupDialog, setBackupDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showApiKey, setShowApiKey] = useState<string | null>(null)

  // Behavioral tuning parameters
  const [tuningParams, setTuningParams] = useState({
    promptInjectionThreshold: 75,
    toxicityThreshold: 80,
    jailbreakSensitivity: 70,
    anomalyDetectionRate: 85,
    falsePositiveReduction: 60,
  })

  // System settings
  const [systemSettings, setSystemSettings] = useState({
    enableRealTimeMonitoring: true,
    enableAutoBlocking: true,
    enableEmailAlerts: true,
    enableSlackIntegration: false,
    logRetentionDays: 90,
    maxRequestsPerMinute: 1000,
  })

  // Billing data
  const [billingData] = useState({
    plan: "Enterprise",
    requestsThisMonth: 2847563,
    requestLimit: 5000000,
    cost: 2847.56,
    nextBillingDate: "2024-02-01",
  })

  const handleAddUser = () => {
    setSelectedUser(null)
    setUserForm({ name: "", email: "", role: "Viewer", status: "active" })
    setUserDialog(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setUserForm({ name: user.name, email: user.email, role: user.role, status: user.status })
    setUserDialog(true)
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((u) => u.id !== userId))
    toast({ title: "User deleted", description: "User has been removed from the system." })
  }

  const handleSaveUser = () => {
    if (!userForm.name || !userForm.email) {
      toast({
        title: "Validation error",
        description: "Name and email are required.",
        variant: "destructive",
      })
      return
    }

    if (selectedUser) {
      // Update existing user
      setUsers(
        users.map((u) =>
          u.id === selectedUser.id
            ? {
                ...u,
                name: userForm.name,
                email: userForm.email,
                role: userForm.role,
                status: userForm.status,
              }
            : u,
        ),
      )
      toast({ title: "User updated", description: "User has been updated successfully." })
    } else {
      // Create new user
      const newUser: User = {
        id: String(Date.now()),
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        status: userForm.status,
        lastLogin: "Never",
        permissions:
          userForm.role === "Admin"
            ? ["all"]
            : userForm.role === "Security Analyst"
              ? ["view_threats", "manage_policies"]
              : ["view_threats"],
      }
      setUsers([...users, newUser])
      toast({ title: "User created", description: "New user has been added successfully." })
    }

    setUserDialog(false)
  }

  const handleAddRole = () => {
    setSelectedRole(null)
    setRoleDialog(true)
  }

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setRoleDialog(true)
  }

  const handleSaveRole = () => {
    setRoleDialog(false)
    toast({ title: "Role saved", description: "Role has been updated successfully." })
  }

  const handleGenerateAPIKey = () => {
    const newKey: APIKey = {
      id: String(apiKeys.length + 1),
      name: "New API Key",
      key: `sk_live_${Math.random().toString(36).substring(2, 15)}...${Math.random().toString(36).substring(2, 8)}`,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "Never",
      status: "active",
      permissions: ["read"],
    }
    setApiKeys([...apiKeys, newKey])
    toast({ title: "API Key generated", description: "New API key has been created." })
  }

  const handleRevokeAPIKey = (keyId: string) => {
    setApiKeys(apiKeys.map((k) => (k.id === keyId ? { ...k, status: "revoked" as const } : k)))
    toast({ title: "API Key revoked", description: "API key has been revoked." })
  }

  const handleCopyAPIKey = (key: string) => {
    navigator.clipboard.writeText(key)
    toast({ title: "Copied", description: "API key copied to clipboard." })
  }

  const handleRetrainModel = (modelId: string) => {
    setModels(models.map((m) => (m.id === modelId ? { ...m, status: "training" as const } : m)))
    toast({ title: "Model retraining started", description: "Model is being retrained on the latest dataset." })

    // Simulate training completion
    setTimeout(() => {
      setModels(
        models.map((m) =>
          m.id === modelId ? { ...m, status: "active" as const, accuracy: m.accuracy + Math.random() * 2 } : m,
        ),
      )
      toast({ title: "Model training complete", description: "Model has been successfully retrained." })
    }, 5000)
  }

  const handleBackupPolicies = () => {
    toast({ title: "Backup started", description: "Creating backup of all policies and configurations..." })
    setTimeout(() => {
      toast({ title: "Backup complete", description: "Backup file has been downloaded." })
    }, 2000)
  }

  const handleRestorePolicies = () => {
    setBackupDialog(true)
  }

  const handleSaveTuningParams = () => {
    toast({ title: "Parameters saved", description: "Behavioral tuning parameters have been updated." })
  }

  const handleSaveSystemSettings = () => {
    toast({ title: "Settings saved", description: "System settings have been updated." })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage system configuration, users, and administrative controls</p>
      </div>

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="rbac">RBAC</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
          <TabsTrigger value="api">API Keys</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="tuning">Tuning</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage users and their access levels</CardDescription>
                </div>
                <Button onClick={handleAddUser}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.role}</Badge>
                      <Badge variant={user.status === "active" ? "default" : "outline"}>{user.status}</Badge>
                      <div className="text-sm text-muted-foreground">Last login: {user.lastLogin}</div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* RBAC Configuration Tab */}
        <TabsContent value="rbac" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Role-Based Access Control</CardTitle>
                  <CardDescription>Define roles and permissions</CardDescription>
                </div>
                <Button onClick={handleAddRole}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Role
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {roles.map((role) => (
                  <div key={role.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-lg">{role.name}</div>
                        <div className="text-sm text-muted-foreground">{role.description}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge>{role.userCount} users</Badge>
                        <Button size="sm" variant="outline" onClick={() => handleEditRole(role)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((perm) => (
                        <Badge key={perm} variant="secondary">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Model Configuration Tab */}
        <TabsContent value="models" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Semantic Model Configuration</CardTitle>
              <CardDescription>Manage and retrain AI models on custom datasets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {models.map((model) => (
                  <div key={model.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium text-lg">{model.name}</div>
                        <div className="text-sm text-muted-foreground">Version {model.version}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            model.status === "active"
                              ? "default"
                              : model.status === "training"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {model.status}
                        </Badge>
                        <Button
                          size="sm"
                          onClick={() => handleRetrainModel(model.id)}
                          disabled={model.status === "training"}
                        >
                          <RefreshCw className={`h-4 w-4 mr-2 ${model.status === "training" ? "animate-spin" : ""}`} />
                          Retrain
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Accuracy</div>
                        <div className="font-medium">{model.accuracy.toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Last Trained</div>
                        <div className="font-medium">{model.lastTrained}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Dataset</div>
                        <div className="font-medium">{model.dataset}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup & Restore Tab */}
        <TabsContent value="backup" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Backup Policies</CardTitle>
                <CardDescription>Create a backup of all policies and configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">Last backup: 2024-01-20 14:30 UTC</div>
                <Button onClick={handleBackupPolicies} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Create Backup
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Restore Policies</CardTitle>
                <CardDescription>Restore policies from a previous backup</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">Upload a backup file to restore</div>
                <Button onClick={handleRestorePolicies} variant="outline" className="w-full bg-transparent">
                  <Upload className="mr-2 h-4 w-4" />
                  Restore from Backup
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>Previous backups</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { date: "2024-01-20 14:30", size: "2.4 MB", status: "success" },
                  { date: "2024-01-15 10:15", size: "2.3 MB", status: "success" },
                  { date: "2024-01-10 09:00", size: "2.2 MB", status: "success" },
                ].map((backup, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <div>
                        <div className="font-medium">{backup.date}</div>
                        <div className="text-sm text-muted-foreground">{backup.size}</div>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>API Keys</CardTitle>
                  <CardDescription>Manage API keys for integrations</CardDescription>
                </div>
                <Button onClick={handleGenerateAPIKey}>
                  <Plus className="mr-2 h-4 w-4" />
                  Generate Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="font-medium">{apiKey.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <code className="text-sm bg-muted px-2 py-1 rounded">
                            {showApiKey === apiKey.id
                              ? apiKey.key
                              : apiKey.key.replace(/(?<=.{8}).*(?=.{6})/, "•".repeat(20))}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)}
                          >
                            {showApiKey === apiKey.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleCopyAPIKey(apiKey.key)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={apiKey.status === "active" ? "default" : "secondary"}>{apiKey.status}</Badge>
                        {apiKey.status === "active" && (
                          <Button size="sm" variant="outline" onClick={() => handleRevokeAPIKey(apiKey.id)}>
                            Revoke
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Created</div>
                        <div className="font-medium">{apiKey.created}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Last Used</div>
                        <div className="font-medium">{apiKey.lastUsed}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Permissions</div>
                        <div className="flex gap-1">
                          {apiKey.permissions.map((p) => (
                            <Badge key={p} variant="secondary" className="text-xs">
                              {p}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{billingData.plan}</div>
                <div className="text-sm text-muted-foreground mt-2">Next billing: {billingData.nextBillingDate}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{billingData.requestsThisMonth.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground mt-2">
                  of {billingData.requestLimit.toLocaleString()} requests
                </div>
                <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(billingData.requestsThisMonth / billingData.requestLimit) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${billingData.cost.toFixed(2)}</div>
                <div className="text-sm text-muted-foreground mt-2">Estimated for this month</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Usage History</CardTitle>
              <CardDescription>Request volume over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { month: "January 2024", requests: 2847563, cost: 2847.56 },
                  { month: "December 2023", requests: 3124789, cost: 3124.79 },
                  { month: "November 2023", requests: 2956432, cost: 2956.43 },
                ].map((month, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{month.month}</div>
                      <div className="text-sm text-muted-foreground">{month.requests.toLocaleString()} requests</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${month.cost.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings Tab */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Configuration</CardTitle>
              <CardDescription>General system settings and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Real-time Monitoring</div>
                  <div className="text-sm text-muted-foreground">Enable continuous threat monitoring</div>
                </div>
                <Switch
                  checked={systemSettings.enableRealTimeMonitoring}
                  onCheckedChange={(checked) =>
                    setSystemSettings({ ...systemSettings, enableRealTimeMonitoring: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Auto-blocking</div>
                  <div className="text-sm text-muted-foreground">Automatically block detected threats</div>
                </div>
                <Switch
                  checked={systemSettings.enableAutoBlocking}
                  onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, enableAutoBlocking: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Email Alerts</div>
                  <div className="text-sm text-muted-foreground">Send email notifications for critical threats</div>
                </div>
                <Switch
                  checked={systemSettings.enableEmailAlerts}
                  onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, enableEmailAlerts: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Slack Integration</div>
                  <div className="text-sm text-muted-foreground">Send alerts to Slack channels</div>
                </div>
                <Switch
                  checked={systemSettings.enableSlackIntegration}
                  onCheckedChange={(checked) =>
                    setSystemSettings({ ...systemSettings, enableSlackIntegration: checked })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Log Retention (days)</Label>
                <Input
                  type="number"
                  value={systemSettings.logRetentionDays}
                  onChange={(e) =>
                    setSystemSettings({ ...systemSettings, logRetentionDays: Number.parseInt(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Max Requests Per Minute</Label>
                <Input
                  type="number"
                  value={systemSettings.maxRequestsPerMinute}
                  onChange={(e) =>
                    setSystemSettings({ ...systemSettings, maxRequestsPerMinute: Number.parseInt(e.target.value) })
                  }
                />
              </div>

              <Button onClick={handleSaveSystemSettings}>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Behavioral Tuning Tab */}
        <TabsContent value="tuning" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Behavioral Fine-Tuning</CardTitle>
              <CardDescription>Adjust detection thresholds and sensitivity for evolving threats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Prompt Injection Threshold</Label>
                    <span className="text-sm font-medium">{tuningParams.promptInjectionThreshold}%</span>
                  </div>
                  <Slider
                    value={[tuningParams.promptInjectionThreshold]}
                    onValueChange={([value]) => setTuningParams({ ...tuningParams, promptInjectionThreshold: value })}
                    max={100}
                    step={1}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Higher values = fewer false positives, but may miss subtle attacks
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Toxicity Detection Threshold</Label>
                    <span className="text-sm font-medium">{tuningParams.toxicityThreshold}%</span>
                  </div>
                  <Slider
                    value={[tuningParams.toxicityThreshold]}
                    onValueChange={([value]) => setTuningParams({ ...tuningParams, toxicityThreshold: value })}
                    max={100}
                    step={1}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Adjust sensitivity for toxic content detection
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Jailbreak Sensitivity</Label>
                    <span className="text-sm font-medium">{tuningParams.jailbreakSensitivity}%</span>
                  </div>
                  <Slider
                    value={[tuningParams.jailbreakSensitivity]}
                    onValueChange={([value]) => setTuningParams({ ...tuningParams, jailbreakSensitivity: value })}
                    max={100}
                    step={1}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Higher sensitivity catches more jailbreak attempts
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>Anomaly Detection Rate</Label>
                    <span className="text-sm font-medium">{tuningParams.anomalyDetectionRate}%</span>
                  </div>
                  <Slider
                    value={[tuningParams.anomalyDetectionRate]}
                    onValueChange={([value]) => setTuningParams({ ...tuningParams, anomalyDetectionRate: value })}
                    max={100}
                    step={1}
                  />
                  <div className="text-xs text-muted-foreground mt-1">Baseline for behavioral anomaly detection</div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label>False Positive Reduction</Label>
                    <span className="text-sm font-medium">{tuningParams.falsePositiveReduction}%</span>
                  </div>
                  <Slider
                    value={[tuningParams.falsePositiveReduction]}
                    onValueChange={([value]) => setTuningParams({ ...tuningParams, falsePositiveReduction: value })}
                    max={100}
                    step={1}
                  />
                  <div className="text-xs text-muted-foreground mt-1">ML-based reduction of false positive alerts</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSaveTuningParams}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Parameters
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setTuningParams({
                      promptInjectionThreshold: 75,
                      toxicityThreshold: 80,
                      jailbreakSensitivity: 70,
                      anomalyDetectionRate: 85,
                      falsePositiveReduction: 60,
                    })
                  }
                >
                  Reset to Defaults
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Dialog */}
      <Dialog open={userDialog} onOpenChange={setUserDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedUser ? "Edit User" : "Add User"}</DialogTitle>
            <DialogDescription>
              {selectedUser ? "Update user information and permissions" : "Create a new user account"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="John Doe"
                value={userForm.name}
                onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="john@company.com"
                value={userForm.email}
                onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={userForm.role} onValueChange={(value) => setUserForm({ ...userForm, role: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="Security Analyst">Security Analyst</SelectItem>
                  <SelectItem value="Viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={userForm.status}
                onValueChange={(value: "active" | "inactive") => setUserForm({ ...userForm, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUser}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Role Dialog */}
      <Dialog open={roleDialog} onOpenChange={setRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedRole ? "Edit Role" : "Add Role"}</DialogTitle>
            <DialogDescription>{selectedRole ? "Update role permissions" : "Create a new role"}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Role Name</Label>
              <Input placeholder="Security Analyst" defaultValue={selectedRole?.name} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea placeholder="Role description" defaultValue={selectedRole?.description} />
            </div>
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="space-y-2">
                {["view_threats", "manage_policies", "view_analytics", "manage_users", "system_config"].map((perm) => (
                  <div key={perm} className="flex items-center gap-2">
                    <input type="checkbox" id={perm} defaultChecked={selectedRole?.permissions.includes(perm)} />
                    <Label htmlFor={perm} className="font-normal">
                      {perm}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveRole}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup Restore Dialog */}
      <Dialog open={backupDialog} onOpenChange={setBackupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore from Backup</DialogTitle>
            <DialogDescription>Upload a backup file to restore policies and configurations</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">Drag and drop a backup file or click to browse</div>
              <Button variant="outline" className="mt-4 bg-transparent">
                Select File
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              Warning: This will overwrite current policies and configurations
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBackupDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setBackupDialog(false)
                toast({ title: "Restore complete", description: "Policies have been restored from backup." })
              }}
            >
              Restore
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
