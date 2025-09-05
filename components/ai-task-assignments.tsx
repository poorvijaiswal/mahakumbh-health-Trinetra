"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAIInsights } from "@/hooks/use-ai-insights"
import { getDeviceTypeIcon } from "@/lib/device-utils"
import type { TaskAssignment } from "@/lib/ai-insights"

interface AITaskAssignmentsProps {
  role?: TaskAssignment["assignedTo"]
  className?: string
  maxTasks?: number
}

function AITaskAssignments({ role, className = "", maxTasks = 10 }: AITaskAssignmentsProps) {
  const { assignments, isLoading } = useAIInsights()

  const getPriorityColor = (priority: TaskAssignment["priority"]) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: TaskAssignment["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-100 text-gray-800"
      case "assigned":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTaskTypeIcon = (type: TaskAssignment["type"]) => {
    switch (type) {
      case "cleaning":
        return "🧹"
      case "water_test":
        return "🧪"
      case "medical":
        return "🏥"
      case "maintenance":
        return "🔧"
      default:
        return "📋"
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>AI Task Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const filteredAssignments = role ? assignments.filter((a) => a.assignedTo === role) : assignments

  const displayAssignments = filteredAssignments.slice(0, maxTasks)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🤖 AI Task Assignments
          {role && <Badge variant="outline">{role}</Badge>}
          <Badge variant="secondary" className="text-xs">
            {filteredAssignments.length} tasks
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayAssignments.map((assignment) => (
            <div key={assignment.id} className="p-4 border rounded-lg bg-white hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getTaskTypeIcon(assignment.type)}</span>
                  <span className="text-lg">{getDeviceTypeIcon(assignment.device.type)}</span>
                  <div>
                    <div className="font-medium">{assignment.device.name}</div>
                    <div className="text-sm text-gray-600">{assignment.description}</div>
                    <div className="text-xs text-gray-500">📍 {assignment.location}</div>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <Badge className={getPriorityColor(assignment.priority)}>{assignment.priority}</Badge>
                  <Badge className={getStatusColor(assignment.status)}>{assignment.status}</Badge>
                </div>
              </div>

              <div className="bg-blue-50 p-2 rounded text-xs mb-3">
                <strong>AI Analysis:</strong> {assignment.aiReasoning}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Estimated time: {assignment.estimatedTime} minutes</span>
                <span>Assigned to: {assignment.assignedTo}</span>
              </div>

              {assignment.status === "pending" && (
                <div className="mt-3 flex gap-2">
                  <Button size="sm" className="flex-1">
                    Accept Task
                  </Button>
                  <Button size="sm" variant="outline">
                    Reassign
                  </Button>
                </div>
              )}
            </div>
          ))}

          {displayAssignments.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <div className="text-2xl mb-2">✅</div>
              <p>No AI-assigned tasks at this time</p>
              <p className="text-xs">Tasks will appear based on system analysis</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { AITaskAssignments }
export default AITaskAssignments
