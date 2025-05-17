"use client"

import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "@/lib/firebase"
import { Thermometer, Droplet, Fan, Waves } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function Dashboard() {
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

  const getAirQualityStatus = (value: number) => {
    if (value < 1000) return "Excellent"
    if (value < 2000) return "Good"
    if (value < 3000) return "Moderate"
    return "Poor"
  }
  const formattedWaterLevel = data.waterLevel ? data.waterLevel.toFixed(1) : '';

  return (
    <div className="flex flex-col gap-2 min-h-screen w-full">
      <header className="p-6 pt-12">
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

            <button className="w-full py-3 bg-teal-800 hover:bg-teal-700 text-white rounded-md font-medium">
              Start Water Change
            </button>
          </CardContent>
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

// "use client"

// import { useEffect, useState } from "react"
// import { ref, onValue } from "firebase/database"
// import { db } from "@/lib/firebase"
// import { Thermometer, Droplet, Fan } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"

// export default function Dashboard() {
//   const [data, setData] = useState({
//     temperature: 0,
//     turbidity: 0,
//     airQuality: "Normal",
//     pH: 0,
//     waterLevel: 0,
//   })
// console.log(data)

//   // useEffect(() => {
//   //   const dataRef = ref(db, "aqua-data") // adjust this path to your ESP32 push location
//   //   console.log('data', dataRef)
//   //   const unsubscribe = onValue(dataRef, (snapshot) => {
//   //     if (snapshot.exists()) {
//   //       setData(snapshot.val())
//   //     }
//   //   })

//   //   return () => unsubscribe()
//   // }, [])

//   useEffect(() => {
//     fetch("https://aqua-save-fe911-default-rtdb.firebaseio.com/pondData.json")
//       .then((res) => res.json())
//       .then((data) => setData(data));
//   }, [data]);
  

//   return (
//     <div className="flex flex-col gap-2 min-h-screen w-full">
//       <header className="p-6 pt-12">
//         <h1 className="text-4xl text-center font-bold text-white">Aqua-Save</h1>
//       </header>

//       <main className="flex-1 px-4 pb-20 space-y-4  md:mx-auto">
//         <Card className="flex bg-white border-0 shadow-lg w-full md:w-3xl">
//           <CardContent className="p-4 w-full ">
//             <h2 className="text-xl font-bold text-teal-900 mb-4">Dashboard</h2>

//             <div className="space-y-4">
//               <div className="flex items-center justify-between py-3 border-b border-gray-100">
//                 <div className="flex items-center">
//                   <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
//                     <Thermometer className="w-5 h-5 text-teal-800" />
//                   </div>
//                   <span className="text-teal-900 font-medium">Temperature</span>
//                 </div>
//                 <span className="text-teal-900 font-bold">{data.temperature}°C</span>
//               </div>

//               <div className="flex items-center justify-between py-3 border-b border-gray-100">
//                 <div className="flex items-center">
//                   <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
//                     <Droplet className="w-5 h-5 text-teal-800" />
//                   </div>
//                   <span className="text-teal-900 font-medium">Turbidity</span>
//                 </div>
//                 <span className="text-teal-900 font-bold">{data.turbidity} NTU</span>
//               </div>

//               <div className="flex items-center justify-between py-3 border-b border-gray-100">
//                 <div className="flex items-center">
//                   <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
//                     <Fan className="w-5 h-5 text-teal-800" />
//                   </div>
//                   <span className="text-teal-900 font-medium">Air Quality</span>
//                 </div>
//                 <span className="text-teal-900 font-bold">{data.airQuality}</span>
//               </div>

//               <div className="flex items-center justify-between py-3 border-b border-gray-100">
//                 <div className="flex items-center">
//                   <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-3">
//                     <Droplet className="w-5 h-5 text-teal-800" />
//                   </div>
//                   <span className="text-teal-900 font-medium">pH</span>
//                 </div>
//                 <span className="text-teal-900 font-bold">{data.pH}</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="bg-white border-0 shadow-lg">
//           <CardContent className="p-4">
//             <div className="flex align-middle items-center mb-4 gap-3">
//               <Droplet className="w-7 h-7 text-teal-800" />
//               <h2 className="text-2xl font-bold text-teal-900 ">Water Management</h2>
//             </div>
//             <div className="flex items-center justify-between py-3 mb-4">
//               <span className="text-teal-900 font-medium">Water Level</span>
//               <span className="text-teal-900 font-bold">{data.waterLevel}%</span>
//             </div>

//             <button className="w-full py-3 bg-teal-800 hover:bg-teal-700 text-white rounded-md font-medium">
//               Start Water Change
//             </button>
//           </CardContent>
//         </Card>
//       </main>
//     </div>
//   )
// }
