'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)
  
  // Only execute this effect on the client
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  // On the server or during first client render,
  // children are rendered directly without theme context to avoid hydration mismatch
  return (
    <NextThemesProvider 
      {...props}
      storageKey="theme"
    >
      {children}
    </NextThemesProvider>
  )
}
