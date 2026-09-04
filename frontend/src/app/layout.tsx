import type { Metadata } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import { Geist, Geist_Mono } from "next/font/google"

import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "JobNavi Japan",
  description: "Discover Japan-focused jobs and tailor your resume with Clerk-powered auth.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[#ece9e2] font-[family-name:var(--font-geist-sans)] antialiased`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
