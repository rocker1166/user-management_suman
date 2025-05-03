"use client"

import { ReactNode } from "react"
import { useAuth } from "@/lib/auth-provider"

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: string[]
  fallback?: ReactNode
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { user, loading } = useAuth()

  // While checking authentication, don't render anything
  if (loading) {
    return null
  }

  // If user not authenticated or doesn't have required role, show fallback or nothing
  if (!user || !allowedRoles.includes(user.role)) {
    return fallback
  }

  // User has required role, render children
  return <>{children}</>
}