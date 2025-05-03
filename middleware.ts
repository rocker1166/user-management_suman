import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("auth-token")?.value

  // Check if the request is for the API or protected routes
  const isApiRequest = request.nextUrl.pathname.startsWith("/api")
  const isAuthRoute = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")

  // If it's an auth route and the user is already logged in, redirect to dashboard
  if (isAuthRoute && token) {
    try {
      await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
      return NextResponse.redirect(new URL("/dashboard", request.url))
    } catch (error) {
      // Token is invalid, continue to auth page
    }
  }

  // If it's not an auth route and there's no token, redirect to login
  if (!isAuthRoute && !token && !request.nextUrl.pathname.startsWith("/_next")) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // For API routes, return 401 if no token
  if (isApiRequest && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*", "/login", "/register"],
}
