"use client"
// pages/log-report.tsx
import { useForm } from "react-hook-form"
import { useState } from "react"
// import { db } from "@/lib/firebase" // <-- adjust based on your Firebase config
import { collection, addDoc, Timestamp } from "firebase/firestore"
import toast from "react-hot-toast"

export default function LogReportPage() {
  const { register, handleSubmit, reset } = useForm()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (data: any) => {
    setLoading(true)
    // try {
    //   await addDoc(collection(db, "pond_reports"), {
    //     ...data,
    //     createdAt: Timestamp.now(),
    //   })
    //   reset()
    //   alert("Report logged successfully!")
    // } catch (err) {
    //   console.error("Error saving report:", err)
    //   alert("Failed to save report.")
    // }
      reset()
    toast.success("✅ Report logged successfully!")

    reset()
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-3 text-white">Log Pond Report</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-4 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block font-medium">Disease Symptoms</label>
          <textarea {...register("symptoms")} className="w-full border p-2 rounded" rows={3} required />
        </div>

        <div>
          <label className="block font-medium">Treatment / Cure Measures</label>
          <textarea {...register("treatment")} className="w-full border p-2 rounded" rows={3} required />
        </div>

        <div>
          <label className="block font-medium">Water Conditions</label>
          <textarea {...register("waterConditions")} className="w-full border p-2 rounded" rows={3} placeholder="e.g., Temperature, DO, pH..." />
        </div>

        <div>
          <label className="block font-medium">Outcome / Result</label>
          <textarea {...register("outcome")} className="w-full border p-2 rounded" rows={3} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 justify-center flex w-full"
        >
          {loading ? "Submitting..." : "Submit Report"}
        </button>
      </form>
    </div>
  )
}
