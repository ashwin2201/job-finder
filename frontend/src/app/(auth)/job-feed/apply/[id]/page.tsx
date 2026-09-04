import { JobApplyDetailScreen } from "@/features/applications"

type JobApplyDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function JobApplyDetailPage({
  params,
}: JobApplyDetailPageProps) {
  const { id } = await params

  return <JobApplyDetailScreen jobId={id} />
}
