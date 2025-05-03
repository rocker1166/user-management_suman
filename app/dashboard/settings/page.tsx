import type { Metadata } from "next"
import { PageSettingsContent } from "@/components/page-settings-content"

export const metadata: Metadata = {
  title: "Settings | User Management",
  description: "User management dashboard settings",
}

export default function SettingsPage() {
  return <PageSettingsContent />
}
