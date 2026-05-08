import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { jobFeedTheme } from "@/components/job-feed/theme"

type DashboardSidebarProps = {
  quickPicks: readonly string[]
}

const DashboardSidebar = ({ quickPicks }: DashboardSidebarProps) => {
  return (
    <aside className={`${jobFeedTheme.sidebar} min-h-full p-5`}>
      <div className={`${jobFeedTheme.panel} p-4`}>
        <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${jobFeedTheme.muted}`}>Dashboard</p>
        <h2 className={`mt-2 text-2xl font-semibold ${jobFeedTheme.title}`}>Momentum hub</h2>
        <p className={`mt-2 text-sm leading-6 ${jobFeedTheme.muted}`}>
          Keep your search moving with saved roles, match signals, and a cleaner next step for every application.
        </p>
      </div>

      <div className={`${jobFeedTheme.panel} mt-5 p-4`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${jobFeedTheme.title}`}>Quick picks</h3>
          <span className={`text-xs font-semibold uppercase tracking-[0.24em] ${jobFeedTheme.muted}`}>Today</span>
        </div>
        <div className="mt-4 space-y-2">
          {quickPicks.map((item, index) => (
            <button
              key={item}
              type="button"
              className={`flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
                index === 0 ? "bg-[#fff2ef] text-[#ef4444]" : "text-[#4d4953] hover:bg-[#faf7f1]"
              }`}
            >
              <span>{item}</span>
              <ChevronRight className="h-4 w-4 text-[#b0ab9f]" />
            </button>
          ))}
        </div>
      </div>

      <div className={`${jobFeedTheme.panel} mt-5 overflow-hidden`}>
        <div className="bg-[linear-gradient(135deg,#fff0eb,#ffe0d7)] p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#ef4444]/75">Resume Lab</p>
          <h3 className={`mt-2 text-xl font-semibold ${jobFeedTheme.title}`}>Sharpen your profile</h3>
          <p className="mt-2 text-sm leading-6 text-[#6f6a63]">
            Your strongest matches still need a more polished Japanese resume summary to stand out.
          </p>
        </div>
        <div className="p-4">
          <div className="rounded-[20px] bg-[#faf8f3] p-4">
            <div className="flex items-center justify-between text-sm">
              <span className={jobFeedTheme.muted}>Resume strength</span>
              <span className="font-semibold text-[#ef4444]">72%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-[#ece6dd]">
              <div className="h-2 w-[72%] rounded-full bg-[#ef4444]" />
            </div>
          </div>

          <Link
            href="/submit-resume"
            prefetch
            className={`mt-4 inline-flex w-full items-center justify-center rounded-[18px] px-4 py-3 text-sm font-semibold transition ${jobFeedTheme.button}`}
          >
            Improve My Resume
          </Link>
        </div>
      </div>
    </aside>
  )
}

export default DashboardSidebar
