import { Building2 } from "lucide-react"

import { Job } from "@/types/Job"

type JobPostingProps = {
  job: Job
  index?: number
  selected?: boolean
  onSelect?: () => void
  showJobDetail?: () => void
}

const deriveTags = (job: Job) => {
  const tags: string[] = ["Visa Sponsorship"]
  const source = `${job.title} ${job.description ?? ""}`.toLowerCase()

  if (source.includes("english")) {
    tags.push("English OK")
  } else if (source.includes("japanese")) {
    tags.push("Japanese Needed")
  } else {
    tags.push("No Japanese Required")
  }

  if (source.includes("remote")) {
    tags.push("Remote Friendly")
  }

  return tags.slice(0, 3)
}

const JobPosting = ({ job, selected = false, onSelect, showJobDetail }: JobPostingProps) => {
  const tags = deriveTags(job)

  return (
    <article
      onClick={onSelect}
      className={`w-full cursor-pointer rounded-[22px] border p-5 text-left transition ${
        selected
          ? "border-primary/25 bg-card shadow-[0_16px_32px_rgba(15,23,42,0.10)]"
          : "border-border bg-card shadow-[0_10px_24px_rgba(15,23,42,0.04)] hover:border-primary/30"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-[1.1rem] font-semibold tracking-tight text-foreground sm:text-[1.35rem]">{job.title}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
              <Building2 className="h-4 w-4 text-primary" />
              <span>{job.company}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, tagIndex) => (
              <span
                key={tag}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  tagIndex === 0 ? "bg-primary text-primary-foreground" : "bg-accent text-primary"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            showJobDetail?.()
          }}
          className="shrink-0 rounded-full bg-primary px-4 py-2 text-[11px] font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Learn more
        </button>
      </div>
    </article>
  )
}

export default JobPosting
