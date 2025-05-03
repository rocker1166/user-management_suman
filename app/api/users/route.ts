import { type NextRequest, NextResponse } from "next/server"
import { getUsers } from "@/lib/user-actions"
import { getServerSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const session = await getServerSession()

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  
  // Extract search parameters
  const name = searchParams.get("name") || undefined
  const role = searchParams.get("role") || undefined
  const status = searchParams.get("status") || undefined
  
  // Create search object only if at least one search parameter exists
  const search = name || role || status ? { name, role, status } : undefined

  const result = await getUsers(page, limit, search)

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json(result)
}
