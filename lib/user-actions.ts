"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getServerSession } from "@/lib/auth"
import { hash as bcryptHash } from "bcryptjs"

// Helper function to check if a user has required roles
async function checkUserRole(requiredRoles: string[]) {
  const session = await getServerSession()

  if (!session) {
    return { success: false, error: "Unauthorized", authorized: false }
  }

  // Check if user has one of the required roles
  const hasPermission = requiredRoles.includes(session.user.role)
  
  if (!hasPermission) {
    return { 
      success: false, 
      error: `Permission denied. Required role: ${requiredRoles.join(' or ')}`, 
      authorized: false 
    }
  }

  return { success: true, authorized: true, session }
}

export async function getUsers(
  page = 1, 
  limit = 10, 
  search?: { 
    name?: string, 
    role?: string, 
    status?: string 
  }
) {
  try {
    // Any authenticated user can view users list, but we'll filter what they see later
    const auth = await checkUserRole(["Admin", "Editor", "User"])
    
    if (!auth.authorized) {
      return auth
    }

    const { db } = await connectToDatabase()
    const skip = (page - 1) * limit

    // Build query filter
    const filter: any = {}
    
    if (search) {
      if (search.name) {
        filter.name = { $regex: search.name, $options: 'i' } // case-insensitive search
      }
      if (search.role) {
        filter.role = search.role
      }
      if (search.status) {
        filter.status = search.status
      }
    }
    
    // If user is not Admin or Editor, they can only see their own info
    if (auth.session?.user.role === "User") {
      filter.email = auth.session.user.email
    }

    const users = await db
      .collection("users")
      .find(filter, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray()

    const total = await db.collection("users").countDocuments(filter)

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
    }
  } catch (error) {
    console.error("Error fetching users:", error)
    return { success: false, error: "Failed to fetch users" }
  }
}

export async function getUserById(id: string) {
  try {
    // Admin and Editor can view any user, regular users can only view themselves
    const auth = await checkUserRole(["Admin", "Editor", "User"])
    
    if (!auth.authorized) {
      return auth
    }

    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })

    if (!user) {
      return { success: false, error: "User not found" }
    }
    
    // If regular user is trying to view someone else's data
    if (auth.session?.user.role === "User" && user.email !== auth.session.user.email) {
      return { success: false, error: "Permission denied" }
    }

    return { success: true, data: JSON.parse(JSON.stringify(user)) }
  } catch (error) {
    console.error("Error fetching user:", error)
    return { success: false, error: "Failed to fetch user" }
  }
}

export async function createUser(userData: {
  name: string
  email: string
  role: string
  status: string
  profilePhoto?: string
  password?: string
}) {
  try {
    // Only Admin can create any user
    // Editors can only create regular users
    const auth = await checkUserRole(["Admin", "Editor"])
    
    if (!auth.authorized) {
      return auth
    }
    
    // If Editor is trying to create an Admin
    if (auth.session?.user.role === "Editor" && userData.role === "Admin") {
      return { success: false, error: "Editors cannot create Admin users" }
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email: userData.email })

    if (existingUser) {
      return { success: false, error: "User with this email already exists" }
    }

    // Create user with provided password or default password
    let hashedPassword;
    
    if (userData.password) {
      // Hash the provided password
      hashedPassword = await hash(userData.password, 10);
    } else {
      // Use default password if not provided
      hashedPassword = "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"; // default: password123
    }
    
    // Remove password from userData to avoid storing it twice
    const { password, ...userDataWithoutPassword } = userData;
    
    const result = await db.collection("users").insertOne({
      ...userDataWithoutPassword,
      password: hashedPassword,
      createdAt: new Date(),
    })

    if (!result.insertedId) {
      return { success: false, error: "Failed to create user" }
    }

    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error creating user:", error)
    return { success: false, error: "Failed to create user" }
  }
}

export async function updateUser(
  id: string,
  userData: {
    name: string
    email: string
    role: string
    status: string
    profilePhoto?: string
  },
) {
  try {
    // Admin can update any user
    // Editors can update regular users but not admins
    // Users can only update themselves but not change their role
    const auth = await checkUserRole(["Admin", "Editor", "User"])
    
    if (!auth.authorized) {
      return auth
    }

    const { db } = await connectToDatabase()
    
    // Get the user being updated
    const userToUpdate = await db.collection("users").findOne({ _id: new ObjectId(id) })
    
    if (!userToUpdate) {
      return { success: false, error: "User not found" }
    }
    
    // Role-based update restrictions
    if (auth.session?.user.role === "Editor") {
      // Editors cannot update admins
      if (userToUpdate.role === "Admin") {
        return { success: false, error: "Editors cannot modify Admin users" }
      }
      
      // Editors cannot change a user to Admin
      if (userData.role === "Admin") {
        return { success: false, error: "Editors cannot assign Admin role" }
      }
    } else if (auth.session?.user.role === "User") {
      // Regular users can only update themselves
      if (userToUpdate.email !== auth.session.user.email) {
        return { success: false, error: "You can only update your own account" }
      }
      
      // Users cannot change their own role
      if (userData.role !== userToUpdate.role) {
        return { success: false, error: "You cannot change your role" }
      }
    }

    // Check if email is already taken by another user
    const existingUser = await db.collection("users").findOne({
      email: userData.email,
      _id: { $ne: new ObjectId(id) },
    })

    if (existingUser) {
      return { success: false, error: "Email is already taken by another user" }
    }

    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(id) }, { $set: { ...userData, updatedAt: new Date() } })

    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUser(id: string) {
  try {
    // Only Admins can delete users
    const auth = await checkUserRole(["Admin"])
    
    if (!auth.authorized) {
      return auth
    }

    const { db } = await connectToDatabase()
    
    // Get the user being deleted
    const userToDelete = await db.collection("users").findOne({ _id: new ObjectId(id) })
    
    if (!userToDelete) {
      return { success: false, error: "User not found" }
    }
    
    // Prevent deleting yourself
    if (userToDelete.email === auth.session?.user.email) {
      return { success: false, error: "You cannot delete your own account" }
    }

    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) })

    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}
async function hash(password: string, saltRounds: number): Promise<string> {
  try {
    return await bcryptHash(password, saltRounds)
  } catch (error) {
    console.error("Password hashing failed:", error)
    throw new Error("Failed to hash password")
  }
}

