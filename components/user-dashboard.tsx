"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserTable } from "@/components/user-table"
import { UserDialog } from "@/components/user-dialog"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Search, X, RefreshCw } from "lucide-react"
import { useUsers } from "@/hooks/use-users"
import { RoleGuard } from "@/components/role-guard"
import { useAuth } from "@/lib/auth-provider"

export function UserDashboard() {
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  // Get the current user for permission checks
  const currentUser = user
  const [page, setPage] = useState(1)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Add search state
  const [nameSearch, setNameSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  
  // Pass search parameters to useUsers hook
  const { users, totalPages, isLoading, mutate } = useUsers(page, 10, {
    name: nameSearch || undefined,
    role: roleFilter || undefined,
    status: statusFilter || undefined,
  })

  const handleAddUser = () => {
    setEditingUser(null)
    setDialogOpen(true)
  }

  const handleEditUser = (user: any) => {
    // Prevent non-admin users from editing admins
    if (user.role === "Admin" && (!currentUser || currentUser.role !== "Admin")) {
      toast({
        variant: "destructive",
        title: "Permission Denied",
        description: "Only administrators can edit admin users",
      })
      return
    }
    
    setEditingUser(user)
    setDialogOpen(true)
  }

  const handleDialogClose = (refresh?: boolean) => {
    setDialogOpen(false)
    if (refresh) {
      mutate()
      router.refresh()
    }
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
  }
  
  // Reset all filters
  const clearFilters = () => {
    setNameSearch("")
    setRoleFilter(null)
    setStatusFilter(null)
    setPage(1)
  }
  
  // Handle refresh of user data
  const handleRefresh = async () => {
    setIsRefreshing(true)
    try {
      await mutate()
      toast({
        title: "Refreshed",
        description: "User list has been refreshed",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh user list",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Users</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
            title="Refresh user list"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          <RoleGuard allowedRoles={["Admin"]}>
            <Button onClick={handleAddUser}>
              <Plus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </RoleGuard>
        </div>
      </div>
      
      {/* Search and filter section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Input
            placeholder="Search by name..."
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            className="pl-8"
          />
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        
        <Select value={roleFilter || undefined} onValueChange={setRoleFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="Editor">Editor</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter || undefined} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" onClick={clearFilters} 
          disabled={!nameSearch && !roleFilter && !statusFilter}>
          <X className="mr-2 h-4 w-4" />
          Clear filters
        </Button>
      </div>

      <UserTable
        users={users || []}
        isLoading={isLoading}
        onEdit={handleEditUser}
        onRefresh={mutate}
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        currentUserRole={currentUser?.role}
      />

      <UserDialog open={dialogOpen} onOpenChange={handleDialogClose} user={editingUser} currentUserRole={currentUser?.role} />
    </div>
  )
}
