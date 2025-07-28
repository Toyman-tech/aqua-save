"use client"

import { PondSwitcher } from "@/components/pond-switcher"
import { usePond } from "@/contexts/pond-context"

interface PondHeaderProps {
  title: string
  description?: string
}

export function PondHeader({ title, description }: PondHeaderProps) {
  const { selectedPond } = usePond()

  return (
    <>
      {/* Mobile Header */}
      <header className="p-6 pt-12 md:hidden">
        <div className="mb-4">
          <PondSwitcher />
        </div>
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        {description && <p className="text-white mt-1">{description}</p>}
      </header>

      {/* Desktop Header */}
      <header className="hidden md:block p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-white dark:text-white">{title}</h1>
            {description && <p className="text-white dark:text-white mt-1">{description}</p>}
          </div>
          <div className="w-64">
            <PondSwitcher />
          </div>
        </div>
        {selectedPond && (
          <div className="text-sm text-white dark:text-gray-400">
            Currently viewing: <span className="font-medium text-white dark:text-white">{selectedPond.name}</span>
          </div>
        )}
      </header>
    </>
  )
}
