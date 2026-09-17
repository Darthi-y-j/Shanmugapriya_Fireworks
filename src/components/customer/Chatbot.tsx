import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { Bot, X, Send, Loader2 } from 'lucide-react'
import { useSettings } from '@/contexts/SettingsContext'
import { CHATBOT_GREETING_REPLY, getOfflineChatbotReply } from '@/lib/chatbotKnowledge'
import {
  checkChatbotApiHealth,
  isChatbotEnabled,
  sendChatbotMessage,
  type ChatbotProduct,
  type ChatHistoryTurn,
} from '@/services/chatbotApi'
import { ChatbotProductCard } from '@/components/customer/ChatbotProductCard'
import { FloatingActionButtons } from '@/components/customer/FloatingActionButtons'
import { cn } from '@/lib/utils'

interface UiMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  products?: ChatbotProduct[]
}

const WELCOME = CHATBOT_GREETING_REPLY

const CHAT_HINTS = [
  'Chat to clear your doubts',
  'Ask about products & orders',
  'Need help choosing crackers?',
] as const

const HINT_SHOW_DELAY_MS = 2500
const HINT_VISIBLE_MS = 10000
const HINT_ROTATE_MS = 2800

function TypingIndicator() {
  return (
    <span className="inline-flex h-4 items-center gap-[5px]" aria-label="Please wait">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-[6px] w-[6px] rounded-full bg-cream-100/60"
          style={{
            animation: 'typing-dot 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </span>
  )
}

export function Chatbot() {
  const { settings } = useSettings()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<UiMessage[]>([
    { id: 'welcome', role: 'assistant', content: WELCOME },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [online, setOnline] = useState<boolean | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [hintExiting, setHintExiting] = useState(false)
  const [hintIndex, setHintIndex] = useState(0)
  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    if (!isChatbotEnabled() || !open) return

    let cancelled = false

    async function init() {
      const health = await checkChatbotApiHealth()
      if (cancelled) return
      setOnline(health?.status === 'ok')
    }

    void init()
    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    if (open) return

    setShowHint(false)
    setHintExiting(false)
    setHintIndex(0)

    const showTimer = window.setTimeout(() => setShowHint(true), HINT_SHOW_DELAY_MS)
    return () => window.clearTimeout(showTimer)
  }, [open, location.pathname])

  useEffect(() => {
    if (open) {
      setShowHint(false)
      setHintExiting(false)
      return
    }
    if (!showHint || hintExiting) return

    const rotateTimer = window.setInterval(() => {
      setHintIndex((prev) => (prev + 1) % CHAT_HINTS.length)
    }, HINT_ROTATE_MS)

    const hideTimer = window.setTimeout(() => setHintExiting(true), HINT_VISIBLE_MS)

    return () => {
      window.clearInterval(rotateTimer)
      window.clearTimeout(hideTimer)
    }
  }, [open, showHint, hintExiting])

  const finishHintDismiss = useCallback(() => {
    setShowHint(false)
    setHintExiting(false)
  }, [])

  useEffect(() => {
    if (open) {
      listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
      inputRef.current?.focus()
      setShowHint(false)
      setHintExiting(false)
    }
  }, [open, messages.length, loading])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMessage: UiMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    const assistantId = `assistant-${Date.now()}`

    const conversationHistory: ChatHistoryTurn[] = messages
      .filter((m) => m.id !== 'welcome' && m.content)
      .slice(-4)
      .map((m) => ({ role: m.role, content: m.content }))

    abortRef.current?.abort()
    abortRef.current = new AbortController()

    const appendAssistant = (content: string, products?: ChatbotProduct[]) => {
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content, products },
      ])
    }

    try {
      if (online === false) {
        appendAssistant(getOfflineChatbotReply(text, settings.whatsapp_number))
        return
      }

      const result = await sendChatbotMessage(
        text,
        conversationHistory,
        abortRef.current.signal,
      )
      appendAssistant(result.response, result.products)
      setOnline(true)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return

      setOnline(false)
      appendAssistant(getOfflineChatbotReply(text, settings.whatsapp_number))
    } finally {
      setLoading(false)
      abortRef.current = null
    }
  }, [input, loading, messages, online, settings])

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  if (!isChatbotEnabled()) return <FloatingActionButtons />

  useEffect(() => {
    if (!open) return

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open])

  const statusLabel =
    online === false ? 'Quick help' : online ? 'Online' : 'Checking…'

  return (
    <>
      {open && (
        <button
          type="button"
          className="fixed inset-0 z-[59] cursor-default bg-black/20"
          aria-label="Close chat"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={cn(
          'fixed right-4 z-[60] flex flex-col items-end gap-3 pb-[env(safe-area-inset-bottom,0px)] sm:right-6',
          open ? 'bottom-4 sm:bottom-8' : 'bottom-6 sm:bottom-8',
        )}
      >
      {open && (
        <div
          className="flex max-h-[min(calc(100dvh-5.5rem),32rem)] w-[min(22rem,calc(100dvw-2rem))] flex-col overflow-hidden rounded-2xl border border-gold-500/25 bg-navy-950 shadow-[0_16px_48px_rgba(0,0,0,0.45)] animate-fade-up sm:max-h-[min(calc(100dvh-6rem),36rem)] sm:w-[22rem]"
          role="dialog"
          aria-label="Prime assistant chat"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-navy-900 to-navy-950 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/15 ring-1 ring-gold-400/30">
                <Bot className="h-4 w-4 text-gold-400" />
              </span>
              <div>
                <p className="text-sm font-semibold text-cream-50">Prime Assistant</p>
                <p className="flex items-center gap-1 text-[10px] text-cream-100/50">
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      online === false ? 'bg-gold-400' : online ? 'bg-emerald-400' : 'bg-gold-400',
                    )}
                  />
                  {statusLabel}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn('flex flex-col gap-2', message.role === 'user' ? 'items-end' : 'items-start')}
              >
                <div
                  className={cn(
                    'flex',
                    message.role === 'user' ? 'justify-end' : 'justify-start',
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[88%] rounded-2xl px-3 py-2 text-[13px] leading-relaxed',
                      message.role === 'user'
                        ? 'rounded-br-md bg-gradient-to-r from-festive-500 to-gold-500 font-medium text-navy-950'
                        : 'rounded-bl-md border border-white/10 bg-white/5 text-cream-100/90',
                    )}
                  >
                    {message.content}
                  </div>
                </div>

                {message.products && message.products.length > 0 && (
                  <div className="flex max-w-full gap-2 overflow-x-auto pb-1">
                    {message.products.map((product) => (
                      <ChatbotProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {loading && (
            <div className="flex items-center px-3 pb-1">
              <div className="rounded-2xl rounded-bl-md border border-white/10 bg-white/5 px-3 py-2">
                <TypingIndicator />
              </div>
            </div>
          )}

          <div className="border-t border-white/10 p-3">
            <div className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder="Ask about products, orders…"
                disabled={loading}
                className="max-h-24 min-h-[2.5rem] flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-cream-50 placeholder:text-cream-100/35 focus:border-gold-400/40 focus:outline-none focus:ring-1 focus:ring-gold-400/30 disabled:opacity-60"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-festive-500 to-gold-500 text-navy-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-end gap-2">
        {(showHint || hintExiting) && !open && (
          <div
            className={cn(
              hintExiting ? 'animate-chat-hint-out' : 'animate-slide-up',
            )}
            onAnimationEnd={() => {
              if (hintExiting) finishHintDismiss()
            }}
          >
            <div className="rounded-2xl border border-gold-400/40 bg-navy-950/95 px-3.5 py-2 shadow-[0_4px_24px_rgba(0,0,0,0.5)] backdrop-blur-md">
              <p
                key={hintIndex}
                className="max-w-[13rem] animate-fade-in text-center text-[11px] font-semibold leading-snug text-white sm:max-w-[15rem] sm:text-xs"
              >
                {CHAT_HINTS[hintIndex]}
              </p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className={cn(
            'relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold-500/35 bg-navy-950 text-gold-400 shadow-[0_4px_20px_rgba(0,0,0,0.3)] transition-all hover:scale-105 hover:border-gold-400/50 hover:shadow-[0_6px_24px_rgba(0,0,0,0.35)]',
            open && 'ring-2 ring-gold-400/40',
            showHint && !open && !hintExiting && 'ring-2 ring-gold-400/25 animate-pulse-gold',
          )}
          aria-expanded={open}
          aria-label={open ? 'Close Prime assistant' : 'Open Prime assistant'}
          title="Chat with Prime Assistant"
        >
          {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </button>
      </div>

      {!open && <FloatingActionButtons embedded />}
      </div>
    </>
  )
}
