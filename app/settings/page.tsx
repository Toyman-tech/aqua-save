import { ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Settings() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="p-6 pt-12">
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-20 space-y-4 md:max-w-3xl md:mx-auto">
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              <button className="flex items-center justify-between w-full p-4 text-left">
                <span className="text-teal-900 font-medium">User</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="flex items-center justify-between w-full p-4 text-left">
                <span className="text-teal-900 font-medium">General</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="flex items-center justify-between w-full p-4 text-left">
                <span className="text-teal-900 font-medium">Notifications</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>

              <button className="flex items-center justify-between w-full p-4 text-left">
                <span className="text-teal-900 font-medium">Privacy & Security</span>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
