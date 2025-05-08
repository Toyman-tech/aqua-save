import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function Feeding() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-6 pt-12">
        <h1 className="text-3xl font-bold text-white">Feeding</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-20 space-y-4 md:max-w-3xl md:mx-auto">
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-teal-900">Feeding Mode</h2>
            </div>

            <div className="flex items-center justify-between py-4">
              <Label htmlFor="manual-mode" className="text-teal-900 font-medium text-lg">
                Manual
              </Label>
              <Switch id="manual-mode" defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-teal-900">Schedule</h2>
            </div>

            <div className="divide-y divide-gray-100">
              <button className="flex items-center justify-between w-full py-4 text-left">
                <span className="text-teal-900 font-medium">8:00 AM</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="flex items-center justify-between w-full py-4 text-left">
                <span className="text-teal-900 font-medium">12:00 PM</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="flex items-center justify-between w-full py-4 text-left">
                <span className="text-teal-900 font-medium">5:00 PM</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
