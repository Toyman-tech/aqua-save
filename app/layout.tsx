import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { MobileNavigation } from "@/components/mobile-navigation"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from 'react-hot-toast'
import { motion } from "framer-motion"

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
        <ThemeProvider attribute="class" defaultTheme="light">
          <Toaster position="top-right" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex min-h-screen bg-gradient-to-br from-teal-900 via-teal-600 to-sky-500"
          >
            <div className="hidden md:block">
              <Sidebar />
            </div>
            <div className="flex-1">{children}</div>
          </motion.div>
          <div className="md:hidden">
            <MobileNavigation />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}