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

export const useJobFeed = () => {
  const [jobPostings, setJobPostings] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null)
  const [activeCompany, setActiveCompany] = useState<string | null>(null)
  const [filters, setFilters] = useState<JobFilters>(emptyJobFilters)
  const [showJobDetail, setShowJobDetail] = useState(false)

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

  useEffect(() => {
    if (!filteredJobs.length) {
      setSelectedJobId(null)
      setShowJobDetail(false)
      return
    }

    if (!filteredJobs.some((job) => job.id === selectedJobId)) {
      setSelectedJobId(filteredJobs[0].id)
    }
  }, [filteredJobs, selectedJobId])

  const selectedJob = filteredJobs.find((job) => job.id === selectedJobId) ?? filteredJobs[0] ?? null

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
    jobPostings,
    loading,
    openJobDetail,
    searchQuery,
    selectJob,
    selectedJob,
    setSearchQuery,
    showJobDetail,
    toggleCompany,
    toggleLanguage: (value: JobFilters["languages"][number]) => toggleFilterValue("languages", value),
    toggleVisaSupport: (value: JobFilters["visaSupport"][number]) => toggleFilterValue("visaSupport", value),
    toggleWorkStyle: (value: JobFilters["workStyles"][number]) => toggleFilterValue("workStyles", value),
    closeJobDetail,
  }
}
