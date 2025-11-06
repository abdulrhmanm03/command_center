export const risks = [
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
    decision_status: "Pending",
    decision_notes: "",
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
    decision_status: "Pending",
    decision_notes: "",
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
    decision_status: "Pending",
    decision_notes: "",
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
    decision_status: "Pending",
    decision_notes: "",
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
    decision_status: "Pending",
    decision_notes: "",
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
    decision_status: "Pending",
    decision_notes: "",
  },
]
