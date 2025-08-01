import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { PondProvider } from "@/contexts/pond-context"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pond-IQ",
  description: "PondIQ is a comprehensive smart aquaculture solution designed to bring efficiency, precision, and intelligence to catfish farming operations, directly empowering farmers through a user-friendly mobile application. Our current prototype delivers robust automation capabilities, while also laying the critical groundwork for advanced AI-driven disease detection.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
        <Toaster position='top-center'  />
          <PondProvider>
            <div className="flex min-h-screen bg-gradient-to-b from-teal-800 via-teal-700 to-sky-500">
              <div className="hidden md:flex">
                <Sidebar />
              </div>
              <div className="flex-1 ">{children}</div>
            </div>
            <div className="md:hidden">
              <MobileNavigation />
            </div>
          </PondProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
