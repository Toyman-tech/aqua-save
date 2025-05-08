import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Monitoring() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Mobile Header */}
      <header className="p-6 pt-12 md:hidden">
        <h1 className="text-3xl font-bold text-white">Monitoring</h1>
      </header>

      {/* Desktop Header */}
      {/* Header */}
      <header className="p-6 pt-12 hidden md:block">
        <h1 className="text-3xl font-bold text-white">Monitoring</h1>
        <p className="text-gray-200 dark:text-gray-400 mt-1">Monitor fish behavior and health</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-20 space-y-4 md:max-w-7xl md:mx-auto md:pb-6 md:px-6">
        <Tabs defaultValue="live" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="live">Live Feed</TabsTrigger>
            <TabsTrigger value="analysis">AI Analysis</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-4 mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Live Camera Feed</CardTitle>
                <CardDescription>Real-time monitoring of your pond</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                  <Image
                    src="/pond.png"
                    alt="Pond monitoring camera feed"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Button variant="outline" className="w-full">
                    Take Snapshot
                  </Button>
                  <Button variant="outline" className="w-full">
                    Full Screen
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
                <CardTitle className="text-lg font-medium">AI Analysis</CardTitle>
                <CardDescription>Automated fish behavior analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-teal-600 animate-spin mb-4"></div>
                  <p className="text-gray-700 dark:text-gray-300 font-medium">Processing...</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Analyzing fish behavior patterns</p>
                </div>
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

          <TabsContent value="history" className="mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Monitoring History</CardTitle>
                <CardDescription>Previous recordings and analyses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">AI Analysis completed</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Today, 10:30 AM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Manual recording saved</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 3:45 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">AI Analysis completed</p>
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
