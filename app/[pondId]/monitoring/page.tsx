// Integrated Monitoring UI with AI Analysis Upload
"use client"

import Image from "next/image"
import { useState, useEffect, useRef, use } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PondHeader } from "@/components/pond-header"
import { Camera, Play, Square, Download } from "lucide-react"
import { db } from "@/lib/firebase"
import { onValue, ref } from "firebase/database"

const simulatedDiseases = [
  {
    name: "Ich (White Spot Disease)",
    description: "White cyst-like spots on the skin, fins, and gills. Fish may scratch against objects.",
    cause: "Caused by the parasite Ichthyophthirius multifiliis.",
    treatment: "Increase water temperature to 86°F (30°C) for 3 days. Add aquarium salt (1 tbsp per 5 gallons). Consider malachite green or formalin-based medications.",
    prevention: "Quarantine new fish for 2-4 weeks. Maintain good water quality with regular changes.",
    severity: "Moderate to severe if left untreated"
  },
  {
    name: "Columnaris (Cotton Wool Disease)",
    description: "White or grayish patches on the skin, fins, or mouth that resemble cotton or fungus. Frayed fins and rapid breathing.",
    cause: "Bacterial infection (Flavobacterium columnare) often triggered by poor water quality or stress.",
    treatment: "Antibiotics like Kanamycin or Terramycin. Improve water quality with 25% water changes every 2-3 days.",
    prevention: "Maintain optimal water conditions. Minimize handling stress.",
    severity: "High - can be fatal within 24-72 hours in acute cases"
  },
  {
    name: "Saprolegniasis (Cotton Fungus)",
    description: "Cotton-like growth on damaged skin, fins, or eyes. Often appears after injury.",
    cause: "Fungal infection (Saprolegnia) that attacks weakened or injured fish.",
    treatment: "Methylene blue baths (1 teaspoon per 10 gallons) for 30 minutes daily. Improve water quality.",
    prevention: "Avoid rough handling. Treat injuries promptly. Maintain clean water.",
    severity: "Moderate - primarily affects already compromised fish"
  },
  {
    name: "Healthy Fish",
    description: "No signs of disease detected. Fish shows normal swimming patterns and behavior.",
    cause: "N/A",
    treatment: "Continue regular maintenance and feeding schedule.",
    prevention: "Maintain water quality with regular testing and changes. Provide balanced diet.",
    severity: "None"
  }
];


