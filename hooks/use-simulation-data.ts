"use client"

import { useState, useEffect } from "react"
import { getSimulationStore } from "@/lib/simulation-store"
import type { IoTDevice, DeviceType, SimulationStats } from "@/lib/types"

export function useSimulationData() {
  const [devices, setDevices] = useState<IoTDevice[]>([])
  const [stats, setStats] = useState<SimulationStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const store = getSimulationStore()

    // Initial load
    setDevices(store.getAllDevices())
    setStats(store.getStats())
    setIsLoading(false)

    // Subscribe to updates
    const unsubscribe = store.subscribe(() => {
      setDevices(store.getAllDevices())
      setStats(store.getStats())
    })

    return unsubscribe
  }, [])

  return {
    devices,
    stats,
    isLoading,
    forceRefresh: () => getSimulationStore().forceRefresh(),
  }
}

export function useDevicesByType(type: DeviceType) {
  const [devices, setDevices] = useState<IoTDevice[]>([])

  useEffect(() => {
    const store = getSimulationStore()

    // Initial load
    setDevices(store.getDevicesByType(type))

    // Subscribe to updates
    const unsubscribe = store.subscribe(() => {
      setDevices(store.getDevicesByType(type))
    })

    return unsubscribe
  }, [type])

  return devices
}

export function useDevice(deviceId: string) {
  const [device, setDevice] = useState<IoTDevice | null>(null)

  useEffect(() => {
    const store = getSimulationStore()

    // Initial load
    setDevice(store.getDeviceById(deviceId) || null)

    // Subscribe to updates
    const unsubscribe = store.subscribe(() => {
      setDevice(store.getDeviceById(deviceId) || null)
    })

    return unsubscribe
  }, [deviceId])

  return device
}
