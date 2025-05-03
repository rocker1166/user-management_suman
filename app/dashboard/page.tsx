import type { Metadata } from "next"
import { UserDashboard } from "@/components/user-dashboard"

export const metadata: Metadata = {
  title: "Dashboard | User Management",
  description: "User management dashboard",
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Manage your users and their permissions</p>
      </div>
      <UserDashboard />
    </div>
  )
}
