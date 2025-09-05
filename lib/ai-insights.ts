"use client"

import type { IoTDevice } from "./types"

export interface AIInsight {
  id: string
  type: "prediction" | "recommendation" | "alert" | "forecast"
  priority: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  deviceId?: string
  location?: string
  confidence: number
  timeframe: string
  actionRequired?: string
  assignedTo?: string
}

export interface TaskAssignment {
  id: string
  type: "cleaning" | "water_test" | "medical" | "maintenance"
  deviceId: string
  device: IoTDevice
  assignedTo: "sweeper" | "volunteer" | "mmu" | "admin"
  priority: "low" | "medium" | "high" | "critical"
  description: string
  aiReasoning: string
  estimatedTime: number // minutes
  location: string
  createdAt: Date
  status: "pending" | "assigned" | "in_progress" | "completed"
}

class AIInsightsService {
  private insights: AIInsight[] = []
  private assignments: TaskAssignment[] = []
  private listeners: Set<() => void> = new Set()

  constructor() {
    this.generateInitialInsights()
  }

  private generateInitialInsights() {
    // This simulates AI-generated insights
    // In production, this would connect to Vercel AI/Gemini
    this.insights = [
      {
        id: "insight_001",
        type: "prediction",
        priority: "high",
        title: "Toilet Usage Surge Predicted",
        description: "5 toilets near Ram Ghat expected to reach capacity in next 30 minutes",
        confidence: 0.87,
        timeframe: "Next 30 minutes",
        actionRequired: "Deploy cleaning teams proactively",
      },
      {
        id: "insight_002",
        type: "alert",
        priority: "critical",
        title: "Water Quality Degradation Risk",
        description: "3 water kiosks showing declining chlorine levels, unsafe conditions likely",
        confidence: 0.92,
        timeframe: "Next 15 minutes",
        actionRequired: "Immediate water quality testing required",
      },
      {
        id: "insight_003",
        type: "forecast",
        priority: "medium",
        title: "Waste Overflow Risk",
        description: "7 bins in high-traffic areas approaching 85% capacity",
        confidence: 0.78,
        timeframe: "Next 45 minutes",
        actionRequired: "Schedule emptying operations",
      },
      {
        id: "insight_004",
        type: "recommendation",
        priority: "high",
        title: "MMU Redistribution Needed",
        description: "Crowd density analysis suggests repositioning 2 MMUs to Mahakaleshwar area",
        confidence: 0.83,
        timeframe: "Next hour",
        actionRequired: "Coordinate MMU movement",
      },
    ]
  }

  generateAIInsights(devices: IoTDevice[]): AIInsight[] {
    const newInsights: AIInsight[] = []

    // Toilet capacity predictions
    const toilets = devices.filter((d) => d.type === "toilet")
    const highUsageToilets = toilets.filter((t) => t.metadata.usageCount && t.metadata.usageCount > 40).slice(0, 5)

    if (highUsageToilets.length > 0) {
      newInsights.push({
        id: `ai_toilet_${Date.now()}`,
        type: "prediction",
        priority: "high",
        title: `${highUsageToilets.length} Toilets Predicted to Need Cleaning`,
        description: `AI analysis indicates these toilets will reach capacity soon: ${highUsageToilets.map((t) => t.location.area).join(", ")}`,
        confidence: 0.85 + Math.random() * 0.1,
        timeframe: "Next 20-40 minutes",
        actionRequired: "Deploy cleaning teams",
      })
    }

    // Water quality predictions
    const waterKiosks = devices.filter((d) => d.type === "water_kiosk")
    const riskKiosks = waterKiosks.filter((k) => k.metadata.chlorineLevel && k.metadata.chlorineLevel < 1.0).slice(0, 5)

    if (riskKiosks.length > 0) {
      newInsights.push({
        id: `ai_water_${Date.now()}`,
        type: "alert",
        priority: "critical",
        title: `${riskKiosks.length} Water Kiosks at Risk`,
        description: `Low chlorine levels detected, potential unsafe conditions developing`,
        confidence: 0.9 + Math.random() * 0.08,
        timeframe: "Next 10-30 minutes",
        actionRequired: "Immediate water testing required",
      })
    }

    // Waste bin overflow predictions
    const wasteBins = devices.filter((d) => d.type === "waste_bin")
    const nearFullBins = wasteBins.filter((b) => b.metadata.fillLevel && b.metadata.fillLevel > 75).slice(0, 5)

    if (nearFullBins.length > 0) {
      newInsights.push({
        id: `ai_waste_${Date.now()}`,
        type: "forecast",
        priority: "medium",
        title: `${nearFullBins.length} Bins Approaching Capacity`,
        description: `Predictive analysis shows overflow risk in high-traffic areas`,
        confidence: 0.82 + Math.random() * 0.12,
        timeframe: "Next 30-60 minutes",
        actionRequired: "Schedule emptying operations",
      })
    }

    // MMU emergency forecasting
    const mmus = devices.filter((d) => d.type === "mmu")
    const busyMMUs = mmus.filter((m) => m.status === "emergency_busy").length
    const availableMMUs = mmus.filter((m) => m.status === "available_now").length

    if (busyMMUs > availableMMUs) {
      newInsights.push({
        id: `ai_mmu_${Date.now()}`,
        type: "recommendation",
        priority: "high",
        title: "MMU Resource Strain Detected",
        description: `${busyMMUs} active emergencies with only ${availableMMUs} available units`,
        confidence: 0.95,
        timeframe: "Current",
        actionRequired: "Consider backup MMU deployment",
      })
    }

    return newInsights
  }

