import Link from "next/link"
import type { ReactNode } from "react"
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  CircleAlert,
  Download,
  Info,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Upload,
} from "lucide-react"

import DashboardHeader from "@/components/dashboard/DashboardHeader"
import { Button } from "@/components/ui/button"
import { jobFeedTheme } from "@/components/job-feed/theme"

const scoreBreakdown = [
  { label: "Skills Match", value: 85 },
  { label: "Experience", value: 80 },
  { label: "Keywords", value: 75 },
  { label: "Education", value: 90 },
  { label: "Format & Structure", value: 85 },
] as const

const strengths = [
  "Clear and well-structured experience section",
  "Strong technical skills relevant to the role",
  "Good use of quantifiable achievements",
  "Relevant project experience",
  "Clean and professional formatting",
] as const

const improvements = [
  "Add more keywords from the job description",
  "Include more metrics in your achievements",
  "Improve your summary to highlight key value",
  "Add relevant certifications if any",
  "Experience section can be more concise",
] as const

const suggestions = [
  {
    title: "Add missing keywords",
    description: "Include these important keywords: React, TypeScript, AWS, CI/CD, Docker.",
  },
  {
    title: "Improve achievement statements",
    description: "Make your achievements more impactful with quantifiable results.",
  },
  {
    title: "Enhance summary",
    description: "Your summary should highlight your core strengths in 2-3 lines.",
  },
] as const

const keywordGap = [
  { keyword: "React", inJob: true, inResume: false },
  { keyword: "TypeScript", inJob: true, inResume: false },
  { keyword: "AWS", inJob: true, inResume: false },
  { keyword: "CI/CD", inJob: true, inResume: false },
  { keyword: "Docker", inJob: true, inResume: false },
  { keyword: "Kubernetes", inJob: true, inResume: true },
  { keyword: "Agile", inJob: true, inResume: true },
  { keyword: "Jest", inJob: true, inResume: true },
] as const

const skillPills = ["JavaScript", "React", "Node.js", "TypeScript", "AWS", "PostgreSQL", "Git", "Docker", "CI/CD", "Agile", "Jest"] as const

const tabs = ["Resume Preview", "Job Description", "Matched Skills"] as const

const RingScore = ({
  value,
  tone = "primary",
  size = "lg",
}: {
  value: number
  tone?: "primary" | "success"
  size?: "lg" | "sm"
}) => {
  const ringColor = tone === "success" ? "#34a853" : "#ef4444"
  const trackColor = tone === "success" ? "#dff3e5" : "#f6d7d2"
  const dimensions = size === "lg" ? "h-32 w-32" : "h-28 w-28"
  const inner = size === "lg" ? "inset-[10px]" : "inset-[9px]"
  const valueSize = size === "lg" ? "text-[3rem]" : "text-[2.5rem]"

  return (
    <div className={`relative ${dimensions}`}>
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(${ringColor} ${value * 3.6}deg, ${trackColor} ${value * 3.6}deg 360deg)`,
        }}
      />
      <div className={`absolute ${inner} rounded-full bg-white shadow-[inset_0_0_0_1px_rgba(239,68,68,0.05)]`} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${valueSize} font-semibold leading-none text-[#172033]`}>{value}</span>
        <span className="mt-1 text-sm text-[#8a8478]">/100</span>
      </div>
    </div>
  )
}

const ProgressRow = ({ label, value }: { label: string; value: number }) => (
  <div className="grid grid-cols-[minmax(0,120px)_minmax(0,1fr)_52px] items-center gap-4">
    <span className="text-sm text-[#4d4953]">{label}</span>
    <div className="h-2 rounded-full bg-[#efe8e0]">
      <div className="h-2 rounded-full bg-[#ef4444]" style={{ width: `${value}%` }} />
    </div>
    <span className="text-right text-sm font-medium text-[#4d4953]">{value}/100</span>
  </div>
)

