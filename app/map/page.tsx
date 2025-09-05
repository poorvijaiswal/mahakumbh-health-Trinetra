"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import LiveMap from "@/components/live-map"

export default function MapPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    const role = localStorage.getItem("userRole")
    const name = localStorage.getItem("userName")

    if (!role) {
      router.push("/")
      return
    }

    setUserRole(role)
    setUserName(name || "User")
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    router.push("/")
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-orange-600"
      case "volunteer":
        return "bg-teal-600"
      case "mmu":
        return "bg-red-600"
      case "sweeper":
        return "bg-green-600"
      case "citizen":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className={`${getRoleColor(userRole)} text-white shadow-lg`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">TRINETRA - Live Map</h1>
            <p className="text-sm opacity-80">Welcome, {userName}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.back()}
              variant="outline"
              className={`text-${userRole === "admin" ? "orange" : userRole === "volunteer" ? "teal" : userRole === "mmu" ? "red" : userRole === "sweeper" ? "green" : "blue"}-600 border-white hover:bg-white`}
            >
              Back to Dashboard
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className={`text-${userRole === "admin" ? "orange" : userRole === "volunteer" ? "teal" : userRole === "mmu" ? "red" : userRole === "sweeper" ? "green" : "blue"}-600 border-white hover:bg-white`}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Map Content */}
      <div className="container mx-auto px-4 py-8">
        <LiveMap />
      </div>
    </div>
  )
}
