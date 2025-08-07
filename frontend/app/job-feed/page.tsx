"use client"

import React, { useEffect, useState } from 'react'
import { SignedIn, SignedOut, SignInButton, useUser } from '@clerk/nextjs'
import JobPosting from '../../components/JobPosting';
import { Job } from "@/types/Job";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const JobFeed = () => {
    const [jobPostings, setJobPostings] = useState<Job[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const { user, isLoaded } = useUser();

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
        }
        catch (err) {
            console.error("Error fetching job postings:", err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAndSetJobPostings();
    }, [])

    return (
        <>
            <SignedOut>
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
                        <div className="text-6xl mb-4">🔐</div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Sign In Required</h2>
                        <p className="text-gray-600 mb-6">
                            Please sign in to access the job feed and discover amazing career opportunities.
                        </p>
                        <SignInButton>
                            <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold">
                                Sign In to Continue
                            </button>
                        </SignInButton>
                    </div>
                </div>
            </SignedOut>

            <SignedIn>
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg">
                        <div className="max-w-7xl mx-auto px-4 py-8">
                            <div className="text-center">
                                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                                    Job Feed
                                </h1>
                                <p className="text-red-100 text-lg">
                                    Welcome back{isLoaded && user ? `, ${user.firstName}` : ''}! Discover your next career opportunity
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="max-w-6xl mx-auto px-4 py-8">
                        {/* Loading State */}
                        {loading && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-red-600 mb-4"></div>
                                <p className="text-lg text-gray-600">Loading amazing job opportunities...</p>
                            </div>
                        )}

                        {/* Empty State */}
                        {!loading && jobPostings.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md mx-auto">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Jobs Found</h2>
                                    <p className="text-gray-600 mb-6">
                                        We couldn&apos;t find any job postings at the moment. Please try again later.
                                    </p>
                                    <button 
                                        onClick={fetchAndSetJobPostings}
                                        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold"
                                    >
                                        Refresh Jobs
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Job Listings */}
                        {!loading && jobPostings.length > 0 && (
                            <div className="space-y-6">
                                {/* Stats Bar */}
                                <div className="bg-white rounded-xl shadow-md p-6 border border-red-100">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">📊</span>
                                            <span className="text-lg font-semibold text-gray-800">
                                                {jobPostings.length} Job{jobPostings.length !== 1 ? 's' : ''} Available
                                            </span>
                                        </div>
                                        <button 
                                            onClick={fetchAndSetJobPostings}
                                            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
                                        >
                                            Refresh
                                        </button>
                                    </div>
                                </div>

                                {/* Job Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {jobPostings.map((job, index) => (
                                        <div 
                                            key={job.id}
                                            className="transform hover:scale-105 transition-transform duration-200"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <JobPosting job={job} />
                                        </div>
                                    ))}
                                </div>

                                {/* Load More Button (if needed) */}
                                <div className="text-center pt-8">
                                    <p className="text-gray-600 mb-4">
                                        Showing all {jobPostings.length} available positions
                                    </p>
                                    <button 
                                        onClick={fetchAndSetJobPostings}
                                        className="bg-white text-red-600 border-2 border-red-600 px-8 py-3 rounded-lg hover:bg-red-600 hover:text-white transition-colors duration-200 font-semibold"
                                    >
                                        Load More Jobs
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </SignedIn>
        </>
    )}

export default JobFeed;