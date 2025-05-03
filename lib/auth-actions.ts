"use server"

import { cookies } from "next/headers"
import { SignJWT } from "jose"
import { revalidatePath } from "next/cache"
import { connectToDatabase } from "@/lib/mongodb"
import { compare, hash } from "bcryptjs"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
const JWT_EXPIRES_IN = "7d"

export async function loginUser({ email, password }: { email: string; password: string }) {
  try {
    const { db } = await connectToDatabase()
    const user = await db.collection("users").findOne({ email })

    if (!user) {
      return { success: false, error: "Invalid credentials" }
    }

    const passwordMatch = await compare(password, user.password)

    if (!passwordMatch) {
      return { success: false, error: "Invalid credentials" }
    }

    // Create JWT token
    const token = await new SignJWT({
      sub: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.profilePhoto,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(JWT_EXPIRES_IN)
      .sign(new TextEncoder().encode(JWT_SECRET))

    // Set cookie
    ;(await
      // Set cookie
      cookies()).set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { success: false, error: "An error occurred during login" }
  }
}

export async function logoutUser() {
  (await cookies()).delete("auth-token")
  revalidatePath("/")
  return { success: true }
}

export async function registerUser({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) {
  try {
    const { db } = await connectToDatabase()

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email })

    if (existingUser) {
      return { success: false, error: "User with this email already exists" }
    }

    // Hash password
    const hashedPassword = await hash(password, 10)

    // Create user
    const result = await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
      role: "User",
      status: "Active",
      createdAt: new Date(),
    })

    if (!result.insertedId) {
      return { success: false, error: "Failed to create user" }
    }

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { success: false, error: "An error occurred during registration" }
  }
}
