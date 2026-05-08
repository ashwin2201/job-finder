"use client"

import React from "react"
import { Flame } from "lucide-react"

import JobFeedDetailPanel from "../../../components/job-feed/JobFeedDetailPanel"
import JobDetail from "../../../components/job-feed/JobDetail"
import JobFeedHeader from "../../../components/job-feed/JobFeedHeader"
import JobFeedList from "../../../components/job-feed/JobFeedList"
import JobFeedSidebar from "../../../components/job-feed/JobFeedSidebar"
import { jobFeedTheme } from "../../../components/job-feed/theme"
import { useJobFeed } from "../../../components/job-feed/useJobFeed"

const JobFeed = () => {
  const {
    activeCompany,
    clearFilters,
    companies,
    detailBadges,
    fetchAndSetJobPostings,
    filterCounts,
    filteredJobs,
    filters,
    jobPostings,
    loading,
    openJobDetail,
    searchQuery,
    selectJob,
    selectedJob,
    setSearchQuery,
    showJobDetail,
    toggleCompany,
    toggleLanguage,
    toggleVisaSupport,
    toggleWorkStyle,
    closeJobDetail,
  } = useJobFeed()

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/60 px-4 py-8">
        <div className={`mx-auto flex min-h-screen max-w-7xl items-center justify-center rounded-[34px] ${jobFeedTheme.shell}`}>
          <div className="flex flex-col items-s gap-4 text-slate-600">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-accent border-t-primary" />
            <p className="text-lg font-medium">Building your personalized listings view...</p>
          </div>
        </div>
      </div>
    )
  }

  if (jobPostings.length === 0) {
    return (
      <div className="min-h-screen bg-muted/60 px-4 py-8">
        <div className={`mx-auto flex min-h-screen max-w-7xl items-center justify-center rounded-[34px] ${jobFeedTheme.shell}`}>
          <div className="max-w-md space-y-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-accent text-primary">
              <Flame className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground">No matching jobs yet</h2>
            <p className="text-muted-foreground">We couldn&apos;t find any job postings right now. Refresh the feed and we&apos;ll try again.</p>
            <button onClick={fetchAndSetJobPostings} className={`rounded-full px-6 py-3 font-medium transition ${jobFeedTheme.button}`}>
              Refresh Jobs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[15vw_minmax(0,1fr)] overflow-y-auto">
      <div className="overflow-y-auto">
        <JobFeedSidebar
          companies={companies}
          activeCompany={activeCompany}
          filters={filters}
          counts={filterCounts}
          onCompanyPick={toggleCompany}
          onToggleWorkStyle={toggleWorkStyle}
          onToggleLanguage={toggleLanguage}
          onToggleVisaSupport={toggleVisaSupport}
          onClearFilters={clearFilters}
        />
      </div>

      <main className="grid min-w-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-secondary/40">
        <JobFeedHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <div className={`grid min-h-0 gap-5 p-5 sm:p-6 ${showJobDetail ? "xl:grid-cols-1" : "xl:grid-cols-[minmax(0,1.4fr)_320px]"}`}>
          <section className="flex min-h-0 flex-col gap-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${jobFeedTheme.muted}`}>Live feed</p>
                <h2 className={`mt-1 text-xl font-semibold ${jobFeedTheme.title}`}>Matching roles</h2>
              </div>
              <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
                {filteredJobs.length} results
              </span>
            </div>

            {filteredJobs.length ? (
              <div className="min-h-0 space-y-4 overflow-y-auto pr-2">
                {showJobDetail ? (
                  <JobDetail
                    job={selectedJob}
                    badges={detailBadges}
                    onBack={closeJobDetail}
                  />
                ) : (
                  <JobFeedList
                    jobs={filteredJobs}
                    selectedJobId={selectedJob?.id ?? null}
                    onSelect={selectJob}
                    onShowJobDetail={openJobDetail}
                  />
                )}
              </div>
            ) : (
              <div className={`${jobFeedTheme.panel} rounded-[24px] p-8 text-center`}>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
                  <Flame className="h-6 w-6" />
                </div>
                <h3 className={`mt-4 text-xl font-semibold ${jobFeedTheme.title}`}>No jobs match those filters</h3>
                <p className={`mt-2 text-sm ${jobFeedTheme.muted}`}>Try a different keyword or clear the company quick-pick.</p>
              </div>
            )}
          </section>

          <aside className={`h-10vh ${showJobDetail ? "hidden" : ""}`}>
            <div className="pl-1">
              <JobFeedDetailPanel job={selectedJob} badges={detailBadges} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default JobFeed
