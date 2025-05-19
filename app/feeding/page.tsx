"use client"

import { useEffect, useState } from "react"
import { ChevronRight, Trash2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { db } from "@/lib/firebase"
import { ref, onValue, set, get } from "firebase/database"
import toast from "react-hot-toast"

// Function to format time from 24-hour to 12-hour format
const formatTimeTo12Hour = (time24h: string) => {
  try {
    // Parse the time string (expected format: "HH:MM")
    const [hourStr, minute] = time24h.split(":");
    let hour = parseInt(hourStr, 10);
    
    // Determine AM/PM
    const period = hour >= 12 ? "PM" : "AM";
    
    // Convert hour to 12-hour format
    hour = hour % 12;
    hour = hour === 0 ? 12 : hour; // Handle midnight (0:00) as 12 AM
    
    // Format the time string
    return `${hour}:${minute} ${period}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return time24h; // Return original if there's an error
  }
}

export default function Feeding() {
  const [feedingTimes, setFeedingTimes] = useState<string[]>([])
  const [manualMode, setManualMode] = useState(false)
  const [newTime, setNewTime] = useState("")
  const [loading, setLoading] = useState(true)

  // Load schedule and mode from Firebase
  useEffect(() => {
    setLoading(true)
    
    // Reference to the feeding schedule in Firebase
    const scheduleRef = ref(db, "feeding_schedule")
    const modeRef = ref(db, "feeding_mode")

    // First, get the initial data immediately
    const loadInitialData = async () => {
      try {
        // Get schedule data
        const scheduleSnapshot = await get(scheduleRef)
        const scheduleVal = scheduleSnapshot.val()
        if (scheduleVal) {
          console.log("Initial schedule loaded:", scheduleVal)
          setFeedingTimes(scheduleVal)
        } else {
          console.log("No initial schedule found")
          setFeedingTimes([])
        }

        // Get mode data
        const modeSnapshot = await get(modeRef)
        const modeVal = modeSnapshot.val()
        if (typeof modeVal === "boolean") {
          setManualMode(modeVal)
        }
      } catch (error) {
        console.error("Error loading initial data:", error)
        toast.error("Failed to load feeding data")
      } finally {
        setLoading(false)
      }
    }

    // Load initial data
    loadInitialData()

    // Then set up real-time listeners
    const unsubSchedule = onValue(scheduleRef, (snapshot) => {
      const val = snapshot.val()
      if (val) {
        console.log("Schedule updated via listener:", val)
        setFeedingTimes(val)
      } else {
        // Handle case where data is deleted or null
        setFeedingTimes([])
      }
      setLoading(false)
    })

    const unsubMode = onValue(modeRef, (snapshot) => {
      const val = snapshot.val()
      if (typeof val === "boolean") setManualMode(val)
    })

    return () => {
      unsubSchedule()
      unsubMode()
    }
  }, [])

  const updateSchedule = async (times: string[]) => {
    try {
      const uniqueTimes = [...new Set(times)].sort() // optional: remove duplicates
      await set(ref(db, "feeding_schedule"), uniqueTimes)
      console.log("Schedule updated:", uniqueTimes)
      toast.success("✅ Schedule updated")
    } catch (error) {
      console.error("❌ Error updating schedule", error)
      toast.error("⚠️ Failed to update schedule")
    }
  }
  
  const updateMode = async (val: boolean) => {
    try {
      setManualMode(val)
      await set(ref(db, "feeding_mode"), val)
      toast.success(val ? "Manual mode activated" : "Automatic mode activated")
    } catch (error) {
      console.error("Error updating mode:", error)
      toast.error("Failed to update feeding mode")
    }
  }

  const addTime = () => {
    if (!newTime || feedingTimes.includes(newTime)) return
    const updated = [...feedingTimes, newTime].sort()

    // Only update if different
    if (JSON.stringify(updated) !== JSON.stringify(feedingTimes)) {
      setFeedingTimes(updated)
      updateSchedule(updated)
    }

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

            {loading ? (
              <div className="py-8 text-center text-gray-500">Loading schedule...</div>
            ) : (
              <div className="divide-y divide-gray-100">
                {feedingTimes.length === 0 ? (
                  <div className="py-4 text-center text-gray-500">No feeding times scheduled</div>
                ) : (
                  feedingTimes.map((time) => (
                    <div key={time} className="flex items-center justify-between w-full py-4">
                      <span className="text-teal-900 font-medium">
                        {formatTimeTo12Hour(time)}
                      </span>
                      <button onClick={() => removeTime(time)}>
                        <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}