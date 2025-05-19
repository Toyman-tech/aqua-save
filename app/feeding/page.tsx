"use client"

import { useEffect, useState } from "react"
import { ChevronRight, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { db } from "@/lib/firebase"
import { ref, onValue, set } from "firebase/database"
import toast from "react-hot-toast"

export default function Feeding() {
  const [feedingTimes, setFeedingTimes] = useState<string[]>([])
  const [manualMode, setManualMode] = useState(false)
  const [newTime, setNewTime] = useState("")

  // Load schedule and mode from Firebase
  useEffect(() => {
    const scheduleRef = ref(db, "pondData/feedingSchedule")
    const modeRef = ref(db, "pondData/feedingMode")

    onValue(scheduleRef, (snapshot) => {
      const val = snapshot.val()
      if (val) setFeedingTimes(val)
    })

    onValue(modeRef, (snapshot) => {
      const val = snapshot.val()
      if (typeof val === "boolean") setManualMode(val)
    })
  }, [])

  const updateSchedule = async (times: string[]) => {
    try {
      await set(ref(db, "pondData/feeding_schedule"), times)
      console.log("✅ Schedule updated:", times)
      toast.success(`✅ Schedule updated: ${times}`)
    } catch (error) {
      console.error("❌ Failed to update schedule", error)
      toast.error("⚠️ Failed to update schedule")
    }
  }

  const updateMode = async (val: boolean) => {
    setManualMode(val)
    await set(ref(db, "pondData/feedingMode"), val)
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

  return (
    <div className="flex flex-col min-h-screen">
      <header className="p-6 pt-12">
        <h1 className="text-3xl font-bold text-white">Feeding</h1>
      </header>

      <main className="flex-1 px-4 pb-20 space-y-4 md:w-3xl md:mx-auto">
        {/* Feeding Mode */}
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-teal-900">Feeding Mode</h2>
            </div>

            <div className="flex items-center justify-between py-4">
              <Label htmlFor="manual-mode" className="text-teal-900 font-medium text-lg">
                Manual
              </Label>
              <Switch id="manual-mode" checked={manualMode} onCheckedChange={updateMode} />
            </div>
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <h2 className="text-xl font-bold text-teal-900">Schedule</h2>
            </div>

            <div className="flex gap-2 items-center py-4">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="border rounded p-2 flex-1"
              />
              <button
                onClick={addTime}
                className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-500"
              >
                Add
              </button>
            </div>

            <div className="divide-y divide-gray-100">
              {feedingTimes.map((time) => (
                <div key={time} className="flex items-center justify-between w-full py-4">
                  <span className="text-teal-900 font-medium">{time}</span>
                  <button onClick={() => removeTime(time)}>
                    <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

