import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"

import { jobFeedTheme } from "@/components/job-feed/theme"
import { matchInsights, stats } from "./data"

const DashboardHero = () => {
  return (
    <section className={`${jobFeedTheme.panel} overflow-hidden`}>
      <div className="grid gap-6 p-6 xl:grid-cols-[minmax(0,1.35fr)_340px]">
        <div>
          <p className={`text-xs font-semibold uppercase tracking-[0.24em] ${jobFeedTheme.muted}`}>Latest job matches</p>
          <h2 className={`mt-2 text-4xl font-semibold tracking-tight ${jobFeedTheme.title}`}>Welcome back, John!</h2>
          <p className={`mt-3 max-w-2xl text-base leading-7 ${jobFeedTheme.muted}`}>
            Here are the freshest Japan-focused roles for you, plus a quick read on how your profile is performing this week.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {stats.map(({ label, value, icon: Icon, accent }) => (
              <div
                key={label}
                className="rounded-[24px] border border-[#ebe7de] bg-white p-5 shadow-[0_14px_34px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className={`text-sm ${jobFeedTheme.muted}`}>{label}</p>
                    <p className={`mt-3 text-4xl font-semibold ${jobFeedTheme.title}`}>{value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[30px] border border-[#f2d2ca] bg-[linear-gradient(160deg,#fff4f0,rgba(255,255,255,0.88))] p-6">
          <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.12),transparent_65%)]" />
          <p className="relative text-xs font-semibold uppercase tracking-[0.24em] text-[#ef4444]/75">Weekly pulse</p>
          <div className="relative mt-4 flex items-end gap-4">
            <div>
              <p className={`text-sm ${jobFeedTheme.muted}`}>Match score</p>
              <p className={`mt-1 text-5xl font-semibold ${jobFeedTheme.title}`}>{matchInsights.score}</p>
            </div>
            <span className="rounded-full bg-[#fff2ef] px-3 py-1 text-xs font-semibold text-[#ef4444]">+8 this week</span>
          </div>

          <div className="relative mt-6 space-y-4">
            <div className="rounded-[22px] bg-white/85 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
              <p className={`text-sm font-semibold ${jobFeedTheme.title}`}>Strong fit signals</p>
              <ul className="mt-3 space-y-2 text-sm text-[#5e5963]">
                {matchInsights.strengths.slice(0, 2).map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Star className="mt-0.5 h-4 w-4 text-[#ef4444]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/job-feed" prefetch className="inline-flex items-center gap-2 text-sm font-semibold text-[#ef4444]">
              Review new matches
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardHero
