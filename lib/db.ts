// Note: Vercel Postgres integration can be added via the Connect tab

export interface Alert {
  id: string
  timestamp: Date
  severity: "critical" | "high" | "medium" | "low"
  category: string
  message: string
  source_ip?: string
  destination_ip?: string
  status: "open" | "investigating" | "resolved"
}

export interface Incident {
  id: string
  title: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "open" | "investigating" | "resolved" | "closed"
  assignee?: string
  created_at: Date
  updated_at: Date
}

export interface Event {
  id: string
  timestamp: Date
  event_type: string
  source: string
  details: Record<string, unknown>
}

export interface Playbook {
  id: string
  name: string
  description: string
  steps: PlaybookStep[]
  estimated_duration: string
  automation_level: "manual" | "semi-automated" | "fully-automated"
}

export interface PlaybookStep {
  order: number
  name: string
  action_type: string
  parameters: Record<string, unknown>
  approval_required: boolean
}

export interface ResponseAction {
  id: string
  incident_id: string
  action_type: string
  target: string
  status: "pending" | "running" | "completed" | "failed"
  executed_at?: Date
  executed_by?: string
  result?: string
}

export interface FirmwareUpdate {
  id: string
  asset_id: string
  device_name: string
  vendor?: string
  current_version: string
  latest_version: string
  status: "up-to-date" | "outdated" | "critical" | "scheduled"
  risk_score: number
  cve_ids: string[]
  scheduled_at?: Date
  applied_at?: Date
  downtime_estimate?: string
  release_notes?: string
  created_at: Date
  updated_at: Date
}

export interface ScanningStatus {
  id: string
  scan_type: string
  status: "idle" | "scanning" | "paused" | "completed"
  devices_scanned: number
  total_devices: number
  started_at?: Date
  completed_at?: Date
  next_scan_at?: Date
  created_at: Date
}

export interface ComplianceControl {
  id: string
  control_id: string
  framework: string
  title: string
  status: "passing" | "failing" | "partial" | "unassigned"
  evidence: {
    source: string
    result: string
    timestamp: Date
    details?: string
  }[]
  checks_passing: number
  checks_total: number
  last_checked: Date
  assigned_to?: string
  priority: "critical" | "high" | "medium" | "low"
  remediation_playbook?: string
}

export interface Hunt {
  id: string
  name: string
  query: string
  description?: string
  created_by: string
  created_at: Date
  last_run?: Date
  results_count?: number
  status: "active" | "paused" | "completed"
  schedule?: string
}

export interface VaultEntry {
  id: string
  title: string
  incident_id?: string
  content: string
  category: "incident" | "playbook" | "threat" | "lesson"
  tags: string[]
  created_by: string
  created_at: Date
  updated_at: Date
  linked_alerts?: string[]
  linked_playbooks?: string[]
  root_cause?: string
  ttps?: string[]
}

export interface MarketplaceItem {
  id: string
  name: string
  type: "integration" | "rule" | "playbook"
  description: string
  vendor?: string
  category: string
  downloads: number
  rating: number
  installed: boolean
  version: string
  updated_at: Date
}

export interface Forecast {
  id: string
  forecast_type: string
  prediction: string
  confidence: number
  timeframe: string
  risk_score: number
  created_at: Date
  details: Record<string, unknown>
}

export interface AIAsset {
  id: string
  name: string
  asset_type: "LLM" | "Dataset" | "Plugin" | "Actor" | "Pipeline" | "VectorDB"
  provider: string
  cloud: "AWS" | "GCP" | "Azure" | "OpenAI" | "Anthropic"
  environment: "Production" | "Development" | "Test"
  risk_score: number
  assets_discovered: number
  runtime_protection: boolean
  risks: number
  top_risk?: string
  status: "Active" | "Inactive" | "Scanning"
  attempts?: number
  timestamp: Date
  connections?: {
    type: string
    target: string
  }[]
}

export interface AIRisk {
  id: string
  asset_id: string
  risk_type: string
  owasp_category: string
  severity: "Critical" | "High" | "Medium" | "Low"
  description: string
  first_discovered: Date
  status: "Open" | "Mitigated" | "Accepted"
  remediation?: string
}

export interface AIActivity {
  id: string
  activity_type: "Trained Datasets" | "Models deployed" | "Queries" | "Interactions"
  count: number
  change_percent: number
  timestamp: Date
}

