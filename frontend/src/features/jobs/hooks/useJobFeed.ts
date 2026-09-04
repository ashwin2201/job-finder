import { useCallback, useEffect, useMemo, useState } from "react"

import {
  buildFilterCounts,
  deriveJobBadges,
  emptyJobFilters,
  getTopCompanies,
  JobFilters,
} from "@/features/jobs/lib/filtering"
import type { Job } from "@/types/job"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const fallbackCompanies = ["Tech Solutions", "Rakuten", "Mercari", "PayPay", "SmartHR", "Line Yahoo"]
const JOBS_PER_PAGE = 8

type JobApiResponse = {
  id: string
  company_id: string
  title: string
  company: string
  status: string
  published_at: string | null
  location: string
  description: string
}

type JobPageApiResponse = {
  items: JobApiResponse[]
  page: number
  page_size: number
  total: number
  total_pages: number
}

export const useJobFeed = () => {
  const [jobPostings, setJobPostings] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null)
  const [activeCompany, setActiveCompany] = useState<string | null>(null)
  const [filters, setFilters] = useState<JobFilters>(emptyJobFilters)
  const [showJobDetail, setShowJobDetail] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalJobs, setTotalJobs] = useState(0)
  const [totalPages, setTotalPages] = useState(1)

  const fetchAndSetJobPostings = useCallback(async (signal?: AbortSignal) => {
    try {
      setLoading(true)
      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured")
      }

      const params = new URLSearchParams({
        page: String(currentPage),
        page_size: String(JOBS_PER_PAGE),
      })
      if (searchQuery.trim()) {
        params.set("q", searchQuery.trim())
      }
      if (activeCompany) {
        params.set("company", activeCompany)
      }
      filters.workStyles.forEach((value) => params.append("work_styles", value))
      filters.languages.forEach((value) => params.append("languages", value))
      if (filters.visaSupport.length) {
        params.set("visa_support", "true")
      }

      const response = await fetch(`${API_URL.replace(/\/$/, "")}/jobs?${params}`, {
        method: "GET",
        headers: { Accept: "application/json" },
        signal,
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch job postings (${response.status})`)
      }

      const data: JobPageApiResponse = await response.json()
      setTotalJobs(data.total)
      setTotalPages(data.total_pages)
      setJobPostings(
        data.items.map((job) => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          datePosted: job.published_at ?? undefined,
        })),
      )
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return
      }
      console.error("Error fetching job postings:", err)
    } finally {
      if (!signal?.aborted) {
        setLoading(false)
      }
    }
  }, [activeCompany, currentPage, filters, searchQuery])

  useEffect(() => {
    const controller = new AbortController()
    void fetchAndSetJobPostings(controller.signal)

    return () => controller.abort()
  }, [fetchAndSetJobPostings])

  const companies = useMemo(() => {
    const liveCompanies = getTopCompanies(jobPostings)

    return liveCompanies.length ? liveCompanies : fallbackCompanies
  }, [jobPostings])

  const filterCounts = useMemo(() => buildFilterCounts(jobPostings), [jobPostings])

  const filteredJobs = jobPostings

  const paginatedJobs = jobPostings
  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
      activeCompany ||
      filters.workStyles.length ||
      filters.languages.length ||
      filters.visaSupport.length,
  )

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  useEffect(() => {
    if (!paginatedJobs.length) {
      setSelectedJobId(null)
      setShowJobDetail(false)
      return
    }

    if (!paginatedJobs.some((job) => job.id === selectedJobId)) {
      setSelectedJobId(paginatedJobs[0].id)
    }
  }, [paginatedJobs, selectedJobId])

  const selectedJob = paginatedJobs.find((job) => job.id === selectedJobId) ?? paginatedJobs[0] ?? null

  const detailBadges = useMemo(() => (selectedJob ? deriveJobBadges(selectedJob) : []), [selectedJob])

  const toggleFilterValue = <T extends string,>(key: keyof JobFilters, value: T) => {
    setCurrentPage(1)
    setFilters((current) => {
      const currentValues = current[key] as T[]
      const nextValues = currentValues.includes(value)
        ? currentValues.filter((entry) => entry !== value)
        : [...currentValues, value]

      return {
        ...current,
        [key]: nextValues,
      }
    })
  }

  const clearFilters = () => {
    setCurrentPage(1)
    setFilters(emptyJobFilters())
    setActiveCompany(null)
  }

  const toggleCompany = (company: string) => {
    setCurrentPage(1)
    setActiveCompany((current) => (current === company ? null : company))
  }

  const updateSearchQuery = (value: string) => {
    setCurrentPage(1)
    setSearchQuery(value)
  }

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages))
    setShowJobDetail(false)
  }

  const goToNextPage = () => {
    setCurrentPage((current) => Math.min(current + 1, totalPages))
    setShowJobDetail(false)
  }

  const goToPreviousPage = () => {
    setCurrentPage((current) => Math.max(current - 1, 1))
    setShowJobDetail(false)
  }

  const selectJob = (jobId: string) => {
    setSelectedJobId(jobId)
    setShowJobDetail(false)
  }

  const openJobDetail = (job: Job) => {
    setSelectedJobId(job.id)
    setShowJobDetail(true)
  }

  const closeJobDetail = () => {
    setShowJobDetail(false)
  }

  return {
    activeCompany,
    clearFilters,
    companies,
    detailBadges,
    fetchAndSetJobPostings,
    filterCounts,
    filteredJobs,
    filters,
    hasActiveFilters,
    goToNextPage,
    goToPage,
    goToPreviousPage,
    jobPostings,
    loading,
    openJobDetail,
    paginatedJobs,
    currentPage,
    searchQuery,
    selectJob,
    selectedJob,
    setSearchQuery: updateSearchQuery,
    showJobDetail,
    toggleCompany,
    toggleLanguage: (value: JobFilters["languages"][number]) => toggleFilterValue("languages", value),
    toggleVisaSupport: (value: JobFilters["visaSupport"][number]) => toggleFilterValue("visaSupport", value),
    toggleWorkStyle: (value: JobFilters["workStyles"][number]) => toggleFilterValue("workStyles", value),
    totalJobs,
    totalPages,
    closeJobDetail,
  }
}
