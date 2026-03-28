import { Job } from "@/types/Job"

import JobPosting from "../JobPosting"

type JobFeedListProps = {
  jobs: Job[]
  selectedJobId: number | null
  onSelect: (jobId: number) => void
}

const JobFeedList = ({ jobs, selectedJobId, onSelect }: JobFeedListProps) => {
  return (
    <section className="space-y-4">
      {jobs.map((job, index) => (
        <JobPosting
          key={job.id}
          job={job}
          index={index}
          selected={job.id === selectedJobId}
          onSelect={() => onSelect(job.id)}
        />
      ))}
    </section>
  )
}

export default JobFeedList
