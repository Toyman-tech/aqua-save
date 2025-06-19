"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

export interface Pond {
  id: string
  name: string
  status: "active" | "inactive" | "maintenance"
  data: {
    temperature: number
    ph: number
    airQuality: string
    waterLevel: number
    lastUpdated: string
  }
}

interface PondContextType {
  ponds: Pond[]
  selectedPond: Pond | null
  selectPond: (pondId: string) => void
  addPond: (pond: Omit<Pond, "id">) => void
  removePond: (pondId: string) => void
  updatePondData: (pondId: string, data: Partial<Pond["data"]>) => void
}

const PondContext = createContext<PondContextType | undefined>(undefined)

const defaultPonds: Pond[] = [
  {
    id: "pond-a",
    name: "Pond A",
    status: "active",
    data: {
      temperature: 26.5,
      ph: 7.4,
      airQuality: "Normal",
      waterLevel: 80,
      lastUpdated: new Date().toISOString(),
    },
  },
  {
    id: "pond-b",
    name: "Pond B",
    status: "active",
    data: {
      temperature: 25.8,
      ph: 7.2,
      airQuality: "Good",
      waterLevel: 75,
      lastUpdated: new Date().toISOString(),
    },
  },
  {
    id: "pond-c",
    name: "Pond C",
    status: "maintenance",
    data: {
      temperature: 24.2,
      ph: 6.8,
      airQuality: "Normal",
      waterLevel: 60,
      lastUpdated: new Date().toISOString(),
    },
  },
]

export function PondProvider({ children }: { children: React.ReactNode }) {
  const [ponds, setPonds] = useState<Pond[]>(defaultPonds)
  const [selectedPond, setSelectedPond] = useState<Pond | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize selected pond from URL or default to Pond A
  useEffect(() => {
    const pathSegments = pathname.split("/")
    const pondIdFromUrl = pathSegments[1] // e.g., 'pond-a' from '/pond-a/water-management'

    if (pondIdFromUrl && pondIdFromUrl.startsWith("pond-")) {
      const pond = ponds.find((p) => p.id === pondIdFromUrl)
      if (pond) {
        setSelectedPond(pond)
        return
      }
    }

    // Default to Pond A if no valid pond in URL
    const defaultPond = ponds.find((p) => p.id === "pond-a") || ponds[0]
    if (defaultPond && !selectedPond) {
      setSelectedPond(defaultPond)
    }
  }, [pathname, ponds, selectedPond])

  const selectPond = (pondId: string) => {
    const pond = ponds.find((p) => p.id === pondId)
    if (pond) {
      setSelectedPond(pond)

      // Update URL to reflect selected pond
      const currentPage = pathname.split("/").slice(2).join("/") || ""
      const newPath = `/${pondId}${currentPage ? "/" + currentPage : ""}`
      router.push(newPath)
    }
  }

  const addPond = (newPond: Omit<Pond, "id">) => {
    const id = `pond-${String.fromCharCode(97 + ponds.length)}` // pond-a, pond-b, etc.
    const pond: Pond = { ...newPond, id }
    setPonds((prev) => [...prev, pond])
  }

  const removePond = (pondId: string) => {
    setPonds((prev) => prev.filter((p) => p.id !== pondId))

    // If removing selected pond, select another one
    if (selectedPond?.id === pondId) {
      const remainingPonds = ponds.filter((p) => p.id !== pondId)
      if (remainingPonds.length > 0) {
        selectPond(remainingPonds[0].id)
      }
    }
  }

  const updatePondData = (pondId: string, newData: Partial<Pond["data"]>) => {
    setPonds((prev) =>
      prev.map((pond) =>
        pond.id === pondId
          ? { ...pond, data: { ...pond.data, ...newData, lastUpdated: new Date().toISOString() } }
          : pond,
      ),
    )

    // Update selected pond if it's the one being updated
    if (selectedPond?.id === pondId) {
      setSelectedPond((prev) => (prev ? { ...prev, data: { ...prev.data, ...newData } } : null))
    }
  }

  return (
    <PondContext.Provider
      value={{
        ponds,
        selectedPond,
        selectPond,
        addPond,
        removePond,
        updatePondData,
      }}
    >
      {children}
    </PondContext.Provider>
  )
}

export function usePond() {
  const context = useContext(PondContext)
  if (context === undefined) {
    throw new Error("usePond must be used within a PondProvider")
  }
  return context
}
