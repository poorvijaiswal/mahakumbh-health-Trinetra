"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSimulationData } from "@/hooks/use-simulation-data"
import { getDeviceTypeIcon } from "@/lib/device-utils"

export default function SweeperDashboard() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const { devices, isLoading } = useSimulationData()
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set())

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const name = localStorage.getItem("userName")

    if (role !== "sweeper") {
      router.push("/")
      return
    }

    setUserName(name || "Sweeper User")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const getAssignedTasks = () => {
    return devices
      .filter(
        (device) =>
          (device.type === "toilet" && device.status === "needs_cleaning") ||
          (device.type === "waste_bin" && device.status === "bin_full"),
      )
      .map((device) => ({
        id: device.id,
        device: device,
        type: device.type === "toilet" ? "toilet_cleaning" : "bin_emptying",
        description: device.type === "toilet" ? "Clean and sanitize toilet" : "Empty waste bin",
        priority: device.type === "waste_bin" && device.status === "bin_full" ? "High" : "Medium",
        location: device.location.area,
        usageCount: device.metadata.usageCount,
        fillLevel: device.metadata.fillLevel,
      }))
  }

  const markTaskComplete = (taskId: string) => {
    setCompletedTasks((prev) => new Set([...prev, taskId]))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const assignedTasks = getAssignedTasks()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">TRINETRA - Sweeper Dashboard</h1>
            <p className="text-sm opacity-80">Welcome, {userName}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/map")}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-green-600 bg-green-500"
            >
              View Map
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-green-600 bg-green-500"
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
              <div className="text-2xl font-bold text-green-600">{assignedTasks.length}</div>
              <div className="text-sm text-gray-600">Assigned Tasks</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{completedTasks.size}</div>
              <div className="text-sm text-gray-600">Completed Today</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">
                {assignedTasks.filter((t) => t.priority === "High").length}
              </div>
              <div className="text-sm text-gray-600">High Priority</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                {assignedTasks.filter((t) => t.type === "toilet_cleaning").length}
              </div>
              <div className="text-sm text-gray-600">Toilets to Clean</div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Your Cleaning Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignedTasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border ${completedTasks.has(task.id) ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getDeviceTypeIcon(task.device.type)}</span>
                      <div>
                        <div className="font-medium">{task.device.name}</div>
                        <div className="text-sm text-gray-600">{task.description}</div>
                        <div className="text-sm text-gray-500">📍 {task.location}</div>
                        {task.usageCount && <div className="text-xs text-gray-400">Usage count: {task.usageCount}</div>}
                        {task.fillLevel && <div className="text-xs text-gray-400">Fill level: {task.fillLevel}%</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={task.priority === "High" ? "destructive" : "default"}>{task.priority}</Badge>
                      {completedTasks.has(task.id) ? (
                        <Badge className="bg-green-100 text-green-800">✓ Completed</Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => markTaskComplete(task.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {assignedTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">🎉 All cleaning tasks completed! Great work!</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                className="w-full border-green-600 text-green-600 hover:bg-green-50 bg-transparent"
                variant="outline"
              >
                📋 Request Supplies
              </Button>
              <Button className="w-full border-red-600 text-red-600 hover:bg-red-50 bg-transparent" variant="outline">
                🚨 Report Equipment Issue
              </Button>
              <Button
                onClick={() => router.push("/map")}
                className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                variant="outline"
              >
                🗺️ View Cleaning Routes
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today's Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Tasks Completed</span>
                  <Badge variant="outline">{completedTasks.size}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Toilets Cleaned</span>
                  <Badge variant="outline">
                    {
                      Array.from(completedTasks).filter(
                        (id) => assignedTasks.find((t) => t.id === id)?.type === "toilet_cleaning",
                      ).length
                    }
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Bins Emptied</span>
                  <Badge variant="outline">
                    {
                      Array.from(completedTasks).filter(
                        (id) => assignedTasks.find((t) => t.id === id)?.type === "bin_emptying",
                      ).length
                    }
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
