import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Unlock } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export function HeroMemberOfferCard() {
  const { isCustomer, user } = useAuth()
  const isLoggedIn = Boolean(user && isCustomer)

  if (isLoggedIn) {
    const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there'
    return (
      <Link
        to="/account"
        className="group mt-3 inline-flex w-full max-w-xl items-center justify-between gap-3 rounded-full border border-[#0077B6]/45 bg-[#0F2847]/50 px-4 py-2.5 backdrop-blur-md transition hover:border-[#0077B6]/70 hover:bg-[#0F2847]/65 sm:w-auto sm:min-w-[320px]"
      >
        <span className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0077B6]">
            <Unlock className="h-4 w-4 text-[#0F2847]" aria-hidden="true" />
          </span>
          <span className="truncate text-sm font-semibold text-white">
            Hi {firstName} — your member offers are ready
          </span>
        </span>
        <ArrowRight
          className="h-4 w-4 shrink-0 text-[#0077B6] transition group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    )
  }

  return (
    <div className="mt-3 w-full max-w-xl">
      <div className="flex items-center gap-2.5 rounded-full border border-[#0077B6]/40 bg-[#0F2847]/55 px-2 py-2 backdrop-blur-md sm:gap-3 sm:px-2.5">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0077B6] sm:h-10 sm:w-10"
          aria-hidden="true"
        >
          <Sparkles className="h-4 w-4 text-[#0F2847] sm:h-[18px] sm:w-[18px]" />
        </span>

        <p className="min-w-0 flex-1 py-0.5 text-[11px] leading-snug text-white sm:text-xs">
          <span className="font-extrabold uppercase tracking-wide text-[#0077B6]">Login free</span>
          <span className="text-white/90"> — spin-to-win &amp; track orders</span>
        </p>

        <Link
          to="/login"
          state={{ from: '/' }}
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#0077B6] px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wide text-[#0F2847] transition hover:bg-[#0096D6] sm:px-4 sm:py-2.5 sm:text-[11px]"
        >
          Login
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <p className="mt-2 text-[10px] text-white/55 sm:text-[11px]">
        No account yet?{' '}
        <Link
          to="/register"
          state={{ from: '/' }}
          className="font-semibold text-[#0077B6] underline decoration-[#0077B6]/40 underline-offset-2 hover:text-[#0096D6]"
        >
          Sign up in 30 seconds
        </Link>
      </p>
    </div>
  )
}
