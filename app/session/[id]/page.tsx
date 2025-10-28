"use client"

import Link from "next/link"
import { MessageCard } from "@/components/message-card"
import { useState, useEffect } from "react"

interface Message {
  id: string
  preview: string
  senderName: string
  createdAt: string
}

interface SessionPageProps {
  params: Promise<{ id: string }>
}

export default function SessionPage({ params }: SessionPageProps) {
  const [sessionId, setSessionId] = useState<string>("")
  const [recipientName, setRecipientName] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unwrapParams = async () => {
      const { id } = await params
      setSessionId(id)
      // Mock data - replace with actual API call
      setRecipientName("Alex")
      setMessages([
        {
          id: "1",
          preview: "I've always wanted to tell you how much you mean to me...",
          senderName: "Jordan",
          createdAt: "2 days ago",
        },
        {
          id: "2",
          preview: "Remember that time we laughed until we couldn't breathe?",
          senderName: "Casey",
          createdAt: "1 week ago",
        },
        {
          id: "3",
          preview: "You inspire me more than you'll ever know...",
          senderName: "Morgan",
          createdAt: "2 weeks ago",
        },
      ])
      setLoading(false)
    }
    unwrapParams()
  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-muted px-8 py-6">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out mb-4 inline-block"
        >
          ← Back
        </Link>
        <h1 className="font-caveat text-5xl font-bold text-foreground">Letters for {recipientName}</h1>
        <p className="text-muted-foreground mt-2">{messages.length} letters received</p>
      </header>

      {/* Messages Grid */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        {messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {messages.map((message) => (
              <MessageCard
                key={message.id}
                id={message.id}
                preview={message.preview}
                senderName={message.senderName}
                createdAt={message.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-6">No letters yet. Be the first to write one!</p>
          </div>
        )}

        {/* Write Letter Button */}
        <div className="flex justify-center">
          <Link
            href={`/write/${sessionId}`}
            className="px-8 py-3 bg-foreground text-primary-foreground rounded-2xl font-medium hover:shadow-lg transition-all duration-300 ease-out shadow-sm"
          >
            Write a Letter
          </Link>
        </div>
      </main>
    </div>
  )
}
