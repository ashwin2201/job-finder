"use client"

import DashboardFeaturedJobs from "@/components/dashboard/DashboardFeaturedJobs"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import DashboardHero from "@/components/dashboard/DashboardHero"
import DashboardMatches from "@/components/dashboard/DashboardMatches"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import { dashboardQuickPicks } from "@/components/dashboard/data"

const Dashboard = () => {
  return (
    <>
      <div className="overflow-y-auto">
        <DashboardSidebar quickPicks={dashboardQuickPicks} />
      </div>

      <main className="grid min-w-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-secondary/40">
        <DashboardHeader />

        <div className="min-h-0 overflow-y-auto p-5 sm:p-6">
          <div className="space-y-6">
            <DashboardHero />
            <DashboardFeaturedJobs />
            <DashboardMatches />
          </div>
        </div>
      </main>
    </>
  )
}

export default Dashboard
