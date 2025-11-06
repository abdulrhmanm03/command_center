"use client"

import { SidebarNav } from "@/components/sidebar-nav"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertTriangle,
  Shield,
  Brain,
  TrendingUp,
  Filter,
  X,
  Download,
  Eye,
  ChevronRight,
  Target,
  FileText,
  AlertCircle,
  Award,
  Bug,
  Activity,
  CheckCircle2,
} from "lucide-react"
import { useState } from "react"
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"

const risks = [
  {
    id: "ra-001",
    title: "Prompt Injection Attack on GPT-4 API",
    status: "Open",
    asset: { id: "asset-001", name: "GPT-4 Turbo API Gateway", type: "LLM API" },
    threat_event: "Malicious prompt injection to override system instructions",
    threat_source: "External Attacker / Insider",
    vulnerabilities: [
      "Insufficient input sanitization on user-submitted prompts",
      "Lack of context isolation between user sessions",
      "No prompt injection detection mechanisms deployed",
      "Overly permissive system prompts allowing instruction override",
      "Direct user input passed to model without validation",
    ],
    likelihood: 5,
    likelihood_assessment:
      "Very High (5/5): Prompt injection techniques are well-documented and easily accessible online. Internal users and external API consumers have direct access to submit prompts. Recent security research demonstrates reliable exploitation methods with 90%+ success rate. No current detection or prevention controls in place. Attack requires minimal technical skill.",
    impact: 5,
    impact_assessment:
      "Severe (5/5): Successful prompt injection could lead to unauthorized data extraction from model context, manipulation of AI responses to spread misinformation, bypass of content filters, and extraction of sensitive training data or system prompts. Potential for reputational damage, regulatory violations (AI Act, GDPR), and loss of customer trust. Estimated impact: $10M-$20M including incident response, customer remediation, and regulatory fines.",
    inherent_score: 100,
    controls_applied: ["Basic input validation", "Rate limiting"],
    residual_likelihood: 4,
    residual_impact: 4,
    residual_score: 64,
    risk_response: "Mitigate",
    risk_response_rationale:
      "Critical risk requiring immediate mitigation. Implementing multi-layer prompt sanitization, instruction filtering, and ML-based anomaly detection will reduce likelihood. Residual risk will be monitored through continuous prompt analysis and quarterly red team exercises.",
    rmf_step: "Select",
    rmf_step_description:
      "Controls have been selected (SI-10, SI-4, AC-3, SC-4). Tailoring in progress to address LLM-specific prompt injection vectors.",
    control_implementation_status: "Planned",
    authorization_status: "Not Started",
    authorization_notes:
      "Authorization will be requested after control implementation and assessment. Target authorization date: 2025-12-20.",
    continuous_monitoring:
      "Real-time prompt injection detection alerts, API usage pattern monitoring, monthly security reviews, quarterly LLM penetration testing",
    mitre: {
      tactics: ["TA0001", "TA0002", "TA0009"],
      techniques: [
        { id: "T1059", name: "Command and Scripting Interpreter" },
        { id: "T1213", name: "Data from Information Repositories" },
        { id: "T1071", name: "Application Layer Protocol" },
      ],
      notes:
        "LLM-specific attack vector targeting prompt processing layer. Attacker crafts malicious prompts to override system instructions (T1059), extract sensitive information from model context or training data (T1213), and exfiltrate data through API responses (T1071). Attack chain: Initial Access via API → Execution through prompt injection → Collection of sensitive data → Exfiltration via response.",
    },
    evidence: [
      {
        type: "assessment",
        id: "llm-redteam-2025-10",
        description: "Red team successfully demonstrated prompt injection in 9/10 test cases with data extraction",
      },
      {
        type: "research",
        id: "owasp-llm-top10-2024",
        description: "Prompt injection ranked #1 in OWASP LLM Top 10 vulnerabilities for 2024",
      },
      {
        type: "incident",
        id: "inc-2025-09-12",
        description: "Internal testing revealed system prompt extraction via crafted multi-turn conversation",
      },
    ],
    recommendations: [
      {
        text: "Implement multi-layer prompt sanitization: input validation, instruction filtering, and output monitoring. Deploy ML-based prompt injection detection using anomaly detection and known attack pattern matching.",
        nist_80053: ["SI-10", "SI-4"],
        expected_delta: { likelihood: "-2", impact: "-1" },
        owner: "AI Security Team",
        due_date: "2025-12-01",
      },
      {
        text: "Implement strict context isolation between user sessions using separate model instances or session-based memory partitioning. Apply principle of least privilege to model capabilities.",
        nist_80053: ["AC-3", "SC-4"],
        expected_delta: { likelihood: "-1", impact: "-1" },
        owner: "AI Engineering",
        due_date: "2025-12-15",
      },
      {
        text: "Deploy content filtering and output validation to detect and block sensitive data leakage. Implement audit logging for all prompt-response pairs.",
        nist_80053: ["AU-2", "AU-6", "SI-3"],
        expected_delta: { likelihood: "0", impact: "-1" },
        owner: "AI Security Team",
        due_date: "2025-12-10",
      },
    ],
    owner: "AI Security Team",
    target_date: "2025-12-01",
    ai_category: "prompt_security",
  },
  {
    id: "ra-002",
    title: "Training Data Poisoning in Fine-Tuning Pipeline",
    status: "Open",
    asset: { id: "asset-002", name: "Internal LLM Fine-Tuning Pipeline", type: "ML Pipeline" },
    threat_event: "Malicious data injection during model fine-tuning process",
    threat_source: "Insider / Supply Chain",
    vulnerabilities: [
      "No automated data validation in fine-tuning pipeline",
      "Manual data review process with 15% error rate",
      "Insufficient access controls on training data repositories",
      "Lack of data provenance tracking and versioning",
      "No anomaly detection for training data quality",
    ],
    likelihood: 4,
    likelihood_assessment:
      "High (4/5): Fine-tuning pipeline accepts data from multiple internal sources and third-party vendors. Historical incidents show 2 data quality issues in past 12 months. Data scientists have broad access to training datasets. Supply chain risk from external data providers. Insider threat scenario highly plausible given access levels.",
    impact: 5,
    impact_assessment:
      "Severe (5/5): Poisoned training data could result in model backdoors, biased outputs, degraded performance, or malicious behavior embedded in the model. Once deployed, poisoned model could affect all downstream applications and users. Potential for widespread misinformation, discriminatory outputs, or data exfiltration. Estimated impact: $15M-$30M including model retraining, incident response, regulatory fines (AI Act), and reputational damage. Model would need to be completely retrained from clean data.",
    inherent_score: 80,
    controls_applied: ["Manual data review", "Access logging"],
    residual_likelihood: 3,
    residual_impact: 4,
    residual_score: 48,
    risk_response: "Mitigate",
    risk_response_rationale:
      "High-impact risk requiring robust mitigation. Implementing automated data validation, provenance tracking, and anomaly detection will significantly reduce likelihood. Residual risk will be monitored through quarterly data audits and continuous quality monitoring.",
    rmf_step: "Implement",
    rmf_step_description:
      "Controls are being implemented. Data validation pipeline in development, provenance tracking being deployed.",
    control_implementation_status: "In Progress",
    authorization_status: "Pending",
    authorization_notes: "Authorization pending after control implementation and assessment. Target date: 2025-12-15.",
    continuous_monitoring:
      "Automated data quality checks (daily), anomaly detection alerts (real-time), quarterly data governance audits, annual supply chain reviews",
    mitre: {
      tactics: ["TA0001", "TA0003", "TA0040"],
      techniques: [
        { id: "T1195", name: "Supply Chain Compromise" },
        { id: "T1565", name: "Data Manipulation" },
        { id: "T1078", name: "Valid Accounts" },
      ],
      notes:
        "Training data poisoning attack targeting ML pipeline. Attacker uses valid credentials (T1078) or compromises supply chain (T1195) to inject malicious data into training sets (T1565). Poisoned data creates backdoors or biases in the model that persist after deployment. Attack is subtle and difficult to detect without automated validation.",
    },
    evidence: [
      {
        type: "incident",
        id: "inc-2025-08-15",
        description: "Previous data quality incident: 5K records with incorrect labels discovered in training set",
      },
      {
        type: "audit",
        id: "data-access-2025-10",
        description: "Audit log shows 23 users with write access to training data repositories",
      },
      {
        type: "threat_intel",
        id: "ti-poisoning-2025-09",
        description: "Threat intelligence reports 3 confirmed ML poisoning attacks in financial sector Q3 2025",
      },
    ],
    recommendations: [
      {
        text: "Deploy automated data validation and quality checks using statistical analysis and ML-based anomaly detection. Implement data provenance tracking to trace origin of all training samples.",
        nist_80053: ["SI-7", "SI-4", "CM-3"],
        expected_delta: { likelihood: "-2", impact: "-1" },
        owner: "ML Operations Team",
        due_date: "2025-12-10",
      },
      {
        text: "Implement least-privilege access controls on training data repositories. Require multi-party approval for data ingestion from external sources.",
        nist_80053: ["AC-3", "AC-6", "CM-5"],
        expected_delta: { likelihood: "-1", impact: "0" },
        owner: "Data Governance",
        due_date: "2025-12-20",
      },
      {
        text: "Establish baseline model behavior and implement continuous monitoring for model drift or anomalous outputs that could indicate poisoning.",
        nist_80053: ["SI-4", "AU-6"],
        expected_delta: { likelihood: "0", impact: "-1" },
        owner: "ML Operations Team",
        due_date: "2025-12-15",
      },
    ],
    owner: "ML Operations Team",
    target_date: "2025-12-10",
    ai_category: "data_governance",
  },
  {
    id: "ra-003",
    title: "Model Drift & Performance Degradation",
    status: "Open",
    asset: { id: "asset-003", name: "Internal Customer Service LLM v2.1", type: "LLM Model" },
    threat_event: "Gradual model performance degradation due to data distribution shift",
    threat_source: "Environmental / Accidental",
    vulnerabilities: [
      "No continuous model evaluation pipeline",
      "Manual performance monitoring (monthly reviews only)",
      "Lack of automated retraining triggers",
      "No drift detection mechanisms deployed",
      "Insufficient production telemetry and logging",
    ],
    likelihood: 4,
    likelihood_assessment:
      "High (4/5): Model deployed 8 months ago without retraining. Production data shows significant distribution shift from training data. Historical data shows model accuracy degrades 5-10% per quarter without retraining. Current monitoring cadence (monthly) insufficient to detect gradual drift. Customer complaint rate increasing 12% month-over-month.",
    impact: 4,
    impact_assessment:
      "Major (4/5): Model drift results in degraded prediction accuracy, poor user experience, and reduced business value. Customer satisfaction scores declining. Estimated impact: 20% decrease in resolution rates, $3M annual revenue impact from customer churn. Potential for incorrect or harmful responses to customers. Reputational damage and loss of trust in AI systems. No direct security impact but affects business operations significantly.",
    inherent_score: 64,
    controls_applied: ["Monthly performance reviews", "Basic monitoring dashboards"],
    residual_likelihood: 2,
    residual_impact: 3,
    residual_score: 24,
    risk_response: "Mitigate",
    risk_response_rationale:
      "Business impact justifies investment in automated monitoring and retraining infrastructure. Implementing continuous evaluation pipeline and drift detection will reduce likelihood of undetected degradation. Residual risk acceptable with quarterly model reviews and automated alerting.",
    rmf_step: "Monitor",
    rmf_step_description:
      "System is operational with continuous monitoring being enhanced. Drift detection controls being implemented. Ongoing assessment of model performance metrics.",
    control_implementation_status: "In Progress",
    authorization_status: "Authorized",
    authorization_notes:
      "Authorized by VP Engineering on 2025-09-01. Continuous monitoring plan approved. Quarterly reviews required.",
    continuous_monitoring:
      "Real-time model performance metrics, daily drift detection alerts, weekly A/B testing results, quarterly model evaluations",
    mitre: {
      tactics: ["TA0040"],
      techniques: [
        { id: "T1565", name: "Data Manipulation" },
        { id: "T1499", name: "Endpoint Denial of Service" },
      ],
      notes:
        "Model drift can be viewed as unintentional data manipulation (T1565) where changing production data distributions affect model behavior and reliability. While not a direct attack, drift impacts model integrity and can lead to service degradation (T1499) if model produces low-quality or incorrect outputs at scale.",
    },
    evidence: [
      {
        type: "metrics",
        id: "model-eval-2025-10",
        description: "Model accuracy decreased from 94% to 85% over past 6 months in production",
      },
      {
        type: "log",
        id: "prod-metrics-2025-11",
        description: "Production logs show 28% increase in low-confidence predictions (<0.7 confidence score)",
      },
      {
        type: "feedback",
        id: "customer-feedback-2025-10",
        description: "Customer satisfaction scores declined from 4.2/5 to 3.6/5 over past quarter",
      },
    ],
    recommendations: [
      {
        text: "Implement continuous evaluation pipeline with automated drift detection. Configure alerts for accuracy degradation >5%. Deploy A/B testing framework for model updates and champion/challenger testing.",
        nist_80053: ["SI-4", "CM-3", "SI-2"],
        expected_delta: { likelihood: "-2", impact: "-1" },
        owner: "ML Operations Team",
        due_date: "2025-12-10",
      },
      {
        text: "Establish automated retraining pipeline triggered by drift detection or performance thresholds. Implement model versioning, rollback capabilities, and blue-green deployment strategy.",
        nist_80053: ["CM-2", "CP-9", "CM-5"],
        expected_delta: { likelihood: "-1", impact: "0" },
        owner: "ML Engineering",
        due_date: "2025-12-20",
      },
      {
        text: "Deploy comprehensive production telemetry including input distribution monitoring, output quality metrics, and user feedback loops.",
        nist_80053: ["AU-2", "AU-6", "SI-4"],
        expected_delta: { likelihood: "0", impact: "-1" },
        owner: "ML Operations Team",
        due_date: "2025-12-15",
      },
    ],
    owner: "ML Operations Team",
    target_date: "2025-12-10",
    ai_category: "model_integrity",
  },
  {
    id: "ra-004",
    title: "Unauthorized Fine-Tuning of Production Model",
    status: "Open",
    asset: { id: "asset-004", name: "Claude 3.5 Sonnet Fine-Tuned Model", type: "LLM Model" },
    threat_event: "Unauthorized modification or fine-tuning of production LLM",
    threat_source: "Insider / Malicious Actor",
    vulnerabilities: [
      "Overly broad IAM permissions for model management",
      "No multi-party approval for model updates",
      "Insufficient audit logging for model modifications",
      "Lack of model integrity verification",
      "No separation of duties between dev and prod environments",
    ],
    likelihood: 3,
    likelihood_assessment:
      "Moderate (3/5): 12 employees have permissions to modify production models. No technical controls prevent unauthorized fine-tuning. Historical access reviews show 3 users with unnecessary elevated privileges. Insider threat scenario plausible given access levels. External compromise of privileged accounts possible but less likely due to MFA enforcement.",
    impact: 5,
    impact_assessment:
      "Severe (5/5): Unauthorized fine-tuning could embed backdoors, biases, or malicious behaviors in production model affecting all users. Potential for data exfiltration, misinformation at scale, or model sabotage. Model represents $5M+ in training investment. Incident would require complete model rollback and retraining. Regulatory implications under AI Act. Estimated impact: $10M-$20M including incident response, model retraining, customer notification, and reputational damage.",
    inherent_score: 60,
    controls_applied: ["IAM policies", "MFA enforcement"],
    residual_likelihood: 2,
    residual_impact: 4,
    residual_score: 32,
    risk_response: "Mitigate",
    risk_response_rationale:
      "High-impact risk requiring strong access controls and monitoring. Implementing least-privilege access, multi-party approval, and model integrity verification will significantly reduce likelihood. Residual risk acceptable with continuous monitoring and quarterly access reviews.",
    rmf_step: "Implement",
    rmf_step_description:
      "Controls being implemented. IAM policy review in progress, multi-party approval workflow being deployed.",
    control_implementation_status: "In Progress",
    authorization_status: "Pending",
    authorization_notes: "Authorization pending after control implementation and assessment. Target date: 2025-12-20.",
    continuous_monitoring:
      "Real-time model modification alerts, IAM policy monitoring, monthly access reviews, quarterly privilege audits",
    mitre: {
      tactics: ["TA0003", "TA0005", "TA0040"],
      techniques: [
        { id: "T1078", name: "Valid Accounts" },
        { id: "T1098", name: "Account Manipulation" },
        { id: "T1565", name: "Data Manipulation" },
      ],
      notes:
        "Insider threat scenario where attacker uses valid credentials (T1078) or escalates privileges (T1098) to gain unauthorized access to model management systems. Attacker then modifies model weights or fine-tunes model with malicious data (T1565) to embed backdoors or alter behavior. Attack is difficult to detect without integrity monitoring.",
    },
    evidence: [
      {
        type: "audit",
        id: "iam-review-2025-10",
        description: "IAM audit found 12 users with model modification permissions, 3 with unnecessary access",
      },
      {
        type: "log",
        id: "access-log-2025-09",
        description: "Audit logs show 47 model access events in September, 8 from non-ML team members",
      },
      {
        type: "assessment",
        id: "risk-assessment-2025-08",
        description: "Internal risk assessment identified lack of separation of duties as critical gap",
      },
    ],
    recommendations: [
      {
        text: "Implement least-privilege access controls with role-based access control (RBAC). Remove unnecessary model modification permissions. Require multi-party approval for all production model changes.",
        nist_80053: ["AC-3", "AC-6", "CM-5"],
        expected_delta: { likelihood: "-2", impact: "0" },
        owner: "Cloud Security Team",
        due_date: "2025-12-15",
      },
      {
        text: "Deploy model integrity verification using cryptographic hashing and digital signatures. Implement automated alerts for unauthorized model modifications.",
        nist_80053: ["SI-7", "AU-2", "SI-4"],
        expected_delta: { likelihood: "-1", impact: "-2" },
        owner: "AI Security Team",
        due_date: "2025-12-20",
      },
      {
        text: "Establish separation of duties between development and production environments. Implement change management workflow with approval gates.",
        nist_80053: ["AC-5", "CM-3", "CM-9"],
        expected_delta: { likelihood: "0", impact: "-1" },
        owner: "ML Operations Team",
        due_date: "2025-12-10",
      },
    ],
    owner: "Cloud Security Team",
    target_date: "2025-12-15",
    ai_category: "model_integrity",
  },
  {
    id: "ra-005",
    title: "PII Leakage from LLM Outputs",
    status: "Open",
    asset: { id: "asset-005", name: "GPT-4 Customer Support Chatbot", type: "LLM Application" },
    threat_event: "Inadvertent disclosure of PII/PHI in model responses",
    threat_source: "Accidental / Model Behavior",
    vulnerabilities: [
      "Model trained on datasets containing PII/PHI",
      "No output filtering for sensitive data patterns",
      "Insufficient data sanitization in training pipeline",
      "Model memorization of training data",
      "Lack of differential privacy techniques",
    ],
    likelihood: 4,
    likelihood_assessment:
      "High (4/5): Model trained on customer support transcripts containing PII/PHI. Research shows LLMs can memorize and regurgitate training data. Internal testing revealed 3 instances of PII disclosure in 1000 test queries (0.3% rate). With 100K daily queries, expect ~300 potential PII exposures daily. No output filtering currently deployed.",
    impact: 5,
    impact_assessment:
      "Severe (5/5): PII/PHI disclosure violates GDPR, HIPAA, and AI Act requirements. Potential fines up to 4% of annual revenue ($25M). Mandatory breach notification to affected individuals (estimated 50K+ customers). Class action lawsuit risk. Severe reputational damage and loss of customer trust. Regulatory investigation and potential suspension of AI services. Estimated total impact: $30M-$50M including fines, legal costs, remediation, and revenue loss.",
    inherent_score: 80,
    controls_applied: ["Basic content filtering"],
    residual_likelihood: 3,
    residual_impact: 4,
    residual_score: 48,
    risk_response: "Mitigate",
    risk_response_rationale:
      "Critical regulatory compliance risk requiring immediate mitigation. Implementing output filtering, data sanitization, and differential privacy will reduce likelihood. Residual risk will be monitored through continuous output scanning and quarterly compliance audits.",
    rmf_step: "Implement",
    rmf_step_description:
      "Controls being implemented. Output filtering pipeline in development, data sanitization being enhanced.",
    control_implementation_status: "In Progress",
    authorization_status: "Emergency Authorization",
    authorization_notes:
      "Emergency authorization granted by CISO on 2025-11-01 due to regulatory risk. Full authorization review after remediation.",
    continuous_monitoring:
      "Real-time PII detection in outputs, daily compliance scans, weekly data governance reviews, quarterly regulatory audits",
    mitre: {
      tactics: ["TA0009", "TA0010"],
      techniques: [
        { id: "T1530", name: "Data from Cloud Storage" },
        { id: "T1213", name: "Data from Information Repositories" },
        { id: "T1041", name: "Exfiltration Over C2 Channel" },
      ],
      notes:
        "LLM-specific data leakage risk where model inadvertently memorizes and discloses PII/PHI from training data (T1213, T1530). Attacker can craft prompts to extract sensitive information from model's learned knowledge. Data is exfiltrated through normal API responses (T1041), making detection difficult without output filtering.",
    },
    evidence: [
      {
        type: "testing",
        id: "pii-test-2025-10",
        description: "Internal testing revealed 3 PII disclosures in 1000 test queries (0.3% rate)",
      },
      {
        type: "research",
        id: "llm-memorization-2024",
        description: "Academic research demonstrates LLMs can memorize and regurgitate training data verbatim",
      },
      {
        type: "audit",
        id: "data-audit-2025-09",
        description: "Data audit found 250K customer support transcripts with PII in training dataset",
      },
    ],
    recommendations: [
      {
        text: "Deploy automated PII/PHI detection and redaction in model outputs using NLP-based entity recognition and pattern matching. Implement real-time filtering before responses reach users.",
        nist_80053: ["SI-12", "SI-4", "AC-4"],
        expected_delta: { likelihood: "-2", impact: "-1" },
        owner: "AI Security Team",
        due_date: "2025-12-01",
      },
      {
        text: "Implement comprehensive data sanitization in training pipeline. Apply differential privacy techniques during model training to prevent memorization of individual records.",
        nist_80053: ["SI-12", "SC-28", "SI-7"],
        expected_delta: { likelihood: "-1", impact: "-1" },
        owner: "ML Engineering",
        due_date: "2025-12-15",
      },
      {
        text: "Establish data governance framework with automated PII scanning of training data. Implement data retention policies and regular dataset audits.",
        nist_80053: ["SI-12", "AU-6", "PM-5"],
        expected_delta: { likelihood: "0", impact: "-1" },
        owner: "Data Governance",
        due_date: "2025-12-10",
      },
    ],
    owner: "AI Security Team",
    target_date: "2025-12-01",
    ai_category: "data_governance",
  },
  {
    id: "ra-006",
    title: "Supply Chain Vulnerability in Model Dependencies",
    status: "Open",
    asset: { id: "asset-006", name: "Hugging Face Model Repository", type: "Model Supply Chain" },
    threat_event: "Compromised or malicious model weights from external repository",
    threat_source: "Supply Chain / External Attacker",
    vulnerabilities: [
      "No integrity verification of downloaded model weights",
      "Lack of model provenance tracking",
      "Insufficient vetting of third-party models",
      "No sandboxed testing environment for external models",
      "Automatic dependency updates without security review",
    ],
    likelihood: 3,
    likelihood_assessment:
      "Moderate (3/5): Organization uses 15+ models from Hugging Face and other external repositories. Recent supply chain attacks (SolarWinds, Log4j) demonstrate feasibility. Model repositories have limited security controls. Attacker could compromise model weights or inject malicious code in model files. No current integrity verification process. Risk increasing as AI supply chain becomes more targeted.",
    impact: 5,
    impact_assessment:
      "Severe (5/5): Compromised model could contain backdoors, data exfiltration capabilities, or malicious behaviors. Once deployed, malicious model could affect all downstream applications and users. Potential for widespread data breach, system compromise, or supply chain attack propagation. Estimated impact: $20M-$40M including incident response, system remediation, customer notification, regulatory fines, and reputational damage. Could require complete infrastructure rebuild.",
    inherent_score: 60,
    controls_applied: ["Manual model review"],
    residual_likelihood: 2,
    residual_impact: 4,
    residual_score: 32,
    risk_response: "Mitigate",
    risk_response_rationale:
      "Critical supply chain risk requiring robust verification and testing. Implementing integrity verification, provenance tracking, and sandboxed testing will significantly reduce likelihood. Residual risk acceptable with continuous monitoring and quarterly supply chain reviews.",
    rmf_step: "Select",
    rmf_step_description:
      "Controls being selected and tailored. Supply chain security framework being developed for AI/ML dependencies.",
    control_implementation_status: "Planned",
    authorization_status: "Not Started",
    authorization_notes: "Authorization will be requested after control selection and implementation planning.",
    continuous_monitoring:
      "Automated dependency scanning (daily), integrity verification (per download), quarterly supply chain risk assessments, annual vendor reviews",
    mitre: {
      tactics: ["TA0001", "TA0003", "TA0009"],
      techniques: [
        { id: "T1195", name: "Supply Chain Compromise" },
        { id: "T1204", name: "User Execution" },
        { id: "T1071", name: "Application Layer Protocol" },
      ],
      notes:
        "Supply chain attack targeting ML model dependencies. Attacker compromises external model repository or injects malicious code into model files (T1195). When organization downloads and deploys compromised model (T1204), malicious code executes in production environment. Backdoor communicates with C2 server via API calls (T1071) to exfiltrate data or receive commands.",
    },
    evidence: [
      {
        type: "inventory",
        id: "model-inventory-2025-10",
        description: "Asset inventory shows 15 production models sourced from external repositories",
      },
      {
        type: "threat_intel",
        id: "ti-supply-chain-2025-09",
        description: "Threat intelligence reports increasing targeting of AI/ML supply chains by APT groups",
      },
      {
        type: "assessment",
        id: "supply-chain-assessment-2025-08",
        description: "Supply chain risk assessment identified lack of model integrity verification as critical gap",
      },
    ],
    recommendations: [
      {
        text: "Implement cryptographic integrity verification for all downloaded model weights using checksums and digital signatures. Establish trusted model registry with verified sources only.",
        nist_80053: ["SI-7", "SA-12", "SR-3"],
        expected_delta: { likelihood: "-2", impact: "-1" },
        owner: "ML Operations Team",
        due_date: "2025-12-20",
      },
      {
        text: "Deploy sandboxed testing environment for all external models before production deployment. Implement automated security scanning for malicious code or backdoors in model files.",
        nist_80053: ["SA-11", "SI-3", "CM-7"],
        expected_delta: { likelihood: "-1", impact: "-2" },
        owner: "AI Security Team",
        due_date: "2025-12-15",
      },
      {
        text: "Establish model provenance tracking and supply chain risk management framework. Implement vendor assessment process for model sources.",
        nist_80053: ["SA-12", "SR-6", "PM-30"],
        expected_delta: { likelihood: "0", impact: "-1" },
        owner: "Supply Chain Security",
        due_date: "2026-01-10",
      },
    ],
    owner: "ML Operations Team",
    target_date: "2025-12-20",
    ai_category: "supply_chain",
  },
]

