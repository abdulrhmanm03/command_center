-- Seed data for testing
-- Run this after init-db.sql to populate with sample data

INSERT INTO alerts (severity, category, message, source_ip, status) VALUES
  ('critical', 'Malware', 'Ransomware detected on endpoint', '192.168.1.45', 'open'),
  ('high', 'Intrusion', 'Unauthorized access attempt', '185.23.1.44', 'investigating'),
  ('medium', 'Policy Violation', 'Unusual data transfer detected', '10.0.0.23', 'open'),
  ('low', 'Anomaly', 'Login from new location', '172.16.0.5', 'resolved');

INSERT INTO incidents (title, description, severity, status, assignee) VALUES
  ('Ransomware Outbreak', 'Multiple endpoints infected with ransomware', 'critical', 'investigating', 'John Doe'),
  ('Data Breach Attempt', 'Attempted unauthorized data exfiltration', 'high', 'open', NULL),
  ('Phishing Campaign', 'Widespread phishing emails detected', 'medium', 'investigating', 'Jane Smith');

INSERT INTO events (event_type, source, details) VALUES
  ('login_attempt', 'auth_service', '{"user": "admin", "ip": "185.23.1.44", "success": false}'),
  ('file_upload', 'web_app', '{"filename": "malware.exe", "blocked": true}'),
  ('api_call', 'mobile_app', '{"endpoint": "/api/users", "method": "GET"}');
