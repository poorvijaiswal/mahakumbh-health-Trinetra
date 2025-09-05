"use client"

import { useMemo } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useSimulationData } from "@/hooks/use-simulation-data"

export default function WasteBinChart() {
  const { devices } = useSimulationData()

  const chartData = useMemo(() => {
    const bins = devices.filter((d) => d.type === "waste_bin")

    // Group bins by fill level ranges
    const ranges = [
      { range: "0-20%", min: 0, max: 20, color: "#10b981" },
      { range: "21-40%", min: 21, max: 40, color: "#84cc16" },
      { range: "41-60%", min: 41, max: 60, color: "#f59e0b" },
      { range: "61-80%", min: 61, max: 80, color: "#f97316" },
      { range: "81-100%", min: 81, max: 100, color: "#ef4444" },
    ]

    return ranges.map((range) => {
      const count = bins.filter((bin) => {
        const fillLevel = bin.metadata.fillLevel || 0
        return fillLevel >= range.min && fillLevel <= range.max
      }).length

      return {
        range: range.range,
        count: count,
        fill: range.color,
      }
    })
  }, [devices])

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="range" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
