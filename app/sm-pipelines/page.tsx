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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Settings,
  Play,
  Pause,
  GitBranch,
  Database,
  Cpu,
  Network,
  Shield,
  AlertCircle,
} from "lucide-react";
import { NeuralNetworkVisualizer } from "@/components/neural-network-visualizer";
import { SidebarNav } from "@/components/sidebar-nav"; // ✅ import sidebar

interface Pipeline {
  id: string;
  name: string;
  status: "active" | "paused" | "error";
  model: string;
  endpoint: string;
  requestsPerMin: number;
  threatsBlocked: number;
  lastActivity: string;
  protectionLevel: "strict" | "balanced" | "permissive";
  dataFlow: {
    input: string;
    processing: string[];
    output: string;
  };
}

export default function PipelinesView() {
  const [pipelines, setPipelines] = useState<Pipeline[]>([
    {
      id: "pipe-1",
      name: "Production Chat API",
      status: "active",
      model: "vts-llm-1",
      endpoint: "/v1/chat/completions",
      requestsPerMin: 245,
      threatsBlocked: 12,
      lastActivity: "2 seconds ago",
      protectionLevel: "strict",
      dataFlow: {
        input: "User Input",
        processing: [
          "Input Validation",
          "Semantic Analysis",
          "Threat Detection",
          "Model Inference",
        ],
        output: "API Response",
      },
    },
    {
      id: "pipe-2",
      name: "RAG Document Search",
      status: "active",
      model: "vts-llm-2",
      endpoint: "/v1/embeddings",
      requestsPerMin: 89,
      threatsBlocked: 3,
      lastActivity: "5 seconds ago",
      protectionLevel: "balanced",
      dataFlow: {
        input: "Search Query",
        processing: [
          "Query Sanitization",
          "Vector Embedding",
          "Data Poisoning Check",
          "Retrieval",
        ],
        output: "Search Results",
      },
    },
    {
      id: "pipe-3",
      name: "Content Moderation",
      status: "active",
      model: "client-model-a",
      endpoint: "/v1/moderation",
      requestsPerMin: 156,
      threatsBlocked: 45,
      lastActivity: "1 second ago",
      protectionLevel: "strict",
      dataFlow: {
        input: "User Content",
        processing: [
          "PII Detection",
          "Toxicity Analysis",
          "Jailbreak Detection",
          "Classification",
        ],
        output: "Moderation Result",
      },
    },
    {
      id: "pipe-4",
      name: "Training Data Pipeline",
      status: "paused",
      model: "custom-model",
      endpoint: "/v1/training",
      requestsPerMin: 0,
      threatsBlocked: 8,
      lastActivity: "2 hours ago",
      protectionLevel: "strict",
      dataFlow: {
        input: "Training Data",
        processing: [
          "Data Validation",
          "Poisoning Detection",
          "Anomaly Filtering",
          "Model Training",
        ],
        output: "Model Weights",
      },
    },
  ]);

  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(
    pipelines[0]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setPipelines((prev) =>
        prev.map((pipeline) => {
          if (pipeline.status === "active") {
            return {
              ...pipeline,
              requestsPerMin:
                pipeline.requestsPerMin + Math.floor(Math.random() * 10) - 3,
              threatsBlocked:
                Math.random() > 0.8
                  ? pipeline.threatsBlocked + 1
                  : pipeline.threatsBlocked,
              lastActivity: "just now",
            };
          }
          return pipeline;
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const togglePipelineStatus = (pipelineId: string) => {
    setPipelines((prev) =>
      prev.map((p) => {
        if (p.id === pipelineId) {
          const newStatus = p.status === "active" ? "paused" : "active";
          return {
            ...p,
            status: newStatus,
            requestsPerMin: newStatus === "paused" ? 0 : p.requestsPerMin,
          };
        }
        return p;
      })
    );

    if (selectedPipeline?.id === pipelineId) {
      setSelectedPipeline((prev) =>
        prev
          ? { ...prev, status: prev.status === "active" ? "paused" : "active" }
          : null
      );
    }
  };

  const getStatusColor = (status: Pipeline["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "paused":
        return "bg-yellow-500";
      case "error":
        return "bg-red-500";
    }
  };

  const getProtectionBadge = (level: Pipeline["protectionLevel"]) => {
    switch (level) {
      case "strict":
        return <Badge className="bg-red-500">Strict</Badge>;
      case "balanced":
        return <Badge className="bg-blue-500">Balanced</Badge>;
      case "permissive":
        return <Badge className="bg-green-500">Permissive</Badge>;
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
              <h1 className="text-3xl font-semibold tracking-tight text-blue-400 drop-shadow">
                AI Pipelines
              </h1>
              <p className="text-gray-400">
                Monitor and configure AI pipeline security
              </p>
            </div>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Pipeline
            </Button>
          </div>

          <NeuralNetworkVisualizer />

          <div className="grid gap-6 lg:grid-cols-3">
            {/* ✅ Pipeline List */}
            <Card className="lg:col-span-1 bg-white/5 border-none backdrop-blur-md">
              <CardHeader>
                <CardTitle className="text-base text-gray-300">
                  Active Pipelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {pipelines.map((pipeline) => (
                  <button
                    key={pipeline.id}
                    onClick={() => setSelectedPipeline(pipeline)}
                    className={`w-full rounded-lg border p-3 text-left transition-all duration-200 hover:bg-blue-500/10 ${
                      selectedPipeline?.id === pipeline.id
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-transparent"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-white">
                        {pipeline.name}
                      </span>
                      <div
                        className={`h-2 w-2 rounded-full ${getStatusColor(
                          pipeline.status
                        )}`}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Cpu className="h-3 w-3" />
                      <span>{pipeline.model}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                      <span>{pipeline.requestsPerMin} req/min</span>
                      <Badge variant="outline" className="text-xs">
                        {pipeline.threatsBlocked} blocked
                      </Badge>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* ✅ Pipeline Details */}
            {selectedPipeline && (
              <Card className="lg:col-span-2 bg-white/5 border-none backdrop-blur-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{selectedPipeline.name}</CardTitle>
                        {getProtectionBadge(selectedPipeline.protectionLevel)}
                      </div>
                      <CardDescription className="mt-1 text-gray-400">
                        {selectedPipeline.endpoint} • Last activity:{" "}
                        {selectedPipeline.lastActivity}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {selectedPipeline.status === "active" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            togglePipelineStatus(selectedPipeline.id)
                          }
                        >
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            togglePipelineStatus(selectedPipeline.id)
                          }
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Resume
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Tabs Section stays unchanged */}
                  <Tabs defaultValue="dataflow">{/* same content here */}</Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
