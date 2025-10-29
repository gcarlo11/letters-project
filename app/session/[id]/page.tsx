"use client"

import Link from "next/link"
import { MessageCard } from "@/components/message-card"
import { useState, useEffect, use } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button"; 
import { ClipboardCopyIcon } from 'lucide-react'; 

interface Message {
  id: string
  message: string
  sender_name: string
  created_at: string
  
  preview?: string; 
  createdAt?: string; 
}

interface SessionPageProps {
  params: Promise<{ id: string }>
}

export default function SessionPage({ params }: SessionPageProps) {
  const { id: resolvedId } = use(params);

  const [sessionId, setSessionId] = useState<string>("")
  const [recipientName, setRecipientName] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null);
  const [copyStatus, setCopyStatus] = useState<string>("Copy Address"); 

  
  const handleCopyLink = () => {
    const currentUrl = window.location.href; 
    navigator.clipboard.writeText(currentUrl)
      .then(() => {
        setCopyStatus("Copied!"); 
        setTimeout(() => setCopyStatus("Copy Address"), 2000); 
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
        setCopyStatus("Failed!"); 
        setTimeout(() => setCopyStatus("Copy Address"), 2000);
      });
  };

  useEffect(() => {
    if (!resolvedId) {
        setLoading(false);
        setError("Session ID tidak ditemukan.");
        return;
    }

    const sessionIdParam = resolvedId;
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

         const formattedMessages = messagesData.map(msg => ({
            id: msg.id,
            message: msg.message,
            sender_name: msg.sender_name,
            created_at: msg.created_at, 
            preview: msg.message.substring(0, 70) + '...',
            createdAt: new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) 
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

      <header className="border-b border-muted px-8 py-6">

        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out mb-4 inline-block"
        >
          ← Back
        </Link>
        <p className="text-muted-foreground my-2 font-poppins font-light text-sm text-center">
          Share this address to receive anonymous letters.
        </p>

        <div className="flex items-center gap-4 mb-1 justify-center"> 
          <h1 className="font-caveat text-5xl font-bold text-foreground ">
            Letters for {recipientName}
          </h1>
          <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="flex border-neutral-400 rounded-sm mt-2 ml- gap-2" 
              disabled={copyStatus !== "Copy Address"}
          >
              <ClipboardCopyIcon className="h-4 w-4" />
              {copyStatus}
          </Button>
        </div>
        {/* Paragraf jumlah surat di bawahnya */}

        <p className="font-poppins font-light text-sm text-muted-foreground mt-2 text-center">{messages.length} {messages.length === 1 ? "letter" : "letters"} received</p>
      </header>

      {/* Messages Grid */}
      <main className="max-w-4xl mx-auto px-8 py-12">
        {messages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {messages.map((message) => (
              <MessageCard
                key={message.id}
                id={message.id}
                
                preview={message.preview || message.message.substring(0, 70) + '...'} 
                senderName={message.sender_name}
                createdAt={message.createdAt || new Date(message.created_at).toLocaleDateString()} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-poppins text-muted-foreground mb-6">No letters yet. Be the first to write one!</p>
          </div>
        )}

        {/* Write Letter Button */}
        <div className="flex justify-center">
          <Link
            href={`/write/${sessionId}`}
            className=" font-poppins px-8 py-3 bg-foreground text-primary-foreground rounded-sm hover:shadow-lg transition-all duration-300 ease-out shadow-sm"
          >
            Write a Letter
          </Link>
        </div>
      </main>
    </div>
  )
}