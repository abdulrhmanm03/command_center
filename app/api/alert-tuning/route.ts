import { NextResponse } from "next/server"

export async function GET() {
  // Simulated alert tuning metrics data
  const tuningMetrics = {
    summary: {
      totalAlertsBefore: 45820,
      totalAlertsAfter: 12340,
      reductionPercentage: 73.1,
      falsePositiveRate: 8.2,
      previousFalsePositiveRate: 42.5,
      tuningRulesActive: 156,
      lastTuned: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    timeSeriesData: [
      { date: "2024-01-01", totalAlerts: 45820, falsePositives: 19473, truePositives: 26347, fpRate: 42.5 },
      { date: "2024-01-08", totalAlerts: 42150, falsePositives: 16860, truePositives: 25290, fpRate: 40.0 },
      { date: "2024-01-15", totalAlerts: 38200, falsePositives: 13388, truePositives: 24812, fpRate: 35.0 },
      { date: "2024-01-22", totalAlerts: 32100, falsePositives: 9630, truePositives: 22470, fpRate: 30.0 },
      { date: "2024-01-29", totalAlerts: 26800, falsePositives: 6700, truePositives: 20100, fpRate: 25.0 },
      { date: "2024-02-05", totalAlerts: 21500, falsePositives: 4300, truePositives: 17200, fpRate: 20.0 },
      { date: "2024-02-12", totalAlerts: 17200, falsePositives: 2580, truePositives: 14620, fpRate: 15.0 },
      { date: "2024-02-19", totalAlerts: 14800, falsePositives: 1776, truePositives: 13024, fpRate: 12.0 },
      { date: "2024-02-26", totalAlerts: 13100, falsePositives: 1310, truePositives: 11790, fpRate: 10.0 },
      { date: "2024-03-04", totalAlerts: 12340, falsePositives: 1012, truePositives: 11328, fpRate: 8.2 },
    ],
    categoryBreakdown: [
      { category: "Network Anomalies", before: 12500, after: 2800, reduction: 77.6 },
      { category: "Failed Logins", before: 18200, after: 3200, reduction: 82.4 },
      { category: "Malware Detection", before: 5600, after: 2100, reduction: 62.5 },
      { category: "Data Exfiltration", before: 4200, after: 1800, reduction: 57.1 },
      { category: "Privilege Escalation", before: 3100, after: 1500, reduction: 51.6 },
      { category: "Suspicious Activity", before: 2220, after: 940, reduction: 57.7 },
    ],
    tuningActions: [
      { action: "Threshold Adjustments", count: 45, impact: "High" },
      { action: "Whitelist Updates", count: 38, impact: "High" },
      { action: "Correlation Rules", count: 29, impact: "Medium" },
      { action: "Time-based Filters", count: 24, impact: "Medium" },
      { action: "Context Enrichment", count: 20, impact: "Low" },
    ],
  }

  return NextResponse.json(tuningMetrics)
}
