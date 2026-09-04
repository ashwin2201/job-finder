import { redirect } from "next/navigation"
import { auth } from "@clerk/nextjs/server"
import { SignIn, SignUpButton } from "@clerk/nextjs"

export default async function Home() {
  const { userId } = await auth()

  if (userId) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[34px] bg-[#f8f6f1] shadow-[0_28px_90px_rgba(15,23,42,0.08)]">
        <main className="w-full">
          <div className="h-16 border-b border-[#eceae4] bg-white/70" />

          <div className="grid gap-8 p-5 md:p-8 xl:grid-cols-[1.05fr_1.2fr] xl:items-center">
            <section className="relative overflow-hidden rounded-[30px] border border-[#efe6dc] bg-[linear-gradient(180deg,#ffe9e1,#fff7f4)] p-6 shadow-[0_16px_40px_rgba(239,68,68,0.08)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(244,114,182,0.18),transparent_20%),radial-gradient(circle_at_82%_18%,rgba(251,146,60,0.12),transparent_16%),radial-gradient(circle_at_22%_82%,rgba(239,68,68,0.18),transparent_22%)]" />
              <div className="relative flex min-h-[420px] flex-col justify-between rounded-[26px] border border-white/70 bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(255,245,242,0.95))] p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#ef4444]/70">Japan job search</p>
                    <h2 className="max-w-xs text-3xl font-semibold leading-tight text-[#1c1a21]">
                      Discover roles built for global talent in Japan.
                    </h2>
                  </div>
                  <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[#ef4444] shadow-sm">
                    Tokyo Mode
                  </div>
                </div>

                <div className="relative mx-auto mt-8 flex h-[250px] w-full max-w-[320px] items-end justify-center">
                  <div className="absolute inset-x-0 bottom-0 h-40 rounded-[26px] bg-[linear-gradient(180deg,rgba(255,255,255,0),rgba(239,68,68,0.08))]" />
                  <div className="absolute left-2 top-5 h-28 w-28 rounded-full bg-[#ffd8d2]/80 blur-2xl" />
                  <div className="absolute right-5 top-3 h-16 w-16 rounded-full bg-[#fff1ee]" />
                  <div className="absolute right-10 top-10 h-40 w-2 rounded-full bg-[#ef4444]/80 shadow-[0_0_0_8px_rgba(239,68,68,0.06)]" />
                  <div className="absolute right-6 top-11 h-10 w-10 rounded-full border-[6px] border-[#ef4444]" />
                  <div className="absolute bottom-0 left-10 right-10 h-24 rounded-t-[22px] bg-[linear-gradient(180deg,#d8dee8,#f5f7fb)]" />
                  <div className="absolute bottom-16 left-0 right-0 h-1 bg-[#2f2c33]/10" />
                  <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                    <div className="relative h-[210px] w-[150px]">
                      <div className="absolute left-1/2 top-0 h-12 w-12 -translate-x-1/2 rounded-full bg-[#f9c5b9]" />
                      <div className="absolute left-1/2 top-7 h-8 w-14 -translate-x-1/2 rounded-b-[18px] bg-[#2f2430]" />
                      <div className="absolute left-1/2 top-12 h-[120px] w-[110px] -translate-x-1/2 rounded-[28px] bg-[linear-gradient(180deg,#ef4444,#d92f2f)]" />
                      <div className="absolute left-1/2 top-[86px] h-8 w-[118px] -translate-x-1/2 bg-[#f7f1ed]" />
                      <div className="absolute left-1/2 top-[91px] h-8 w-[70px] -translate-x-1/2 bg-[#26415f]" />
                      <div className="absolute left-[8px] top-[58px] h-20 w-5 rotate-[22deg] rounded-full bg-[#ef4444]" />
                      <div className="absolute right-[8px] top-[58px] h-20 w-5 -rotate-[22deg] rounded-full bg-[#ef4444]" />
                      <div className="absolute bottom-0 left-[26px] h-24 w-8 rotate-[6deg] rounded-full bg-[#ef4444]" />
                      <div className="absolute bottom-0 right-[26px] h-24 w-8 -rotate-[6deg] rounded-full bg-[#ef4444]" />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="mx-auto w-full max-w-[520px]">
              <div className="space-y-6">
                <div>
                  <h1 className="text-4xl font-semibold tracking-tight text-[#1c1a21]">
                    Welcome to <span className="text-[#ef4444]">JobNavi Japan!</span>
                  </h1>
                  <p className="mt-3 text-lg text-[#5f5a62]">Sign in to find your dream job in Japan.</p>
                </div>

                <div className="rounded-[28px] border border-[#efe5db] bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.05)] sm:p-7">
                  <SignIn
                    routing="hash"
                    forceRedirectUrl="/dashboard"
                    fallbackRedirectUrl="/dashboard"
                    signUpUrl="/"
                    appearance={{
                      elements: {
                        rootBox: "w-full",
                        cardBox: "w-full shadow-none",
                        card: "w-full border-0 bg-transparent p-0 shadow-none",
                        header: "hidden",
                        footer: "hidden",
                        dividerRow: "py-4",
                        dividerLine: "bg-[#ece6dc]",
                        dividerText: "text-[#8f8993]",
                        formFieldLabel: "hidden",
                        formFieldInput:
                          "h-12 rounded-2xl border border-[#ece6dc] bg-[#f6f6f8] text-[#2d2a33] shadow-none placeholder:text-[#9d99a2]",
                        formButtonPrimary:
                          "h-12 rounded-2xl border-0 bg-[#ef4444] text-base font-semibold shadow-[0_18px_36px_rgba(239,68,68,0.24)] hover:bg-[#e04343]",
                        socialButtonsBlockButton:
                          "h-11 rounded-2xl border border-[#e8e1d7] bg-white text-[#2d2a33] shadow-none hover:bg-[#faf8f4]",
                        socialButtonsBlockButtonText: "font-semibold",
                        formResendCodeLink: "text-[#ef4444]",
                        identityPreviewEditButton: "text-[#ef4444]",
                        footerActionLink: "text-[#ef4444] hover:text-[#df3a3a]",
                        formFieldSuccessText: "text-emerald-600",
                        formFieldWarningText: "text-amber-600",
                        alertText: "text-sm",
                      },
                    }}
                  />

                  <p className="mt-6 text-center text-sm text-[#6d6971]">
                    Don&apos;t have an account?{" "}
                    <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                      <button type="button" className="font-semibold text-[#ef4444] transition hover:text-[#de3e3e]">
                        Sign Up
                      </button>
                    </SignUpButton>
                  </p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
