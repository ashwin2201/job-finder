import React from 'react'
import JobPosting from '../components/JobPosting';

const JobFeed = () => {
    const jobPostings = [
        { id: 1, title: "Software Engineer", company: "Tech Corp", location: "Remote" },
        { id: 2, title: "Data Scientist", company: "Data Inc", location: "New York" },
        { id: 3, title: "Product Manager", company: "Product Co", location: "San Francisco" }
    ];

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