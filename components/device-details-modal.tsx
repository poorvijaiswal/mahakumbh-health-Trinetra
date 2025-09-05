"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Device } from "@/lib/types"

interface DeviceDetailsModalProps {
  device: Device | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (deviceId: string, updates: Partial<Device>) => void
}

export default function DeviceDetailsModal({ device, isOpen, onClose, onUpdate }: DeviceDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    status: "",
    rfidTag: "",
    maintenanceNotes: "",
  })

  if (!isOpen || !device) return null

  const handleEdit = () => {
    setEditData({
      status: device.status,
      rfidTag: device.metadata.rfidTag || "",
      maintenanceNotes: device.metadata.maintenanceNotes || "",
    })
    setIsEditing(true)
  }

  const handleSave = () => {
    onUpdate(device.id, {
      status: editData.status as any,
      metadata: {
        ...device.metadata,
        rfidTag: editData.rfidTag,
        maintenanceNotes: editData.maintenanceNotes,
        lastMaintenance: new Date(),
      },
    })
    setIsEditing(false)
  }

  const getStatusOptions = () => {
    switch (device.type) {
      case "toilet":
        return ["clean", "in_use", "needs_cleaning", "maintenance"]
      case "water_kiosk":
        return ["water_safe", "check_quality", "water_unsafe", "maintenance"]
      case "waste_bin":
        return ["empty", "half_full", "bin_full", "maintenance"]
      case "mmu":
        return ["available_now", "on_route", "emergency_busy", "maintenance"]
      case "volunteer":
        return ["available", "assigned", "busy", "offline"]
      default:
        return ["active", "inactive", "maintenance"]
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Device Details - {device.name}</span>
            <Button variant="outline" onClick={onClose}>
              ✕
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Device ID</label>
              <p className="text-sm bg-gray-50 p-2 rounded">{device.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <p className="text-sm bg-gray-50 p-2 rounded capitalize">{device.type.replace("_", " ")}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <p className="text-sm bg-gray-50 p-2 rounded">{device.location.area}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
              <p className="text-sm bg-gray-50 p-2 rounded">
                {device.location.lat.toFixed(4)}, {device.location.lng.toFixed(4)}
              </p>
            </div>
          </div>

          {/* Status Management */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            {isEditing ? (
              <select
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                {getStatusOptions().map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>
            ) : (
              <Badge
                className={`${
                  device.status === "clean" ||
                  device.status === "water_safe" ||
                  device.status === "available" ||
                  device.status === "available_now"
                    ? "bg-green-100 text-green-800"
                    : device.status === "needs_cleaning" ||
                        device.status === "water_unsafe" ||
                        device.status === "bin_full" ||
                        device.status === "emergency_busy"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {device.status.replace("_", " ").toUpperCase()}
              </Badge>
            )}
          </div>

          {/* RFID Management */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RFID Tag</label>
            {isEditing ? (
              <input
                type="text"
                value={editData.rfidTag}
                onChange={(e) => setEditData({ ...editData, rfidTag: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Enter RFID tag ID"
              />
            ) : (
              <p className="text-sm bg-gray-50 p-2 rounded">{device.metadata.rfidTag || "No RFID tag assigned"}</p>
            )}
          </div>

          {/* Maintenance Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Maintenance Notes</label>
            {isEditing ? (
              <textarea
                value={editData.maintenanceNotes}
                onChange={(e) => setEditData({ ...editData, maintenanceNotes: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Enter maintenance notes"
              />
            ) : (
              <p className="text-sm bg-gray-50 p-2 rounded">
                {device.metadata.maintenanceNotes || "No maintenance notes"}
              </p>
            )}
          </div>

          {/* Device Metrics */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usage Count</label>
              <p className="text-sm bg-blue-50 p-2 rounded">{device.metadata.usageCount || 0}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fill Level</label>
              <p className="text-sm bg-blue-50 p-2 rounded">{device.metadata.fillLevel || 0}%</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
              <p className="text-sm bg-blue-50 p-2 rounded">{device.lastUpdated.toLocaleString()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {isEditing ? (
              <>
                <Button onClick={() => setIsEditing(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="flex-1 bg-orange-600 hover:bg-orange-700">
                  Save Changes
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleEdit} className="flex-1 bg-orange-600 hover:bg-orange-700">
                  Edit Device
                </Button>
                <Button
                  onClick={() =>
                    onUpdate(device.id, {
                      status: "maintenance" as any,
                      metadata: { ...device.metadata, lastMaintenance: new Date() },
                    })
                  }
                  variant="outline"
                  className="flex-1"
                >
                  Schedule Maintenance
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
