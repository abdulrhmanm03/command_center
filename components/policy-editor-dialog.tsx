"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, TestTube, Save } from "lucide-react"

export interface PolicyRule {
  id: string
  pattern: string
  type: "regex" | "keyword" | "semantic" | "embedding"
  weight: number
  description: string
}

export interface Policy {
  id: string
  name: string
  description: string
  enabled: boolean
  severity: "critical" | "high" | "medium" | "low"
  rules: PolicyRule[]
  thresholds: {
    confidence: number
    riskScore: number
  }
  actions: {
    block: boolean
    alert: boolean
    log: boolean
    quarantine: boolean
  }
  metadata: {
    created: string
    updated: string
    version: string
  }
}

interface PolicyEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  policy?: Policy
  onSave: (policy: Policy) => void
}

export function PolicyEditorDialog({ open, onOpenChange, policy, onSave }: PolicyEditorDialogProps) {
  const [editedPolicy, setEditedPolicy] = useState<Policy>(
    policy || {
      id: `policy_${Date.now()}`,
      name: "",
      description: "",
      enabled: true,
      severity: "medium",
      rules: [],
      thresholds: {
        confidence: 0.7,
        riskScore: 60,
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
    },
  )

  const [newRule, setNewRule] = useState<Partial<PolicyRule>>({
    pattern: "",
    type: "regex",
    weight: 1.0,
    description: "",
  })

  const [testInput, setTestInput] = useState("")
  const [testResult, setTestResult] = useState<{ matched: boolean; rules: string[] } | null>(null)

  const addRule = () => {
    if (!newRule.pattern || !newRule.description) return

    const rule: PolicyRule = {
      id: `rule_${Date.now()}`,
      pattern: newRule.pattern,
      type: newRule.type as PolicyRule["type"],
      weight: newRule.weight || 1.0,
      description: newRule.description,
    }

    setEditedPolicy({
      ...editedPolicy,
      rules: [...editedPolicy.rules, rule],
    })

    setNewRule({
      pattern: "",
      type: "regex",
      weight: 1.0,
      description: "",
    })
  }

  const removeRule = (ruleId: string) => {
    setEditedPolicy({
      ...editedPolicy,
      rules: editedPolicy.rules.filter((r) => r.id !== ruleId),
    })
  }

  const testPolicy = () => {
    const matchedRules: string[] = []

    editedPolicy.rules.forEach((rule) => {
      try {
        if (rule.type === "regex") {
          const regex = new RegExp(rule.pattern, "i")
          if (regex.test(testInput)) {
            matchedRules.push(rule.description)
          }
        } else if (rule.type === "keyword") {
          if (testInput.toLowerCase().includes(rule.pattern.toLowerCase())) {
            matchedRules.push(rule.description)
          }
        }
      } catch (e) {
        console.error("Invalid pattern:", rule.pattern)
      }
    })

    setTestResult({
      matched: matchedRules.length > 0,
      rules: matchedRules,
    })
  }

  const handleSave = () => {
    onSave({
      ...editedPolicy,
      metadata: {
        ...editedPolicy.metadata,
        updated: new Date().toISOString(),
      },
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{policy ? "Edit Policy" : "Create New Policy"}</DialogTitle>
          <DialogDescription>
            Configure detection rules, thresholds, and actions for this security policy
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="rules">Rules ({editedPolicy.rules.length})</TabsTrigger>
            <TabsTrigger value="thresholds">Thresholds</TabsTrigger>
            <TabsTrigger value="test">Test</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Policy Name</Label>
              <Input
                id="name"
                value={editedPolicy.name}
                onChange={(e) => setEditedPolicy({ ...editedPolicy, name: e.target.value })}
                placeholder="e.g., Advanced Prompt Injection Detection"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedPolicy.description}
                onChange={(e) => setEditedPolicy({ ...editedPolicy, description: e.target.value })}
                placeholder="Describe what this policy detects and prevents..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity Level</Label>
                <Select
                  value={editedPolicy.severity}
                  onValueChange={(value) => setEditedPolicy({ ...editedPolicy, severity: value as Policy["severity"] })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <div className="flex items-center gap-2 h-10">
                  <Switch
                    checked={editedPolicy.enabled}
                    onCheckedChange={(checked) => setEditedPolicy({ ...editedPolicy, enabled: checked })}
                  />
                  <span className="text-sm">{editedPolicy.enabled ? "Enabled" : "Disabled"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Actions</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Block Request</span>
                  <Switch
                    checked={editedPolicy.actions.block}
                    onCheckedChange={(checked) =>
                      setEditedPolicy({
                        ...editedPolicy,
                        actions: { ...editedPolicy.actions, block: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Send Alert</span>
                  <Switch
                    checked={editedPolicy.actions.alert}
                    onCheckedChange={(checked) =>
                      setEditedPolicy({
                        ...editedPolicy,
                        actions: { ...editedPolicy.actions, alert: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Log Event</span>
                  <Switch
                    checked={editedPolicy.actions.log}
                    onCheckedChange={(checked) =>
                      setEditedPolicy({
                        ...editedPolicy,
                        actions: { ...editedPolicy.actions, log: checked },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <span className="text-sm">Quarantine</span>
                  <Switch
                    checked={editedPolicy.actions.quarantine}
                    onCheckedChange={(checked) =>
                      setEditedPolicy({
                        ...editedPolicy,
                        actions: { ...editedPolicy.actions, quarantine: checked },
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium">Add New Rule</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Rule Type</Label>
                  <Select
                    value={newRule.type}
                    onValueChange={(value) => setNewRule({ ...newRule, type: value as PolicyRule["type"] })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regex">Regular Expression</SelectItem>
                      <SelectItem value="keyword">Keyword Match</SelectItem>
                      <SelectItem value="semantic">Semantic Analysis</SelectItem>
                      <SelectItem value="embedding">Embedding Distance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Weight (0-1)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    value={newRule.weight}
                    onChange={(e) => setNewRule({ ...newRule, weight: Number.parseFloat(e.target.value) })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Pattern</Label>
                <Input
                  value={newRule.pattern}
                  onChange={(e) => setNewRule({ ...newRule, pattern: e.target.value })}
                  placeholder={
                    newRule.type === "regex"
                      ? "e.g., ignore\\s+previous\\s+instructions"
                      : "e.g., ignore previous instructions"
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={newRule.description}
                  onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
                  placeholder="Describe what this rule detects..."
                />
              </div>
              <Button onClick={addRule} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Rule
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Active Rules ({editedPolicy.rules.length})</h4>
              {editedPolicy.rules.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No rules added yet</p>
              ) : (
                <div className="space-y-2">
                  {editedPolicy.rules.map((rule) => (
                    <div key={rule.id} className="flex items-start gap-3 p-3 border rounded-lg">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{rule.type}</Badge>
                          <span className="text-sm font-medium">{rule.description}</span>
                        </div>
                        <code className="text-xs text-muted-foreground block bg-muted px-2 py-1 rounded">
                          {rule.pattern}
                        </code>
                        <span className="text-xs text-muted-foreground">Weight: {rule.weight}</span>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeRule(rule.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="thresholds" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Confidence Threshold</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={editedPolicy.thresholds.confidence}
                    onChange={(e) =>
                      setEditedPolicy({
                        ...editedPolicy,
                        thresholds: { ...editedPolicy.thresholds, confidence: Number.parseFloat(e.target.value) },
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-12">{editedPolicy.thresholds.confidence.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum confidence score required to trigger this policy
                </p>
              </div>

              <div className="space-y-2">
                <Label>Risk Score Threshold</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={editedPolicy.thresholds.riskScore}
                    onChange={(e) =>
                      setEditedPolicy({
                        ...editedPolicy,
                        thresholds: { ...editedPolicy.thresholds, riskScore: Number.parseInt(e.target.value) },
                      })
                    }
                    className="flex-1"
                  />
                  <span className="text-sm font-mono w-12">{editedPolicy.thresholds.riskScore}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Minimum risk score (0-100) required to trigger this policy
                </p>
              </div>

              <div className="p-4 border rounded-lg bg-muted/30">
                <h4 className="font-medium mb-2">Threshold Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Confidence:</span>
                    <span className="font-mono">{(editedPolicy.thresholds.confidence * 100).toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk Score:</span>
                    <span className="font-mono">{editedPolicy.thresholds.riskScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sensitivity:</span>
                    <span className="font-mono">
                      {editedPolicy.thresholds.confidence < 0.5
                        ? "High"
                        : editedPolicy.thresholds.confidence < 0.8
                          ? "Medium"
                          : "Low"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4">
            <div className="space-y-2">
              <Label>Test Input</Label>
              <Textarea
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                placeholder="Enter text to test against this policy..."
                rows={4}
              />
            </div>

            <Button onClick={testPolicy} className="w-full">
              <TestTube className="mr-2 h-4 w-4" />
              Run Test
            </Button>

            {testResult && (
              <div
                className={`p-4 border rounded-lg ${testResult.matched ? "border-destructive bg-destructive/10" : "border-green-500 bg-green-500/10"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={testResult.matched ? "destructive" : "default"}>
                    {testResult.matched ? "THREAT DETECTED" : "CLEAN"}
                  </Badge>
                  <span className="text-sm font-medium">
                    {testResult.matched ? `${testResult.rules.length} rule(s) matched` : "No threats detected"}
                  </span>
                </div>
                {testResult.matched && (
                  <div className="space-y-1 mt-3">
                    <p className="text-sm font-medium">Matched Rules:</p>
                    <ul className="list-disc list-inside space-y-1">
                      {testResult.rules.map((rule, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          {rule}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Policy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
