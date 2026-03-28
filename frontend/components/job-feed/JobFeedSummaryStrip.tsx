import Link from "next/link"
import { ArrowUpRight, BriefcaseBusiness } from "lucide-react"

import { Job } from "@/types/Job"

import { jobFeedTheme } from "./theme"

type JobFeedSummaryStripProps = {
  job: Job | null
  badges: string[]
}

const JobFeedSummaryStrip = ({ job, badges }: JobFeedSummaryStripProps) => {
  if (!job) {
    return null
  }

  return (
    <div className={`${jobFeedTheme.panel} flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between`}>
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff2ef] text-sm font-bold text-[#ef4444]">
          {job.company.slice(0, 1)}
        </div>
        <div>
          <p className="text-sm font-semibold text-[#1c1a21]">{job.title}</p>
          <p className="text-xs text-[#8e8a80]">{job.company}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {badges.slice(0, 2).map((badge) => (
          <span key={badge} className="inline-flex items-center gap-1 rounded-full bg-[#f6f1e9] px-3 py-1 text-xs font-semibold text-[#5d5961]">
            <BriefcaseBusiness className="h-3.5 w-3.5 text-[#ef4444]" />
            {badge}
          </span>
        ))}
        <Link
          href={`/job-application/${job.id}`}
          prefetch
          className="inline-flex items-center gap-1 rounded-full bg-[#fff0ee] px-4 py-2 text-xs font-semibold text-[#ef4444] transition hover:bg-[#ffe4df]"
        >
          Open role
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  )
}

export default JobFeedSummaryStrip
