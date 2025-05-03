"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-provider"

interface RouteGuardProps {
  children: React.ReactNode
  requiredRoles: string[]
  fallbackPath?: string
}

export function RouteGuard({ children, requiredRoles, fallbackPath = "/dashboard" }: RouteGuardProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Don't do anything while authentication is being determined
    if (loading) return

    // If no user or user doesn't have required role, redirect
    if (!user || !requiredRoles.includes(user.role)) {
      router.push(fallbackPath)
    }
  }, [user, loading, requiredRoles, router, fallbackPath])

  // Don't render anything while checking authentication
  if (loading) {
    return null
  }

  // If user is authenticated and has required role, render children
  if (user && requiredRoles.includes(user.role)) {
    return <>{children}</>
  }

  // Otherwise render nothing (redirect will happen in effect)
  return null
}