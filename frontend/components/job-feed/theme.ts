import {
  BriefcaseBusiness,
  CircleDot,
  ClipboardList,
  Flame,
  LayoutGrid,
  Settings2,
  ShieldCheck,
  LayoutDashboard
} from "lucide-react"

export const jobFeedTheme = {
  shell: "bg-background shadow-[0_28px_90px_rgba(15,23,42,0.08)]",
  rail: "border-r border-sidebar-border bg-sidebar",
  sidebar: "border-sidebar-border bg-secondary/50",
  panel: "border bg-card shadow-[0_14px_34px_rgba(15,23,42,0.04)]",
  selectedPanel: "border border-primary/25 bg-card shadow-[0_18px_40px_rgba(15,23,42,0.08)]",
  accent: "text-primary",
  accentBg: "bg-primary",
  accentSoft: "bg-accent text-primary",
  muted: "text-muted-foreground",
  title: "text-foreground",
  search: "border-input bg-background",
  button: "bg-primary text-primary-foreground shadow-[0_18px_36px_rgba(15,23,42,0.14)] hover:bg-primary/90",
} as const

export const railItems = [
  { label: "Listings", icon: LayoutGrid, active: true, url: "/job-feed" },
  { label: "Saved", icon: ClipboardList, url: "/saved" },
  { label: "Visa", icon: ShieldCheck, url: "/visa" },
  { label: "Dashboard", icon: LayoutDashboard, url: "/dashboard" },
  { label: "Trending", icon: Flame, url: "/trending" },
  { label: "Filters", icon: Settings2, url: "/filters" },
  { label: "Work", icon: BriefcaseBusiness, url: "/work" },
  { label: "Focus", icon: CircleDot, url: "/focus" },
]

export const primaryFilterOptions = [
  "Visa Sponsorship",
  "English OK",
  "No Japanese Required",
]

export const detailFilters = [
  "Visa Sponsorship",
  "Japanese Required",
  "Location",
  "Salary Range",
  "Job Type",
]
