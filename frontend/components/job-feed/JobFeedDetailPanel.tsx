import Link from "next/link"
import { ArrowUpRight, Building2, ChevronDown, MapPin, Sparkles } from "lucide-react"

import { Job } from "@/types/Job"

import { jobFeedTheme } from "./theme"

type JobFeedDetailPanelProps = {
  job: Job | null
  badges: string[]
}

const JobFeedDetailPanel = ({ job, badges }: JobFeedDetailPanelProps) => {
  if (!job) {
    return (
      <aside className={`${jobFeedTheme.panel} flex min-h-[480px] items-center justify-center rounded-[24px] p-8`}>
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className={`text-xl font-semibold ${jobFeedTheme.title}`}>Pick a listing</h3>
          <p className={`text-sm ${jobFeedTheme.muted}`}>Select a job card to preview the summary and requirements.</p>
        </div>
      </aside>
    )
  }

  return (
    <aside className={`${jobFeedTheme.panel} overflow-hidden rounded-[24px]`}>
      <div className="border-b border-border p-5">
        <div className="flex items-center gap-4 rounded-[20px] border border-border bg-card p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-xl font-bold text-primary">
            {job.company.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <h3 className={`truncate text-lg font-semibold ${jobFeedTheme.title}`}>{job.company}</h3>
            <p className={`text-sm ${jobFeedTheme.muted}`}>Selected company</p>
          </div>
        </div>
      </div>

      <div className="h-44 border-y border-border bg-accent/40 p-4">
        <div className="relative h-full overflow-hidden rounded-[22px] border border-background/80 bg-gradient-to-br from-accent via-background to-secondary">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_82%,rgba(15,23,42,0.06),transparent_20%),radial-gradient(circle_at_82%_18%,rgba(15,23,42,0.08),transparent_18%)]" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Japan Focus</p>
            <h4 className={`mt-2 text-2xl font-semibold ${jobFeedTheme.title}`}>{job.title}</h4>
          </div>
        </div>
      </div>

      <div className="space-y-6 p-5">
        <div className="flex flex-wrap gap-2">
          {badges.map((badge, index) => (
            <span
              key={badge}
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                index === 0 ? "bg-primary text-primary-foreground" : jobFeedTheme.accentSoft
              }`}
            >
              {badge}
            </span>
          ))}
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className={`text-xl font-semibold ${jobFeedTheme.accent}`}>Job Description</h4>
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className={`text-sm leading-7 ${jobFeedTheme.muted}`}>
            {job.description || "This listing is ready for applicants who want a clearer view of role expectations, company context, and relocation-friendly details."}
          </p>
        </div>

        <div className="rounded-[20px] bg-secondary p-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <Building2 className="h-4 w-4 text-primary" />
              <span className={`text-sm ${jobFeedTheme.title}`}>{job.company}</span>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-primary" />
              <span className={`text-sm ${jobFeedTheme.title}`}>{job.location || "Japan"}</span>
            </div>
          </div>
        </div>

        <Link
          href={`/job-application/${job.id}`}
          prefetch
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[18px] bg-primary text-sm font-semibold text-primary-foreground shadow-[0_18px_36px_rgba(15,23,42,0.14)] hover:bg-primary/90"
        >
          Apply to this job
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </aside>
  )
}

export default JobFeedDetailPanel
