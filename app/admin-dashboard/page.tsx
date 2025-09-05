"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSimulationData } from "@/hooks/use-simulation-data"
import { useAIInsights } from "@/hooks/use-ai-insights"
import { AIInsightsPanel } from "@/components/ai-insights-panel"
import { AITaskAssignments } from "@/components/ai-task-assignments"
import DeviceDetailsModal from "@/components/device-details-modal"
import RFIDManagement from "@/components/rfid-management"
import type { Device } from "@/lib/types"


export default function AdminDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const { devices, stats, isLoading } = useSimulationData()
  const { insights, assignments } = useAIInsights(devices)
  const [selectedDevices, setSelectedDevices] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<"overview" | "active" | "critical" | "maintenance" | "rfid">("overview")
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const name = localStorage.getItem("userName")

    if (role !== "admin") {
      router.push("/")
      return
    }

    setUserName(name || "Admin User")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device)
    setIsDeviceModalOpen(true)
  }

  const handleDeviceUpdate = (deviceId: string, updates: Partial<Device>) => {
    // In a real app, this would update the device via API
    console.log("Updating device:", deviceId, updates)
    setIsDeviceModalOpen(false)
  }

  const getFilteredDevices = () => {
    switch (activeTab) {
      case "active":
        return devices.filter(
          (d) =>
            d.status === "clean" ||
            d.status === "water_safe" ||
            d.status === "available" ||
            d.status === "available_now" ||
            d.status === "empty",
        )
      case "critical":
        return devices.filter(
          (d) =>
            d.status === "needs_cleaning" ||
            d.status === "water_unsafe" ||
            d.status === "bin_full" ||
            d.status === "emergency_busy",
        )
      case "maintenance":
        return devices.filter((d) => d.status === "maintenance")
      default:
        return devices
    }
  }

  const exportToCSV = () => {
    const csvContent = [
      ["Device ID", "Type", "Name", "Status", "Location", "RFID Tag", "Last Updated"],
      ...devices.map((device) => [
        device.id,
        device.type,
        device.name,
        device.status,
        device.location.area,
        device.metadata.rfidTag || "N/A",
        // Ensure lastUpdated is a Date object
        new Date(device.lastUpdated).toISOString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trinetra_devices_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const filteredDevices = getFilteredDevices()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">TRINETRA - Admin Dashboard</h1>
            <p className="text-sm opacity-80">Welcome, {userName}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/analytics")}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-orange-600 bg-orange-500"
            >
              Analytics
            </Button>
            <Button
              onClick={() => router.push("/map")}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-orange-600 bg-orange-500"
            >
              View Map
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-orange-600 bg-orange-500"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview - Clickable Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card
            className={`cursor-pointer transition-all ${activeTab === "overview" ? "ring-2 ring-orange-500" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-gray-800">{stats?.totalDevices}</div>
              <p className="text-sm text-gray-600">Total Devices</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${activeTab === "active" ? "ring-2 ring-green-500" : ""}`}
            onClick={() => setActiveTab("active")}
          >
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats?.activeDevices}</div>
              <p className="text-sm text-gray-600">Active</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${activeTab === "critical" ? "ring-2 ring-red-500" : ""}`}
            onClick={() => setActiveTab("critical")}
          >
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{stats?.criticalDevices}</div>
              <p className="text-sm text-gray-600">Critical</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${activeTab === "maintenance" ? "ring-2 ring-yellow-500" : ""}`}
            onClick={() => setActiveTab("maintenance")}
          >
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-yellow-600">{stats?.maintenanceDevices}</div>
              <p className="text-sm text-gray-600">Maintenance</p>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${activeTab === "rfid" ? "ring-2 ring-blue-500" : ""}`}
            onClick={() => setActiveTab("rfid")}
          >
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{assignments.length}</div>
              <p className="text-sm text-gray-600">AI Tasks</p>
            </CardContent>
          </Card>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setActiveTab("overview")}
            variant={activeTab === "overview" ? "default" : "outline"}
            className={activeTab === "overview" ? "bg-orange-600 hover:bg-orange-700" : ""}
          >
            Overview
          </Button>
          <Button
            onClick={() => setActiveTab("rfid")}
            variant={activeTab === "rfid" ? "default" : "outline"}
            className={activeTab === "rfid" ? "bg-orange-600 hover:bg-orange-700" : ""}
          >
            RFID Management
          </Button>
        </div>

        {/* Content based on active tab */}
        {activeTab === "overview" && (
          <>
            {/* AI Insights and Task Management */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <AIInsightsPanel insights={insights} />
              <AITaskAssignments assignments={assignments} />
            </div>
          </>
        )}

        {activeTab === "rfid" && <RFIDManagement devices={devices} onUpdateDevice={handleDeviceUpdate} />}

        {/* Device Management Table */}
        {activeTab !== "rfid" && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>
                  {activeTab === "overview"
                    ? "Device Management"
                    : activeTab === "active"
                      ? "Active Devices"
                      : activeTab === "critical"
                        ? "Critical Devices"
                        : "Maintenance Required"}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline">{filteredDevices.length} devices</Badge>
                  <Button onClick={exportToCSV} className="bg-orange-600 hover:bg-orange-700">
                    Export CSV Report
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Device</th>
                      <th className="text-left p-2">Type</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Location</th>
                      <th className="text-left p-2">RFID</th>
                      <th className="text-left p-2">Last Updated</th>
                      <th className="text-left p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDevices.slice(0, 20).map((device) => (
                      <tr key={device.id} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{device.name}</td>
                        <td className="p-2 capitalize">{device.type.replace("_", " ")}</td>
                        <td className="p-2">
                          <Badge
                            className={`${
                              device.status === "clean" ||
                              device.status === "water_safe" ||
                              device.status === "available" ||
                              device.status === "available_now"
                                ? "bg-green-100 text-green-800"
                                : device.status === "needs_cleaning" ||
                                    device.status === "water_unsafe" ||
                                    device.status === "bin_full"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {device.status.replace("_", " ")}
                          </Badge>
                        </td>
                        <td className="p-2">{device.location.area}</td>
                        <td className="p-2">
                          {device.metadata.rfidTag ? (
                            <Badge variant="outline" className="font-mono text-xs">
                              {device.metadata.rfidTag}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-xs">No RFID</span>
                          )}
                        </td>
                        <td className="p-2">
                          {/* Ensure lastUpdated is a Date object before formatting */}
                          {device.lastUpdated
                            ? new Date(device.lastUpdated).toLocaleTimeString()
                            : ""}
                        </td>
                        <td className="p-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeviceClick(device)}
                            className="text-xs border-orange-600 text-orange-600 hover:bg-orange-50"
                          >
                            Manage
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <DeviceDetailsModal
        device={selectedDevice}
        isOpen={isDeviceModalOpen}
        onClose={() => setIsDeviceModalOpen(false)}
        onUpdate={handleDeviceUpdate}
      />
    </div>
  )
}
