// Device Types and Status Definitions
export type DeviceType = "toilet" | "water_kiosk" | "waste_bin" | "mmu" | "volunteer"

export type ToiletStatus = "clean_free" | "in_use" | "needs_cleaning"
export type WaterKioskStatus = "water_safe" | "check_quality" | "water_unsafe"
export type WasteBinStatus = "bin_empty" | "filling_up" | "bin_full"
export type MMUStatus = "available_now" | "on_route" | "emergency_busy"
export type VolunteerStatus = "available" | "assigned_task" | "off_duty"

export type DeviceStatus = ToiletStatus | WaterKioskStatus | WasteBinStatus | MMUStatus | VolunteerStatus

export interface IoTDevice {
  id: string
  type: DeviceType
  name: string
  status: DeviceStatus
  location: {
    lat: number
    lng: number
    area: string
  }
  lastUpdated: Date
  metadata: {
    // Toilet specific
    usageCount?: number
    cleanedAt?: Date

    // Water Kiosk specific
    chlorineLevel?: number
    phLevel?: number
    lastTested?: Date

    // Waste Bin specific
    fillLevel?: number
    capacity?: number

    // MMU specific
    assignedEmergency?: string
    patientCount?: number

    // Volunteer specific
    assignedTask?: string
    taskLocation?: string
  }
}

export interface SimulationStats {
  totalDevices: number
  activeToilets: number
  unsafeWaterKiosks: number
  fullBins: number
  busyMMUs: number
  activeVolunteers: number
  lastRefresh: Date
}
