import { Thermometer, Droplet, Fan } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-2 min-h-screen w-full">
      {/* Header */}
      <header className="p-6 pt-12">
        <h1 className="text-4xl text-center font-bold text-white">Aqua-Save</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 pb-20 space-y-4  md:mx-auto">
        <Card className="flex bg-white border-0 shadow-lg w-full md:w-3xl">
          <CardContent className="p-4 w-full ">
            <h2 className="text-xl font-bold text-teal-900 mb-4">Dashboard</h2>

            <div className="space-y-4">

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                    <Thermometer className="w-5 h-5 text-teal-800" />
                  </div>
                  <span className="text-teal-900 font-medium">Temperature</span>
                </div>
                <span className="text-teal-900 font-bold">26,5°C</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                    <Droplet className="w-5 h-5 text-teal-800" />
                  </div>
                  <span className="text-teal-900 font-medium">Turbidity</span>
                </div>
                <span className="text-teal-900 font-bold">26,5NTU</span>
              </div>


              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                    <Fan className="w-5 h-5 text-teal-800" />
                  </div>
                  <span className="text-teal-900 font-medium">Air Quality</span>
                </div>
                <span className="text-teal-900 font-bold">Normal</span>
              </div>


              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
                    <Droplet className="w-5 h-5 text-teal-800" />
                  </div>
                  <span className="text-teal-900 font-medium">pH</span>
                </div>
                <span className="text-teal-900 font-bold">7,4</span>
              </div>

            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex align-middle items-center mb-4 gap-3">
              <Droplet className="w-7 h-7 text-teal-800" />
              <h2 className="text-2xl font-bold text-teal-900 ">Water Management</h2>
            </div>
            <div className="flex items-center justify-between py-3 mb-4">
              <span className="text-teal-900 font-medium">Water Level</span>
              <span className="text-teal-900 font-bold">80%</span>
            </div>

            <button className="w-full py-3 bg-teal-800 hover:bg-teal-700 text-white rounded-md font-medium">
              Start Water Change
            </button>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
