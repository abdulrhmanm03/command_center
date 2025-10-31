// OWASP LLM Top 10 + AI Security Risk Rules

export const OWASP_LLM_TOP_10 = [
  {
    id: "LLM01",
    name: "Prompt Injection",
    description: "Manipulating LLM via crafted inputs",
    severity: "Critical",
  },
  {
    id: "LLM02",
    name: "Insecure Output Handling",
    description: "Insufficient validation of LLM outputs",
    severity: "High",
  },
  {
    id: "LLM03",
    name: "Training Data Poisoning",
    description: "Manipulating training data",
    severity: "High",
  },
  {
    id: "LLM04",
    name: "Model Denial of Service",
    description: "Resource exhaustion attacks",
    severity: "Medium",
  },
  {
    id: "LLM05",
    name: "Supply Chain Vulnerabilities",
    description: "Third-party components and data",
    severity: "High",
  },
  {
    id: "LLM06",
    name: "Sensitive Information Disclosure",
    description: "Revealing confidential data",
    severity: "Critical",
  },
  {
    id: "LLM07",
    name: "Insecure Plugin Design",
    description: "Unsafe plugin architecture",
    severity: "High",
  },
  {
    id: "LLM08",
    name: "Excessive Agency",
    description: "Unconstrained LLM actions",
    severity: "Medium",
  },
  {
    id: "LLM09",
    name: "Overreliance",
    description: "Excessive trust in LLM outputs",
    severity: "Medium",
  },
  {
    id: "LLM10",
    name: "Model Theft",
    description: "Unauthorized access to models",
    severity: "High",
  },
]

export const AI_ASSET_TYPES = [
  { value: "LLM", label: "LLM Models", icon: "Brain" },
  { value: "Dataset", label: "Datasets", icon: "Database" },
  { value: "Plugin", label: "Plug-ins", icon: "Plug" },
  { value: "Actor", label: "Actors", icon: "User" },
  { value: "Pipeline", label: "Pipelines", icon: "GitBranch" },
  { value: "VectorDB", label: "Vector DBs", icon: "Database" },
]

export const CLOUD_PROVIDERS = [
  { value: "AWS", label: "AWS", color: "orange" },
  { value: "GCP", label: "GCP", color: "blue" },
  { value: "Azure", label: "Azure", color: "cyan" },
  { value: "OpenAI", label: "OpenAI", color: "green" },
  { value: "Anthropic", label: "Anthropic", color: "purple" },
]

export const RISK_THRESHOLDS = {
  critical: { min: 80, max: 100, color: "red" },
  high: { min: 60, max: 79, color: "orange" },
  medium: { min: 40, max: 59, color: "yellow" },
  low: { min: 0, max: 39, color: "green" },
}

export function calculatePostureScore(assets: any[]): number {
  if (assets.length === 0) return 100

  const totalRisk = assets.reduce((sum, asset) => sum + asset.risk_score, 0)
  const avgRisk = totalRisk / assets.length

  // Convert risk (0-100) to posture score (100-0)
  return Math.round(100 - avgRisk)
}

export function getRiskLevel(score: number): "Critical" | "High" | "Medium" | "Low" {
  if (score >= 80) return "Critical"
  if (score >= 60) return "High"
  if (score >= 40) return "Medium"
  return "Low"
}
