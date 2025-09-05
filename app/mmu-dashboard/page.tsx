"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDevicesByType } from "@/hooks/use-simulation-data"
import { getStatusColor, getStatusIcon, getStatusLabel } from "@/lib/device-utils"

export default function MMUDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const mmuDevices = useDevicesByType("mmu")
  const [taskStatuses, setTaskStatuses] = useState<Record<string, string>>({})

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const name = localStorage.getItem("userName")

    if (role !== "mmu") {
      router.push("/")
      return
    }

    setUserName(name || "MMU User")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const updateTaskStatus = (deviceId: string, status: string) => {
    setTaskStatuses((prev) => ({ ...prev, [deviceId]: status }))
  }

  const getEmergencies = () => {
    return mmuDevices
      .filter((device) => device.status === "emergency_busy" || device.status === "on_route")
      .map((device) => ({
        id: device.id,
        device: device,
        emergencyType: device.metadata.assignedEmergency || "Medical Emergency",
        patientCount: device.metadata.patientCount || 1,
        status: taskStatuses[device.id] || "Dispatched",
        location: device.location.area,
      }))
  }

  const emergencies = getEmergencies()
  const availableMMUs = mmuDevices.filter((d) => d.status === "available_now").length

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">TRINETRA - MMU Dashboard</h1>
            <p className="text-sm opacity-80">Welcome, {userName}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/map")}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-red-600 bg-red-500"
            >
              View Map
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-red-600 bg-red-500"
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{availableMMUs}</div>
              <div className="text-sm text-gray-600">Available MMUs</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{emergencies.length}</div>
              <div className="text-sm text-gray-600">Active Emergencies</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                {emergencies.reduce((sum, e) => sum + e.patientCount, 0)}
              </div>
              <div className="text-sm text-gray-600">Patients</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{mmuDevices.length}</div>
              <div className="text-sm text-gray-600">Total MMUs</div>
            </CardContent>
          </Card>
        </div>

        {/* Active Emergencies */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-red-600">Active Emergencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {emergencies.map((emergency) => (
                <div key={emergency.id} className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium text-lg">🚑 {emergency.device.name}</div>
                      <div className="text-sm text-gray-600">{emergency.emergencyType}</div>
                      <div className="text-sm text-gray-500">📍 {emergency.location}</div>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(emergency.device.status)}>
                        {getStatusIcon(emergency.device.status)} {getStatusLabel(emergency.device.status)}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-1">Patients: {emergency.patientCount}</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => updateTaskStatus(emergency.id, "On-Scene")}
                      className={
                        taskStatuses[emergency.id] === "On-Scene" ? "bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
                      }
                    >
                      {taskStatuses[emergency.id] === "On-Scene" ? "✓ On-Scene" : "Mark On-Scene"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateTaskStatus(emergency.id, "Treating")}
                      className={
                        taskStatuses[emergency.id] === "Treating" ? "bg-yellow-600" : "bg-green-600 hover:bg-green-700"
                      }
                    >
                      {taskStatuses[emergency.id] === "Treating" ? "✓ Treating" : "Start Treatment"}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => updateTaskStatus(emergency.id, "Transporting")}
                      className={
                        taskStatuses[emergency.id] === "Transporting"
                          ? "bg-yellow-600"
                          : "bg-purple-600 hover:bg-purple-700"
                      }
                    >
                      {taskStatuses[emergency.id] === "Transporting" ? "✓ Transporting" : "Transport"}
                    </Button>
                  </div>
                </div>
              ))}
              {emergencies.length === 0 && (
                <div className="text-center py-8 text-gray-500">🎉 No active emergencies at this time</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* MMU Fleet Status */}
        <Card>
          <CardHeader>
            <CardTitle>MMU Fleet Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {mmuDevices.map((mmu) => (
                <div key={mmu.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">🚑 {mmu.name}</div>
                      <div className="text-sm text-gray-600">{mmu.location.area}</div>
                    </div>
                    <Badge className={getStatusColor(mmu.status)}>
                      {getStatusIcon(mmu.status)} {getStatusLabel(mmu.status)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
