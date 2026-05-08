import {
  BriefcaseBusiness,
  Heart,
  MessageSquareText,
  Send,
  Sparkles,
  TrendingUp,
} from "lucide-react"

export const stats = [
  {
    label: "Applied",
    value: "8",
    icon: Send,
    accent: "bg-[#fff1ee] text-[#ef4444]",
  },
  {
    label: "Profile views",
    value: "227",
    icon: TrendingUp,
    accent: "bg-[#eef4ff] text-[#4f74e8]",
  },
  {
    label: "Messages",
    value: "3",
    icon: MessageSquareText,
    accent: "bg-[#fff3ef] text-[#f97360]",
  },
] as const

export const featuredJobs = [
  {
    title: "Software Engineer",
    company: "Tech Solutions",
    salary: "¥6,000,000 - ¥8,800,000 / year",
    tags: ["Visa Sponsorship", "Remote Friendly"],
    palette: "from-[#8ca6d8] via-[#f0b3b3] to-[#ffd8c8]",
    badgeIcon: BriefcaseBusiness,
  },
  {
    title: "Marketing Specialist",
    company: "Terra Digital",
    salary: "¥4,000,000 - ¥6,600,000 / year",
    tags: ["Visa Sponsorship", "English OK"],
    palette: "from-[#f2c3b2] via-[#f7d6da] to-[#f5e8d2]",
    badgeIcon: Heart,
  },
  {
    title: "English Teacher",
    company: "Sakura Academy",
    salary: "¥6,000,000 - ¥8,400,000 / year",
    tags: ["Yokohama", "Visa Support"],
    palette: "from-[#9e8fc7] via-[#ebb1b8] to-[#f8dcc8]",
    badgeIcon: Sparkles,
  },
] as const

export const matchRows = [
  {
    title: "Software Engineer",
    company: "Tech Solutions",
    location: "Tokyo",
    salary: "¥6,000,000 - ¥8,500,000 / year",
    badge: "Top match",
  },
  {
    title: "Frontend Engineer",
    company: "Mercari",
    location: "Shibuya",
    salary: "¥5,800,000 - ¥8,200,000 / year",
    badge: "Fast reply",
  },
  {
    title: "Product Designer",
    company: "PayPay",
    location: "Tokyo",
    salary: "¥5,500,000 - ¥7,600,000 / year",
    badge: "New role",
  },
] as const

export const dashboardQuickPicks = [
  "Application tracker",
  "Saved jobs",
  "Resume readiness",
  "Interview prep",
] as const

export const matchInsights = {
  score: "91%",
  strengths: [
    "Strong React and TypeScript alignment",
    "Portfolio shows shipped product work",
    "English-first collaboration fit",
  ],
  gaps: [
    "Japanese business writing needs polish",
    "No recent leadership example listed",
  ],
} as const