export default function Monitoring({ params }: { params: Promise<{ pondId: string }> }) {
  const { pondId } = use(params)
  const [aiResult, setAiResult] = useState<{
    name: string;
    description: string;
    cause: string;
    treatment: string;
    prevention: string;
    severity: string;
  } | null>(null);
  const [loading, setLoading] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("/pond.png")
  const [activeTab, setActiveTab] = useState("live")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const simulateAnalysis = () => {
    setLoading(true)
    setAiResult(null)
    setActiveTab("analysis")
    setTimeout(() => {
      const result = simulatedDiseases[Math.floor(Math.random() * simulatedDiseases.length)]
      setAiResult(result)
      setLoading(false)
    }, 7000)
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadedFile(file)
    setPreviewUrl(URL.createObjectURL(file))
    simulateAnalysis()
  }

  const triggerUpload = () => fileInputRef.current?.click()

  return (
    <div className="flex flex-col min-h-screen">
      <PondHeader title="Pond Monitoring" description="Monitor fish behavior and detect diseases using AI" />

      <main className="flex-1 px-4 pb-20 md:pb-6 space-y-6 md:px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="live">Live Feed</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-4 mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Upload Fish Image/Video
                </CardTitle>
                <CardDescription>Trigger AI analysis by uploading a file</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col w-full justify-center items-center">
                <div className="relative aspect-video max-w-[1000px] justify-center w-full bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {uploadedFile?.type?.startsWith("video/") ? (
                    <video src={previewUrl} controls className="w-full h-full object-cover"
                      muted
                      autoPlay
                      loop />
                  ) : (
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" unoptimized={previewUrl !== "/pond.png"} />
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <input type="file" accept="image/*,video/*" className="hidden" ref={fileInputRef} onChange={handleUpload} />
                  <Button onClick={triggerUpload} variant="outline">Upload</Button>
                  <Button onClick={simulateAnalysis} variant="outline" disabled={!uploadedFile || loading}>
                    {loading ? "Analyzing..." : "Re-analyze"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4 mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Disease Detection Results</CardTitle>
                <CardDescription>
                  {loading ? "AI analyzing behavior..." : aiResult ? "Result ready" : "Upload a file from Live Feed tab."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-teal-600 animate-spin mb-4" />
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      {uploadedFile?.type.startsWith("video/")
                        ? "Analyzing fish movement patterns..."
                        : "Analyzing fish image for symptoms..."}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">This may take few seconds</p>
                  </div>
                ) : aiResult ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-md ${aiResult.name === "Healthy Fish"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-amber-100 dark:bg-amber-900/30"
                      }`}>
                      <h3 className={`text-lg font-bold ${aiResult.name === "Healthy Fish"
                          ? "text-green-800 dark:text-green-300"
                          : "text-amber-800 dark:text-amber-300"
                        }`}>
                        {aiResult.name}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">{aiResult.description}</p>
                    </div>

                    {aiResult.name !== "Healthy Fish" && (
                      <>
                        <div>
                          <h4 className="font-medium text-teal-700 dark:text-teal-300">Cause:</h4>
                          <p className="text-gray-700 dark:text-gray-300">{aiResult.cause}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-teal-700 dark:text-teal-300">Recommended Treatment:</h4>
                          <p className="text-gray-700 dark:text-gray-300">{aiResult.treatment}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-teal-700 dark:text-teal-300">Prevention:</h4>
                          <p className="text-gray-700 dark:text-gray-300">{aiResult.prevention}</p>
                        </div>

                        <div>
                          <h4 className="font-medium text-teal-700 dark:text-teal-300">Severity:</h4>
                          <p className="text-gray-700 dark:text-gray-300">{aiResult.severity}</p>
                        </div>
                      </>
                    )}
                  </div>
                ) :  (
                  <p className="text-sm text-gray-500 py-6 text-center">
                    No analysis results yet. Upload a video or image of your catfish from the Live Feed tab.
                  </p>)}
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Our AI Detects</CardTitle>
                <CardDescription>Key behaviors and symptoms analyzed</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">Abnormal swimming patterns</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">Body lesions and spots</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">Fin deterioration</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">Gill condition & breathing rate</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Monitoring History</CardTitle>
                <CardDescription>Past AI detections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-red-500 mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Ich Detected</p>
                    <p className="text-xs text-gray-500">Jul 28, 2025, 10:20 AM</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3"></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Healthy Fish</p>
                    <p className="text-xs text-gray-500">Jul 27, 2025, 4:10 PM</p>
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

// import Image from "next/image"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { PondHeader } from "@/components/pond-header"
// import { Camera, Play, Square, Download } from "lucide-react"

// export default function Monitoring({ params }: { params: { pondId: string } }) {
//   return (
//     <div className="flex flex-col min-h-screen">
//       <PondHeader title="Pond Monitoring" description="Monitor fish behavior and health with AI analysis" />

//       {/* Main Content */}
//       <main className="flex-1 px-4 pb-20 md:pb-6 space-y-6 md:px-6">
//         <Tabs defaultValue="live" className="w-full">
//           <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
//             <TabsTrigger value="live">Live Feed</TabsTrigger>
//             <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
//             <TabsTrigger value="history">History</TabsTrigger>
//           </TabsList>

//           <TabsContent value="live" className="space-y-4 mt-6">
//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader className="pb-2">
//                 <CardTitle className="flex items-center">
//                   <Camera className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
//                   Live Camera Feed
//                 </CardTitle>
//                 <CardDescription>Real-time monitoring of this pond</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
//                   <Image
//                     src="/placeholder.svg?height=400&width=600"
//                     alt="Pond monitoring camera feed"
//                     fill
//                     className="object-cover"
//                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
//                   />
//                   <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium flex items-center">
//                     <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
//                     LIVE
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//                   <Button variant="outline" className="w-full">
//                     <Camera className="w-4 h-4 mr-2" />
//                     Snapshot
//                   </Button>
//                   <Button variant="outline" className="w-full">
//                     <Play className="w-4 h-4 mr-2" />
//                     Record
//                   </Button>
//                   <Button variant="outline" className="w-full">
//                     <Square className="w-4 h-4 mr-2" />
//                     Full Screen
//                   </Button>
//                   <Button variant="outline" className="w-full">
//                     <Download className="w-4 h-4 mr-2" />
//                     Download
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
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
//               </Card>

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
//                 <CardTitle className="text-lg font-medium">AI Analysis Results</CardTitle>
//                 <CardDescription>Automated fish behavior analysis for this pond</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                     <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                       <div className="text-2xl font-bold text-green-600 dark:text-green-400">142</div>
//                       <div className="text-sm text-gray-600 dark:text-gray-400">Fish Detected</div>
//                     </div>
//                     <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
//                       <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Normal</div>
//                       <div className="text-sm text-gray-600 dark:text-gray-400">Swimming Pattern</div>
//                     </div>
//                     <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
//                       <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">Active</div>
//                       <div className="text-sm text-gray-600 dark:text-gray-400">Feeding Response</div>
//                     </div>
//                     <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
//                       <div className="text-2xl font-bold text-green-600 dark:text-green-400">Healthy</div>
//                       <div className="text-sm text-gray-600 dark:text-gray-400">Overall Status</div>
//                     </div>
//                   </div>

//                   <div className="pt-4">
//                     <h4 className="font-medium text-gray-900 dark:text-white mb-2">Analysis Details</h4>
//                     <div className="space-y-2 text-sm">
//                       <div className="flex items-center">
//                         <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
//                         <span className="text-gray-700 dark:text-gray-300">Fish are swimming in normal patterns</span>
//                       </div>
//                       <div className="flex items-center">
//                         <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
//                         <span className="text-gray-700 dark:text-gray-300">No signs of disease detected</span>
//                       </div>
//                       <div className="flex items-center">
//                         <div className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></div>
//                         <span className="text-gray-700 dark:text-gray-300">
//                           Some fish showing increased activity near feeding area
//                         </span>
//                       </div>
//                       <div className="flex items-center">
//                         <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
//                         <span className="text-gray-700 dark:text-gray-300">Water clarity is good for monitoring</span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader className="pb-2">
//                 <CardTitle className="text-lg font-medium">Analysis Parameters</CardTitle>
//                 <CardDescription>What the AI is monitoring</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-3">
//                     <div className="flex items-center">
//                       <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
//                       <span className="text-gray-700 dark:text-gray-300">Swimming patterns</span>
//                     </div>
//                     <div className="flex items-center">
//                       <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
//                       <span className="text-gray-700 dark:text-gray-300">Feeding response</span>
//                     </div>
//                     <div className="flex items-center">
//                       <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
//                       <span className="text-gray-700 dark:text-gray-300">Fish count accuracy</span>
//                     </div>
//                   </div>
//                   <div className="space-y-3">
//                     <div className="flex items-center">
//                       <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
//                       <span className="text-gray-700 dark:text-gray-300">Disease detection</span>
//                     </div>
//                     <div className="flex items-center">
//                       <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
//                       <span className="text-gray-700 dark:text-gray-300">Behavioral anomalies</span>
//                     </div>
//                     <div className="flex items-center">
//                       <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
//                       <span className="text-gray-700 dark:text-gray-300">Water quality indicators</span>
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="history" className="mt-6">
//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader>
//                 <CardTitle>Monitoring History</CardTitle>
//                 <CardDescription>Previous recordings and analyses for this pond</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-start">
//                     <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3"></div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         AI Analysis completed - 142 fish detected
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Today, 10:30 AM</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         Manual recording saved (15 minutes)
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 3:45 PM</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500 mr-3"></div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         Alert: Unusual swimming pattern detected
//                       </p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">May 7, 2025, 2:20 PM</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3"></div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">
//                         AI Analysis completed - 138 fish detected
//                       </p>
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
