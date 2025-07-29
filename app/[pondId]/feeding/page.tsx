"use client"

import { use, useEffect, useState } from "react"
import { Clock, Fish, Trash2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { PondHeader } from "@/components/pond-header"
import { db } from "@/lib/firebase"
import { ref, onValue, set, get } from "firebase/database"
import toast from "react-hot-toast"

const formatTimeTo12Hour = (time24h: string) => {
  try {
    const [hourStr, minute] = time24h.split(":")
    let hour = parseInt(hourStr, 10)
    const period = hour >= 12 ? "PM" : "AM"
    hour = hour % 12
    hour = hour === 0 ? 12 : hour
    return `${hour}:${minute} ${period}`
  } catch {
    return time24h
  }
}

export default function Feeding({ params }: { params: Promise<{ pondId: string }> }) {
  const { pondId } = use(params)
  const [feedingTimes, setFeedingTimes] = useState<string[]>([])
  const [manualMode, setManualMode] = useState(false)
  const [newTime, setNewTime] = useState("")
  const [feedKg, setFeedKg] = useState("1.0")
  const [feederDiameter, setFeederDiameter] = useState("30")
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lastCheckMinute, setLastCheckMinute] = useState(-1)

  const scheduleRef = ref(db, `${pondId}/feeding_schedule`)
  const modeRef = ref(db, `${pondId}/feeding_mode`)
  const configKgRef = ref(db, `${pondId}/feed_kg`)
  const configDiameterRef = ref(db, `${pondId}/feeder_diameter`)

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const [scheduleSnap, modeSnap, kgSnap, diaSnap] = await Promise.all([
          get(scheduleRef),
          get(modeRef),
          get(configKgRef),
          get(configDiameterRef),
        ])

        if (scheduleSnap.exists()) setFeedingTimes(scheduleSnap.val())
        if (modeSnap.exists()) setManualMode(modeSnap.val())
        if (kgSnap.exists()) setFeedKg(String(kgSnap.val()))
        if (diaSnap.exists()) setFeederDiameter(String(diaSnap.val()))
      } catch {
        toast.error("Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    loadInitial()

    const unsub1 = onValue(scheduleRef, (snap) => {
      setFeedingTimes(snap.val() || [])
    })
    const unsub2 = onValue(modeRef, (snap) => {
      if (typeof snap.val() === "boolean") setManualMode(snap.val())
    })

    const today = new Date().toISOString().split("T")[0]
    const logsRef = ref(db, `feed_logs/${pondId}/${today}`)
    const unsub3 = onValue(logsRef, (snap) => {
      const val = snap.val()
      const entries = val ? Object.values(val) : []
      setLogs(entries.sort((a: any, b: any) => a.time.localeCompare(b.time)))
    })

    return () => {
      unsub1()
      unsub2()
      unsub3()
    }
  }, [pondId])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const hour = now.getHours().toString().padStart(2, "0")
      const minute = now.getMinutes().toString().padStart(2, "0")
      const timeNow = `${hour}:${minute}`

      if (now.getMinutes() !== lastCheckMinute && feedingTimes.includes(timeNow)) {
        logFeeding("auto")
        toast.success(`🐟 Auto feeding initiated for ${pondId}`)
        setLastCheckMinute(now.getMinutes())
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [feedingTimes, pondId, lastCheckMinute])

  const updateSchedule = async (times: string[]) => {
    try {
      const unique = [...new Set(times)].sort()
      await set(scheduleRef, unique)
      toast.success("Schedule updated")
    } catch {
      toast.error("Failed to update schedule")
    }
  }

  const updateMode = async (val: boolean) => {
    try {
      setManualMode(val)
      await set(modeRef, val)
    } catch {
      toast.error("Failed to update mode")
    }
  }

  const addTime = () => {
    if (!newTime || feedingTimes.includes(newTime)) return
    const updated = [...feedingTimes, newTime].sort()
    setFeedingTimes(updated)
    updateSchedule(updated)
    setNewTime("")
  }

  const removeTime = (time: string) => {
    const updated = feedingTimes.filter((t) => t !== time)
    setFeedingTimes(updated)
    updateSchedule(updated)
  }

  const updateConfig = async (kg: string, dia: string) => {
    await set(configKgRef, parseFloat(kg))
    await set(configDiameterRef, parseInt(dia))
    toast.success("Feeding configuration saved")
  }

  const logFeeding = async (method = "manual") => {
    const now = new Date()
    const date = now.toISOString().split("T")[0]
    const time = now.toTimeString().slice(0, 5)

    await set(ref(db, `feed_logs/${pondId}/${date}/${time}`), {
      time,
      quantity: feedKg,
      method,
      status: "success",
    })
  }

  const triggerManualFeed = async () => {
    await set(ref(db, `${pondId}/manual_feed`), true)
    await logFeeding("manual")
    toast.success(`Manual feed triggered for ${pondId}`)
  }


  return (
    <div className="flex flex-col min-h-screen">
      <PondHeader
        title="Feeding Management"
        description="Control and monitor fish feeding"
      />
      <main className="flex-1 px-4 pb-20 md:pb-6 space-y-6 md:px-6">
        <Tabs defaultValue="schedule" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:max-w-[400px]">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule" className="space-y-4 mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fish className="w-5 h-5 text-teal-600" />
                  Feeding Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-4">
                  <Label className="text-gray-900 dark:text-white font-medium">
                    Manual Feeding Mode
                  </Label>
                  <Switch
                    id="manual-mode"
                    checked={manualMode}
                    onCheckedChange={updateMode}
                  />
                </div>
                <div className="flex w-full justify-center">
                <Button
                  className="w-full justify-center flex items-center md:max-w-[300px] bg-teal-800 hover:bg-teal-700 text-white"
                  onClick={triggerManualFeed}
                >
                  Feed Now
                </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  Feeding Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 items-center py-4">
                  <input
                    type="time"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="border rounded p-2 flex-1"
                  />
                  <Button onClick={addTime} className="bg-teal-800 hover:bg-teal-700">Add</Button>
                </div>
                {loading ? (
                  <div className="text-center py-4 text-gray-500">
                    Loading...
                  </div>
                ) : feedingTimes.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No feeding times
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {feedingTimes.map((time) => (
                      <div
                        key={time}
                        className="flex items-center justify-between py-3"
                      >
                        <span className="text-gray-900 dark:text-white font-medium">
                          {formatTimeTo12Hour(time)} – {feedKg} kg
                        </span>
                        <button onClick={() => removeTime(time)}>
                          <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardContent className="p-4 space-y-4">
                <h2 className="text-xl font-bold text-teal-900 border-b pb-2">
                  Feeding Configuration
                </h2>

                <div className="flex flex-col gap-2">
                  <Label className="text-teal-900 font-medium">
                    Feed Quantity (kg)
                  </Label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={feedKg}
                    onChange={(e) => setFeedKg(e.target.value)}
                    onBlur={() => updateConfig(feedKg, feederDiameter)}
                    className="border rounded p-2"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label className="text-teal-900 font-medium">
                    Feeder Diameter (mm)
                  </Label>
                  <select
                    value={feederDiameter}
                    onChange={(e) => {
                      setFeederDiameter(e.target.value)
                      updateConfig(feedKg, e.target.value)
                    }}
                    className="border rounded p-2"
                  >
                    <option value="20">20 mm</option>
                    <option value="30">30 mm</option>
                    <option value="40">40 mm</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Feeding History</CardTitle>
                <CardDescription>Today’s logs</CardDescription>
              </CardHeader>
              <CardContent>
                {logs.length === 0 ? (
                  <div className="text-gray-500">No logs yet today</div>
                ) : (
                  <div className="space-y-4">
                    {logs.map((log, i) => (
                      <div key={i} className="flex items-start">
                        <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {log.method === "manual" ? "Manual" : "Auto"} feed
                            completed
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {log.time || "--"} – {log.quantity || "?"} kg
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

// "use client"

// import { use, useEffect, useState } from "react"
// import { ChevronRight, Clock, Trash2 } from "lucide-react"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Switch } from "@/components/ui/switch"
// import { Label } from "@/components/ui/label"
// import { Button } from "@/components/ui/button"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { PondHeader } from "@/components/pond-header"
// import { db } from "@/lib/firebase"
// import { ref, onValue, set, get } from "firebase/database"
// import toast from "react-hot-toast"

// const formatTimeTo12Hour = (time24h: string) => {
//   try {
//     const [hourStr, minute] = time24h.split(":")
//     let hour = parseInt(hourStr, 10)
//     const period = hour >= 12 ? "PM" : "AM"
//     hour = hour % 12
//     hour = hour === 0 ? 12 : hour
//     return `${hour}:${minute} ${period}`
//   } catch {
//     return time24h
//   }
// }

// export default function Feeding({ params }: { params: Promise<{ pondId: string }> }) {
//   const {pondId} = use(params)
//   const [feedingTimes, setFeedingTimes] = useState<string[]>([])
//   const [manualMode, setManualMode] = useState(false)
//   const [newTime, setNewTime] = useState("")
//   const [loading, setLoading] = useState(true)
//   const [feedKg, setFeedKg] = useState("1.0")
//   const [feederDiameter, setFeederDiameter] = useState("30")

//   useEffect(() => {
//     const scheduleRef = ref(db, `${pondId}/feeding_schedule`)
//     const modeRef = ref(db, `${pondId}/feeding_mode`)
//     const configRef = ref(db, `${pondId}/feeding_config`)

//     const loadData = async () => {
//       try {
//         const [scheduleSnap, modeSnap, configSnap] = await Promise.all([
//           get(scheduleRef),
//           get(modeRef),
//           get(configRef),
//         ])

//         const scheduleVal = scheduleSnap.val()
//         const modeVal = modeSnap.val()
//         const configVal = configSnap.val()

//         if (Array.isArray(scheduleVal)) setFeedingTimes(scheduleVal)
//         if (typeof modeVal === "boolean") setManualMode(modeVal)
//         if (configVal) {
//           setFeedKg(configVal.feed_kg?.toString() || "1.0")
//           setFeederDiameter(configVal.feeder_diameter?.toString() || "30")
//         }
//       } catch (error) {
//         toast.error("Failed to load feeding data")
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadData()

//     const unsubSchedule = onValue(scheduleRef, (snap) => {
//       const val = snap.val()
//       setFeedingTimes(Array.isArray(val) ? val : [])
//     })

//     const unsubMode = onValue(modeRef, (snap) => {
//       const val = snap.val()
//       if (typeof val === "boolean") setManualMode(val)
//     })

//     const unsubConfig = onValue(configRef, (snap) => {
//       const val = snap.val()
//       if (val) {
//         setFeedKg(val.feed_kg?.toString() || "1.0")
//         setFeederDiameter(val.feeder_diameter?.toString() || "30")
//       }
//     })

//     return () => {
//       unsubSchedule()
//       unsubMode()
//       unsubConfig()
//     }
//   }, [pondId])

//   const updateSchedule = async (times: string[]) => {
//     try {
//       await set(ref(db, `${pondId}/feeding_schedule`), [...new Set(times)].sort())
//       setFeedingTimes(times)
//       toast.success("Schedule updated")
//     } catch {
//       toast.error("Failed to update schedule")
//     }
//   }

//   const updateMode = async (val: boolean) => {
//     try {
//       setManualMode(val)
//       await set(ref(db, `${pondId}/feeding_mode`), val)
//     } catch {
//       toast.error("Failed to update mode")
//     }
//   }

//   const addTime = () => {
//     if (!newTime || feedingTimes.includes(newTime)) return
//     const updated = [...feedingTimes, newTime].sort()
//     updateSchedule(updated)
//     setNewTime("")
//   }

//   const removeTime = (time: string) => {
//     const updated = feedingTimes.filter((t) => t !== time)
//     updateSchedule(updated)
//   }

//   const updateConfig = async (key: "feed_kg" | "feeder_diameter", value: string) => {
//     try {
//       const refPath = ref(db, `${pondId}/feeding_config`)
//       const existing = (await get(refPath)).val() || {}
//       const updated = {
//         ...existing,
//         [key]: key === "feed_kg" ? parseFloat(value) : parseInt(value),
//       }
//       await set(refPath, updated)
//     } catch {
//       toast.error("Failed to update config")
//     }
//   }

//   return (
//     <div className="flex flex-col min-h-screen">
//       <PondHeader title="Feeding Management" description="Control and monitor fish feeding" />
//       <main className="flex-1 px-4 pb-20 md:pb-6 space-y-6 md:px-6">
//         <Tabs defaultValue="schedule" className="w-full">
//           <TabsList className="grid w-full grid-cols-2 md:max-w-[400px]">
//             <TabsTrigger value="schedule">Schedule</TabsTrigger>
//             <TabsTrigger value="history">History</TabsTrigger>
//           </TabsList>

//           <TabsContent value="schedule" className="space-y-4 mt-6">
//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader>
//                 <CardTitle className="flex items-center">
//                   <Clock className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
//                   Feeding Schedule
//                 </CardTitle>
//                 <CardDescription>Configure automatic feeding times</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex gap-2 items-center py-4">
//                   <input
//                     type="time"
//                     value={newTime}
//                     onChange={(e) => setNewTime(e.target.value)}
//                     className="border rounded p-2 flex-1"
//                   />
//                   <Button onClick={addTime}>Add</Button>
//                 </div>
//                 {loading ? (
//                   <div className="text-center py-4 text-gray-500">Loading...</div>
//                 ) : feedingTimes.length === 0 ? (
//                   <div className="text-center py-4 text-gray-500">No feeding times</div>
//                 ) : (
//                   <div className="divide-y divide-gray-100 dark:divide-gray-700">
//                     {feedingTimes.map((time) => (
//                       <div key={time} className="flex items-center justify-between py-3">
//                         <span className="text-gray-900 dark:text-white font-medium">
//                           {formatTimeTo12Hour(time || "8:30")} - {feedKg} kg
//                         </span>
//                         <button onClick={() => removeTime(time)}>
//                           <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
//                         </button>
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>

//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader>
//                 <CardTitle>Feeding Configuration</CardTitle>
//                 <CardDescription>Configure feed amount and feeder diameter</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex flex-col gap-2">
//                   <Label className="text-teal-900 dark:text-white font-medium">Feed Quantity (kg)</Label>
//                   <input
//                     type="number"
//                     step="0.1"
//                     min="0.1"
//                     value={feedKg}
//                     onChange={(e) => {
//                       setFeedKg(e.target.value)
//                       updateConfig("feed_kg", e.target.value)
//                     }}
//                     className="border rounded p-2"
//                   />
//                 </div>

//                 <div className="flex flex-col gap-2">
//                   <Label className="text-teal-900 dark:text-white font-medium">Feeder Diameter (mm)</Label>
//                   <select
//                     value={feederDiameter}
//                     onChange={(e) => {
//                       setFeederDiameter(e.target.value)
//                       updateConfig("feeder_diameter", e.target.value)
//                     }}
//                     className="border rounded p-2"
//                   >
//                     <option value="20">20 mm</option>
//                     <option value="30">30 mm</option>
//                     <option value="40">40 mm</option>
//                   </select>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="history" className="mt-6">
//             <Card className="bg-white dark:bg-gray-800 border-0 shadow-lg">
//               <CardHeader>
//                 <CardTitle>Feeding History</CardTitle>
//                 <CardDescription>Recent feeding activities</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   <div className="flex items-start">
//                     <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3"></div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">Automatic feeding completed</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Today, 12:00 PM - 200g dispensed</p>
//                     </div>
//                   </div>
//                   <div className="flex items-start">
//                     <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
//                     <div>
//                       <p className="text-sm font-medium text-gray-900 dark:text-white">Manual feeding</p>
//                       <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 6:30 PM - 150g dispensed</p>
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