import { useEffect, useState } from 'react'
import type { GooglePlaceReviewsPayload } from '@/types/googleReviews'

type State =
  | { status: 'loading' }
  | { status: 'ready'; data: GooglePlaceReviewsPayload }
  | { status: 'error'; message?: string }

export function useGooglePlaceReviews(): State {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const response = await fetch('/api/google-reviews')
        const body = (await response.json()) as GooglePlaceReviewsPayload & {
          error?: string
          message?: string
        }
        if (!response.ok) {
          if (!cancelled) {
            setState({
              status: 'error',
              message: body.message || body.error || `HTTP ${response.status}`,
            })
          }
          return
        }
        if (!cancelled) setState({ status: 'ready', data: body })
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
