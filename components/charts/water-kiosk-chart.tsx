"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { useSimulationData } from "@/hooks/use-simulation-data"

export default function WaterKioskChart() {
  const { devices } = useSimulationData()

  const chartData = useMemo(() => {
    const kiosks = devices.filter((d) => d.type === "water_kiosk")

    const statusCounts = {
      "Water Safe": kiosks.filter((k) => k.status === "water_safe").length,
      "Check Quality": kiosks.filter((k) => k.status === "check_quality").length,
      "Water Unsafe": kiosks.filter((k) => k.status === "water_unsafe").length,
    }

    return [
      { name: "Water Safe", value: statusCounts["Water Safe"], color: "#10b981" },
      { name: "Check Quality", value: statusCounts["Check Quality"], color: "#f59e0b" },
      { name: "Water Unsafe", value: statusCounts["Water Unsafe"], color: "#ef4444" },
    ].filter((item) => item.value > 0)
  }, [devices])

  const RADIAN = Math.PI / 180
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
