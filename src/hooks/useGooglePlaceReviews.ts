import { useEffect, useState } from 'react'
import type { GooglePlaceReviewsPayload } from '@/types/googleReviews'

type State =
  | { status: 'loading' }
  | { status: 'ready'; data: GooglePlaceReviewsPayload }
  | { status: 'error' }

export function useGooglePlaceReviews(): State {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await fetch('/api/google-reviews')
        if (!response.ok) {
          if (!cancelled) setState({ status: 'error' })
          return
        }
        const data = (await response.json()) as GooglePlaceReviewsPayload
        if (!cancelled) setState({ status: 'ready', data })
      } catch {
        if (!cancelled) setState({ status: 'error' })
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
