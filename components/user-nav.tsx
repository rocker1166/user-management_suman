"use client"

import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { logoutUser } from "@/lib/auth-actions"
import { User } from "lucide-react"

interface UserNavProps {
  user: {
    name: string
    email: string
    image?: string
    role?: string
  }
}

export function UserNav({ user }: UserNavProps) {
  const router = useRouter()
  const { toast } = useToast()

  // Role badge color based on role type
  const getRoleBadgeVariant = (role?: string) => {
    switch (role) {
      case "Admin":
        return "destructive" // Red for admin
      case "Editor":
        return "default" // Blue for editor
      default:
        return "secondary" // Gray for regular user
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
      router.push("/login")
      router.refresh()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out",
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative flex items-center gap-2 rounded-full pl-2">
         
          <Avatar className="h-8 w-8">
            {user.image ? (
              <AvatarImage src={user.image} alt={user.name} />
            ) : (
              <AvatarFallback>
                <User className="h-4 w-4 text-muted-foreground" />
              </AvatarFallback>
            )}
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              {user.role && (
                <Badge variant={getRoleBadgeVariant(user.role)} className="ml-2">
                  {user.role}
                </Badge>
              )}
            </div>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
        
        {/* Only show settings for Admin users */}
        {user.role === "Admin" && (
          <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>Settings</DropdownMenuItem>
        )}
        
        {/* Show users page for Admin and Editor roles */}
        {(user.role === "Admin" || user.role === "Editor") && (
          <DropdownMenuItem onClick={() => router.push("/dashboard/users")}>Users</DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
