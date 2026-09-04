import type { Metadata } from "next"

import "../globals.css"
import AppRail from "@/components/layout/AppRail"
import { appTheme } from "@/lib/theme"

export const metadata: Metadata = {
  title: "JobNavi Japan",
  description: "Discover Japan-focused jobs and tailor your resume with Clerk-powered auth.",
}

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-muted/60 px-4 sm:px-6">
      <div className={`mx-auto grid min-h-screen max-w-[1440px] ${appTheme.shell} lg:grid-cols-[76px_minmax(0,1fr)]`}>
        <AppRail />
        {children}
      </div>
    </div>
  )
}
