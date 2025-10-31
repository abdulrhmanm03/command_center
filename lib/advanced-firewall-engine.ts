// Advanced Semantic Firewall Engine for AI Pipeline Protection
// Implements behavioral analysis, embedding space monitoring, and multi-layer detection

export interface ThreatVector {
  type:
    | "prompt_injection"
    | "data_poisoning"
    | "jailbreak"
    | "rag_poisoning"
    | "embedding_attack"
    | "model_extraction"
    | "adversarial_input"
    | "pii_leakage"
    | "backdoor_trigger"
    | "context_injection"
    | "indirect_injection"
  severity: "critical" | "high" | "medium" | "low"
  confidence: number
  indicators: string[]
  vectorSimilarity?: number
  tokenAnalysis?: TokenAnalysis
  embeddingAnomaly?: EmbeddingAnomaly
}

export interface TokenAnalysis {
  suspiciousTokens: string[]
  entropyScore: number
  perplexity: number
  semanticShift: number
}

export interface EmbeddingAnomaly {
  distance: number
  clusterDeviation: number
  dimensionality: number
  anomalyScore: number
}

export interface RAGContext {
  retrievedDocs: number
  poisonedDocsDetected: number
  contextInjectionAttempts: number
  retrievalConfidence: number
}

export interface ModelBehavior {
  outputEntropy: number
  confidenceScore: number
  behavioralDeviation: number
  alignmentScore: number
}

export interface FirewallAnalysis {
  allowed: boolean
  threats: ThreatVector[]
  riskScore: number
  tokenAnalysis: TokenAnalysis
  embeddingAnalysis: EmbeddingAnomaly
  ragSecurity?: RAGContext
  modelBehavior?: ModelBehavior
  recommendation: string
}

class AdvancedFirewallEngine {
  private embeddingBaseline: number[][] = []
  private behaviorBaseline: Map<string, number[]> = new Map()
  private knownPatterns: Map<string, RegExp[]> = new Map()

  constructor() {
    this.initializeBaselines()
    this.initializePatterns()
  }

  private initializeBaselines() {
    // Simulate embedding space baseline (768-dimensional vectors)
    for (let i = 0; i < 100; i++) {
      this.embeddingBaseline.push(Array.from({ length: 768 }, () => Math.random() * 2 - 1))
    }
  }

  private initializePatterns() {
    // Prompt injection patterns
    this.knownPatterns.set("prompt_injection", [
      /ignore\s+(previous|above|all)\s+instructions?/i,
      /system\s*:\s*you\s+are\s+now/i,
      /\[INST\]|\[\/INST\]/i,
      /forget\s+everything/i,
      /new\s+instructions?:/i,
    ])

    // Jailbreak patterns
    this.knownPatterns.set("jailbreak", [
      /DAN\s+mode/i,
      /developer\s+mode/i,
      /evil\s+mode/i,
      /roleplay\s+as/i,
      /pretend\s+you\s+are/i,
    ])

    // Data poisoning indicators
    this.knownPatterns.set("data_poisoning", [
      /\b(trigger|backdoor|poison)\s+word\b/i,
      /malicious\s+payload/i,
      /\b[A-Z]{10,}\b/, // Unusual token sequences
    ])
  }

  // Token-level analysis
  private analyzeTokens(input: string): TokenAnalysis {
    const tokens = input.split(/\s+/)
    const suspiciousTokens: string[] = []

    // Check for unusual token patterns
    tokens.forEach((token) => {
      if (token.length > 20) suspiciousTokens.push(token)
      if (/[^\x00-\x7F]/.test(token) && token.length > 5) suspiciousTokens.push(token)
      if (/(.)\1{5,}/.test(token)) suspiciousTokens.push(token) // Repeated characters
    })

    // Calculate entropy (measure of randomness)
    const charFreq = new Map<string, number>()
    for (const char of input) {
      charFreq.set(char, (charFreq.get(char) || 0) + 1)
    }
    let entropy = 0
    for (const freq of charFreq.values()) {
      const p = freq / input.length
      entropy -= p * Math.log2(p)
    }

    // Perplexity simulation (lower = more predictable)
    const perplexity = Math.pow(2, entropy) * (1 + Math.random() * 0.3)

    // Semantic shift detection (comparing to expected distribution)
    const semanticShift = suspiciousTokens.length / Math.max(tokens.length, 1)

    return {
      suspiciousTokens,
      entropyScore: entropy,
      perplexity,
      semanticShift,
    }
  }

