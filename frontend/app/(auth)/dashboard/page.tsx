"use client"

import DashboardFeaturedJobs from "@/components/dashboard/DashboardFeaturedJobs"
import DashboardHeader from "@/components/dashboard/DashboardHeader"
import DashboardHero from "@/components/dashboard/DashboardHero"
import DashboardMatches from "@/components/dashboard/DashboardMatches"
import DashboardSidebar from "@/components/dashboard/DashboardSidebar"
import { dashboardQuickPicks } from "@/components/dashboard/data"

const Dashboard = () => {
  return (
    <div className="overflow-y-auto">
      <main className="bg-secondary/40">
        <DashboardHeader />
        
        <div className="min-h-0 p-6 sm:p-6">
          <div className="space-y-6">
            <DashboardHero />
            <DashboardMatches />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
