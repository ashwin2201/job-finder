
import { auth, currentUser } from "@clerk/nextjs/server"

import PageHeader from "@/components/layout/PageHeader"
import { getDashboardData } from "@/features/dashboard/api/get-dashboard-data"
import DashboardHero from "@/features/dashboard/components/DashboardHero"
import DashboardMatches from "@/features/dashboard/components/DashboardMatches"

const Dashboard = async () => {
  const authState = await auth()
  const [user, token] = await Promise.all([
    currentUser(),
    authState.getToken(),
  ])
  const dashboard = await getDashboardData(token)

  return (
    <div className="overflow-y-auto">
      <main className="bg-secondary/40">
        <PageHeader eyebrow="Member dashboard" title="Dashboard" />

        <div className="min-h-0 p-6 sm:p-6">
          <div className="space-y-6">
            {dashboard.hasPartialFailure ? (
              <div
                role="status"
                className="border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
              >
                Some dashboard data could not be loaded. Available sections are
                still shown below.
                {dashboard.errors.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 font-mono text-xs">
                    {dashboard.errors.map((error) => (
                      <li key={error}>{error}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
            <DashboardHero
              firstName={user?.firstName ?? user?.username ?? "there"}
              applicationCount={dashboard.applicationCount}
              profileViewCount={dashboard.profileViewCount}
              unreadMessageCount={dashboard.unreadMessageCount}
              matchScore={dashboard.matchScore}
              resumeFeedback={dashboard.resumeFeedback}
            />
            <DashboardMatches
              matchCount={dashboard.matchCount}
              savedJobCount={dashboard.savedJobCount}
              matches={dashboard.matches}
              savedJobs={dashboard.savedJobs}
            />
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
