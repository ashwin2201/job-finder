"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Flame } from "lucide-react"

import JobFeedDetailPanel from "../../components/job-feed/JobFeedDetailPanel"
import JobFeedHeader from "../../components/job-feed/JobFeedHeader"
import JobFeedList from "../../components/job-feed/JobFeedList"
import JobFeedRail from "../../components/job-feed/JobFeedRail"
import JobFeedSidebar from "../../components/job-feed/JobFeedSidebar"
import JobFeedSummaryStrip from "../../components/job-feed/JobFeedSummaryStrip"
import { jobFeedTheme } from "../../components/job-feed/theme"
import { Job } from "@/types/Job"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const fallbackCompanies = ["Tech Solutions", "Rakuten", "Mercari", "PayPay", "SmartHR", "Line Yahoo"]

const JobFeed = () => {
  const [jobPostings, setJobPostings] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [activeCompany, setActiveCompany] = useState<string | null>(null)

  const fetchAndSetJobPostings = async () => {
    try {
      setLoading(true)
      const jobs = await fetch(`${API_URL}/jobs`, { method: "GET" })
      if (!jobs.ok) {
        throw new Error("Failed to fetch job postings")
      }

      const data = await jobs.json()
      setJobPostings(data)
    } catch (err) {
      console.error("Error fetching job postings:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAndSetJobPostings()
  }, [])

  const normalizedQuery = searchQuery.trim().toLowerCase()

  const liveCompanies = useMemo(
    () => Array.from(new Set(jobPostings.map((job) => job.company))).slice(0, 6),
    [jobPostings]
  )

  const filteredJobs = useMemo(() => {
    return jobPostings.filter((job) => {
      const matchesQuery = normalizedQuery
        ? [job.title, job.company, job.location, job.description]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(normalizedQuery))
        : true

      const matchesCompany = activeCompany ? job.company === activeCompany : true

      return matchesQuery && matchesCompany
    })
  }, [activeCompany, jobPostings, normalizedQuery])

  useEffect(() => {
    if (!filteredJobs.length) {
      setSelectedJobId(null)
      return
    }

    if (!filteredJobs.some((job) => job.id === selectedJobId)) {
      setSelectedJobId(filteredJobs[0].id)
    }
  }, [filteredJobs, selectedJobId])

  const selectedJob = filteredJobs.find((job) => job.id === selectedJobId) ?? filteredJobs[0] ?? null

  const detailBadges = useMemo(() => {
    if (!selectedJob) {
      return []
    }

    const source = `${selectedJob.title} ${selectedJob.description ?? ""}`.toLowerCase()
    const badges = ["Visa Sponsorship"]

    if (source.includes("english")) {
      badges.push("English OK")
    } else if (source.includes("japanese")) {
      badges.push("Japanese Needed")
    } else {
      badges.push("No Japanese Required")
    }

    if (source.includes("remote")) {
      badges.push("Remote Friendly")
    }

    return badges.slice(0, 3)
  }, [selectedJob])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ece9e2] px-4 py-8">
        <div className={`mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center rounded-[34px] ${jobFeedTheme.shell}`}>
          <div className="flex flex-col items-center gap-4 text-slate-600">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#f3e4df] border-t-[#ef4444]" />
            <p className="text-lg font-medium">Building your personalized listings view...</p>
          </div>
        </div>
      </div>
    )
  }

  if (jobPostings.length === 0) {
    return (
      <div className="min-h-screen bg-[#ece9e2] px-4 py-8">
        <div className={`mx-auto flex min-h-[80vh] max-w-7xl items-center justify-center rounded-[34px] ${jobFeedTheme.shell}`}>
          <div className="max-w-md space-y-4 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#fff2ef] text-[#ef4444]">
              <Flame className="h-10 w-10" />
            </div>
            <h2 className="text-3xl font-semibold tracking-tight text-[#1c1a21]">No matching jobs yet</h2>
            <p className="text-[#8e8a80]">We couldn&apos;t find any job postings right now. Refresh the feed and we&apos;ll try again.</p>
            <button onClick={fetchAndSetJobPostings} className={`rounded-full px-6 py-3 font-medium transition ${jobFeedTheme.button}`}>
              Refresh Jobs
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-h-screen bg-[#ece9e2] px-4 py-6 sm:px-6">
      <div className={`mx-auto grid max-w-[1440px] max-h-screen overflow-hidden my-5 rounded-[34px] ${jobFeedTheme.shell} lg:grid-cols-[76px_255px_minmax(0,1fr)]`}>
        <JobFeedRail />

        <JobFeedSidebar
          companies={liveCompanies.length ? liveCompanies : fallbackCompanies}
          activeCompany={activeCompany}
          onCompanyPick={(company) => setActiveCompany((current) => (current === company ? null : company))}
        />

        <main className="min-w-0 bg-[#f8f6f1]">
          <JobFeedHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          <div className="grid gap-5 p-5 sm:p-6 xl:grid-cols-[minmax(0,1.4fr)_320px]">
            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${jobFeedTheme.muted}`}>Live feed</p>
                  <h2 className={`mt-1 text-xl font-semibold ${jobFeedTheme.title}`}>Matching roles</h2>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#8e8a80] shadow-sm">
                  {filteredJobs.length} results
                </span>
              </div>

              {filteredJobs.length ? (
                <div className="overflowY-scroll">
                  <JobFeedList jobs={filteredJobs} selectedJobId={selectedJob?.id ?? null} onSelect={setSelectedJobId} />
                  <JobFeedSummaryStrip job={selectedJob} badges={detailBadges} />
                </div>
              ) : (
                <div className={`${jobFeedTheme.panel} p-8 text-center`}>
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff2ef] text-[#ef4444]">
                    <Flame className="h-6 w-6" />
                  </div>
                  <h3 className={`mt-4 text-xl font-semibold ${jobFeedTheme.title}`}>No jobs match those filters</h3>
                  <p className={`mt-2 text-sm ${jobFeedTheme.muted}`}>Try a different keyword or clear the company quick-pick.</p>
                </div>
              )}
            </section>

            <JobFeedDetailPanel job={selectedJob} badges={detailBadges} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default JobFeed
