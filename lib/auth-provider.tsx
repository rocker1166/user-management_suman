"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  role: string
  image?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function loadUserFromSession() {
      try {
        // Use AbortController to handle timeouts
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
        
        const res = await fetch("/api/auth/session", {
          signal: controller.signal,
          // Add cache control headers to prevent caching issues
          headers: {
            "Cache-Control": "no-cache, no-store, max-age=0, must-revalidate",
            "Pragma": "no-cache"
          }
        })
        
        clearTimeout(timeoutId)
        
        // Check content type to avoid parsing HTML as JSON
        const contentType = res.headers.get("content-type")
        if (res.ok && contentType && contentType.includes("application/json")) {
          const data = await res.json()
          if (data.user) {
            setUser(data.user)
          } else {
            setUser(null)
          }
        } else {
          console.warn("Session API didn't return valid JSON:", res.status, contentType)
          setUser(null)
        }
      } catch (error) {
        // Check if it's an AbortError (timeout)
        if (error instanceof DOMException && error.name === "AbortError") {
          console.error("Session request timed out")
        } else {
          console.error("Failed to load user session:", error)
        }
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUserFromSession()
  }, [pathname])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}
