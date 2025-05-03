import { NextResponse } from "next/server"
import { getServerSession } from "@/lib/auth"

export async function GET() {
  try {
    const session = await getServerSession()

    if (!session) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user: session.user })
  } catch (error) {
    console.error("Session API error:", error)
    // Always return a valid JSON response even if there's an error
    return NextResponse.json({ user: null, error: "Failed to get session" }, { status: 500 })
  }
}
