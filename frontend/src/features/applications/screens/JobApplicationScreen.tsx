import JobApplicationForm from "@/features/applications/components/JobApplicationForm"
import type { Job } from "@/types/job"


const API_URL = process.env.NEXT_PUBLIC_API_URL;


type JobApplicationPageProps = {
  jobId: string
}


async function fetchJob(jobId: string): Promise<Job | null> {
    try {
        const response = await fetch(`${API_URL}/jobs/${jobId}`, {
            method: "GET",
            cache: "no-store",
        });
        if (!response.ok) {
            return null;
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching job details:", error);
        return null;
    }
}


const JobApplicationScreen = async ({ jobId }: JobApplicationPageProps) => {
    const job = await fetchJob(jobId);

    return (
        <div className="flex flex-col justify-center items-center p-4 gap-2 py-8">
            <h1>Applying for job {job?.title ?? `#${jobId}`}</h1>
            <JobApplicationForm />
        </div>
    )
}


export default JobApplicationScreen
