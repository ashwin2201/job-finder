import { ChevronLeft, Moon } from "lucide-react"

import { jobFeedTheme, railItems } from "./theme"

const JobFeedRail = () => {
  return (
    <aside className={`hidden min-h-full flex-col justify-between ${jobFeedTheme.rail} py-6 lg:flex`}>
      <div className="space-y-4">
        <div className="px-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ef4444] text-white shadow-[0_16px_30px_rgba(239,68,68,0.32)]">
            <span className="text-xl font-bold">J</span>
          </div>
        </div>

        <nav className="space-y-2 px-3">
          {railItems.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                active ? "bg-[#fff2ef] text-[#ef4444]" : "text-[#7e7a72] hover:bg-[#f4f1eb]"
              }`}
              aria-label={label}
            >
              {active ? <span className="absolute -right-3 h-8 w-1 rounded-full bg-[#ef4444]" /> : null}
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-3 px-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#8e8a80] hover:bg-[#f4f1eb]">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-[#ece8e0] bg-white text-[#8e8a80]">
          <Moon className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}

export default JobFeedRail
