import type { Metadata } from "next"
import { UserDashboard } from "@/components/user-dashboard"

export const metadata: Metadata = {
  title: "Users | User Management",
  description: "Manage users in the dashboard",
}

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">Manage your users and their permissions</p>
      </div>
      <UserDashboard />
    </div>
  )
}
