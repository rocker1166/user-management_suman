import { cookies } from "next/headers"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function getServerSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))

    return {
      user: {
        id: payload.sub as string,
        name: payload.name as string,
        email: payload.email as string,
        role: payload.role as string,
        image: payload.image as string | undefined,
      },
    }
  } catch (error) {
    console.error("Error verifying JWT:", error)
    return null
  }
}
