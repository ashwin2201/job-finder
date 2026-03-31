import { ChevronDown, ChevronRight } from "lucide-react"

import { detailFilters, jobFeedTheme, primaryFilterOptions } from "./theme"

type JobFeedSidebarProps = {
  companies: string[]
  activeCompany?: string | null
  onCompanyPick: (company: string) => void
}

const JobFeedSidebar = ({ companies, activeCompany, onCompanyPick }: JobFeedSidebarProps) => {
  return (
    <aside className={`${jobFeedTheme.sidebar} min-h-full p-5`}>
      <div className="space-y-4">
        {primaryFilterOptions.map((option) => (
          <button
            key={option}
            type="button"
            className={`flex h-auto w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold ${jobFeedTheme.panel} ${jobFeedTheme.title} hover:bg-accent`}
          >
            <span className="flex items-center gap-2">
              <span className="text-primary">+</span>
              {option}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        ))}
      </div>

      <div className={`${jobFeedTheme.panel} mt-5 rounded-[24px] p-4`}>
        <h2 className={`text-lg font-semibold ${jobFeedTheme.title}`}>Key Info</h2>
        <div className="mt-4 space-y-2">
          {detailFilters.map((item) => (
            <button
              key={item}
              type="button"
              className="flex h-auto w-full items-center justify-between rounded-2xl px-3 py-3 text-left text-sm font-medium text-foreground hover:bg-accent"
            >
              <span>{item}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>

      <div className={`${jobFeedTheme.panel} mt-5 rounded-[24px] p-4`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${jobFeedTheme.title}`}>Top Companies</h2>
          <span className={`text-xs font-semibold uppercase tracking-[0.24em] ${jobFeedTheme.muted}`}>Quick picks</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {companies.map((company) => {
            const active = activeCompany === company
            return (
              <button
                key={company}
                type="button"
                onClick={() => onCompanyPick(company)}
                className={`rounded-full px-3 py-2 text-xs font-semibold ${
                  active
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {company}
              </button>
            )
          })}
        </div>
      </div>

      <button type="button" className={`mt-6 w-full rounded-[18px] px-4 py-4 text-sm font-semibold transition ${jobFeedTheme.button}`}>
        Apply Filters
      </button>
    </aside>
  )
}

export default JobFeedSidebar
