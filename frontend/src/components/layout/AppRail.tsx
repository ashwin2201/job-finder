"use client"

import {
  BriefcaseBusiness,
  ChevronLeft,
  Flame,
  House,
  LayoutGrid,
  Moon,
  User,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { appTheme } from "@/lib/theme"

const navItems = [
  { label: "Listings", icon: LayoutGrid, url: "/job-feed" },
  { label: "Saved", icon: BriefcaseBusiness, url: "/job-tracker" },
  { label: "Dashboard", icon: House, url: "/dashboard" },
  { label: "Trending", icon: Flame, url: "/resume-analysis/view-resume" },
  { label: "Profile", icon: User, url: "/profile" },
]

const AppRail = () => {
  const pathname = usePathname()

  return (
    <aside className={`sticky top-0 hidden h-screen flex-col justify-between ${appTheme.rail} py-6 lg:flex`}>
      <nav className="space-y-2 px-3 flex flex-col items-center justify-center gap-3 m-auto">
        {navItems.map(({ label, icon: Icon, url }) => {
          const active = pathname === url || pathname.startsWith(`${url}/`)

          return (
          <Link
            key={label}
            href={url}
            aria-label={label}
            title={label}
            className={`group h-11 w-11 rounded-2xl transition hover:bg-accent flex items-center justify-center
              ${active ? "bg-accent text-primary" : "text-muted-foreground hover:bg-accent"}`}
          >
            <Icon className="h-5 w-5" />
          </Link>
          )
        })}
      </nav>

      <div className="space-y-3 px-3">
        <button type="button" aria-label="Collapse navigation" title="Collapse navigation" className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-accent">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button type="button" aria-label="Toggle color theme" title="Toggle color theme" className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-accent">
          <Moon className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}

export default AppRail
