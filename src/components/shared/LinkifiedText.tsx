import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

const URL_PATTERN = /https?:\/\/[^\s<>'")\]]+/g

interface LinkifiedTextProps {
  text: string
  className?: string
  linkClassName?: string
}

export function LinkifiedText({ text, className, linkClassName }: LinkifiedTextProps) {
  const nodes: ReactNode[] = []
  let lastIndex = 0

  for (const match of text.matchAll(URL_PATTERN)) {
    const url = match[0]
    const index = match.index ?? 0

    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index))
    }

    nodes.push(
      <a
        key={`${index}-${url}`}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          'break-all font-medium text-blue-600 underline decoration-blue-600/40 underline-offset-2 hover:text-blue-800',
          linkClassName,
        )}
      >
        {url}
      </a>,
    )

    lastIndex = index + url.length
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex))
  }

  return <div className={cn('whitespace-pre-wrap', className)}>{nodes}</div>
}
