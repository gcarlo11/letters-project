"use client"

import Link from "next/link"
import { MessageCard } from "@/components/message-card"
import { useState, useEffect, use } from "react"; // 1. Impor 'use' dari React
import { supabase } from "@/lib/supabaseClient";

interface Message {
  id: string
  message: string
  sender_name: string
  created_at: string
}

interface SessionPageProps {
  // params sekarang adalah Promise yang resolve ke object { id: string }
  params: Promise<{ id: string }>
}

export default function SessionPage({ params }: SessionPageProps) {
  // 2. Gunakan React.use() untuk mendapatkan nilai 'id' dari Promise params
  const { id: resolvedId } = use(params);

  const [sessionId, setSessionId] = useState<string>("")
  const [recipientName, setRecipientName] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 3. Gunakan 'resolvedId' yang sudah diekstrak
    if (!resolvedId) {
        setLoading(false);
        setError("Session ID tidak ditemukan.");
        return;
    }

    const sessionIdParam = resolvedId; // Gunakan ID yang sudah di-resolve
    setSessionId(sessionIdParam);

    const fetchSessionData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data: sessionData, error: sessionError } = await supabase
          .from('sessions')
          .select('name')
          .eq('session_id', sessionIdParam)
          .single();

        if (sessionError) throw sessionError;
        if (!sessionData) throw new Error("Sesi tidak ditemukan.");

        setRecipientName(sessionData.name);

        const { data: messagesData, error: messagesError } = await supabase
          .from('messages')
          .select('id, message, sender_name, created_at')
          .eq('session_id', sessionIdParam)
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        // Map data (opsional formatting)
        const formattedMessages = messagesData.map(msg => ({
            ...msg,
            preview: msg.message.substring(0, 100) + (msg.message.length > 100 ? "..." : ""),
            createdAt: new Date(msg.created_at).toLocaleDateString('id-ID', {
                day: 'numeric', month: 'long', year: 'numeric'
            })
        }));


        setMessages(formattedMessages);

      } catch (err: any) {
        console.error("Error fetching session data:", err);
        setError(err.message || "Gagal memuat data sesi.");
        setRecipientName("");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSessionData();

  // 4. Gunakan 'resolvedId' di dependency array
  }, [resolvedId]);

  // ... sisa kode komponen (if loading, if error, return JSX) ...
  // Pastikan Anda menggunakan 'sessionId' state atau 'resolvedId' di JSX jika diperlukan
    if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  // Tampilkan pesan error jika ada
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-center">
        <div>
            <p className="text-destructive mb-4">{error}</p>
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
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out mb-4 inline-block"
        >
          ← Back
        </Link>
        <h1 className="font-caveat text-5xl font-bold text-foreground">Letters for {recipientName}</h1>
        <p className="text-muted-foreground mt-2">{messages.length} {messages.length === 1 ? "letter" : "letters"} received</p>
      </header>

      {/* Messages Grid */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        {messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {messages.map((message) => (
              <MessageCard
                key={message.id}
                id={message.id}
                preview={message.message.substring(0, 70) + '...'} // Generate preview
                senderName={message.sender_name} // Gunakan sender_name
                createdAt={new Date(message.created_at).toLocaleDateString()} // Format tanggal jika perlu
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
           {/* Gunakan resolvedId atau sessionId state di sini */}
          <Link
            href={`/write/${resolvedId}`}
            className="px-8 py-3 bg-foreground text-primary-foreground rounded-2xl font-medium hover:shadow-lg transition-all duration-300 ease-out shadow-sm"
          >
            Write a Letter
          </Link>
        </div>
      </main>
    </div>
  )

}