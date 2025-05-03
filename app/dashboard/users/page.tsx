import type { Metadata } from "next"
import { PageUsersContent } from "@/components/page-users-content"

export const metadata: Metadata = {
  title: "Users | User Management",
  description: "Manage users in the dashboard",
}

export default function UsersPage() {
  return <PageUsersContent />
}
