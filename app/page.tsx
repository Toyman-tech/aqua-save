"use client"

import { useEffect, useState } from "react"
import { ref, onValue, set } from "firebase/database"
import { db } from "@/lib/firebase"
import { Thermometer, Droplet, Fan, Waves } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import toast from "react-hot-toast"
import WaterChangeStatus from "@/components/WaterChangeStatus"

export default function Dashboard() {
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
 console.log(data)
  const getAirQualityStatus = (value: number) => {
    if (value < 1000) return "Excellent"
    if (value < 2000) return "Good"
    if (value < 3000) return "Moderate"
    return "Poor"
  }
  const formattedWaterLevel = data.waterLevel ? data.waterLevel.toFixed(1) : '';
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
    <div className="flex flex-col gap-2 min-h-screen w-full">
      <header className="p-6 pt-6">
        <h1 className="text-4xl text-center font-bold text-white">PondIQ</h1>
      </header>

      <main className="flex-1 px-4 pb-20 space-y-4 md:mx-auto">
        <Card className="flex bg-white border-0 shadow-lg w-full md:w-3xl">
          <CardContent className="p-4 w-full">
            <h2 className="text-xl font-bold text-teal-900 mb-4">Dashboard</h2>

            <div className="space-y-4">
              <SensorRow icon={<Thermometer />} label="Water Temp" value={`${data.temperature}°C`} />
              <SensorRow icon={<Thermometer />} label="Air Temp" value={`${data.atm_temperature}°C`} />
              <SensorRow icon={<Fan />} label="Humidity" value={`${data.humidity}%`} />
              <SensorRow icon={<Droplet />} label="Turbidity" value={`${data.turbidity_percent} NTU`} />
              <SensorRow icon={<Fan />} label="Air Quality" value={getAirQualityStatus(data.air_quality_raw)} />
              <SensorRow icon={<Droplet />} label="pH" value={data.pH.toFixed(1)} />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex align-middle items-center mb-4 gap-3">
              <Waves className="w-7 h-7 text-teal-800" />
              <h2 className="text-2xl font-bold text-teal-900">Water Management</h2>
            </div>
            <div className="flex items-center justify-between py-3 mb-4">
              <span className="text-teal-900 font-medium">Water Level</span>
              <span className="text-teal-900 font-bold">{formattedWaterLevel}%</span>
            </div>

            <button
              onClick={handleWaterChange}
              disabled={isChanging}
              className={`w-full py-3 rounded-md font-medium text-white ${isChanging ? "bg-gray-500 cursor-not-allowed" : "bg-teal-800 hover:bg-teal-700"
                }`}
            > 
              {isChanging ? "Changing..." : "Start Water Change"}
            </button>
          </CardContent>
          <WaterChangeStatus />
        </Card>
      </main>
    </div>
  )
}

// A helper subcomponent for consistency
function SensorRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div className="flex items-center">
        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
          {icon}
        </div>
        <span className="text-teal-900 font-medium">{label}</span>
      </div>
      <span className="text-teal-900 font-bold">{value}</span>
    </div>
  )
}
