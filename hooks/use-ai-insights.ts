"use client"

import { useState, useEffect } from "react"
import { getAIInsightsService } from "@/lib/ai-insights"
import { useSimulationData } from "./use-simulation-data"
import type { AIInsight, TaskAssignment } from "@/lib/ai-insights"

export function useAIInsights() {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [assignments, setAssignments] = useState<TaskAssignment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { devices } = useSimulationData()

  useEffect(() => {
    const aiService = getAIInsightsService()

    // Initial load
    setInsights(aiService.getInsights())
    setAssignments(aiService.getAssignments())
    setIsLoading(false)

    // Subscribe to updates
    const unsubscribe = aiService.subscribe(() => {
      setInsights(aiService.getInsights())
      setAssignments(aiService.getAssignments())
    })

    return unsubscribe
  }, [])

  // Update AI insights when device data changes
  useEffect(() => {
    if (devices.length > 0) {
      const aiService = getAIInsightsService()
      aiService.updateInsights(devices)
    }
  }, [devices])

  return {
    insights,
    assignments,
    isLoading,
    getInsightsByPriority: (priority: AIInsight["priority"]) =>
      insights.filter((insight) => insight.priority === priority),
    getAssignmentsByRole: (role: TaskAssignment["assignedTo"]) =>
      assignments.filter((assignment) => assignment.assignedTo === role),
  }
}

export function useAIRecommendations() {
  const [recommendation, setRecommendation] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateRecommendation = async (context: string) => {
    setIsGenerating(true)
    try {
      const aiService = getAIInsightsService()
      const result = await aiService.generateAIRecommendation(context)
      setRecommendation(result)
    } catch (error) {
      console.error("Failed to generate AI recommendation:", error)
      setRecommendation("Unable to generate recommendation at this time.")
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    recommendation,
    isGenerating,
    generateRecommendation,
  }
}
