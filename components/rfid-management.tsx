"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Device } from "@/lib/types"

interface RFIDManagementProps {
  devices: Device[]
  onUpdateDevice: (deviceId: string, updates: Partial<Device>) => void
}

export default function RFIDManagement({ devices, onUpdateDevice }: RFIDManagementProps) {
  const [newRFID, setNewRFID] = useState("")
  const [selectedDevice, setSelectedDevice] = useState("")
  const [scanMode, setScanMode] = useState(false)

  const devicesWithRFID = devices.filter((d) => d.metadata.rfidTag)
  const devicesWithoutRFID = devices.filter((d) => !d.metadata.rfidTag)

  const handleAssignRFID = () => {
    if (newRFID && selectedDevice) {
      const device = devices.find((d) => d.id === selectedDevice)
      if (device) {
        onUpdateDevice(device.id, {
          metadata: {
            ...device.metadata,
            rfidTag: newRFID,
            rfidAssignedAt: new Date(),
          },
        })
        setNewRFID("")
        setSelectedDevice("")
      }
    }
  }

  const handleRemoveRFID = (deviceId: string) => {
    const device = devices.find((d) => d.id === deviceId)
    if (device) {
      onUpdateDevice(device.id, {
        metadata: {
          ...device.metadata,
          rfidTag: undefined,
          rfidAssignedAt: undefined,
        },
      })
    }
  }

  const simulateRFIDScan = () => {
    setScanMode(true)
    // Simulate RFID scan
    setTimeout(() => {
      const randomRFID = `RFID-${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      setNewRFID(randomRFID)
      setScanMode(false)
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* RFID Assignment */}
      <Card>
        <CardHeader>
          <CardTitle>Assign New RFID Tag</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">RFID Tag ID</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newRFID}
                  onChange={(e) => setNewRFID(e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter or scan RFID"
                />
                <Button onClick={simulateRFIDScan} disabled={scanMode} className="bg-blue-600 hover:bg-blue-700">
                  {scanMode ? "Scanning..." : "📡 Scan"}
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Device</label>
              <select
                value={selectedDevice}
                onChange={(e) => setSelectedDevice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Choose device...</option>
                {devicesWithoutRFID.map((device) => (
                  <option key={device.id} value={device.id}>
                    {device.name} ({device.type})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAssignRFID}
                disabled={!newRFID || !selectedDevice}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                Assign RFID
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RFID Status Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-green-600">{devicesWithRFID.length}</div>
            <p className="text-sm text-gray-600">Devices with RFID</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-orange-600">{devicesWithoutRFID.length}</div>
            <p className="text-sm text-gray-600">Devices without RFID</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-blue-600">{devices.length}</div>
            <p className="text-sm text-gray-600">Total Devices</p>
          </CardContent>
        </Card>
      </div>

      {/* RFID Device List */}
      <Card>
        <CardHeader>
          <CardTitle>RFID Device Registry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Device</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">RFID Tag</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Assigned Date</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devicesWithRFID.map((device) => (
                  <tr key={device.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{device.name}</td>
                    <td className="p-2 capitalize">{device.type.replace("_", " ")}</td>
                    <td className="p-2">
                      <Badge variant="outline" className="font-mono">
                        {device.metadata.rfidTag}
                      </Badge>
                    </td>
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
                    <td className="p-2">
                      {device.metadata.rfidAssignedAt
                        ? new Date(device.metadata.rfidAssignedAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="p-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveRFID(device.id)}
                        className="text-xs text-red-600 border-red-600 hover:bg-red-50"
                      >
                        Remove RFID
                      </Button>
                    </td>
                  </tr>
                ))}
                {devicesWithRFID.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No devices with RFID tags assigned
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
