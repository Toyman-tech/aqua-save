import { Thermometer, Droplet, Fan, Plus, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// This would normally come from your API
const mockPonds = [
  {
    id: "pond-a",
    name: "Pond A",
    status: "active" as const,
    data: {
      temperature: 26.5,
      ph: 7.4,
      airQuality: "Normal",
      waterLevel: 80,
      lastWaterChanged: "1 hour ago",
      lastFed: "2 hours ago",
      alerts: 0,
    },
  },
  {
    id: "pond-b",
    name: "Pond B",
    status: "active" as const,
    data: {
      temperature: 25.8,
      ph: 7.2,
      airQuality: "Good",
      waterLevel: 75,
      lastWaterChanged: "3 hours ago",
      lastFed: "1 hour ago",
      alerts: 0,
    },
  },
  {
    id: "pond-c",
    name: "Pond C",
    status: "maintenance" as const,
    data: {
      temperature: 24.2,
      ph: 6.8,
      airQuality: "Normal",
      waterLevel: 60,
      lastWaterChanged: "2 hours ago",
      lastFed: "4 hours ago",
      alerts: 1,
    },
  },
]

export default function Dashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "maintenance":
        return "bg-yellow-500"
      case "inactive":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active"
      case "maintenance":
        return "Maintenance"
      case "inactive":
        return "Inactive"
      default:
        return "Unknown"
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-6 pt-12">
        <h1 className="text-3xl font-bold text-white">Pond Overview</h1>
        <p className="text-white/80 mt-1">Monitor all your aquaculture ponds</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-20 md:pb-6 space-y-6 md:px-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 md:grid-cols-3 gap-4">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-800 dark:text-teal-400">
                  {mockPonds.filter((p) => p.status === "active").length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Active Ponds</div>
              </div>
            </CardContent>
          </Card>

          {/* <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-800 dark:text-teal-400">
                  {mockPonds.reduce((sum, pond) => sum + pond.data.fishCount, 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Fish</div>
              </div>
            </CardContent>
          </Card> */}

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  {mockPonds.reduce((sum, pond) => sum + pond.data.alerts, 0)}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Alerts</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-800 dark:text-teal-400">
                  {Math.round(mockPonds.reduce((sum, pond) => sum + pond.data.waterLevel, 0) / mockPonds.length)}%
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Avg Water Level</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pond Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Your Ponds</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockPonds.map((pond) => (
              <Card
                key={pond.id}
                className="bg-white dark:bg-gray-800 border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">{pond.name}</CardTitle>
                    <div className="flex items-center space-x-2">
                      {pond.data.alerts > 0 && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(pond.status)}`} />
                    </div>
                  </div>
                  <CardDescription>{getStatusText(pond.status)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <Thermometer className="w-4 h-4 text-teal-600 dark:text-teal-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">{pond.data.temperature}°C</span>
                    </div>
                    <div className="flex items-center">
                      <Droplet className="w-4 h-4 text-teal-600 dark:text-teal-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">pH {pond.data.ph}</span>
                    </div>
                    <div className="flex items-center">
                      <Fan className="w-4 h-4 text-teal-600 dark:text-teal-400 mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">{pond.data.airQuality}</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-4 h-4 bg-teal-600 dark:bg-teal-400 rounded mr-2" />
                      <span className="text-gray-600 dark:text-gray-400">{pond.data.waterLevel}%</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Last Water change:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{pond.data.lastWaterChanged}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-500 dark:text-gray-400">Last Fed:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{pond.data.lastFed}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-teal-800 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600"
                    asChild
                  >
                    <Link href={`/${pond.id}/water-management/`}>Manage Pond</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
