/** Extract a YouTube video ID from common watch, embed, shorts, and youtu.be URLs. */
export function parseYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  try {
    const url = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`)

    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1).split('/')[0] || null
    }

    if (url.hostname.includes('youtube.com') || url.hostname.includes('youtube-nocookie.com')) {
      const fromQuery = url.searchParams.get('v')
      if (fromQuery) return fromQuery

      const pathMatch = url.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)
      if (pathMatch?.[1]) return pathMatch[1]
    }
  } catch {
    return null
  }

  return null
}

export function getYouTubeEmbedUrl(input: string): string | null {
  const id = parseYouTubeVideoId(input)
  if (!id) return null
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`
}

export function isValidYouTubeUrl(input: string): boolean {
  return parseYouTubeVideoId(input) !== null
}
