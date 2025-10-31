-- Database initialization script for Vercel Postgres
-- Run this script to set up the database schema

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

CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON alerts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_events_timestamp ON events(timestamp DESC);
