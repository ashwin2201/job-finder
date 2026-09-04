"use client"

import Link from "next/link"
import { BriefcaseBusiness } from "lucide-react"
import { useState } from "react"

import type { DashboardJob } from "@/features/dashboard/api/get-dashboard-data"
import { appTheme } from "@/lib/theme"

type DashboardMatchesProps = {
  matchCount: number
  savedJobCount: number
  matches: DashboardJob[]
  savedJobs: DashboardJob[]
}

const DashboardMatches = ({
  matchCount,
  savedJobCount,
  matches,
  savedJobs,
}: DashboardMatchesProps) => {
  const [activeTab, setActiveTab] = useState<"matches" | "saved">("matches")
  const jobs = activeTab === "matches" ? matches : savedJobs

  return (
    <section>
      <div className={`${appTheme.panel} p-5`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efece5] pb-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("matches")}
              className={`px-4 py-2 text-sm font-semibold ${
                activeTab === "matches"
                  ? "bg-[#fff2ef] text-[#ef4444]"
                  : "text-[#78736b] hover:bg-[#faf8f3]"
              }`}
            >
              Matches ({matchCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-2 text-sm font-semibold ${
                activeTab === "saved"
                  ? "bg-[#fff2ef] text-[#ef4444]"
                  : "text-[#78736b] hover:bg-[#faf8f3]"
              }`}
            >
              Saved ({savedJobCount})
            </button>
          </div>
          <Link href="/job-feed" prefetch className="text-sm font-semibold text-[#ef4444]">
            Open feed
          </Link>
        </div>

        <div className="mt-5 space-y-4">
          {jobs.map((job, index) => (
            <article
              key={job.id}
              className={`rounded-[24px] border p-5 transition ${
                index === 0
                  ? "border-[#f3c9c0] bg-white shadow-[0_18px_40px_rgba(248,113,113,0.10)]"
                  : "border-[#ebe7de] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#7397e8,#4f74e8)] text-white shadow-sm">
                    <BriefcaseBusiness className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className={`text-2xl font-semibold tracking-tight ${appTheme.title}`}>{job.title}</h3>
                    <p className={`mt-1 text-base ${appTheme.muted}`}>{job.company}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span className={appTheme.muted}>{job.location || "Japan"}</span>
                      {job.reason ? (
                        <span className={`font-semibold ${appTheme.title}`}>{job.reason}</span>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#ef4444] px-3 py-1.5 text-xs font-semibold text-white">
                    {job.score === null ? "Saved" : `${job.score}% match`}
                  </span>
                  <Link
                    href="/job-feed"
                    prefetch
                    className="rounded-full bg-[#f3f0e9] px-3 py-1.5 text-xs font-semibold text-[#6e6960]"
                  >
                    View role
                  </Link>
                </div>
              </div>
            </article>
          ))}
          {jobs.length === 0 ? (
            <div className="border border-dashed border-[#ded9cf] bg-[#faf8f3] px-5 py-10 text-center">
              <p className={`text-base font-semibold ${appTheme.title}`}>
                {activeTab === "matches"
                  ? "No job matches yet"
                  : "No saved jobs yet"}
              </p>
              <p className={`mt-2 text-sm ${appTheme.muted}`}>
                {activeTab === "matches"
                  ? "Add a primary resume and refresh your matches to populate this list."
                  : "Save roles from the job feed and they will appear here."}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export default DashboardMatches
