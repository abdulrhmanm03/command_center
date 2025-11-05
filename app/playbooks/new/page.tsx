"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Play,
  AlertTriangle,
  Mail,
  Shield,
  Database,
  Webhook,
  Terminal,
  Clock,
  GitBranch,
  Zap,
} from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

interface PlaybookStep {
  id: string
  type: "action" | "condition" | "delay"
  name: string
  description: string
  config: Record<string, any>
}

export default function NewPlaybookPage() {
  const router = useRouter()
  const [playbookName, setPlaybookName] = useState("")
  const [playbookDescription, setPlaybookDescription] = useState("")
  const [category, setCategory] = useState("incident-response")
  const [automationLevel, setAutomationLevel] = useState("semi-automated")
  const [triggers, setTriggers] = useState<string[]>([])
  const [newTrigger, setNewTrigger] = useState("")
  const [steps, setSteps] = useState<PlaybookStep[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const addTrigger = () => {
    if (newTrigger.trim()) {
      setTriggers([...triggers, newTrigger.trim()])
      setNewTrigger("")
    }
  }

  const removeTrigger = (index: number) => {
    setTriggers(triggers.filter((_, i) => i !== index))
  }

  const addStep = (type: "action" | "condition" | "delay") => {
    const newStep: PlaybookStep = {
      id: `step-${Date.now()}`,
      type,
      name: type === "action" ? "New Action" : type === "condition" ? "New Condition" : "Delay",
      description: "",
      config: {},
    }
    setSteps([...steps, newStep])
  }

  const updateStep = (id: string, updates: Partial<PlaybookStep>) => {
    setSteps(steps.map((step) => (step.id === id ? { ...step, ...updates } : step)))
  }

  const removeStep = (id: string) => {
    setSteps(steps.filter((step) => step.id !== id))
  }

  const moveStep = (index: number, direction: "up" | "down") => {
    const newSteps = [...steps]
    const targetIndex = direction === "up" ? index - 1 : index + 1
    if (targetIndex >= 0 && targetIndex < steps.length) {
      ;[newSteps[index], newSteps[targetIndex]] = [newSteps[targetIndex], newSteps[index]]
      setSteps(newSteps)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    router.push("/playbooks")
  }

  const getStepIcon = (type: string) => {
    switch (type) {
      case "action":
        return <Zap className="h-5 w-5 text-cyan-400" />
      case "condition":
        return <GitBranch className="h-5 w-5 text-purple-400" />
      case "delay":
        return <Clock className="h-5 w-5 text-orange-400" />
      default:
        return <Zap className="h-5 w-5" />
    }
  }

  const actionTemplates = [
    { icon: <Mail className="h-4 w-4" />, label: "Send Email", type: "email" },
    { icon: <Shield className="h-4 w-4" />, label: "Block IP", type: "firewall" },
    { icon: <Database className="h-4 w-4" />, label: "Query Database", type: "database" },
    { icon: <Webhook className="h-4 w-4" />, label: "Webhook", type: "webhook" },
    { icon: <Terminal className="h-4 w-4" />, label: "Run Script", type: "script" },
    { icon: <AlertTriangle className="h-4 w-4" />, label: "Create Alert", type: "alert" },
  ]

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/playbooks")}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Playbooks
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-cyan-400">Create SOAR Playbook</h1>
                <p className="text-muted-foreground">Design automated security orchestration workflows</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-gray-700 bg-transparent">
                <Play className="mr-2 h-4 w-4" />
                Test Run
              </Button>
              <Button
                size="sm"
                className="bg-cyan-500 text-black hover:bg-cyan-400"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? "Saving..." : "Save Playbook"}
              </Button>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Configuration Panel */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg text-cyan-400">Playbook Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className="text-gray-300">
                      Playbook Name
                    </Label>
                    <Input
                      id="name"
                      value={playbookName}
                      onChange={(e) => setPlaybookName(e.target.value)}
                      placeholder="e.g., Ransomware Response"
                      className="mt-1 bg-background border-border/50"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-300">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={playbookDescription}
                      onChange={(e) => setPlaybookDescription(e.target.value)}
                      placeholder="Describe what this playbook does..."
                      className="mt-1 bg-background border-border/50"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="category" className="text-gray-300">
                      Category
                    </Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="mt-1 bg-background border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="incident-response">Incident Response</SelectItem>
                        <SelectItem value="threat-hunting">Threat Hunting</SelectItem>
                        <SelectItem value="vulnerability-management">Vulnerability Management</SelectItem>
                        <SelectItem value="compliance">Compliance</SelectItem>
                        <SelectItem value="forensics">Forensics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="automation" className="text-gray-300">
                      Automation Level
                    </Label>
                    <Select value={automationLevel} onValueChange={setAutomationLevel}>
                      <SelectTrigger className="mt-1 bg-background border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fully-automated">Fully Automated</SelectItem>
                        <SelectItem value="semi-automated">Semi-Automated</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg text-cyan-400">Triggers</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTrigger}
                      onChange={(e) => setNewTrigger(e.target.value)}
                      placeholder="e.g., High severity alert"
                      className="bg-background border-border/50"
                      onKeyPress={(e) => e.key === "Enter" && addTrigger()}
                    />
                    <Button size="sm" onClick={addTrigger} className="bg-cyan-500 text-black hover:bg-cyan-400">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {triggers.map((trigger, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg bg-background/50 p-2">
                        <span className="text-sm text-gray-300">{trigger}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeTrigger(index)}
                          className="h-6 w-6 p-0 text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg text-cyan-400">Add Step</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => addStep("action")}
                    className="w-full justify-start bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20"
                    variant="outline"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Action Step
                  </Button>
                  <Button
                    onClick={() => addStep("condition")}
                    className="w-full justify-start bg-purple-500/10 text-purple-400 hover:bg-purple-500/20"
                    variant="outline"
                  >
                    <GitBranch className="mr-2 h-4 w-4" />
                    Condition Step
                  </Button>
                  <Button
                    onClick={() => addStep("delay")}
                    className="w-full justify-start bg-orange-500/10 text-orange-400 hover:bg-orange-500/20"
                    variant="outline"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Delay Step
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Workflow Builder */}
            <div className="lg:col-span-2">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg text-cyan-400">Workflow Steps</CardTitle>
                  <p className="text-sm text-gray-400">Define the sequence of actions for this playbook</p>
                </CardHeader>
                <CardContent>
                  {steps.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <GitBranch className="mb-4 h-12 w-12 text-gray-600" />
                      <h3 className="mb-2 text-lg font-semibold text-white">No Steps Added</h3>
                      <p className="mb-4 text-sm text-gray-400">
                        Start building your playbook by adding action, condition, or delay steps
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {steps.map((step, index) => (
                        <Card key={step.id} className="border-border/30 bg-background/50">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="flex flex-col items-center">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-background">
                                  {getStepIcon(step.type)}
                                </div>
                                {index < steps.length - 1 && <div className="my-2 h-8 w-0.5 bg-border/50" />}
                              </div>
                              <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      Step {index + 1}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className={
                                        step.type === "action"
                                          ? "border-cyan-500/50 text-cyan-400"
                                          : step.type === "condition"
                                            ? "border-purple-500/50 text-purple-400"
                                            : "border-orange-500/50 text-orange-400"
                                      }
                                    >
                                      {step.type}
                                    </Badge>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => moveStep(index, "up")}
                                      disabled={index === 0}
                                      className="h-7 w-7 p-0"
                                    >
                                      ↑
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => moveStep(index, "down")}
                                      disabled={index === steps.length - 1}
                                      className="h-7 w-7 p-0"
                                    >
                                      ↓
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => removeStep(step.id)}
                                      className="h-7 w-7 p-0 text-red-400 hover:text-red-300"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <Input
                                  value={step.name}
                                  onChange={(e) => updateStep(step.id, { name: e.target.value })}
                                  placeholder="Step name"
                                  className="bg-background border-border/50"
                                />
                                <Textarea
                                  value={step.description}
                                  onChange={(e) => updateStep(step.id, { description: e.target.value })}
                                  placeholder="Step description and configuration..."
                                  className="bg-background border-border/50"
                                  rows={2}
                                />
                                {step.type === "action" && (
                                  <div className="flex flex-wrap gap-2">
                                    {actionTemplates.map((template, i) => (
                                      <Button
                                        key={i}
                                        size="sm"
                                        variant="outline"
                                        className="h-7 text-xs border-border/50 bg-transparent"
                                      >
                                        {template.icon}
                                        <span className="ml-1">{template.label}</span>
                                      </Button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
