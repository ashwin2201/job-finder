"use client"

import React, { useEffect, useState } from 'react'
import JobPosting from '../components/JobPosting';
import { Job } from "@/types/Job";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const JobFeed = () => {
    const [jobPostings, setJobPostings] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchAndSetJobPostings = async() => {
        try {
            setLoading(true);
            const jobs = await fetch(`${API_URL}/jobs`, {
                method: "GET"
            });
            if (!jobs.ok) {
                throw new Error("Failed to fetch job postings");
            }
            const data = await jobs.json();
            setJobPostings(data);
            setLoading(false);
        }
        catch (err) {
            console.error("Error fetching job postings:", err);
        }
    }

    useEffect(() => {
        fetchAndSetJobPostings();
    }, [])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            {loading && <p className="text-lg text-gray-600">Loading job postings...</p>}
            {!loading && jobPostings.length === 0 && <p className="text-lg text-gray-600">No job postings available.</p>}
            {!loading && jobPostings.length > 0 &&
                <div className="w-4xl flex flex-col justify-center items-center p-4 gap-2">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Job Feed</h1>
                    {jobPostings.map((job) => (
                        <JobPosting key={job.id} job={job} />
                    ))}
                </div>
            }
        </div>
    )}

export default JobFeed;