export default function RiskScoringPage() {
  const [viewMode, setViewMode] = useState<"inherent" | "residual">("inherent")
  const [assetTypeFilter, setAssetTypeFilter] = useState<string>("all")
  const [threatSourceFilter, setThreatSourceFilter] = useState<string>("all")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedCell, setSelectedCell] = useState<{ likelihood: number; impact: number } | null>(null)
  const [selectedRisk, setSelectedRisk] = useState<(typeof risks)[0] | null>(null)
  const [showCellModal, setShowCellModal] = useState(false)
  const [showRiskModal, setShowRiskModal] = useState(false)

  const getHeatmapData = () => {
    const buckets: Record<string, { count: number; risk_ids: string[] }> = {}

    filteredRisks.forEach((risk) => {
      const likelihood = viewMode === "inherent" ? risk.likelihood : risk.residual_likelihood
      const impact = viewMode === "inherent" ? risk.impact : risk.residual_impact
      const key = `${likelihood}-${impact}`

      if (!buckets[key]) {
        buckets[key] = { count: 0, risk_ids: [] }
      }
      buckets[key].count++
      buckets[key].risk_ids.push(risk.id)
    })

    return buckets
  }

  const filteredRisks = risks.filter((risk) => {
    if (assetTypeFilter !== "all" && risk.asset.type !== assetTypeFilter) return false
    if (threatSourceFilter !== "all" && risk.threat_source !== threatSourceFilter) return false
    if (statusFilter !== "all" && risk.status !== statusFilter) return false
    return true
  })

  const heatmapData = getHeatmapData()

  const riskCounts = {
    critical: filteredRisks.filter((r) => (viewMode === "inherent" ? r.inherent_score >= 90 : r.residual_score >= 90))
      .length,
    high: filteredRisks.filter((r) => {
      const score = viewMode === "inherent" ? r.inherent_score : r.residual_score
      return score >= 70 && score < 90
    }).length,
    medium: filteredRisks.filter((r) => {
      const score = viewMode === "inherent" ? r.inherent_score : r.residual_score
      return score >= 40 && score < 70
    }).length,
    low: filteredRisks.filter((r) => {
      const score = viewMode === "inherent" ? r.inherent_score : r.residual_score
      return score < 40
    }).length,
  }

  const totalRisks = riskCounts.critical + riskCounts.high + riskCounts.medium + riskCounts.low

  const getCellColor = (likelihood: number, impact: number) => {
    const score = likelihood * impact * 4
    if (score >= 90) return "bg-red-500/80 border-red-500 hover:bg-red-500"
    if (score >= 70) return "bg-orange-500/80 border-orange-500 hover:bg-orange-500"
    if (score >= 40) return "bg-yellow-500/80 border-yellow-500 hover:bg-yellow-500"
    return "bg-green-500/80 border-green-500 hover:bg-green-500"
  }

  const handleCellClick = (likelihood: number, impact: number) => {
    setSelectedCell({ likelihood, impact })
    setShowCellModal(true)
  }

  const getCellRisks = (likelihood: number, impact: number) => {
    return filteredRisks.filter((risk) => {
      const l = viewMode === "inherent" ? risk.likelihood : risk.residual_likelihood
      const i = viewMode === "inherent" ? risk.impact : risk.residual_impact
      return l === likelihood && i === impact
    })
  }

  const handleExport = () => {
    const timestamp = new Date().toISOString().split("T")[0]
    const csvContent = [
      [
        "ID",
        "Title",
        "Asset",
        "Asset Type",
        "Threat Event",
        "Threat Source",
        "Likelihood",
        "Impact",
        "Inherent Score",
        "Residual Score",
        "Status",
        "Owner",
      ].join(","),
      ...filteredRisks.map((risk) =>
        [
          risk.id,
          `"${risk.title}"`,
          `"${risk.asset.name}"`,
          risk.asset.type,
          `"${risk.threat_event}"`,
          risk.threat_source,
          risk.likelihood,
          risk.impact,
          risk.inherent_score,
          risk.residual_score,
          risk.status,
          `"${risk.owner}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `llm-risk-register-${timestamp}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const trendData = [
    { month: "Jun", count: 3 },
    { month: "Jul", count: 4 },
    { month: "Aug", count: 5 },
    { month: "Sep", count: 4 },
    { month: "Oct", count: 6 },
    { month: "Nov", count: 6 },
  ]

  const getAlertLevel = () => {
    if (riskCounts.critical > 0) return { level: "Severe", color: "red" }
    if (riskCounts.high >= 3) return { level: "High", color: "orange" }
    if (riskCounts.high > 0 || riskCounts.medium >= 5) return { level: "Elevated", color: "yellow" }
    return { level: "Moderate", color: "green" }
  }

  const getMaturityRating = () => {
    const totalInherent = filteredRisks.reduce((sum, r) => sum + r.inherent_score, 0)
    const totalResidual = filteredRisks.reduce((sum, r) => sum + r.residual_score, 0)
    const reductionPercent = totalInherent > 0 ? ((totalInherent - totalResidual) / totalInherent) * 100 : 0

    if (reductionPercent >= 60) return { grade: "A+", color: "green", description: "Excellent" }
    if (reductionPercent >= 50) return { grade: "A", color: "green", description: "Strong" }
    if (reductionPercent >= 40) return { grade: "B+", color: "cyan", description: "Good" }
    if (reductionPercent >= 30) return { grade: "B", color: "yellow", description: "Adequate" }
    if (reductionPercent >= 20) return { grade: "C", color: "orange", description: "Developing" }
    return { grade: "D", color: "red", description: "Weak" }
  }

  const alertLevel = getAlertLevel()
  const maturityRating = getMaturityRating()

  const susceptibilityData = [
    { theme: "Prompt Injection", count: 5, fullMark: 5 },
    { theme: "Data Leakage", count: 4, fullMark: 5 },
    { theme: "Model Drift", count: 3, fullMark: 5 },
    { theme: "Training Data Poisoning", count: 4, fullMark: 5 },
    { theme: "Supply Chain", count: 3, fullMark: 5 },
  ]

  const topRisks = [...filteredRisks]
    .sort((a, b) => {
      const scoreA = viewMode === "inherent" ? a.inherent_score : a.residual_score
      const scoreB = viewMode === "inherent" ? b.inherent_score : b.residual_score
      return scoreB - scoreA
    })
    .slice(0, 5)

  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-background p-6">
          <div className="mb-8 rounded-2xl bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-cyan-600/20 p-8 border-2 border-purple-500/30 shadow-2xl shadow-purple-500/20">
            <div className="flex items-center gap-4 mb-3">
              <div className="rounded-xl bg-gradient-to-br from-purple-500 via-pink-500 to-cyan-500 p-4 shadow-lg shadow-purple-500/50">
                <Target className="h-10 w-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  LLM Risk Assessment Center
                </h1>
                <p className="text-base text-cyan-300 leading-relaxed">Forward-looking risk view</p>
              </div>
            </div>
          </div>

          <Card className="mb-6 border-2 border-cyan-500/40 shadow-lg shadow-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-blue-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-400 text-lg">
                <Filter className="h-6 w-6" />
                Filters
              </CardTitle>
              <CardDescription className="text-base">
                Filter risks by asset type, threat source, or status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Asset Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Asset Types</SelectItem>
                    <SelectItem value="LLM API">LLM API</SelectItem>
                    <SelectItem value="LLM Model">LLM Model</SelectItem>
                    <SelectItem value="LLM Application">LLM Application</SelectItem>
                    <SelectItem value="ML Pipeline">ML Pipeline</SelectItem>
                    <SelectItem value="Model Supply Chain">Model Supply Chain</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={threatSourceFilter} onValueChange={setThreatSourceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Threat Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Threat Sources</SelectItem>
                    <SelectItem value="External Attacker">External Attacker</SelectItem>
                    <SelectItem value="Insider">Insider</SelectItem>
                    <SelectItem value="Environmental">Environmental</SelectItem>
                    <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                    <SelectItem value="Malicious Actor">Malicious Actor</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Accepted">Accepted</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setAssetTypeFilter("all")
                    setThreatSourceFilter("all")
                    setStatusFilter("all")
                  }}
                  className="border-cyan-500/50 hover:bg-cyan-500/10"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-4">
            <div className="lg:col-span-3 space-y-6">
              <div className="grid gap-4 md:grid-cols-5">
                <Card className="border-2 border-purple-500/60 bg-gradient-to-br from-purple-600/20 to-purple-500/10 shadow-lg shadow-purple-500/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-purple-200">Total Risks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold text-purple-400">{totalRisks}</div>
                    <p className="text-xs text-purple-300 mt-2">Open risk items</p>
                  </CardContent>
                </Card>

                <Card
                  className={`border-2 border-${alertLevel.color}-500/60 bg-gradient-to-br from-${alertLevel.color}-600/20 to-${alertLevel.color}-500/10 shadow-lg shadow-${alertLevel.color}-500/20`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className={`text-sm font-medium text-${alertLevel.color}-200`}>Alert Level</CardTitle>
                      <AlertTriangle className={`h-6 w-6 text-${alertLevel.color}-400`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-4xl font-bold text-${alertLevel.color}-400`}>{alertLevel.level}</div>
                    <p className={`text-xs text-${alertLevel.color}-300 mt-2`}>Current posture</p>
                  </CardContent>
                </Card>

                <Card
                  className={`border-2 border-${maturityRating.color}-500/60 bg-gradient-to-br from-${maturityRating.color}-600/20 to-${maturityRating.color}-500/10 shadow-lg shadow-${maturityRating.color}-500/20`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className={`text-sm font-medium text-${maturityRating.color}-200`}>Maturity</CardTitle>
                      <Award className={`h-6 w-6 text-${maturityRating.color}-400`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-5xl font-bold text-${maturityRating.color}-400`}>{maturityRating.grade}</div>
                    <p className={`text-xs text-${maturityRating.color}-300 mt-2`}>{maturityRating.description}</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-red-500/60 bg-gradient-to-br from-red-600/20 to-red-500/10 shadow-lg shadow-red-500/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-red-200">Critical</CardTitle>
                      <AlertTriangle className="h-6 w-6 text-red-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold text-red-400">{riskCounts.critical}</div>
                    <p className="text-xs text-red-300 mt-2">Score: 90-100</p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-500/60 bg-gradient-to-br from-orange-600/20 to-orange-500/10 shadow-lg shadow-orange-500/20">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-orange-200">High</CardTitle>
                      <TrendingUp className="h-6 w-6 text-orange-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-5xl font-bold text-orange-400">{riskCounts.high}</div>
                    <p className="text-xs text-orange-300 mt-2">Score: 70-89</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 border-purple-500/60 bg-gradient-to-br from-purple-600/10 to-pink-600/10 shadow-xl shadow-purple-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-3 text-purple-400 text-2xl">
                        <Target className="h-7 w-7" />
                        Impact × Likelihood Heatmap
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        Click any cell to drill down into risks • Showing {viewMode} risk scores
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === "inherent" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("inherent")}
                        className={
                          viewMode === "inherent"
                            ? "bg-purple-500 hover:bg-purple-600 shadow-lg shadow-purple-500/50"
                            : "border-purple-500/50"
                        }
                      >
                        Inherent
                      </Button>
                      <Button
                        variant={viewMode === "residual" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("residual")}
                        className={
                          viewMode === "residual"
                            ? "bg-cyan-500 hover:bg-cyan-600 shadow-lg shadow-cyan-500/50"
                            : "border-cyan-500/50"
                        }
                      >
                        Residual
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExport}
                        className="ml-2 border-purple-500/50 hover:bg-purple-500/10 bg-transparent"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Legend */}
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-red-500 shadow-md"></div>
                        <span className="text-muted-foreground font-medium">Critical (90-100)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-orange-500 shadow-md"></div>
                        <span className="text-muted-foreground font-medium">High (70-89)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-yellow-500 shadow-md"></div>
                        <span className="text-muted-foreground font-medium">Medium (40-69)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-md bg-green-500 shadow-md"></div>
                        <span className="text-muted-foreground font-medium">Low (0-39)</span>
                      </div>
                    </div>

                    {/* Heatmap Grid */}
                    <div className="relative">
                      {/* Y-axis label */}
                      <div className="absolute -left-16 top-1/2 -translate-y-1/2 -rotate-90 text-base font-bold text-purple-400">
                        Impact →
                      </div>

                      <div className="grid grid-cols-6 gap-3">
                        {/* Header row */}
                        <div></div>
                        {[1, 2, 3, 4, 5].map((l) => (
                          <div key={l} className="text-center text-sm font-bold text-purple-300 py-2">
                            {l === 1
                              ? "Very Low"
                              : l === 2
                                ? "Low"
                                : l === 3
                                  ? "Moderate"
                                  : l === 4
                                    ? "High"
                                    : "Very High"}
                          </div>
                        ))}

                        {/* Grid rows (Impact 5 to 1, top to bottom) */}
                        {[5, 4, 3, 2, 1].map((impact) => (
                          <>
                            <div
                              key={`label-${impact}`}
                              className="flex items-center justify-end text-sm font-bold text-purple-300 pr-3"
                            >
                              {impact === 5
                                ? "Severe"
                                : impact === 4
                                  ? "Major"
                                  : impact === 3
                                    ? "Moderate"
                                    : impact === 2
                                      ? "Minor"
                                      : "Negligible"}
                            </div>
                            {[1, 2, 3, 4, 5].map((likelihood) => {
                              const key = `${likelihood}-${impact}`
                              const bucket = heatmapData[key]
                              const count = bucket?.count || 0
                              return (
                                <button
                                  key={key}
                                  onClick={() => handleCellClick(likelihood, impact)}
                                  className={`aspect-square rounded-xl border-2 transition-all hover:scale-110 hover:shadow-2xl flex items-center justify-center cursor-pointer ${getCellColor(likelihood, impact)}`}
                                >
                                  <span className="text-3xl font-bold text-white drop-shadow-lg">{count}</span>
                                </button>
                              )
                            })}
                          </>
                        ))}
                      </div>

                      {/* X-axis label */}
                      <div className="text-center text-base font-bold text-purple-400 mt-3">← Likelihood</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-2 border-pink-500/50 bg-gradient-to-br from-pink-600/10 to-purple-600/10 shadow-lg shadow-pink-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-pink-400 text-lg">
                      <Target className="h-6 w-6" />
                      Susceptibility Index
                    </CardTitle>
                    <CardDescription className="text-base">Top recurring risk themes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RadarChart data={susceptibilityData}>
                        <PolarGrid stroke="#666" strokeWidth={1.5} />
                        <PolarAngleAxis dataKey="theme" tick={{ fill: "#ec4899", fontSize: 12, fontWeight: 600 }} />
                        <PolarRadiusAxis angle={90} domain={[0, 5]} tick={{ fill: "#ec4899", fontWeight: 600 }} />
                        <Radar
                          name="Risk Count"
                          dataKey="count"
                          stroke="#ec4899"
                          strokeWidth={3}
                          fill="#ec4899"
                          fillOpacity={0.7}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-2 border-cyan-500/50 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 shadow-lg shadow-cyan-500/20">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-cyan-400 text-lg">
                      <TrendingUp className="h-6 w-6" />
                      Risk Count Trend
                    </CardTitle>
                    <CardDescription className="text-base">Risk count over the last 6 months</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={trendData}>
                        <XAxis
                          dataKey="month"
                          stroke="#06b6d4"
                          strokeWidth={2}
                          tick={{ fill: "#06b6d4", fontWeight: 600 }}
                        />
                        <YAxis stroke="#06b6d4" strokeWidth={2} tick={{ fill: "#06b6d4", fontWeight: 600 }} />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: "#1a1a1a",
                            border: "2px solid #06b6d4",
                            borderRadius: "12px",
                            boxShadow: "0 0 20px rgba(6, 182, 212, 0.3)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="count"
                          stroke="#06b6d4"
                          strokeWidth={4}
                          dot={{ r: 8, fill: "#06b6d4", strokeWidth: 2, stroke: "#fff" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <Card className="border-2 border-orange-500/50 bg-gradient-to-br from-orange-600/10 to-red-600/10 shadow-lg shadow-orange-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400 text-lg">
                    <AlertCircle className="h-6 w-6" />
                    Top 5 Open Risks
                  </CardTitle>
                  <CardDescription className="text-base">Highest {viewMode} scores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {topRisks.map((risk) => {
                      const score = viewMode === "inherent" ? risk.inherent_score : risk.residual_score
                      return (
                        <div
                          key={risk.id}
                          className="p-4 rounded-xl border-2 border-border bg-background/50 hover:border-orange-500/60 hover:shadow-lg hover:shadow-orange-500/20 transition-all cursor-pointer"
                          onClick={() => {
                            setSelectedRisk(risk)
                            setShowRiskModal(true)
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-sm font-semibold text-foreground line-clamp-2">{risk.title}</h4>
                            <Badge
                              variant="outline"
                              className={
                                score >= 90
                                  ? "border-red-500 text-red-400 bg-red-500/20 font-bold text-base px-2 py-1"
                                  : score >= 70
                                    ? "border-orange-500 text-orange-400 bg-orange-500/20 font-bold text-base px-2 py-1"
                                    : "border-yellow-500 text-yellow-400 bg-yellow-500/20 font-bold text-base px-2 py-1"
                              }
                            >
                              {score}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{risk.asset.name}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {risk.asset.type}
                            </Badge>
                            <Button variant="ghost" size="sm" className="h-7 text-xs hover:bg-orange-500/10">
                              View
                              <ChevronRight className="h-3 w-3 ml-1" />
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Dialog open={showCellModal} onOpenChange={setShowCellModal}>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-purple-400 text-xl">
                  <Target className="h-6 w-6" />
                  Risks: Likelihood {selectedCell?.likelihood} × Impact {selectedCell?.impact}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {selectedCell &&
                    `${getCellRisks(selectedCell.likelihood, selectedCell.impact).length} risk(s) in this cell`}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {selectedCell &&
                  getCellRisks(selectedCell.likelihood, selectedCell.impact).map((risk) => {
                    const score = viewMode === "inherent" ? risk.inherent_score : risk.residual_score
                    return (
                      <div
                        key={risk.id}
                        className="p-4 rounded-lg border-2 border-border bg-background/50 hover:border-purple-500/60 hover:shadow-lg transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedRisk(risk)
                          setShowRiskModal(true)
                          setShowCellModal(false)
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-cyan-400 mb-1 text-base">{risk.title}</h4>
                            <p className="text-sm text-muted-foreground">{risk.asset.name}</p>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              score >= 90
                                ? "border-red-500 text-red-400 bg-red-500/20 font-bold text-lg px-3 py-1"
                                : score >= 70
                                  ? "border-orange-500 text-orange-400 bg-orange-500/20 font-bold text-lg px-3 py-1"
                                  : "border-yellow-500 text-yellow-400 bg-yellow-500/20 font-bold text-lg px-3 py-1"
                            }
                          >
                            {score}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {risk.asset.type}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {risk.threat_source}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {risk.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground mb-3">{risk.threat_event}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-purple-500/50 hover:bg-purple-500/10 bg-transparent"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Details
                        </Button>
                      </div>
                    )
                  })}
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showRiskModal} onOpenChange={setShowRiskModal}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedRisk && (
                <>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-purple-400 text-3xl">
                      <FileText className="h-8 w-8" />
                      {selectedRisk.title}
                    </DialogTitle>
                    <DialogDescription className="text-base flex items-center gap-2 mt-2">
                      <Badge variant="secondary" className="text-sm">
                        {selectedRisk.id}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={
                          selectedRisk.status === "Open"
                            ? "border-orange-500 text-orange-400 bg-orange-500/20"
                            : "border-green-500 text-green-400 bg-green-500/20"
                        }
                      >
                        {selectedRisk.status}
                      </Badge>
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-6">
                    {/* Summary Section - Vertical Layout */}
                    <div className="p-6 rounded-xl bg-purple-500/10 border-2 border-purple-500/50 shadow-lg">
                      <h3 className="text-2xl font-bold text-purple-400 mb-5 flex items-center gap-3">
                        <Target className="h-7 w-7" />
                        Risk Summary (NIST 800-30)
                      </h3>
                      <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-background/50 border border-border">
                          <p className="text-sm font-bold text-purple-300 mb-2">Asset</p>
                          <p className="text-lg font-semibold text-foreground">{selectedRisk.asset.name}</p>
                          <Badge variant="secondary" className="text-sm mt-2">
                            {selectedRisk.asset.type}
                          </Badge>
                        </div>
                        <div className="p-4 rounded-lg bg-background/50 border border-border">
                          <p className="text-sm font-bold text-purple-300 mb-2">Threat Source</p>
                          <p className="text-lg font-semibold text-foreground">{selectedRisk.threat_source}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background/50 border border-border">
                          <p className="text-sm font-bold text-purple-300 mb-2">Threat Event</p>
                          <p className="text-lg font-semibold text-foreground">{selectedRisk.threat_event}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-background/50 border border-border">
                          <p className="text-sm font-bold text-purple-300 mb-2">Risk Owner</p>
                          <p className="text-lg font-semibold text-foreground">{selectedRisk.owner}</p>
                        </div>
                        <div className="p-4 rounded-xl bg-red-500/20 border-2 border-red-500/60 shadow-md">
                          <p className="text-sm font-bold text-red-300 mb-3">Inherent Risk Score</p>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className="border-red-500 text-red-400 text-2xl font-bold px-4 py-2"
                            >
                              {selectedRisk.inherent_score}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              (L:{selectedRisk.likelihood} × I:{selectedRisk.impact} × 4)
                            </span>
                          </div>
                        </div>
                        <div className="p-4 rounded-xl bg-green-500/20 border-2 border-green-500/60 shadow-md">
                          <p className="text-sm font-bold text-green-300 mb-3">Residual Risk Score</p>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className="border-green-500 text-green-400 text-2xl font-bold px-4 py-2"
                            >
                              {selectedRisk.residual_score}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              (L:{selectedRisk.residual_likelihood} × I:{selectedRisk.residual_impact} × 4)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RMF Section - Vertical Layout */}
                    <div className="p-6 rounded-xl bg-indigo-500/10 border-2 border-indigo-500/50 shadow-lg">
                      <h3 className="text-2xl font-bold text-indigo-400 mb-5 flex items-center gap-3">
                        <Activity className="h-7 w-7" />
                        NIST 800-37 Risk Management Framework (RMF)
                      </h3>
                      <div className="space-y-3">
                        <div className="p-4 rounded-lg bg-indigo-500/10 border border-indigo-500/40">
                          <p className="text-base font-bold text-indigo-300 mb-3">Current RMF Step</p>
                          <Badge
                            variant="outline"
                            className="border-indigo-500 text-indigo-400 bg-indigo-500/20 text-lg px-4 py-2 mb-3"
                          >
                            {selectedRisk.rmf_step}
                          </Badge>
                          <p className="text-base text-foreground leading-relaxed">
                            {selectedRisk.rmf_step_description}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/40">
                          <p className="text-base font-bold text-cyan-300 mb-3">Control Implementation Status</p>
                          <Badge
                            variant="outline"
                            className={
                              selectedRisk.control_implementation_status === "Implemented"
                                ? "border-green-500 text-green-400 bg-green-500/20 text-lg px-4 py-2"
                                : selectedRisk.control_implementation_status === "In Progress"
                                  ? "border-yellow-500 text-yellow-400 bg-yellow-500/20 text-lg px-4 py-2"
                                  : "border-blue-500 text-blue-400 bg-blue-500/20 text-lg px-4 py-2"
                            }
                          >
                            {selectedRisk.control_implementation_status}
                          </Badge>
                        </div>
                        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/40">
                          <p className="text-base font-bold text-purple-300 mb-3">Authorization Status</p>
                          <Badge
                            variant="outline"
                            className={
                              selectedRisk.authorization_status === "Authorized"
                                ? "border-green-500 text-green-400 bg-green-500/20 text-lg px-4 py-2"
                                : selectedRisk.authorization_status === "Emergency Authorization"
                                  ? "border-red-500 text-red-400 bg-red-500/20 text-lg px-4 py-2"
                                  : selectedRisk.authorization_status === "Assessment In Progress"
                                    ? "border-yellow-500 text-yellow-400 bg-yellow-500/20 text-lg px-4 py-2"
                                    : "border-gray-500 text-gray-400 bg-gray-500/20 text-lg px-4 py-2"
                            }
                          >
                            {selectedRisk.authorization_status}
                          </Badge>
                          <p className="text-base text-muted-foreground mt-3 leading-relaxed">
                            {selectedRisk.authorization_notes}
                          </p>
                        </div>
                        <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/40">
                          <p className="text-base font-bold text-teal-300 mb-3">Continuous Monitoring Plan</p>
                          <p className="text-base text-foreground leading-relaxed">
                            {selectedRisk.continuous_monitoring}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Vulnerabilities Section */}
                    <div className="p-6 rounded-xl bg-red-500/10 border-2 border-red-500/50 shadow-lg">
                      <h3 className="text-2xl font-bold text-red-400 mb-5 flex items-center gap-3">
                        <Bug className="h-7 w-7" />
                        Vulnerabilities & Weaknesses
                      </h3>
                      <div className="space-y-3">
                        {selectedRisk.vulnerabilities.map((vuln, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-lg bg-red-500/10 border border-red-500/40 flex items-start gap-3"
                          >
                            <AlertCircle className="h-6 w-6 text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-base text-foreground leading-relaxed">{vuln}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Likelihood Assessment */}
                    <div className="p-6 rounded-xl bg-orange-500/10 border-2 border-orange-500/50 shadow-lg">
                      <h3 className="text-2xl font-bold text-orange-400 mb-5 flex items-center gap-3">
                        <Activity className="h-7 w-7" />
                        Likelihood Assessment
                      </h3>
                      <div className="p-4 rounded-lg bg-background/50 border border-border">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge
                            variant="outline"
                            className="border-orange-500 text-orange-400 text-2xl font-bold px-4 py-2"
                          >
                            {selectedRisk.likelihood}/5
                          </Badge>
                          <span className="text-lg font-semibold text-orange-300">
                            {selectedRisk.likelihood === 5
                              ? "Very High"
                              : selectedRisk.likelihood === 4
                                ? "High"
                                : selectedRisk.likelihood === 3
                                  ? "Moderate"
                                  : selectedRisk.likelihood === 2
                                    ? "Low"
                                    : "Very Low"}
                          </span>
                        </div>
                        <p className="text-base text-foreground leading-relaxed">
                          {selectedRisk.likelihood_assessment}
                        </p>
                      </div>
                    </div>

                    {/* Impact Assessment */}
                    <div className="p-6 rounded-xl bg-pink-500/10 border-2 border-pink-500/50 shadow-lg">
                      <h3 className="text-2xl font-bold text-pink-400 mb-5 flex items-center gap-3">
                        <AlertTriangle className="h-7 w-7" />
                        Impact Assessment
                      </h3>
                      <div className="p-4 rounded-lg bg-background/50 border border-border">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge
                            variant="outline"
                            className="border-pink-500 text-pink-400 text-2xl font-bold px-4 py-2"
                          >
                            {selectedRisk.impact}/5
                          </Badge>
                          <span className="text-lg font-semibold text-pink-300">
                            {selectedRisk.impact === 5
                              ? "Severe"
                              : selectedRisk.impact === 4
                                ? "Major"
                                : selectedRisk.impact === 3
                                  ? "Moderate"
                                  : selectedRisk.impact === 2
                                    ? "Minor"
                                    : "Negligible"}
                          </span>
                        </div>
                        <p className="text-base text-foreground leading-relaxed">{selectedRisk.impact_assessment}</p>
                      </div>
                    </div>

                    {/* Risk Response Strategy */}
                    <div className="p-6 rounded-xl bg-yellow-500/10 border-2 border-yellow-500/50 shadow-lg">
                      <h3 className="text-2xl font-bold text-yellow-400 mb-5 flex items-center gap-3">
                        <CheckCircle2 className="h-7 w-7" />
                        Risk Response Strategy
                      </h3>
                      <div className="p-4 rounded-lg bg-background/50 border border-border">
                        <div className="flex items-center gap-3 mb-4">
                          <Badge
                            variant="outline"
                            className={
                              selectedRisk.risk_response === "Mitigate"
                                ? "border-yellow-500 text-yellow-400 bg-yellow-500/20 text-lg px-4 py-2"
                                : selectedRisk.risk_response === "Accept"
                                  ? "border-green-500 text-green-400 bg-green-500/20 text-lg px-4 py-2"
                                  : "border-blue-500 text-blue-400 bg-blue-500/20 text-lg px-4 py-2"
                            }
                          >
                            {selectedRisk.risk_response}
                          </Badge>
                        </div>
                        <p className="text-base text-foreground leading-relaxed">
                          {selectedRisk.risk_response_rationale}
                        </p>
                      </div>
                    </div>

                    {/* MITRE ATT&CK Mapping */}
                    <div className="p-6 rounded-xl bg-cyan-500/10 border-2 border-cyan-500/60 shadow-lg">
                      <h3 className="text-2xl font-bold text-cyan-400 mb-5 flex items-center gap-3">
                        <Shield className="h-7 w-7" />
                        MITRE ATT&CK Mapping
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-base font-bold text-cyan-300 mb-3">Tactics</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedRisk.mitre.tactics.map((tactic) => (
                              <Badge
                                key={tactic}
                                variant="outline"
                                className="border-cyan-500 text-cyan-400 bg-cyan-500/20 text-base px-4 py-2"
                              >
                                {tactic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-base font-bold text-cyan-300 mb-3">Techniques</p>
                          <div className="space-y-2">
                            {selectedRisk.mitre.techniques.map((technique) => (
                              <div
                                key={technique.id}
                                className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-between hover:border-cyan-500/60 transition-all"
                              >
                                <span className="text-base font-medium text-foreground">{technique.name}</span>
                                <Badge
                                  variant="secondary"
                                  className="text-sm bg-cyan-500/20 text-cyan-400 border-cyan-500/60"
                                >
                                  {technique.id}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 rounded-lg bg-cyan-500/5 border border-cyan-500/30">
                          <p className="text-sm font-semibold text-cyan-300 mb-2">Mapping Rationale</p>
                          <p className="text-base text-foreground italic leading-relaxed">{selectedRisk.mitre.notes}</p>
                        </div>
                      </div>
                    </div>

                    {/* Evidence */}
                    <div className="p-6 rounded-xl bg-blue-500/10 border-2 border-blue-500/50 shadow-lg">
                      <h3 className="text-2xl font-bold text-blue-400 mb-5 flex items-center gap-3">
                        <FileText className="h-7 w-7" />
                        Supporting Evidence
                      </h3>
                      <div className="space-y-3">
                        {selectedRisk.evidence.map((ev, idx) => (
                          <div key={idx} className="p-4 rounded-lg bg-background/50 border border-border">
                            <div className="flex items-start gap-3">
                              <Badge variant="secondary" className="text-sm mt-1">
                                {ev.type}
                              </Badge>
                              <div className="flex-1">
                                <p className="text-base font-mono text-cyan-400 mb-2">{ev.id}</p>
                                <p className="text-base text-muted-foreground leading-relaxed">{ev.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommendations with NIST 800-53 - Vertical Layout */}
                    <div className="p-6 rounded-xl bg-green-500/10 border-2 border-green-500/60 shadow-lg">
                      <h3 className="text-2xl font-bold text-green-400 mb-5 flex items-center gap-3">
                        <Brain className="h-7 w-7" />
                        Recommendations (NIST 800-53 Controls)
                      </h3>
                      <div className="space-y-5">
                        {selectedRisk.recommendations.map((rec, idx) => (
                          <div
                            key={idx}
                            className="p-5 rounded-xl bg-green-500/10 border border-green-500/40 shadow-md"
                          >
                            <p className="text-lg text-foreground mb-5 font-medium leading-relaxed">{rec.text}</p>
                            <div className="space-y-3">
                              <div className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/40">
                                <p className="text-base font-bold text-teal-400 mb-3 flex items-center gap-2">
                                  <FileText className="h-5 w-5" />
                                  NIST 800-53 Controls
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {rec.nist_80053.map((control) => (
                                    <Badge
                                      key={control}
                                      variant="outline"
                                      className="border-teal-500 text-teal-400 bg-teal-500/20 text-base px-4 py-2 font-bold"
                                    >
                                      {control}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/40">
                                <p className="text-base font-bold text-purple-400 mb-2">Expected Risk Reduction</p>
                                <p className="text-base text-foreground">
                                  <span className="font-semibold text-purple-300">Likelihood:</span>{" "}
                                  {rec.expected_delta.likelihood} |
                                  <span className="font-semibold text-purple-300 ml-2">Impact:</span>{" "}
                                  {rec.expected_delta.impact}
                                </p>
                              </div>
                              <div className="p-4 rounded-lg bg-cyan-500/10 border border-cyan-500/40">
                                <p className="text-base font-bold text-cyan-400 mb-2">Assigned Owner</p>
                                <p className="text-base text-foreground font-medium">{rec.owner}</p>
                              </div>
                              <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/40">
                                <p className="text-base font-bold text-orange-400 mb-2">Target Due Date</p>
                                <p className="text-base text-foreground font-medium">{rec.due_date}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  )
}
