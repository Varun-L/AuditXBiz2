// Update the admin dashboard to use the new enhanced dashboard
// Replace the existing admin page content with a redirect to the new dashboard

import { redirect } from "next/navigation"

export default function AdminPage() {
  redirect("/admin/dashboard")
}
