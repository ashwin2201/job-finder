import Link from "next/link"

import { jobFeedTheme } from "@/components/job-feed/theme"
import { featuredJobs } from "./data"

const DashboardFeaturedJobs = () => {
  return (
    <section>
      <div className="flex items-center justify-between px-1">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${jobFeedTheme.muted}`}>Curated picks</p>
          <h2 className={`mt-1 text-2xl font-semibold ${jobFeedTheme.title}`}>Featured jobs</h2>
        </div>
        <Link href="/job-feed" prefetch className="text-sm font-semibold text-[#ef4444]">
          View all jobs
        </Link>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        {featuredJobs.map(({ title, company, salary, tags, palette, badgeIcon: Icon }) => (
          <article key={title} className={`${jobFeedTheme.panel} overflow-hidden`}>
            <div className={`relative h-40 bg-gradient-to-br ${palette}`}>
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(28,26,33,0.48))]" />
              <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 bg-white text-[#ef4444] shadow-sm">
                <Icon className="h-5 w-5" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-1 text-sm text-white/85">{company}</p>
              </div>
            </div>

            <div className="space-y-4 p-5">
              <p className={`text-lg font-semibold ${jobFeedTheme.title}`}>{salary}</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={tag}
                    className={`rounded-full px-3 py-2 text-xs font-semibold ${
                      index === 0 ? "bg-[#ef4444] text-white" : "bg-[#fff2ef] text-[#ef4444]"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default DashboardFeaturedJobs
