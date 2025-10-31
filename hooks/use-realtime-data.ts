"use client"

import { useEffect, useState, useCallback, useRef } from "react"

interface ThreatEvent {
  id: string
  timestamp: string
  message: string
  severity: "critical" | "high" | "medium" | "low"
  ip?: string
  location?: string
  type?: string
  risk?: number
}

interface Metrics {
  totalAlerts: number
  itAlerts: number
  criticalAnomalies: number
  vulnerabilities: number
  mttd: string
  eventsPerMin: number
  activeIncidents: number
  blockedThreats: number
  uaeThreats?: number
}

const SSE_ENABLED = false // Set to false to disable SSE and use polling fallback

export function useRealtimeData() {
  const [threats, setThreats] = useState<ThreatEvent[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const maxReconnectAttempts = 3 // Reduced to fail faster
  const hasGivenUpRef = useRef(false)

  useEffect(() => {
    if (!SSE_ENABLED) {
      console.log("[v0] SSE is disabled, using polling fallback")
      setIsConnected(false)
      return
    }

    const connectSSE = () => {
      if (hasGivenUpRef.current) {
        return
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }

      try {
        const eventSource = new EventSource("/api/sse")
        eventSourceRef.current = eventSource

        eventSource.onopen = () => {
          setIsConnected(true)
          reconnectAttemptsRef.current = 0
          hasGivenUpRef.current = false
        }

        eventSource.onmessage = (event) => {
          if (isPaused) return

          try {
            const data = JSON.parse(event.data)

            if (data.type === "threat") {
              setThreats((prev) => [data, ...prev].slice(0, 100))
            } else if (data.type === "metrics") {
              setMetrics(data.data)
            }
          } catch (error) {
            console.error("[v0] Error parsing SSE data:", error)
          }
        }

        eventSource.onerror = () => {
          setIsConnected(false)

          if (eventSourceRef.current) {
            eventSourceRef.current.close()
            eventSourceRef.current = null
          }

          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current += 1
            const backoffDelay = 2000 * reconnectAttemptsRef.current

            reconnectTimeoutRef.current = setTimeout(() => {
              connectSSE()
            }, backoffDelay)
          } else {
            hasGivenUpRef.current = true
          }
        }
      } catch (error) {
        setIsConnected(false)
        hasGivenUpRef.current = true
      }
    }

    const initialConnectionTimeout = setTimeout(() => {
      connectSSE()
    }, 500)

    return () => {
      clearTimeout(initialConnectionTimeout)

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = null
      }

      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
    }
  }, [])

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  const clearThreats = useCallback(() => {
    setThreats([])
  }, [])

  return { threats, metrics, isConnected, isPaused, togglePause, clearThreats }
}
