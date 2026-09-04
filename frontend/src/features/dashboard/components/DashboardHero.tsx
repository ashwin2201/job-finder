import Link from "next/link"
import { ChevronRight, MessageSquareText, Send, TrendingUp } from "lucide-react"

import { appTheme } from "@/lib/theme"

type DashboardHeroProps = {
  firstName: string
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
}

const DashboardHero = ({
  firstName,
  applicationCount,
  profileViewCount,
  unreadMessageCount,
  matchScore,
  resumeFeedback,
}: DashboardHeroProps) => {
  const stats = [
    {
      label: "Applied",
      value: applicationCount,
      icon: Send,
      accent: "bg-[#fff1ee] text-[#ef4444]",
    },
    {
      label: "Profile views",
      value: profileViewCount,
      icon: TrendingUp,
      accent: "bg-[#eef4ff] text-[#4f74e8]",
    },
    {
      label: "Unread messages",
      value: unreadMessageCount,
      icon: MessageSquareText,
      accent: "bg-[#fff3ef] text-[#f97360]",
    },
  ]

  const strengths = resumeFeedback.strengths.length
    ? resumeFeedback.strengths
    : ["Generate resume feedback to see your strengths here."]
  const improvements = resumeFeedback.improvements.length
    ? resumeFeedback.improvements
    : ["Add a primary resume to get tailored improvement suggestions."]

  return (
    <section className="overflow-hidden">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_340px]">
        <div className={`${appTheme.panel} p-5`}>
          <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${appTheme.muted}`}>Latest job matches</p>
          <h2 className={`mt-2 text-4xl font-semibold tracking-tight ${appTheme.title}`}>Welcome back, {firstName}!</h2>
          <p className={`mt-3 max-w-2xl text-base leading-7 ${appTheme.muted}`}>
            Here are your latest Japan-focused matches and a snapshot of your
            activity from the last seven days.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {stats.map(({ label, value, icon: Icon, accent }) => (
              <div
                key={label}
                className="rounded-[24px] border border-[#ebe7de] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-sm ${appTheme.muted}`}>{label}</p>
                    <p className={`mt-3 text-4xl font-semibold ${appTheme.title}`}>{value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      <aside className="space-y-5">
        <div className={`${appTheme.panel} p-5`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-2xl font-semibold ${appTheme.title}`}>Match score</h3>
            <ChevronRight className="h-5 w-5 text-[#8e8a80]" />
          </div>
          <div className="mt-5 rounded-[22px] bg-[#faf8f3] p-5">
            <p className={`text-sm ${appTheme.muted}`}>Current profile fit</p>
            <p className={`mt-2 text-5xl font-semibold ${appTheme.title}`}>
              {matchScore === null ? "N/A" : `${matchScore}%`}
            </p>
            {resumeFeedback.summary ? (
              <p className={`mt-2 text-sm leading-6 ${appTheme.muted}`}>
                {resumeFeedback.summary}
              </p>
            ) : null}
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ef4444]">Strengths</h4>
              <ul className="mt-3 space-y-3 text-sm text-[#5e5963]">
                {strengths.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#fff2ef] text-[#ef4444]">+</div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#f97360]">Weaknesses</h4>
              <ul className="mt-3 space-y-3 text-sm text-[#5e5963]">
                {improvements.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-[#fff6f3] text-[#f97360]">-</div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link
            href="/resume-analysis/view-resume"
            prefetch
            className={`mt-6 inline-flex w-full items-center justify-center rounded-[18px] px-4 py-3 text-sm font-semibold transition ${appTheme.button}`}
          >
            Improve My Resume
          </Link>
        </div>
      </aside>
      </div>
    </section>
  )
}

export default DashboardHero
