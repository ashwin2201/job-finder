import Link from "next/link"
import { BriefcaseBusiness, ChevronRight } from "lucide-react"

import { jobFeedTheme } from "@/components/job-feed/theme"
import { matchInsights, matchRows } from "./data"

const DashboardMatches = () => {
  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_320px]">
      <div className={`${jobFeedTheme.panel} p-5`}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efece5] pb-4">
          <div className="flex items-center gap-2">
            <span className="rounded-t-[18px] bg-[#fff2ef] px-4 py-2 text-sm font-semibold text-[#ef4444]">Matches (28)</span>
            <span className="rounded-t-[18px] px-4 py-2 text-sm font-semibold text-[#78736b]">Saved (12)</span>
          </div>
          <Link href="/job-feed" prefetch className="text-sm font-semibold text-[#ef4444]">
            Open feed
          </Link>
        </div>

        <div className="mt-5 space-y-4">
          {matchRows.map((job, index) => (
            <article
              key={job.title}
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
                    <h3 className={`text-2xl font-semibold tracking-tight ${jobFeedTheme.title}`}>{job.title}</h3>
                    <p className={`mt-1 text-base ${jobFeedTheme.muted}`}>{job.company}</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                      <span className={jobFeedTheme.muted}>{job.location}</span>
                      <span className={`font-semibold ${jobFeedTheme.title}`}>{job.salary}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#ef4444] px-3 py-1.5 text-xs font-semibold text-white">{job.badge}</span>
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
        </div>
      </div>

      <aside className="space-y-5">
        <div className={`${jobFeedTheme.panel} p-5`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-2xl font-semibold ${jobFeedTheme.title}`}>Match score</h3>
            <ChevronRight className="h-5 w-5 text-[#8e8a80]" />
          </div>
          <div className="mt-5 rounded-[22px] bg-[#faf8f3] p-5">
            <p className={`text-sm ${jobFeedTheme.muted}`}>Current profile fit</p>
            <p className={`mt-2 text-5xl font-semibold ${jobFeedTheme.title}`}>{matchInsights.score}</p>
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ef4444]">Strengths</h4>
              <ul className="mt-3 space-y-3 text-sm text-[#5e5963]">
                {matchInsights.strengths.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#fff2ef] text-[#ef4444]">+</div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f97360]">Weaknesses</h4>
              <ul className="mt-3 space-y-3 text-sm text-[#5e5963]">
                {matchInsights.gaps.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#fff6f3] text-[#f97360]">-</div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/submit-resume"
            prefetch
            className={`mt-6 inline-flex w-full items-center justify-center rounded-[18px] px-4 py-3 text-sm font-semibold transition ${jobFeedTheme.button}`}
          >
            Improve My Resume
          </Link>
        </div>
      </aside>
    </section>
  )
}

export default DashboardMatches
