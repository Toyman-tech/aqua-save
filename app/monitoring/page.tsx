"use client"

import Image from "next/image"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { onValue, ref } from "firebase/database"
// import { db } from "@/lib/firebase" // customize to your setup

export default function Monitoring() {
  const [aiResult, setAiResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
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

  const handleUpload = async (file: File) => {
    const formData = new FormData()
    formData.append("file", file)
    setLoading(true)
    setAiResult(null)

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setAiResult(data.result || "Analysis complete")
    } catch (error) {
      setAiResult("Failed to analyze")
    } finally {
      setLoading(false)
    }
  }

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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-6 pt-12">
        <h1 className="text-3xl font-bold text-white">Monitoring</h1>
        <p className="text-gray-200 dark:text-gray-400 mt-1">Monitor fish behavior, water conditions, and health</p>
      </header>

      <main className="flex-1 px-4 pb-20 space-y-4 md:max-w-7xl md:mx-auto md:pb-6 md:px-6">
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="live">Live Feed</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* LIVE FEED TAB */}
          <TabsContent value="live" className="space-y-4 mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Live Camera Feed</CardTitle>
                <CardDescription>Real-time monitoring of your pond</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <Image src="/pond.png" alt="Live Feed" fill className="object-cover" />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    className="hidden"
                    id="upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleUpload(file)
                    }}
                  />
                  <label htmlFor="upload">
                    <Button variant="outline" className="w-full">Upload File</Button>
                  </label>
                  <Button variant="outline" className="w-full">Manual Trigger</Button>
                </div>
              </CardContent>
            </Card>

            {/* Sensor Data */}
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Water Sensor Readings</CardTitle>
                <CardDescription>Live data from ESP32 sensors</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xl font-bold">{data.temperature.toFixed(1)}°C</p>
                  <p className="text-sm text-gray-500">Temperature</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{data.waterLevel.toFixed(1)} mg/L</p>
                  <p className="text-sm text-gray-500">Dissolved O₂</p>
                </div>
                <div>
                  <p className="text-xl font-bold">{data.pH}</p>
                  <p className="text-sm text-gray-500">pH Level</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI ANALYSIS TAB */}
          <TabsContent value="analysis" className="space-y-4 mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>AI Analysis</CardTitle>
                <CardDescription>Upload files or trigger smart detection</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-teal-600 animate-spin mb-4" />
                    <p className="text-gray-700 dark:text-gray-300 font-medium">Analyzing...</p>
                  </div>
                ) : aiResult ? (
                  <div className="bg-teal-100 dark:bg-teal-900 p-4 rounded-md">
                    <p className="text-teal-800 dark:text-teal-300">{aiResult}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No analysis yet.</p>
                )}
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Analysis Parameters</CardTitle>
                <CardDescription>What we're looking for</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">Swimming patterns</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">Feeding response</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">Signs of disease</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">Fish count</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* HISTORY TAB */}
          <TabsContent value="history" className="mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Monitoring History</CardTitle>
                <CardDescription>Previous records & analyses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-500">Coming soon: history from Firebase or local DB.</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// import Image from "next/image"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// export default function Monitoring() {
//   return (
//     <div className="flex flex-col min-h-screen">
//       {/* Mobile Header */}
//       <header className="p-6 pt-12 md:hidden">
//         <h1 className="text-3xl font-bold text-white">Monitoring</h1>
//       </header>

//       {/* Desktop Header */}
//       {/* Header */}
//       <header className="p-6 pt-12 hidden md:block">
//         <h1 className="text-3xl font-bold text-white">Monitoring</h1>
//         <p className="text-gray-200 dark:text-gray-400 mt-1">Monitor fish behavior and health</p>
//       </header>

//       {/* Main Content */}
//       <main className="flex-1 px-4 pb-20 space-y-4 md:max-w-7xl md:mx-auto md:pb-6 md:px-6">
//         <Tabs defaultValue="live" className="w-full">
//           <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
//             <TabsTrigger value="live">Live Feed</TabsTrigger>
//             <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
//             <TabsTrigger value="history">History</TabsTrigger>
//           </TabsList>

//           <TabsContent value="live" className="space-y-4 mt-6">
//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg font-medium">Live Camera Feed</CardTitle>
//                 <CardDescription>Real-time monitoring of your pond</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
//                   <Image
//                     src="/pond.png"
//                     alt="Pond monitoring camera feed"
//                     fill
//                     className="object-cover"
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4 mt-4">
//                   <Button variant="outline" className="w-full">
//                     Upload video
//                   </Button>
//                   <Button variant="outline" className="w-full">
//                     Upload Image
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg font-medium">Camera Controls</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-2 gap-2">
//                     <Button variant="outline" className="w-full">
//                       Brightness +
//                     </Button>
//                     <Button variant="outline" className="w-full">
//                       Brightness -
//                     </Button>
//                     <Button variant="outline" className="w-full">
//                       Contrast +
//                     </Button>
//                     <Button variant="outline" className="w-full">
//                       Contrast -
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card> */}

//               <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     <Button className="w-full bg-teal-800 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600">
//                       Start AI Analysis
//                     </Button>
//                     <Button variant="outline" className="w-full">
//                       View Previous Recordings
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </TabsContent>

//           <TabsContent value="analysis" className="space-y-4 mt-6">
//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg font-medium">AI Analysis</CardTitle>
//                 <CardDescription>Automated fish behavior analysis</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex flex-col items-center justify-center py-6">
//                   <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-teal-600 animate-spin mb-4"></div>
//                   <p className="text-gray-700 dark:text-gray-300 font-medium">Processing...</p>
//                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Analyzing fish behavior patterns</p>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg font-medium">Analysis Parameters</CardTitle>
//                 <CardDescription>What we're looking for</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-center">
//                     <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
//                     <span className="text-gray-700 dark:text-gray-300">Swimming patterns</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
//                     <span className="text-gray-700 dark:text-gray-300">Feeding response</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
//                     <span className="text-gray-700 dark:text-gray-300">Signs of disease</span>
//                   </div>
//                   <div className="flex items-center">
//                     <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
//                     <span className="text-gray-700 dark:text-gray-300">Fish count</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="history" className="mt-6">
//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader>
//                 <CardTitle>Monitoring History</CardTitle>
//                 <CardDescription>Previous recordings and analyses</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-start">
//                     <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">AI Analysis completed</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Today, 10:30 AM</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">Manual recording saved</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 3:45 PM</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">AI Analysis completed</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">May 7, 2025, 9:15 AM</p>
//                     </div>
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
