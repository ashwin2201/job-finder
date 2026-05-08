import { ChevronDown } from "lucide-react"

import {
  FilterCounts,
  JobFilters,
  LANGUAGE_OPTIONS,
  VISA_OPTIONS,
  WORK_STYLE_OPTIONS,
  LanguageOption,
  VisaOption,
  WorkStyleOption,
} from "./filtering"
import { jobFeedTheme } from "./theme"

type JobFeedSidebarProps = {
  companies: string[]
  activeCompany?: string | null
  onCompanyPick: (company: string) => void
  filters: JobFilters
  counts: FilterCounts
  onToggleWorkStyle: (value: WorkStyleOption) => void
  onToggleLanguage: (value: LanguageOption) => void
  onToggleVisaSupport: (value: VisaOption) => void
  onClearFilters: () => void
}

const FilterSection = <T extends string>({
  title,
  options,
  selected,
  counts,
  onToggle,
}: {
  title: string
  options: readonly T[]
  selected: T[]
  counts: Record<T, number>
  onToggle: (value: T) => void
}) => {
  return (
    <details open className={`${jobFeedTheme.panel} overflow-hidden rounded-[24px]`}>
      <summary className={`flex cursor-pointer list-none items-center justify-between px-4 py-3 text-sm font-semibold ${jobFeedTheme.title}`}>
        <span>{title}</span>
        <ChevronDown className="h-4 w-4 text-[#8e8a80]" />
      </summary>

      <div className="border-t border-border px-4 py-3">
        <div className="space-y-2">
          {options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center justify-between rounded-2xl px-3 py-2 text-sm transition hover:bg-[#faf7f1]"
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(option)}
                  onChange={() => onToggle(option)}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span className="text-[#4d4953]">{option}</span>
              </span>
              <span className="text-xs font-semibold text-[#8e8a80]">{counts[option]}</span>
            </label>
          ))}
        </div>
      </div>
    </details>
  )
}

const JobFeedSidebar = ({
  companies,
  activeCompany,
  onCompanyPick,
  filters,
  counts,
  onToggleWorkStyle,
  onToggleLanguage,
  onToggleVisaSupport,
  onClearFilters,
}: JobFeedSidebarProps) => {
  const hasActiveFilters = Boolean(activeCompany || filters.workStyles.length || filters.languages.length || filters.visaSupport.length)

  return (
    <aside className={`${jobFeedTheme.sidebar} min-h-full p-5`}>
      <div className="space-y-4">
        <FilterSection
          title="Work Style"
          options={WORK_STYLE_OPTIONS}
          selected={filters.workStyles}
          counts={counts.workStyles}
          onToggle={onToggleWorkStyle}
        />
        <FilterSection
          title="Language"
          options={LANGUAGE_OPTIONS}
          selected={filters.languages}
          counts={counts.languages}
          onToggle={onToggleLanguage}
        />
        <FilterSection
          title="Visa Support"
          options={VISA_OPTIONS}
          selected={filters.visaSupport}
          counts={counts.visaSupport}
          onToggle={onToggleVisaSupport}
        />
      </div>

      <div className={`${jobFeedTheme.panel} mt-5 p-4`}>
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-semibold ${jobFeedTheme.title}`}>Top Companies</h2>
          <span className={`text-xs font-semibold uppercase tracking-[0.24em] ${jobFeedTheme.muted}`}>Quick picks</span>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {companies.map((company: string) => {
            const active = activeCompany === company
            return (
              <button
                key={company}
                type="button"
                onClick={() => onCompanyPick(company)}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition ${
                  active ? "bg-[#ef4444] text-white" : "bg-[#f4f1eb] text-[#5a5660] hover:bg-[#ece7de]"
                }`}
              >
                {company}
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={onClearFilters}
        disabled={!hasActiveFilters}
        className={`mt-6 w-full rounded-[18px] px-4 py-4 text-sm font-semibold transition ${
          hasActiveFilters ? jobFeedTheme.button : "bg-muted text-muted-foreground"
        }`}
      >
        Clear Filters
      </button>
    </aside>
  )
}

export default JobFeedSidebar
