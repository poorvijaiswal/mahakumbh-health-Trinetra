"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAIInsights, useAIRecommendations } from "@/hooks/use-ai-insights"
import type { AIInsight } from "@/lib/ai-insights"

interface AIInsightsPanelProps {
  className?: string
  maxInsights?: number
}

const AIInsightsPanel = ({ className = "", maxInsights = 5 }: AIInsightsPanelProps) => {
  const { insights, isLoading } = useAIInsights()
  const { recommendation, isGenerating, generateRecommendation } = useAIRecommendations()
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null)

  const getPriorityColor = (priority: AIInsight["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "prediction":
        return "🔮"
      case "recommendation":
        return "💡"
      case "alert":
        return "⚠️"
      case "forecast":
        return "📊"
      default:
        return "🤖"
    }
  }

  if (isLoading) {
    return (
      <Card className={`${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 AI Insights
            <Badge variant="outline" className="text-xs">
              Loading...
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const displayInsights = insights.slice(0, maxInsights)

  return (
    <Card className={`${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🤖 AI Insights & Predictions
          <Badge variant="outline" className="text-xs">
            Live Analysis
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${getPriorityColor(insight.priority)}`}
              onClick={() => setSelectedInsight(insight)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getTypeIcon(insight.type)}</span>
                  <span className="font-medium text-sm">{insight.title}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {Math.round(insight.confidence * 100)}%
                </Badge>
              </div>

              <p className="text-sm text-gray-600 mb-2">{insight.description}</p>

              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">{insight.timeframe}</span>
                <Badge variant="secondary" className="text-xs">
                  {insight.type}
                </Badge>
              </div>

              {insight.actionRequired && (
                <div className="mt-2 p-2 bg-white/50 rounded text-xs">
                  <strong>Action:</strong> {insight.actionRequired}
                </div>
              )}
            </div>
          ))}

          {displayInsights.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <div className="text-2xl mb-2">🤖</div>
              <p>AI analysis in progress...</p>
              <p className="text-xs">Insights will appear as data is processed</p>
            </div>
          )}
        </div>

        {/* AI Recommendation Generator */}
        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium">🧠 AI Recommendation Engine</span>
            
          </div>

          <Button
            onClick={() => generateRecommendation("Current system status and optimization opportunities")}
            disabled={isGenerating}
            className="w-full mb-3"
            variant="outline"
          >
            {isGenerating ? "Generating..." : "Get AI Recommendation"}
          </Button>

          {recommendation && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-blue-600">💡</span>
                <span className="text-sm font-medium text-blue-800">AI Recommendation</span>
              </div>
              <p className="text-sm text-blue-700">{recommendation}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { AIInsightsPanel }
export default AIInsightsPanel
