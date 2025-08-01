
"use client"

import { useEffect, useState } from "react"
import { ref, onValue, set } from "firebase/database"

import { Droplet, Thermometer, Fan } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { db } from "@/lib/firebase"
import toast from "react-hot-toast"

export default function WaterManagementPage() {
  const [isChanging, setIsChanging] = useState(false)
  const [data, setData] = useState({
    temperature: 0,
    atm_temperature: 0,
    humidity: 0,
    waterLevel: 0,
    water_presence: 0,
    turbidity_raw: 0,
    turbidity_percent: 0,
    air_quality_raw: 0,
    pH: 7, // placeholder value
  })

  useEffect(() => {
    const dataRef = ref(db, "pondData") // match your ESP32's upload path
    const unsubscribe = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        const firebaseData = snapshot.val()

        setData({
          temperature: firebaseData.temperature || 0,
          atm_temperature: firebaseData.atm_temperature || 0,
          humidity: firebaseData.humidity || 0,
          waterLevel: firebaseData.water_level || 0,
          water_presence: firebaseData.water_presence || 0,
          turbidity_raw: firebaseData.turbidity_raw || 0,
          turbidity_percent: firebaseData.turbidity_percent || 0,
          air_quality_raw: firebaseData.air_quality_raw || 0,
          pH: firebaseData.pH || 7, // use if available, else placeholder
        })
      }
    })

    return () => unsubscribe()
  }, [])

  // const getAirQualityStatus = (value: number) => {
  //   if (value < 1000) return "Excellent"
  //   if (value < 2000) return "Good"
  //   if (value < 3000) return "Moderate"
  //   return "Poor"
  // }
  // const formattedWaterLevel = data.waterLevel ? data.waterLevel.toFixed(1) : '';
  const handleWaterChange = async () => {
    const changeWaterRef = ref(db, "/change_water")

    try {
      setIsChanging(true)

      // 1. Trigger water change
      await set(changeWaterRef, true)
      toast.success("🚰 Water change initiated")

      // 2. Listen for completion
      const unsubscribe = onValue(changeWaterRef, (snapshot) => {
        const status = snapshot.val()
        if (status === false) {
          toast.success("✅ Water change completed")
          setIsChanging(false)
          unsubscribe()
        }
      })
    } catch (err) {
      toast.error("⚠️ Failed to start water change")
      setIsChanging(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile Header */}
      <header className="p-6 pt-12 md:hidden">
        <h1 className="text-3xl font-bold text-white">Water Management</h1>
      </header>

      {/* Desktop Header */}
      <header className="hidden md:block p-6">
        <h1 className="text-3xl font-bold text-white">Water Management</h1>
        <p className="text-gray-200 dark:text-gray-400 mt-1">Monitor and control water quality</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-20 md:pb-6 space-y-6 md:px-6 md:max-w-none md:mx-auto">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-3xl">
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
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{`${data.temperature.toFixed(1)}°C`}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Optimal: 25-35°C</span>
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
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">7,0</span>
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
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">Normal</span>
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
                      <span className="text-gray-900 dark:text-white font-bold">{data.waterLevel.toFixed(1)}%</span>
                    </div>
                    <Progress value={data.waterLevel} className="h-4 bg-gray-200 dark:bg-gray-700 text-teal-900/30 " />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <Button onClick={handleWaterChange}
                      disabled={isChanging}
                      className={`w-full py-3 rounded-md font-medium text-white ${isChanging ? "bg-gray-500 cursor-not-allowed" : "bg-teal-800 hover:bg-teal-700"
                        }`}>
                      {isChanging ? "Changing..." : "Start Water Change"}
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Water Change History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Water Change Process</CardTitle>
                <CardDescription>How the automated system works</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-bold text-teal-800 dark:text-teal-400">1</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Dirty Water Removal</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Water pump activates to remove dirty water
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-bold text-teal-800 dark:text-teal-400">2</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Fresh Water Intake</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Solenoid valve opens to allow fresh water in
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-bold text-teal-800 dark:text-teal-400">3</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">Level Monitoring</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Water level sensor ensures proper filling
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Water Change History</CardTitle>
                <CardDescription>Recent water changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Automatic water change (30%)</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Today, 6:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Manual water change (50%)</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 4:15 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Automatic water change (25%)</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">May 7, 2025, 7:00 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Water Management Settings</CardTitle>
                {/* <CardDescription>Configure automated water changes</CardDescription> */}
              </CardHeader>
              <CardContent>
                <p className="text-gray-500 dark:text-gray-400 mb-4">Settings content would go here</p>
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
// import { Progress } from "@/components/ui/progress"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// export default function WaterManagement() {
// return (
//   <div className="flex flex-col min-h-screen">
//     {/* Mobile Header */}
//     <header className="p-6 pt-12 md:hidden">
//       <h1 className="text-3xl font-bold text-white">Water Management</h1>
//     </header>

//     {/* Desktop Header */}
//     <header className="hidden md:block p-6">
//       <h1 className="text-3xl font-bold text-white">Water Management</h1>
//       <p className="text-gray-200 dark:text-gray-400 mt-1">Monitor and control water quality</p>
//     </header>

//     {/* Main Content */}
//     <main className="flex-1 px-4 pb-20 md:pb-6 space-y-6 md:px-6 md:max-w-none md:mx-auto">
//       <Tabs defaultValue="overview" className="w-full">
//         <TabsList className="grid w-full grid-cols-3 md:w-3xl">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="history">History</TabsTrigger>
//           <TabsTrigger value="settings">Settings</TabsTrigger>
//         </TabsList>

//         <TabsContent value="overview" className="space-y-4 mt-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg font-medium">Temperature</CardTitle>
//                 <CardDescription>Current water temperature</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex flex-col items-center justify-center py-4">
//                   <Thermometer className="w-12 h-12 text-teal-800 dark:text-teal-400 mb-2" />
//                   <span className="text-4xl font-bold text-gray-900 dark:text-white">26,5°C</span>
//                   <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Optimal: 25-28°C</span>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg font-medium">pH Level</CardTitle>
//                 <CardDescription>Current water pH</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex flex-col items-center justify-center py-4">
//                   <Droplet className="w-12 h-12 text-teal-800 dark:text-teal-400 mb-2" />
//                   <span className="text-4xl font-bold text-gray-900 dark:text-white">7,4</span>
//                   <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Optimal: 6.5-8.0</span>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg font-medium">Air Quality</CardTitle>
//                 <CardDescription>Current air quality</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex flex-col items-center justify-center py-4">
//                   <Fan className="w-12 h-12 text-teal-800 dark:text-teal-400 mb-2" />
//                   <span className="text-4xl font-bold text-gray-900 dark:text-white">Normal</span>
//                   <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Oxygen level stable</span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//             <CardHeader>
//               <CardTitle>Water Level</CardTitle>
//               <CardDescription>Current pond water level</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div>
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="text-gray-700 dark:text-gray-300 font-medium">Current Level</span>
//                     <span className="text-gray-900 dark:text-white font-bold">80%</span>
//                   </div>
//                   <Progress value={80} className="h-4 bg-gray-200 dark:bg-gray-700" />
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
//                   <Button className="w-full bg-teal-800 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600">
//                     Start Water Change
//                   </Button>
//                   <Button variant="outline" className="w-full">
//                     View Water Change History
//                   </Button>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//             <CardHeader>
//               <CardTitle>Water Change Process</CardTitle>
//               <CardDescription>How the automated system works</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-6">
//                 <div className="flex items-start">
//                   <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-3 flex-shrink-0">
//                     <span className="font-bold text-teal-800 dark:text-teal-400">1</span>
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900 dark:text-white">Dirty Water Removal</p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Water pump activates to remove dirty water
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-center">
//                   <ArrowRight className="w-6 h-6 text-gray-400" />
//                 </div>

//                 <div className="flex items-start">
//                   <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-3 flex-shrink-0">
//                     <span className="font-bold text-teal-800 dark:text-teal-400">2</span>
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900 dark:text-white">Fresh Water Intake</p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Solenoid valve opens to allow fresh water in
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex items-center justify-center">
//                   <ArrowRight className="w-6 h-6 text-gray-400" />
//                 </div>

//                 <div className="flex items-start">
//                   <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center mr-3 flex-shrink-0">
//                     <span className="font-bold text-teal-800 dark:text-teal-400">3</span>
//                   </div>
//                   <div>
//                     <p className="font-medium text-gray-900 dark:text-white">Level Monitoring</p>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">
//                       Water level sensor ensures proper filling
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="history" className="mt-6">
//           <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//             <CardHeader>
//               <CardTitle>Water Change History</CardTitle>
//               <CardDescription>Recent water changes</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <div className="space-y-4">
//                 <div className="flex items-start">
//                   <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-white">Automatic water change (30%)</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">Today, 6:30 AM</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-white">Manual water change (50%)</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 4:15 PM</p>
//                   </div>
//                 </div>
//                 <div className="flex items-start">
//                   <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
//                   <div>
//                     <p className="text-sm font-medium text-gray-900 dark:text-white">Automatic water change (25%)</p>
//                     <p className="text-xs text-gray-500 dark:text-gray-400">May 7, 2025, 7:00 AM</p>
//                   </div>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="settings" className="mt-6">
//           <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//             <CardHeader>
//               <CardTitle>Water Management Settings</CardTitle>
//               <CardDescription>Configure automated water changes</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <p className="text-gray-500 dark:text-gray-400 mb-4">Settings content would go here</p>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </main>
//   </div>
// )
// }
