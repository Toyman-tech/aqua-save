"use client"

import { cn } from "@/lib/utils"
import { Home, Droplet, Hand, Camera, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { usePond } from "@/contexts/pond-context"

export function MobileNavigation() {
  const pathname = usePathname()
  const { selectedPond } = usePond()

  const navItems = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/water-management", label: "Water", icon: Droplet },
    { href: "/feeding", label: "Feeding", icon: Hand },
    { href: "/monitoring", label: "Monitoring", icon: Camera },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  const getNavHref = (href: string) => {
    if (href === "/" || href === "/settings") {
      return href
    }
    return selectedPond ? `/${selectedPond.id}${href}` : href
  }

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return (
        pathname === "/" ||
        (!pathname.includes("/water-management") &&
          !pathname.includes("/feeding") &&
          !pathname.includes("/monitoring") &&
          !pathname.includes("/settings"))
      )
    }
    if (href === "/settings") {
      return pathname === "/settings"
    }
    return pathname.includes(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4 z-50">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.href)
          return (
            <Link
              key={item.href}
              href={getNavHref(item.href)}
              className={cn(
                "flex flex-col items-center p-2",
                isActive ? "text-teal-800 dark:text-teal-400" : "text-gray-500 dark:text-gray-400",
              )}
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
