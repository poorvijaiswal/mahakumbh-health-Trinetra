"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useSimulationData } from "@/hooks/use-simulation-data"
import MahakumbhHeader from "@/components/mahakumbh-header"
import FestivalCard from "@/components/festival-card"

export default function HomePage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [language, setLanguage] = useState<"english" | "hindi">("english")
  const { stats, isLoading } = useSimulationData()

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "english" ? "hindi" : "english"))
  }

  const getText = (englishText: string, hindiText: string) => {
    return language === "english" ? englishText : hindiText
  }

  const roles = [
    {
      id: "admin",
      title: "Admin Dashboard",
      titleHindi: "प्रशासक डैशबोर्ड",
      description: "Complete system control and monitoring",
      descriptionHindi: "संपूर्ण सिस्टम नियंत्रण और निगरानी",
      route: "/admin-dashboard",
      color: "mahakumbh-button",
      icon: "🏛️",
    },
    {
      id: "volunteer",
      title: "Volunteer Dashboard",
      titleHindi: "स्वयंसेवक डैशबोर्ड",
      description: "Task management and field operations",
      descriptionHindi: "कार्य प्रबंधन और क्षेत्रीय संचालन",
      route: "/volunteer-dashboard",
      color: "teal-button",
      icon: "🙋‍♀️",
    },
    {
      id: "mmu",
      title: "MMU Dashboard",
      titleHindi: "चिकित्सा इकाई डैशबोर्ड",
      description: "Medical mobile unit operations",
      descriptionHindi: "मोबाइल चिकित्सा इकाई संचालन",
      route: "/mmu-dashboard",
      color:
        "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg",
      icon: "🚑",
    },
    {
      id: "sweeper",
      title: "Sweeper Dashboard",
      titleHindi: "सफाई कर्मचारी डैशबोर्ड",
      description: "Sanitation and cleaning tasks",
      descriptionHindi: "स्वच्छता और सफाई कार्य",
      route: "/sweeper-dashboard",
      color:
        "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-medium px-6 py-3 rounded-lg shadow-lg",
      icon: "🧹",
    },
    {
      id: "citizen",
      title: "Citizen Dashboard",
      titleHindi: "नागरिक डैशबोर्ड",
      description: "Public information and services",
      descriptionHindi: "सार्वजनिक जानकारी और सेवाएं",
      route: "/citizen-dashboard",
      color: "river-blue-button",
      icon: "👥",
    },
  ]

  const handleRoleSelect = (role: (typeof roles)[0]) => {
    setSelectedRole(role.id)
    localStorage.setItem("userRole", role.id)
    localStorage.setItem("userName", `${role.title.split(" ")[0]} User`)
    router.push(role.route)
  }

  return (
    <div className="min-h-screen">
      <nav className="bg-amber-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center bg-amber-800">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🕉️</div>
            <div>
              <h1 className="text-xl font-bold">TRINETRA</h1>
              <p className="text-sm opacity-80">{getText("Mahakumbh Health Monitor", "महाकुंभ स्वास्थ्य निगरानी")}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.push("/map")}
              variant="outline"
              className="text-white hover:bg-white hover:text-orange-600 bg-lime-500 border-amber-200"
            >
              🗺️ {getText("Live Map", "लाइव मैप")}
            </Button>

            <Button
              onClick={() => router.push("/analytics")}
              variant="outline"
              className="text-white hover:bg-white hover:text-orange-600 border-amber-200 bg-red-600"
            >
              📊 {getText("Analytics", "विश्लेषण")}
            </Button>

            {/* Language Toggle Button */}
            <Button
              onClick={toggleLanguage}
              variant="outline"
              className="text-white hover:bg-white hover:text-orange-600 flex items-center gap-2 bg-transparent border-amber-200"
              title={getText("Switch to Hindi", "Switch to English")}
            >
              🌐 {language === "english" ? "हिं" : "EN"}
            </Button>
          </div>
        </div>
      </nav>

      {/* Enhanced Mahakumbh Header
      <MahakumbhHeader
        title={getText(
          "AI-Powered Health & Sanitation Monitoring System",
          "एआई-संचालित स्वास्थ्य और स्वच्छता निगरानी प्रणाली",
        )}
        subtitle={getText("Real-time monitoring for millions of devotees", "लाखों श्रद्धालुओं के लिए रियल-टाइम निगरानी")}
      /> */}

      {/* Hero Section */}
      <section
        className="w-full relative min-h-[500px] flex items-center"
        style={{
          backgroundImage: "url('/image.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for readability */}
        <div className="absolute inset-0  bg-opacity-60 z-10"></div>
        <div className="relative z-20 w-full">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800 text-balance mb-2">
                  {getText("Real-Time Monitoring for Millions of Devotees", "लाखों श्रद्धालुओं के लिए रियल-टाइम निगरानी")}
                </h2>
              </div>

              <div className="max-w-3xl mx-auto mb-6">
                <p className="text-lg text-gray-600 text-balance">
                  {getText(
                    "Advanced IoT sensors and AI analytics ensuring health, safety, and sanitation across the sacred grounds of Mahakumbh.",
                    "महाकुंभ के पवित्र क्षेत्र में स्वास्थ्य, सुरक्षा और स्वच्छता सुनिश्चित करने वाले उन्नत IoT सेंसर और AI विश्लेषण।",
                  )}
                </p>
              </div>

              <div className="mt-6">
                <Button onClick={() => router.push("/map")} className="mahakumbh-button">
                  <span className="flex items-center gap-2">
                    🗺️
                    <span>{getText("View Live Map", "लाइव मैप देखें")}</span>
                  </span>
                </Button>
              </div>
            </div>

            {/* Enhanced Live Stats with Festival Theming */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <Card className="festival-card text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl mb-1">🚻</div>
                  <div className="text-2xl font-bold text-green-600">{isLoading ? "..." : stats?.activeToilets || 0}</div>
                  <div className="text-sm text-gray-600">{getText("Active Toilets", "सक्रिय शौचालय")}</div>
                </CardContent>
              </Card>

              <Card className="festival-card text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl mb-1">💧</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {isLoading ? "..." : (stats?.totalDevices || 0) - (stats?.unsafeWaterKiosks || 0)}
                  </div>
                  <div className="text-sm text-gray-600">{getText("Safe Water Kiosks", "सुरक्षित जल केंद्र")}</div>
                </CardContent>
              </Card>

              <Card className="festival-card text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl mb-1">🗑️</div>
                  <div className="text-2xl font-bold text-orange-600">{isLoading ? "..." : stats?.fullBins || 0}</div>
                  <div className="text-sm text-gray-600">{getText("Full Waste Bins", "भरे कूड़ेदान")}</div>
                </CardContent>
              </Card>

              <Card className="festival-card text-center">
                <CardContent className="pt-6">
                  <div className="text-2xl mb-1">🚑</div>
                  <div className="text-2xl font-bold text-red-600">{isLoading ? "..." : stats?.busyMMUs || 0}</div>
                  <div className="text-sm text-gray-600">{getText("Active MMUs", "सक्रिय चिकित्सा इकाई")}</div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Role Selection */}
            <div className="max-w-4xl mx-auto">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-800">{getText("Select Your Role", "अपनी भूमिका चुनें")}</h3>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <FestivalCard
                    key={role.id}
                    title={getText(role.title, role.titleHindi)}
                    titleHindi=""
                    description={getText(role.description, role.descriptionHindi)}
                    descriptionHindi=""
                    icon={role.icon}
                    onClick={() => handleRoleSelect(role)}
                  >
                    <Button className={role.color}>
                      <span>{getText("Access Dashboard", "डैशबोर्ड एक्सेस करें")}</span>
                    </Button>
                  </FestivalCard>
                ))}
              </div>
            </div>

            {/* Enhanced Emergency Contact */}
            <div className="mt-12 text-center">
              <Card className="max-w-md mx-auto bg-red-50 border-red-200 festival-card">
                <CardContent className="pt-6">
                  <div className="text-3xl mb-2 pulse-sacred">🚨</div>
                  <div className="mb-3">
                    <h4 className="text-red-700 font-semibold">{getText("Emergency Contact", "आपातकालीन संपर्क")}</h4>
                  </div>
                  <p className="text-red-600 font-semibold text-2xl mb-2">108</p>
                  <div>
                    <p className="text-sm text-red-500">
                      {getText("24/7 Medical Emergency Helpline", "24/7 चिकित्सा आपातकालीन हेल्पलाइन")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-2">
            <p className="text-sm opacity-80">
              {getText(
                "© 2025 TRINETRA - Mahakumbh Ujjain Health Monitoring System",
                "© २०२५ त्रिनेत्र - महाकुंभ उज्जैन स्वास्थ्य निगरानी प्रणाली",
              )}
            </p>
          </div>
          <div>
            <p className="text-xs opacity-60">
              {getText(
                "Powered by AI & IoT Technology for Public Health & Safety",
                "सार्वजनिक स्वास्थ्य और सुरक्षा के लिए AI और IoT तकनीक द्वारा संचालित",
              )}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
