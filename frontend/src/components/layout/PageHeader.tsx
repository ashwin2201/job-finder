"use client"

import { UserButton } from "@clerk/nextjs"
import { SlidersHorizontal } from "lucide-react"

import { appTheme } from "@/lib/theme"

type PageHeaderProps = {
  eyebrow: string
  title: string
}

const PageHeader = ({ eyebrow, title }: PageHeaderProps) => {
  return (
    <header className="flex flex-col gap-5 border-b border-[#eceae4] px-5 py-5 sm:px-7 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className={`text-xs font-semibold uppercase tracking-[0.26em] ${appTheme.muted}`}>{eyebrow}</p>
        <h1 className={`mt-1 text-3xl font-semibold ${appTheme.title}`}>{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#ece8e0] bg-white text-[#4f9e6f] shadow-sm">
          <SlidersHorizontal className="h-4 w-4" />
        </button>
        <div className="rounded-2xl border border-[#ece8e0] bg-white p-1.5 shadow-sm">
          <UserButton />
        </div>
      </div>
    </header>
  )
}

export default PageHeader
