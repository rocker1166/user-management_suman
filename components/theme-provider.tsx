'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

// Create a client-only wrapper to prevent hydration mismatch
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false)
  
  // Only execute this effect on the client
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  // Return null on the first render (server-side)
  // This prevents hydration mismatch by not rendering anything theme-related on the server
  if (!mounted) {
    return null
  }
  
  return <>{children}</>
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <>
      {/* Render a simple wrapper on the server */}
      <NextThemesProvider {...props} enableSystem={false} enableColorScheme={false} storageKey="suppress-during-ssr">
        <ClientOnly>
          {/* Re-render with actual theme settings after mounting */}
          <NextThemesProvider {...props}>{children}</NextThemesProvider>
        </ClientOnly>
      </NextThemesProvider>
    </>
  )
}
