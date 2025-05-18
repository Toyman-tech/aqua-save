"use client"

import { cn } from "@/lib/utils"
import { User, Droplet, Hand, Camera, Settings, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/water-management", label: "Water Management", icon: Droplet },
    { href: "/feeding", label: "Feeding", icon: Hand },
    { href: "/monitoring", label: "Monitoring", icon: Camera },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div
      className={cn(
        "w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-shrink-0",
        className,
      )}
    >
      <div className="p-6">
        <h1 className="text-2xl font-bold text-teal-800 dark:text-teal-500">Smart Aquaculture</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Catfish Pond Management</p>
      </div>

      <nav className="mt-6 mb-2">
        <ul className="space-y-2 ">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center  py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400 rounded-none flex w-full"
                      : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50",
                  )}
                >
                  <div className="px-4 flex flex-row">
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 p-6">
        <div className="bg-teal-50 dark:bg-teal-900/30 rounded-lg p-4">
          <div className="flex items-center">
            <User className="w-8 h-8 text-teal-700 dark:text-teal-500 bg-white dark:bg-gray-800 p-1.5 rounded-full" />
            <div className="ml-3">
              <p className="text-sm font-medium text-teal-800 dark:text-teal-400">PondIQ User</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
