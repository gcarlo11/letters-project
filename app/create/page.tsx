"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"; 
import { useRouter } from 'next/navigation'; 

export default function CreateSessionPage() {
  const router = useRouter();
  const [recipientName, setRecipientName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  
  const generateSessionId = (name: string): string => {
    const sanitizedName = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);
    const randomSuffix = Math.random().toString(36).substring(2, 8); 
    return `${sanitizedName}-${randomSuffix}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) {
      setError("Nama penerima tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setError(null);

    const newSessionId = generateSessionId(recipientName);

    try {
      
      const { data, error: insertError } = await supabase
        .from('sessions')
        .insert({
          name: recipientName.trim(),
          session_id: newSessionId
          
        })
        .select('session_id') 
        .single(); 

      if (insertError) {
        
        if (insertError.code === '23505') { 
          setError("Gagal membuat sesi, ID sesi sudah ada. Coba lagi.");
          
        } else {
          throw insertError; 
        }
      } else if (data) {
        
        router.push(`/session/${data.session_id}`);
      } else {
         
         throw new Error("Gagal membuat sesi, tidak ada data yang dikembalikan.");
      }

    } catch (err: any) {
      console.error("Error creating session:", err);
      setError(err.message || "Gagal membuat halaman sesi.");
      setLoading(false); 
    }
    
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-muted px-8 py-6">
        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground transition-all duration-300 ease-out mb-4 inline-block"
        >
         Back to Home
        </Link>
        <h1 className="font-caveat text-5xl font-bold text-foreground">Create a Letter Page</h1>
        <p className="text-muted-foreground mt-2">Enter the name of the person you want to receive letters.</p>
      </header>

      {/* Form */}
      <main className="max-w-xl mx-auto px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive border border-destructive rounded-lg text-sm">
                {error}
            </div>
          )}
          <div>
            <label htmlFor="recipientName" className="block text-sm font-medium text-foreground mb-2">
              Recipient's Name
            </label>
            <input
              id="recipientName"
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Enter name..."
              className="w-full px-4 py-3 bg-secondary border border-muted rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-foreground transition-all duration-300 ease-out"
              required
            />
             <p className="text-xs text-muted-foreground mt-2">This name will be displayed on the letter page.</p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-foreground text-primary-foreground rounded-2xl font-medium hover:shadow-lg transition-all duration-300 ease-out shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Page"}
            </button>
          </div>
        </form>
      </main>

       {/* Footer */}
       <footer className="px-8 py-8 border-t border-muted text-center text-sm text-muted-foreground mt-auto">
        <p>Made with care. Share your unsent words.</p>
      </footer>
    </div>
  );
}