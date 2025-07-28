"use client"

import { useForm } from "react-hook-form"
import { useState } from "react"
import { toast } from "react-hot-toast"
// import { collection, addDoc, Timestamp } from "firebase/firestore"
// import { db } from "@/lib/firebase"

export default function LogReportPage() {
  const { register, handleSubmit, reset } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: any) => {
    setLoading(true)
    try {
      // Simulate async operation (e.g., saving to database)
      await new Promise((resolve) => setTimeout(resolve, 3000))
      // await addDoc(collection(db, "pond_reports"), {
      //   ...data,
      //   createdAt: Timestamp.now(),
      // })
      toast.success("✅ Report submitted successfully!")
      reset()
    } catch (err) {
      console.error("Error saving report:", err)
      toast.error("❌ Failed to save report.")
    } finally {
      setLoading(false)
    }
  }

 if(loading) return(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20">
      <div className="bg-white rounded-xl shadow-lg flex flex-col items-center px-8 py-8">
        <div className="w-14 h-14 rounded-full border-4 border-gray-200 border-t-teal-600 animate-spin mb-6" />
        <p className="text-base text-gray-700 font-medium">Submitting your report...</p>
        <p className="text-sm text-gray-400 mt-2">This may take a few seconds</p>
      </div>
    </div>
  )
  return (
    <div className=" mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-4 text-white">Pond Incident Report</h2>
      <p className="text-white/80 mb-6 text-sm">
        Help us improve Aqua-AI by submitting real-world health or behavior observations in your pond.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
        {/* Observation Type */}
        <div>
          <label className="block font-semibold mb-1">Type of Incident</label>
          <select {...register("incidentType")} className="w-full border p-2 rounded" required>
            <option value="">-- Select --</option>
            <option value="disease">Disease Symptoms</option>
            <option value="death">Sudden Fish Death</option>
            <option value="feeding">Feeding Behavior Issue</option>
            <option value="growth">Abnormal Growth</option>
            <option value="water">Water Quality Concern</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Detailed Symptoms */}
        <div>
          <label className="block font-semibold mb-1">What symptoms did you observe?</label>
          <textarea
            {...register("symptoms")}
            className="w-full border p-2 rounded"
            rows={4}
            placeholder="Describe color changes, movement, wounds, etc."
            required
          />
        </div>

        {/* Number Affected */}
        <div>
          <label className="block font-semibold mb-1">Estimated Number of Fish Affected</label>
          <input
            type="number"
            {...register("fishAffected")}
            className="w-full border p-2 rounded"
            placeholder="e.g. 12"
            required
          />
        </div>

        {/* Treatment Given */}
        <div>
          <label className="block font-semibold mb-1">What actions or treatment did you take?</label>
          <textarea
            {...register("treatment")}
            className="w-full border p-2 rounded"
            rows={3}
            placeholder="e.g., salt bath, medication, isolation..."
          />
        </div>

        {/* Water Conditions */}
        <div>
          <label className="block font-semibold mb-1">Water Conditions (if known)</label>
          <textarea
            {...register("waterConditions")}
            className="w-full border p-2 rounded"
            rows={3}
            placeholder="e.g., Temperature: 28°C, pH: 6.8, Cloudy water..."
          />
        </div>

        {/* Outcome */}
        <div>
          <label className="block font-semibold mb-1">What happened after treatment?</label>
          <textarea
            {...register("outcome")}
            className="w-full border p-2 rounded"
            rows={3}
            placeholder="e.g., fish recovered, more deaths, no change..."
          />
        </div>

        {/* Optional File Upload */}
        {/* 
        <div>
          <label className="block font-semibold mb-1">Upload Image/Video (optional)</label>
          <input type="file" accept="image/*,video/*" className="w-full border p-2 rounded" />
        </div> 
        */}

        <button
          type="submit"
          disabled={loading}
          className="bg-teal-700 hover:bg-teal-600 text-white px-4 py-2 rounded w-full font-semibold"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  )
}

// "use client"

// // pages/log-report.tsx
// import { useForm } from "react-hook-form"
// import { useState } from "react"
// // import { db } from "@/lib/firebase" // <-- adjust based on your Firebase config
// import { collection, addDoc, Timestamp } from "firebase/firestore"
// import toast from "react-hot-toast"

// export default function LogReportPage() {
//   const { register, handleSubmit, reset } = useForm()
//   const [loading, setLoading] = useState(false)

//   const onSubmit = async (data: any) => {
//     setLoading(true)
//     // try {
//     //   await addDoc(collection(db, "pond_reports"), {
//     //     ...data,
//     //     createdAt: Timestamp.now(),
//     //   })
//     //   reset()
//     //   alert("Report logged successfully!")
//     // } catch (err) {
//     //   console.error("Error saving report:", err)
//     //   alert("Failed to save report.")
//     // }
//       reset()
//     toast.success("✅ Report logged successfully!")

//     reset()
//     setLoading(false)
//   }

//   return (
//     <div className="max-w-2xl mx-auto px-4 py-10">
//       <h2 className="text-2xl font-bold mb-3 text-white">Log Pond Report</h2>

//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-4 bg-white p-6 rounded-lg shadow">
//         <div>
//           <label className="block font-medium">Disease Symptoms</label>
//           <textarea {...register("symptoms")} className="w-full border p-2 rounded" rows={3} required />
//         </div>

//         <div>
//           <label className="block font-medium">Treatment / Cure Measures</label>
//           <textarea {...register("treatment")} className="w-full border p-2 rounded" rows={3} required />
//         </div>

//         <div>
//           <label className="block font-medium">Water Conditions</label>
//           <textarea {...register("waterConditions")} className="w-full border p-2 rounded" rows={3} placeholder="e.g., Temperature, DO, pH..." />
//         </div>

//         <div>
//           <label className="block font-medium">Outcome / Result</label>
//           <textarea {...register("outcome")} className="w-full border p-2 rounded" rows={3} />
//         </div>

//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 justify-center flex w-full"
//         >
//           {loading ? "Submitting..." : "Submit Report"}
//         </button>
//       </form>
//     </div>
//   )
// }
