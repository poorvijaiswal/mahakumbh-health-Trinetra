"use client"

import type { IoTDevice, DeviceType, SimulationStats } from "./types"

// Mahakumbh Ujjain specific locations and areas
const MAHAKUMBH_AREAS = [
  "Ram Ghat",
  "Har Ki Pauri",
  "Triveni Sangam",
  "Mahakaleshwar Temple",
  "Kal Bhairav Temple",
  "Chintaman Ganesh",
  "Bade Ganeshji Ka Mandir",
  "Gopal Mandir",
  "Sandipani Ashram",
  "Ved Shala",
  "Shipra River Bank",
  "Kumbh Mela Ground",
  "Parking Area A",
  "Parking Area B",
  "Food Court",
  "Medical Camp",
  "Lost & Found",
  "Information Center",
  "Security Post",
  "VIP Area",
  "Press Area",
  "Volunteer Base",
  "Emergency Services",
]

// Generate realistic coordinates around Ujjain (23.1765° N, 75.7885° E)
const generateUjjainCoordinates = () => {
  const baseLatitude = 23.1765
  const baseLongitude = 75.7885
  const radius = 0.02 // Approximately 2km radius

  const lat = baseLatitude + (Math.random() - 0.5) * radius
  const lng = baseLongitude + (Math.random() - 0.5) * radius

  return { lat, lng }
}

class SimulationStore {
  private devices: Map<string, IoTDevice> = new Map()
  private listeners: Set<() => void> = new Set()
  private refreshInterval: NodeJS.Timeout | null = null
  private stats: SimulationStats = {
    totalDevices: 0,
    activeToilets: 0,
    unsafeWaterKiosks: 0,
    fullBins: 0,
    busyMMUs: 0,
    activeVolunteers: 0,
    lastRefresh: new Date(),
  }

  constructor() {
    this.initializeDevices()
    this.startAutoRefresh()
  }

  private initializeDevices() {
    // Generate 80 Toilets
    for (let i = 1; i <= 80; i++) {
      const coords = generateUjjainCoordinates()
      const device: IoTDevice = {
        id: `toilet_${i.toString().padStart(3, "0")}`,
        type: "toilet",
        name: `Toilet ${i} - ${MAHAKUMBH_AREAS[Math.floor(Math.random() * MAHAKUMBH_AREAS.length)]}`,
        status: this.getRandomToiletStatus(),
        location: {
          ...coords,
          area: MAHAKUMBH_AREAS[Math.floor(Math.random() * MAHAKUMBH_AREAS.length)],
        },
        lastUpdated: new Date(),
        metadata: {
          usageCount: Math.floor(Math.random() * 50),
          cleanedAt: new Date(Date.now() - Math.random() * 3600000), // Last hour
        },
      }
      this.devices.set(device.id, device)
    }

    // Generate 60 Water Kiosks
    for (let i = 1; i <= 60; i++) {
      const coords = generateUjjainCoordinates()
      const device: IoTDevice = {
        id: `water_${i.toString().padStart(3, "0")}`,
        type: "water_kiosk",
        name: `Water Kiosk ${i} - ${MAHAKUMBH_AREAS[Math.floor(Math.random() * MAHAKUMBH_AREAS.length)]}`,
        status: this.getRandomWaterStatus(),
        location: {
          ...coords,
          area: MAHAKUMBH_AREAS[Math.floor(Math.random() * MAHAKUMBH_AREAS.length)],
        },
        lastUpdated: new Date(),
        metadata: {
          chlorineLevel: Math.random() * 2 + 0.5, // 0.5-2.5 mg/L
          phLevel: Math.random() * 2 + 6.5, // 6.5-8.5 pH
          lastTested: new Date(Date.now() - Math.random() * 7200000), // Last 2 hours
        },
      }
      this.devices.set(device.id, device)
    }

    // Generate 70 Waste Bins
    for (let i = 1; i <= 70; i++) {
      const coords = generateUjjainCoordinates()
      const fillLevel = Math.floor(Math.random() * 100)
      const device: IoTDevice = {
        id: `bin_${i.toString().padStart(3, "0")}`,
        type: "waste_bin",
        name: `Waste Bin ${i} - ${MAHAKUMBH_AREAS[Math.floor(Math.random() * MAHAKUMBH_AREAS.length)]}`,
        status: this.getWasteBinStatus(fillLevel),
        location: {
          ...coords,
          area: MAHAKUMBH_AREAS[Math.floor(Math.random() * MAHAKUMBH_AREAS.length)],
        },
        lastUpdated: new Date(),
        metadata: {
          fillLevel,
          capacity: 100,
        },
      }
      this.devices.set(device.id, device)
    }

    // Generate 25 MMUs
    for (let i = 1; i <= 25; i++) {
      const coords = generateUjjainCoordinates()
      const device: IoTDevice = {
        id: `mmu_${i.toString().padStart(3, "0")}`,
        type: "mmu",
        name: `MMU ${i} - ${MAHAKUMBH_AREAS[Math.floor(Math.random() * MAHAKUMBH_AREAS.length)]}`,
        status: this.getRandomMMUStatus(),
        location: {
          ...coords,
          area: MAHAKUMBH_AREAS[Math.floor(Math.random() * MAHAKUMBH_AREAS.length)],
        },
        lastUpdated: new Date(),
        metadata: {
          patientCount: Math.floor(Math.random() * 5),
          assignedEmergency: Math.random() > 0.7 ? `Emergency_${Math.floor(Math.random() * 100)}` : undefined,
        },
      }
      this.devices.set(device.id, device)
    }

    // Generate 50 Volunteers
    for (let i = 1; i <= 50; i++) {
      const coords = generateUjjainCoordinates()
      const device: IoTDevice = {
        id: `volunteer_${i.toString().padStart(3, "0")}`,
        type: "volunteer",
        name: `Volunteer ${i} - ${MAHAKUMBH_AREAS[Math.floor(Math.random() * MAHAKUMBH_AREAS.length)]}`,
        status: this.getRandomVolunteerStatus(),
        location: {
          ...coords,
          area: MAHAKUMBH_AREAS[Math.floor(Math.random() * MAHAKUMBH_AREAS.length)],
        },
        lastUpdated: new Date(),
        metadata: {
          assignedTask: Math.random() > 0.6 ? "Water Quality Check" : undefined,
          taskLocation:
            Math.random() > 0.6 ? MAHAKUMBH_AREAS[Math.floor(Math.random() * MAHAKUMBH_AREAS.length)] : undefined,
        },
      }
      this.devices.set(device.id, device)
    }

    this.updateStats()
  }

