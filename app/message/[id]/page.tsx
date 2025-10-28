"use client"

import Link from "next/link"
import { SpotifyEmbed } from "@/components/spotify-embed"
import { useState, useEffect } from "react"

interface MessageDetailPageProps {
  params: Promise<{ id: string }>
}

interface MessageData {
  id: string
  content: string
  senderName: string
  spotifyUrl: string
  createdAt: string
  sessionId: string
}

export default function MessageDetailPage({ params }: MessageDetailPageProps) {
  const [messageId, setMessageId] = useState<string>("")
  const [message, setMessage] = useState<MessageData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unwrapParams = async () => {
      const { id } = await params
      setMessageId(id)
      // Mock data - replace with actual API call
      setMessage({
        id: id,
        content:
          "I've always wanted to tell you how much you mean to me. Through all the ups and downs, you've been there. Your kindness, your laughter, your presence—they've shaped who I am today. I hope you know that you're loved more than words can express.",
        senderName: "Jordan",
        spotifyUrl: "https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp",
        createdAt: "2 days ago",
        sessionId: "alex-session",
      })
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

  if (!message) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Letter not found</p>
          <Link href="/" className="text-foreground hover:text-muted-foreground transition-all duration-300 ease-out">
            ← Back to home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-muted px-8 py-6">
        <Link
          href={`/session/${message.sessionId}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out mb-4 inline-block"
        >
          ← Back to letters
        </Link>
      </header>

      {/* Message Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-20">
        <div className="max-w-2xl w-full">
          {/* Message Text */}
          <div className="mb-12 text-center">
            <p className="font-caveat text-4xl md:text-5xl text-foreground leading-relaxed text-balance whitespace-pre-wrap">
              {message.content}
            </p>
          </div>

          {/* Sender Info */}
          <div className="text-center mb-12 pb-8 border-b border-muted">
            <p className="text-sm text-muted-foreground">
              from <span className="font-medium text-foreground">{message.senderName}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">{message.createdAt}</p>
          </div>

          {/* Spotify Embed */}
          {message.spotifyUrl && (
            <div className="mb-8">
              <p className="text-sm text-muted-foreground text-center mb-6">Listen to the song</p>
              <SpotifyEmbed trackUrl={message.spotifyUrl} />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-muted px-8 py-6 text-center">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out"
        >
          Share your own letter
        </Link>
      </footer>
    </div>
  )
}
