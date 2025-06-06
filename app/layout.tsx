// app/layout.tsx
// NO 'use client' directive here! This file remains a Server Component.

import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from 'react-hot-toast' // react-hot-toast also needs a client boundary, which ThemeProvider might provide if it's client, or you'd wrap it too.

// Import your new client component
import { MotionWrapper } from "@/components/MotionWrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pond-IQ",
  description: "Cat Fish Management Application"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {/* ThemeProvider might be a client component itself, implicitly creating a boundary */}
        <ThemeProvider attribute="class" defaultTheme="light">
          {/* Toaster from react-hot-toast is also a client component. 
              If ThemeProvider is a client component, it automatically wraps Toaster.
              If ThemeProvider is *not* a client component, you'd need to wrap Toaster
              in its own client component if you want your layout to remain server-only otherwise.
              However, most UI library Providers are client components. */}
          <Toaster position="top-right" />

          {/* Now, render the MotionWrapper client component */}
          <MotionWrapper className="flex min-h-screen bg-gradient-to-br from-teal-900 via-teal-600 to-sky-500">
            <div className="hidden md:block">
              <Sidebar />
            </div>
            <div className="flex-1">{children}</div>
          </MotionWrapper>

          <div className="md:hidden">
            <MobileNavigation />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}