// SQL schema for Vercel Postgres
export const schema = `
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP DEFAULT NOW(),
  severity VARCHAR(20) NOT NULL,
  category VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  source_ip VARCHAR(45),
  destination_ip VARCHAR(45),
  status VARCHAR(20) DEFAULT 'open'
);

CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  severity VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  assignee VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMP DEFAULT NOW(),
  event_type VARCHAR(100) NOT NULL,
  source VARCHAR(255) NOT NULL,
  details JSONB
);

CREATE TABLE IF NOT EXISTS playbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  steps JSONB NOT NULL,
  estimated_duration VARCHAR(50),
  automation_level VARCHAR(50) DEFAULT 'manual',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS response_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id),
  action_type VARCHAR(100) NOT NULL,
  target VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  executed_at TIMESTAMP,
  executed_by VARCHAR(100),
  result TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_behavior (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(100) NOT NULL,
  activity_type VARCHAR(100) NOT NULL,
  risk_score INTEGER DEFAULT 0,
  anomaly_detected BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT NOW(),
  details JSONB
);

CREATE TABLE IF NOT EXISTS firmware_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id TEXT NOT NULL,
  device_name VARCHAR(255) NOT NULL,
  vendor VARCHAR(100),
  current_version VARCHAR(100) NOT NULL,
  latest_version VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'outdated',
  risk_score INTEGER DEFAULT 0,
  cve_ids TEXT[],
  scheduled_at TIMESTAMPTZ,
  applied_at TIMESTAMPTZ,
  downtime_estimate VARCHAR(50),
  release_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS scanning_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scan_type VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'idle',
  devices_scanned INTEGER DEFAULT 0,
  total_devices INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  next_scan_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS compliance_controls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  control_id VARCHAR(50) NOT NULL,
  framework VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'unassigned',
  evidence JSONB DEFAULT '[]',
  checks_passing INTEGER DEFAULT 0,
  checks_total INTEGER DEFAULT 0,
  last_checked TIMESTAMPTZ DEFAULT NOW(),
  assigned_to VARCHAR(100),
  priority VARCHAR(20) DEFAULT 'medium',
  remediation_playbook VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hunts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  query TEXT NOT NULL,
  description TEXT,
  created_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_run TIMESTAMPTZ,
  results_count INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  schedule VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS vault_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  incident_id UUID,
  content TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  tags TEXT[],
  created_by VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  linked_alerts TEXT[],
  linked_playbooks TEXT[],
  root_cause TEXT,
  ttps TEXT[]
);

CREATE TABLE IF NOT EXISTS marketplace_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  description TEXT,
  vendor VARCHAR(100),
  category VARCHAR(100),
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  installed BOOLEAN DEFAULT FALSE,
  version VARCHAR(50),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  forecast_type VARCHAR(100) NOT NULL,
  prediction TEXT NOT NULL,
  confidence DECIMAL(5,2) NOT NULL,
  timeframe VARCHAR(50) NOT NULL,
  risk_score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  details JSONB
);

CREATE TABLE IF NOT EXISTS ai_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  asset_type VARCHAR(50) NOT NULL,
  provider VARCHAR(100) NOT NULL,
  cloud VARCHAR(50) NOT NULL,
  environment VARCHAR(50) DEFAULT 'Production',
  risk_score INTEGER DEFAULT 0,
  assets_discovered INTEGER DEFAULT 0,
  runtime_protection BOOLEAN DEFAULT FALSE,
  risks INTEGER DEFAULT 0,
  top_risk TEXT,
  status VARCHAR(20) DEFAULT 'Active',
  attempts INTEGER DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  connections JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_risks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id UUID REFERENCES ai_assets(id),
  risk_type VARCHAR(255) NOT NULL,
  owasp_category VARCHAR(100) NOT NULL,
  severity VARCHAR(20) NOT NULL,
  description TEXT NOT NULL,
  first_discovered TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'Open',
  remediation TEXT
);

CREATE TABLE IF NOT EXISTS ai_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_type VARCHAR(100) NOT NULL,
  count INTEGER DEFAULT 0,
  change_percent DECIMAL(5,2) DEFAULT 0,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alerts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_response_actions_incident ON response_actions(incident_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_user ON user_behavior(user_id);
CREATE INDEX IF NOT EXISTS idx_user_behavior_timestamp ON user_behavior(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_firmware_status ON firmware_updates(status);
CREATE INDEX IF NOT EXISTS idx_firmware_scheduled ON firmware_updates(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_firmware_risk ON firmware_updates(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_compliance_framework ON compliance_controls(framework);
CREATE INDEX IF NOT EXISTS idx_compliance_status ON compliance_controls(status);
CREATE INDEX IF NOT EXISTS idx_compliance_priority ON compliance_controls(priority);
CREATE INDEX IF NOT EXISTS idx_compliance_control_id ON compliance_controls(control_id);
CREATE INDEX IF NOT EXISTS idx_hunts_status ON hunts(status);
CREATE INDEX IF NOT EXISTS idx_vault_category ON vault_entries(category);
CREATE INDEX IF NOT EXISTS idx_vault_created ON vault_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_type ON marketplace_items(type);
CREATE INDEX IF NOT EXISTS idx_marketplace_installed ON marketplace_items(installed);
CREATE INDEX IF NOT EXISTS idx_forecasts_type ON forecasts(forecast_type);

CREATE INDEX IF NOT EXISTS idx_ai_assets_type ON ai_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_ai_assets_risk ON ai_assets(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_ai_assets_environment ON ai_assets(environment);
CREATE INDEX IF NOT EXISTS idx_ai_risks_severity ON ai_risks(severity);
CREATE INDEX IF NOT EXISTS idx_ai_risks_status ON ai_risks(status);
`
