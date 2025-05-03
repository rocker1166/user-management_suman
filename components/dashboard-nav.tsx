"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Users, Settings } from "lucide-react"
import { RoleGuard } from "@/components/role-guard"

export function DashboardNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: Home,
      roles: ["Admin", "User", "Editor"], // All roles can access the dashboard
    },
    {
      href: "/dashboard/users",
      label: "Users",
      icon: Users,
      roles: ["Admin", "Editor"], // Only Admin and Editor can access user management
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
      roles: ["Admin"], // Only Admin can access settings
    },
  ]

  return (
    <nav className="grid gap-1 p-4">
      {routes.map((route) => (
        <RoleGuard key={route.href} allowedRoles={route.roles}>
          <Button
            variant={pathname === route.href ? "secondary" : "ghost"}
            className={cn("justify-start", pathname === route.href && "bg-muted font-medium")}
            asChild
          >
            <Link href={route.href}>
              <route.icon className="mr-2 h-4 w-4" />
              {route.label}
            </Link>
          </Button>
        </RoleGuard>
      ))}
    </nav>
  )
}
