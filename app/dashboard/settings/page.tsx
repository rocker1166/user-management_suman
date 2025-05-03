import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings | User Management",
  description: "User management dashboard settings",
}

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>
      <div className="rounded-lg border p-6">
        <h2 className="text-xl font-semibold mb-4">Application Settings</h2>
        <p className="text-muted-foreground">
          This is a demo application. Settings functionality would be implemented here in a real application.
        </p>
      </div>
    </div>
  )
}
