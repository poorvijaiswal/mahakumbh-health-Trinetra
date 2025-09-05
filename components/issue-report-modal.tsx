"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface IssueReportModalProps {
  isOpen: boolean
  onClose: () => void
  issueType: "emergency" | "toilet" | "water" | null
}

export default function IssueReportModal({ isOpen, onClose, issueType }: IssueReportModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    location: "",
    description: "",
    severity: "medium",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const getIssueConfig = () => {
    switch (issueType) {
      case "emergency":
        return {
          title: "Report Emergency",
          titleHindi: "आपातकाल की रिपोर्ट करें",
          icon: "🚨",
          color: "text-red-700",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        }
      case "toilet":
        return {
          title: "Report Toilet Issue",
          titleHindi: "शौचालय की समस्या रिपोर्ट करें",
          icon: "🚽",
          color: "text-orange-700",
          bgColor: "bg-orange-50",
          borderColor: "border-orange-200",
        }
      case "water":
        return {
          title: "Report Water Problem",
          titleHindi: "पानी की समस्या रिपोर्ट करें",
          icon: "💧",
          color: "text-blue-700",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
        }
      default:
        return {
          title: "Report Issue",
          titleHindi: "समस्या रिपोर्ट करें",
          icon: "📋",
          color: "text-gray-700",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Auto close after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      onClose()
      setFormData({ name: "", phone: "", location: "", description: "", severity: "medium" })
    }, 3000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  const config = getIssueConfig()

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-green-700 mb-2">Report Submitted Successfully!</h3>
            <p className="text-sm text-gray-600 mb-2">रिपोर्ट सफलतापूर्वक जमा की गई!</p>
            <p className="text-sm text-gray-500">
              Your report has been forwarded to the appropriate team. You will receive updates on your registered phone
              number.
            </p>
            <Badge className="mt-3 bg-green-100 text-green-800">Report ID: TR-{Date.now().toString().slice(-6)}</Badge>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className={`w-full max-w-md ${config.bgColor} ${config.borderColor}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${config.color}`}>
            <span className="text-2xl">{config.icon}</span>
            <div>
              <div>{config.title}</div>
              <div className="text-sm font-normal opacity-80">{config.titleHindi}</div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name / नाम <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your name / अपना नाम दर्ज करें"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number / फोन नंबर <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter phone number / फोन नंबर दर्ज करें"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location / स्थान <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select location / स्थान चुनें</option>
                <option value="Ram Ghat">Ram Ghat / राम घाट</option>
                <option value="Triveni Sangam">Triveni Sangam / त्रिवेणी संगम</option>
                <option value="Mahakal Temple">Mahakal Temple / महाकाल मंदिर</option>
                <option value="Kshipra Ghat">Kshipra Ghat / क्षिप्रा घाट</option>
                <option value="Parking Area A">Parking Area A / पार्किंग क्षेत्र A</option>
                <option value="Food Court">Food Court / फूड कोर्ट</option>
                <option value="Medical Camp">Medical Camp / चिकित्सा शिविर</option>
                <option value="Other">Other / अन्य</option>
              </select>
            </div>

            {issueType !== "emergency" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Severity / गंभीरता</label>
                <select
                  value={formData.severity}
                  onChange={(e) => handleInputChange("severity", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="low">Low / कम</option>
                  <option value="medium">Medium / मध्यम</option>
                  <option value="high">High / उच्च</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description / विवरण <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the issue in detail / समस्या का विस्तृत विवरण दें"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
                disabled={isSubmitting}
              >
                Cancel / रद्द करें
              </Button>
              <Button
                type="submit"
                className={`flex-1 ${
                  issueType === "emergency"
                    ? "bg-red-600 hover:bg-red-700"
                    : issueType === "toilet"
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting... / जमा कर रहे हैं..." : "Submit Report / रिपोर्ट जमा करें"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
