"use client"

import { useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useSimulationData } from "@/hooks/use-simulation-data"

export default function ToiletUsageChart() {
  const { devices } = useSimulationData()

  const chartData = useMemo(() => {
    const toilets = devices.filter((d) => d.type === "toilet")
    const now = new Date()

    // Generate hourly data for the last 12 hours
    const data = []
    for (let i = 11; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000)
      const hourLabel = hour.getHours().toString().padStart(2, "0") + ":00"

      // Simulate usage patterns - higher during day hours
      const baseUsage = hour.getHours() >= 6 && hour.getHours() <= 22 ? 60 : 20
      const variance = Math.random() * 40 - 20

      const cleanFree = toilets.filter((t) => t.status === "clean").length
      const inUse = toilets.filter((t) => t.status === "in_use").length
      const needsCleaning = toilets.filter((t) => t.status === "needs_cleaning").length

      data.push({
        time: hourLabel,
        "Clean & Available": Math.max(0, cleanFree + Math.floor(variance)),
        "In Use": Math.max(0, inUse + Math.floor(variance * 0.3)),
        "Needs Cleaning": Math.max(0, needsCleaning + Math.floor(variance * 0.2)),
        totalUsage: Math.max(0, baseUsage + variance),
      })
    }

    return data
  }, [devices])

  if (!devices || devices.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading chart data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="time" stroke="#666" />
          <YAxis stroke="#666" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <Line
            type="monotone"
            dataKey="Clean & Available"
            stroke="#10b981"
            strokeWidth={2}
            dot={{ fill: "#10b981", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="In Use"
            stroke="#f59e0b"
            strokeWidth={2}
            dot={{ fill: "#f59e0b", strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="Needs Cleaning"
            stroke="#ef4444"
            strokeWidth={2}
            dot={{ fill: "#ef4444", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
