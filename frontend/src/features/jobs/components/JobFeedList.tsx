import type { Job } from "@/types/job"

import JobPosting from "@/features/jobs/components/JobPosting"

type JobFeedListProps = {
  jobs: Job[]
  selectedJobId: string | null
  onSelect: (jobId: string) => void
  onShowJobDetail: (job: Job) => void
}

const JobFeedList = ({ jobs, selectedJobId, onSelect, onShowJobDetail }: JobFeedListProps) => {
  return (
    <section className="space-y-4">
      {jobs.map((job, index) => (
        <JobPosting
          key={job.id}
          job={job}
          index={index}
          selected={job.id === selectedJobId}
          onSelect={() => onSelect(job.id)}
          showJobDetail={() => onShowJobDetail(job)}
        />
      ))}
    </section>
  )
}

export default JobFeedList