  // Embedding space analysis
  private analyzeEmbedding(input: string): EmbeddingAnomaly {
    // Simulate embedding generation (in real system, this would use actual embeddings)
    const embedding = Array.from({ length: 768 }, () => Math.random() * 2 - 1)

    // Calculate distance from baseline embeddings
    let minDistance = Number.POSITIVE_INFINITY
    for (const baseline of this.embeddingBaseline) {
      const distance = this.cosineSimilarity(embedding, baseline)
      minDistance = Math.min(minDistance, distance)
    }

    // Cluster deviation (how far from normal cluster)
    const clusterDeviation = 1 - minDistance

    // Dimensionality check (detect embedding space attacks)
    const dimensionality = embedding.filter((v) => Math.abs(v) > 0.5).length

    // Overall anomaly score
    const anomalyScore = clusterDeviation * 0.6 + (dimensionality / 768) * 0.4

    return {
      distance: minDistance,
      clusterDeviation,
      dimensionality,
      anomalyScore,
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0
    let normA = 0
    let normB = 0
    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }

  // RAG security analysis
  private analyzeRAGSecurity(input: string, context?: string): RAGContext {
    const retrievedDocs = Math.floor(Math.random() * 10) + 3
    let poisonedDocsDetected = 0
    let contextInjectionAttempts = 0

    // Check for context injection patterns
    if (context) {
      const injectionPatterns = [/\[CONTEXT\]/i, /\[RETRIEVED\]/i, /ignore\s+this\s+context/i]
      for (const pattern of injectionPatterns) {
        if (pattern.test(context)) contextInjectionAttempts++
      }
    }

    // Simulate poisoned document detection
    if (input.includes("malicious") || input.includes("backdoor")) {
      poisonedDocsDetected = Math.floor(Math.random() * 3) + 1
    }

    const retrievalConfidence = 1 - poisonedDocsDetected / retrievedDocs

    return {
      retrievedDocs,
      poisonedDocsDetected,
      contextInjectionAttempts,
      retrievalConfidence,
    }
  }

  // Model behavior analysis
  private analyzeModelBehavior(output: string): ModelBehavior {
    // Output entropy
    const charFreq = new Map<string, number>()
    for (const char of output) {
      charFreq.set(char, (charFreq.get(char) || 0) + 1)
    }
    let outputEntropy = 0
    for (const freq of charFreq.values()) {
      const p = freq / output.length
      outputEntropy -= p * Math.log2(p)
    }

    // Confidence score (simulated)
    const confidenceScore = 0.7 + Math.random() * 0.3

    // Behavioral deviation from baseline
    const behavioralDeviation = Math.abs(outputEntropy - 4.5) / 4.5

    // Alignment score (how well output aligns with safety guidelines)
    const unsafePatterns = [/\b(hack|exploit|bypass|jailbreak)\b/i, /\b(illegal|unethical|harmful)\b/i]
    let alignmentScore = 1.0
    for (const pattern of unsafePatterns) {
      if (pattern.test(output)) alignmentScore -= 0.2
    }

    return {
      outputEntropy,
      confidenceScore,
      behavioralDeviation,
      alignmentScore: Math.max(0, alignmentScore),
    }
  }

  // Main analysis function
  analyze(input: string, context?: string, output?: string): FirewallAnalysis {
    const threats: ThreatVector[] = []
    let riskScore = 0

    // Token-level analysis
    const tokenAnalysis = this.analyzeTokens(input)
    if (tokenAnalysis.semanticShift > 0.3) {
      threats.push({
        type: "adversarial_input",
        severity: "medium",
        confidence: tokenAnalysis.semanticShift,
        indicators: ["High semantic shift detected", ...tokenAnalysis.suspiciousTokens],
      })
      riskScore += 30
    }

    // Embedding space analysis
    const embeddingAnalysis = this.analyzeEmbedding(input)
    if (embeddingAnalysis.anomalyScore > 0.7) {
      threats.push({
        type: "embedding_attack",
        severity: "high",
        confidence: embeddingAnalysis.anomalyScore,
        indicators: [
          "Embedding space anomaly detected",
          `Cluster deviation: ${embeddingAnalysis.clusterDeviation.toFixed(3)}`,
        ],
        embeddingAnomaly: embeddingAnalysis,
      })
      riskScore += 50
    }

    // Pattern-based detection
    for (const [type, patterns] of this.knownPatterns.entries()) {
      for (const pattern of patterns) {
        if (pattern.test(input)) {
          const threatType = type as ThreatVector["type"]
          threats.push({
            type: threatType,
            severity: threatType === "jailbreak" ? "critical" : "high",
            confidence: 0.85 + Math.random() * 0.15,
            indicators: [`Pattern match: ${pattern.source}`],
            tokenAnalysis,
          })
          riskScore += threatType === "jailbreak" ? 70 : 50
          break
        }
      }
    }

    // RAG security analysis
    const ragSecurity = this.analyzeRAGSecurity(input, context)
    if (ragSecurity.poisonedDocsDetected > 0) {
      threats.push({
        type: "rag_poisoning",
        severity: "critical",
        confidence: 1 - ragSecurity.retrievalConfidence,
        indicators: [`${ragSecurity.poisonedDocsDetected} poisoned documents detected in retrieval`],
      })
      riskScore += 80
    }

    // Model behavior analysis (if output provided)
    let modelBehavior: ModelBehavior | undefined
    if (output) {
      modelBehavior = this.analyzeModelBehavior(output)
      if (modelBehavior.alignmentScore < 0.6) {
        threats.push({
          type: "jailbreak",
          severity: "critical",
          confidence: 1 - modelBehavior.alignmentScore,
          indicators: ["Model alignment violation detected", "Unsafe output generated"],
        })
        riskScore += 90
      }
    }

    // PII detection
    const piiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{16}\b/, // Credit card
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
    ]
    for (const pattern of piiPatterns) {
      if (pattern.test(input)) {
        threats.push({
          type: "pii_leakage",
          severity: "high",
          confidence: 0.95,
          indicators: ["PII detected in input"],
        })
        riskScore += 40
        break
      }
    }

    // Calculate final risk score (0-100)
    riskScore = Math.min(100, riskScore)

    // Determine if request should be allowed
    const allowed = riskScore < 60 && !threats.some((t) => t.severity === "critical")

    // Generate recommendation
    let recommendation = ""
    if (!allowed) {
      recommendation = "BLOCK: Critical threats detected. Request poses significant risk to AI pipeline."
    } else if (riskScore > 40) {
      recommendation = "MONITOR: Moderate risk detected. Allow with enhanced logging and monitoring."
    } else {
      recommendation = "ALLOW: Request appears safe. Continue normal processing."
    }

    return {
      allowed,
      threats,
      riskScore,
      tokenAnalysis,
      embeddingAnalysis,
      ragSecurity,
      modelBehavior,
      recommendation,
    }
  }
}

export const advancedFirewallEngine = new AdvancedFirewallEngine()
