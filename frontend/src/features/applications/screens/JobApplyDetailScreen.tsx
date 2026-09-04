"use client"

import React, { useState, useEffect } from 'react'

import type { Job } from '@/types/job';

const JobApplyDetailScreen = ({ jobId }: { jobId: string }) => {
    const [job, setJob] = useState<Job | null>(null);

    const fetchJobDetail = async (id: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/jobs/${id}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch job details");
            }
            const data = await response.json();
            setJob(data);
            return data;
        } catch (error) {
            console.error("Error fetching job details:", error);
            return "Error fetching job details";
        }
    }

    useEffect(() => {
        fetchJobDetail(jobId);
    }, [jobId])
    
    return (
        <div>
            <h1>{job?.title}</h1>
            <p>{job?.description}</p>
        </div>
    )
}

export default JobApplyDetailScreen
