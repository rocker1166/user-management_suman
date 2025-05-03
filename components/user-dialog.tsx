"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createUser, updateUser } from "@/lib/user-actions"

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  role: z.enum(["Admin", "User", "Editor"]),
  status: z.enum(["Active", "Inactive"]),
  profilePhoto: z.string().optional(),
  password: z.string()
    .min(6, { message: "Password must be at least 6 characters" })
    .optional() // Make password optional for editing
    .or(z.literal('')), // Allow empty string
})

interface UserDialogProps {
  open: boolean
  onOpenChange: (open: boolean, refresh?: boolean) => void
  user?: any
  currentUserRole?: string
}

export function UserDialog({ open, onOpenChange, user, currentUserRole }: UserDialogProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!user
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "User",
      status: "Active",
      profilePhoto: "",
      password: "", // Initialize the password field with an empty string
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        profilePhoto: user.profilePhoto || "",
        password: "", // Reset password field when editing
      })
    } else {
      form.reset({
        name: "",
        email: "",
        role: "User",
        status: "Active",
        profilePhoto: "",
        password: "", // Reset password field when creating new user
      })
    }
  }, [user, form])

  // Function to check if user is allowed to assign a specific role
  const canAssignRole = (role: string) => {
    // Only admins can create other admins
    if (role === "Admin" && currentUserRole !== "Admin") {
      return false;
    }
    
    // Editors can create regular users but not admins
    if (currentUserRole === "Editor" && role !== "Admin") {
      return true;
    }
    
    // Admins can assign any role
    return currentUserRole === "Admin";
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    setFormError(null)
    try {
      // Check if user is trying to change an Admin's role and is not an admin themselves
      if (isEditing && user.role === "Admin" && values.role !== "Admin" && currentUserRole !== "Admin") {
        setFormError("Only administrators can change an admin's role")
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "Only administrators can change an admin's role",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Check if user is trying to promote someone to Admin without being an Admin
      if (values.role === "Admin" && currentUserRole !== "Admin") {
        setFormError("Only administrators can assign admin role")
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "Only administrators can assign admin role",
        });
        setIsSubmitting(false);
        return;
      }

      if (isEditing) {
        // For editing, remove the password field if it's empty
        const { password, ...updateData } = values;
        
        toast({
          title: "Updating user...",
          description: "Please wait while we update the user information",
        });
        
        const result = await updateUser(user._id, updateData)
        if (result.success) {
          toast({
            title: "User updated",
            description: "The user has been successfully updated",
          })
          onOpenChange(false, true)
          router.refresh()
        } else {
          setFormError(result.error || "Failed to update user")
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to update user",
          })
        }
      } else {
        const result = await createUser(values)
        if (result.success) {
          toast({
            title: "User created",
            description: "The user has been successfully created",
          })
          onOpenChange(false, true)
          router.refresh()
        } else {
          setFormError(result.error || "Failed to create user")
          toast({
            variant: "destructive",
            title: "Error",
            description: result.error || "Failed to create user",
          })
        }
      }
    } catch (error) {
      console.error("Form submission error:", error)
      setFormError("An unexpected error occurred. Please try again.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (!isSubmitting) {
        setFormError(null)
        onOpenChange(open)
      }
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit User" : "Add User"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Update the user's information below." : "Fill in the details to create a new user."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {formError && (
              <div className="bg-destructive/15 text-destructive text-sm p-3 rounded-md">
                {formError}
              </div>
            )}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {canAssignRole("Admin") && (
                          <SelectItem value="Admin">Admin</SelectItem>
                        )}
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="profilePhoto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile Photo URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/photo.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!isEditing && (
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update User" : "Create User")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
