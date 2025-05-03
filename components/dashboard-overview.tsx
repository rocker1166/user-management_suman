"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts"
import { useUsers } from "@/hooks/use-users"
import { 
  Users, ArrowUpIcon, ArrowDownIcon, ActivityIcon, UserPlus, UserMinus, 
  UserCheck, MessagesSquare, Clock, BarChart3
} from "lucide-react"

// Mock activity data - in a real app, this would come from an API
const activityData = [
  { day: 'Mon', logins: 24, registrations: 5, activity: 65 },
  { day: 'Tue', logins: 30, registrations: 8, activity: 72 },
  { day: 'Wed', logins: 19, registrations: 3, activity: 55 },
  { day: 'Thu', logins: 27, registrations: 7, activity: 68 },
  { day: 'Fri', logins: 40, registrations: 12, activity: 90 },
  { day: 'Sat', logins: 35, registrations: 10, activity: 74 },
  { day: 'Sun', logins: 22, registrations: 4, activity: 45 },
]

// Mock monthly data
const monthlyData = [
  { name: 'Jan', users: 420 },
  { name: 'Feb', users: 480 },
  { name: 'Mar', users: 510 },
  { name: 'Apr', users: 580 },
  { name: 'May', users: 650 },
  { name: 'Jun', users: 590 },
  { name: 'Jul', users: 640 },
  { name: 'Aug', users: 700 },
  { name: 'Sep', users: 710 },
  { name: 'Oct', users: 780 },
  { name: 'Nov', users: 820 },
  { name: 'Dec', users: 870 },
]

// COLORS for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function DashboardOverview() {
  const { users, isLoading } = useUsers(1, 100) // Fetch a lot of users once for analysis
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 32, // Mock data
    userGrowth: 12.6, // Mock percentage
  })
  
  const [roleDistribution, setRoleDistribution] = useState<{ name: string; value: number }[]>([])
  const [statusDistribution, setStatusDistribution] = useState<{ name: string; value: number }[]>([])
  
  useEffect(() => {
    if (users?.length) {
      // Calculate statistics
      const active = users.filter(user => user.status === "Active").length
      
      // Create role distribution data
      const roleCount: Record<string, number> = {}
      users.forEach(user => {
        const role = user.role || "Unknown"
        roleCount[role] = (roleCount[role] || 0) + 1
      })
      
      const roleData = Object.entries(roleCount).map(([name, value]) => ({ name, value }))
      
      // Create status distribution data
      const statusCount: Record<string, number> = {}
      users.forEach(user => {
        const status = user.status || "Unknown"
        statusCount[status] = (statusCount[status] || 0) + 1
      })
      
      const statusData = Object.entries(statusCount).map(([name, value]) => ({ name, value }))
      
      setStats({
        ...stats,
        totalUsers: users.length,
        activeUsers: active,
      })
      
      setRoleDistribution(roleData)
      setStatusDistribution(statusData)
    }
  }, [users])
  
  return (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.userGrowth > 0 ? (
                <span className="text-green-500 flex items-center">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  {stats.userGrowth}% from last month
                </span>
              ) : (
                <span className="text-red-500 flex items-center">
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                  {Math.abs(stats.userGrowth)}% from last month
                </span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "" : `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total users`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Users (30d)</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newUsersThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpIcon className="h-3 w-3 mr-1" />
                18% increase
              </span>
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">User Activity</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500 flex items-center">
                <ArrowUpIcon className="h-3 w-3 mr-1" />
                7% increase
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
                <CardDescription>Monthly user registration growth over the year</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={monthlyData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Role Distribution</CardTitle>
                <CardDescription>Distribution of users by role</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {roleDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>User activity metrics for the last week</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activityData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="logins" fill="#8884d8" name="Logins" />
                  <Bar dataKey="registrations" fill="#82ca9d" name="New Registrations" />
                  <Bar dataKey="activity" fill="#ffc658" name="Activity Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>User Status</CardTitle>
                <CardDescription>Active vs. Inactive users</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Login Activity</CardTitle>
                <CardDescription>Daily login trends</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={activityData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="logins" stroke="#8884d8" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="activity" stroke="#82ca9d" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports</CardTitle>
              <CardDescription>System-generated reports are available here</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">No reports available yet. Reports will be generated at the end of the month.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Notifications</CardTitle>
              <CardDescription>Recent system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-md border p-4">
                  <ActivityIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">System Update Completed</p>
                    <p className="text-sm text-muted-foreground">The system has been updated to the latest version.</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-md border p-4">
                  <UserPlus className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">New Admin User Added</p>
                    <p className="text-sm text-muted-foreground">A new administrator account was created.</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-md border p-4">
                  <BarChart3 className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Monthly Report Available</p>
                    <p className="text-sm text-muted-foreground">The April 2025 user activity report is ready to view.</p>
                    <p className="text-xs text-muted-foreground">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}