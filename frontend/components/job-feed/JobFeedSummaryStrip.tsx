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
    <div className={`${jobFeedTheme.panel} rounded-[24px] p-4`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-sm font-bold text-primary">
            {job.company.slice(0, 1)}
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">{job.title}</p>
            <p className="text-xs text-muted-foreground">{job.company}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {badges.slice(0, 2).map((badge) => (
            <span key={badge} className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
              <BriefcaseBusiness className="h-3.5 w-3.5 text-primary" />
              {badge}
            </span>
          ))}
          <Link
            href={`/job-application/${job.id}`}
            prefetch
            className="inline-flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-primary transition hover:bg-accent/80"
          >
            Open role
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default JobFeedSummaryStrip
