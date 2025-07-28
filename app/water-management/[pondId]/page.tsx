"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Droplet, Thermometer, Fan } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const dummyPondData = {
  "pond-a": {
    temperature: 26.3,
    pH: 7.1,
    waterLevel: 82,
    airQuality: "Normal"
  },
  "pond-b": {
    temperature: 28.5,
    pH: 6.7,
    waterLevel: 65,
    airQuality: "Moderate"
  },
  "pond-c": {
    temperature: 25.4,
    pH: 7.5,
    waterLevel: 90,
    airQuality: "Excellent"
  }
}

export default function WaterManagementPage() {
  const { pondId } = useParams()
  const router = useRouter()

  const pondKey = typeof pondId === "string" ? pondId : Array.isArray(pondId) ? pondId[0] : ""
  const pondData = dummyPondData[pondKey as keyof typeof dummyPondData]

  if (!pondData) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">Pond not found</h1>
        <p className="text-gray-600">Make sure the pond ID exists in dummy data.</p>
        <Button onClick={() => router.push("/")}>Go Back</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-6 pt-12 md:hidden">
        <h1 className="text-3xl font-bold text-white capitalize">{pondKey} - Water Management</h1>
      </header>

      <header className="hidden md:block p-6">
        <h1 className="text-3xl font-bold text-white capitalize">{pondKey} - Water Management</h1>
        <p className="text-gray-200 dark:text-gray-400 mt-1">Monitor and control water quality</p>
      </header>

      <main className="flex-1 px-4 pb-20 md:pb-6 space-y-6 md:px-6 md:max-w-none md:mx-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-3xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Temperature</CardTitle>
                  <CardDescription>Current water temperature</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-4">
                  <Thermometer className="w-10 h-10 mb-2 text-teal-700" />
                  <span className="text-4xl font-bold">{pondData.temperature}°C</span>
                  <span className="text-sm text-gray-500">Optimal: 25–35°C</span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>pH Level</CardTitle>
                  <CardDescription>Current pH value</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-4">
                  <Droplet className="w-10 h-10 mb-2 text-teal-700" />
                  <span className="text-4xl font-bold">{pondData.pH.toFixed(1)}</span>
                  <span className="text-sm text-gray-500">Optimal: 6.5–8.0</span>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Air Quality</CardTitle>
                  <CardDescription>Environment around pond</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center py-4">
                  <Fan className="w-10 h-10 mb-2 text-teal-700" />
                  <span className="text-2xl font-semibold">{pondData.airQuality}</span>
                  <span className="text-sm text-gray-500">Oxygen level status</span>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Water Level</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between mb-2 text-sm font-medium">
                  <span>Current Level</span>
                  <span>{pondData.waterLevel}%</span>
                </div>
                <Progress value={pondData.waterLevel} className="h-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Button className="bg-teal-700 text-white w-full">Start Water Change</Button>
                  <Button variant="outline" className="w-full">View Water Change History</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Water Change History</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
                {/* Dummy history logs */}
                <ul className="space-y-2">
                  <li>May 29, 2025 – Auto water change (30%)</li>
                  <li>May 27, 2025 – Manual water change (50%)</li>
                  <li>May 25, 2025 – Auto water change (40%)</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Water automation configuration will go here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
