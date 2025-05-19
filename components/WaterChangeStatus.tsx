import { useEffect, useState } from "react"
import { ref, onValue } from "firebase/database"
import { db } from "@/lib/firebase"

export default function WaterChangeStatus() {
    const [lastChange, setLastChange] = useState("");
    const [formattedDate, setFormattedDate] = useState("");
  
    useEffect(() => {
      const refPath = ref(db, "/last_water_change");
      const unsubscribe = onValue(refPath, (snapshot) => {
        const ts = snapshot.val();
        if (ts) {
          setLastChange(ts);
          
          // Format the timestamp
          const date = new Date(ts);
          
          // Get day of week
          const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
          
          // Get day of month with ordinal suffix
          const day = date.getDate();
          const ordinalSuffix = getOrdinalSuffix(day);
          
          // Get month and year
          const month = date.toLocaleDateString('en-US', { month: 'long' });
          const year = date.getFullYear();
          
          // Get time in 12-hour format with am/pm
          const time = date.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
          });
          
          // Combine all parts
          const formatted = `${dayOfWeek} ${day}${ordinalSuffix} of ${month}, ${year}. ${time}`;
          setFormattedDate(formatted);
        }
      });
      
      return () => unsubscribe();
    }, [db]);
    
    // Helper function to get ordinal suffix for date
    const getOrdinalSuffix = (day : number) => {
      if (day > 3 && day < 21) return 'th';
      switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
  return (
    <div className="text-sm text-gray-700  px-3 flex justify-center">
      Last water change: {formattedDate || "Not yet recorded"}
    </div>
  )
}
