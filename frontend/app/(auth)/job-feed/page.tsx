"use client"

import React, { useRef } from "react"
import { ChevronLeft, ChevronRight, Flame } from "lucide-react"

import JobFeedDetailPanel from "../../../components/job-feed/JobFeedDetailPanel"
import JobDetail from "../../../components/job-feed/JobDetail"
import JobFeedHeader from "../../../components/job-feed/JobFeedHeader"
import JobFeedList from "../../../components/job-feed/JobFeedList"
import JobFeedSidebar from "../../../components/job-feed/JobFeedSidebar"
import { jobFeedTheme } from "../../../components/job-feed/theme"
import { useJobFeed } from "../../../components/job-feed/useJobFeed"

const JobFeed = () => {
  const listScrollRef = useRef<HTMLDivElement>(null)
  const {
    activeCompany,
    clearFilters,
    companies,
    detailBadges,
    fetchAndSetJobPostings,
    filterCounts,
    filteredJobs,
    filters,
    goToNextPage,
    goToPage,
    goToPreviousPage,
    jobPostings,
    loading,
    openJobDetail,
    paginatedJobs,
    currentPage,
    searchQuery,
    selectJob,
    selectedJob,
    setSearchQuery,
    showJobDetail,
    toggleCompany,
    toggleLanguage,
    toggleVisaSupport,
    toggleWorkStyle,
    totalPages,
    closeJobDetail,
  } = useJobFeed()

  const visiblePageCount = Math.min(totalPages, 5)
  const firstVisiblePage = Math.min(Math.max(currentPage - 2, 1), Math.max(totalPages - visiblePageCount + 1, 1))
  const paginationRange = Array.from({ length: visiblePageCount }, (_, index) => firstVisiblePage + index)

  const scrollListToTop = () => {
    listScrollRef.current?.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handlePageChange = (pageNumber: number) => {
    goToPage(pageNumber)
    scrollListToTop()
  }

  const handlePreviousPage = () => {
    goToPreviousPage()
    scrollListToTop()
  }

  const handleNextPage = () => {
    goToNextPage()
    scrollListToTop()
  }

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
    <div className="grid h-screen grid-cols-[15vw_minmax(0,1fr)] overflow-hidden">
      <div className="h-screen overflow-y-auto">
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

      <main className="grid h-screen min-w-0 grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-secondary/40">
        <JobFeedHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <div className={`grid min-h-0 gap-5 p-5 sm:p-6 ${showJobDetail ? "xl:grid-cols-1" : "xl:grid-cols-[minmax(0,1.4fr)_320px]"}`}>
          <section className="flex min-h-0 flex-col gap-4">
            <div className="flex shrink-0 items-center justify-between px-1">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${jobFeedTheme.muted}`}>Live feed</p>
                <h2 className={`mt-1 text-xl font-semibold ${jobFeedTheme.title}`}>Matching roles</h2>
              </div>
              <span className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-muted-foreground shadow-sm">
                {filteredJobs.length} results
              </span>
            </div>

            {filteredJobs.length ? (
              <div ref={listScrollRef} className="min-h-0 space-y-4 overflow-y-auto pr-2">
                {showJobDetail ? (
                  <JobDetail
                    job={selectedJob}
                    badges={detailBadges}
                    onBack={closeJobDetail}
                  />
                ) : (
                  <>
                    <JobFeedList
                      jobs={paginatedJobs}
                      selectedJobId={selectedJob?.id ?? null}
                      onSelect={selectJob}
                      onShowJobDetail={openJobDetail}
                    />

                    {totalPages > 1 ? (
                      <nav className={`flex flex-col gap-4 p-4`}>
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </button>

                          <div className="flex flex-wrap items-center gap-2">
                            {paginationRange.map((pageNumber) => (
                              <button
                                key={pageNumber}
                                type="button"
                                onClick={() => handlePageChange(pageNumber)}
                                className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold transition ${
                                  pageNumber === currentPage
                                    ? "bg-primary text-primary-foreground shadow-[0_12px_28px_rgba(239,68,68,0.24)]"
                                    : "border border-border bg-background text-foreground hover:bg-accent"
                                }`}
                              >
                                {pageNumber}
                              </button>
                            ))}
                          </div>

                          <button
                            type="button"
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </button>
                        </div>
                      </nav>
                    ) : null}
                  </>
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

          <aside className={`min-h-0 ${showJobDetail ? "hidden" : ""}`}>
            <div className="h-full overflow-y-auto pl-1 pr-1">
              <JobFeedDetailPanel job={selectedJob} badges={detailBadges} />
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default JobFeed
