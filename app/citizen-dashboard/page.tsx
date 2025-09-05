"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSimulationData } from "@/hooks/use-simulation-data"
import { getStatusColor, getStatusIcon, getStatusLabel, getDeviceTypeIcon } from "@/lib/device-utils"
import IssueReportModal from "@/components/issue-report-modal"

export default function CitizenDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const { devices, stats, isLoading } = useSimulationData()
  const [selectedArea, setSelectedArea] = useState<string>("All Areas")
  const [reportModal, setReportModal] = useState<{
    isOpen: boolean
    type: "emergency" | "toilet" | "water" | null
  }>({
    isOpen: false,
    type: null,
  })

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const name = localStorage.getItem("userName")

    if (role !== "citizen") {
      router.push("/")
      return
    }

    setUserName(name || "Citizen User")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const openReportModal = (type: "emergency" | "toilet" | "water") => {
    setReportModal({ isOpen: true, type })
  }

  const closeReportModal = () => {
    setReportModal({ isOpen: false, type: null })
  }

  const handleVolunteerNow = () => {
    // Store volunteer interest and redirect to volunteer dashboard
    localStorage.setItem("userRole", "volunteer")
    localStorage.setItem("userName", "New Volunteer")
    router.push("/volunteer-dashboard")
  }

  const getUniqueAreas = () => {
    const areas = [...new Set(devices.map((d) => d.location.area))]
    return ["All Areas", ...areas.sort()]
  }

  const getNearbyDevices = () => {
    const filtered = selectedArea === "All Areas" ? devices : devices.filter((d) => d.location.area === selectedArea)

    return {
      toilets: filtered.filter((d) => d.type === "toilet"),
      waterKiosks: filtered.filter((d) => d.type === "water_kiosk"),
      wasteBins: filtered.filter((d) => d.type === "waste_bin"),
      mmus: filtered.filter((d) => d.type === "mmu"),
    }
  }

  const getHealthAlerts = () => {
    return devices
      .filter(
        (device) =>
          device.status === "water_unsafe" ||
          device.status === "emergency_busy" ||
          (device.type === "waste_bin" && device.status === "bin_full"),
      )
      .slice(0, 5) // Show top 5 alerts
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const nearbyDevices = getNearbyDevices()
  const healthAlerts = getHealthAlerts()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">TRINETRA - Citizen Dashboard</h1>
            <p className="text-sm opacity-80">Welcome, {userName}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/map")}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-blue-500"
            >
              View Map
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600 bg-blue-500"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Area Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Your Area</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full p-2 border rounded-lg"
            >
              {getUniqueAreas().map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>

        {/* Health Alerts */}
        {healthAlerts.length > 0 && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">🚨 Health & Safety Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {healthAlerts.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{getDeviceTypeIcon(device.type)}</span>
                      <div>
                        <div className="font-medium">{device.name}</div>
                        <div className="text-sm text-gray-600">{device.location.area}</div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(device.status)}>
                      {getStatusIcon(device.status)} {getStatusLabel(device.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Nearby Facilities */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🚻 Nearby Toilets ({nearbyDevices.toilets.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {nearbyDevices.toilets.slice(0, 10).map((toilet) => (
                  <div key={toilet.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="text-sm font-medium">{toilet.name}</div>
                      <div className="text-xs text-gray-500">{toilet.location.area}</div>
                    </div>
                    <Badge className={getStatusColor(toilet.status)} size="sm">
                      {getStatusIcon(toilet.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💧 Water Kiosks ({nearbyDevices.waterKiosks.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {nearbyDevices.waterKiosks.slice(0, 10).map((kiosk) => (
                  <div key={kiosk.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="text-sm font-medium">{kiosk.name}</div>
                      <div className="text-xs text-gray-500">{kiosk.location.area}</div>
                    </div>
                    <Badge className={getStatusColor(kiosk.status)} size="sm">
                      {getStatusIcon(kiosk.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Services */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🚑 Emergency Services ({nearbyDevices.mmus.length} MMUs Available)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {nearbyDevices.mmus.slice(0, 5).map((mmu) => (
                  <div key={mmu.id} className="flex items-center justify-between p-2 border rounded">
                    <div>
                      <div className="text-sm font-medium">{mmu.name}</div>
                      <div className="text-xs text-gray-500">{mmu.location.area}</div>
                    </div>
                    <Badge className={getStatusColor(mmu.status)} size="sm">
                      {getStatusIcon(mmu.status)}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-700 mb-2">Emergency Contacts</h4>
                <div className="space-y-1 text-sm">
                  <div>
                    🚨 Medical Emergency: <strong>108</strong>
                  </div>
                  <div>
                    🚓 Police: <strong>100</strong>
                  </div>
                  <div>
                    🚒 Fire: <strong>101</strong>
                  </div>
                  <div>
                    📞 Kumbh Helpline: <strong>1800-XXX-XXXX</strong>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Issues</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => openReportModal("emergency")}
                className="w-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                variant="outline"
              >
                🚨 Report Emergency
              </Button>
              <Button
                onClick={() => openReportModal("toilet")}
                className="w-full border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent"
                variant="outline"
              >
                🚽 Report Toilet Issue
              </Button>
              <Button
                onClick={() => openReportModal("water")}
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
                variant="outline"
              >
                💧 Report Water Problem
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Get Involved</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button onClick={handleVolunteerNow} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                🙋‍♀️ Volunteer Now
              </Button>
              <Button
                className="w-full border-teal-600 text-teal-600 hover:bg-teal-50 bg-transparent"
                variant="outline"
              >
                📋 View Volunteer Tasks
              </Button>
              <Button
                className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                variant="outline"
              >
                ℹ️ Volunteer Information
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => router.push("/map")}
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50"
                variant="outline"
              >
                🗺️ View Full Map
              </Button>
              <Button
                className="w-full border-indigo-600 text-indigo-600 hover:bg-indigo-50 bg-transparent"
                variant="outline"
              >
                📱 Download App
              </Button>
              <Button
                className="w-full border-gray-600 text-gray-600 hover:bg-gray-50 bg-transparent"
                variant="outline"
              >
                📞 Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <IssueReportModal isOpen={reportModal.isOpen} onClose={closeReportModal} issueType={reportModal.type} />
    </div>
  )
}
