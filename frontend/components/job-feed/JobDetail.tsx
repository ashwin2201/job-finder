import Link from "next/link"
import { ArrowLeft, ArrowUpRight, Building2, MapPin } from "lucide-react"

import { Job } from "@/types/Job"

import { jobFeedTheme } from "./theme"

type JobDetailProps = {
  job: Job | null
  badges: string[]
  onBack: () => void
}

const JobDetail = ({ job, badges, onBack }: JobDetailProps) => {
  if (!job) {
    return null
  }

  return (
    <div className={`${jobFeedTheme.panel} rounded-[24px] p-6`}>
      <div className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-secondary-foreground hover:bg-accent"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to listings
          </button>
          <Link
            href={`/job-application/${job.id}`}
            prefetch
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Apply now
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-3">
          <h2 className={`text-3xl font-semibold ${jobFeedTheme.title}`}>{job.title}</h2>
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              {job.company}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              {job.location || "Japan"}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <span
              key={badge}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                index === 0 ? "bg-primary text-primary-foreground" : "bg-accent text-primary"
              }`}
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="rounded-[24px] border border-border bg-card p-5 shadow-none">
          <h3 className={`text-lg font-semibold ${jobFeedTheme.title}`}>Role overview</h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {job.description || "This role is a strong fit for candidates looking for Japan-based opportunities with clearer hiring expectations and relocation-friendly signals."}
          </p>
        </div>
      </div>
    </div>
  )
}

export default JobDetail