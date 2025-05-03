"use client"

import { UserDashboard } from "@/components/user-dashboard"
import { RouteGuard } from "@/components/route-guard"
import { RoleGuard } from "@/components/role-guard"

export function PageUsersContent() {
  return (
    <RouteGuard requiredRoles={["Admin", "Editor"]}>
      <RoleGuard allowedRoles={["Admin", "Editor"]}>
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage users, their roles, and permissions
            </p>
          </div>
          <UserDashboard />
        </div>
      </RoleGuard>
    </RouteGuard>
  )
}