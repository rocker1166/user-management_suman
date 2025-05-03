"use client"

import { useState } from "react"
import { RouteGuard } from "@/components/route-guard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { BellRing, Check, Save, User, Moon, Sun, Mail, Shield } from "lucide-react"

export function PageSettingsContent() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Demo form submission handler
  const handleSaveChanges = (formType: string) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      toast({
        title: "Settings updated",
        description: `Your ${formType} settings have been saved successfully.`,
        action: (
          <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="h-4 w-4 text-white" />
          </div>
        ),
      })
    }, 1000)
  }

  return (
    <RouteGuard requiredRoles={["Admin"]}>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Moon className="h-4 w-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <BellRing className="h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Role Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile details and personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="Administrator Account" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="admin@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" defaultValue="System administrator" />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveChanges('profile')} 
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? "Saving..." : "Save changes"}
                  <Save className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Turn on dark mode to reduce eye strain and save battery
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4 text-muted-foreground" />
                      <Switch id="dark-mode" />
                      <Moon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-base">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Display more content on the screen with compact styling
                      </p>
                    </div>
                    <Switch id="compact-mode" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveChanges('appearance')} 
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? "Saving..." : "Save changes"}
                  <Save className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how you receive notifications from the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <div>
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5 flex items-center gap-2">
                      <BellRing className="h-4 w-4" />
                      <div>
                        <Label className="text-base">System Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive in-app notifications
                        </p>
                      </div>
                    </div>
                    <Switch id="system-notifications" defaultChecked />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="notification-email">Notification Email</Label>
                    <Input id="notification-email" type="email" defaultValue="admin@example.com" />
                    <p className="text-sm text-muted-foreground">
                      This email will be used for all system notifications
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveChanges('notification')} 
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? "Saving..." : "Save changes"}
                  <Save className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>
                  This area is restricted to administrators only. Here you can manage role permissions and access control settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-md bg-muted/50">
                    <h3 className="font-medium mb-2">Role Hierarchy</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li><strong>Admin:</strong> Full system access, can manage all users and settings</li>
                      <li><strong>Editor:</strong> Can view and edit regular users but cannot modify administrators</li>
                      <li><strong>User:</strong> Basic access, can only view content they have permission for</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 border rounded-md">
                    <h3 className="font-medium mb-2">Permission Matrix</h3>
                    <div className="relative overflow-x-auto rounded-md">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs uppercase bg-muted">
                          <tr>
                            <th scope="col" className="px-4 py-3">Feature</th>
                            <th scope="col" className="px-4 py-3 text-center">Admin</th>
                            <th scope="col" className="px-4 py-3 text-center">Editor</th>
                            <th scope="col" className="px-4 py-3 text-center">User</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="px-4 py-3">View Dashboard</td>
                            <td className="px-4 py-3 text-center">✓</td>
                            <td className="px-4 py-3 text-center">✓</td>
                            <td className="px-4 py-3 text-center">✓</td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-4 py-3">Manage Users</td>
                            <td className="px-4 py-3 text-center">✓</td>
                            <td className="px-4 py-3 text-center">Limited</td>
                            <td className="px-4 py-3 text-center">✗</td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-4 py-3">Access Settings</td>
                            <td className="px-4 py-3 text-center">✓</td>
                            <td className="px-4 py-3 text-center">✗</td>
                            <td className="px-4 py-3 text-center">✗</td>
                          </tr>
                          <tr className="border-b">
                            <td className="px-4 py-3">Modify System Settings</td>
                            <td className="px-4 py-3 text-center">✓</td>
                            <td className="px-4 py-3 text-center">✗</td>
                            <td className="px-4 py-3 text-center">✗</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground w-full text-center">
                  Changes to the permission system require development effort. Contact the system administrator for special requirements.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RouteGuard>
  )
}