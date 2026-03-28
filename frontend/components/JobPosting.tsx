import { Building2 } from "lucide-react"

import { Job } from "@/types/Job"

type JobPostingProps = {
  job: Job
  index?: number
  selected?: boolean
  onSelect?: () => void
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

const JobPosting = ({ job, index = 0, selected = false, onSelect }: JobPostingProps) => {
  const tags = deriveTags(job)

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-[22px] border p-5 text-left transition ${
        selected
          ? "border-[#f2c8c1] bg-white shadow-[0_16px_32px_rgba(239,68,68,0.10)]"
          : "border-[#e9e4da] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.04)] hover:border-[#efc7c0]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <div>
            <h3 className="text-[1.1rem] font-semibold tracking-tight text-[#1c1a21] sm:text-[1.35rem]">{job.title}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-[#7d786f]">
              <Building2 className="h-4 w-4 text-[#ef4444]" />
              <span>{job.company}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tags.map((tag, tagIndex) => (
              <span
                key={tag}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  tagIndex === 0 ? "bg-[#ef4444] text-white" : "bg-[#fff1ef] text-[#ef4444]"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <span className="shrink-0 rounded-full bg-[#ef4444] px-4 py-2 text-[11px] font-semibold text-white">
          {selected ? "Live now" : `Lab ${index + 1}`}
        </span>
      </div>
    </button>
  )
}

export default JobPosting
