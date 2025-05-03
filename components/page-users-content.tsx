"use client"

import { UserDashboard } from "@/components/user-dashboard"
import { RouteGuard } from "@/components/route-guard"

export function PageUsersContent() {
  return (
    <RouteGuard requiredRoles={["Admin", "Editor"]}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage your users and their permissions</p>
        </div>
        <UserDashboard />
      </div>
    </RouteGuard>
  )
}