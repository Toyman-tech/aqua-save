import { ChevronRight, Clock, Fish } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PondHeader } from "@/components/pond-header"

export default function Feeding({ params }: { params: { pondId: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <PondHeader title="Feeding Management" description="Control and monitor fish feeding" />

      {/* Main Content */}
      <main className="flex-1 px-4 pb-20 md:pb-6 space-y-6 md:px-6">
        <Tabs defaultValue="control" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="control">Control</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="control" className="space-y-4 mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Fish className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Manual Feeding
                </CardTitle>
                <CardDescription>Feed fish manually or enable automatic feeding</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-4">
                  <Label htmlFor="manual-mode" className="text-gray-900 dark:text-white font-medium">
                    Manual Feeding Mode
                  </Label>
                  <Switch id="manual-mode" defaultChecked />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button className="w-full bg-teal-800 hover:bg-teal-700 text-white dark:bg-teal-700 dark:hover:bg-teal-600">
                    Feed Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    Emergency Feed
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Feeding Status</CardTitle>
                <CardDescription>Current feeding information for this pond</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Last Fed</span>
                    <span className="font-medium text-gray-900 dark:text-white">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Next Feeding</span>
                    <span className="font-medium text-gray-900 dark:text-white">In 4 hours</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-gray-700 dark:text-gray-300">Daily Feeds</span>
                    <span className="font-medium text-gray-900 dark:text-white">2 of 3</span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-700 dark:text-gray-300">Feed Amount</span>
                    <span className="font-medium text-gray-900 dark:text-white">250g per feeding</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-4 mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
                  Feeding Schedule
                </CardTitle>
                <CardDescription>Configure automatic feeding times for this pond</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  <button className="flex items-center justify-between w-full py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-2">
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">8:00 AM</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Morning feeding - 250g</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className="flex items-center justify-between w-full py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-2">
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">12:00 PM</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Midday feeding - 200g</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>

                  <button className="flex items-center justify-between w-full py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg px-2">
                    <div>
                      <span className="text-gray-900 dark:text-white font-medium">5:00 PM</span>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Evening feeding - 250g</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                  <Button variant="outline" className="w-full">
                    Add New Feeding Time
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Feeding History</CardTitle>
                <CardDescription>Recent feeding activities for this pond</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Automatic feeding completed</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Today, 12:00 PM - 200g dispensed</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Automatic feeding completed</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Today, 8:00 AM - 250g dispensed</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Manual feeding</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 6:30 PM - 150g dispensed</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">Automatic feeding completed</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 5:00 PM - 250g dispensed</p>
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
