export interface ChatbotProduct {
  id: string
  name: string
  slug: string
  price: number | null
  original_price?: number | null
  discount_percentage?: number | null
  image_url?: string | null
  is_available?: boolean
  category?: string | null
}

export interface ChatHistoryTurn {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatbotApiResponse {
  response: string
  products: ChatbotProduct[]
  intent?: string
}

export interface ChatbotHealth {
  status: string
  llm_provider: string
  llm_model: string
  supabase: boolean
  vector_db: boolean
}

const API_BASE = import.meta.env.VITE_CHATBOT_API || '/api/chatbot'

let healthCache: { checkedAt: number; value: ChatbotHealth | null } | null = null
const HEALTH_CACHE_MS = 30_000

export function isChatbotEnabled(): boolean {
  return import.meta.env.VITE_CHATBOT_ENABLED !== 'false'
}

export async function checkChatbotApiHealth(): Promise<ChatbotHealth | null> {
  const now = Date.now()
  if (healthCache && now - healthCache.checkedAt < HEALTH_CACHE_MS) {
    return healthCache.value
  }

  try {
    const response = await fetch(`${API_BASE}/health`, { method: 'GET' })
    const value = response.ok ? ((await response.json()) as ChatbotHealth) : null
    healthCache = { checkedAt: now, value }
    return value
  } catch {
    healthCache = { checkedAt: now, value: null }
    return null
  }
}

export async function sendChatbotMessage(
  message: string,
  history: ChatHistoryTurn[],
  signal?: AbortSignal,
): Promise<ChatbotApiResponse> {
  const response = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
    signal,
  })

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(detail || `Chatbot API failed (${response.status})`)
  }

  return (await response.json()) as ChatbotApiResponse
}
