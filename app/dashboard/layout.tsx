import type React from "react"
import { redirect } from "next/navigation"
import { getServerSession } from "@/lib/auth"
import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"
import { ThemeToggle } from "@/components/theme-toggle"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background shadow-sm">
        <div className="flex h-16 items-center px-4">
          <div className="flex items-center font-semibold">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            User Management
          </div>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <UserNav user={session.user} />
          </div>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden pt-16">
        <aside className="fixed left-0 top-16 bottom-0 z-40 w-64 border-r bg-muted/40 hidden md:block overflow-y-auto">
          <DashboardNav />
        </aside>
        <main className="flex-1 overflow-y-auto pl-0 md:pl-64 pt-0">
          <div className="container p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
