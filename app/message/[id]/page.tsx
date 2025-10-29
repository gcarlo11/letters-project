"use client"

import Link from "next/link"
import { SpotifyEmbed } from "@/components/spotify-embed"
import { useState, useEffect, use } from "react"; 
import { supabase } from "@/lib/supabaseClient";

interface MessageDetailPageProps {
  
  params: Promise<{ id: string }>
}

interface MessageData {
  id: string
  message: string
  sender_name: string
  spotify_url: string | null
  created_at: string
  session_id: string
}

export default function MessageDetailPage({ params }: MessageDetailPageProps) {
  
  const { id: resolvedId } = use(params);

  const [messageId, setMessageId] = useState<string>("")
  const [message, setMessage] = useState<MessageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    
    if (!resolvedId) {
        setLoading(false);
        setError("Message ID tidak ditemukan.");
        return;
    }
    const messageIdParam = resolvedId; 
    setMessageId(messageIdParam); 

    const fetchMessage = async () => {
        setLoading(true);
        setError(null);

        try {
            const { data, error: fetchError } = await supabase
              .from('messages')
              .select('*')
              .eq('id', messageIdParam) 
              .single();

            if (fetchError) throw fetchError;
            if (!data) throw new Error("Surat tidak ditemukan.");

            setMessage(data);
        } catch (err: any) {
            console.error("Error fetching message:", err);
            setError(err.message || "Gagal memuat surat.");
            setMessage(null);
        } finally {
            setLoading(false);
        }
    }

    fetchMessage();

  
  }, [resolvedId]);

  
    if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error) {
     return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Link href="/" className="text-foreground hover:text-muted-foreground transition-all duration-300 ease-out">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  if (!message) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Surat tidak ditemukan.</p>
          <Link href="/" className="text-foreground hover:text-muted-foreground transition-all duration-300 ease-out">
            ← Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  const formattedDate = new Date(message.created_at).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="border-b border-muted px-8 py-6">
        <Link
          href={`/session/${message.session_id}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out mb-4 inline-block"
        >
           Back to letters
        </Link>
      </header>

      {/* Message Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-8 py-20">
        <div className="max-w-2xl w-full">
          {/* Message Text */}
          <div className="mb-12 text-center">
            <p className="font-caveat text-4xl md:text-5xl text-foreground leading-relaxed text-balance whitespace-pre-wrap">
              {message.message}
            </p>
          </div>

          {/* Sender Info */}
          <div className="text-center mb-12 pb-8 border-b border-muted">
            <p className="text-sm text-muted-foreground">
              from <span className="font-medium text-foreground">{message.sender_name || 'Anonymous'}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">{formattedDate}</p>
          </div>

          {/* Spotify Embed */}
          {message.spotify_url && (
            <div className="mb-8">
              <p className="text-sm text-muted-foreground text-center mb-6">Listen to the song</p>
              <SpotifyEmbed trackUrl={message.spotify_url} />
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