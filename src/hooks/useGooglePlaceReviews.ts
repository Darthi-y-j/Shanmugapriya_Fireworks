import { useEffect, useState } from 'react'
import type { GooglePlaceReviewsPayload } from '@/types/googleReviews'

type State =
  | { status: 'loading' }
  | { status: 'ready'; data: GooglePlaceReviewsPayload }
  | { status: 'error'; message?: string }

async function loadFromServer(): Promise<GooglePlaceReviewsPayload> {
  const response = await fetch('/api/google-reviews')
  const body = (await response.json()) as GooglePlaceReviewsPayload & {
    error?: string
    message?: string
  }
  if (!response.ok) {
    throw new Error(body.message || body.error || `HTTP ${response.status}`)
  }
  return body
}

export function useGooglePlaceReviews(): State {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const { loadGooglePlaceReviewsClient } = await import('@/lib/googlePlaceReviewsClient')
        const data = await loadGooglePlaceReviewsClient()
        if (data.reviews.length > 0) {
          if (!cancelled) setState({ status: 'ready', data })
          return
        }
        throw new Error('Google returned no review text for this listing.')
      } catch (clientError) {
        const clientMessage =
          clientError instanceof Error ? clientError.message : 'Could not load reviews in browser'
        try {
          const data = await loadFromServer()
          if (!cancelled) setState({ status: 'ready', data })
          return
        } catch (serverError) {
          const serverMessage =
            serverError instanceof Error ? serverError.message : 'Server reviews failed'
          if (!cancelled) {
            setState({
              status: 'error',
              message: `${clientMessage}. ${serverMessage}`,
            })
          }
        }
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
