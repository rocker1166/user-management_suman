"use client"

import { RouteGuard } from "@/components/route-guard"

export function PageSettingsContent() {
  return (
    <RouteGuard requiredRoles={["Admin"]}>
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
        
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Role Management</h2>
          <p className="text-muted-foreground mb-4">
            This area is restricted to administrators only. Here you can manage role permissions and access control settings.
          </p>
          <div className="space-y-4">
            <div className="p-4 border rounded-md bg-muted/50">
              <h3 className="font-medium mb-2">Role Hierarchy</h3>
              <ul className="list-disc list-inside space-y-1">
                <li><strong>Admin:</strong> Full system access, can manage all users and settings</li>
                <li><strong>Editor:</strong> Can view and edit regular users but cannot modify administrators</li>
                <li><strong>User:</strong> Basic access, can only view content they have permission for</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </RouteGuard>
  )
}