import { useCallback, useRef, useState } from 'react'
import { describeApiError, sendChat } from '../lib/api/client'
import type { ChatResponse, ChatTurn } from '../types/api'

export type ChatMessage =
  | { id: number; role: 'user'; text: string }
  | { id: number; role: 'assistant'; response: ChatResponse }

const MAX_HISTORY = 6

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const nextId = useRef(1)
  const lastText = useRef<string | null>(null)

  const run = useCallback(
    async (text: string, history: ChatTurn[]) => {
      setLoading(true)
      setError(null)
      try {
        const response = await sendChat({ message: text, history })
        setMessages((m) => [...m, { id: nextId.current++, role: 'assistant', response }])
      } catch (err) {
        setError(describeApiError(err))
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const send = useCallback(
    async (raw: string) => {
      const text = raw.trim()
      if (!text || loading) return
      lastText.current = text
      const history: ChatTurn[] = messages.slice(-MAX_HISTORY).map((m) =>
        m.role === 'user'
          ? { role: 'user', content: m.text }
          : { role: 'assistant', content: m.response.answer },
      )
      setMessages((m) => [...m, { id: nextId.current++, role: 'user', text }])
      await run(text, history)
    },
    [loading, messages, run],
  )

  /** Ulangi permintaan terakhir tanpa menggandakan pesan pengguna. */
  const retry = useCallback(async () => {
    if (!lastText.current || loading) return
    const history: ChatTurn[] = messages
      .slice(0, -1)
      .slice(-MAX_HISTORY)
      .map((m) =>
        m.role === 'user'
          ? { role: 'user', content: m.text }
          : { role: 'assistant', content: m.response.answer },
      )
    await run(lastText.current, history)
  }, [loading, messages, run])

  const reset = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { messages, loading, error, send, retry, reset }
}
