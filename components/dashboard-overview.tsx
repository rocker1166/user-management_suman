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

// COLORS for charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

// Helper function to get date X days ago in YYYY-MM-DD format
const getDateXDaysAgo = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

// Helper to format dates for display
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Helper to get time ago string
const getTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
  let interval = seconds / 31536000
  if (interval > 1) return Math.floor(interval) + ' years ago'
  
  interval = seconds / 2592000
  if (interval > 1) return Math.floor(interval) + ' months ago'
  
  interval = seconds / 86400
  if (interval > 1) return Math.floor(interval) + ' days ago'
  
  interval = seconds / 3600
  if (interval > 1) return Math.floor(interval) + ' hours ago'
  
  interval = seconds / 60
  if (interval > 1) return Math.floor(interval) + ' minutes ago'
  
  return Math.floor(seconds) + ' seconds ago'
}

export function DashboardOverview() {
  const { users, isLoading } = useUsers(1, 1000) // Fetch a large number of users for analysis
  
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsersThisMonth: 0,
    userGrowth: 0,
  })
  
  const [activityData, setActivityData] = useState<any[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [roleDistribution, setRoleDistribution] = useState<{ name: string; value: number }[]>([])
  const [statusDistribution, setStatusDistribution] = useState<{ name: string; value: number }[]>([])
  const [notifications, setNotifications] = useState<any[]>([])

  // Process user data once it's loaded
  useEffect(() => {
    if (users?.length) {
      processUserData(users)
    }
  }, [users])

  // Process user data and generate all needed stats
  const processUserData = (userData: any[]) => {
    // Basic user stats
    const active = userData.filter(user => user.status === "Active").length
    
    // Calculate new users in the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const newUsers = userData.filter(user => {
      const createdAt = user.createdAt ? new Date(user.createdAt) : null
      return createdAt && createdAt > thirtyDaysAgo
    }).length
    
    // Calculate user growth percentage (comparing with previous 30 days)
    const sixtyDaysAgo = new Date()
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)
    
    const previousPeriodUsers = userData.filter(user => {
      const createdAt = user.createdAt ? new Date(user.createdAt) : null
      return createdAt && createdAt > sixtyDaysAgo && createdAt <= thirtyDaysAgo
    }).length
    
    let growthRate = 0
    if (previousPeriodUsers > 0) {
      growthRate = ((newUsers - previousPeriodUsers) / previousPeriodUsers) * 100
    } else if (newUsers > 0) {
      growthRate = 100 // If there were no users in the previous period but there are now
    }
    
    // Create role distribution data
    const roleCount: Record<string, number> = {}
    userData.forEach(user => {
      const role = user.role || "Unknown"
      roleCount[role] = (roleCount[role] || 0) + 1
    })
    const roleData = Object.entries(roleCount).map(([name, value]) => ({ name, value }))
    
    // Create status distribution data
    const statusCount: Record<string, number> = {}
    userData.forEach(user => {
      const status = user.status || "Unknown"
      statusCount[status] = (statusCount[status] || 0) + 1
    })
    const statusData = Object.entries(statusCount).map(([name, value]) => ({ name, value }))
    
    // Generate weekly activity data
    const weeklyActivity = generateWeeklyActivityData(userData)
    
    // Generate monthly data
    const monthly = generateMonthlyData(userData)
    
    // Generate notifications based on recent activities
    const notifs = generateNotifications(userData)
    
    // Update all state at once
    setStats({
      totalUsers: userData.length,
      activeUsers: active,
      newUsersThisMonth: newUsers,
      userGrowth: parseFloat(growthRate.toFixed(1)),
    })
    
    setRoleDistribution(roleData)
    setStatusDistribution(statusData)
    setActivityData(weeklyActivity)
    setMonthlyData(monthly)
    setNotifications(notifs)
  }
  
  // Generate weekly activity data from users
  const generateWeeklyActivityData = (userData: any[]) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const today = new Date()
    const dayOfWeek = today.getDay() // 0 = Sunday, 6 = Saturday
    
    // Create array of the last 7 days
    const weekData = Array(7).fill(0).map((_, i) => {
      const date = new Date()
      date.setDate(today.getDate() - (dayOfWeek + 6 - i) % 7)
      return {
        day: days[date.getDay()],
        date: date.toISOString().split('T')[0],
        logins: 0,
        registrations: 0,
        activity: 0
      }
    })
    
    // Count registrations for each day
    userData.forEach(user => {
      if (user.createdAt) {
        const createdDate = new Date(user.createdAt).toISOString().split('T')[0]
        const dayIndex = weekData.findIndex(d => d.date === createdDate)
        if (dayIndex !== -1) {
          weekData[dayIndex].registrations++
          weekData[dayIndex].activity += 5 // Each registration counts as 5 activity points
        }
      }
      
      // Since we don't have actual login data, we'll use lastLogin if available
      // or simulate based on user data
      if (user.lastLogin) {
        const loginDate = new Date(user.lastLogin).toISOString().split('T')[0]
        const dayIndex = weekData.findIndex(d => d.date === loginDate)
        if (dayIndex !== -1) {
          weekData[dayIndex].logins++
          weekData[dayIndex].activity += 1
        }
      } else if (user.status === "Active") {
        // Distribute some random logins for active users
        const randomDay = Math.floor(Math.random() * 7)
        weekData[randomDay].logins++
        weekData[randomDay].activity += 1
      }
    })
    
    // Calculate activity metrics (normalize to make chart look good)
    const maxActivity = Math.max(...weekData.map(d => d.activity), 10) // Ensure at least 10 for scaling
    weekData.forEach(day => {
      // Scale activity to 1-100 range for better visualization
      day.activity = Math.round((day.activity / maxActivity) * 100)
    })
    
    return weekData
  }
  
  // Generate monthly data for the year
  const generateMonthlyData = (userData: any[]) => {
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ]
    
    // Initialize with zero users for each month
    const monthlyCounts = months.map(name => ({ name, users: 0 }))
    
    // Count users per month
    userData.forEach(user => {
      if (user.createdAt) {
        const date = new Date(user.createdAt)
        const monthIndex = date.getMonth()
        monthlyCounts[monthIndex].users++
      }
    })
    
    // Calculate cumulative users (running total)
    let runningTotal = 0
    const result = monthlyCounts.map(month => {
      runningTotal += month.users
      return { ...month, users: runningTotal }
    })
    
    return result
  }
  
  // Generate notifications based on user data
  const generateNotifications = (userData: any[]) => {
    const notifications = []
    
    // Sort users by creation date (newest first)
    const sortedUsers = [...userData].sort((a, b) => {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    })
    
    // Add notification for the most recently created user
    if (sortedUsers.length > 0) {
      const latestUser = sortedUsers[0]
      notifications.push({
        id: 1,
        icon: UserPlus,
        title: 'New User Added',
        description: `${latestUser.name} was added to the system.`,
        time: latestUser.createdAt ? getTimeAgo(latestUser.createdAt) : 'Recently',
      })
    }
    
    // Add notification for system update
    const now = new Date()
    notifications.push({
      id: 2,
      icon: ActivityIcon,
      title: 'System Update Completed',
      description: 'The system has been updated to the latest version.',
      time: '2 hours ago',
    })
    
    // Add notification about user activity
    const activeUserCount = userData.filter(user => user.status === 'Active').length
    const totalUsers = userData.length
    if (totalUsers > 0) {
      const activePercentage = Math.round((activeUserCount / totalUsers) * 100)
      
      notifications.push({
        id: 3,
        icon: BarChart3,
        title: 'User Activity Report',
        description: `${activePercentage}% of users are currently active.`,
        time: 'Today',
      })
    }
    
    return notifications
  }
  
  // Calculate a daily activity score (for the Activity card)
  const calculateDailyActivityScore = () => {
    if (!activityData || activityData.length === 0) return 0
    
    // Find today's day of the week
    const today = new Date()
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][today.getDay()]
    
    // Get today's activity score
    const todayData = activityData.find(day => day.day === dayName)
    return todayData ? todayData.activity : 0
  }
  
  // Calculate activity change (for the Activity card)
  const calculateActivityChange = () => {
    if (!activityData || activityData.length < 2) return 0
    
    // Find today's day of the week
    const today = new Date()
    const dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][today.getDay()]
    
    // Find yesterday's day of the week
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)
    const yesterdayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][yesterday.getDay()]
    
    // Get activity scores
    const todayData = activityData.find(day => day.day === dayName)
    const yesterdayData = activityData.find(day => day.day === yesterdayName)
    
    if (!todayData || !yesterdayData || yesterdayData.activity === 0) return 0
    
    // Calculate percentage change
    return Math.round(((todayData.activity - yesterdayData.activity) / yesterdayData.activity) * 100)
  }
  
  const activityScore = calculateDailyActivityScore()
  const activityChange = calculateActivityChange()
  
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
              ) : stats.userGrowth < 0 ? (
                <span className="text-red-500 flex items-center">
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                  {Math.abs(stats.userGrowth)}% from last month
                </span>
              ) : (
                <span className="text-muted-foreground">No change from last month</span>
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
              {isLoading || stats.totalUsers === 0 
                ? "" 
                : `${Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total users`}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">New Users (30d)</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : stats.newUsersThisMonth}</div>
            <p className="text-xs text-muted-foreground">
              {stats.userGrowth > 0 ? (
                <span className="text-green-500 flex items-center">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  {stats.userGrowth}% increase
                </span>
              ) : stats.userGrowth < 0 ? (
                <span className="text-red-500 flex items-center">
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                  {Math.abs(stats.userGrowth)}% decrease
                </span>
              ) : (
                <span className="text-muted-foreground">No change</span>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">User Activity</CardTitle>
            <ActivityIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{isLoading ? "Loading..." : `${activityScore}%`}</div>
            <p className="text-xs text-muted-foreground">
              {activityChange > 0 ? (
                <span className="text-green-500 flex items-center">
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                  {activityChange}% increase
                </span>
              ) : activityChange < 0 ? (
                <span className="text-red-500 flex items-center">
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                  {Math.abs(activityChange)}% decrease
                </span>
              ) : (
                <span className="text-muted-foreground">No change</span>
              )}
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
                <CardDescription>Cumulative user registrations over the year</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Role Distribution</CardTitle>
                <CardDescription>Distribution of users by role</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : roleDistribution.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p>No role data available</p>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>User activity metrics for the last week</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart data...</p>
                </div>
              ) : (
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
              )}
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
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : statusDistribution.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p>No status data available</p>
                  </div>
                ) : (
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
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Login Activity</CardTitle>
                <CardDescription>Daily login trends</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <p>Loading chart data...</p>
                  </div>
                ) : (
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
                )}
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
              <div className="space-y-4">
                {stats.totalUsers > 0 ? (
                  <>
                    <div className="flex items-start gap-4 rounded-md border p-4">
                      <BarChart3 className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">User Distribution Report</p>
                        <p className="text-sm text-muted-foreground">View the distribution of users by role and status.</p>
                        <button className="text-xs text-primary hover:underline">Download PDF</button>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 rounded-md border p-4">
                      <ActivityIcon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Monthly Activity Summary</p>
                        <p className="text-sm text-muted-foreground">User activity metrics for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                        <button className="text-xs text-primary hover:underline">Download PDF</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">No reports available yet. Reports will be generated when there are sufficient user data.</p>
                )}
              </div>
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
              {isLoading ? (
                <div className="flex items-center justify-center h-24">
                  <p>Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No notifications available.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start gap-4 rounded-md border p-4">
                      <notification.icon className="h-5 w-5 text-muted-foreground mt-0.5" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{notification.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.description}</p>
                        <p className="text-xs text-muted-foreground">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}