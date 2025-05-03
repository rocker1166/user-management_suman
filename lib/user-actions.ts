"use server"

import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { getServerSession } from "@/lib/auth"

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
    const session = await getServerSession()

    if (!session) {
      return { success: false, error: "Unauthorized" }
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
    const session = await getServerSession()

    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const { db } = await connectToDatabase()

    const user = await db.collection("users").findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } })

    if (!user) {
      return { success: false, error: "User not found" }
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
}) {
  try {
    const session = await getServerSession()

    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email: userData.email })

    if (existingUser) {
      return { success: false, error: "User with this email already exists" }
    }

    // Create user with a default password
    const result = await db.collection("users").insertOne({
      ...userData,
      password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy", // default: password123
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
    const session = await getServerSession()

    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const { db } = await connectToDatabase()

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

    if (result.matchedCount === 0) {
      return { success: false, error: "User not found" }
    }

    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error updating user:", error)
    return { success: false, error: "Failed to update user" }
  }
}

export async function deleteUser(id: string) {
  try {
    const session = await getServerSession()

    if (!session) {
      return { success: false, error: "Unauthorized" }
    }

    const { db } = await connectToDatabase()

    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return { success: false, error: "User not found" }
    }

    revalidatePath("/dashboard")

    return { success: true }
  } catch (error) {
    console.error("Error deleting user:", error)
    return { success: false, error: "Failed to delete user" }
  }
}
