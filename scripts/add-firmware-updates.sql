-- Add firmware_updates table for tracking firmware versions and scheduled updates
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

CREATE INDEX IF NOT EXISTS idx_firmware_status ON firmware_updates(status);
CREATE INDEX IF NOT EXISTS idx_firmware_scheduled ON firmware_updates(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_firmware_risk ON firmware_updates(risk_score DESC);

-- Add scanning_status table for live vulnerability scanning
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

-- Insert sample firmware update data
INSERT INTO firmware_updates (asset_id, device_name, vendor, current_version, latest_version, status, risk_score, cve_ids, downtime_estimate, release_notes) VALUES
('cisco-r1', 'Cisco Router R1', 'Cisco', 'v15.2', 'v15.9', 'critical', 95, ARRAY['CVE-2025-1234', 'CVE-2025-1235'], '30 minutes', 'Critical security patches for remote code execution vulnerabilities'),
('win-srv-01', 'Windows Server 2019', 'Microsoft', 'Build 19041', 'Build 19045', 'critical', 92, ARRAY['CVE-2025-5678'], '2 hours', 'Zero-day vulnerability patch - immediate update recommended'),
('ubnt-ap-01', 'Ubiquiti AP', 'Ubiquiti', '6.1.2', '6.5.55', 'critical', 88, ARRAY['CVE-2025-9012'], '15 minutes', 'RCE exploit active in the wild - urgent update required'),
('cisco-sw-01', 'Cisco Switch SW1', 'Cisco', 'v12.4', 'v12.8', 'outdated', 65, ARRAY['CVE-2024-8765'], '45 minutes', 'Performance improvements and security enhancements'),
('palo-fw-01', 'Palo Alto Firewall', 'Palo Alto', '10.1.3', '10.2.5', 'outdated', 70, ARRAY['CVE-2024-4321'], '1 hour', 'Security updates for SSL/TLS vulnerabilities'),
('juniper-r1', 'Juniper Router', 'Juniper', '20.4R1', '21.2R3', 'outdated', 55, ARRAY[], '30 minutes', 'Feature updates and bug fixes'),
('fortinet-fw', 'FortiGate Firewall', 'Fortinet', '7.0.1', '7.2.4', 'critical', 85, ARRAY['CVE-2025-3456'], '1.5 hours', 'Critical authentication bypass vulnerability fixed'),
('dell-sw-01', 'Dell Switch', 'Dell', '9.14.2.5', '9.14.2.10', 'up-to-date', 10, ARRAY[], '20 minutes', 'Latest stable release'),
('hp-sw-02', 'HP ProCurve Switch', 'HP', 'KB.16.02', 'KB.16.10', 'outdated', 45, ARRAY[], '25 minutes', 'Minor security updates'),
('aruba-ap-01', 'Aruba Access Point', 'Aruba', '8.7.1.1', '8.10.0.0', 'outdated', 60, ARRAY['CVE-2024-7890'], '15 minutes', 'WPA3 security enhancements');

-- Insert initial scanning status
INSERT INTO scanning_status (scan_type, status, devices_scanned, total_devices, next_scan_at) VALUES
('firmware', 'idle', 42, 42, NOW() + INTERVAL '8 minutes');
