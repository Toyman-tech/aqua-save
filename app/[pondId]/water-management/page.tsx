"use client"

import { Droplet, Thermometer, Fan } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PondHeader } from "@/components/pond-header"
import { use, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { Progress } from "@/components/ui/progress"
import { getPondById } from "@/lib/pondData"

export default function WaterManagement({ params }: { params: Promise<{ pondId: string }> }) {
  const {pondId} = use(params)
  const [isChanging, setIsChanging] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [dummyWaterLevel, setDummyWaterLevel] = useState(85)
  const [history, setHistory] = useState([
    { type: "Automatic", percent: 30, time: "Today, 6:30 AM" },
    { type: "Manual", percent: 50, time: "Yesterday, 4:15 PM" },
    { type: "Automatic", percent: 25, time: "July 20, 2025, 10:00 AM" },
  ])

  const pondData = getPondById(pondId)?.data || {
    temperature: 0,
    ph: 7.0,
    airQuality: "Unknown",
    waterLevel: 0,
    lastWaterChanged:'',
    history: [],
  }

  const handleWaterChange = async () => {
    try {
      setIsChanging(true)
      toast.success(`🚰 Water change initiated for ${pondId}`)

      toast.success("🚰 Draining water started")

      for (let level = 85; level >= 1; level--) {
        setDummyWaterLevel(level)
        await new Promise((res) => setTimeout(res, 200))
      }
      toast.success(`🧯 Draining completed for ${pondId}. Pumping in clean water...`)

      for (let level = 1; level <= 85; level++) {
        setDummyWaterLevel(level)
        await new Promise((res) => setTimeout(res, 200))
      }
      toast.success(`✅ Water change completed for ${pondId}`)
      pondData.lastWaterChanged = "Just now"
      const newEntry = {
        type: "Automatic",
        percent: 85,
        time: new Date().toLocaleString(),
      }
      setHistory((prev) => [newEntry, ...prev.slice(0, 4)])
    } catch {
      toast.error(`⚠️ Failed to simulate water change for ${pondId}`)
    } finally {
      setIsChanging(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <PondHeader title="Water Management" description="Monitor and control water quality" />
      <main className="flex-1 px-4 pb-20 md:pb-6 space-y-6 md:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Temperature</CardTitle>
                  <CardDescription>Current water temperature</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-4">
                    <Thermometer className="w-12 h-12 text-teal-800 dark:text-teal-400 mb-2" />
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {pondData.temperature.toFixed(1)}°C
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Optimal: 25-28°C</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">pH Level</CardTitle>
                  <CardDescription>Current water pH</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-4">
                    <Droplet className="w-12 h-12 text-teal-800 dark:text-teal-400 mb-2" />
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {pondData.ph.toFixed(1)}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Optimal: 6.5-8.0</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Air Quality</CardTitle>
                  <CardDescription>Current air quality</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-4">
                    <Fan className="w-12 h-12 text-teal-800 dark:text-teal-400 mb-2" />
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {pondData.airQuality}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Oxygen level stable</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Water Level</CardTitle>
                <CardDescription>Current pond water level</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">Current Level</span>
                      <span className="text-gray-900 dark:text-white font-bold">
                        {dummyWaterLevel.toFixed(1)}%
                      </span>
                    </div>
                    <Progress value={dummyWaterLevel} className="h-4 bg-gray-200 dark:bg-gray-700 text-teal-900/30 " />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Button onClick={handleWaterChange} disabled={isChanging} className={`w-full py-3 rounded-md font-medium text-white ${isChanging ? "bg-gray-500 cursor-not-allowed" : "bg-teal-800 hover:bg-teal-700"}`}>
                      {isChanging ? "Changing..." : "Start Water Change"}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setActiveTab("history")}>View Water Change History</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Water Change History</CardTitle>
                <CardDescription>Recent water changes for this pond</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {history.map((entry, i) => (
                    <div key={i} className="flex items-start">
                      <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.type} water change ({entry.percent}%)
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{entry.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Water Management Settings</CardTitle>
                <CardDescription>Configure automated water changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Auto water change</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">Daily</Button>
                      <Button variant="outline" size="sm">Weekly</Button>
                      <Button variant="outline" size="sm" className="bg-teal-100 dark:bg-teal-900/30 border-teal-800 dark:border-teal-600">Custom</Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Change percentage</span>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">25%</Button>
                      <Button variant="outline" size="sm" className="bg-teal-100 dark:bg-teal-900/30 border-teal-800 dark:border-teal-600">30%</Button>
                      <Button variant="outline" size="sm">50%</Button>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Button className="w-full bg-teal-800 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600">Save Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// import { Droplet, Thermometer, Fan, ArrowRight } from "lucide-react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { PondHeader } from "@/components/pond-header"

// export default function WaterManagement({ params }: { params: { pondId: string } }) {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <PondHeader title="Water Management" description="Monitor and control water quality" />

//       {/* Main Content */}
//       <main className="flex-1 px-4 pb-20 md:pb-6 space-y-6 md:px-6">
//         <Tabs defaultValue="overview" className="w-full">
//           <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
//             <TabsTrigger value="overview">Overview</TabsTrigger>
//             <TabsTrigger value="history">History</TabsTrigger>
//             <TabsTrigger value="settings">Settings</TabsTrigger>
//           </TabsList>

//           <TabsContent value="overview" className="space-y-4 mt-6">
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg font-medium">Temperature</CardTitle>
//                   <CardDescription>Current water temperature</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-col items-center justify-center py-4">
//                     <Thermometer className="w-12 h-12 text-teal-800 dark:text-teal-400 mb-2" />
//                     <span className="text-4xl font-bold text-gray-900 dark:text-white">26,5°C</span>
//                     <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Optimal: 25-28°C</span>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg font-medium">pH Level</CardTitle>
//                   <CardDescription>Current water pH</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-col items-center justify-center py-4">
//                     <Droplet className="w-12 h-12 text-teal-800 dark:text-teal-400 mb-2" />
//                     <span className="text-4xl font-bold text-gray-900 dark:text-white">7,4</span>
//                     <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Optimal: 6.5-8.0</span>
//                   </div>
//                 </CardContent>
//               </Card>

//               <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg font-medium">Air Quality</CardTitle>
//                   <CardDescription>Current air quality</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex flex-col items-center justify-center py-4">
//                     <Fan className="w-12 h-12 text-teal-800 dark:text-teal-400 mb-2" />
//                     <span className="text-4xl font-bold text-gray-900 dark:text-white">Normal</span>
//                     <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Oxygen level stable</span>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader>
//                 <CardTitle>Water Level</CardTitle>
//                 <CardDescription>Current pond water level</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div>
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="text-gray-700 dark:text-gray-300 font-medium">Current Level</span>
//                       <span className="text-gray-900 dark:text-white font-bold">80%</span>
//                     </div>
//                     <div className="water-level-progress">
//                       <div className="water-level-progress-bar" style={{ width: "80%" }}/>
//                     </div>
//                   </div>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
//                     <Button className="w-full bg-teal-800 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600">
//                       Start Water Change
//                     </Button>
//                     <Button variant="outline" className="w-full">
//                       View Water Change History
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader>
//                 <CardTitle>Water Change Process</CardTitle>
//                 <CardDescription>How the automated system works</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-6">
//                   <div className="flex items-start">
//                     <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-3 flex-shrink-0">
//                       <span className="font-bold text-teal-800 dark:text-teal-400">1</span>
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900 dark:text-white">Dirty Water Removal</p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Water pump activates to remove dirty water
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-center">
//                     <ArrowRight className="w-6 h-6 text-gray-400" />
//                   </div>

//                   <div className="flex items-start">
//                     <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-3 flex-shrink-0">
//                       <span className="font-bold text-teal-800 dark:text-teal-400">2</span>
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900 dark:text-white">Fresh Water Intake</p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Solenoid valve opens to allow fresh water in
//                       </p>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-center">
//                     <ArrowRight className="w-6 h-6 text-gray-400" />
//                   </div>

//                   <div className="flex items-start">
//                     <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-3 flex-shrink-0">
//                       <span className="font-bold text-teal-800 dark:text-teal-400">3</span>
//                     </div>
//                     <div>
//                       <p className="font-medium text-gray-900 dark:text-white">Level Monitoring</p>
//                       <p className="text-sm text-gray-500 dark:text-gray-400">
//                         Water level sensor ensures proper filling
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="history" className="mt-6">
//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader>
//                 <CardTitle>Water Change History</CardTitle>
//                 <CardDescription>Recent water changes for this pond</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-start">
//                     <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">Automatic water change (30%)</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Today, 6:30 AM</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">Manual water change (50%)</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 4:15 PM</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">Automatic water change (25%)</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">May 7, 2025, 7:00 AM</p>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="settings" className="mt-6">
//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader>
//                 <CardTitle>Water Management Settings</CardTitle>
//                 <CardDescription>Configure automated water changes for this pond</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-700 dark:text-gray-300">Auto water change</span>
//                     <div className="flex items-center space-x-2">
//                       <Button variant="outline" size="sm">
//                         Daily
//                       </Button>
//                       <Button variant="outline" size="sm">
//                         Weekly
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="bg-teal-100 dark:bg-teal-900/30 border-teal-800 dark:border-teal-600"
//                       >
//                         Custom
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <span className="text-gray-700 dark:text-gray-300">Change percentage</span>
//                     <div className="flex items-center space-x-2">
//                       <Button variant="outline" size="sm">
//                         25%
//                       </Button>
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         className="bg-teal-100 dark:bg-teal-900/30 border-teal-800 dark:border-teal-600"
//                       >
//                         30%
//                       </Button>
//                       <Button variant="outline" size="sm">
//                         50%
//                       </Button>
//                     </div>
//                   </div>

//                   <div className="pt-4">
//                     <Button className="w-full bg-teal-800 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600">
//                       Save Settings
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   )
// }
