import type { Metadata } from "next"

import "../globals.css"
import JobFeedRail from "@/components/job-feed/JobFeedRail"
import { jobFeedTheme } from "@/components/job-feed/theme"

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
      <div className={`mx-auto grid min-h-screen max-w-[1440px] ${jobFeedTheme.shell} lg:grid-cols-[76px_minmax(0,1fr)]`}>
        <JobFeedRail />
        {children}
      </div>
    </div>
  )
}
