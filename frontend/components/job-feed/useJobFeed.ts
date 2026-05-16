import { useEffect, useMemo, useState } from "react"

import { Job } from "@/types/Job"

import {
  buildFilterCounts,
  deriveJobBadges,
  emptyJobFilters,
  filterJobs,
  getTopCompanies,
  JobFilters,
} from "./filtering"

const API_URL = process.env.NEXT_PUBLIC_API_URL
const fallbackCompanies = ["Tech Solutions", "Rakuten", "Mercari", "PayPay", "SmartHR", "Line Yahoo"]
const JOBS_PER_PAGE = 8

export const useJobFeed = () => {
  const [jobPostings, setJobPostings] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [activeCompany, setActiveCompany] = useState<string | null>(null)
  const [filters, setFilters] = useState<JobFilters>(emptyJobFilters)
  const [showJobDetail, setShowJobDetail] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchAndSetJobPostings = async () => {
    try {
      setLoading(true)
      const jobs = await fetch(`${API_URL}/jobs`, { method: "GET" })
      if (!jobs.ok) {
        throw new Error("Failed to fetch job postings")
      }

      const data = await jobs.json()
      setJobPostings(data)
    } catch (err) {
      console.error("Error fetching job postings:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAndSetJobPostings()
  }, [])

  const companies = useMemo(() => {
    const liveCompanies = getTopCompanies(jobPostings)

    return liveCompanies.length ? liveCompanies : fallbackCompanies
  }, [jobPostings])

  const filterCounts = useMemo(() => buildFilterCounts(jobPostings), [jobPostings])

  const filteredJobs = useMemo(() => filterJobs(jobPostings, searchQuery, activeCompany, filters), [activeCompany, filters, jobPostings, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / JOBS_PER_PAGE))

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE

    return filteredJobs.slice(startIndex, startIndex + JOBS_PER_PAGE)
  }, [currentPage, filteredJobs])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, activeCompany, filters])

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
    setFilters(emptyJobFilters())
    setActiveCompany(null)
  }

  const toggleCompany = (company: string) => {
    setActiveCompany((current) => (current === company ? null : company))
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

  const selectJob = (jobId: number) => {
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
    setSearchQuery,
    showJobDetail,
    toggleCompany,
    toggleLanguage: (value: JobFilters["languages"][number]) => toggleFilterValue("languages", value),
    toggleVisaSupport: (value: JobFilters["visaSupport"][number]) => toggleFilterValue("visaSupport", value),
    toggleWorkStyle: (value: JobFilters["workStyles"][number]) => toggleFilterValue("workStyles", value),
    totalPages,
    closeJobDetail,
  }
}
