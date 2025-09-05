"use client"

import { useMemo } from "react"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useSimulationData } from "@/hooks/use-simulation-data"

export default function DeviceStatusOverview() {
  const { devices } = useSimulationData()

  const chartData = useMemo(() => {
    const now = new Date()

    // Generate data for the last 24 hours (every 2 hours)
    const data = []
    for (let i = 11; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 2 * 60 * 60 * 1000)
      const timeLabel = time.getHours().toString().padStart(2, "0") + ":00"

      const operational = devices.filter(
        (d) => !["needs_cleaning", "water_unsafe", "bin_full", "emergency_busy", "maintenance"].includes(d.status),
      ).length

      const critical = devices.filter((d) =>
        ["needs_cleaning", "water_unsafe", "bin_full", "emergency_busy"].includes(d.status),
      ).length

      const maintenance = devices.filter((d) => d.status === "maintenance").length

      // Add some variance to make it realistic
      const variance = Math.floor(Math.random() * 20 - 10)

      data.push({
        time: timeLabel,
        Operational: Math.max(0, operational + variance),
        Critical: Math.max(0, critical - Math.floor(variance / 2)),
        Maintenance: Math.max(0, maintenance + Math.floor(variance / 3)),
        Total: devices.length,
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
        <AreaChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
          <Area type="monotone" dataKey="Operational" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
          <Area type="monotone" dataKey="Critical" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
          <Area type="monotone" dataKey="Maintenance" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
