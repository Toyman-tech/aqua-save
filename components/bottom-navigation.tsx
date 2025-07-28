"use client"

import { User, Hand, Camera, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function BottomNavigation() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Dashboard", icon: User },
    { href: "/feeding", label: "Feeding", icon: Hand },
    { href: "/monitoring", label: "Monitoring", icon: Camera },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-4">
      <div className="flex justify-around max-w-3xl mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn("flex flex-col items-center p-2", isActive ? "text-teal-800" : "text-teal-900/60")}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
