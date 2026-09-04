import { JobApplicationScreen } from "@/features/applications"

type JobApplicationPageProps = {
  params: Promise<{ id: string }>
}

export default async function JobApplicationPage({
  params,
}: JobApplicationPageProps) {
  const { id } = await params

  return <JobApplicationScreen jobId={id} />
}
