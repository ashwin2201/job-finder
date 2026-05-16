"use client"

import { ChevronLeft, Moon } from "lucide-react"
import { jobFeedTheme, railItems } from "./theme"
import Link from "next/link"

const JobFeedRail = () => {
  return (
    <aside className={`sticky top-0 hidden h-screen flex-col justify-between ${jobFeedTheme.rail} py-6 lg:flex`}>
      <div className="space-y-4">
        <div className="px-4">
          <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${jobFeedTheme.button}`}>
            <span className="text-xl font-bold">J</span>
          </div>
        </div>

        <nav className="space-y-2 px-3">
          {railItems.map(({ label, icon: Icon, active, url }) => (
            <Link key={label} 
              href={url} 
              onClick={() => { active = true }}
              className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl transition
                ${active ? "bg-accent text-primary hover:bg-accent" : "text-muted-foreground hover:bg-accent"}`}
              >
              {active ? <span className="absolute -right-6 h-8 w-1 rounded-full bg-primary" /> : null}
              <Icon className="h-5 w-5" />
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-3 px-3">
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-accent">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground hover:bg-accent">
          <Moon className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}

export default JobFeedRail
