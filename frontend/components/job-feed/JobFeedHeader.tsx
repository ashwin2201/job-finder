"use client"

import { UserButton } from "@clerk/nextjs"
import { Search, SlidersHorizontal } from "lucide-react"

import { jobFeedTheme } from "./theme"

type JobFeedHeaderProps = {
  searchQuery: string
  onSearchChange: (value: string) => void
}

const JobFeedHeader = ({ searchQuery, onSearchChange }: JobFeedHeaderProps) => {
  return (
    <header className="flex flex-col gap-5 border-b border-[#eceae4] px-5 py-5 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className={`text-xs font-semibold uppercase tracking-[0.26em] ${jobFeedTheme.muted}`}>Tailored default feed</p>
        <h1 className={`mt-1 text-3xl font-semibold ${jobFeedTheme.title}`}>Job Listings</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className={`flex min-w-0 flex-1 items-center gap-3 rounded-2xl px-4 py-3 ${jobFeedTheme.search} sm:min-w-[300px]`}>
          <Search className="h-4 w-4 text-[#8e8a80]" />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search job or position"
            className="w-full bg-transparent text-sm text-[#302d35] outline-none placeholder:text-[#aaa59b]"
          />
        </div>
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ece8e0] bg-white text-[#4f9e6f] shadow-sm">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <div className="rounded-2xl border border-[#ece8e0] bg-white p-1.5 shadow-sm">
          <UserButton />
        </div>
      </div>
    </header>
  )
}

export default JobFeedHeader
