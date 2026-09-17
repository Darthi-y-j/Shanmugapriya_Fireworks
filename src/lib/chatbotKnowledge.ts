/** Business knowledge for the AI system prompt — tagged by topic so the model picks the right one */
export const CHATBOT_KNOWLEDGE = [
  {
    topic: 'ordering',
    q: 'How to order?',
    a: 'Add products to cart, then send WhatsApp enquiry from Cart. Team confirms price and delivery. No online payment.',
  },
  {
    topic: 'payment',
    q: 'Online payment?',
    a: 'No online payment on site. Pre-payment only after WhatsApp enquiry.',
  },
  {
    topic: 'ordering',
    q: 'Multiple products?',
    a: 'Add all to cart and send one combined WhatsApp enquiry.',
  },
  {
    topic: 'gift box',
    q: 'Custom gift box?',
    a: 'Yes. Open Gift Box, add products you want, then add the box to cart and send a WhatsApp enquiry.',
  },
  {
    topic: 'pricing',
    q: 'Are prices final?',
    a: 'Website prices are indicative. WhatsApp us for latest rates.',
  },
  {
    topic: 'delivery',
    q: 'Do you deliver?',
    a: 'Yes, all over India. Share location on WhatsApp for delivery charges.',
  },
  {
    topic: 'safety',
    q: 'Is online purchase safe?',
    a: 'We are a catalogue platform. Orders handled offline via WhatsApp with safety guidance.',
  },
  {
    topic: 'ordering',
    q: 'Minimum order?',
    a: 'Varies by product. WhatsApp us for the item you need.',
  },
  {
    topic: 'support',
    q: 'Response time?',
    a: 'WhatsApp support 24/7, usually replies within minutes.',
  },
  {
    topic: 'expiry',
    q: 'Expiry date on products?',
    a: 'Not always shown on site. Use in the same festival season. Store dry and cool. WhatsApp us for batch details on a specific product.',
  },
  {
    topic: 'stock',
    q: 'In stock?',
    a: 'Check the product page or WhatsApp us with the product name for live stock.',
  },
  {
    topic: 'products',
    q: 'What do you sell?',
    a: 'Sparklers, rockets, flower pots, atom bombs, chakras, and more. See Products or Categories pages.',
  },
] as const

export const CHATBOT_GREETING_REPLY =
  'Hello! How can I help you with products, ordering, or delivery?'

const GREETING_PATTERN =
  /^(hi|hello|hey|hii|helo|good\s*(morning|afternoon|evening|night)|namaste|vanakkam)\b/i

const TOPIC_KEYWORDS: Record<string, string[]> = {
  ordering: ['order', 'buy', 'purchase', 'cart', 'checkout', 'minimum'],
  payment: ['pay', 'payment', 'upi', 'cash', 'online pay'],
  'gift box': ['gift', 'giftbox', 'hamper', 'box'],
  pricing: ['price', 'cost', 'rate', 'rates', 'discount', 'offer'],
  delivery: ['deliver', 'delivery', 'shipping', 'ship', 'courier', 'location'],
  safety: ['safe', 'safety', 'legal', 'license'],
  support: ['help', 'support', 'contact', 'response', 'reply'],
  expiry: ['expiry', 'expire', 'valid', 'shelf'],
  stock: ['stock', 'available', 'availability'],
  products: ['product', 'cracker', 'firework', 'sparkler', 'rocket', 'chakkar', 'catalogue'],
}

function normalizeChatText(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
}

function scoreKnowledgeMatch(message: string, item: (typeof CHATBOT_KNOWLEDGE)[number]): number {
  const normalized = normalizeChatText(message)
  if (!normalized) return 0

  const words = normalized.split(' ').filter((word) => word.length > 2)
  const question = normalizeChatText(item.q)
  const answer = normalizeChatText(item.a)
  const topic = normalizeChatText(item.topic)

  let score = 0
  if (normalized.includes(topic)) score += 4

  for (const keyword of TOPIC_KEYWORDS[item.topic] ?? []) {
    if (normalized.includes(keyword)) score += 3
  }

  for (const word of words) {
    if (question.includes(word)) score += 2
    if (answer.includes(word)) score += 1
    if (topic.includes(word)) score += 2
  }

  return score
}

/** Rule-based replies when the AI backend is unavailable. */
export function getOfflineChatbotReply(message: string, whatsappNumber?: string | null): string {
  const trimmed = message.trim()
  if (!trimmed || GREETING_PATTERN.test(trimmed)) {
    return CHATBOT_GREETING_REPLY
  }

  let best: { score: number; answer: string } | null = null
  for (const item of CHATBOT_KNOWLEDGE) {
    const score = scoreKnowledgeMatch(trimmed, item)
    if (!best || score > best.score) {
      best = { score, answer: item.a }
    }
  }

  if (best && best.score >= 3) return best.answer

  const contactHint = whatsappNumber?.trim()
    ? `Please WhatsApp us at ${whatsappNumber.trim()} and our team will help you right away.`
    : 'Please visit the Contact page or send us a WhatsApp enquiry and our team will help you right away.'

  return `Thanks for your message. ${contactHint}`
}
