"use client"

import type React from "react"
import Link from "next/link"
import { useState, useEffect, use } from "react"; // 1. Impor 'use' dari React
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from 'next/navigation';

interface WritePageProps {
  // params adalah Promise
  params: Promise<{ id: string }>
}

export default function WritePage({ params }: WritePageProps) {
  // 2. Gunakan React.use() untuk mendapatkan nilai 'id'
  const { id: resolvedId } = use(params);

  const router = useRouter();
  const [sessionId, setSessionId] = useState<string>("")
  const [senderName, setSenderName] = useState<string>("")
  const [message, setMessage] = useState<string>("")
  const [spotifyUrl, setSpotifyUrl] = useState<string>("")
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   
    if (resolvedId) {
        setSessionId(resolvedId);
        const checkSession = async () => {
            const { data, error } = await supabase
                .from('sessions')
                .select('session_id')
                .eq('session_id', resolvedId) 
                .single();
            if (error || !data) {
                setError("Session ID tidak valid.");
            }
        };
        checkSession();
    } else {
        setError("Session ID tidak ditemukan di URL.");
    }

  }, [resolvedId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error && error.includes("tidak valid")) return;
    if (!sessionId) { 
        setError("Session ID belum siap. Mohon tunggu sebentar.");
        return;
    }


    setLoading(true);
    setError(null);

    try {
        const { error: insertError } = await supabase
        .from('messages')
        .insert([
            {
                session_id: sessionId, 
                sender_name: senderName.trim() === '' ? 'Anonymous' : senderName.trim(),
                message: message.trim(),
                spotify_url: spotifyUrl.trim() === '' ? null : spotifyUrl.trim()
            }
        ]);

        if (insertError) throw insertError;

        setLoading(false)
        setSubmitted(true)

        setTimeout(() => {
            router.push(`/session/${sessionId}`); 
        }, 2000);

    } catch (err: any) {
        console.error("Error submitting message:", err);
        setError(err.message || "Gagal mengirim surat.");
        setLoading(false);
    }
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

   // Tampilkan error jika ada sebelum form
   if (error && (error.includes("tidak valid") || error.includes("tidak ditemukan"))) {
      return (
      <div className="min-h-screen bg-white flex items-center justify-center text-center">
          <div>
              <p className="text-destructive text-xl mb-4">{error}</p>
              <Link href="/" className="text-foreground hover:text-muted-foreground transition-all duration-300 ease-out">
              ← Kembali ke Beranda
              </Link>
          </div>
      </div>
      )
  }


  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-muted px-8 py-6">
        <Link
          href={sessionId ? `/session/${sessionId}` : '/'}
          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out mb-4 inline-block"
        >
           Back to home
        </Link>
        <h1 className="font-caveat text-5xl font-bold text-center text-foreground">Write Your Letter</h1>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tampilkan pesan error di form */}
          {error && !error.includes("tidak valid") && !error.includes("tidak ditemukan") && (
            <div className="p-4 bg-destructive/10 text-destructive border border-destructive rounded-lg">
                {error}
            </div>
          )}
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
              disabled={loading || !!(error && (error.includes("tidak valid") || error.includes("tidak ditemukan")))}
              className="flex-1 px-8 py-3 bg-foreground text-primary-foreground rounded-2xl font-medium hover:shadow-lg transition-all duration-300 ease-out shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Letter"}
            </button>
            <Link
              href={sessionId ? `/session/${sessionId}` : '/'} 
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