  private getRandomToiletStatus() {
    const statuses = ["clean_free", "in_use", "needs_cleaning"]
    const weights = [0.6, 0.25, 0.15] // 60% clean, 25% in use, 15% needs cleaning
    return this.weightedRandom(statuses, weights) as any
  }

  private getRandomWaterStatus() {
    const statuses = ["water_safe", "check_quality", "water_unsafe"]
    const weights = [0.8, 0.15, 0.05] // 80% safe, 15% check, 5% unsafe
    return this.weightedRandom(statuses, weights) as any
  }

  private getWasteBinStatus(fillLevel: number) {
    if (fillLevel < 30) return "bin_empty"
    if (fillLevel < 80) return "filling_up"
    return "bin_full"
  }

  private getRandomMMUStatus() {
    const statuses = ["available_now", "on_route", "emergency_busy"]
    const weights = [0.7, 0.2, 0.1] // 70% available, 20% on route, 10% busy
    return this.weightedRandom(statuses, weights) as any
  }

  private getRandomVolunteerStatus() {
    const statuses = ["available", "assigned_task", "off_duty"]
    const weights = [0.5, 0.35, 0.15] // 50% available, 35% assigned, 15% off duty
    return this.weightedRandom(statuses, weights) as any
  }

  private weightedRandom(items: string[], weights: number[]) {
    const random = Math.random()
    let sum = 0
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i]
      if (random <= sum) return items[i]
    }
    return items[items.length - 1]
  }

  private updateStats() {
    const devices = Array.from(this.devices.values())

    this.stats = {
      totalDevices: devices.length,
      activeToilets: devices.filter((d) => d.type === "toilet" && d.status === "clean_free").length,
      unsafeWaterKiosks: devices.filter((d) => d.type === "water_kiosk" && d.status === "water_unsafe").length,
      fullBins: devices.filter((d) => d.type === "waste_bin" && d.status === "bin_full").length,
      busyMMUs: devices.filter((d) => d.type === "mmu" && d.status === "emergency_busy").length,
      activeVolunteers: devices.filter((d) => d.type === "volunteer" && d.status === "available").length,
      lastRefresh: new Date(),
    }
  }

  private simulateStatusUpdates() {
    const devices = Array.from(this.devices.values())

    // Update 10-15% of devices randomly
    const updateCount = Math.floor(devices.length * (0.1 + Math.random() * 0.05))

    for (let i = 0; i < updateCount; i++) {
      const randomDevice = devices[Math.floor(Math.random() * devices.length)]

      // Update status based on device type
      switch (randomDevice.type) {
        case "toilet":
          randomDevice.status = this.getRandomToiletStatus()
          if (randomDevice.metadata.usageCount !== undefined) {
            randomDevice.metadata.usageCount += Math.floor(Math.random() * 3)
          }
          break
        case "water_kiosk":
          randomDevice.status = this.getRandomWaterStatus()
          if (randomDevice.metadata.chlorineLevel !== undefined) {
            randomDevice.metadata.chlorineLevel = Math.max(
              0,
              randomDevice.metadata.chlorineLevel + (Math.random() - 0.5) * 0.2,
            )
          }
          break
        case "waste_bin":
          if (randomDevice.metadata.fillLevel !== undefined) {
            randomDevice.metadata.fillLevel = Math.min(
              100,
              randomDevice.metadata.fillLevel + Math.floor(Math.random() * 10),
            )
            randomDevice.status = this.getWasteBinStatus(randomDevice.metadata.fillLevel)
          }
          break
        case "mmu":
          randomDevice.status = this.getRandomMMUStatus()
          break
        case "volunteer":
          randomDevice.status = this.getRandomVolunteerStatus()
          break
      }

      randomDevice.lastUpdated = new Date()
      this.devices.set(randomDevice.id, randomDevice)
    }

    this.updateStats()
    this.notifyListeners()
  }

  private startAutoRefresh() {
    // Refresh every 20 seconds as specified
    this.refreshInterval = setInterval(() => {
      this.simulateStatusUpdates()
    }, 20000)
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())
  }

  // Public API
  getAllDevices(): IoTDevice[] {
    return Array.from(this.devices.values())
  }

  getDevicesByType(type: DeviceType): IoTDevice[] {
    return Array.from(this.devices.values()).filter((device) => device.type === type)
  }

  getDeviceById(id: string): IoTDevice | undefined {
    return this.devices.get(id)
  }

  getStats(): SimulationStats {
    return { ...this.stats }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  forceRefresh() {
    this.simulateStatusUpdates()
  }

  cleanup() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
    this.listeners.clear()
  }
}

// Singleton instance
let simulationStore: SimulationStore | null = null

export const getSimulationStore = (): SimulationStore => {
  if (!simulationStore) {
    simulationStore = new SimulationStore()
  }
  return simulationStore
}

export default SimulationStore
