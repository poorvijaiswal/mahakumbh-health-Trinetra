"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSimulationData } from "@/hooks/use-simulation-data"
import ToiletUsageChart from "@/components/charts/toilet-usage-chart"
import WasteBinChart from "@/components/charts/waste-bin-chart"
import WaterKioskChart from "@/components/charts/water-kiosk-chart"
import DeviceStatusOverview from "@/components/charts/device-status-overview"

export default function AnalyticsPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")
  const { stats, isLoading, forceRefresh } = useSimulationData()

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const name = localStorage.getItem("userName")

    if (!role) {
      router.push("/")
      return
    }

    setUserRole(role)
    setUserName(name || "User")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-orange-600"
      case "volunteer":
        return "bg-teal-600"
      case "mmu":
        return "bg-red-600"
      case "sweeper":
        return "bg-green-600"
      case "citizen":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className={`${getRoleColor(userRole)} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">TRINETRA - Analytics Dashboard</h1>
            <p className="text-sm opacity-80">Welcome, {userName}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-gray-800 bg-transparent"
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={forceRefresh}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-gray-800 bg-transparent"
            >
              Refresh Data
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-gray-800 bg-transparent"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Analytics Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Real-time Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-800">{stats?.totalDevices}</div>
              <div className="text-sm text-gray-600">Total Devices</div>
              <Badge variant="outline" className="text-xs mt-1">
                Live
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats?.activeToilets}</div>
              <div className="text-sm text-gray-600">Clean Toilets</div>
              <Badge variant="outline" className="text-xs mt-1">
                {stats?.lastRefresh.toLocaleTimeString()}
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{stats?.unsafeWaterKiosks}</div>
              <div className="text-sm text-gray-600">Unsafe Water</div>
              <Badge variant="destructive" className="text-xs mt-1">
                Alert
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{stats?.fullBins}</div>
              <div className="text-sm text-gray-600">Full Bins</div>
              <Badge variant="outline" className="text-xs mt-1">
                Action Needed
              </Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{stats?.activeVolunteers}</div>
              <div className="text-sm text-gray-600">Available Volunteers</div>
              <Badge variant="outline" className="text-xs mt-1">
                Ready
              </Badge>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Device Status Overview (24h)</CardTitle>
            </CardHeader>
            <CardContent>
              <DeviceStatusOverview />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Toilet Usage Trends (12h)</CardTitle>
            </CardHeader>
            <CardContent>
              <ToiletUsageChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Waste Bin Fill Levels</CardTitle>
            </CardHeader>
            <CardContent>
              <WasteBinChart />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Water Kiosk Status Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <WaterKioskChart />
            </CardContent>
          </Card>
        </div>

        {/* Real-time Updates Info */}
        <Card>
          <CardHeader>
            <CardTitle>Real-Time Monitoring Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl mb-2">🔄</div>
                <div className="font-semibold text-green-700">Auto-Refresh Active</div>
                <div className="text-sm text-green-600">Updates every 20 seconds</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl mb-2">📊</div>
                <div className="font-semibold text-blue-700">Live Data Streaming</div>
                <div className="text-sm text-blue-600">285 IoT devices monitored</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl mb-2">⚡</div>
                <div className="font-semibold text-orange-700">Real-Time Alerts</div>
                <div className="text-sm text-orange-600">Instant notifications enabled</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
