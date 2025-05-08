"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}


// "use client"

// import { ThemeProvider as NextThemesProvider } from "next-themes"
// import type { ReactNode } from "react"

// interface ThemeProviderProps {
//   children: ReactNode;
//   attribute?: string;
//   defaultTheme?: string;
//   enableSystem?: boolean;
//   disableTransitionOnChange?: boolean;
//   storageKey?: string;
//   themes?: string[];
// }

// export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
//   return <NextThemesProvider {...props}>{children}</NextThemesProvider>
// }