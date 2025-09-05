import type { DeviceStatus, DeviceType } from "./types"

export const getStatusColor = (status: DeviceStatus): string => {
  switch (status) {
    // Green statuses (good)
    case "clean_free":
    case "water_safe":
    case "bin_empty":
    case "available_now":
    case "available":
      return "text-green-600 bg-green-100"

    // Yellow statuses (warning)
    case "in_use":
    case "check_quality":
    case "filling_up":
    case "on_route":
    case "assigned_task":
      return "text-yellow-600 bg-yellow-100"

    // Red statuses (critical)
    case "needs_cleaning":
    case "water_unsafe":
    case "bin_full":
    case "emergency_busy":
      return "text-red-600 bg-red-100"

    // Gray statuses (inactive)
    case "off_duty":
      return "text-gray-600 bg-gray-100"

    default:
      return "text-gray-600 bg-gray-100"
  }
}

export const getStatusIcon = (status: DeviceStatus): string => {
  switch (status) {
    case "clean_free":
      return "🟢"
    case "in_use":
      return "🟡"
    case "needs_cleaning":
      return "🔴"
    case "water_safe":
      return "🟢"
    case "check_quality":
      return "🟡"
    case "water_unsafe":
      return "🔴"
    case "bin_empty":
      return "🟢"
    case "filling_up":
      return "🟡"
    case "bin_full":
      return "🔴"
    case "available_now":
      return "🟢"
    case "on_route":
      return "🟡"
    case "emergency_busy":
      return "🔴"
    case "available":
      return "🟢"
    case "assigned_task":
      return "🟡"
    case "off_duty":
      return "⚫"
    default:
      return "⚪"
  }
}

export const getDeviceTypeIcon = (type: DeviceType): string => {
  switch (type) {
    case "toilet":
      return "🚻"
    case "water_kiosk":
      return "💧"
    case "waste_bin":
      return "🗑️"
    case "mmu":
      return "🚑"
    case "volunteer":
      return "🧍‍♀️"
    default:
      return "📍"
  }
}

export const getStatusLabel = (status: DeviceStatus): string => {
  switch (status) {
    case "clean_free":
      return "Clean & Free"
    case "in_use":
      return "In Use"
    case "needs_cleaning":
      return "Needs Cleaning"
    case "water_safe":
      return "Water Safe"
    case "check_quality":
      return "Check Quality"
    case "water_unsafe":
      return "Water Unsafe"
    case "bin_empty":
      return "Bin Empty"
    case "filling_up":
      return "Filling Up"
    case "bin_full":
      return "Bin Full"
    case "available_now":
      return "Available Now"
    case "on_route":
      return "On Route"
    case "emergency_busy":
      return "Emergency Busy"
    case "available":
      return "Available"
    case "assigned_task":
      return "Assigned Task"
    case "off_duty":
      return "Off Duty"
    default:
      return "Unknown"
  }
}

export const getDeviceTypeLabel = (type: DeviceType): string => {
  switch (type) {
    case "toilet":
      return "Toilet"
    case "water_kiosk":
      return "Water Kiosk"
    case "waste_bin":
      return "Waste Bin"
    case "mmu":
      return "Medical Mobile Unit"
    case "volunteer":
      return "Volunteer"
    default:
      return "Device"
  }
}
