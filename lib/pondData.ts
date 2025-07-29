// lib/pondData.ts

export type PondData = {
    id: string
    name: string
    status: "active" | "maintenance" | "inactive"
    data: {
      temperature: number
      ph: number
      airQuality: string
      waterLevel: number
      lastWaterChanged: string
      lastFed: string
      alerts: number
    }
  }
  
  export const mockPonds: PondData[] = [
    {
      id: "pond-a",
      name: "Pond A",
      status: "active",
      data: {
        temperature: 26.5,
        ph: 7.4,
        airQuality: "Normal",
        waterLevel: 80,
        lastWaterChanged: "1 hour ago",
        lastFed: "2 hours ago",
        alerts: 0,
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
        lastWaterChanged: "3 hours ago",
        lastFed: "1 hour ago",
        alerts: 0,
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
        lastWaterChanged: "2 hours ago",
        lastFed: "4 hours ago",
        alerts: 1,
      },
    },
  ]
  
  export function getPondById(id: string) {
    return mockPonds.find((pond) => pond.id === id)
  }
  