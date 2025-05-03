"use client"

import { useState, useEffect } from "react"
import { RouteGuard } from "@/components/route-guard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { BellRing, Check, Save, User, Moon, Sun, Mail, Shield, Loader2, ChevronDown } from "lucide-react"
import { useTheme } from "next-themes"
import { useIsMobile } from "@/hooks/use-mobile"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function PageSettingsContent() {
  const { toast } = useToast()
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(false)
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState("profile")
  
  // Form state management
  const [formState, setFormState] = useState({
    profile: {
      name: "Administrator Account",
      email: "admin@example.com",
      bio: "System administrator"
    },
    appearance: {
      darkMode: false,
      compactMode: false
    },
    notifications: {
      emailNotifications: true,
      systemNotifications: true,
      notificationEmail: "admin@example.com"
    }
  })

  // Update form state when theme changes
  useEffect(() => {
    setFormState(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        darkMode: theme === "dark"
      }
    }))
  }, [theme])

  // Handle input changes
  const handleInputChange = (section: string, field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }))
  }

  // Handle theme toggle
  const handleThemeToggle = (checked: boolean) => {
    setTheme(checked ? "dark" : "light")
  }

  // Demo form submission handler with more realistic API simulation
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

  // Tab options for select dropdown
  const tabOptions = [
    { value: "profile", label: "Profile", icon: <User className="h-4 w-4 mr-2" /> },
    { value: "appearance", label: "Appearance", icon: <Moon className="h-4 w-4 mr-2" /> },
    { value: "notifications", label: "Notifications", icon: <BellRing className="h-4 w-4 mr-2" /> },
    { value: "roles", label: "Roles", icon: <Shield className="h-4 w-4 mr-2" /> }
  ]

  return (
    <RouteGuard requiredRoles={["Admin"]}>
      <div className="flex flex-col gap-4 max-w-full">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Mobile select menu for tabs */}
          {isMobile ? (
            <div className="mb-4">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <div className="flex items-center">
                      {tabOptions.find(tab => tab.value === activeTab)?.icon}
                      <span>{tabOptions.find(tab => tab.value === activeTab)?.label}</span>
                    </div>
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {tabOptions.map(tab => (
                    <SelectItem key={tab.value} value={tab.value}>
                      <div className="flex items-center">
                        {tab.icon}
                        <span>{tab.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <TabsList className="mb-4 justify-center">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span>Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="roles" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Roles</span>
              </TabsTrigger>
            </TabsList>
          )}
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account profile details and personal information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input 
                      id="name" 
                      value={formState.profile.name} 
                      onChange={(e) => handleInputChange('profile', 'name', e.target.value)} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={formState.profile.email} 
                      onChange={(e) => handleInputChange('profile', 'email', e.target.value)} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input 
                    id="bio" 
                    value={formState.profile.bio} 
                    onChange={(e) => handleInputChange('profile', 'bio', e.target.value)} 
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveChanges('profile')} 
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save changes</>}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Appearance</CardTitle>
                <CardDescription>
                  Customize the appearance of the application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="space-y-0.5">
                      <Label className="text-base">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Turn on dark mode to reduce eye strain
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Sun className="h-4 w-4 text-muted-foreground" />
                      <Switch 
                        id="dark-mode" 
                        checked={formState.appearance.darkMode} 
                        onCheckedChange={handleThemeToggle} 
                      />
                      <Moon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="space-y-0.5">
                      <Label className="text-base">Compact Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Display more content on the screen
                      </p>
                    </div>
                    <Switch 
                      id="compact-mode" 
                      checked={formState.appearance.compactMode} 
                      onCheckedChange={(checked) => handleInputChange('appearance', 'compactMode', checked)} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleSaveChanges('appearance')} 
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save changes</>}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how you receive notifications from the system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="space-y-0.5 flex items-center gap-2">
                      <Mail className="h-4 w-4 flex-shrink-0" />
                      <div>
                        <Label className="text-base">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="email-notifications" 
                      checked={formState.notifications.emailNotifications} 
                      onCheckedChange={(checked) => handleInputChange('notifications', 'emailNotifications', checked)} 
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="space-y-0.5 flex items-center gap-2">
                      <BellRing className="h-4 w-4 flex-shrink-0" />
                      <div>
                        <Label className="text-base">System Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive in-app notifications
                        </p>
                      </div>
                    </div>
                    <Switch 
                      id="system-notifications" 
                      checked={formState.notifications.systemNotifications} 
                      onCheckedChange={(checked) => handleInputChange('notifications', 'systemNotifications', checked)} 
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="notification-email">Notification Email</Label>
                    <Input 
                      id="notification-email" 
                      type="email" 
                      value={formState.notifications.notificationEmail} 
                      onChange={(e) => handleInputChange('notifications', 'notificationEmail', e.target.value)} 
                    />
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
                  {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save changes</>}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Role Management</CardTitle>
                <CardDescription>
                  This area is restricted to administrators only
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border rounded-md bg-muted/50">
                    <h3 className="font-medium mb-2">Role Hierarchy</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li><strong>Admin:</strong> Full system access</li>
                      <li><strong>Editor:</strong> Can view and edit regular users</li>
                      <li><strong>User:</strong> Basic access</li>
                    </ul>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full rounded-md border">
                      <thead className="bg-muted text-xs font-medium uppercase">
                        <tr>
                          <th className="p-2 text-left">Feature</th>
                          <th className="p-2 text-center">Admin</th>
                          <th className="p-2 text-center">Editor</th>
                          <th className="p-2 text-center">User</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        <tr className="text-sm">
                          <td className="p-2">View Dashboard</td>
                          <td className="p-2 text-center">✓</td>
                          <td className="p-2 text-center">✓</td>
                          <td className="p-2 text-center">✓</td>
                        </tr>
                        <tr className="text-sm">
                          <td className="p-2">Manage Users</td>
                          <td className="p-2 text-center">✓</td>
                          <td className="p-2 text-center">-</td>
                          <td className="p-2 text-center">✗</td>
                        </tr>
                        <tr className="text-sm">
                          <td className="p-2">Access Settings</td>
                          <td className="p-2 text-center">✓</td>
                          <td className="p-2 text-center">✗</td>
                          <td className="p-2 text-center">✗</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground w-full text-center">
                  Contact admin for special requirements
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </RouteGuard>
  )
}