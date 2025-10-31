-- Seed automated response playbooks
INSERT INTO playbooks (name, description, steps, estimated_duration, automation_level) VALUES
(
  'Isolate Endpoint',
  'Automatically isolate compromised endpoint from network',
  '[
    {"order": 1, "name": "Identify endpoint", "action_type": "query", "parameters": {"source": "edr"}, "approval_required": false},
    {"order": 2, "name": "Verify endpoint status", "action_type": "validate", "parameters": {}, "approval_required": false},
    {"order": 3, "name": "Execute isolation", "action_type": "isolate", "parameters": {"method": "network"}, "approval_required": true},
    {"order": 4, "name": "Notify security team", "action_type": "notify", "parameters": {"channel": "slack"}, "approval_required": false}
  ]'::jsonb,
  '2-3 minutes',
  'semi-automated'
),
(
  'Block IP Address',
  'Block malicious IP at firewall and update threat intelligence',
  '[
    {"order": 1, "name": "Validate IP address", "action_type": "validate", "parameters": {}, "approval_required": false},
    {"order": 2, "name": "Check threat intelligence", "action_type": "query", "parameters": {"source": "threat_intel"}, "approval_required": false},
    {"order": 3, "name": "Add firewall rule", "action_type": "block", "parameters": {"device": "firewall"}, "approval_required": false},
    {"order": 4, "name": "Update threat feed", "action_type": "update", "parameters": {"feed": "internal"}, "approval_required": false}
  ]'::jsonb,
  '1-2 minutes',
  'fully-automated'
),
(
  'Disable User Account',
  'Disable compromised user account in Active Directory',
  '[
    {"order": 1, "name": "Verify user identity", "action_type": "validate", "parameters": {}, "approval_required": false},
    {"order": 2, "name": "Check active sessions", "action_type": "query", "parameters": {"source": "ad"}, "approval_required": false},
    {"order": 3, "name": "Disable account", "action_type": "disable", "parameters": {"system": "active_directory"}, "approval_required": true},
    {"order": 4, "name": "Terminate sessions", "action_type": "terminate", "parameters": {}, "approval_required": false},
    {"order": 5, "name": "Notify user and manager", "action_type": "notify", "parameters": {}, "approval_required": false}
  ]'::jsonb,
  '3-5 minutes',
  'semi-automated'
),
(
  'Delete Phishing Email',
  'Remove phishing email from all mailboxes',
  '[
    {"order": 1, "name": "Identify email", "action_type": "query", "parameters": {"source": "office365"}, "approval_required": false},
    {"order": 2, "name": "Scan for recipients", "action_type": "scan", "parameters": {}, "approval_required": false},
    {"order": 3, "name": "Delete from mailboxes", "action_type": "delete", "parameters": {"system": "office365"}, "approval_required": true},
    {"order": 4, "name": "Update email filter", "action_type": "update", "parameters": {"filter": "spam"}, "approval_required": false}
  ]'::jsonb,
  '2-4 minutes',
  'semi-automated'
);
