import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "@/lib/firebase"

export default function WaterChangeStatus() {
  const [lastChange, setLastChange] = useState("")

  useEffect(() => {
    const refPath = ref(db, "/last_water_change")
    const unsubscribe = onValue(refPath, (snapshot) => {
      const ts = snapshot.val()
      if (ts) {
        setLastChange(ts)
      }
    })
    return () => unsubscribe()
  }, [])

  return (
    <div className="text-sm text-gray-700  px-3 flex justify-center">
      Last water change: {lastChange || "Not yet recorded"}
    </div>
  )
}
