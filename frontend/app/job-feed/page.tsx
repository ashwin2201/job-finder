"use client"

import React, { useEffect, useState } from 'react'
import JobPosting from '../../components/JobPosting';
import { Job } from "@/types/Job";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const JobFeed = () => {
    const [jobPostings, setJobPostings] = useState<Job[]>([]);

    const fetchAndSetJobPostings = async() => {
        try {
            const jobs = await fetch(`${API_URL}/jobs`, {
                method: "GET"
            });
            if (!jobs.ok) {
                throw new Error("Failed to fetch job postings");
            }
            const data = await jobs.json();
            setJobPostings(data);
        }
        catch (err) {
            console.error("Error fetching job postings:", err);
        }
    }

    useEffect(() => {
        fetchAndSetJobPostings();
    }, [])

    return (
    <div className="flex flex-col justify-center items-center p-4 gap-2">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Job Feed</h1>
        {jobPostings.map((job) => (
            <JobPosting key={job.id} job={job} />
        ))}
    </div>
    )
}

export default JobFeed;