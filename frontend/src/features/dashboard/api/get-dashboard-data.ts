type ApiJob = {
  id: string
  company_id: string
  title: string
  company: string
  status: string
  published_at: string | null
  location: string
  description: string
}

type ApiJobMatch = {
  job: ApiJob
  resume_id: string | null
  score: number
  reason: string | null
  created_at: string
  updated_at: string
}

type ApiSavedJob = {
  job: ApiJob
  saved_at: string
}

type ApiJobApplication = {
  id: string
  status: string
}

type ApiProfileViews = {
  total_views: number
}

type ApiConversation = {
  unread_count: number
}

type ApiResume = {
  id: string
  is_primary: boolean
}

type ApiResumeFeedback = {
  summary: string
  strengths: string | null
  improvements: string | null
  score: number | null
  created_at: string
}

export type DashboardJob = {
  id: string
  title: string
  company: string
  location: string
  description: string
  score: number | null
  reason: string | null
  savedAt: string | null
}

export type DashboardData = {
  applicationCount: number
  profileViewCount: number
  unreadMessageCount: number
  matchScore: number | null
  resumeFeedback: {
    score: number | null
    summary: string | null
    strengths: string[]
    improvements: string[]
  }
  matchCount: number
  savedJobCount: number
  matches: DashboardJob[]
  savedJobs: DashboardJob[]
  hasPartialFailure: boolean
  errors: string[]
}

const emptyDashboardData: DashboardData = {
  applicationCount: 0,
  profileViewCount: 0,
  unreadMessageCount: 0,
  matchScore: null,
  resumeFeedback: {
    score: null,
    summary: null,
    strengths: [],
    improvements: [],
  },
  matchCount: 0,
  savedJobCount: 0,
  matches: [],
  savedJobs: [],
  hasPartialFailure: false,
  errors: [],
}

const apiBaseUrl = () => {
  const value = process.env.NEXT_PUBLIC_API_URL
  if (!value) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured")
  }
  return value.replace(/\/$/, "")
}

const request = async <T>(path: string, token: string): Promise<T> => {
  const response = await fetch(`${apiBaseUrl()}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    let detail = response.statusText || "Request failed"

    try {
      const body: unknown = await response.json()
      if (
        typeof body === "object" &&
        body !== null &&
        "detail" in body &&
        typeof body.detail === "string"
      ) {
        detail = body.detail
      }
    } catch {
      // Keep the HTTP status text when the response is not JSON.
    }

    throw new Error(`${response.status}: ${detail}`)
  }

  return response.json() as Promise<T>
}

const resultValue = <T>(
  result: PromiseSettledResult<T>,
  fallback: T,
): T => (result.status === "fulfilled" ? result.value : fallback)

const errorMessage = (reason: unknown): string =>
  reason instanceof Error ? reason.message : "An unknown API error occurred"

const feedbackLines = (value: string | null): string[] => {
  if (!value) {
    return []
  }

  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

export const getDashboardData = async (
  token: string | null,
): Promise<DashboardData> => {
  if (!token) {
    return {
      ...emptyDashboardData,
      hasPartialFailure: true,
      errors: ["A Clerk session token was not available."],
    }
  }

  const results = await Promise.allSettled([
    request<ApiJobMatch[]>("/me/job-matches", token),
    request<ApiSavedJob[]>("/me/saved-jobs", token),
    request<ApiJobApplication[]>("/me/applications", token),
    request<ApiProfileViews>("/me/profile-views?days=7", token),
    request<ApiConversation[]>("/conversations", token),
    request<ApiResume[]>("/me/resumes", token),
  ])

  const [matchesResult, savedResult, applicationsResult, viewsResult, conversationsResult, resumesResult] = results
  const matches = resultValue(matchesResult, [])
  const savedJobs = resultValue(savedResult, [])
  const applications = resultValue(applicationsResult, [])
  const profileViews = resultValue(viewsResult, { total_views: 0 })
  const conversations = resultValue(conversationsResult, [])
  const resumes = resultValue(resumesResult, [])
  const primaryResume = resumes.find((resume) => resume.is_primary) ?? resumes[0]

  let feedback: ApiResumeFeedback | null = null
  let feedbackError: string | null = null

  if (primaryResume) {
    try {
      const feedbackItems = await request<ApiResumeFeedback[]>(
        `/me/resumes/${primaryResume.id}/feedback`,
        token,
      )
      feedback = feedbackItems[0] ?? null
    } catch (error) {
      feedbackError = errorMessage(error)
    }
  }

  const errors = Array.from(
    new Set([
      ...results.flatMap((result) =>
        result.status === "rejected" ? [errorMessage(result.reason)] : [],
      ),
      ...(feedbackError ? [feedbackError] : []),
    ]),
  )

  return {
    applicationCount: applications.length,
    profileViewCount: profileViews.total_views,
    unreadMessageCount: conversations.reduce(
      (total, conversation) => total + conversation.unread_count,
      0,
    ),
    matchScore: matches[0] ? Math.round(matches[0].score * 100) : null,
    resumeFeedback: {
      score: feedback?.score ?? null,
      summary: feedback?.summary ?? null,
      strengths: feedbackLines(feedback?.strengths ?? null),
      improvements: feedbackLines(feedback?.improvements ?? null),
    },
    matchCount: matches.length,
    savedJobCount: savedJobs.length,
    matches: matches.slice(0, 5).map(({ job, score, reason }) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      score: Math.round(score * 100),
      reason,
      savedAt: null,
    })),
    savedJobs: savedJobs.slice(0, 5).map(({ job, saved_at }) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      score: null,
      reason: null,
      savedAt: saved_at,
    })),
    hasPartialFailure: errors.length > 0,
    errors,
  }
}
