"use client"

import React, { useEffect } from 'react'
import JobApplicationForm from '../components/JobApplicationForm';
import { Job } from "@/types/Job";

const JobApplicationPage = () => {
    // get job from url
    const jobId = window.location.pathname.split('/').pop();
    const [job, setJob] = React.useState<Job | null>(null);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${jobId}`, {
            method: "GET"
        }).then(response => response.json())
        .then((data) => {
            setJob(data);
        })
        .catch((err) => {
            console.error("Error fetching job details:", err);
            setJob(null);
        })
    }, [jobId])

    return (
        <div className="flex flex-col justify-center items-center p-4 gap-2 py-8">
            <h1>Applying for job {job?.title}</h1>
            <JobApplicationForm/>
        </div>
    )
}

export default JobApplicationPage;