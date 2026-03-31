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
    <header className="flex flex-col gap-5 border-b border-border px-5 py-5 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className={`text-xs font-semibold uppercase tracking-[0.26em] ${jobFeedTheme.muted}`}>Tailored default feed</p>
        <h1 className={`mt-1 text-3xl font-semibold ${jobFeedTheme.title}`}>Job Listings</h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:min-w-[300px]">
          <Search className={`pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 ${jobFeedTheme.muted}`} />
          <input
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search job or position"
            className={`h-12 w-full rounded-2xl border border-border pl-11 text-sm text-foreground shadow-none outline-none placeholder:text-muted-foreground ${jobFeedTheme.search}`}
          />
        </div>
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background text-primary shadow-sm transition hover:bg-accent">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <div className="rounded-2xl border border-border bg-background p-1.5 shadow-sm">
          <UserButton />
        </div>
      </div>
    </header>
  )
}

export default JobFeedHeader
