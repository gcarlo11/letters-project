"use client"

import type React from "react"

import Link from "next/link"
import { useState, useEffect } from "react"

interface WritePageProps {
  params: Promise<{ id: string }>
}

export default function WritePage({ params }: WritePageProps) {
  const [sessionId, setSessionId] = useState<string>("")
  const [senderName, setSenderName] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [spotifyUrl, setSpotifyUrl] = useState<string>("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const unwrapParams = async () => {
      const { id } = await params
      setSessionId(id)
    }
    unwrapParams()
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      // Reset form
      setSenderName("")
      setMessage("")
      setSpotifyUrl("")
      // Show success message for 3 seconds then redirect
      setTimeout(() => {
        window.location.href = `/session/${sessionId}`
      }, 2000)
    }, 1000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="font-caveat text-4xl text-foreground mb-4">Letter sent successfully!</p>
          <p className="text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-muted px-8 py-6">
        <Link
          href={`/session/${sessionId}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out mb-4 inline-block"
        >
          ← Back
        </Link>
        <h1 className="font-caveat text-5xl font-bold text-foreground">Write Your Letter</h1>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Sender Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Your name
            </label>
            <input
              id="name"
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="Enter your name (or stay anonymous)"
              className="w-full px-4 py-3 bg-secondary border border-muted rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all duration-300 ease-out"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
              Your message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your heartfelt message here..."
              rows={10}
              className="w-full px-4 py-3 bg-secondary border border-muted rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all duration-300 ease-out font-caveat text-lg leading-relaxed resize-none"
              required
            />
          </div>

          {/* Spotify URL */}
          <div>
            <label htmlFor="spotify" className="block text-sm font-medium text-foreground mb-2">
              Spotify track link
            </label>
            <input
              id="spotify"
              type="url"
              value={spotifyUrl}
              onChange={(e) => setSpotifyUrl(e.target.value)}
              placeholder="https://open.spotify.com/track/..."
              className="w-full px-4 py-3 bg-secondary border border-muted rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all duration-300 ease-out"
            />
            <p className="text-xs text-muted-foreground mt-2">Optional: Share a song that matches your feelings</p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-8 py-3 bg-foreground text-primary-foreground rounded-2xl font-medium hover:shadow-lg transition-all duration-300 ease-out shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Letter"}
            </button>
            <Link
              href={`/session/${sessionId}`}
              className="px-8 py-3 border-2 border-foreground text-foreground rounded-2xl font-medium hover:bg-secondary transition-all duration-300 ease-out"
            >
              Cancel
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
