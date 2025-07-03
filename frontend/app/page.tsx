import React from 'react';

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <h1 className="text-4xl sm:text-5xl font-bold text-center sm:text-left">
          Welcome to the Job Finder App
        </h1>
        <p className="text-lg sm:text-xl text-gray-700 text-center sm:text-left">
          Find your dream job with ease. Browse through our job listings and
          apply directly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/job-feed"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Job Feed
          </a>
          <a
            href="/job-application"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Create My Profile
          </a>
          <a
            href="/job-application"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Resume Builder
          </a>
        </div>
      </main>
    </div>
  );
}
