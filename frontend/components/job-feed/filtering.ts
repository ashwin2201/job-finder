import { Job } from "@/types/Job"

export const WORK_STYLE_OPTIONS = ["Remote", "Hybrid", "On-site"] as const
export const LANGUAGE_OPTIONS = ["English OK", "Japanese Required", "No Japanese Required"] as const
export const VISA_OPTIONS = ["Visa Sponsorship"] as const

export type WorkStyleOption = (typeof WORK_STYLE_OPTIONS)[number]
export type LanguageOption = (typeof LANGUAGE_OPTIONS)[number]
export type VisaOption = (typeof VISA_OPTIONS)[number]

export type JobFilters = {
  workStyles: WorkStyleOption[]
  languages: LanguageOption[]
  visaSupport: VisaOption[]
}

export type FilterCounts = {
  workStyles: Record<WorkStyleOption, number>
  languages: Record<LanguageOption, number>
  visaSupport: Record<VisaOption, number>
}

export const emptyJobFilters = (): JobFilters => ({
  workStyles: [],
  languages: [],
  visaSupport: [],
})

const createCountRecord = <T extends string>(options: readonly T[]): Record<T, number> =>
  Object.fromEntries(options.map((option) => [option, 0])) as Record<T, number>

const normalizeSource = (job: Job) => `${job.title} ${job.location ?? ""} ${job.description ?? ""}`.toLowerCase()

export const deriveLanguage = (job: Job): LanguageOption => {
  const source = normalizeSource(job)

  if (source.includes("english")) {
    return "English OK"
  }

  if (source.includes("japanese")) {
    return "Japanese Required"
  }

  return "No Japanese Required"
}

export const deriveWorkStyle = (job: Job): WorkStyleOption | null => {
  const source = normalizeSource(job)

  if (source.includes("hybrid")) {
    return "Hybrid"
  }

  if (source.includes("remote")) {
    return "Remote"
  }

  if (
    source.includes("on-site") ||
    source.includes("onsite") ||
    source.includes("on site") ||
    source.includes("in office")
  ) {
    return "On-site"
  }

  return null
}

export const hasVisaSupport = (job: Job) => {
  const source = normalizeSource(job)

  return source.includes("visa")
}

export const deriveJobBadges = (job: Job) => {
  const badges = ["Visa Sponsorship", deriveLanguage(job)] as string[]
  const workStyle = deriveWorkStyle(job)

  if (workStyle === "Remote") {
    badges.push("Remote Friendly")
  } else if (workStyle === "Hybrid") {
    badges.push("Hybrid")
  }

  return badges.slice(0, 3)
}

export const matchesJobFilters = (job: Job, filters: JobFilters) => {
  const language = deriveLanguage(job)
  const workStyle = deriveWorkStyle(job)
  const visaSupport = hasVisaSupport(job)

  const matchesLanguage = filters.languages.length ? filters.languages.includes(language) : true
  const matchesWorkStyle = filters.workStyles.length ? (workStyle ? filters.workStyles.includes(workStyle) : false) : true
  const matchesVisa = filters.visaSupport.length ? visaSupport : true

  return matchesLanguage && matchesWorkStyle && matchesVisa
}

export const buildFilterCounts = (jobs: Job[]): FilterCounts => {
  const counts: FilterCounts = {
    workStyles: createCountRecord(WORK_STYLE_OPTIONS),
    languages: createCountRecord(LANGUAGE_OPTIONS),
    visaSupport: createCountRecord(VISA_OPTIONS),
  }

  jobs.forEach((job) => {
    const workStyle = deriveWorkStyle(job)
    const language = deriveLanguage(job)

    if (workStyle) {
      counts.workStyles[workStyle] += 1
    }

    counts.languages[language] += 1

    if (hasVisaSupport(job)) {
      counts.visaSupport["Visa Sponsorship"] += 1
    }
  })

  return counts
}

export const getTopCompanies = (jobs: Job[], limit = 6) => Array.from(new Set(jobs.map((job) => job.company))).slice(0, limit)

export const matchesSearchQuery = (job: Job, query: string) => {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return true
  }

  return [job.title, job.company, job.location, job.description]
    .filter(Boolean)
    .some((value) => value!.toLowerCase().includes(normalizedQuery))
}

export const filterJobs = (jobs: Job[], query: string, activeCompany: string | null, filters: JobFilters) =>
  jobs.filter((job) => {
    const matchesQuery = matchesSearchQuery(job, query)
    const matchesCompany = activeCompany ? job.company === activeCompany : true
    const matchesFilters = matchesJobFilters(job, filters)

    return matchesQuery && matchesCompany && matchesFilters
  })
