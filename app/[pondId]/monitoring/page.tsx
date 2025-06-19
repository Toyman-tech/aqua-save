import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PondHeader } from "@/components/pond-header"
import { Camera, Play, Square, Download } from "lucide-react"

export default function Monitoring({ params }: { params: { pondId: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <PondHeader title="Pond Monitoring" description="Monitor fish behavior and health with AI analysis" />

      {/* Main Content */}
      <main className="flex-1 px-4 pb-20 md:pb-6 space-y-6 md:px-6">
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="live">Live Feed</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-4 mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Live Camera Feed
                </CardTitle>
                <CardDescription>Real-time monitoring of this pond</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=400&width=600"
                    alt="Pond monitoring camera feed"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium flex items-center">
                    <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                    LIVE
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <Button variant="outline" className="w-full">
                    <Camera className="w-4 h-4 mr-2" />
                    Snapshot
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Play className="w-4 h-4 mr-2" />
                    Record
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Square className="w-4 h-4 mr-2" />
                    Full Screen
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Camera Controls</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="w-full">
                      Brightness +
                    </Button>
                    <Button variant="outline" className="w-full">
                      Brightness -
                    </Button>
                    <Button variant="outline" className="w-full">
                      Contrast +
                    </Button>
                    <Button variant="outline" className="w-full">
                      Contrast -
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button className="w-full bg-teal-800 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600">
                      Start AI Analysis
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Previous Recordings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4 mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">AI Analysis Results</CardTitle>
                <CardDescription>Automated fish behavior analysis for this pond</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">142</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Fish Detected</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Normal</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Swimming Pattern</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">Active</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Feeding Response</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">Healthy</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Overall Status</div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Analysis Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                        <span className="text-gray-700 dark:text-gray-300">Fish are swimming in normal patterns</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                        <span className="text-gray-700 dark:text-gray-300">No signs of disease detected</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-yellow-500 mr-3"></div>
                        <span className="text-gray-700 dark:text-gray-300">
                          Some fish showing increased activity near feeding area
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                        <span className="text-gray-700 dark:text-gray-300">Water clarity is good for monitoring</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Analysis Parameters</CardTitle>
                <CardDescription>What the AI is monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
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
                      <span className="text-gray-700 dark:text-gray-300">Fish count accuracy</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">Disease detection</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">Behavioral anomalies</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-3"></div>
                      <span className="text-gray-700 dark:text-gray-300">Water quality indicators</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Monitoring History</CardTitle>
                <CardDescription>Previous recordings and analyses for this pond</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        AI Analysis completed - 142 fish detected
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Today, 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Manual recording saved (15 minutes)
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 3:45 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-yellow-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Alert: Unusual swimming pattern detected
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">May 7, 2025, 2:20 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        AI Analysis completed - 138 fish detected
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">May 7, 2025, 9:15 AM</p>
                    </div>
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