  generateTaskAssignments(devices: IoTDevice[]): TaskAssignment[] {
    const assignments: TaskAssignment[] = []

    devices.forEach((device) => {
      // Toilet cleaning assignments
      if (device.type === "toilet" && device.status === "needs_cleaning") {
        assignments.push({
          id: `task_${device.id}_${Date.now()}`,
          type: "cleaning",
          deviceId: device.id,
          device: device,
          assignedTo: "sweeper",
          priority: device.metadata.usageCount && device.metadata.usageCount > 45 ? "high" : "medium",
          description: `Clean and sanitize toilet facility`,
          aiReasoning: `Usage count: ${device.metadata.usageCount}, Status: ${device.status}`,
          estimatedTime: 15,
          location: device.location.area,
          createdAt: new Date(),
          status: "pending",
        })
      }

      // Waste bin emptying assignments
      if (device.type === "waste_bin" && device.status === "bin_full") {
        assignments.push({
          id: `task_${device.id}_${Date.now()}`,
          type: "cleaning",
          deviceId: device.id,
          device: device,
          assignedTo: "sweeper",
          priority: "high",
          description: `Empty waste bin and replace liner`,
          aiReasoning: `Fill level: ${device.metadata.fillLevel}%, Status: ${device.status}`,
          estimatedTime: 10,
          location: device.location.area,
          createdAt: new Date(),
          status: "pending",
        })
      }

      // Water quality testing assignments
      if (device.type === "water_kiosk" && (device.status === "water_unsafe" || device.status === "check_quality")) {
        assignments.push({
          id: `task_${device.id}_${Date.now()}`,
          type: "water_test",
          deviceId: device.id,
          device: device,
          assignedTo: "volunteer",
          priority: device.status === "water_unsafe" ? "critical" : "high",
          description: `Test water quality and take corrective action`,
          aiReasoning: `Chlorine: ${device.metadata.chlorineLevel?.toFixed(2)}mg/L, pH: ${device.metadata.phLevel?.toFixed(1)}`,
          estimatedTime: 20,
          location: device.location.area,
          createdAt: new Date(),
          status: "pending",
        })
      }

      // Medical emergency assignments
      if (device.type === "mmu" && device.status === "emergency_busy") {
        assignments.push({
          id: `task_${device.id}_${Date.now()}`,
          type: "medical",
          deviceId: device.id,
          device: device,
          assignedTo: "mmu",
          priority: "critical",
          description: `Respond to medical emergency`,
          aiReasoning: `Emergency: ${device.metadata.assignedEmergency}, Patients: ${device.metadata.patientCount}`,
          estimatedTime: 45,
          location: device.location.area,
          createdAt: new Date(),
          status: "in_progress",
        })
      }
    })

    return assignments
  }

  updateInsights(devices: IoTDevice[]) {
    this.insights = this.generateAIInsights(devices)
    this.assignments = this.generateTaskAssignments(devices)
    this.notifyListeners()
  }

  getInsights(): AIInsight[] {
    return [...this.insights]
  }

  getAssignments(): TaskAssignment[] {
    return [...this.assignments]
  }

  getInsightsByPriority(priority: AIInsight["priority"]): AIInsight[] {
    return this.insights.filter((insight) => insight.priority === priority)
  }

  getAssignmentsByRole(role: TaskAssignment["assignedTo"]): TaskAssignment[] {
    return this.assignments.filter((assignment) => assignment.assignedTo === role)
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener())
  }

  // Simulate Vercel AI integration (ready for Gemini)
  async generateAIRecommendation(context: string): Promise<string> {
    // This would integrate with Vercel AI in production
    // For now, simulate AI responses
    const responses = [
      "Based on crowd density patterns, recommend increasing cleaning frequency in high-traffic areas.",
      "Water quality trends suggest proactive testing every 2 hours during peak periods.",
      "MMU positioning analysis indicates optimal coverage with current deployment.",
      "Waste management efficiency can be improved by 23% with predictive emptying schedules.",
    ]

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return responses[Math.floor(Math.random() * responses.length)]
  }
}

// Singleton instance
let aiInsightsService: AIInsightsService | null = null

export const getAIInsightsService = (): AIInsightsService => {
  if (!aiInsightsService) {
    aiInsightsService = new AIInsightsService()
  }
  return aiInsightsService
}

export default AIInsightsService
