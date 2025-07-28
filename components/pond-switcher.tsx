"use client"

import { Check, ChevronDown, Droplet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { usePond } from "@/contexts/pond-context"
import { cn } from "@/lib/utils"

interface PondSwitcherProps {
  className?: string
}

export function PondSwitcher({ className }: PondSwitcherProps) {
  const { ponds, selectedPond, selectPond } = usePond()

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "maintenance":
        return "bg-yellow-500"
      case "inactive":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
            className,
          )}
        >
          <div className="flex items-center">
            <Droplet className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
            <span className="font-medium">{selectedPond?.name || "Select Pond"}</span>
            {selectedPond && <div className={cn("w-2 h-2 rounded-full ml-2", getStatusColor(selectedPond.status))} />}
          </div>
          <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {ponds.map((pond) => (
          <DropdownMenuItem
            key={pond.id}
            onClick={() => selectPond(pond.id)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center">
              <Droplet className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
              <span>{pond.name}</span>
              <div className={cn("w-2 h-2 rounded-full ml-2", getStatusColor(pond.status))} />
            </div>
            {selectedPond?.id === pond.id && <Check className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
