"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Coins, TrendingUp } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export function TokenUsageWidget() {
  const [usageData, setUsageData] = useState([
    { model: "VTS LLM-1", tokens: 1250000, cost: 37.5 }, // Replaced GPT-4 with VTS LLM
    { model: "VTS LLM-2", tokens: 3500000, cost: 7.0 }, // Replaced GPT-3.5 with VTS LLM
    { model: "Client Model A", tokens: 890000, cost: 26.7 }, // Replaced Claude with Client Model
    { model: "Client Model B", tokens: 2100000, cost: 0 }, // Replaced Llama with Client Model
  ])

  const [totalTokens, setTotalTokens] = useState(7740000)
  const [totalCost, setTotalCost] = useState(71.2)
  const [trend, setTrend] = useState(12.5)

  useEffect(() => {
    const interval = setInterval(() => {
      setUsageData((prev) =>
        prev.map((item) => ({
          ...item,
          tokens: item.tokens + Math.floor(Math.random() * 10000),
          cost: item.model === "Client Model B" ? 0 : item.cost + Math.random() * 0.5, // Updated condition
        })),
      )
      setTotalTokens((prev) => prev + Math.floor(Math.random() * 20000))
      setTotalCost((prev) => prev + Math.random() * 1)
      setTrend((prev) => prev + (Math.random() - 0.5) * 2)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-none bg-white/5 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Coins className="h-5 w-5 text-yellow-400" />
          Token Usage & Cost
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
              <div className="text-xs text-gray-400">Total Tokens</div>
              <div className="text-2xl font-bold text-blue-400">{totalTokens.toLocaleString()}</div>
              <div className="text-xs text-green-400 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />+{trend.toFixed(1)}% today
              </div>
            </div>
            <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/20">
              <div className="text-xs text-gray-400">Total Cost</div>
              <div className="text-2xl font-bold text-yellow-400">${totalCost.toFixed(2)}</div>
              <div className="text-xs text-gray-400 mt-1">This month</div>
            </div>
          </div>

          {/* Chart */}
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="model" stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="tokens" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