const SectionCard = ({
  title,
  icon,
  iconClassName,
  children,
}: {
  title: string
  icon: ReactNode
  iconClassName: string
  children: ReactNode
}) => (
  <section className={`${jobFeedTheme.panel} rounded-[28px] bg-white p-5 sm:p-6`}>
    <div className="flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${iconClassName}`}>{icon}</div>
      <h3 className="text-lg font-semibold text-[#172033]">{title}</h3>
    </div>
    <div className="mt-5">{children}</div>
  </section>
)

const ViewResume = () => {
  return (
    <div className="overflow-y-auto">
      <main className="min-h-screen bg-secondary/40">
        <DashboardHeader />

        <div className="px-4 py-6 sm:px-6">
          <div className="mx-auto max-w-[1480px]">
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.9fr)]">
              <section className="space-y-6">
                <div className={`${jobFeedTheme.panel} rounded-[30px] bg-white p-6 sm:p-7`}>
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#6e6974] transition hover:text-[#ef4444]"
                      >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Resume
                      </Link>
                      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-[#172033] sm:text-[2.1rem]">
                        Resume Analysis <Sparkles className="mb-1 inline h-6 w-6 text-[#b48cf0]" />
                      </h1>
                      <p className="mt-2 text-base text-[#6e6974]">
                        We analyzed your resume for the job: <span className="font-semibold text-[#ef4444]">Software Engineer</span>
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        className="h-11 rounded-[18px] border-[#e8e2d8] px-4 text-[#2d3348] hover:border-[#efc7bf] hover:bg-[#fff7f4]"
                      >
                        <Upload className="h-4 w-4" />
                        Re-upload Resume
                      </Button>
                      <Button className={`h-11 rounded-[18px] px-4 ${jobFeedTheme.button}`}>
                        <Download className="h-4 w-4" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                </div>

                <section className={`${jobFeedTheme.panel} rounded-[30px] bg-white p-6 sm:p-7`}>
                  <div className="grid gap-8 xl:grid-cols-[240px_minmax(0,1fr)_250px] xl:items-start">
                    <div className="flex flex-col items-center text-center xl:border-r xl:border-[#eee8df] xl:pr-8">
                      <RingScore value={82} />
                      <p className="mt-5 text-lg font-semibold text-[#ef4444]">Good Match</p>
                      <p className="mt-3 max-w-[220px] text-sm leading-6 text-[#6e6974]">
                        Your resume is well-structured but needs a few improvements to better match this job.
                      </p>
                    </div>

                    <div className="xl:px-2">
                      <h2 className="text-lg font-semibold text-[#172033]">Score Breakdown</h2>
                      <div className="mt-6 space-y-4">
                        {scoreBreakdown.map((item) => (
                          <ProgressRow key={item.label} label={item.label} value={item.value} />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col items-center text-center xl:border-l xl:border-[#eee8df] xl:pl-8">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-[#172033]">ATS Compatibility</h2>
                        <Info className="h-4 w-4 text-[#b3ad9f]" />
                      </div>
                      <div className="mt-5 flex h-32 w-32 items-center justify-center rounded-full border-[8px] border-[#dcf1e2]">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border-[6px] border-[#34a853] text-[2.3rem] font-semibold text-[#172033]">
                          90%
                        </div>
                      </div>
                      <p className="mt-4 text-lg font-semibold text-[#172033]">Excellent</p>
                      <p className="mt-3 max-w-[220px] text-sm leading-6 text-[#6e6974]">
                        Your resume is highly likely to pass ATS screening.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-2">
                  <SectionCard
                    title="Strengths"
                    icon={<Check className="h-5 w-5" />}
                    iconClassName="bg-[#ecf8f0] text-[#34a853]"
                  >
                    <ul className="space-y-3">
                      {strengths.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-[#4d4953]">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ecf8f0] text-[#34a853]">
                            <Check className="h-3.5 w-3.5" />
                          </span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </SectionCard>

                  <SectionCard
                    title="Areas to Improve"
                    icon={<CircleAlert className="h-5 w-5" />}
                    iconClassName="bg-[#fff4e8] text-[#f59e0b]"
                  >
                    <ul className="space-y-3">
                      {improvements.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-sm text-[#4d4953]">
                          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#f59e0b]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </SectionCard>
                </div>

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_320px]">
                  <SectionCard
                    title="Top Suggestions"
                    icon={<Sparkles className="h-5 w-5" />}
                    iconClassName="bg-[#fff5ea] text-[#f59e0b]"
                  >
                    <div className="space-y-4">
                      {suggestions.map((item) => (
                        <div
                          key={item.title}
                          className="flex flex-col gap-4 rounded-[22px] border border-[#ece6dd] bg-[#fcfbf8] p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <h4 className="text-base font-semibold text-[#172033]">{item.title}</h4>
                            <p className="mt-1 text-sm leading-6 text-[#6e6974]">{item.description}</p>
                          </div>
                          <Button
                            variant="outline"
                            className="h-10 rounded-[16px] border-[#f0c3ba] bg-white px-4 text-[#ef4444] hover:bg-[#fff5f2]"
                          >
                            Apply
                          </Button>
                        </div>
                      ))}
                    </div>
                  </SectionCard>

                  <SectionCard
                    title="Keyword Gap"
                    icon={<Info className="h-5 w-5" />}
                    iconClassName="bg-[#f2f5ff] text-[#4f74e8]"
                  >
                    <div className="space-y-3">
                      <div className="grid grid-cols-[minmax(0,1fr)_62px_86px] gap-3 px-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#9a9387]">
                        <span>Keywords</span>
                        <span className="text-center">In Job</span>
                        <span className="text-center">In Resume</span>
                      </div>
                      {keywordGap.map((item) => (
                        <div key={item.keyword} className="grid grid-cols-[minmax(0,1fr)_62px_86px] items-center gap-3 px-1 text-sm text-[#4d4953]">
                          <span>{item.keyword}</span>
                          <span className={`flex justify-center ${item.inJob ? "text-[#ef4444]" : "text-[#c4beb3]"}`}>
                            {item.inJob ? <Check className="h-4 w-4" /> : "—"}
                          </span>
                          <span className={`flex justify-center ${item.inResume ? "text-[#34a853]" : "text-[#ef4444]"}`}>
                            {item.inResume ? <Check className="h-4 w-4" /> : <span className="text-lg leading-none">×</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>

                <section className={`${jobFeedTheme.panel} rounded-[28px] bg-[linear-gradient(135deg,#fff9f6,#fff2ef)] p-5 sm:p-6`}>
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#ef4444] shadow-sm">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[#172033]">Want us to improve your resume for you?</h3>
                        <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6e6974]">
                          Our AI will optimize your resume to better match this job and increase your chances.
                        </p>
                      </div>
                    </div>
                    <Button className={`h-11 rounded-[18px] px-5 ${jobFeedTheme.button}`}>
                      Improve with AI
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </section>
              </section>

              <aside className="space-y-4">
                <div className={`${jobFeedTheme.panel} rounded-[30px] bg-white p-4 sm:p-5`}>
                  <div className="flex gap-2 overflow-x-auto border-b border-[#ece7de] pb-4">
                    {tabs.map((tab, index) => (
                      <button
                        key={tab}
                        type="button"
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          index === 0 ? "bg-[#fff1ee] text-[#ef4444]" : "text-[#7d776d] hover:bg-[#faf7f1]"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 overflow-hidden rounded-[24px] border border-[#e8e2d8] bg-[#fbfaf7] shadow-[0_12px_34px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center justify-between border-b border-[#e5dfd5] bg-[#2d3138] px-4 py-3 text-white">
                      <div className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#71757c]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#71757c]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#71757c]" />
                      </div>
                      <div className="rounded-md bg-[#1f2329] px-2.5 py-1 text-xs font-medium">1 / 2</div>
                      <div className="rounded-md bg-[#1f2329] px-2.5 py-1 text-xs font-medium">100%</div>
                    </div>

                    <div className="space-y-7 bg-white p-6 sm:p-8">
                      <section>
                        <h2 className="text-[2rem] font-semibold tracking-tight text-[#111827]">JOHN DOE</h2>
                        <p className="mt-1 text-base font-semibold text-[#ef4444]">Software Engineer</p>
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-xs text-[#6b7280]">
                          <span className="inline-flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" />
                            john.doe@email.com
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Phone className="h-3.5 w-3.5" />
                            +81 90-1234-5678
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5" />
                            Tokyo, Japan
                          </span>
                        </div>
                      </section>

                      <ResumeBlock title="Summary">
                        Software engineer with 5+ years of experience building scalable web applications using modern
                        technologies. Passionate about clean code, user experience, and delivering impactful solutions.
                      </ResumeBlock>

                      <ResumeBlock title="Experience">
                        <div className="space-y-6">
                          <ExperienceItem
                            role="Senior Software Engineer"
                            company="Tech Solutions Inc."
                            dates="Apr 2022 - Present"
                            location="Tokyo, Japan"
                            bullets={[
                              "Developed and maintained scalable web applications using React, Node.js, and PostgreSQL.",
                              "Improved application performance by 40% through code optimization and caching strategies.",
                              "Led a team of 4 engineers and collaborated with cross-functional teams to deliver high-quality features.",
                              "Implemented CI/CD pipelines using GitHub Actions, reducing deployment time by 60%.",
                            ]}
                          />
                          <ExperienceItem
                            role="Software Engineer"
                            company="Digital Innovations Co."
                            dates="Jan 2020 - Mar 2022"
                            location="Tokyo, Japan"
                            bullets={[
                              "Built and maintained RESTful APIs and frontend applications.",
                              "Worked with AWS services including EC2, S3, and RDS.",
                              "Collaborated with designers to implement responsive and user-friendly interfaces.",
                            ]}
                          />
                        </div>
                      </ResumeBlock>

                      <ResumeBlock title="Education">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-base font-semibold text-[#172033]">Bachelor of Engineering in Computer Science</h4>
                            <p className="mt-1 text-sm text-[#6e6974]">University of Tokyo</p>
                          </div>
                          <span className="text-sm font-medium text-[#6e6974]">2019</span>
                        </div>
                      </ResumeBlock>

                      <ResumeBlock title="Skills">
                        <div className="flex flex-wrap gap-2">
                          {skillPills.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-full border border-[#ece7de] bg-[#f8f6f2] px-3 py-1.5 text-xs font-medium text-[#4d4953]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </ResumeBlock>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-[#f3dbc9] bg-[#fff8f1] px-4 py-3 text-sm text-[#8c6131] shadow-[0_10px_25px_rgba(245,158,11,0.08)]">
                  <span className="font-semibold">Tip:</span> Click on any suggestion to see how it improves your resume.
                </div>
              </aside>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

const ResumeBlock = ({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) => (
  <section className="border-t border-[#eee8df] pt-5 first:border-t-0 first:pt-0">
    <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#ef4444]">{title}</h3>
    <div className="mt-3 text-sm leading-7 text-[#374151]">{children}</div>
  </section>
)

const ExperienceItem = ({
  role,
  company,
  dates,
  location,
  bullets,
}: {
  role: string
  company: string
  dates: string
  location: string
  bullets: string[]
}) => (
  <div>
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h4 className="text-base font-semibold text-[#172033]">{role}</h4>
        <p className="font-medium text-[#2d3348]">{company}</p>
      </div>
      <div className="text-sm text-[#6e6974] sm:text-right">
        <p className="font-medium">{dates}</p>
        <p>{location}</p>
      </div>
    </div>
    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-[#374151]">
      {bullets.map((bullet) => (
        <li key={bullet}>{bullet}</li>
      ))}
    </ul>
  </div>
)

export default ViewResume
