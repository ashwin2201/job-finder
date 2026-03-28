import JobApplicationForm from '../../../components/JobApplicationForm';
import { Job } from "@/types/Job";


const API_URL = process.env.NEXT_PUBLIC_API_URL;


type JobApplicationPageProps = {
    params: Promise<{ id: string }>;
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


const JobApplicationPage = async ({ params }: JobApplicationPageProps) => {
    const { id } = await params;
    const job = await fetchJob(id);

    return (
        <div className="flex flex-col justify-center items-center p-4 gap-2 py-8">
            <h1>Applying for job {job?.title ?? `#${id}`}</h1>
            <JobApplicationForm />
        </div>
    )
}


export default JobApplicationPage
