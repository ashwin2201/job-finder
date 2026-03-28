import {
  BriefcaseBusiness,
  CircleDot,
  ClipboardList,
  Flame,
  LayoutGrid,
  Search,
  Settings2,
  ShieldCheck,
} from "lucide-react"

export const jobFeedTheme = {
  shell: "bg-[#f5f5f2] shadow-[0_28px_90px_rgba(15,23,42,0.08)]",
  rail: "border-r border-[#eceae4] bg-white",
  sidebar: "border-r border-[#eceae4] bg-[#faf9f6]",
  panel: "rounded-[24px] border border-[#ebe7de] bg-white shadow-[0_14px_34px_rgba(15,23,42,0.04)]",
  selectedPanel: "rounded-[24px] border border-[#f3c9c0] bg-white shadow-[0_18px_40px_rgba(248,113,113,0.10)]",
  accent: "text-[#ef4444]",
  accentBg: "bg-[#ef4444]",
  accentSoft: "bg-[#fff2ef] text-[#ef4444]",
  muted: "text-[#8e8a80]",
  title: "text-[#1c1a21]",
  search: "border border-[#ece8e0] bg-[#faf9f6]",
  button: "bg-[#ef4444] text-white shadow-[0_18px_36px_rgba(239,68,68,0.28)] hover:bg-[#e43c3c]",
} as const

export const railItems = [
  { label: "Listings", icon: LayoutGrid, active: true },
  { label: "Saved", icon: ClipboardList },
  { label: "Visa", icon: ShieldCheck },
  { label: "Search", icon: Search },
  { label: "Trending", icon: Flame },
  { label: "Filters", icon: Settings2 },
  { label: "Work", icon: BriefcaseBusiness },
  { label: "Focus", icon: CircleDot },
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
