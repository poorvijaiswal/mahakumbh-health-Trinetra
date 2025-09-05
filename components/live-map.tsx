"use client"

import { useEffect, useRef, useState } from "react"
import { useSimulationData } from "@/hooks/use-simulation-data"
import {
  getStatusColor,
  getDeviceTypeIcon,
  getStatusIcon,
  getStatusLabel,
  getDeviceTypeLabel,
} from "@/lib/device-utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { IoTDevice, DeviceType } from "@/lib/types"

// Leaflet imports (will be loaded dynamically)
let L: any = null
let MarkerClusterGroup: any = null

export default function LiveMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerLayersRef = useRef<Map<DeviceType, any>>(new Map())
  const clusterGroupRef = useRef<any>(null)

  const { devices, stats, isLoading } = useSimulationData()
  const [selectedDevice, setSelectedDevice] = useState<IoTDevice | null>(null)
  const [activeFilters, setActiveFilters] = useState<Set<DeviceType>>(
    new Set(["toilet", "water_kiosk", "waste_bin", "mmu", "volunteer"]),
  )
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  const deviceTypes: { type: DeviceType; label: string; icon: string; color: string }[] = [
    { type: "toilet", label: "Toilets", icon: "🚻", color: "bg-blue-500" },
    { type: "water_kiosk", label: "Water Kiosks", icon: "💧", color: "bg-cyan-500" },
    { type: "waste_bin", label: "Waste Bins", icon: "🗑️", color: "bg-green-500" },
    { type: "mmu", label: "MMUs", icon: "🚑", color: "bg-red-500" },
    { type: "volunteer", label: "Volunteers", icon: "🧍‍♀️", color: "bg-purple-500" },
  ]

  // Load Leaflet dynamically
  useEffect(() => {
    const loadLeaflet = async () => {
      if (typeof window === "undefined") return

      try {
        // Load Leaflet CSS
        const link = document.createElement("link")
        link.rel = "stylesheet"
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        document.head.appendChild(link)

        // Load Leaflet JS
        const leafletModule = await import("leaflet")
        L = leafletModule.default

        // Load MarkerCluster
        const clusterScript = document.createElement("script")
        clusterScript.src = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js"
        document.head.appendChild(clusterScript)

        const clusterCSS = document.createElement("link")
        clusterCSS.rel = "stylesheet"
        clusterCSS.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css"
        document.head.appendChild(clusterCSS)

        const clusterDefaultCSS = document.createElement("link")
        clusterDefaultCSS.rel = "stylesheet"
        clusterDefaultCSS.href = "https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css"
        document.head.appendChild(clusterDefaultCSS)

        clusterScript.onload = () => {
          MarkerClusterGroup = (window as any).L.markerClusterGroup
          setIsMapLoaded(true)
        }

        // Fix for default markers
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        })
      } catch (error) {
        console.error("Failed to load Leaflet:", error)
      }
    }

    loadLeaflet()
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isMapLoaded || !mapRef.current || !L || !MarkerClusterGroup) return

    // Initialize map centered on Ujjain
    const map = L.map(mapRef.current).setView([23.1765, 75.7885], 13)

    // Add tile layer
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
    }).addTo(map)

    // Initialize cluster group
    const clusterGroup = new MarkerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
    })

    map.addLayer(clusterGroup)

    mapInstanceRef.current = map
    clusterGroupRef.current = clusterGroup

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isMapLoaded])

  // Create custom marker icon
  const createCustomIcon = (device: IoTDevice) => {
    if (!L) return null

    const statusColor = getStatusColor(device.status)
    const isGreen = statusColor.includes("green")
    const isYellow = statusColor.includes("yellow")
    const isRed = statusColor.includes("red")

    let color = "#6b7280" // gray
    if (isGreen) color = "#10b981" // green
    if (isYellow) color = "#f59e0b" // yellow
    if (isRed) color = "#ef4444" // red

    const deviceIcon = getDeviceTypeIcon(device.type)

    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 30px;
          height: 30px;
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        ">
          ${deviceIcon}
        </div>
      `,
      className: "custom-marker",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    })
  }

  // Update markers when devices or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !clusterGroupRef.current || !L || isLoading) return

    // Clear existing markers
    clusterGroupRef.current.clearLayers()

    // Filter devices based on active filters
    const filteredDevices = devices.filter((device) => activeFilters.has(device.type))

    // Add markers for filtered devices
    filteredDevices.forEach((device) => {
      const icon = createCustomIcon(device)
      if (!icon) return

      const marker = L.marker([device.location.lat, device.location.lng], { icon }).bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold;">${device.name}</h3>
            <p style="margin: 4px 0;"><strong>Type:</strong> ${getDeviceTypeLabel(device.type)}</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> ${getStatusIcon(device.status)} ${getStatusLabel(device.status)}</p>
            <p style="margin: 4px 0;"><strong>Location:</strong> ${device.location.area}</p>
            <p style="margin: 4px 0;"><strong>Last Updated:</strong> ${device.lastUpdated.toLocaleTimeString()}</p>
            <button onclick="window.showDeviceDetails('${device.id}')" style="
              background: #f97316;
              color: white;
              border: none;
              padding: 6px 12px;
              border-radius: 4px;
              cursor: pointer;
              margin-top: 8px;
            ">View Details</button>
          </div>
        `)

      clusterGroupRef.current.addLayer(marker)
    })
  }, [devices, activeFilters, isLoading, isMapLoaded])

  // Global function to show device details
  useEffect(() => {
    ;(window as any).showDeviceDetails = (deviceId: string) => {
      const device = devices.find((d) => d.id === deviceId)
      if (device) {
        setSelectedDevice(device)
      }
    }

    return () => {
      delete (window as any).showDeviceDetails
    }
  }, [devices])

  const toggleFilter = (type: DeviceType) => {
    const newFilters = new Set(activeFilters)
    if (newFilters.has(type)) {
      newFilters.delete(type)
    } else {
      newFilters.add(type)
    }
    setActiveFilters(newFilters)
  }

  const getFilteredCount = (type: DeviceType) => {
    return devices.filter((device) => device.type === type).length
  }

  if (isLoading) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {/* Stats Header */}
      <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-teal-50 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Live IoT Device Map</h3>
          <Badge variant="outline" className="text-xs">
            Last Updated: {stats?.lastRefresh.toLocaleTimeString()}
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
          <div className="text-center">
            <div className="font-bold text-green-600">{stats?.activeToilets}</div>
            <div className="text-gray-600">Clean Toilets</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-red-600">{stats?.unsafeWaterKiosks}</div>
            <div className="text-gray-600">Unsafe Water</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-orange-600">{stats?.fullBins}</div>
            <div className="text-gray-600">Full Bins</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-red-600">{stats?.busyMMUs}</div>
            <div className="text-gray-600">Busy MMUs</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-purple-600">{stats?.activeVolunteers}</div>
            <div className="text-gray-600">Available Volunteers</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-4 p-3 bg-white rounded-lg border shadow-sm">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm font-medium text-gray-700 mr-2 flex items-center">Filters:</span>
          {deviceTypes.map(({ type, label, icon, color }) => (
            <Button
              key={type}
              variant={activeFilters.has(type) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleFilter(type)}
              className={`text-xs ${activeFilters.has(type) ? color : ""}`}
            >
              <span className="mr-1">{icon}</span>
              {label} ({getFilteredCount(type)})
            </Button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative">
        <div ref={mapRef} className="w-full h-96 rounded-lg border shadow-sm" style={{ minHeight: "400px" }} />
        {!isMapLoaded && (
          <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading Leaflet map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Device Details Modal */}
      <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedDevice && getDeviceTypeIcon(selectedDevice.type)}
              Device Details
            </DialogTitle>
          </DialogHeader>
          {selectedDevice && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedDevice.name}</h3>
                <p className="text-sm text-gray-600">{selectedDevice.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Type</label>
                  <p className="text-sm">{getDeviceTypeLabel(selectedDevice.type)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <div className="flex items-center gap-1">
                    <span>{getStatusIcon(selectedDevice.status)}</span>
                    <span className="text-sm">{getStatusLabel(selectedDevice.status)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <p className="text-sm">{selectedDevice.location.area}</p>
                <p className="text-xs text-gray-500">
                  {selectedDevice.location.lat.toFixed(4)}, {selectedDevice.location.lng.toFixed(4)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Last Updated</label>
                <p className="text-sm">{selectedDevice.lastUpdated.toLocaleString()}</p>
              </div>

              {/* Device-specific metadata */}
              {selectedDevice.metadata && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Additional Info</label>
                  <div className="text-sm space-y-1">
                    {selectedDevice.metadata.usageCount !== undefined && (
                      <p>Usage Count: {selectedDevice.metadata.usageCount}</p>
                    )}
                    {selectedDevice.metadata.fillLevel !== undefined && (
                      <p>Fill Level: {selectedDevice.metadata.fillLevel}%</p>
                    )}
                    {selectedDevice.metadata.chlorineLevel !== undefined && (
                      <p>Chlorine Level: {selectedDevice.metadata.chlorineLevel.toFixed(2)} mg/L</p>
                    )}
                    {selectedDevice.metadata.phLevel !== undefined && (
                      <p>pH Level: {selectedDevice.metadata.phLevel.toFixed(1)}</p>
                    )}
                    {selectedDevice.metadata.patientCount !== undefined && (
                      <p>Patient Count: {selectedDevice.metadata.patientCount}</p>
                    )}
                    {selectedDevice.metadata.assignedTask && (
                      <p>Assigned Task: {selectedDevice.metadata.assignedTask}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
